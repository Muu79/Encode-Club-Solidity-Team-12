import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		const res = await fetch(`http://localhost:3000/recent-votes`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await res.json();
		return NextResponse.json({ response: data });
	} catch (error) {
		return new Response('Error', { status: 500 });
	}
}
