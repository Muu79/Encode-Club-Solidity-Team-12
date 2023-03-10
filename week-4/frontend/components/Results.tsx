import Link from 'next/link';
import { Card } from './HtmlElements';

export interface Result {
	name: string;
	index: number;
	voteTotal: string;
}
type Props = {
	results: Result[];
};
const Results = ({ results }: Props) => {
	return (
		<div className='grid lg:grid-cols-1 xl:grid-cols-1 gap-10 w-100vw place-items-center'>
			{results.map((result) => (
				<Card >
					<h2>Proposal : {result.index} {result.name}</h2>
					<h4>Total Votes: {result.voteTotal}</h4>
				</Card>
			))}
		</div>
	);
};

export default Results;
