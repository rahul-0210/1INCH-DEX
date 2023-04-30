import { ConnectButton } from '@rainbow-me/rainbowkit';

const ConnectWallet = () => {
    return (
        <div className="m-auto d-flex flex-column align-items-center justify-content-center">
          <h2 className="text-dark m-auto pb-2">Connect wallet</h2>
          <p className="text-secondary m-auto pb-3">Connect wallet to interact with dex</p>
          <ConnectButton/>
        </div>
    )
}

export default ConnectWallet;