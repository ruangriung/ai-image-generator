// File: app/api/analyze-image/route.js

import { NextResponse } from 'next/server';

// Mendapatkan URL absolut untuk API proxy internal
function getApiProxyUrl(request) {
    const host = request.headers.get('host');
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    return `${protocol}://${host}/api/proxy`;
}

export async function POST(request) {
    try {
        const { imageUrl } = await request.json();
        if (!imageUrl) {
            return new Response('Image data is missing', { status: 400 });
        }

        const payload = {
            model: "openai", // Model yang sesuai untuk analisis gambar
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Describe this image for a text-to-image prompt. Be descriptive and artistic, focus on visual details. Respond only with the prompt text." },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                }
            ],
            stream: true // Aktifkan streaming untuk respons yang lebih cepat
        };
        
        // Panggil rute proxy internal kita
        const internalProxyUrl = getApiProxyUrl(request);
        const proxyResponse = await fetch(internalProxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!proxyResponse.ok) {
            const errorText = await proxyResponse.text();
            console.error('Internal Proxy Error:', errorText);
            return new Response(`Internal proxy failed: ${proxyResponse.statusText}`, { status: proxyResponse.status });
        }
        
        // Teruskan respons streaming dari proxy ke client
        return new Response(proxyResponse.body, {
            headers: { 
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
             }
        });

    } catch (error) {
        console.error('Analyze Image API Error:', error);
        return new Response('Failed to process the request on the server.', { status: 500 });
    }
}