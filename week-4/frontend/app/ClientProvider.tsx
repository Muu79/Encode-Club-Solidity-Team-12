'use client';
import { Toaster } from 'react-hot-toast';
import Connect from './Connect';

export default function ClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Connect />
			<Toaster />
			{children}
		</>
	);
}
