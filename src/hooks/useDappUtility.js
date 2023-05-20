import { useSelector } from "react-redux";

//The hook can be used to derive a state from contract values. Omits need to manage state only for display purposes.
export const useContractValueTransformation = (properties, config) => {
  let displayState = {};
  Object.keys(properties).map((key) => {
    displayState[key] = config[key] !== undefined ? config[key](properties[key]) : properties[key];
  });
  return displayState;
};

//Returns error queue from redux
export const useErrorQueue = () => {
  const { transactionErrorQueue } = useSelector((state) => state.masterReducer);
  return transactionErrorQueue;
};

//Returns success queue from redux
export const useSuccessQueue = () => {
  const { transactionSuccessQueue } = useSelector((state) => state.masterReducer);
  return transactionSuccessQueue;
};
