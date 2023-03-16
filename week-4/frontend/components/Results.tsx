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
		<div className='inline-grid gird-cols-3 gap-2 w-100vw place-items-center'>
			{results.map((result) => (
				<Card>
					<h2>
						Proposal : {result.index} {result.name}
					</h2>
					<h4>Total Votes: {result.voteTotal.substring(0, 6)}</h4>
				</Card>
			))}
		</div>
	);
};

export default Results;
