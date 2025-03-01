import { connectionSchema, rawConnectionSchema } from '@/libs/schemas';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

export const POST = async (request: Request) => {
  const rawBody = (await request.json()) as unknown;
  const bodyParsedResult = rawConnectionSchema.safeParse(rawBody);
  if (!bodyParsedResult.success) {
    console.error(bodyParsedResult.error);
    return new Response('Invalid request payload', {
      status: 400,
    });
  }
  const body = bodyParsedResult.data;

  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  const connections: z.infer<typeof connectionSchema>[] = await redis
    .get('connections')
    .then((data) => z.array(connectionSchema).parse(data))
    .catch((error: unknown) => {
      console.error(error);
      return [];
    });
  const currentDate = new Date().toISOString();
  const newConnection = { ...body, createdAt: currentDate, updatedAt: currentDate };
  connections.push(newConnection);
  await redis.set('connections', connections);

  return NextResponse.json(newConnection, { status: 201 });
};
