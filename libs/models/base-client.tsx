import { BaseModelSchema, ModelSchema } from '@/libs/schemas';
import type { ReactNode } from 'react';
import { z } from 'zod';

export abstract class BaseClientModel<T extends string> {
  public abstract readonly type: T;
  public abstract readonly label: string;
  public abstract readonly icon: string;
  public abstract readonly payment: 'free' | 'paid';

  public abstract getDefaultConfig: () => Extract<
    BaseModelSchema & z.infer<ModelSchema<T>>,
    { type: T }
  >;

  public abstract getForm: (config: BaseModelSchema & z.infer<ModelSchema>) => ReactNode;

  public abstract getTutorial: () => ReactNode;
}
