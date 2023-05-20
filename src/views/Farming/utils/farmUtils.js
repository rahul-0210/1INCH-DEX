import { utils } from "ethers";
import { LIVE_COIN_WATCH_API_KEY } from "../../../App.Config";

export const calculateApr = async (tokenPrice, blockTime, rewardPerBlock, liquidityValue, allocPoint, totalAllocation) => {
  // const tokenBlockTime = blockTime;
  // const blocksPerYear = (60 / tokenBlockTime) * 60 * 24 * 365;
  const blocksPerYear = 350000 * 365;
  const tokenPerYear = rewardPerBlock * blocksPerYear;
  if (liquidityValue !== 0 && allocPoint && allocPoint[0] && totalAllocation && totalAllocation[0] && tokenPrice) {
    const poolWeight = utils.formatEther(allocPoint[0].toString()) / utils.formatEther(totalAllocation[0]?.[0].toString());
    const yearlyRewardAllocation = tokenPerYear * poolWeight;
    const rewardsApr = ((parseFloat(yearlyRewardAllocation) * tokenPrice) / liquidityValue) * 100;
    if (rewardsApr !== Infinity) {
      return rewardsApr;
    }
  }
};

export const calculateLiquidity = async (token0, token1, tokenPriceData, liquidityToken0, liquidityToken1, chainId) => {
  // token0 is AIFIN, token1 is USDT
  let token0Address = token0 && token0[0];
  let token1Address = token1 && token1[0];
  let usdRateForToken0;
  let usdRateForToken1;

  let token0Data = tokenPriceData.filter(
    (item) => token0Address.toString().toLowerCase() === item.tokenProd.toString().toLowerCase() && item.chainId === chainId
  )?.[0];
  if (token0Data && liquidityToken0?.[0]?._hex) {
    let token0Price;
    await fetch("https://api.livecoinwatch.com/coins/single", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": LIVE_COIN_WATCH_API_KEY,
      },
      body: JSON.stringify({
        code: token0Data?.code,
        currency: "USD",
        meta: false,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        token0Price = res.rate;
      })
      .catch((err) => {
        token0Price = token0Data?.fallbackPrice ?? 0;
      });
    usdRateForToken0 = token0Price * utils.formatUnits(liquidityToken0[0]._hex, token0Data?.decimals);
  } else {
    usdRateForToken0 = 0;
  }

  let token1Data = tokenPriceData.filter(
    (item) => token1Address.toString().toLowerCase() === item.tokenProd.toString().toLowerCase() && item.chainId === chainId
  )?.[0];
  if (token1Data && liquidityToken1?.[0]?._hex) {
    let token1Price;
    await fetch("https://api.livecoinwatch.com/coins/single", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": LIVE_COIN_WATCH_API_KEY,
      },
      body: JSON.stringify({
        code: token1Data?.code,
        currency: "USD",
        meta: false,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        token1Price = res.rate;
      })
      .catch((err) => {
        token1Price = token1Data?.fallbackPrice ?? 0;
      });
    usdRateForToken1 = token1Price * utils.formatEther(liquidityToken1[0]._hex, token1Data?.decimals);
  } else {
    usdRateForToken1 = 0;
  }

  return { token0: usdRateForToken0, token1: usdRateForToken1 };
};
