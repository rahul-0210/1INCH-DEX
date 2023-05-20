import React, { useState, useEffect } from "react";
import { Collapse } from "reactstrap";
import { utils } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { toast } from "react-toastify";
import { useContractCall, useEthers } from "@usedapp/core";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import styles from "./FarmingCard.module.css";
import notFound from "../../../assets/images/token-placeholder.png";
import LpTokenAbi from "../../../views/Farming/abi/LPToken.json";
import MasterchefAbi from "../../../views/Farming/abi/Masterchef.json";
import tokenList from "../../../views/Farming/utils/tokenPrices.json";

import ConfirmationModal from "../../modals/ConfirmationModal";

import { calculateLiquidity, calculateApr } from "../../../views/Farming/utils/farmUtils";
import { depositFarmingFunction, withdrawFarmingFunction } from "../../../views/Farming/services/FarmingContractService";
import { approveAllowanceFunction } from "../../../views/Farming/services/TokenContractService";
import { getTokenDecimals } from "../../../views/Farming/services/LpContractService";
import TokenPairIcon from "../../common/TokenPairIcon";

const FarmingCard = ({
  pool: {
    id,
    earned,
    mulitplier,
    farmName,
    walletBalance,
    stakedValue,
    token0,
    token1,
    token0Name,
    token1Name,
    allowedAllowance,
    stakeFee,
    lpTokenAddress,
    allocPoint,
    farmingAddress,
    token0Liquidity,
    token1Liquidity,
    totalAllocPoint,
  },
  tokenPriceData,
  tokenPrice,
  currentBlockTime,
  rewardPerBlock,
  buyUrl,
  lockingPeriod,
  cardTitle,
  stakingFee,
  unstakingFee,
  chainId
}) => {
  const [liquidityValue, setLiquidityValue] = useState(0);
  const [farmApr, setFarmApr] = useState(0);
  const [img0, setImg0] = useState(notFound);
  const [img1, setImg1] = useState(notFound);
  const [inputAmount, setInputAmount] = useState("");
  const [isStakeSelected, setIsStakeSelected] = useState(true);
  const [isRulesOpen, setRulesOpen] = useState(false);
  
  const lpTokenDecimals = useContractCall(getTokenDecimals(LpTokenAbi, lpTokenAddress));
  const amountInWei = inputAmount && utils.parseUnits(inputAmount.toString(), lpTokenDecimals?.[0]);
  const farmingContractConfig = {
    address: farmingAddress,
    abi: MasterchefAbi,
  };

  const {write: deposit} = useContractWrite({
    ...farmingContractConfig,
    functionName: depositFarmingFunction,
    args: [id, amountInWei],
  });
  const {write: harvest} = useContractWrite({
    ...farmingContractConfig,
    functionName: depositFarmingFunction,
    args: [id, utils.parseUnits("0", lpTokenDecimals?.[0])]
  });

  const {write: withdraw} = useContractWrite({
    ...farmingContractConfig,
    functionName: withdrawFarmingFunction,
    args: [id, amountInWei],
  });

  const {write: approve} = useContractWrite({
    address: lpTokenAddress,
    abi: LpTokenAbi,
    functionName: approveAllowanceFunction,
    args: [farmingAddress, BigNumber.from(2).pow(256).sub(1)],
    onSettled(data, error) {
      if (error) toast.error(error.message);
      else {
        deposit();
        onModelToggle();
      }
    },
  });

  const onModelToggle = () => {
    setInputAmount("");
  };

  const changeEnteredAmount = (e) => {
    if (isNaN(e.target.value)) {
      return;
    }
    setInputAmount(e.target.value);
  };

  const checkAndStake = () => {
    if (parseFloat(inputAmount) <= parseFloat(walletBalance)) {
      if (parseFloat(allowedAllowance) > 0 && parseFloat(allowedAllowance) > parseFloat(inputAmount)) {
        deposit()
        onModelToggle();
      } else {
        approve()
      }
    } else {
      toast.error("Not enough tokens");
    }
  };

  const checkAndUnstake = () => {
    if (parseFloat(inputAmount) > 0) {
      if (parseFloat(inputAmount) <= parseFloat(stakedValue)) {
        withdraw()
        onModelToggle();
      } else {
        toast.error("Not enough tokens");
      }
    }
  };

  const maxStake = () => {
    setInputAmount(walletBalance);
  };

  const maxUnstake = () => {
    setInputAmount(stakedValue);
  };

  const fetchImage0 = async (symbol) => {
    if (symbol) {
      const url = tokenList.find((item) => item.symbol === symbol && item.chainId === chainId)?.icon;
      setImg0(url);
    }
  };

  const fetchImage1 = async (symbol) => {
    if (symbol) {
      const url = tokenList.find((item) => item.symbol === symbol && item.chainId === chainId)?.icon;
      setImg1(url);
    }
  };

  const openInNewWindow = (url) => {
    window.open(url);
  };

  useEffect(() => {
    const calculation = async () => {
      let tokenLiquidity = await calculateLiquidity(token0, token1, tokenPriceData, token0Liquidity, token1Liquidity, chainId);
      setLiquidityValue(parseFloat(tokenLiquidity.token0) + parseFloat(tokenLiquidity.token1));
    }
    calculation()
  }, [token0Liquidity, token1Liquidity]);

  useEffect(() => {
    const calculation = async () => {
      let apr = await calculateApr(tokenPrice, currentBlockTime, parseFloat(rewardPerBlock), liquidityValue, allocPoint, totalAllocPoint);
      setFarmApr(apr);
    }
    calculation()
  }, [liquidityValue]);

  useEffect(() => {
    fetchImage0(token0Name);
    fetchImage1(token1Name);
  }, [token0Name, token1Name]);

  // useEffect(() => {
  //   if (approveFunction.state.status === "Success") {
  //     stake();
  //   }
  // }, [approveFunction.state]);

  return (
    <>
      <div className={styles.stakingCard + " card"}>
        <div className="container">
          <div className="row">
            <div className="col-12 mt-2 d-flex align-items-center">
              <div>
                <TokenPairIcon image1={img0} image2={img1} />
              </div>
              <p className={styles.displayTokenName}>{cardTitle ?? farmName}</p>
            </div>
            <hr className={styles.hrTag} />
          </div>
          <div className="row justify-content-between">
            <div className="col-6 mt-3">
              <div className={styles.tokenInfo + " text-center"}>
                <p className="mb-0">APR</p>
                <p style={{ color: "#5B46F9" }}>{farmApr ? farmApr.toFixed(2) : 0}%</p>
              </div>
            </div>
            <div className="col-6 mt-3">
              <div className={styles.tokenInfo + " text-center"}>
                <p className="mb-0">{farmName} STAKED</p>
                <p style={{ color: "#5B46F9" }}>{stakedValue && stakedValue}</p>
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
                        setIsStakeSelected(true);
                      }}
                    >
                      STAKE
                    </div>

                    <div
                      className={`${!isStakeSelected ? styles.activeUnstakeFlex : styles.unstakeFlex}`}
                      onClick={() => {
                        setIsStakeSelected(false);
                      }}
                    >
                      UNSTAKE
                    </div>
                  </div>
                  <div className={styles.cardContent + " p-4"}>
                    <div className={`${!isStakeSelected ? "" : styles.unStake}` + " mt-lg-3 mt-2"}>
                      <div className="row justify-content-around">
                        <p className="mb-1 mt-1 text-start" style={{ color: "#fff" }}>
                          Total {farmName} staked:&nbsp;{stakedValue}
                        </p>
                        <div className="col-8 col-sm-9">
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            className={styles.InputAmount}
                            value={inputAmount}
                            onChange={(e) => changeEnteredAmount(e)}
                          />
                        </div>
                        <div className="col-4 col-sm-3">
                          <button className={styles.MaxButton} onClick={() => maxUnstake()}>
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
                          <div className={styles.subHeaderLight}>PENDING:&nbsp;{earned ?? 0}</div>
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="col-8">
                          <ConfirmationModal
                            message={"Are you sure you want to claim pending tokens?"}
                            style={{ margin: "5px", minWidth: "100px" }}
                            onConfirm={() => {
                              if (Number(earned) !== 0) {
                                harvest();
                              } else {
                                toast.error("Pending Amount is Null");
                              }
                            }}
                          >
                            <button className={styles.HarvestBTN}>Harvest</button>
                          </ConfirmationModal>
                        </div>
                        <div className="col-4 p-1 py-2">
                          <button className={styles.RulesBTN} onClick={() => setRulesOpen(!isRulesOpen)}>
                            Rules & Benefits {isRulesOpen ? <i className="bi bi-chevron-up" /> : <i className="bi bi-chevron-down" />}
                          </button>
                        </div>
                        <div className="col-12 " style={{ color: "#fff" }}>
                          <Collapse isOpen={isRulesOpen}>
                            <ol className=" mt-2 text-start">
                              <li>Opting for a longer staking period will earn a better APR.</li>
                              <li>All rewards are paid in AIFIN tokens.</li>
                              <li>User rewards are available instantaneously at any time.</li>
                              <li>Users are not allowed to unstake their staked tokens until the redemption date is over.</li>
                            </ol>
                          </Collapse>
                        </div>
                      </div>
                    </div>
                    <div id="stake" className={`${isStakeSelected ? "" : styles.stake}` + " mt-lg-3 mt-2"}>
                      <div className="row justify-content-around">
                        <p className="mb-1 mt-1 text-start" style={{ color: "#fff" }}>
                          Wallet {farmName} balance: {walletBalance}
                        </p>
                        <div className="col-8 col-sm-9">
                          <input
                            type="text"
                            placeholder="Enter Amount"
                            className={styles.InputAmount}
                            value={inputAmount}
                            onChange={(e) => changeEnteredAmount(e)}
                          />
                        </div>
                        <div className="col-4 col-sm-3">
                          <button className={styles.MaxButton} onClick={() => maxStake()}>
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
                        <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                          <button
                            className={styles.DepositeBTN}
                            onClick={() => {
                              checkAndStake();
                            }}
                          >
                            Deposit
                          </button>
                        </div>
                        <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                          <button className={styles.BuyforwardBTN} onClick={() => openInNewWindow(buyUrl)}>
                            Buy {farmName}
                          </button>
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
};

export default FarmingCard;
