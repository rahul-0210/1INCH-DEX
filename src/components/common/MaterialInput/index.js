import React from "react";
import { Input, Label } from "reactstrap";
import "../MaterialInput/Material.css";

const STYLES = ["input", "label", "input2", "input3"];
const MaterialInput = ({ value, label, placeholder, type, onChange, children, inputStyle }) => {
  const setinputStyle = STYLES.includes(inputStyle) ? inputStyle : STYLES[0];
  return (
    <div className="box">
      <div className="material">
        <Input type={type} value={value} className={`${setinputStyle}`} placeholder={placeholder}>
          {children}
        </Input>
        <Label className="label">{label}</Label>
      </div>
    </div>
  );
};

export default MaterialInput;
