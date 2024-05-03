import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const privateKey =
  process.env.PRIVATE_KEY !== undefined
    ? process.env.PRIVATE_KEY
    : "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const sepolia =
  process.env.URL_SEPOLIA !== undefined
    ? process.env.URL_SEPOLIA
    : "http://127.0.0.1:8545";

const mumbai =
  process.env.URL_MUMBAI !== undefined
    ? process.env.URL_MUMBAI
    : "http://127.0.0.1:8545";

const etherscanKey =
  process.env.ETHERSCAN_KEY !== undefined ? process.env.ETHERSCAN_KEY : "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: sepolia,
      accounts: [`0x${privateKey}`],
    },
    mumbai: {
      url: mumbai,
      accounts: [`0x${privateKey}`],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: etherscanKey,
    },
  },
};

export default config;
