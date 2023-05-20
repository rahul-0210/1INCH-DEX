import React, { useState } from "react";
import { useEthers } from "@usedapp/core";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import styles from "./NetworkSwitch.module.css";
// import PolygonIcon from "../../assets/images/matic.svg";
// import EthereumIcon from "../../assets/images/ethereum.svg";
// import BinanceIcon from "../../assets/images/bsc.svg";
import ArbitrumIcon from "../../assets/images/arbitrum.svg";

import Button from "../common/Button";
import { CONTRACT_ADDRESS } from "../../App.Config";

const NETWORK = {
  // 1: {
  //   chainId: 1,
  //   chainIdHex: "0x1",
  //   chainName: "Ethereum Mainnet",
  //   bgColor: "#103D8B",
  //   name: "Ethereum",
  //   icon: EthereumIcon,
  //   rpcURL: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
  // },
  // 137: {
  //   chainId: 137,
  //   chainIdHex: "0x89",
  //   chainName: "Polygon Mainnet",
  //   bgColor: "#C57FFC",
  //   name: "Polygon",
  //   icon: PolygonIcon,
  //   rpcURL: ["https://rpc-mainnet.maticvigil.com/"],
  // },
  // 56: {
  //   chainId: 56,
  //   chainIdHex: "0x38",
  //   chainName: "Binance Smart Chain",
  //   bgColor: "#f9a825",
  //   name: "BSC",
  //   icon: BinanceIcon,
  //   rpcURL: ["https://bsc-dataseed1.ninicoin.io"],
  // },
  42161: {
    chainId: 42161,
    chainIdHex: "0xA4B1",
    chainName: "Arbitrum One",
    bgColor: "#1e2022",
    name: "Arbitrum One",
    icon: ArbitrumIcon,
    rpcURL: ["https://arb1.arbitrum.io/rpc"],
  },
};

const NetworkSwitch = (props) => {
  const { chainId } = useEthers();
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const ethereum = window.ethereum;

  const { VALID_NETWORK } = CONTRACT_ADDRESS.STAKING[chainId] ?? false;

  const switchNetwork = async (selectedNetwork) => {
    let currentChainId = parseInt(chainId);

    if (currentChainId !== selectedNetwork.chainId) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: selectedNetwork.chainIdHex }],
        });
        setIsNetworkModalOpen(false);
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{ chainId: selectedNetwork.chainIdHex, rpcUrls: selectedNetwork.rpcURL, chainName: selectedNetwork.chainName }],
            });
            setIsNetworkModalOpen(false);
          } catch (addError) {
            setIsNetworkModalOpen(false);
          }
        }
      }
    } else {
      setIsNetworkModalOpen(false);
    }
  };

  return (
    <>
      {VALID_NETWORK ? (
        <Button buttonStyle="btnStyle2" onClick={() => setIsNetworkModalOpen(true)} {...props}>
          {NETWORK[chainId].name}
        </Button>
      ) : (
        <Button buttonStyle="btnStyle" onClick={() => setIsNetworkModalOpen(true)} {...props}>
          {chainId === 42161 ? "Arbitrum One" : "Switch your network"}
        </Button>
      )}

      {isNetworkModalOpen && (
        <Modal isOpen={isNetworkModalOpen} centered toggle={() => setIsNetworkModalOpen(false)} contentClassName={styles.modalWrapper}>
          <ModalHeader className={styles.modalHeader} toggle={() => setIsNetworkModalOpen(false)}>
            Select a Network
          </ModalHeader>
          <ModalBody className={styles.modalBody}>
            {NETWORK &&
              Object.keys(NETWORK).map((network) => {
                return (
                  <div
                    key={network}
                    className={parseInt(network) === chainId ? `${styles.active}` : `${styles.networkCard}`}
                    style={{ backgroundColor: NETWORK[network].bgColor }}
                    onClick={() => switchNetwork(NETWORK[network])}
                  >
                    <div style={{ backgroundColor: NETWORK[network].bgColor, borderRadius: "4px" }} className={styles.icon}>
                      <img src={NETWORK[network].icon} className={styles.networkIcon} alt="network logo" />
                    </div>
                    <div className={styles.name}>{NETWORK[network].name}</div>
                  </div>
                );
              })}
          </ModalBody>
        </Modal>
      )}
    </>
  );
};

export default NetworkSwitch;
