import React from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
// import Logo from "../moralis-logo.svg";
import Logo from "../assets/Logo.png"

function Header(props) {
  const { address, isConnected, connect, chain } = props;
  return (
    <header>
      <div className="leftH">
        <img src={Logo} alt="logo" width={120} />
      </div>
      {/* <div className="d-flex">
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>
        <Link to="/tokens" className="link">
          <div className="headerItem">Tokens</div>
        </Link>
      </div> */}
      <div className="rightH">
        <ConnectButton
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
        />
          {/* <div className="headerItem">{chain}</div>
        <div className="connectButton" onClick={connect}>
          {isConnected ? address.slice(0, 6) + "..." + address.slice(38) : "Connect Wallet"}
        </div> */}
      </div>
    </header>
  );
}

export default Header;
