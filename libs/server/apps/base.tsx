import { appSchema, modelSchema } from '@/libs/schemas';
import { z } from 'zod';

import { BaseServerModel } from '../models/base';

export abstract class BaseServerApp<T extends string> {
  public abstract readonly type: T;

  public config: Extract<z.infer<typeof appSchema>, { type: T }>;
  public request: Request;
  public model: BaseServerModel<z.infer<typeof modelSchema>['type']>;

  constructor(
    config: z.infer<typeof appSchema>,
    request: Request,
    model: BaseServerModel<z.infer<typeof modelSchema>['type']>,
  ) {
    this.config = config as Extract<z.infer<typeof appSchema>, { type: T }>;
    this.request = request;
    this.model = model;
  }

  public abstract validateWebhookRequest: () => Promise<boolean>;

  public abstract acknowledgeWebhookRequest: () => Promise<Response>;

  public abstract processWebhookRequest: () => Promise<string | null>;
}
