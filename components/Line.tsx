import { useState } from "react";
import styles from "../styles/Home.module.css";

function Line(props: any) {
  if (props.row > 9 || props.column > 9) return <></>;
  const [state, setState] = useState(props.state);
  const [color, setColor] = useState(
    state === 0
      ? "rgba(156, 156, 156, 0.473)"
      : props.state === 1
      ? "rgba(16, 113, 210, 0.605)"
      : "rgba(210, 16, 16, 0.605)"
  );

  function click() {
    if (state === 0) {
      setState(props.team);
      setColor(
        props.team === 1
          ? "rgba(16, 113, 210, 0.605)"
          : "rgba(210, 16, 16, 0.605)"
      );
      props.onClick();
    }
  }

  if (props.orientation)
    return (
      <div
        onClick={click}
        className={styles.line}
        style={{
          height: "90%",
          width: "40%",
          left: "95%",
          top: "5%",
          zIndex: "1",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "25%",
            backgroundColor: color,
          }}
        ></div>
      </div>
    );
  else
    return (
      <div
        onClick={click}
        className={styles.line}
        style={{
          height: "40%",
          width: "90%",
          top: "80%",
          left: "5%",
          zIndex: "1",
          alignItems: "center ",
        }}
      >
        <div
          style={{
            height: "25%",
            width: "100%",
            backgroundColor: color,
          }}
        ></div>
      </div>
    );
}

export default Line;
