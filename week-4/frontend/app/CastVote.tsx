'use client';

import { InputField, PrimaryBtn } from '@/components/HtmlElements';

const CastVote = () => {
	return (
		<>
			<h2 className='text-xl text-left mb-3'>Vote</h2>
			<p>Cast your vote.</p>
			<InputField inputType='number' placeholder='Index of proposal' />
			<PrimaryBtn name='Cast Vote' />
		</>
	);
};

export default CastVote;
