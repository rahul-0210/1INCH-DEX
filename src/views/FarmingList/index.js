import styles from "./FarmingList.module.css";

import NetworkError from "../../components/NetworkError";
import Farming from "../Farming";

import { CONTRACT_ADDRESS, VALID_APP_NETWORK } from "../../App.Config";

const FarmingList = ({account, chainId}) => {

  return (
    <div className={styles.viewContainer}>
      {VALID_APP_NETWORK.includes(chainId) ? (
        CONTRACT_ADDRESS.FARMING[chainId].map((item, index) => {
          return <Farming key={index} configIndex={index} account={account} chainId={chainId} />;
        })
      ) : (
        <NetworkError />
      )}
    </div>
  );
};

export default FarmingList;
