import { modelSchema } from '@/libs/schemas';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export const apiSchema = z.object({
  messages: z.array(
    z.object({
      role: z.union([z.literal('user'), z.literal('assistant')]),
      content: z.string(),
    }),
  ),
  config: modelSchema,
});

export const POST = async (request: Request) => {
  const rawBody = (await request.json()) as unknown;
  const bodyParsedResult = apiSchema.safeParse(rawBody);
  if (!bodyParsedResult.success) {
    return new Response('Invalid request payload', {
      status: 400,
    });
  }
  const body = bodyParsedResult.data;

  let model: Parameters<typeof streamText>[0]['model'];
  if (body.config.type === 'groq') {
    const groq = createGroq({
      apiKey: body.config.apiKey,
    });
    model = groq(body.config.modelName);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (body.config.type === 'openai') {
    const openai = createOpenAI({
      apiKey: body.config.apiKey,
    });
    model = openai(body.config.modelName);
  } else {
    throw new Error('Invalid model type');
  }

  const result = streamText({
    model,
    messages: body.messages,
    temperature: body.config.temperature,
  });

  return result.toDataStreamResponse();
};
