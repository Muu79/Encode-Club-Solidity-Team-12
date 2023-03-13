import Sidebar from '@/components/Sidebar';
import ClientProvider from './ClientProvider';
import './globals.css';

export const metadata = {
	title: {
		default: 'Voting Dapp',
		template: '%s | Voting Dapp',
	},
	description: 'Team-12 app for week-4 assignment',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className='flex'>
				<ClientProvider>
					<Sidebar />
					{children}
				</ClientProvider>
			</body>
		</html>
	);
}
