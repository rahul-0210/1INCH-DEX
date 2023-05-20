import React from "react";
import styles from "./IntroCard.module.css";
const IntroCard = ({ status, percentage, amount }) => {
  return (
    <>
      <div className={styles.statusCard + " card w-100 mt-0 h-auto"}>
        <div className="card-body ">
          <div className="d-flex justify-content-center my-2">
            <h3 className="my-auto">{status}</h3>
          </div>
        </div>
      </div>
    </>
  );
};
export default IntroCard;
