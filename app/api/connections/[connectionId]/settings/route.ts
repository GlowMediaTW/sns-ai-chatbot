import { connectionSettingsSchema } from '@/libs/schemas';
import { Store } from '@/libs/server/store';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  RESTPostAPIApplicationCommandsJSONBody,
  RouteBases,
  Routes,
} from 'discord-api-types/v10';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export const POST = async (
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
  const bodyParsedResult = connectionSettingsSchema.safeParse(rawBody);
  if (!bodyParsedResult.success || typeof connectionId !== 'string') {
    console.error(bodyParsedResult.error, { connectionId });
    return new Response('Invalid request payload', {
      status: 400,
    });
  }
  const body = bodyParsedResult.data;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (body.type === 'register-discord-commands') {
    const store = new Store(true);
    const connections = await store.getConnections();

    const connection = connections.find((c) => c.id === connectionId) ?? null;
    if (connection === null) {
      return new Response('Connection not found', {
        status: 404,
      });
    } else if (connection.app.type !== 'discord') {
      return new Response('Invalid connection type', {
        status: 400,
      });
    }

    try {
      const payload: RESTPostAPIApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        description: 'Chat with the AI model',
        name: 'chat',
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'message',
            description: 'The message to send to the AI model',
            required: true,
          },
        ],
      };
      await fetch(RouteBases.api + Routes.applicationCommands(connection.app.applicationId), {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${body.botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response('Failed to register commands', {
        status: 500,
      });
    }
  } else {
    return new Response('Invalid request payload', {
      status: 400,
    });
  }
};
