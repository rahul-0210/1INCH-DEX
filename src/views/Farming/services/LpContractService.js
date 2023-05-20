
export const lpName = (contractAddress, abi) => ({
  abi,
  address: contractAddress,
  functionName: "name",
});

export const token0Address = (contractAddress, abi) => ({
  abi,
  address: contractAddress,
  functionName: "token0",
});

export const token1Address = (contractAddress, abi) => ({
  abi,
  address: contractAddress,
  functionName: "token1",
});

export const fetchTokenName = (contractAddress, abi) => ({
  abi,
  address: contractAddress,
  functionName: "symbol",
});

export const fetchAllowance = (contractAddress, abi, userAddress, farmingContractAddress) => ({
  abi,
  address: contractAddress,
  functionName: "allowance",
  args: [userAddress, farmingContractAddress],
});

export const fetchLiquidity = (abi, tokenAddress, lpTokenAddress) => ({
  abi,
  address: tokenAddress,
  functionName: "balanceOf",
  args: [lpTokenAddress],
});

export const getTokenDecimals = (abi, contractAddress) => ({
  abi,
  address: contractAddress,
  functionName: "decimals",
});

export const approveAllowanceFunction = "approve";
