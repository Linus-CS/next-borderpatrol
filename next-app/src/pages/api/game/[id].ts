import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { Board, findGame, Game, Player, replaceGame, Status } from "../game";
import { IncomingMessage, ServerResponse } from "http";
import { getClient } from "../../../lib/redis";

export enum Team {
  CREATOR = 1,
  CHALLENGER = 2,
}

export type RegularRespone = {
  msg: string;
  status: Status;
  points: number;
  team: Team;
  board: Board;
  winner?: number;
  lastLine?: any;
};

type IrregularRespone = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegularRespone | IrregularRespone>
) {
  const client = await getClient();
  const id = req.query["id"] as string;
  const game: Game | null = await findGame(client, id);

  if (game === null)
    return res.json({
      msg: "This game does not exist!",
    });

  let [player, opponent] = determinePlayer(req, res, game, id) as Player[];

  if (player === null)
    return res.json({
      msg: "What are you doing?",
    });

  const data = req.body != "" ? JSON.parse(req.body) : {};

  if (data.msg === "set") {
    await handleData(data, game, player, opponent);
    respond(res, player, game.board, "Here you go, have some data!", game.winner);
  } else if (data.msg == "retrieve" || player.update) {
    player.update = false;
    respond(res, player, game.board, player.status === Status.TURN ? "Your turn!" : "Here you go, have some data!", game.winner, game.lastLine);
  } else {
    res.json({ msg: "pong!" })
  }

  // Update DB
  await replaceGame(client, game);
  await client.quit();
}

async function handleData(
  data: any,
  game: Game,
  player: Player,
  opponent: Player
) {
  const lineKey = utilLine(data.row, data.column, data.orientation);
  if (
    player.status === Status.TURN &&
    game.board.lines[lineKey] === 0
  ) {
    game.board.lines[lineKey] = player.team;
    if (!checkBoxes(data, game.board.lines, game.board.boxes, player)) {
      player.status = Status.PENDING;
      opponent.status = Status.TURN;
      game.lastLine = data;
    }
    if (player.points > 50 && game.winner === undefined)
      game.winner = player.team;
    if (opponent.points > 50 && game.winner === undefined)
      game.winner = opponent.team;
    if (player.points == 50 && opponent.points == 50)
      game.winner = 3;
    player.update = false;
    opponent.update = true;
  }
}

function determinePlayer(
  req: IncomingMessage,
  res: ServerResponse,
  game: Game,
  id: string
) {
  const cookies = new Cookies(req, res);
  if (cookies.get(`game${id}_uuid`) === game.creator.id) return [game.creator, game.challenger!];
  else if (cookies.get(`game${id}_uuid_join`) === game.challenger?.id)
    return [game.challenger!, game.creator];
  return [null, null];
}

function respond(res: NextApiResponse<RegularRespone>, player: Player, board: Board, msg: string, winner?: Team, lastLine?: any) {
  res.json({
    msg: msg,
    status: player.status,
    points: player.points,
    team: player.team,
    board: board,
    winner: winner,
    lastLine: lastLine
  });
}

const checkMatrixZeroUp = [[-1, 0, 0], [0, 0, 1], [0, -1, 1]];
const checkMatrixZeroDown = [[1, 0, 0], [1, -1, 1], [1, 0, 1]];
const checkMatrixOneRight = [[0, 1, 1], [0, 1, 0], [-1, 1, 0]];
const checkMatrixOneLeft = [[0, 0, 0], [0, -1, 1], [-1, 0, 0]];

function checkBoxes(data: any, lines: any, boxes: any, player: Player) {
  let checked = false;
  if (data.orientation === 0 && checkBox(checkMatrixZeroUp, lines, data.row, data.column)) {
    boxes[`${data.row * 10 + data.column}`] = player.team;
    player.points++;
    checked = true;
  }
  if (data.orientation === 0 && checkBox(checkMatrixZeroDown, lines, data.row, data.column)) {
    boxes[`${(data.row + 1) * 10 + data.column}`] = player.team;
    player.points++;
    checked = true;
  }
  if (data.orientation === 1 && checkBox(checkMatrixOneRight, lines, data.row, data.column)) {
    boxes[`${data.row * 10 + data.column + 1}`] = player.team;
    player.points++;
    checked = true;
  }
  if (data.orientation === 1 && checkBox(checkMatrixOneLeft, lines, data.row, data.column)) {
    boxes[`${data.row * 10 + data.column}`] = player.team;
    player.points++;
    checked = true;
  }
  return checked;
}

function checkBox(matrix: any[], lines: any, row: any, column: any) {
  for (let i = 0; i < 3; i++) {
    const M = matrix[i];
    if (lines[utilLine(row + M[0], column + M[1], M[2])] === 0) return false;
  }
  return true;
}

function utilLine(row: number, column: number, orientation: number) {
  return `${row * 10 + column},${orientation}`
}
