import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: any) {
	try {
		const to = params.to;

		const body = JSON.stringify({
			to: to,
		});
		console.log(body);
		const res = await fetch('http://localhost:3000/delegate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: body,
		});
		const data = await res.json();
		console.log(data);
		return NextResponse.json({ response: data });
	} catch (error) {
		return NextResponse.json({ response: error });
	}
}
