import Cookies from "cookies";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAsync, getClient, setAsync } from "../../lib/redis";
import { addGame, Board, Game, Status } from "./game";
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
  const client = await getClient();
  let gameID = await getAsync(client, "gameID");
  if (gameID == null) gameID = 0;

  const cookies = new Cookies(req, res);

  const uuid = randomUUID();
  await createGame(client, gameID, uuid);
  cookies.set(`game${gameID}_uuid`, uuid);

  res.writeHead(307, {
    Location: `/game/${gameID}`,
  });
  await setAsync(client, "gameID", gameID + 1);
  await client.quit();
  res.end();
}

async function createGame(client, id: string, creatorID: string) {
  const game: Game = {
    id: id,
    creator: { id: creatorID, points: 0, team: Team.CREATOR, status: Status.WAITING, update: true },
    board: new Board(),
  };
  await addGame(client, game);
}
