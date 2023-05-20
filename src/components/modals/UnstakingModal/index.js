import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";

import styles from "./UnstakingModal.module.css";
import { toast } from "react-toastify";
import Button from "../../common/Button";

const UnstakingModal = ({ style, tokenName, toggle, stakeAmount, walletAmount, checkAndUnstake, updateWalletAmount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const MAX_BALANCE = stakeAmount;

  const toMax4Decimals = (x) => {
    return +x.toFixed(4);
  };

  const setMaxAmount = () => {
    updateWalletAmount(MAX_BALANCE);
  };

  return (
    <>
      <Button
        buttonStyle="btnStyle"
        onClick={() => {
          if (Number(stakeAmount) !== 0) {
            setIsModalOpen(true);
            toggle && toggle();
          } else {
            toast.error("No tokens available for unstaking");
          }
        }}
        style={style}
      >
        Unstake &#45;
      </Button>
      <Modal
        isOpen={isModalOpen}
        centered
        toggle={() => {
          setIsModalOpen(false);
          toggle && toggle();
        }}
      >
        <ModalHeader toggle={() => setIsModalOpen(false)}>Unstake {tokenName}</ModalHeader>
        <ModalBody>
          <div className={styles.infoText}>
            <div>Total Staked : {toMax4Decimals(parseFloat(stakeAmount))}</div>
          </div>
          <div className={styles.inputSection}>
            <Input
              type="text"
              placeholder="Enter Amount"
              className={styles.input}
              value={walletAmount}
              onChange={(e) => updateWalletAmount(e.target.value)}
            />
            <Button style={{ marginLeft: "5px" }} buttonStyle="btnStyle" onClick={setMaxAmount}>
              Max
            </Button>
          </div>
          <div className={styles.buttonSection + " mt-3"}>
            <Button
              buttonStyle="btnStyle2"
              buttonSize="largeBtn"
              disabled={walletAmount && walletAmount === 0}
              onClick={() => {
                checkAndUnstake();
              }}
            >
              Unstake
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UnstakingModal;
