import { NextResponse } from 'next/server';

export async function POST(request: Request) {}

export async function GET(request: Request, { params }: any) {
	try {
		const address = params.pars[0];
		const amount = params.pars[1];
		const body = JSON.stringify({ to: address, amount: Number(amount) });
		console.log(body);
		const res = await fetch('http://localhost:3000/mint', {
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
