import { utils } from "ethers";

export const lpName = (contractAddress, abi) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "name",
});

export const token0Address = (contractAddress, abi) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "token0",
});

export const token1Address = (contractAddress, abi) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "token1",
});

export const fetchTokenName = (contractAddress, abi) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "symbol",
});

export const fetchAllowance = (contractAddress, abi, userAddress, farmingContractAddress) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "allowance",
  args: [userAddress, farmingContractAddress],
});

export const fetchLiquidity = (abi, tokenAddress, lpTokenAddress) => ({
  abi: new utils.Interface(abi),
  address: tokenAddress,
  method: "balanceOf",
  args: [lpTokenAddress],
});

export const getTokenDecimals = (abi, contractAddress) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "decimals",
});

export const approveAllowanceFunction = "approve";
