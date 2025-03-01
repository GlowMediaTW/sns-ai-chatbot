import { createGroq } from '@ai-sdk/groq';
import { WebhookRequestBody, messagingApi, validateSignature } from '@line/bot-sdk';
import { Redis } from '@upstash/redis';
import { waitUntil } from '@vercel/functions';
import { generateText } from 'ai';
import { headers } from 'next/headers';
import { z } from 'zod';

import { connectionSchema } from '../../../../libs/schemas';

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
  const connection = connections.find((c) => c.id === webhookId) ?? null;
  if (connection === null) {
    return new Response('Webhook not found', {
      status: 404,
    });
  }

  const headersList = await headers();

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (connection.app.type === 'line') {
    const rawBody = await request.text();
    const signature = headersList.get('x-line-signature');
    if (
      signature === null ||
      !validateSignature(rawBody, connection.app.channelSecret, signature)
    ) {
      return new Response('Invalid signature', {
        status: 401,
      });
    }

    waitUntil(
      (async () => {
        try {
          const webhookEvent = JSON.parse(rawBody) as WebhookRequestBody;
          for (const event of webhookEvent.events) {
            if (event.type === 'message') {
              const messageEvent = event;
              if (messageEvent.message.type === 'text') {
                const input = messageEvent.message.text;

                let output = '';
                if (connection.model.type === 'groq') {
                  const groq = createGroq({
                    apiKey: connection.model.apiKey,
                  });

                  try {
                    const result = await generateText({
                      model: groq(connection.model.modelName),
                      messages: [{ role: 'user', content: input }],
                      temperature: connection.model.temperature,
                    });
                    output = result.text;
                  } catch (error) {
                    console.error(error);
                    output =
                      'An error occurred. Please try again later or check your configuration.';
                  }
                }

                const client = new messagingApi.MessagingApiClient({
                  channelAccessToken: connection.app.channelAccessToken,
                });

                await client.replyMessage({
                  replyToken: messageEvent.replyToken,
                  messages: [
                    {
                      type: 'text',
                      text: output,
                    },
                  ],
                });
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      })(),
    );

    return new Response('OK', { status: 200 });
  } else {
    throw new Error('Invalid app type');
  }
};
