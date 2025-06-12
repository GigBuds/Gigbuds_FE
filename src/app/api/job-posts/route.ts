import fetchApi from '@/api/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    console.log('Received body in API route:', body);
    const response = await fetchApi.post('job-posts', body);
    console.log('API response:', response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Job post API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  const response = await fetchApi.put(`job-posts/${id}`, body);
  return NextResponse.json(response, { status: 200 });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const response = await fetchApi.get(`job-posts/${id}`);
  return NextResponse.json(response, { status: 200 });
}
