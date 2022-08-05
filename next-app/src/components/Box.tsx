import styles from "../styles/Home.module.css";

function Box(props: any) {
  let color = "white";
  if (props.state === 1) color = "rgba(16, 113, 210, 0.505)";
  if (props.state === 2) color = "rgba(210, 16, 16, 0.505)";

  return (
    <div className={styles.box}>
      <div className={styles.boxColor} style={{ backgroundColor: color }}></div>
      {props.children}
    </div>
  );
}

export default Box;
