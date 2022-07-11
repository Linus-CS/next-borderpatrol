import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Box from "../../components/Box";
import styles from "../../styles/Home.module.css";

const Game: NextPage = (props: any) => {
  const router = useRouter();
  const { pid } = router.query;
  const [gameState, setGameState] = useState({ msg: '', state: 0, team: 0 });

  useEffect(() => {
    if (pid)
      fetch(`/api/game/${pid}`)
        .then((res) => res.json())
        .then((data) => {
          setGameState(data);
        });
  }, [pid]);

  const grid = [];
  let row = 0;
  let column = -1;
  for (let i = 0; i < 100; i++) {
    row = i % 10;
    if (row == 0) column++;
    grid.push(<Box key={i} pid={pid} row={row} column={column} team={gameState.team} />);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Border Patrol</title>
        <meta
          name="description"
          content="Game where the winner closed most borders."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main} >
        <h1 className={styles.header}>
          <span>Border</span> Patrol
        </h1>
        <div className={styles.gridContainer}>{grid}</div>
      </div>
    </div>
  );
};

export default Game;
