import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { findGame, Game, Player, Status } from "../game";

export enum Team {
  CREATOR = 1,
  CHALLENGER = 2,
}

type ResponseData = {
  msg: string;
  state: Status | undefined;
  team: Team | undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Init vars
  const { id } = req.query;
  const cookies = new Cookies(req, res);
  const game: Game | null = await findGame(id as string);
  if (!game)
    return res.json({
      msg: "This game does not exist!",
      state: undefined,
      team: undefined,
    });

  let player: Player | null = null;
  if (cookies.get(`game${id}_uuid`) == game.creator.id) player = game.creator;
  else if (cookies.get(`game${id}_uuid_join`) == game.challenger?.id)
    player = game.challenger!;
  if (player === null)
    return res.json({
      msg: "What are you doing?",
      state: undefined,
      team: undefined,
    });

  const data = req.body != '' ? JSON.parse(req.body) : null;
  console.log(data);

  res.json({ msg: "Great!", state: Status.RUNNING, team: player.team });

}
