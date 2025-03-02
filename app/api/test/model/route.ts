import { modelSchema } from '@/libs/schemas';
import { z } from 'zod';

import { serverModelRecord } from '../../../../libs/server';

export const preferredRegion = 'hnd1';

const apiSchema = z.object({
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

  if (!(body.config.type in serverModelRecord)) {
    throw new Error('Invalid model type');
  }

  const serverModel = new serverModelRecord[body.config.type](body.config);

  return serverModel.stream(body.messages);
};
