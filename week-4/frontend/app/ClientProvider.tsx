'use client';
import { Toaster } from 'react-hot-toast';
import Metamask from './Metamask';

import { Web3OnboardProvider } from '@web3-onboard/react';
import web3Onboard from '@/libs/web3Onboard';

export default function ClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Web3OnboardProvider web3Onboard={web3Onboard}>
			<Metamask />
			<Toaster />
			{children}
		</Web3OnboardProvider>
	);
}
