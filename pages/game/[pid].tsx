import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Box from "../../components/Box";
import styles from "../../styles/Home.module.css";

const Game: NextPage = (props: any) => {
  const router = useRouter();
  const { pid } = router.query;
  const [gameState, setGameState] = useState({ state: 0, team: 0 });

  useEffect(() => {
    if (pid !== undefined)
      fetch(`/api/game/${pid}`)
        .then((value) => value.json())
        .then((data) => {
          setGameState(data);
        });
  });

  const grid = [];
  let row = 0;
  let column = -1;
  for (let i = 0; i < 100; i++) {
    row = i % 10;
    if (row == 0) column++;
    console.log(gameState.team);
    grid.push(<Box key={i} row={row} column={column} team={gameState.team} />);
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
      <h1 className={styles.header}>
        <span>Border</span> Patrol
      </h1>
      <div className={styles.main}>
        <div className={styles.gridContainer}>{grid}</div>
      </div>
    </div>
  );
};

export default Game;
