declare global {
	namespace NodeJS {
		interface ProcessEnv {
			MNEMONIC: string;
			PRIVATE_KEY: string;
			INFURA_API_KEY: string;
			INFURA_API_SECRET: string;
			ALCHEMY_API_KEY: string;
			ETHERSCAN_API_KEY: string;
		}
	}
}

export {};
