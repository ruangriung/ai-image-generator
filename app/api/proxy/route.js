// File: app/api/proxy/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Ambil seluruh payload asli dari client
    const payload = await request.json();

    // Pastikan ada payload
    if (!payload) {
      return NextResponse.json({ error: 'Request body is missing' }, { status: 400 });
    }

    // Ambil token rahasia dari environment variable di server
    const authToken = process.env.POLLINATIONS_API_TOKEN;

    if (!authToken) {
        console.error("POLLINATIONS_API_TOKEN is not set on the server.");
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Teruskan permintaan ke API Pollinations dengan menambahkan header otorisasi
    const externalResponse = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // Token rahasia digunakan di sini
      },
      body: JSON.stringify(payload) // Teruskan payload asli
    });

    // Periksa apakah respons mendukung streaming
    const contentType = externalResponse.headers.get('content-type');
    if (contentType && contentType.includes('text/event-stream')) {
      // Jika streaming, teruskan body stream langsung ke client
      return new Response(externalResponse.body, {
        status: externalResponse.status,
        statusText: externalResponse.statusText,
        headers: { 'Content-Type': 'text/event-stream' }
      });
    }

    // Jika bukan streaming, kembalikan sebagai JSON
    const data = await externalResponse.json();
    return NextResponse.json(data, { status: externalResponse.status });

  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}