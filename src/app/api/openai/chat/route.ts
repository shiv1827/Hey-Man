import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response('OpenAI API key not configured', { status: 500 });
    }

    const { messages } = await req.json();

    if (!messages) {
      return new Response('Messages are required', { status: 400 });
    }

    // Ask OpenAI for a streaming chat completion using GPT-4 given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: messages.map((message: any) => ({
        content: message.content,
        role: message.role,
      })),
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return new Response(
      `Error: ${error.message || 'An error occurred during your request.'}`,
      { status: 500 }
    );
  }
}
