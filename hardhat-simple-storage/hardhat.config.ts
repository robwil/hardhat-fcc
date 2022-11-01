/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "./tasks/block-number";
import "hardhat-gas-reporter";
import "solidity-coverage";
dotenv.config({ path: __dirname + "/.env" });

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL!;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY!;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY!;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [GOERLI_PRIVATE_KEY],
      chainId: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
};

export default config;
