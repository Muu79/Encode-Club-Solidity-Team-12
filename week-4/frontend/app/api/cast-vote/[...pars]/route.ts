import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: any) {
	try {
		const ballotAddress = params.pars[0];
		const proposal = params.pars[1];
		const amount = params.pars[2];
		const body = JSON.stringify({
			ballotAddress: ballotAddress,
			proposal: proposal,
			amount: amount,
		});
		console.log(body);
		const res = await fetch('http://localhost:3000/cast-vote', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: body,
		});

		return new Response(res.body, { status: 201 });
	} catch (error) {
		return NextResponse.json({ response: error });
	}
}
