import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.css';
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, WagmiConfig, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  arbitrum,
  arbitrumGoerli,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  fantom,
  fantomTestnet,
  foundry,
  gnosis,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  zkSync,
  zkSyncTestnet,
} from "wagmi/chains";

const { provider, webSocketProvider, chains } = configureChains(
  [
    avalanche,
    // avalancheFuji,
    bsc,
    // bscTestnet,
    fantom,
    // fantomTestnet,
    foundry,
    gnosis,
    // goerli,
    mainnet,
    optimism,
    // optimismGoerli,
    polygon,
    // polygonMumbai,
    zkSync,
    // zkSyncTestnet,
    arbitrum,
    // arbitrumGoerli,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'YFDAI DEX',
  projectId: process.env.REACT_APP_RAINBOW_ID,
  chains
});

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <HashRouter>
        <RainbowKitProvider modalSize="compact" chains={chains}>
          <App/>
        </RainbowKitProvider>
      </HashRouter>
    </WagmiConfig>
  </React.StrictMode>
);
