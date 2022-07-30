import styles from "../styles/Home.module.css";

function Box(props: any) {
  let color = "white";
  if (props.state === 1) color = "rgba(16, 113, 200, 0.605)";
  if (props.state === 2) color = "rgba(200, 16, 16, 0.605)";

  return (
    <div className={styles.box} style={{ backgroundColor: color }}>
      {props.children}
    </div>
  );
}

export default Box;
