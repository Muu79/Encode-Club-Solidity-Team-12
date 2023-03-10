import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  paths: { tests:"tests"},
  solidity: "0.8.17",
  networks: {
	  goerli: {
		  url: process.env.ALCHEMY_GOERLI_URL,
		  accounts: [process.env.PRIVATE_KEY],
	  },
  },
  etherscan: {
	  apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
