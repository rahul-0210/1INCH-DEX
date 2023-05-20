import React from "react";

import styles from "./TokenPairIcon.module.css";

const TokenPairIcon = ({ image1, image2 }) => {
  return (
    <>
      <div className={styles.tokenPairWrapper}>
        <img className={styles.icon2} src={image2} alt="" />
        <img className={styles.icon1} src={image1} alt="" />
      </div>
    </>
  );
};

export default TokenPairIcon;
