import { useState } from "react";
import styles from "../styles/Home.module.css";

function Line(props: any) {
  if (props.row >= 9 && props.orientation === 0 || props.column >= 9 && props.orientation === 1) return <></>;
  const [tempState, setTempState] = useState(0);

  let color;
  console.log(props.state)
  if (props.state === 0 && tempState === 0) {
    color = "rgba(156, 156, 156, 0.473)";
  } else if (props.state === 1 || tempState === 1) {
    color = "rgba(16, 113, 210, 0.605)";
  } else {
    color = "rgba(210, 16, 16, 0.605)";
  }

  function click() {
    if (props.state === 0) {
      setTempState(props.team);
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
