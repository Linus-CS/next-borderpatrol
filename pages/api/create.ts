import Cookies from "cookies";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAsync, setAsync } from "../../lib/redis";
import { addGame, Game, Status } from "./game";
import { Team } from "./game/[id]";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500kb",
    },
  },
};

type ResponseData = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  let gameID = await getAsync("gameID");
  if (gameID == null) gameID = 0;

  const cookies = new Cookies(req, res);

  const uuid = randomUUID();
  createGame(gameID, uuid);
  cookies.set(`game${gameID}_uuid`, uuid);

  res.writeHead(307, {
    Location: `/game/${gameID}`,
  });
  await setAsync("gameID", gameID + 1);
  res.end();
}

async function createGame(id: string, creatorID: string) {
  const game: Game = {
    id: id,
    creator: { id: creatorID, points: 0, team: Team.CREATOR },
    status: Status.WAITING,
    moves: [],
  };
  await addGame(game);
}
