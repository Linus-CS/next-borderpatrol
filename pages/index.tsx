import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
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
        <h1 className={styles.title}>
          Welcome to <span>Border Patrol</span>
        </h1>

        <p className={styles.description}>
          Get started by <Link href="/games">joining a game!</Link>
        </p>

        <div className={styles.grid}>
          <Link href="/games">
            <a className={styles.card}>
              <h2>Join Game</h2>
            </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          made by <span>LCS</span>{" "}
        </p>
      </footer>
    </div>
  );
};

export default Home;
