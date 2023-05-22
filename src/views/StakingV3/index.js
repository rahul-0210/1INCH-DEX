import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { utils, BigNumber } from "ethers";
import { useContractReads, useContractWrite, useBalance, useContractRead, erc20ABI  } from "wagmi";

import {
  totalStakersContractCall,
  getPendingDivsContractCall,
  depositedTokenContractCall,
  depositedTokenAddressContractCall,
  totalEarnedTokensContractCall,
  rewardRateContractCall,
  rewardIntervalContractCall,
  getPoolSize,
  depositStakingFunction,
  harvestStakingFunction,
  withdrawStakingFunction,
  stakingContract,
  stakingFeeRate,
  unstakingFeeRate,
} from "./services/StakingContractService";
import { approveAllowanceFunction } from "./services/TokenContractService";
import { useContractValueTransformation } from "../../hooks/useDappUtility";
import StakingCardV3 from "../../components/cards/StakingCardV3";
import StakingAbi from "./abi/StakingAbi.json";

const StakingV3 = ({
  stakingContractAddress,
  tokenBuyURL,
  tokenPriceUSD,
  rewardTokenPriceUSD,
  tokenDisplayName,
  cardTitle,
  lockingPeriod,
  account,
}) => {
  const [inputAmount, setInputAmount] = useState("");
  const amountInWei = inputAmount && utils.parseUnits(inputAmount, 18);
  
  const stakingContractConfig = {
    address: stakingContractAddress,
    abi: StakingAbi,
  };

  const { write: deposit } = useContractWrite({
    ...stakingContractConfig,
    functionName: depositStakingFunction,
    args: [amountInWei],
  });
  
  const { write: harvest } = useContractWrite({
    ...stakingContractConfig,
    functionName: harvestStakingFunction,
  });

  const { write: withdraw } = useContractWrite({
    ...stakingContractConfig,
    functionName: withdrawStakingFunction,
    args: [amountInWei],
  });

  const { data: contractData = [] } = useContractReads({
    contracts: [
      getPendingDivsContractCall(stakingContractAddress, account),
      depositedTokenContractCall(stakingContractAddress, account),
      totalStakersContractCall(stakingContractAddress),
      depositedTokenAddressContractCall(stakingContractAddress),
      totalEarnedTokensContractCall(stakingContractAddress, account),
      rewardRateContractCall(stakingContractAddress),
      rewardIntervalContractCall(stakingContractAddress),
      getPoolSize(stakingContractAddress),
      stakingFeeRate(stakingContractAddress),
      unstakingFeeRate(stakingContractAddress),
    ],
  })

  const displayState = useContractValueTransformation(
    {
      stakingContractAddress,
      pendingDives: contractData?.[0],
      stakeAmount: contractData?.[1],
      totalStakers: contractData?.[2],
      depositTokenAddress: contractData?.[3],
      totalEarnedToken: contractData?.[4],
      rewardRate: contractData?.[5],
      rewardInterval: contractData?.[6],
      poolSize: contractData?.[7],
      stakingFee: contractData?.[8],
      unstakingFee: contractData?.[9],
    },
    {
      stakingContractAddress: (val) => val,
      pendingDives: (val) =>
      val ? Number(utils.formatUnits(val, 18)).toFixed(3) : 0,
      stakeAmount: (val) =>
      val ? Number(utils.formatUnits(val, 18)).toFixed(3) : 0,
      totalStakers: (val) => (val ? Number(val) : 0),
      depositTokenAddress: (val) => (val ? val : ""),
      totalEarnedToken: (val) =>
        val ? Number(utils.formatUnits(val, 18)).toFixed(3) : 0,
      rewardRate: (val) => (Number(val) / 100).toFixed(1),
      rewardInterval: (val) => Number(val) / 60,
      poolSize: (val) =>
      val ? Number(utils.formatUnits(val, 18)).toFixed(3) : 0,
      stakingFee: (val) => (val ? Number(utils.formatUnits(val, 2)) : 0),
      unstakingFee: (val) => (val ? Number(utils.formatUnits(val, 2)) : 0),
    }
    );

    const tokenContractConfig = {
      address: displayState.depositTokenAddress,
      abi: erc20ABI,
    }

    const { data: tokenData = [] } = useContractReads({
      contracts: [
        {
          ...tokenContractConfig,
          functionName: 'balanceOf',
          args: [account]
        },
        {
          ...tokenContractConfig,
          functionName: 'balanceOf',
          args: [stakingContractAddress]
        },
        {
          ...tokenContractConfig,
          functionName: 'allowance',
          args: [account, stakingContractAddress]
        },
      ],
    })
    
  const tokenDisplayState = useContractValueTransformation(
    {
      balance: tokenData?.[0],
      contractBalance: tokenData?.[1],
      allowance: tokenData?.[2]
    },
    {
      balance: (val) => val ? Number(utils.formatUnits(val, 18)).toFixed(3) : 0,
      contractBalance: (val) => val ? Number(utils.formatUnits(val, 18)).toFixed(3) : 0,
      allowance: (val) => (val ? utils.formatUnits(val, 18) : 0),
    }
    );

  const { write: approve } = useContractWrite({
    ...tokenContractConfig,
    functionName: approveAllowanceFunction,
    args: [stakingContractAddress, BigNumber.from(2).pow(256).sub(1)],
    onSettled(data, error) {
      if (error) toast.error(error.message);
      else deposit();
    },
  });

  const handleInputValueChange = (inputAmount) => {
    if (isNaN(inputAmount)) {
      return;
    }
    setInputAmount(inputAmount);
  };

  const checkAndStakeToken = () => {
    if (Number(inputAmount) <= Number(tokenDisplayState.balance)) {
      if (!Number(inputAmount)) toast.error("Amount should not be null");
      else if (
        Number(tokenDisplayState.allowance) > 0 &&
        Number(tokenDisplayState.allowance) >= Number(inputAmount)
      )
        deposit();
      else approve();
    } else toast.error("Insufficient balance");
  };

  const checkAndHarvestToken = () => harvest();

  const checkAndUnstake = () => {
    if (!Number(inputAmount)) toast.error("Amount should not be null");
    else if (Number(inputAmount) > Number(displayState.stakeAmount))
      toast.error("Insufficient balance");
    else withdraw();
  };

  return (
    <StakingCardV3
      rewardTokenPriceUSD={rewardTokenPriceUSD}
      tokenName={tokenDisplayName}
      aprValue={displayState.rewardRate}
      totalEarned={displayState.totalEarnedToken}
      totalStakers={displayState.totalStakers}
      totalPending={displayState.pendingDives}
      stakeAmount={displayState.stakeAmount}
      poolSize={displayState.poolSize}
      updateWalletAmount={handleInputValueChange}
      checkAndStakeToken={checkAndStakeToken}
      buyUrl={tokenBuyURL}
      walletBalance={tokenDisplayState.balance}
      walletAmount={inputAmount}
      checkAndHarvestToken={checkAndHarvestToken}
      checkAndUnstake={checkAndUnstake}
      tokenPriceUSD={tokenPriceUSD}
      contractBalance={tokenDisplayState.contractBalance}
      cardTitle={cardTitle}
      stakingFee={displayState.stakingFee}
      unstakingFee={displayState.unstakingFee}
      lockingPeriod={lockingPeriod}
    />
  );
};

export default StakingV3;
