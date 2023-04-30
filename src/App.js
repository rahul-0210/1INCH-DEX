import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import { useConnect, useAccount, useNetwork, useDisconnect } from "wagmi";
import { WHITELISTED_USERS } from "./common.service";

function App() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  return (
    <div className="App">
      <Header />
      <div className="mainWindow">
        {WHITELISTED_USERS.indexOf(address) === -1 ? (
          <div className="tradeBox mt-5 ">
            <h4 className="text-dark m-auto pb-2">
              Only whitelisted users allowed.
            </h4>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <Swap
                  isConnected={isConnected}
                  address={address}
                  chain={chain}
                />
              }
            />
            <Route path="/tokens" element={<Tokens />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
