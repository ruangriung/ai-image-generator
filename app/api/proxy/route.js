// File: app/api/proxy/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload) {
      return NextResponse.json({ error: 'Request body is missing' }, { status: 400 });
    }

    const authToken = process.env.POLLINATIONS_API_TOKEN;

    if (!authToken) {
      console.error("POLLINATIONS_API_TOKEN is not set on the server.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const externalResponse = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    // Cek jika respons adalah streaming
    const contentType = externalResponse.headers.get('content-type');
    if (contentType && contentType.includes('text/event-stream')) {
      return new Response(externalResponse.body, {
        status: externalResponse.status,
        statusText: externalResponse.statusText,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    }

    // Jika bukan streaming, handle sebagai JSON biasa
    if (!externalResponse.ok) {
        const errorBody = await externalResponse.text();
        console.error("External API Error:", errorBody);
        // Coba parsing sebagai JSON, jika gagal, kirim sebagai teks biasa
        try {
            return NextResponse.json(JSON.parse(errorBody), { status: externalResponse.status });
        } catch {
            return new Response(errorBody, { status: externalResponse.status });
        }
    }

    const data = await externalResponse.json();
    return NextResponse.json(data, { status: externalResponse.status });

  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}