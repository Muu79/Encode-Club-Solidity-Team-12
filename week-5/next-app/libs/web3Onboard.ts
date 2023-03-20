import injectedModule from '@web3-onboard/injected-wallets';
import { init } from '@web3-onboard/react';

const injected = injectedModule({
	custom: [
		// include custom injected wallet modules here
	],
	filter: {
		// mapping of wallet labels to filter here
	},
});

const INFURA_KEY = "b1dc31e112b047bdb5cc423a35504b99";

export default init({
	// An array of wallet modules that you would like to be presented to the user to select from when connecting a wallet.
	wallets: [injected],
	// An array of Chains that your app supports
	chains: [
		{
			// hex encoded string, eg '0x1' for Ethereum Mainnet
			id: '0x5',
			token: 'GoerliETH',
			label: 'Goerli test network',
			publicRpcUrl: 'https://goerli.infura.io/v3/',
			blockExplorerUrl: 'https://goerli.etherscan.io/',
			// used for network requests
			rpcUrl: `https://goerli.infura.io/v3/${INFURA_KEY}`,
		},
	],
	appMetadata: {
		name: 'Lottery',
		icon: '/twelve.svg',
		logo: '/Team.svg',
		description: 'Early Team-12 week-5 Voting project',
		explore:
			'https://goerli.etherscan.io/address/0xac26890f3f57596df13c3087ff3d40b21e57d9d0#code',
		gettingStartedGuide:
			'https://github.com/Muu79/Encode-Club-Solidity-Team-12/tree/main/week-5',
		recommendedInjectedWallets: [
			{ name: 'MetaMask', url: 'https://metamask.io' },
		],
	},
});
