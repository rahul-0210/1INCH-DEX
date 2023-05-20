import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Input, Spinner } from "reactstrap";

import styles from "./FarmingUnstakeModal.module.css";
import { toast } from "react-toastify";
import Button from "../../common/Button";

const FarmingUnstakeModal = ({ style, enteredAmount, changeEnteredAmount, stakedAmount, unstake, title, max, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const callUnstake = () => {
    unstake();
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        buttonStyle="btnStyle"
        disabled={loading}
        onClick={() => {
          if (Number(stakedAmount) !== 0) {
            !loading && setIsModalOpen(true);
          } else {
            toast.error("No tokens available for unstaking");
          }
        }}
        style={style}
      >
        {loading ? <Spinner animation="grow" variant="light" size="sm" as="span" /> : <span>Unstake &#45;</span>}
      </Button>
      <Modal
        isOpen={isModalOpen}
        centered
        toggle={() => {
          setIsModalOpen(false);
        }}
      >
        <ModalHeader toggle={() => setIsModalOpen(false)}>Unstake {title}</ModalHeader>
        <ModalBody>
          <div className={styles.infoText}>
            <div>Total Staked : {stakedAmount && stakedAmount}</div>
          </div>
          <div className={styles.inputSection}>
            <Input type="text" placeholder="Enter Amount" value={enteredAmount} onChange={changeEnteredAmount} />
            <Button onClick={max} style={{ marginLeft: "5px" }} buttonStyle="btnStyle">
              Max
            </Button>
          </div>
          <div className={styles.buttonSection + " mt-3"}>
            <Button onClick={callUnstake} buttonStyle="btnStyle2" buttonSize="largeBtn">
              Unstake
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FarmingUnstakeModal;
