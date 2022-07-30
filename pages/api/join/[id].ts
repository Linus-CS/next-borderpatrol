import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import Cookies from "cookies";
import { findGame, Game, replaceGame, Status } from "../game";
import { getAsync, setAsync } from "../../../lib/redis";
import { Team } from "../game/[id]";

type ResponseData = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const id = req.query["id"] as string;
  const cookies = new Cookies(req, res);

  const game: Game | null = await findGame(id);
  if (!game) {
    return res.json({ msg: "Game does not exist." });
  } else if (!game.challenger) {
    const uuid = randomUUID();
    await joinGame(game, uuid);
    cookies.set(`game${id}_uuid_join`, uuid);
    res.writeHead(307, {
      Location: `/game/${id}`,
    });
    res.end();
  } else {
    return res.json({ msg: "Stop that!" });
  }
}

async function joinGame(game: Game, challengerID: string) {
  game.challenger = { id: challengerID, points: 0, team: Team.CHALLENGER, status: Status.PENDING, update: true };
  game.creator.status = Status.TURN;
  game.creator.update = true;
  const games = await getAsync("games");
  const index = games.indexOf(game.id);
  if (index !== -1) games.splice(index, 1);
  await setAsync("games", games);
  await replaceGame(game);
}
