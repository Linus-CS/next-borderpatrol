import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import Cookies from "cookies";
import { findGame, Game, replaceGame, Status } from "../game";
import { getAsync, getClient, setAsync } from "../../../lib/redis";
import { Team } from "../game/[id]";

type ResponseData = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const client = await getClient();
  const id = req.query["id"] as string;
  const cookies = new Cookies(req, res);

  const game: Game | null = await findGame(client, id);
  if (!game) {
    await client.quit();
    return res.json({ msg: "Game does not exist." });
  } else if (!game.challenger) {
    const uuid = randomUUID();
    await joinGame(client, game, uuid);
    cookies.set(`game${id}_uuid_join`, uuid);
    await client.quit();
    res.writeHead(307, {
      Location: `/game/${id}`,
    });
    res.end();
  } else {
    await client.quit();
    return res.json({ msg: "Stop that!" });
  }
}

async function joinGame(client, game: Game, challengerID: string) {
  game.challenger = { id: challengerID, points: 0, team: Team.CHALLENGER, status: Status.PENDING, update: true };
  game.creator.status = Status.TURN;
  game.creator.update = true;
  const games = await getAsync(client, "games");
  const index = games.indexOf(game.id);
  if (index !== -1) games.splice(index, 1);
  await setAsync(client, "games", games);
  await replaceGame(client, game);
}
