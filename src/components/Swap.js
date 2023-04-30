import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import Moralis from "moralis";
import ConnectWallet from "./ConnectWallet";

function Swap(props) {
  const { address, isConnected, chain } = props;
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenList, setTokenList] = useState([]);
  const [tokenOne, setTokenOne] = useState({});
  const [tokenTwo, setTokenTwo] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [slippage, setSlippage] = useState(2.5);
  const [prices, setPrices] = useState(null);
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });
  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    },
  });
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  function changeAmount(e) {
    if (isNaN(e.target.value)) return;
    setTokenOneAmount(e.target.value);
    if (e.target.value && prices) {
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2));
    } else {
      setTokenTwoAmount(null);
    }
  }

  function switchTokens() {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPrices(two.address, one.address);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(key) {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[key]);
      fetchPrices(tokenList[key]?.address, tokenTwo.address);
    } else {
      setTokenTwo(tokenList[key]);
      fetchPrices(tokenOne.address, tokenList[key]?.address);
    }
    setIsOpen(false);
  }

  async function fetchPrices(one, two) {
    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: one,
      chain: `0x${chain?.id.toString(16)}`,
    });
    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: two,
      chain: `0x${chain?.id.toString(16)}`,
    });
    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
    };
    setPrices(usdPrices);
  }

  // 0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9

  async function fetchDexSwap() {
    const allowance = await axios.get(
      `https://api.1inch.io/v5.0/${chain?.id}/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
    );

    if (allowance.data.allowance === "0") {
      const approve = await axios.get(
        `https://api.1inch.io/v5.0/${chain?.id}/approve/transaction?tokenAddress=${tokenOne.address}`
      );
      setTxDetails(approve.data);
      return;
    }
    const tx = await axios.get(
      `https://api.1inch.io/v5.0/${chain?.id}/swap?fromTokenAddress=${
        tokenOne.address
      }&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.padEnd(
        tokenOne.decimals + tokenOneAmount.length,
        "0"
      )}&fromAddress=${address}&slippage=${slippage}&referrerAddress=0x48A1C4a492cc3D11Aa5E780aBC2e6dA4E04CC190&fee=2`
    );
    let decimals = Number(`1E${tokenTwo.decimals}`);
    setTokenTwoAmount((Number(tx.data.toTokenAmount) / decimals).toFixed(2));
    setTxDetails(tx.data.tx);
  }

  // useEffect(() => {
  //   fetchPrices(tokenList?.[0]?.address, tokenList?.[1]?.address);
  // }, []);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction();
    }
  }, [txDetails]);

  useEffect(() => {
    message.destroy();
    if (isLoading) {
      message.open({
        type: "loading",
        content: "Transaction is Pending...",
        duration: 0,
      });
    }
  }, [isLoading]);

  useEffect(() => {
    message.destroy();
    if (isSuccess) {
      message.open({
        type: "success",
        content: "Transaction Successful",
        duration: 1.5,
      });
    } else if (txDetails.to) {
      message.open({
        type: "error",
        content: "Transaction Failed",
        duration: 1.5,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    const startMoralis = async () => {
      await Moralis.start({
        apiKey: process.env.REACT_APP_MORALIS_KEY,
      });
    };
    startMoralis();
  }, []);

  useEffect(() => {
    const fetchTokenList = async () => {
      const { data } = await axios.get(
        `https://api.1inch.io/v5.0/${chain?.id}/tokens`
      );
      if (chain?.id === 1) {
        const tokenData = {
          "0xf4cd3d3fda8d7fd6c5a500203e38640a70bf9577": {
            address: "0xf4cd3d3fda8d7fd6c5a500203e38640a70bf9577",
            decimals: 18,
            logoURI:
              "https://tokens.1inch.io/0xf4cd3d3fda8d7fd6c5a500203e38640a70bf9577.png",
            name: "YfDAI.finance",
            symbol: "YF-DAI",
          },
        };
        setTokenList({ ...tokenData, ...data.tokens });
      } else if (chain?.id === 137) {
        const tokenData = {
          "0x7e7ff932fab08a0af569f93ce65e7b8b23698ad8": {
            address: "0x7e7ff932fab08a0af569f93ce65e7b8b23698ad8",
            decimals: 18,
            logoURI:
              "https://tokens.1inch.io/0xf4cd3d3fda8d7fd6c5a500203e38640a70bf9577.png",
            name: "YfDAI.finance",
            symbol: "YF-DAI",
          },
          "0xd0cfd20e8bbdb7621b705a4fd61de2e80c2cd02f": {
            address: "0xd0cfd20e8bbdb7621b705a4fd61de2e80c2cd02f",
            decimals: 18,
            logoURI:
              "https://assets.coingecko.com/coins/images/20769/small/GBpj6TpI.png?1638362807",
            name: "Safeswap SSGTX",
            symbol: "SSGTX",
          },
        };
        setTokenList({ ...tokenData, ...data.tokens });
      } else setTokenList(data.tokens);
      const tokenOne = data.tokens[Object.keys(data.tokens)[1]];
      const tokenTwo = data.tokens[Object.keys(data.tokens)[2]];
      setTokenOne(tokenOne);
      setTokenTwo(tokenTwo);
      setPrices(null);
      setTokenOneAmount(null);
      setTokenTwoAmount(null);
      fetchPrices(tokenOne.address, tokenTwo.address);
    };
    fetchTokenList();
  }, [chain?.id]);

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      {/* {contextHolder} */}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList &&
            Object.keys(tokenList).map((key, i) => {
              return (
                <div
                  className="tokenChoice"
                  key={i}
                  onClick={() => modifyToken(key)}
                >
                  <img
                    src={tokenList[key].logoURI}
                    alt={tokenList[key].symbol}
                    className="tokenLogo"
                  />
                  <div className="tokenChoiceNames">
                    <div className="tokenName">{tokenList[key].name}</div>
                    <div className="tokenTicker">{tokenList[key].symbol}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </Modal>
      <div className="tradeBox mt-5">
        {!isConnected ? (
          <ConnectWallet />
        ) : (
          <>
            <div className="tradeBoxHeader">
              <h4>Swap</h4>
              <Popover
                content={settings}
                title="Settings"
                trigger="click"
                placement="bottomRight"
              >
                <SettingOutlined className="cog" />
              </Popover>
            </div>

            <div className="inputs">
              <Input
                placeholder="0"
                value={tokenOneAmount}
                onChange={changeAmount}
                disabled={!prices}
              />
              <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
              <div className="switchButton" onClick={switchTokens}>
                <ArrowDownOutlined className="switchArrow" />
              </div>
              <div className="assetOne" onClick={() => openModal(1)}>
                {tokenOne.logoURI ? (
                  <img
                    src={tokenOne?.logoURI}
                    alt="icon"
                    className="assetLogo"
                  />
                ) : (
                  "Token 1"
                )}
                {tokenOne?.symbol}
                <DownOutlined />
              </div>
              <div className="assetTwo" onClick={() => openModal(2)}>
                {tokenTwo.logoURI ? (
                  <img
                    src={tokenTwo?.logoURI}
                    alt="icon"
                    className="assetLogo"
                  />
                ) : (
                  "Token 2"
                )}
                {tokenTwo?.symbol}
                <DownOutlined />
              </div>
            </div>
            <div
              className="swapButton"
              disabled={!tokenOneAmount || !isConnected}
              onClick={fetchDexSwap}
            >
              Swap
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Swap;
