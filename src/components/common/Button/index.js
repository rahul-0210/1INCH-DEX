import React from "react";
import { Button as ReactStrapButton } from "reactstrap";

import styles from "./Button.module.css";

const STYLES = ["btnStyle", "btnStyle2", "btnStyle3", "btnStyle4"];
const SIZES = ["normalBtn", "mediumBtn", "largeBtn"];

const Button = ({ id, children, onClick, buttonStyle, buttonSize, style, disabled }) => {
  const setButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
  const setButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <ReactStrapButton
      id={id}
      onClick={onClick}
      style={style}
      disabled={disabled}
      className={`${styles.btn1} ${styles[setButtonStyle]} ${styles[setButtonSize]}`}
    >
      {children}
    </ReactStrapButton>
  );
};

export default Button;
