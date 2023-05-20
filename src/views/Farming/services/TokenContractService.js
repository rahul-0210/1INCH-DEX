import { utils } from "ethers";

export const totalStaked = (contractAddress, abi, farmingContractAddress) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "balanceOf",
  args: [farmingContractAddress],
});

export const allowance = (contractAddress, abi, farmingContractAddress, userAddresss) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "allowance",
  args: [userAddresss, farmingContractAddress],
});

export const fetchLpTokenBalance = (contractAddressFrm, abi, userAddress) => ({
  abi: new utils.Interface(abi),
  address: contractAddressFrm,
  method: "balanceOf",
  args: [userAddress],
});

export const fetchTokenName = (contractAddress, abi) => ({
  abi: new utils.Interface(abi),
  address: contractAddress,
  method: "symbol",
});

export const approveAllowanceFunction = "approve";
