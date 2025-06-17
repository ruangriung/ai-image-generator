// Nama File: app/api/analyze-image/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { imageUrl } = await request.json();
        if (!imageUrl) {
            return new Response('Image data is missing', { status: 400 });
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
            stream: true // Aktifkan streaming
        };
        
        const externalResponse = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!externalResponse.ok) {
            const errorText = await externalResponse.text();
            console.error('External API Error:', errorText);
            return new Response(`External API failed: ${externalResponse.statusText}`, { status: externalResponse.status });
        }
        
        // Kembalikan respons streaming langsung ke klien
        return new Response(externalResponse.body, {
            headers: { 
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
             }
        });

    } catch (error) {
        console.error('Internal API Error:', error);
        return new Response('Failed to process the request on the server.', { status: 500 });
    }
}