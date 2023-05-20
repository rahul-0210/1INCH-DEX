import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Swap from "./components/SwapV2";
import Tokens from "./components/Tokens";
import { useConnect, useAccount, useNetwork, useDisconnect } from "wagmi";
import { WHITELISTED_USERS } from "./common.service";
import StakingList from "./views/StakingList"
import FarmingList from "./views/FarmingList";

function App() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
            <Route path="/stake" element={<StakingList account={address} chainId={chain?.id} />} />
            <Route path="/farm" element={<FarmingList account={address} chainId={chain?.id} />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
