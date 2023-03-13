import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: any) {
	try {

		const ballotAddress = "0xc3B172c55e328E979cf2668C2eeE1c1b399e37D6"
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
