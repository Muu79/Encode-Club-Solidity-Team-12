import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();
const etherscanApi = process.env.ETHERSCAN_API_KEY;
const alchemyApi = process.env.ALCHEMY_API_KEY;

const config: HardhatUserConfig = {
	paths: { tests: "tests" },
	solidity: {
		version: "0.8.18",
		settings: {
			optimizer: {
				enabled: false,
				runs: 0,
			},
		},
	},
	etherscan: {
		apiKey: etherscanApi,
	},
	networks: {
		goerli: {
			url: `https://eth-goerli.g.alchemy.com/v2/${alchemyApi}`,
		},
		mumbai: {
			url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyApi}`,
		},
	},
};

export default config;
