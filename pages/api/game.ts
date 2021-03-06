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
  TURN = 1,
  WAITING = 2,
  PENDING = 3,
}

export interface Game {
  id: string;
  creator: Player;
  challenger?: Player;
  board: Board;
}

export class Board {
  lines: any;
  boxes: any;
  constructor() {
    const l = new Map<String, number>;
    const b = new Map<String, number>;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        b.set(`${r * 10 + c}`, 0)
        l.set(`${r * 10 + c},0`, 0);
        l.set(`${r * 10 + c},1`, 0);
      }
    }
    this.lines = Object.fromEntries(l);
    this.boxes = Object.fromEntries(b);
  }
}

export interface Player {
  id: string;
  update: boolean;
  status: Status
  points: number;
  team: Team;
}

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
  if (!(await getAsync(`game${game.id}`))) return -1;
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
