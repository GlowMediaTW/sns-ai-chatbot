import { modelSchema } from '@/libs/schemas';
import type { ReactNode } from 'react';
import { z } from 'zod';

export abstract class BaseClientModel<T extends string> {
  public abstract readonly type: T;
  public abstract readonly label: string;
  public abstract readonly icon: string;
  public abstract readonly tutorial: string;

  public abstract getDefaultConfig: () => Extract<z.infer<typeof modelSchema>, { type: T }>;

  public abstract getForm: (config: z.infer<typeof modelSchema>) => ReactNode;
}
