import styles from "../styles/Home.module.css";

function Box(props: any) {
  return <div className={styles.box}>{props.children}</div>;
}

export default Box;
