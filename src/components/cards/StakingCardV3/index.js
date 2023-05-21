import React, { useState } from "react";
import { toast } from "react-toastify";
import { utils } from "ethers";
import { Collapse } from "reactstrap";

import styles from "./StakingCardV3.module.css";
import tokenIcon from "../../../assets/images/AIFIN-token-logo.jpg";

import TokenIcon from "../../common/TokenIcon";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { toMax2Decimals, toMax4Decimals } from "./utils";

function StakingCardV3({
  tokenName,
  aprValue,
  stakeAmount,
  totalStakers,
  walletBalance,
  updateWalletAmount,
  poolSize,
  checkAndStakeToken,
  checkAndHarvestToken,
  checkAndUnstake,
  walletAmount,
  totalEarned,
  totalPending,
  rewardTokenPriceUSD,
  buyUrl = "",
  cardTitle,
  stakingFee,
  unstakingFee,
  lockingPeriod,
}) {
  const [isStakeSelected, setIsStakeSelected] = useState(true);

  const onStakeToggle = (isStake) => {
    setIsStakeSelected(isStake);
    updateWalletAmount("");
  };

  const setMaxStakeAmount = () => {
    updateWalletAmount(walletBalance);
  };

  const setMaxUnstakeAmount = () => {
    updateWalletAmount(stakeAmount);
  };

  const [isRulesOpen, setRulesOpen] = useState(false);

  const rulesToggle = (e) => {
    setRulesOpen(e);
  };

  const openInNewWindow = (url) => {
    window.open(url);
  };

  return (
    <>
      <div className={styles.stakingCard + " card mx-2"}>
        <div className="container">
          <div className="row">
            <div className="col-12 mt-2">
              <div className="d-inline">
                <TokenIcon image={tokenIcon} />
              </div>
              <p className={styles.displayTokenName}>{cardTitle ?? `STAKE ${tokenName}`}</p>
            </div>
            <hr className={styles.hrTag} />
          </div>
          <div className="row justify-content-between">
            <div className="col-6 mt-3">
              <div className={styles.tokenInfo + " text-center"}>
                <p className="mb-0">APY</p>
                <p style={{ color: "#5B46F9" }}>{aprValue}%</p>
              </div>
            </div>
            <div className="col-6 mt-3">
              <div className={styles.tokenInfo + " text-center"}>
                <p className="mb-0">Total Stakers</p>
                <p style={{ color: "#5B46F9" }}>{totalStakers || 0}</p>
              </div>
            </div>
          </div>
          <div className="row justify-content-between">
            <div className="col-6 mt-3">
              <div className={styles.tokenInfo + " text-center"}>
                <p className="mb-0">Pool Size</p>
                <p style={{ color: "#5B46F9" }}>{poolSize || 0.0}</p>
              </div>
            </div>
            <div className="col-6 mt-3">
              <div className={styles.tokenInfo + " text-center"}>
                <p className="mb-0">{tokenName} Staked</p>
                <p style={{ color: "#5B46F9" }}>{stakeAmount || "0.0"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className="container-fluid">
            <div className="row">
              <div className={"col-12 text-center p-0 m-0"}>
                <div className={styles.LogicContent}>
                  <div className={styles.flexRow}>
                    <div
                      className={`${isStakeSelected ? styles.activeStakeFlex : styles.stakeFlex}`}
                      onClick={() => {
                        onStakeToggle(true);
                      }}
                    >
                      STAKE
                    </div>
                    <div
                      className={`${!isStakeSelected ? styles.activeUnstakeFlex : styles.unstakeFlex}`}
                      onClick={() => {
                        onStakeToggle(false);
                      }}
                    >
                      UNSTAKE
                    </div>
                  </div>
                  <div className={styles.cardContent + " p-4"}>
                    <div className={`${!isStakeSelected ? "" : styles.unStake}` + " mt-lg-3 mt-2"}>
                      <div className="row justify-content-around">
                        <p className="mb-1 mt-1 text-start" style={{ color: "#ffff" }}>
                          Total {tokenName} staked:&nbsp;{toMax4Decimals(parseFloat(stakeAmount))}
                        </p>
                        <div className="col-8 col-sm-9">
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            className={styles.InputAmount}
                            value={walletAmount}
                            onChange={(e) => updateWalletAmount(e.target.value)}
                          />
                        </div>
                        <div className="col-4 col-sm-3">
                          <button className={styles.MaxButton} onClick={() => setMaxUnstakeAmount()}>
                            Max
                          </button>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className={styles.userTokenInfo + " col-12"}>
                          <div className={styles.subHeaderLight}>Unstaking fee: {unstakingFee}%</div>
                        </div>
                      </div>
                      <div className="row mt-3 justify-content-around">
                        <div className="col-12">
                          <button
                            className={styles.WithdrawBTN}
                            onClick={() => {
                              checkAndUnstake();
                            }}
                          >
                            Withdraw
                          </button>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className={styles.userTokenInfo + " col-6"}>
                          <div className={styles.subHeaderLight}>{tokenName} EARNED</div>
                          <div>{totalEarned}</div>
                          <div>~ {Number(totalEarned) ? (Number(totalEarned) * rewardTokenPriceUSD).toFixed(11) : 0.0} USD</div>
                        </div>
                        <div className={styles.userTokenInfo + " col-6"}>
                          <div className={styles.subHeaderLight}>{tokenName} PENDING</div>
                          <div>{totalPending}</div>
                          <div>~ {Number(totalPending) ? (Number(totalPending) * rewardTokenPriceUSD).toFixed(11) : 0.0} USD</div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-8">
                          <ConfirmationModal
                            message={"Are you sure you want to claim pending tokens?"}
                            style={{ minWidth: "100px" }}
                            onConfirm={() => {
                              if (Number(totalPending) !== 0) {
                                checkAndHarvestToken();
                              } else {
                                toast.error("Pending Amount is Null");
                              }
                            }}
                          >
                            <button className={styles.HarvestBTN}>Harvest</button>
                          </ConfirmationModal>
                        </div>
                        <div className="col-4 p-1">
                          <button className={styles.RulesBTN} onClick={() => rulesToggle(!isRulesOpen)}>
                            Rules & Benefits {isRulesOpen ? <i className="bi bi-chevron-up" /> : <i className="bi bi-chevron-down" />}
                          </button>
                        </div>
                        <div className="col-12 " style={{ color: "#fff" }}>
                          <Collapse isOpen={isRulesOpen}>
                            <ol className=" mt-3 text-start">
                              <li>All rewards will be given in {tokenName} tokens and users can easily claim those rewards or harvest it.</li>
                              <li>User reward are available instantaneously at any time.</li>
                            </ol>
                          </Collapse>
                        </div>
                      </div>
                    </div>
                    <div id="stake" className={`${isStakeSelected ? "" : styles.stake}` + " mt-lg-3 mt-2"}>
                      <div className="row justify-content-around">
                        <p className="mb-1 mt-1 text-start" style={{ color: "#ffff" }}>
                          Wallet {tokenName} balance: {utils.commify(toMax2Decimals(parseFloat(walletBalance)))}
                        </p>
                        <div className="col-8 col-sm-9">
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            className={styles.InputAmount}
                            value={walletAmount}
                            onChange={(e) => updateWalletAmount(e.target.value)}
                          />
                        </div>
                        <div className="col-4 col-sm-3">
                          <button className={styles.MaxButton} onClick={() => setMaxStakeAmount()}>
                            Max
                          </button>
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className={styles.userTokenInfo + " col-12"}>
                          <div className={styles.subHeaderLight}>Locking period: {lockingPeriod}</div>
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className={styles.userTokenInfo + " col-12"}>
                          <div className={styles.subHeaderLight}>Staking fee: {stakingFee}%</div>
                        </div>
                      </div>
                      <div className="row justify-content-around mt-3">
                        <div className="col-12 ">
                          <button
                            className={styles.DepositeBTN}
                            onClick={() => {
                              checkAndStakeToken();
                            }}
                          >
                            Deposit
                          </button>
                        </div>
                        <div className="col-8 mt-4">
                          <button className={styles.BuyforwardBTN} onClick={() => openInNewWindow(buyUrl)}>
                            Buy {tokenName}
                          </button>
                        </div>
                        <div className="col-4 mt-4 p-1">
                          <button className={styles.RulesBTN} onClick={() => rulesToggle(!isRulesOpen)}>
                            Rules & Benefits {isRulesOpen ? <i className="bi bi-chevron-up" /> : <i className="bi bi-chevron-down" />}
                          </button>
                        </div>
                        <div className="col-12 " style={{ color: "#fff" }}>
                          <Collapse isOpen={isRulesOpen}>
                            <ol className=" mt-3 text-start">
                              <li>All rewards will be given in {tokenName} tokens and users can easily claim those rewards or harvest it.</li>
                              <li>User reward are available instantaneously at any time.</li>
                            </ol>
                          </Collapse>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StakingCardV3;
