import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import ConnectWallet from "./ConnectWallet";
import { useBalance  } from 'wagmi'

function Swap(props) {
  const { address, isConnected, chain } = props;
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenList, setTokenList] = useState([]);
  const [tokenOne, setTokenOne] = useState({});
  const [tokenTwo, setTokenTwo] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [debounce, setDebounce] = useState(tokenOneAmount);
  const [changeToken, setChangeToken] = useState(1);
  const [slippage, setSlippage] = useState(2.5);
  const [tokenValue, setTokenValue] = useState(null)
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
  const { data: token1Data } = useBalance ({
      token: tokenOne?.address,
      address,
      chainId: chain?.id,
    })
  const { data: token2Data } = useBalance({
      token: tokenTwo?.address,
      address,
      chainId: chain?.id,
  })
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  function changeAmount(e) {
    const {value} = e.target;
    if (isNaN(value)) return;
    setTokenOneAmount(value);
  }

  function switchTokens() {
    setTokenOneAmount("1");
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(key) {
    setTokenOneAmount("1");
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[key]);
    } else {
      setTokenTwo(tokenList[key]);
    }
    setIsOpen(false);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
        setDebounce(+tokenOneAmount);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [tokenOneAmount]);

  useEffect(() => {
    if(tokenOne && tokenTwo){
        if(!debounce) setTokenTwoAmount(null);
        else {
            fetchPrices(tokenOneAmount, tokenOne, tokenTwo).then(data => {
                const token2Amount = (+data.toTokenAmount/(10**tokenTwo.decimals)).toFixed(5)
                setTokenTwoAmount(token2Amount)
            })
            fetchPrices(1, tokenTwo, tokenOne).then(data => {
                const tokenValue = (+data.toTokenAmount/(10**tokenTwo.decimals)).toFixed(5)
                setTokenValue(tokenValue)
            })
        }
    }
},[debounce, tokenOne, tokenTwo])

  const fetchPrices = async(amount, one, two) => {
    const { data } = await axios.get(
      `https://api.1inch.io/v5.0/${chain?.id}/quote?fromTokenAddress=${
        one.address
      }&toTokenAddress=${two.address}&amount=${(amount*10**one.decimals).toLocaleString('fullwide', {useGrouping:false})}&fee=2`);
      return data;
    }

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
      }&toTokenAddress=${tokenTwo.address}&amount=${(tokenOneAmount*10**18).toLocaleString('fullwide', {useGrouping:false})}&fromAddress=${address}&slippage=${slippage}&referrerAddress=0x48A1C4a492cc3D11Aa5E780aBC2e6dA4E04CC190&fee=2`
    );
    // let decimals = Number(`1E${tokenTwo.decimals}`);
    // setTokenTwoAmount((Number(tx.data.toTokenAmount) / decimals).toFixed(2));
    setTxDetails(tx.data.tx);
  }

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
      setTokenOneAmount("1");
      setTokenTwoAmount(null);
    };
    chain?.id && fetchTokenList();
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
                disabled={!tokenOne}
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
              <div className="token1Bal">
                <p className="my-auto txtColor txtSize">Balance: {+(+token1Data?.formatted).toFixed(3) || 0}</p>
                {+token1Data?.formatted > 0 && <span onClick={() => setTokenOneAmount(token1Data?.formatted)} className="maxBtn txtColor badge badge-pill badge-light my-auto">MAX</span>}
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
              <div className="token2Bal txtColor txtSize">
                <p className="my-auto">Balance: {+(+token2Data?.formatted).toFixed(3) || 0}</p>
              </div>
            </div>
            <div>
                <p className="txtColor txtSize mb-0">1 {tokenTwo.symbol} = {tokenValue} {tokenOne.symbol}</p>
            </div>
            <div
              className="swapButton"
              disabled={!debounce || !isConnected}
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
