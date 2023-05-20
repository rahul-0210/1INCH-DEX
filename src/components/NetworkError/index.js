import React from "react";
import { useSwitchNetwork } from 'wagmi'
import { VALID_APP_NETWORK } from "../../App.Config";
import { DEFAULT_NETWORK_ERROR } from "../../App.Config";
import styles from "./NetworkError.module.css";

const NetworkError = () => {
  const { switchNetwork } = useSwitchNetwork()
  return (
    <>
      <div className={styles.errorContainer}>
        <button className="btn btn-primary" onClick={() => switchNetwork?.(VALID_APP_NETWORK[0])}>{DEFAULT_NETWORK_ERROR}</button>
      </div>
    </>
  );
};

export default NetworkError;
