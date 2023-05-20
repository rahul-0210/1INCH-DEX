export const VALID_APP_NETWORK = [42161];
export const DEFAULT_NETWORK_ERROR = "Switch to Arbitrum network";

export const CURRENT_CHAIN_BLOCK_TIME = {
  42161: { BLOCK_TIME: 15 }, //Arbitrum One
};

export const CONTRACT_ADDRESS = {
  FARMING: {
    42161: [
      {
        CONTRACT: "0x60967246b3b6d997b8e8123866a9226d69c365db",
        VALID_NETWORK: true,
        BUY_URL: "https://app.camelot.exchange/?token1=0xbE8bAD7FEdB9a012295CBC2f018994dC43b32A24&token2=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        LOCKING_PERIOD: "30 days",
        TITLE: "AI Alpha",
        STAKING_FEE: "0.5",
        UNSTAKING_FEE: "2",
      },
      {
        CONTRACT: "0xc9731ea6efbbba411a3e97cb95aa0ac66c500850",
        VALID_NETWORK: true,
        BUY_URL: "https://app.camelot.exchange/?token1=0xbE8bAD7FEdB9a012295CBC2f018994dC43b32A24&token2=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        LOCKING_PERIOD: "90 days",
        TITLE: "AI Beta",
        STAKING_FEE: "0.5",
        UNSTAKING_FEE: "1.5",
      },
      {
        CONTRACT: "0xe1cBB4e2fB7A01F229711C035a07C5ba57663f9d",
        VALID_NETWORK: true,
        BUY_URL: "https://app.camelot.exchange/?token1=0xbE8bAD7FEdB9a012295CBC2f018994dC43b32A24&token2=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        LOCKING_PERIOD: "180 days",
        TITLE: "AI Gamma",
        STAKING_FEE: "0.5",
        UNSTAKING_FEE: "1.25",
      },
      {
        CONTRACT: "0x4D3Fb5041E8e7cf11BCA3c9628334c66a02C476e",
        VALID_NETWORK: true,
        BUY_URL: "https://app.camelot.exchange/?token1=0xbE8bAD7FEdB9a012295CBC2f018994dC43b32A24&token2=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        LOCKING_PERIOD: "365 days",
        TITLE: "AI Ultimate",
        STAKING_FEE: "0.5",
        UNSTAKING_FEE: "0.5",
      },
    ],
  },
  STAKING: {
    42161: [
      {
        CONTRACT: "0xcefc9e4836770bec72c1e8737ce77c5768ba66fd",
        TOKEN: "0xbe8bad7fedb9a012295cbc2f018994dc43b32a24",
        TOKEN_NAME: "AIFIN",
        BUY_URL: "https://app.camelot.exchange/?token1=0xbE8bAD7FEdB9a012295CBC2f018994dC43b32A24&token2=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        TOKEN_PRICE_USD: 0.001389, //fallback price
        REWARD_TOKEN_PRICE_USD: 0.001389, //fallback price
        LOCKING_PERIOD: "3 days",
        TITLE: "Alpha Stake",
      },
      {
        CONTRACT: "0x2b6474fe3e8e2b69daceeb43c029aa8f62513c75",
        TOKEN: "0xbe8bad7fedb9a012295cbc2f018994dc43b32a24",
        TOKEN_NAME: "AIFIN",
        BUY_URL: "https://app.camelot.exchange/?token1=0xbE8bAD7FEdB9a012295CBC2f018994dC43b32A24&token2=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        TOKEN_PRICE_USD: 0.001389, //fallback price
        REWARD_TOKEN_PRICE_USD: 0.001389, //fallback price
        TITLE: "Beta Stake",
        LOCKING_PERIOD: "180 days",
      },
      {
        CONTRACT: "0xa0951b413db4f13548B0c47BE301A860579e4b88",
        TOKEN: "0xbe8bad7fedb9a012295cbc2f018994dc43b32a24",
        TOKEN_NAME: "AIFIN",
        BUY_URL: "https://app.camelot.exchange/?token1=0xbE8bAD7FEdB9a012295CBC2f018994dC43b32A24&token2=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        TOKEN_PRICE_USD: 0.001389, //fallback price
        REWARD_TOKEN_PRICE_USD: 0.001389, //fallback price
        TITLE: "Gamma Stake",
        LOCKING_PERIOD: "365 days",
      },
    ],
  },
};

export const ALLOWED_NETWORKS = {
  FARMING: VALID_APP_NETWORK,
  STAKING: VALID_APP_NETWORK,
};

export const IS_DEVICE_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const LIVE_COIN_WATCH_API_KEY = "91291a6b-d272-4779-8535-d84891224ac1"; //Ref: https://www.livecoinwatch.com/tools/api
