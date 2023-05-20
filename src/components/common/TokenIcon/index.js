import React from "react";

import styles from "./TokenIcon.module.css";

const TokenIcon = ({ image, altText }) => {
  return (
    <>
      <div className={styles.tokenWrapper}>
        <img className={styles.icon} src={image} alt={altText} />
      </div>
    </>
  );
};

export default TokenIcon;
