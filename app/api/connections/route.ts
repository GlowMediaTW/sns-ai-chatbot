import { rawConnectionSchema } from '@/libs/schemas';
import { Store } from '@/libs/store';
import { NextResponse } from 'next/server';

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

  const store = new Store(false);
  const connections = await store.getConnections();
  const currentDate = new Date().toISOString();
  const newConnection = { ...body, createdAt: currentDate, updatedAt: currentDate };
  connections.push(newConnection);
  await store.setConnections(connections);

  return NextResponse.json(newConnection, { status: 201 });
};
