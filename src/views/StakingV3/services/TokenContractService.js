import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import TokenAbi from "../abi/TokenAbi.json";

export const tokenContractAbiInterface = new utils.Interface(TokenAbi);

export const tokenContract = (address) => new Contract(address, tokenContractAbiInterface);

export const totalStakedContractCall = (abi, contractAddress, stakingContractAddress) => ({
  abi: tokenContractAbiInterface,
  address: contractAddress,
  method: "balanceOf",
  args: [stakingContractAddress],
});

export const approveAllowanceFunction = "approve";
