import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import Box from "../../components/Box";
import Line from "../../components/Line";
import styles from "../../styles/Home.module.css";
import { RegularRespone } from "../api/game/[id]";

const Game: NextPage = (props: any) => {
  const router = useRouter();
  const { pid } = router.query;
  const [gameState, setGameState] = useState<RegularRespone | null>(null);
  const [grid, setGrid] = useState<any[]>([]);

  function requestGameState() {
    fetch(`/api/game/${pid}`)
      .then((res) => res.json())
      .then((data) => {
        if ("status" in data && JSON.stringify(data) !== JSON.stringify(gameState)) {
          setGameState(data);
          console.log(gameState);
        }
      });
  }

  useEffect(() => {
    if (pid) requestGameState();
  }, [pid])

  useEffect(() => {
    const timer = setInterval(() => {
      if (pid && (gameState?.status === 2 || gameState?.status === 3)) {
        requestGameState();
      }
    }, 1000);

    // clearing interval when component unmounts
    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    if (gameState) {
      const components = [];

      const onLineClick = (
        row: number,
        column: number,
        orientation: number
      ) => {
        fetch(`/api/game/${pid}`, {
          method: "POST",
          body: JSON.stringify({
            row: row,
            column: column,
            orientation: orientation,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setGameState(data)
          });
      };

      for (let row = 0; row < 10; row++) {
        for (let column = 0; column < 10; column++) {
          const key = row * 10 + column;
          components.push(
            <Box key={key}>
              <Line
                key={`${key},1`}
                row={row}
                column={column}
                orientation={1}
                state={gameState.board.lines[`${key},1`]}
                team={gameState.team}
                onClick={() => onLineClick(row, column, 1)}
              />
              <Line
                key={`${key},0`}
                row={row}
                column={column}
                orientation={0}
                state={gameState.board.lines[`${key},0`]}
                team={gameState.team}
                onClick={() => onLineClick(row, column, 0)}
              />
            </Box>
          );
        }
      }
      setGrid(components);
    }
  }, [gameState]);

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
        <h1 className={styles.header}>
          <span>Border</span> Patrol
        </h1>
        <div className={styles.gridContainer}>{grid}</div>
      </div>
    </div>
  );
};



export default Game;
