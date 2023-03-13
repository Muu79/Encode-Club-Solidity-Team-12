import Link from 'next/link';

interface Result {
	url: string;
	id: string;
	txid: string;
	amount: string;
}
type Props = {
	results: Result[];
};
const Results = ({ results }: Props) => {
	return (
		<div className='grid lg:grid-cols-2 xl:grid-cols-2 gap-5 w-full'>
			{results.map((result) => (
				<Link href={result.url} key={result.txid}>
					Transaction #{result.id}
					<div>{result.amount}</div>
				</Link>
			))}
		</div>
	);
};

export default Results;
