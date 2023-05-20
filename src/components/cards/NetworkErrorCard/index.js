import React from "react";
import styles from "./NetworkErrorCard.module.css";

const NetworkErrorCard = () => {
  return (
    <>
      <div className={styles.statusCard + " card w-100 text-center mt-0 h-auto"}>
        <div className="card-body p-4">
          <div className="row mt-2 mb-3">
            <div className="col-12">
              <h3>Invalid Network! </h3>
              <hr />
            </div>
          </div>
          <div className="mt-2 mb-3">
            <div className="row">
              <div className="col-12">
                <h5 className={styles.NetworkErrMsg}>Switch to Ethereum network</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkErrorCard;
