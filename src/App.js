import "./App.css";
import { Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { useConnect, useAccount, useNetwork, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

function App({chains}) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  const {disconnect} = useDisconnect()

  return (
    <div className="App">
      <Header connect={isConnected ? disconnect : connect} isConnected={isConnected} address={address} chain={chain?.name} />
      <div className="mainWindow">
        <Router basename="/"  >
        <Routes>
          <Route path="/" element={<Swap isConnected={isConnected} address={address} chain={chain} />} />
          <Route path="/tokens" element={<Tokens />} />
        </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
