import { Redis } from '@upstash/redis';
import { CoreMessage } from 'ai';
import { z } from 'zod';

import { connectionSchema } from './schemas';

export class Store {
  private readonly readOnly: boolean;
  private readonly redis: Redis;

  constructor(readOnly: boolean) {
    this.readOnly = readOnly;
    this.redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: readOnly ? process.env.KV_REST_API_READ_ONLY_TOKEN : process.env.KV_REST_API_TOKEN,
    });
  }

  public async getConnections(): Promise<z.infer<typeof connectionSchema>[]> {
    const connections = await this.redis.get<z.infer<typeof connectionSchema>>('connections');
    const parsedConnections = z.array(connectionSchema).safeParse(connections);
    return parsedConnections.success ? parsedConnections.data : [];
  }

  public async setConnections(connections: z.infer<typeof connectionSchema>[]) {
    if (this.readOnly) {
      throw new Error('Read-only mode');
    }
    await this.redis.set('connections', connections);
  }

  public readonly maxChatHistoryLength = 10;

  public async loadChat(channelId: string) {
    const chatHistory = await this.redis.lrange<CoreMessage>(
      `chat:${channelId}`,
      -this.maxChatHistoryLength,
      -1,
    );
    return chatHistory;
  }

  public async saveChat(channelId: string, messages: CoreMessage[]) {
    if (this.readOnly) {
      throw new Error('Read-only mode');
    }

    await this.redis
      .pipeline()
      .rpush(`chat:${channelId}`, ...messages)
      .ltrim(`chat:${channelId}`, -this.maxChatHistoryLength, -1)
      .exec();
  }
}
