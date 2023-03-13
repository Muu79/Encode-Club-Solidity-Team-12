'use client'
import Results, { Result } from "@/components/Results";
import { useEffect, useState } from "react";

const page = () => {
	const [resultArray, setResArr] = useState<Result[]>([]);

	useEffect(() => {
		const getResults = async () => {
			const response = await fetch('./api/get-proposals/route.ts');
			const data = await response.json();
			const proposals = data.response.proposals;
			console.log(proposals);

			setResArr(proposals.map((proposal: { name: string, votes: string }, index: number) => {
				return {
					name: proposal.name,
					voteTotal: proposal.votes,
					index: index,
				}
			}))


		}
		getResults();
	}, [])
	return (
		<div className="flex flex-col w-full mt-2">
			<h1 className="text-3xl text-center">Results Page</h1>
			<Results results={resultArray} />
		</div>
	);
};

export default page;
