import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Party: NextPage = () => {
  const [games, setGames] = useState([]);
  let [check, setCheck] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      fetch("/api/game")
        .then((res) => res.json())
        .then((data) => setGames(data.games));
      setCheck(check + 1);
    }, 1000);

    // clearing interval when component unmounts
    return () => clearInterval(timer);
  }, [check]);

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

      <main className={styles.main}>
        <>
          <h1 className={styles.title}>Join or create game!</h1>
          <div className={styles.spacer}></div>
          <Link href="/api/create">
            <a className={styles.card}>
              <h2>Create new game</h2>
            </a>
          </Link>
          <h2>Games</h2>
          <ul className={styles.games}>
            {games.map((element) => {
              return (
                <li key={element} className={styles.game}>
                  <h4>Game{element}</h4>
                  <Link href={`/api/join/${element}`}>
                    <a>Join</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      </main>

      <footer className={styles.footer}>
        <p>
          made by <span>LCS</span>{" "}
        </p>
      </footer>
    </div>
  );
};

export default Party;
