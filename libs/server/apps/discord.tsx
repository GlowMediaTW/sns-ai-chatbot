import { appSchema, modelSchema } from '@/libs/schemas';
import { CoreMessage } from 'ai';
import {
  APIApplicationCommandInteractionDataStringOption,
  APIInteraction,
  APIInteractionResponseDeferredChannelMessageWithSource,
  APIInteractionResponsePong,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
  RouteBases,
  Routes,
} from 'discord-api-types/v10';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import { z } from 'zod';

import { BaseServerModel } from '../models/base';
import { Store } from '../store';
import { BaseServerApp } from './base';

export class DiscordServerApp implements BaseServerApp<'discord'> {
  public readonly type = 'discord';

  public config: Extract<z.infer<typeof appSchema>, { type: 'discord' }>;
  public request: Request;
  public model: BaseServerModel<z.infer<typeof modelSchema>['type']>;

  private body: APIInteraction | null = null;

  constructor(
    config: z.infer<typeof appSchema>,
    request: Request,
    model: BaseServerModel<z.infer<typeof modelSchema>['type']>,
  ) {
    this.config = config as Extract<z.infer<typeof appSchema>, { type: 'discord' }>;
    this.request = request;
    this.model = model;
  }

  public async validateWebhookRequest() {
    try {
      const rawBody = await this.request.text();
      const headersList = await headers();
      const signature = headersList.get('x-signature-ed25519') ?? '';
      const timestamp = headersList.get('x-signature-timestamp') ?? '';

      const verified = nacl.sign.detached.verify(
        Buffer.from(timestamp + rawBody),
        Buffer.from(signature, 'hex'),
        Buffer.from(this.config.publicKey, 'hex'),
      );
      if (!verified) {
        return false;
      }

      this.body = JSON.parse(rawBody) as APIInteraction;

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async acknowledgeWebhookRequest() {
    if (this.body === null) {
      throw new Error('Webhook request body is not validated');
    } else if (this.body.type === InteractionType.Ping) {
      const res: APIInteractionResponsePong = {
        type: InteractionResponseType.Pong,
      };
      return NextResponse.json(res);
    } else if (this.body.type === InteractionType.ApplicationCommand) {
      const res: APIInteractionResponseDeferredChannelMessageWithSource = {
        type: InteractionResponseType.DeferredChannelMessageWithSource,
        data: {
          flags: MessageFlags.Loading,
        },
      };
      return NextResponse.json(res);
    }

    // Fallback, should not reach here
    return new Response('OK', { status: 200 });
  }

  public async processWebhookRequest() {
    if (this.body === null) {
      throw new Error('Webhook request body is not validated');
    }

    if (
      this.body.type === InteractionType.ApplicationCommand &&
      this.body.data.type === ApplicationCommandType.ChatInput &&
      this.body.data.name === 'chat'
    ) {
      console.log(JSON.stringify(this.body, null, 2));

      const messageOption =
        this.body.data.options?.find(
          (option): option is APIApplicationCommandInteractionDataStringOption =>
            option.type === ApplicationCommandOptionType.String && option.name === 'message',
        ) ?? null;
      if (messageOption === null) {
        throw new Error('Invalid command options');
      }
      const input = messageOption.value;
      const store = new Store(false);
      const channelId = this.body.channel.id;
      const chatHistory = await store.loadChat(channelId);
      const newMessages: CoreMessage[] = [{ role: 'user', content: input }];
      const { output } = await this.model.invoke([...chatHistory, ...newMessages]);
      await store.saveChat(channelId, newMessages);

      for (let chunkIndex = 0; chunkIndex < Math.ceil(output.length / 2000); chunkIndex += 1) {
        if (chunkIndex > 0) {
          await new Promise<void>((resolve) => setTimeout(resolve, 500));
        }
        const chunk = output.slice(chunkIndex * 2000, (chunkIndex + 1) * 2000);
        const payload: RESTPatchAPIInteractionOriginalResponseJSONBody = {
          content: chunk,
        };

        const apiMethod = chunkIndex === 0 ? 'PATCH' : 'POST';
        const apiPath =
          chunkIndex === 0
            ? Routes.webhookMessage(this.config.applicationId, this.body.token, '@original')
            : Routes.webhook(this.config.applicationId, this.body.token);

        await fetch(RouteBases.api + apiPath, {
          method: apiMethod,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
    }
    return null;
  }
}
