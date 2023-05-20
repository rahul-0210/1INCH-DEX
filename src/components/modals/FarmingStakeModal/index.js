import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Input, Spinner } from "reactstrap";

import styles from "./FarmingStakeModal.module.css";

import Button from "../../common/Button";
import { toast } from "react-toastify";

const FarmingStakeModal = ({ style, toggle, enteredAmount, changeEnteredAmount, walletBalance, stake, title, max, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const callStake = () => {
    stake();
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        buttonStyle="btnStyle"
        disabled={loading}
        onClick={() => {
          if (Number(walletBalance) !== 0) {
            !loading && setIsModalOpen(true);
            toggle && toggle();
          } else {
            toast.error("No tokens available for staking");
          }
        }}
        style={style}
      >
        {loading ? <Spinner animation="grow" variant="light" size="sm" as="span" /> : <span>Stake &#43;</span>}
      </Button>
      <Modal
        isOpen={isModalOpen}
        centered
        toggle={() => {
          setIsModalOpen(false);
        }}
      >
        <ModalHeader toggle={() => setIsModalOpen(false)}>Stake {title}</ModalHeader>
        <ModalBody>
          <div className={styles.infoText}>
            <div>Balance in Wallet : {walletBalance && walletBalance}</div>
          </div>
          <div className={styles.inputSection}>
            <Input type="text" placeholder="Enter Amount" value={enteredAmount} onChange={(e) => changeEnteredAmount(e)} />
            <Button onClick={max} style={{ marginLeft: "5px" }} buttonStyle="btnStyle">
              Max
            </Button>
          </div>
          <div className={styles.buttonSection + " mt-3"}>
            <Button onClick={callStake} buttonStyle="btnStyle2" buttonSize="largeBtn">
              Stake
            </Button>
            <div className="my-2">{/* Stake Fee 1.5 % */}</div>
            <Button buttonStyle="btnStyle3">Buy {title}</Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FarmingStakeModal;
