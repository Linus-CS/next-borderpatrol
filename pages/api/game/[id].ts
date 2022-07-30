import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { Board, findGame, Game, Player, replaceGame, Status } from "../game";
import { IncomingMessage, ServerResponse } from "http";

export enum Team {
  CREATOR = 1,
  CHALLENGER = 2,
}

export type RegularRespone = {
  msg: string;
  status: Status;
  team: Team;
  board: Board;
};

type IrregularRespone = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegularRespone | IrregularRespone>
) {
  const id = req.query["id"] as string;
  const game: Game | null = await findGame(id);
  if (game === null)
    return res.json({
      msg: "This game does not exist!",
    });
  let player: Player | null = determinePlayer(req, res, game, id);
  if (player === null)
    return res.json({
      msg: "What are you doing?",
    });

  const data = req.body != "" ? JSON.parse(req.body) : null;
  let result;
  if (data)
    result = await handleData(data, game, player);

  if (result)
    res.json({
      msg: "Successfully set line!",
      status: Status.PENDING,
      team: player.team,
      board: game.board,
    });
  else
    res.json({
      msg: "Here is your data.",
      status: player.status,
      team: player.team,
      board: game.board,
    });
}

async function handleData(
  data: { row: number; column: number; orientation: any },
  game: Game,
  player: Player
) {
  if (player.status === Status.TURN && game.board.lines[`${data.row * 10 + data.column},${data.orientation}`] === 0) {
    game.board.lines[`${data.row * 10 + data.column},${data.orientation}`] = player.team;
    await replaceGame(game);
    return true;
  }
  return false;
}

function determinePlayer(
  req: IncomingMessage,
  res: ServerResponse,
  game: Game,
  id: string
) {
  const cookies = new Cookies(req, res);
  if (cookies.get(`game${id}_uuid`) === game.creator.id) return game.creator;
  else if (cookies.get(`game${id}_uuid_join`) === game.challenger?.id)
    return game.challenger!;
  return null;
}
