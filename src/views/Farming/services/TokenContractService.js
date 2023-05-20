
export const totalStaked = (contractAddress, abi, farmingContractAddress) => ({
  abi,
  address: contractAddress,
  functionName: "balanceOf",
  args: [farmingContractAddress],
});

export const allowance = (contractAddress, abi, farmingContractAddress, userAddresss) => ({
  abi,
  address: contractAddress,
  functionName: "allowance",
  args: [userAddresss, farmingContractAddress],
});

export const fetchLpTokenBalance = (contractAddressFrm, abi, userAddress) => ({
  abi,
  address: contractAddressFrm,
  functionName: "balanceOf",
  args: [userAddress],
});

export const fetchTokenName = (contractAddress, abi) => ({
  abi,
  address: contractAddress,
  functionName: "symbol",
});

export const approveAllowanceFunction = "approve";
