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
import { useBalance } from "wagmi";
import {
  BASE_URL,
  DEX_FEE,
  ETHEREUM_DATA,
  POLYGON_DATA,
  ARBITRUM_DATA,
  REFERRER_ADDRESS,
  WHITELISTED_USERS
} from "../common.service";

function Swap(props) {
  const { address, isConnected, chain } = props;
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenList, setTokenList] = useState({});
  const [filteredTokenList, setFilteredTokenList] = useState({});
  const [tokenOne, setTokenOne] = useState({});
  const [tokenTwo, setTokenTwo] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [debounce, setDebounce] = useState(tokenOneAmount);
  const [changeToken, setChangeToken] = useState(1);
  const [slippage, setSlippage] = useState(2.5);
  const [tokenValue, setTokenValue] = useState(null);
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState(search);
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
  const { data: token1Data } = useBalance({
    token: tokenOne?.address,
    address,
    chainId: chain?.id,
  });
  const { data: token2Data } = useBalance({
    token: tokenTwo?.address,
    address,
    chainId: chain?.id,
  });
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleSlippageChange = (e) => setSlippage(e.target.value);

  const changeAmount = (e) => {
    const { value } = e.target;
    if (isNaN(value)) return;
    setTokenOneAmount(value);
  };

  const switchTokens = () => {
    setTokenOneAmount("1");
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  };

  const openModal = (asset) => {
    setChangeToken(asset);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSearch("");
  };

  const modifyToken = (key) => {
    setTokenOneAmount("1");
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(tokenList[key]);
    } else {
      setTokenTwo(tokenList[key]);
    }
    setIsOpen(false);
    setSearch("");
  };

  const fetchPrices = async (amount, one, two, fee) => {
    const { data } = await axios.get(
      `${BASE_URL}${chain?.id}/quote?fromTokenAddress=${
        one.address
      }&toTokenAddress=${two.address}&amount=${(
        amount *
        10 ** one.decimals
      ).toLocaleString("fullwide", { useGrouping: false })}&fee=${fee}`
    );
    return data;
  };

  const fetchDexSwap = async () => {
    const allowance = await axios.get(
      `${BASE_URL}${chain?.id}/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
    );

    if (allowance.data.allowance === "0") {
      const approve = await axios.get(
        `${BASE_URL}${chain?.id}/approve/transaction?tokenAddress=${tokenOne.address}`
      );
      setTxDetails(approve.data);
      return;
    }
    const tx = await axios.get(
      `${BASE_URL}${chain?.id}/swap?fromTokenAddress=${
        tokenOne.address
      }&toTokenAddress=${tokenTwo.address}&amount=${(
        tokenOneAmount *
        10 ** 18
      ).toLocaleString("fullwide", {
        useGrouping: false,
      })}&fromAddress=${address}&slippage=${slippage}&referrerAddress=${REFERRER_ADDRESS}&fee=${DEX_FEE}`
    );
    // let decimals = Number(`1E${tokenTwo.decimals}`);
    // setTokenTwoAmount((Number(tx.data.toTokenAmount) / decimals).toFixed(2));
    setTxDetails(tx.data.tx);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounce(+tokenOneAmount);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [tokenOneAmount]);

  useEffect(() => {
    if (tokenOne && tokenTwo) {
      if (!debounce) setTokenTwoAmount(null);
      else {
        fetchPrices(tokenOneAmount, tokenOne, tokenTwo, DEX_FEE).then(
          (data) => {
            const token2Amount = (
              +data.toTokenAmount /
              10 ** tokenTwo.decimals
            ).toFixed(5);
            setTokenTwoAmount(token2Amount);
          }
        );
        fetchPrices(1, tokenTwo, tokenOne, 0).then((data) => {
          const tokenValue = (
            +data.toTokenAmount /
            10 ** tokenTwo.decimals
          ).toFixed(5);
          setTokenValue(tokenValue);
        });
      }
    }
  }, [debounce, tokenOne, tokenTwo]);

  useEffect(() => {
    const fetchTokenList = async () => {
      const { data } = await axios.get(`${BASE_URL}${chain?.id}/tokens`);
      if (chain?.id === 1) setTokenList({ ...ETHEREUM_DATA, ...data.tokens });
      else if (chain?.id === 137)
        setTokenList({ ...POLYGON_DATA, ...data.tokens });
      else if (chain?.id === 42161)
        setTokenList({ ...ARBITRUM_DATA, ...data.tokens });
      else setTokenList(data.tokens);
      const tokenOne = data.tokens[Object.keys(data.tokens)[1]];
      const tokenTwo = data.tokens[Object.keys(data.tokens)[2]];
      setTokenOne(tokenOne);
      setTokenTwo(tokenTwo);
      setTokenOneAmount("1");
      setTokenTwoAmount(null);
    };
    chain?.id && fetchTokenList();
  }, [chain?.id]);

  useEffect(() => {
    let filteredTokenList = {};
    if (Object.keys(tokenList).length > 0) {
      for (let key in tokenList) {
        if (
          search &&
          (tokenList[key]["address"]
            .toLowerCase()
            .includes(debounceSearch.toLowerCase()) ||
            tokenList[key]["name"]
              .toLowerCase()
              .includes(debounceSearch.toLowerCase()) ||
            tokenList[key]["symbol"]
              .toLowerCase()
              .includes(debounceSearch.toLowerCase()))
        ) {
          filteredTokenList[key] = tokenList[key];
        }
      }
      setFilteredTokenList(filteredTokenList);
    }
  }, [debounceSearch]);

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
    const handler = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

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
      {address && WHITELISTED_USERS.indexOf(address) === -1 ? (
        <div className="tradeBox mt-5 text-dark">
          <div className="m-auto">
            <h4>Your wallet is not allowed.</h4>
            <p>Please reach out to community admins.</p>
          </div>
        </div>
      ) : (
        <>
          <Modal
            open={isOpen}
            footer={null}
            onCancel={closeModal}
            title="Select a token"
          >
            <div className="modalContent">
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control form-control-lg mt-2"
              />
              {Object.keys(debounceSearch ? filteredTokenList : tokenList)
                .length > 0 ? (
                Object.keys(debounceSearch ? filteredTokenList : tokenList).map(
                  (key, i) => {
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
                          <div className="tokenTicker">
                            {tokenList[key].symbol}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <p className="text-center mt-2">No data found</p>
              )}
            </div>
          </Modal>
          <div className="tradeBox mt-5">
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
                  <Input
                    placeholder="0"
                    value={tokenTwoAmount}
                    disabled={true}
                  />
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
                    <p className="my-auto txtColor txtSize">
                      Balance: {+(+token1Data?.formatted).toFixed(3) || 0}
                    </p>
                    {+token1Data?.formatted > 0 && (
                      <span
                        onClick={() => setTokenOneAmount(token1Data?.formatted)}
                        className="maxBtn txtColor badge badge-pill badge-light my-auto"
                      >
                        MAX
                      </span>
                    )}
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
                    <p className="my-auto">
                      Balance: {+(+token2Data?.formatted).toFixed(3) || 0}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="txtColor txtSize mb-0 mt-1">
                    1 {tokenTwo.symbol} = {tokenValue} {tokenOne.symbol}
                  </p>
                </div>
                <div
                  className="swapButton"
                  disabled={!debounce || !isConnected}
                  onClick={fetchDexSwap}
                >
                  Swap
                </div>
          </div>
        </>
      )}
    </>
  );
}

export default Swap;
