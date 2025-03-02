import { Store } from '@/libs/server/store';
import { waitUntil } from '@vercel/functions';

import { serverAppRecord, serverModelRecord } from '../../../../libs/server';

export const preferredRegion = 'hnd1';

export const POST = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{ webhookId?: string }>;
  },
) => {
  const { webhookId } = await params;
  if (typeof webhookId !== 'string') {
    return new Response('Invalid request', {
      status: 400,
    });
  }

  const store = new Store(true);
  const connections = await store.getConnections();

  const connection = connections.find((c) => c.id === webhookId) ?? null;
  if (connection === null) {
    return new Response('Webhook not found', {
      status: 404,
    });
  }

  const serverModel = new serverModelRecord[connection.model.type](connection.model);
  const serverApp = new serverAppRecord[connection.app.type](connection.app, request, serverModel);

  const validateResult = await serverApp.validateWebhookRequest();
  if (!validateResult) {
    return new Response('Invalid request', {
      status: 401,
    });
  }

  waitUntil(
    serverApp.processWebhookRequest().catch((error: unknown) => {
      console.error(error);
    }),
  );

  // return new Response('OK', { status: 200 });
  return await serverApp.acknowledgeWebhookRequest();
};
