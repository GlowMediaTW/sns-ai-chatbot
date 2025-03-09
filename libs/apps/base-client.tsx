import { AppSchema, connectionSchema } from '@/libs/schemas';
import { MessageInstance } from 'antd/es/message/interface';
import type { ReactNode } from 'react';
import { z } from 'zod';

export abstract class BaseClientApp<T extends string> {
  public abstract readonly type: T;
  public abstract readonly label: string;
  public abstract readonly icon: string;

  public abstract getDefaultConfig: () => Extract<z.infer<AppSchema<T>>, { type: T }>;

  public abstract getForm: (config: z.infer<AppSchema>) => ReactNode;

  public abstract getTutorial: () => ReactNode;

  public abstract getPostTutorial: (
    connection: z.infer<typeof connectionSchema>,
    props: {
      pageOrigin: string;
      messageApi: MessageInstance;
    },
  ) => ReactNode;
}
