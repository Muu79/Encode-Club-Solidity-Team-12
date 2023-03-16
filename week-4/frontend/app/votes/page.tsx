'use client';
import { Card, PrimaryBtn } from '@/components/HtmlElements';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from 'react-spinkit';
import styles from '../page.module.css';
import { FiRefreshCw } from 'react-icons/fi';
interface Votes {
	proposalName: string;
	amountVoted: string;
	totalVotes: string;
}

const page = () => {
	const [loading, setLoading] = useState(true);
	const [results, setResults] = useState<Votes[] | null>(null);
	async function showRecent(ballotAddress: string) {
		const notification = toast.loading(
			`Fetching recent votes for ${ballotAddress.substring(0, 6)}`
		);
		try {
			const res = await fetch(`api/recent-votes/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			});
			const resp = await res.json();
			const data = resp.response;
			console.log(data);
			//let resultArray: Votes = []
			//if(data.length > 0) {
			//	for (const iterator of data) {
			//		resultArray.push(iterator)
			//	}
			//}
			setResults(data);
			setLoading(false);
			toast.success('Done!', { id: notification });
		} catch (error) {
			toast.error('Whoops... Try again!', { id: notification });
		}
	}
	useEffect(() => {
		showRecent(
			process.env.NEXT_PUBLIC_CONTRACT ||
				'0x9B93774789584f3c665202Ee0609dDEfF5Cfee30'
		);

		return () => {};
	}, []);
	const RecentVote = () => {
		return (
			<div className={styles.center}>
				{loading ? (
					<div className={styles.grid}>Failed try again!</div>
				) : (
					<div className={styles.grid}>
						<div className={styles.description}>
							<div className='text-2xl font-bold text-left mb-3'>
								{'Recent Votes'}
								<button
									className='z-2 cursor-pointer mr-1'
									onClick={async () => {
										await showRecent(
											process.env.NEXT_PUBLIC_CONTRACT ||
												'0x9B93774789584f3c665202Ee0609dDEfF5Cfee30'
										);
									}}
								>
									<FiRefreshCw size={25} />
								</button>
							</div>
						</div>
						{results!.map((result) => (
							<div className={styles.description}>
								<div className={styles.card}>
									<h2 className='text-xl text-left mb-3'>
										Proposal : {result.proposalName}
									</h2>
									<p>Amount : {result.amountVoted.substring(0, 6)}</p>
									<p>
										Total Votes of proposal: {result.totalVotes.substring(0, 6)}
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	return (
		<main className={styles.main}>
			{loading ? (
				<div className={styles.center}>
					<Spinner name='cube-grid' fadeIn='none' color='indigo' />
				</div>
			) : (
				<RecentVote />
			)}
		</main>
	);
};

export default page;
