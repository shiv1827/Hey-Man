import { StreamingTextResponse, Message } from 'ai'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  })

  const response = await anthropic.beta.messages.create({
    max_tokens: 1024,
    messages: messages.map((m: Message) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
    model: 'claude-3-sonnet-20240229',
  })

  // Convert the response to a streaming response
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(response.content)
      controller.close()
    },
  })

  return new StreamingTextResponse(stream)
}
