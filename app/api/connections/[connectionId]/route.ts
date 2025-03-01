import { connectionSchema, updateConnectionSchema } from '@/libs/schemas';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

export const PATCH = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      connectionId?: string;
    }>;
  },
) => {
  const rawBody = (await request.json()) as unknown;
  const { connectionId } = await params;
  const bodyParsedResult = updateConnectionSchema.safeParse(rawBody);
  if (!bodyParsedResult.success || typeof connectionId !== 'string') {
    console.error(bodyParsedResult.error, { connectionId });
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
  const oldConnectionIndex = connections.findIndex((c) => c.id === connectionId);
  if (oldConnectionIndex === -1) {
    return new Response('Connection not found', {
      status: 404,
    });
  }

  const currentDate = new Date().toISOString();
  const updatedConnections = [...connections];
  const updatedConnection = {
    ...updatedConnections[oldConnectionIndex],
    ...body,
    updatedAt: currentDate,
  };
  updatedConnections[oldConnectionIndex] = updatedConnection;

  await redis.set('connections', updatedConnections);

  return NextResponse.json(updatedConnection, { status: 201 });
};

export const DELETE = async (
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      connectionId?: string;
    }>;
  },
) => {
  const { connectionId } = await params;
  if (typeof connectionId !== 'string') {
    return new Response('Invalid request payload', {
      status: 400,
    });
  }

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
  const oldConnectionIndex = connections.findIndex((c) => c.id === connectionId);
  if (oldConnectionIndex === -1) {
    return new Response('Connection not found', {
      status: 404,
    });
  }

  const updatedConnections = connections.filter((c) => c.id !== connectionId);

  await redis.set('connections', updatedConnections);

  return NextResponse.json({ id: connectionId }, { status: 200 });
};
