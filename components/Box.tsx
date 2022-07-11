import styles from "../styles/Home.module.css";
import Line from "./Line";

function Box(props: any) {
  const lines = [];
  const color =
    props.team == 1 ? "rgba(16, 113, 210, 0.605)" : "rgba(210, 16, 16, 0.605)";
  if (props.row < 9) {
    lines.push(<Line key={`${props.row},${props.column},1`} row={props.row} column={props.column} pid={props.pid} orientation={1} color={color} />);
  }
  if (props.column < 9) {
    lines.push(<Line key={`${props.row},${props.column},0`} row={props.row} column={props.column} pid={props.pid} orientation={0} color={color} />);
  }

  return <div className={styles.box}>{lines}</div>;
}

export default Box;
