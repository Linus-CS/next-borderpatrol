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
  // Init vars
  const { id } = req.query;
  const cookies = new Cookies(req, res);

  const game: Game | null = await findGame(id as string);
  if (!game) {
    res.json({ msg: "Game does not exist." });
  } else if (game.status == Status.WAITING) {
    const uuid = randomUUID();
    await joinGame(game, uuid);
    cookies.set(`game${id}_uuid_join`, uuid);
    res.writeHead(307, {
      Location: `/game/${id}`,
    });
    res.end();
  }
}

async function joinGame(game: Game, challengerID: string) {
  game.challenger = { id: challengerID, points: 0, team: Team.CHALLENGER };
  game.status = Status.RUNNING;
  const games = await getAsync("games");
  const index = games.indexOf(game.id);
  if (index !== -1) games.splice(index, 1);
  await setAsync("games", games);
  await replaceGame(game);
}
