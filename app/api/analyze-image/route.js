// File: app/api/analyze-image/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { imageUrl } = await request.json();
        if (!imageUrl) {
            return new Response('Image data is missing', { status: 400 });
        }

        const authToken = process.env.POLLINATIONS_API_TOKEN;
        if (!authToken) {
            return new Response('Server configuration error: API token missing.', { status: 500 });
        }

        const payload = {
            model: "openai",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Describe this image for a text-to-image prompt. Be descriptive and artistic, focus on visual details. Respond only with the prompt text." },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                }
            ],
            stream: true
        };
        
        // Langsung panggil API eksternal karena ini sudah di sisi server
        const externalResponse = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Token digunakan di sini
            },
            body: JSON.stringify(payload)
        });

        if (!externalResponse.ok) {
            const errorText = await externalResponse.text();
            console.error('External API Error in analyze-image:', errorText);
            return new Response(`External API failed: ${externalResponse.statusText}`, { status: externalResponse.status });
        }
        
        // Teruskan respons streaming langsung ke client
        return new Response(externalResponse.body, {
            headers: { 
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
             }
        });

    } catch (error) {
        console.error('Internal API Error in analyze-image:', error);
        return new Response('Failed to process the request on the server.', { status: 500 });
    }
}