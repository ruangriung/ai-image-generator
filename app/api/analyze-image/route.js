import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { imageUrl } = await request.json();
        if (!imageUrl) {
            return new Response('Image data is missing', { status: 400 });
        }

        // Payload for the external API
        const payload = {
            model: "openai", // or another suitable model
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Describe this image for a text-to-image prompt. Be descriptive and artistic, focus on visual details. Respond only with the prompt text." },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                }
            ],
            stream: true // Enable streaming
        };
        
        // Fetch from the external API
        const externalResponse = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Check if the external API call was successful
        if (!externalResponse.ok) {
            const errorText = await externalResponse.text();
            console.error('External API Error:', errorText);
            return new Response(`External API failed: ${externalResponse.statusText}`, { status: externalResponse.status });
        }
        
        // Return the streaming response directly to the client
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
