import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";

export const farmingContract = (contractAddress, abi) => {
  let abiInterface = new utils.Interface(abi);
  return new Contract(contractAddress, abiInterface);
};

export const poolLength = (contractAddress, abi) => ({
  abi,
  address: contractAddress,
  functionName: "poolLength",
});

export const poolInfo = (contractAddress, abi, poolId) => ({
  abi,
  address: contractAddress,
  functionName: "poolInfo",
  args: [poolId],
});

export const userInfo = (contractAddress, abi, poolId, userAddress) => ({
  abi,
  address: contractAddress,
  functionName: "userInfo",
  args: [poolId, userAddress],
});

export const pendingReward = (contractAddress, abi, poolId, userAddress) => ({
  abi,
  address: contractAddress,
  functionName: "pendingTokens", //based on development testing contract
  args: [poolId, userAddress],
});

export const totalAllocPoint = (contractAddress, abi) => ({
  abi,
  address: contractAddress,
  functionName: "totalAllocPoint",
});

export const contractOwner = (contractAddress, abi) => ({
  abi,
  address: contractAddress,
  functionName: "owner",
});

export const tokenPerBlock = (contractAddress, abi) => ({
  abi,
  address: contractAddress,
  functionName: "aifinPerBlock",
});

export const depositFarmingFunction = "deposit";
export const withdrawFarmingFunction = "withdraw";
export const addFarmFunction = "add";
