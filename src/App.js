import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Swap from "./components/SwapV2";
import Tokens from "./components/Tokens";
import { useConnect, useAccount, useNetwork, useDisconnect } from "wagmi";
import { WHITELISTED_USERS } from "./common.service";

function App() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  return (
    <div className="App">
      <Header />
      <div className="mainWindow d-flex">
        {address && WHITELISTED_USERS.indexOf(address) === -1 ? (
          <div className="tradeBox mt-5 text-dark">
            <div className="m-auto">
              <h4>Your wallet is not allowed.</h4>
              <p>Please reach out to community admins.</p>
            </div>
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
