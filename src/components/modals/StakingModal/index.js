import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Input } from "reactstrap";
import { toast } from "react-toastify";
import { utils } from "ethers";

import styles from "./StakingModal.module.css";

import Button from "../../common/Button";

const pills = [/* "1m", "1h",  */ "1M", "2M", "3M", "6M", "12M", "18M"];

const countsPerPeriod = (e, aprValue) => {
  switch (e) {
    // case "1m":
    //   return { _seconds: 60, aprValuePerPeriod: aprValue / (12*30*24*60) };
    // case "1h":
    //   return { _seconds: 3600, aprValuePerPeriod: aprValue / (12*30*24) };
    case "1M":
      return { _seconds: 86400 * 30, aprValuePerPeriod: aprValue / 12 };
    case "2M":
      return { _seconds: 86400 * 30 * 2, aprValuePerPeriod: (aprValue / 12) * 2 };
    case "3M":
      return { _seconds: 86400 * 30 * 3, aprValuePerPeriod: (aprValue / 12) * 3 };
    case "6M":
      return { _seconds: 86400 * 30 * 6, aprValuePerPeriod: (aprValue / 12) * 6 };
    case "12M":
      return { _seconds: 86400 * 30 * 12, aprValuePerPeriod: (aprValue / 12) * 12 };
    case "18M":
      return { _seconds: 86400 * 30 * 12, aprValuePerPeriod: (aprValue / 12) * 12 + 6 };
    // case "2Y":
    //   return { _seconds: 86400 * 30 * 12 * 2, aprValuePerPeriod: (aprValue / 12) * 12 * 2 };
    // case "3Y":
    //   return { _seconds: 86400 * 30 * 12 * 3, aprValuePerPeriod: (aprValue / 12) * 12 * 3 };
    // case "3Y":
    //   return { _seconds: 86400 * 30 * 12 * 4, aprValuePerPeriod: (aprValue / 12) * 12 * 4 };
    // case "4Y":
    //   return { _seconds: 86400 * 30 * 12 * 4, aprValuePerPeriod: (aprValue / 12) * 12 * 4 };
    default:
      break;
  }
};

const StakingModal = ({
  style,
  tokenName,
  toggle,
  buyUrl,
  updateCountPerPeriod,
  checkAndStakeToken,
  updateWalletAmount,
  aprValue,
  aprValuePeriodically,
  walletBalance,
  walletAmount,
  lockTime,
}) => {
  const defaultPill = pills[7];
  const [selectedChip, setSelectedChip] = useState(defaultPill);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const MAX_BALANCE = 500000;

  const openInNewWindow = (url) => {
    const newWindow = window.open(url);
  };

  const toMax4Decimals = (x) => {
    return +x.toFixed(2);
  };

  const setMaxAmount = () => {
    walletBalance < MAX_BALANCE ? updateWalletAmount(walletBalance) : updateWalletAmount(MAX_BALANCE);
  };
  useEffect(() => {
    updateCountPerPeriod(countsPerPeriod(selectedChip, aprValue));
  }, [aprValue]);

  return (
    <>
      <Button
        buttonStyle="btnStyle"
        onClick={() => {
          if (Number(walletBalance) !== 0) {
            setIsModalOpen(true);
            toggle && toggle();
            setSelectedChip(defaultPill);
            updateCountPerPeriod(countsPerPeriod(defaultPill, aprValue));
          } else {
            toast.error("No tokens available for staking");
          }
        }}
        // disabled={Number(walletBalance) === 0}
        style={style}
      >
        Stake &#43;
      </Button>

      <Modal
        isOpen={isModalOpen}
        centered
        toggle={() => {
          setIsModalOpen(false);
          toggle && toggle();
        }}
      >
        <ModalHeader
          toggle={() => {
            setIsModalOpen(false);
            toggle && toggle();
          }}
        >
          Stake {tokenName}
        </ModalHeader>
        <ModalBody>
          <div className={styles.infoText}>
            <div>Token Balance : {utils.commify(toMax4Decimals(parseFloat(walletBalance)))}</div>
          </div>
          <div className={styles.inputSection}>
            <Input
              type="text"
              placeholder="Enter Amount"
              className={styles.input}
              value={walletAmount}
              onChange={(e) => updateWalletAmount(e.target.value)}
            />
            <Button style={{ marginLeft: "5px" }} buttonStyle="btnStyle" onClick={() => setMaxAmount()}>
              Max
            </Button>
          </div>
          <div className={styles.infoText + " mt-3"}>
            <div>
              Estimated APR : <span className={styles.percentage}>{aprValuePeriodically ? aprValuePeriodically.toFixed(5) : 0.0}%</span>
            </div>
          </div>
          <div className={styles.pills}>
            {pills.map((option) => {
              const style =
                selectedChip && selectedChip === option ? { border: "1px solid #007bff", color: "#ffffff", backgroundColor: "#007bff" } : {};
              return (
                <div>
                  <button
                    key={option}
                    value={option}
                    style={style}
                    className={option === selectedChip ? styles.activePill : ""}
                    onClick={(e) => {
                      setSelectedChip(e.target.value);
                      updateCountPerPeriod(countsPerPeriod(e.target.value, aprValue));
                    }}
                  >
                    {option}
                  </button>
                </div>
              );
            })}
          </div>
          <div className={styles.buttonSection + " mt-2"}>
            <Button
              buttonStyle="btnStyle2"
              buttonSize="largeBtn"
              onClick={() => {
                checkAndStakeToken();
              }}
            >
              Stake
            </Button>
            <Button
              buttonStyle="btnStyle3"
              style={{ marginTop: "10px" }}
              onClick={() => {
                openInNewWindow(buyUrl);
              }}
            >
              Buy {tokenName}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default StakingModal;
