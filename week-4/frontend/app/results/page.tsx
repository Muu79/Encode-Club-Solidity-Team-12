'use client'
import Results, { Result } from "@/components/Results";
import { useEffect, useState } from "react";

const page = () => {
	const [resultArray, setResArr] = useState<Result[]>([]);
	const [winner, setWinner] = useState<Result>({
		name: "",
		index: 0,
		voteTotal: ""
	});

	useEffect(() => {
		const getResults = async () => {
			const response = await fetch('./api/get-proposals/route.ts');
			const data = await response.json();
			const proposals = data.response.proposals;
			let localWinner : Result = {
				name: "",
				index: 0,
				voteTotal: ""
			};

			setResArr(proposals.map((proposal: { name: string, votes: string }, index: number) => {
				if (localWinner.name === "" || Number(localWinner.voteTotal) < Number(proposal.votes)) localWinner = {
					voteTotal: proposal.votes,
					index: index,
					name: proposal.name
				};

				return {
					name: proposal.name,
					voteTotal: proposal.votes,
					index: index,
				}
			}))

			setWinner(localWinner);

		}
		getResults();
	}, [])
	return (
		<div className="flex flex-col w-full mt-10">
			<h1 className="text-5xl text-center">Results Page</h1>
			<Results results={resultArray} />
			<h1 className="text-center flex flex-col m-5">
				{winner.voteTotal !== "" &&
					(<>
						<span className="m-3 text-3xl">The winner is {winner?.name}</span>
						<span className="m-3 text-3xl">With a vote total of {winner?.voteTotal}</span>
					</>)}
			</h1>
		</div>
	);
};

export default page;
