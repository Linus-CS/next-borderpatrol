import type { NextApiRequest, NextApiResponse } from "next";
import { getAsync, setAsync } from "../../lib/redis";
import { Team } from "./game/[id]";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "500kb",
    },
  },
};

export enum Status {
  ERROR = 0,
  PENDING = 1,
  RUNNING = 2,
}

export interface Game {
  id: string;
  creator: Player;
  challenger?: Player;
  status: Status;
  moves: Move[];
}

export interface Player {
  id: string;
  points: number;
  team: Team;
}

interface Move {}

interface Action {}

type ListResponse = {
  games: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListResponse>
) {
  res.json({ games: await getGames() });
}

export async function addGame(game: Game) {
  let games = await getAsync("games");
  if (games === null) games = [];
  if (!games.includes(game.id)) games.push(game.id);
  await setAsync(`game${game.id}`, game);
  await setAsync("games", games);
}

export async function replaceGame(game: Game) {
  let games = await getAsync("games");
  if (games === null) return -1;
  if (!games.includes(game.id)) return -1;
  await setAsync(`game${game.id}`, game);
}

export async function findGame(id: string) {
  const game = await getAsync(`game${id}`);
  if (game === null) return null;
  return game;
}

export async function getGames() {
  const games = await getAsync("games");
  if (games === null) return [];
  return games;
}
