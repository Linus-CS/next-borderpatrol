import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

const Game: NextPage = (props: any) => {
    const router = useRouter();
    const { pid } = router.query;
    const [gameState, setGameState] = useState(0);

    useEffect(() => {
        if (pid !== undefined)
            fetch(`/api/game/${pid}`)
                .then((value) => value.json())
                .then(data => console.log(data));
    })

    return (
        <>
        </>
    );
}

export default Game;