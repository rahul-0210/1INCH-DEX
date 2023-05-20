import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import StakingAbi from "../abi/StakingAbi.json";

export const stakingContractAbiInterface = new utils.Interface(StakingAbi);

export const stakingContract = (address) => new Contract(address, stakingContractAbiInterface);


export const totalStakersContractCall = (contractAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "getNumberOfHolders",
});

export const getPendingDivsContractCall = (contractAddress, walletAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "getPendingDivs",
  args: [walletAddress],
});

export const depositedTokenContractCall = (contractAddress, walletAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "depositedTokens",
  args: [walletAddress],
});

export const getStakersListContractCall = (contractAddress, startIndex, endIndex) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "getStakersList",
  args: [startIndex, endIndex],
});

export const depositedTokenAddressContractCall = (contractAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "tokenAddress",
});

export const totalEarnedTokensContractCall = (contractAddress, walletAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "totalEarnedTokens",
  args: [walletAddress],
});

export const rewardRateContractCall = (contractAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "rewardRate",
});

export const rewardIntervalContractCall = (contractAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "rewardInterval",
});

export const getPoolSize = (contractAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "totalStaked",
});

export const stakingFeeRate = (contractAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "stakingFeeRate",
});

export const unstakingFeeRate = (contractAddress) => ({
  abi: stakingContractAbiInterface,
  address: contractAddress,
  functionName: "unstakingFeeRate",
});

export const depositStakingFunction = "deposit";
export const withdrawStakingFunction = "withdraw";
export const harvestStakingFunction = "claimDivs";
