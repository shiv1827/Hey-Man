import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!process.env.ELEVENLABS_API_KEY) {
      console.error('ElevenLabs API key is missing');
      return new Response('ElevenLabs API key not configured', { status: 500 });
    }

    // Log the request being made (without the API key)
    console.log('Making request to ElevenLabs API with text length:', text.length);

    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      // Get the error details from the response
      const errorText = await response.text();
      console.error('ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Stream the audio data directly
    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error: any) {
    console.error('Detailed error in TTS route:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return new Response(
      `Error: ${error.message || 'An error occurred during your request.'}`,
      { status: 500 }
    );
  }
} 