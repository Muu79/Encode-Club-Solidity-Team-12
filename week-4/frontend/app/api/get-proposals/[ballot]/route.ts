import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: any) {
	try {
		const ballotAddress = params.ballot;

		//body: JSON.stringify({ballotAddress: "0x9B93774789584f3c665202Ee0609dDEfF5Cfee30"})
		const res = await fetch(
			`http://localhost:3000/get-proposals?ballotAddress=${ballotAddress}`,
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
