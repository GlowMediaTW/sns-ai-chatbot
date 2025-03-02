import { modelSchema } from '@/libs/schemas';
import { generateText, streamText } from 'ai';
import { z } from 'zod';

export abstract class BaseServerModel<T extends string> {
  public abstract readonly type: T;

  public config: Extract<z.infer<typeof modelSchema>, { type: T }>;

  constructor(config: z.infer<typeof modelSchema>) {
    this.config = config as Extract<z.infer<typeof modelSchema>, { type: T }>;
  }

  public abstract stream: (messages: Parameters<typeof streamText>[0]['messages']) => Response;

  public abstract invoke: (
    messages: Parameters<typeof generateText>[0]['messages'],
  ) => Promise<{ success: boolean; output: string }>;
}
