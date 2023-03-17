import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
	paths: { tests: "tests" },
	solidity: "0.8.18",
	networks: {
		goerli: {
			url: "https://rpc.ankr.com/eth_goerli",
      		accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
		}
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	}
}

export default config;
