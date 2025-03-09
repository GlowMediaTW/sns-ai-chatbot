import { modelSchema } from '@/libs/schemas';
import { z } from 'zod';

import { BaseServerModel } from '../models/base-server';

export abstract class BaseServerApp<
  T extends string,
  Schema extends z.ZodObject<{ type: z.ZodLiteral<T> } & z.ZodRawShape, 'strip'> = z.ZodObject<
    { type: z.ZodLiteral<T> } & z.ZodRawShape,
    'strip'
  >,
> {
  public abstract readonly type: T;

  public config: z.infer<Schema>;
  public request: Request;
  public model: BaseServerModel<z.infer<typeof modelSchema>['type']>;

  constructor(
    config: z.infer<Schema>,
    request: Request,
    model: BaseServerModel<z.infer<typeof modelSchema>['type']>,
  ) {
    this.config = config;
    this.request = request;
    this.model = model;
  }

  public abstract validateWebhookRequest: () => Promise<boolean>;

  public abstract acknowledgeWebhookRequest: () => Promise<Response>;

  public abstract processWebhookRequest: () => Promise<string | null>;
}
