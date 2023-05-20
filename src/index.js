import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter } from "react-router-dom";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, WagmiConfig, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { Arbitrum, DAppProvider } from "@usedapp/core";
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
import "./index.css";
import App from "./App";
import { RAINBOW_ID, ARBITRUM_PROVIDER } from "./common.service";
import { ReduxProvider } from "./reducers/index";

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
  appName: "YFDAI DEX",
  projectId: RAINBOW_ID,
  chains,
});

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors,
});

const config = {
  readOnlyChainId: Arbitrum.chainId,
  readOnlyUrls: {
    [Arbitrum.chainId]: ARBITRUM_PROVIDER,
  },
  connectors,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxProvider>
      <DAppProvider config={config}>
        <WagmiConfig client={client}>
          <HashRouter>
            <RainbowKitProvider modalSize="compact" chains={chains}>
              <App />
            </RainbowKitProvider>
          </HashRouter>
        </WagmiConfig>
      </DAppProvider>
    </ReduxProvider>
  </React.StrictMode>
);
