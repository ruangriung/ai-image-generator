// Nama File: app/api/analyze-image/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { imageUrl } = await request.json();
        if (!imageUrl) {
            return NextResponse.json({ error: 'Data gambar tidak ditemukan' }, { status: 400 });
        }
        
        const payload = {
            model: "openai",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Describe this image for a text-to-image prompt. Be descriptive and artistic, focus on visual details." },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                }
            ],
            max_tokens: 500
        };

        const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('External API Error:', errorText);
            return NextResponse.json({ error: `API eksternal gagal: ${response.statusText}` }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error) {
        console.error('Internal API Error:', error);
        return NextResponse.json({ error: 'Gagal memproses permintaan di server.' }, { status: 500 });
    }
}