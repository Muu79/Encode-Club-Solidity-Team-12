'use client';
import { WalletState } from '@web3-onboard/core';
import { useState, createContext, useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Metamask from './Metamask';

export type Web3ContextType = {
	connected: boolean;
	setConnected: (value: boolean) => void;
	wallets: WalletState[] | null;
};

// const Web3Context = createContext<Web3ContextType | null>(null);

const Web3Context = createContext({
	connected: false,
	setConnected: (value: boolean) => {},
	wallets: [] as WalletState[] | undefined,
	setWallets: (value: WalletState[]) => {},
});
export const useWeb3Context = () => {
	return useContext(Web3Context);
};

export default function ClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [connected, setConnected] = useState(false);
	const [wallets, setWallets] = useState<WalletState[]>();

	return (
		<Web3Context.Provider
			value={{ connected, setConnected, wallets, setWallets }}
		>
			<Metamask />
			<Toaster />
			{children}
		</Web3Context.Provider>
	);
}
