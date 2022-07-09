import { useState } from "react";
import styles from "../styles/Home.module.css";

function Line(props: any) {
  const [state, setState] = useState(0);
  const [color, setColor] = useState("rgba(156, 156, 156, 0.473)");

  function click() {
    if (state === 0) {
      setState(1);
      setColor(props.color);
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
