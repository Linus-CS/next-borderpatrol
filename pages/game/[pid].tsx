import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Circles } from "react-loader-spinner";
import Box from "../../components/Box";
import Line from "../../components/Line";
import styles from "../../styles/Home.module.css";
import { RegularRespone } from "../api/game/[id]";

const msgMappings = [
  "Something went wrong",
  "Your Turn",
  "Waiting for opponent to join",
  "Waiting for opponent to make a move",
];

const Game: NextPage = (props: any) => {
  const router = useRouter();
  const { pid } = router.query;
  const [gameState, setGameState] = useState<RegularRespone | null>(null);
  let [check, setCheck] = useState(0);

  function requestGameState(data?: any) {
    fetch(`/api/game/${pid}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.msg);
        if ("status" in data) {
          setGameState(data);
        }
      });
  }

  useEffect(() => {
    if (pid && gameState === null) {
      requestGameState({ msg: "retrieve" });
    }
    const timer = setInterval(() => {
      if (gameState?.status === 2 || gameState?.status === 3) {
        requestGameState({ msg: "ping" });
      }
      setCheck(check + 1);
    }, 1000);

    // clearing interval when component unmounts
    return () => clearInterval(timer);
  }, [check]);

  let grid = [];
  if (gameState) {
    const onLineClick = (row: number, column: number, orientation: number) => {
      requestGameState({
        msg: "set",
        row: row,
        column: column,
        orientation: orientation,
      });
    };

    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 10; column++) {
        const key = row * 10 + column;
        grid.push(
          <Box key={key} state={gameState.board.boxes[`${key}`]}>
            <Line
              key={`${key},1`}
              row={row}
              column={column}
              orientation={1}
              active={gameState.status === 1}
              state={gameState.board.lines[`${key},1`]}
              team={gameState.team}
              onClick={() => onLineClick(row, column, 1)}
            />
            <Line
              key={`${key},0`}
              row={row}
              column={column}
              orientation={0}
              active={gameState.status === 1}
              state={gameState.board.lines[`${key},0`]}
              team={gameState.team}
              onClick={() => onLineClick(row, column, 0)}
            />
          </Box>
        );
      }
    }
  }

  if (grid.length == 0)
    return (
      <div className={styles.main}>
        <Circles color="#0070f3" height={80} width={80} />
      </div>
    );

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
      <div className={styles.containerRectangle}>
        <div className={styles.containerSide}>
          <h1 className={styles.header}>
            <span>Border</span> Patrol
          </h1>
          <h4>Points: {gameState?.points}</h4>
          <h4>
            {msgMappings[gameState!.status]} {".".repeat(check % 3)}
          </h4>
        </div>

        <div className={styles.containerGrid}>{grid}</div>
      </div>
    </div>
  );
};
export default Game;
