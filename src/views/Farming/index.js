import React, { useState, useEffect } from "react";
import { useContractReads, useContractRead  } from "wagmi";
import { utils } from "ethers";
import { useSelector } from "react-redux";

import styles from "./Farming.module.css";
import FarmingAbi from "./abi/Masterchef.json";
import TokenAbi from "./abi/Token.json";
import LpTokenAbi from "./abi/LPToken.json";
import tokenPriceData from "./../Farming/utils/tokenPrices.json";

import FarmingCard from "../../components/cards/FarmingCard";
import NetworkError from "../../components/NetworkError";

import { useContractValueTransformation } from "../../hooks/useDappUtility";
import { poolLength, poolInfo, userInfo, pendingReward, totalAllocPoint, tokenPerBlock } from "./services/FarmingContractService";
import { lpName, token0Address, token1Address, fetchTokenName, fetchAllowance, fetchLiquidity } from "./services/LpContractService";
import { fetchLpTokenBalance } from "./services/TokenContractService";
import { CONTRACT_ADDRESS, CURRENT_CHAIN_BLOCK_TIME, VALID_APP_NETWORK } from "../../App.Config";

const Farming = ({ configIndex, account, chainId }) => {

  const [currentNetworkAbi, setCurrentNetworkAbi] = useState([]);
  const [currentNetworkContract, setCurrentNetworkContract] = useState("");
  const [totalPoolLengthState, setTotalPoolLengthState] = useState(0);
  const [currentBlockTime, setCurrentBlockTime] = useState(0);

  const tokenPrice = useSelector((state) => state.tokenReducer.tokenPrice);

  const { CONTRACT, VALID_NETWORK } = CONTRACT_ADDRESS.FARMING[chainId][configIndex] ?? false;
  const { BLOCK_TIME } = CURRENT_CHAIN_BLOCK_TIME[chainId] ?? 0;

  const {data: totalPoolLength = {}} = useContractRead(currentNetworkContract ? poolLength(currentNetworkContract, FarmingAbi) : {});

  const totalPoolLengthResolved = useContractValueTransformation({ totalPoolLength: totalPoolLength }, { totalPoolLength: (val) => parseFloat(val) });

  const argsForPoolInfo = (length, contractAddress, abi) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        params.push(poolInfo(contractAddress, abi, i));
      }
    }
    return params;
  };

  const {data: allFarmInfo = []} = useContractReads({
    contracts: argsForPoolInfo(totalPoolLengthState, currentNetworkContract, currentNetworkAbi)
  });

  const argsForUser = (length, contractAddress, abi, userAddress) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        params.push(userInfo(contractAddress, abi, i, userAddress));
      }
    }
    return params;
  };

  const {data: userInfoValue = []} = useContractReads({
    contracts: argsForUser(totalPoolLengthState, currentNetworkContract, currentNetworkAbi, account)
  });

  const argsForReward = (length, contractAddress, abi, userAddress) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        params.push(pendingReward(contractAddress, abi, i, userAddress));
      }
    }
    return params;
  };

  const {data: pendingRewardsValue = []} = useContractReads({
    contracts: argsForReward(totalPoolLengthState, currentNetworkContract, currentNetworkAbi, account)
  });

  const {data: rewardPerBlock = {}} = useContractRead(tokenPerBlock(currentNetworkContract, currentNetworkAbi));

  const argsForWalletBalance = (length, contractAddress, abi, userAddress) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        allFarmInfo[i] && allFarmInfo[i].lpToken && params.push(fetchLpTokenBalance(allFarmInfo[i].lpToken, abi, userAddress));
      }
    }
    return params;
  };

  const {data: walletBalanceValue = []} = useContractReads({
    contracts: argsForWalletBalance(totalPoolLengthState, currentNetworkContract, TokenAbi, account)
  });

  const argsForLpName = (length, contractAddress, abi) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        allFarmInfo[i] && allFarmInfo[i].lpToken && params.push(lpName(allFarmInfo[i].lpToken, abi));
      }
    }
    return params;
  };

  const {data: deployedFarmName = []} = useContractReads({
    contracts: argsForLpName(totalPoolLengthState, currentNetworkContract, LpTokenAbi)
  });
  
  const argsForToken0 = (length, contractAddress, abi) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        allFarmInfo[i] && allFarmInfo[i].lpToken && params.push(token0Address(allFarmInfo[i].lpToken, abi));
      }
    }
    return params;
  };

  const {data: listOfToken0 = []} = useContractReads({
    contracts: argsForToken0(totalPoolLengthState, currentNetworkContract, LpTokenAbi)
  });


  const argsForToken1 = (length, contractAddress, abi) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        allFarmInfo[i] && allFarmInfo[i].lpToken && params.push(token1Address(allFarmInfo[i].lpToken, abi));
      }
    }
    return params;
  };

  const {data: listOfToken1 = []} = useContractReads({
    contracts: argsForToken1(totalPoolLengthState, currentNetworkContract, LpTokenAbi)
  });

  const argsForAllowance = (length, contractAddress, abi, userAddress) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        allFarmInfo[i] && allFarmInfo[i].lpToken && params.push(fetchAllowance(allFarmInfo[i].lpToken, abi, userAddress, contractAddress));
      }
    }
    return params;
  };

  const {data: allowanceValue = []} = useContractReads({
    contracts: argsForAllowance(totalPoolLengthState, currentNetworkContract, LpTokenAbi, account)
  });

  const argsForNameOfToken0 = (length, contractAddress, abi) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
          listOfToken0[i] && params.push(fetchTokenName(listOfToken0[i], abi));
      }
    }
    return params;
  };

  const {data: token0Symbol = []} = useContractReads({
    contracts: argsForNameOfToken0(totalPoolLengthState, currentNetworkContract, LpTokenAbi)
  });

  const argsForNameOfToken1 = (length, contractAddress, abi) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        listOfToken1[i] && params.push(fetchTokenName(listOfToken1[i], abi));
      }
    }
    return params;
  };

  const {data: token1Symbol = []} = useContractReads({
    contracts: argsForNameOfToken1(totalPoolLengthState, currentNetworkContract, LpTokenAbi)
  });

  const argsForLiquidity = (length, contractAddress, abi, list) => {
    let params = [];
    if (contractAddress) {
      for (let i = 0; i < length; i++) {
        allFarmInfo[i] && allFarmInfo[i].lpToken && list[i] && params.push(fetchLiquidity(abi, list[i], allFarmInfo[i].lpToken));
      }
    }
    return params;
  };

  const {data: token0Liquidity = []} = useContractReads({
    contracts: argsForLiquidity(totalPoolLengthState, currentNetworkContract, LpTokenAbi, listOfToken0)
  });

  const {data: token1Liquidity = []} = useContractReads({
    contracts: argsForLiquidity(totalPoolLengthState, currentNetworkContract, LpTokenAbi, listOfToken1)
  });

  const {data: totalAllocPointValue = {}} = useContractRead(currentNetworkContract ? totalAllocPoint(currentNetworkContract, currentNetworkAbi) : {});

  const createFarms = () => {
    let newFarms = [];
    if (VALID_APP_NETWORK.includes(chainId) && currentNetworkContract && currentNetworkAbi) {
      for (let i = 0; i < totalPoolLengthState; i++) {
        newFarms.push({
          id: i,
          earned: pendingRewardsValue[i] && parseFloat(utils.formatUnits(pendingRewardsValue[i]._hex)).toFixed(3),
          mulitplier: allFarmInfo[i] && allFarmInfo[i].allocPoint && parseFloat(allFarmInfo[i].allocPoint) / 100,
          farmName: deployedFarmName && deployedFarmName.length > 0 && deployedFarmName[i],
          walletBalance: walletBalanceValue && walletBalanceValue[i] && utils.formatUnits(walletBalanceValue[i].toString()),
          stakedValue: userInfoValue && userInfoValue[i] && userInfoValue[i].amount && utils.formatUnits(userInfoValue[i].amount.toString()),
          token0: listOfToken0 && listOfToken0[i] ? listOfToken0[i] : "",
          token1: listOfToken1 && listOfToken1[i] ? listOfToken1[i] : "",
          token0Name: token0Symbol && token0Symbol[i],
          token1Name: token1Symbol && token1Symbol[i],
          allowedAllowance: allowanceValue && allowanceValue.length > 0 && allowanceValue[i],
          stakeFee: allFarmInfo[i]  && parseFloat(allFarmInfo[i].depositFeeBP) / 100,
          lpTokenAddress: allFarmInfo[i] && allFarmInfo[i].lpToken,
          allocPoint: allFarmInfo[i]  && [allFarmInfo[i].allocPoint],
          farmingAddress: currentNetworkContract,
          totalAllocPoint: totalAllocPointValue,
          token0Liquidity: token0Liquidity && token0Liquidity[i],
          token1Liquidity: token1Liquidity && token1Liquidity[i],
        });
      }
    }
    return newFarms;
  };

  useEffect(() => {
    if (totalPoolLengthResolved && totalPoolLengthResolved.totalPoolLength) {
      setTotalPoolLengthState(totalPoolLengthResolved.totalPoolLength);
    }
  }, [totalPoolLengthResolved]);

  useEffect(() => {
    if (VALID_NETWORK) {
      setCurrentNetworkContract(CONTRACT);
      setCurrentNetworkAbi(FarmingAbi);
      setCurrentBlockTime(BLOCK_TIME);
    } else {
      setCurrentNetworkContract("");
      setCurrentNetworkAbi([]);
    }
  }, [chainId]);

  const farms = createFarms();

  return (
    <div className={styles.viewContainer}>
      {VALID_APP_NETWORK.includes(chainId) ? (
        totalPoolLengthState > 0 &&
        farms &&
        farms.length > 0 &&
        farms.map((pool) => {
          return (
            <FarmingCard
              key={pool.id}
              disabled={VALID_APP_NETWORK.includes(chainId)}
              pool={pool}
              tokenPriceData={tokenPriceData}
              tokenPrice={tokenPrice}
              currentBlockTime={currentBlockTime}
              rewardPerBlock={rewardPerBlock && rewardPerBlock && utils.formatUnits(rewardPerBlock?._hex)}
              buyUrl={CONTRACT_ADDRESS.FARMING[chainId][configIndex]?.BUY_URL}
              lockingPeriod={CONTRACT_ADDRESS.FARMING[chainId][configIndex]?.LOCKING_PERIOD}
              cardTitle={CONTRACT_ADDRESS.FARMING[chainId][configIndex]?.TITLE}
              stakingFee={CONTRACT_ADDRESS.FARMING[chainId][configIndex]?.STAKING_FEE}
              unstakingFee={CONTRACT_ADDRESS.FARMING[chainId][configIndex]?.UNSTAKING_FEE}
              chainId={chainId}
            />
          );
        })
      ) : (
        <NetworkError />
      )}
    </div>
  );
};

export default Farming;
