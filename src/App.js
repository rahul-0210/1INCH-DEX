import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Swap from "./components/SwapV2";
import { useAccount, useNetwork } from "wagmi";
import StakingList from "./views/StakingList";
import FarmingList from "./views/FarmingList";
import ConnectWallet from "./components/ConnectWallet";
import ComingSoon from "./components/ComingSoon";

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
        {!isConnected ? (
          <div className="tradeBox mt-5">
            <ConnectWallet />
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
            <Route
              path="/stake"
              element={<ComingSoon />}
              // element={<StakingList account={address} chainId={chain?.id} />}
            />
            <Route
              path="/farm"
              element={<ComingSoon />}
              // element={<FarmingList account={address} chainId={chain?.id} />}
            />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
