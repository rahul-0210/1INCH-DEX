import {
  SET_LOADER_VISIBILITY,
  SET_SIDEBAR_VISIBILITY,
  SET_IS_DETAILPAGE_OPEN,
  SET_IS_WALLET_CONNECTED,
  SET_DAPP_TXN_ERROR_QUEUE,
  SET_DAPP_TXN_SUCCESS_QUEUE,
} from "./actionTypes";

export function setLoaderVisibility(isOpen) {
  return {
    type: SET_LOADER_VISIBILITY,
    status: isOpen,
  };
}
export function setSidebarView(status) {
  return {
    type: SET_SIDEBAR_VISIBILITY,
    status,
  };
}
export function setIsWalletConnected(value) {
  return {
    type: SET_IS_WALLET_CONNECTED,
    connectionStatus: value,
  };
}
export function setDetailPage(status) {
  return {
    type: SET_IS_DETAILPAGE_OPEN,
    status,
  };
}
export function setDappErrorQueue(error) {
  return {
    type: SET_DAPP_TXN_ERROR_QUEUE,
    error: error,
  };
}

export function setDappTxnSuccessQueue(success) {
  return {
    type: SET_DAPP_TXN_SUCCESS_QUEUE,
    success: success,
  };
}
