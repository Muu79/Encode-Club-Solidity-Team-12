import './globals.css';

export const metadata = {
	title: {
		default: 'Lottery Dapp',
		template: '%s | Lottery Dapp',
	},
	description: 'Team-12 app for week-5 assignment',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}