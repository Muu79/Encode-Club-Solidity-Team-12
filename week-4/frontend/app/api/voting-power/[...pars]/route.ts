import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: any) {
	try {
		const ballotAddress = params.pars[0];
		const address = params.pars[1];

		const res = await fetch(
			`http://localhost:3000/voting-power?ballotAddress=${ballotAddress}&address=${address}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const data = await res.json();
		return NextResponse.json({ response: data });
	} catch (error) {
		return new Response('Error', { status: 500 });
	}
}
