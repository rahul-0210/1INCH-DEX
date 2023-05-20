import React from "react";
import { useSelector } from "react-redux";
import { Spinner } from "reactstrap";

import "./style.css";

const LoaderComponent = () => {
  const { showLoader } = useSelector((state) => state.masterReducer);

  if (!showLoader) {
    return null;
  }

  return (
    <div className="loader-wrapper">
      <Spinner color="info" />
    </div>
  );
};

export default LoaderComponent;
