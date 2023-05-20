import {
  SET_LOADER_VISIBILITY,
  SET_SIDEBAR_VISIBILITY,
  SET_IS_DETAILPAGE_OPEN,
  SET_IS_WALLET_CONNECTED,
  SET_DAPP_TXN_ERROR_QUEUE,
  SET_DAPP_TXN_SUCCESS_QUEUE,
} from "../actions/actionTypes";
import { IS_DEVICE_MOBILE } from "../App.Config";

const masterReducer = (
  state = {
    showLoader: false,
    isSidebarOpen: !IS_DEVICE_MOBILE,
    isWalletConnected: false,
    isDetailPage: false,
    transactionErrorQueue: [],
    transactionSuccessQueue: [],
  },
  action
) => {
  switch (action.type) {
    case SET_LOADER_VISIBILITY:
      return { ...state, showLoader: action.status };
    case SET_SIDEBAR_VISIBILITY:
      return { ...state, isSidebarOpen: action.status };
    case SET_IS_WALLET_CONNECTED:
      return { ...state, isWalletConnected: action.connectionStatus };
    case SET_IS_DETAILPAGE_OPEN:
      return { ...state, isDetailPage: action.status };
    case SET_DAPP_TXN_ERROR_QUEUE:
      return { ...state, transactionErrorQueue: [action.error, ...state.transactionErrorQueue] };
    case SET_DAPP_TXN_SUCCESS_QUEUE:
      return { ...state, transactionSuccessQueue: [action.success, ...state.transactionSuccessQueue] };
    default:
      return state;
  }
};

export default masterReducer;
