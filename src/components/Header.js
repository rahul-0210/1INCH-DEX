import React from "react";
import { Link, useLocation  } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
// import Logo from "../moralis-logo.svg";
import Logo from "../assets/Logo.png"

function Header() {
  const location = useLocation();
  const path = location.pathname.split("/")[1]
  return (
    <header>
      <div className="leftH">
        <img src={Logo} alt="logo" width={120} />
      </div>
      <div className="d-flex">
        <Link to="/" className="link px-1">
          <div className={`headerItem ${path === "" ? "headerItemActive" : ""}`}>Swap</div>
        </Link>
        <Link to="/stake" className="link px-1">
          <div className={`headerItem ${path === "stake" ? "headerItemActive" : ""}`}>Stake</div>
        </Link>
        <Link to="/farm" className="link px-1">
          <div className={`headerItem ${path === "farm" ? "headerItemActive" : ""}`}>Farm</div>
        </Link>
      </div>
      <div className="rightH">
        <ConnectButton
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
        />
      </div>
    </header>
  );
}

export default Header;
