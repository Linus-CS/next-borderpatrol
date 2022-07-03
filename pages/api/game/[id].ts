// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { randomUUID } from 'crypto'
import Cookies from 'cookies';

type ResponseData = {
    status: string;
}

export enum Status {
    ERROR = 0,
    PENDING = 1,
    RUNNING = 2
}

interface Game {
    id: string;
    creator: Player;
    challenger?: Player;
    status: Status;
    moves: Move[];
}

interface Player {
    id: string;
    points: number;
}

interface Move {

}

interface Action {

}

const open_games: Game[] = [];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    // Join game if exists otherwise create new game
    const { id } = req.query;
    const cookies = new Cookies(req, res)
    let game: Game | undefined = open_games.find(game => game.id == id);
    if (game === undefined) {
        const uuid = randomUUID();
        cookies.set("uuid", uuid);
        createGame(id as string, uuid);
        res.json({ status: 'created' });
        res.end();
        return;
    } else if (game.status === Status.PENDING) {
        const uuid = randomUUID();
        cookies.set("uuid", uuid);
        joinGame(game, uuid);
        res.json({ status: 'joined' });
        res.end();
        return;
    }
    let action;
    if (req.body != '')
        action = JSON.parse(req.body) as Action;



}

function createGame(id: string, creatorID: string) {
    const game: Game = { id: id, creator: { id: creatorID, points: 0 }, status: Status.PENDING, moves: [] }
    open_games.push(game);
}

function joinGame(game: Game, challengerID: string) {
    game.challenger = { id: challengerID, points: 0 };
    game.status = Status.RUNNING;
}


function deleteGame(id: string) {
    const gameID = open_games.findIndex(game => {
        return game.id = id;
    })
    open_games.splice(gameID, 1);
}

export function getGames() {
    const pending = [];
    for (const game of open_games) {
        if (game.status === Status.PENDING)
            pending.push(game.id);
    }
    return pending;
}
