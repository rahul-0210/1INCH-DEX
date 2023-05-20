import { useSelector } from "react-redux";
import styles from "./StakingList.module.css";
import NetworkError from "../../components/NetworkError";
import StakingV3 from "../StakingV3";

import { CONTRACT_ADDRESS, VALID_APP_NETWORK } from "../../App.Config";

const StakingList = ({account, chainId}) => {
  const tokenPrice = useSelector((state) => state.tokenReducer.tokenPrice);

  return (
    <div className={styles.viewContainer}>
      {VALID_APP_NETWORK.includes(chainId) ? (
        CONTRACT_ADDRESS.STAKING[chainId].map((item,i) => {
          return (
            <StakingV3
              key={i}
              stakingContractAddress={item.CONTRACT}
              tokenPriceUSD={tokenPrice ?? item.TOKEN_PRICE_USD}
              rewardTokenPriceUSD={tokenPrice ?? item.REWARD_TOKEN_PRICE_USD}
              tokenDisplayName={item.TOKEN_NAME}
              tokenBuyURL={item.BUY_URL}
              stakingTokenContractAddress={item.TOKEN}
              cardTitle={item.TITLE}
              lockingPeriod={item.LOCKING_PERIOD}
              account={account}
            />
          );
        })
      ) : (
        <NetworkError chainId={chainId} />
      )}
    </div>
  );
};

export default StakingList;
