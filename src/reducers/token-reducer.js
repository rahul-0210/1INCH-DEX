import { SET_AIFIN_PRICE } from "../actions/actionTypes";

const tokenReducer = (
  state = {
    tokenPrice: null,
  },
  action
) => {
  switch (action.type) {
    case SET_AIFIN_PRICE:
      return { ...state, tokenPrice: action.tokenPrice };
    default:
      return state;
  }
};

export default tokenReducer;
