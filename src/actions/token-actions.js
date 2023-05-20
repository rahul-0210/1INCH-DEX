import { SET_AIFIN_PRICE } from "./actionTypes";

export const setTokenPrice = (tokenPrice) => {
  return {
    type: SET_AIFIN_PRICE,
    tokenPrice,
  };
};
