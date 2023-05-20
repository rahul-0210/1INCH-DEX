import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";

export const farmingContract = (contractAddress, abi) => {
  let abiInterface = new utils.Interface(abi);
  return new Contract(contractAddress, abiInterface);
};

export const poolLength = (contractAddress, abi) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "poolLength",
});

export const poolInfo = (contractAddress, abi, poolId) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "poolInfo",
  args: [poolId],
});

export const userInfo = (contractAddress, abi, poolId, userAddress) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "userInfo",
  args: [poolId, userAddress],
});

export const pendingReward = (contractAddress, abi, poolId, userAddress) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "pendingTokens", //based on development testing contract
  args: [poolId, userAddress],
});

export const totalAllocPoint = (contractAddress, abi) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "totalAllocPoint",
});

export const contractOwner = (contractAddress, abi) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "owner",
});

export const tokenPerBlock = (contractAddress, abi) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "aifinPerBlock",
});

export const depositFarmingFunction = "deposit";
export const withdrawFarmingFunction = "withdraw";
export const addFarmFunction = "add";
