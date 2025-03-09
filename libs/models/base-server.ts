import { CoreMessage } from 'ai';
import { z } from 'zod';

import { BaseModelSchema } from '../schemas';

export abstract class BaseServerModel<
  T extends string,
  Schema extends z.ZodObject<{ type: z.ZodLiteral<T> } & z.ZodRawShape, 'strip'> = z.ZodObject<
    { type: z.ZodLiteral<T> } & z.ZodRawShape,
    'strip'
  >,
> {
  public abstract readonly type: T;

  public config: BaseModelSchema & z.infer<Schema>;

  constructor(config: BaseModelSchema & z.infer<Schema>) {
    this.config = config;
  }

  public abstract stream: (messages: CoreMessage[]) => Response;

  public abstract invoke: (
    messages: CoreMessage[],
  ) => Promise<{ success: boolean; output: string }>;
}
