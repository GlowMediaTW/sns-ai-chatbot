import { schema as discordAppSchema } from '@/libs/apps/discord/schema';
import { discordRegisterCommandsSchema } from '@/libs/schemas';
import { Store } from '@/libs/store';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  RESTPostAPIApplicationCommandsJSONBody,
  RouteBases,
  Routes,
} from 'discord-api-types/v10';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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
  const bodyParsedResult = discordRegisterCommandsSchema.safeParse(rawBody);
  if (!bodyParsedResult.success || typeof connectionId !== 'string') {
    console.error(bodyParsedResult.error, { connectionId });
    return new Response('Invalid request payload', {
      status: 400,
    });
  }
  const { botToken } = bodyParsedResult.data;

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
  const app = connection.app as z.infer<typeof discordAppSchema>;

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
    await fetch(RouteBases.api + Routes.applicationCommands(app.applicationId), {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${botToken}`,
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
};
