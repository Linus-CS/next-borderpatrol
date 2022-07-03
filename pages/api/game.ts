import type { NextApiRequest, NextApiResponse } from 'next'
import { getGames, Status } from './game/[id]'

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '500kb',
        },
    },
}

type CreateResponse = {
    gameState: Status
}

type ListResponse = {
    games: string[]
}

let gameID = 0;

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<CreateResponse | ListResponse>
) {
    if (req.body != '' && 'getGames' in JSON.parse(req.body)) {
        res.json({ games: getGames() });
        res.end();
        return;
    }
    res.writeHead(301, {
        Location: `/game/${gameID++}`
    });
    console.log(gameID);
    res.end();
}
