import { MessageInstance } from 'antd/es/message/interface';
import type { ReactNode } from 'react';
import { z } from 'zod';

import { appSchema } from '../../schemas';

export abstract class BaseClientApp<T extends string> {
  public abstract readonly type: T;
  public abstract readonly label: string;
  public abstract readonly icon: string;
  public abstract readonly tutorial: string;

  public abstract getDefaultConfig: () => Extract<z.infer<typeof appSchema>, { type: T }>;

  public abstract getForm: (
    config: z.infer<typeof appSchema>,
    props: {
      connectionId: string;
      pageOrigin: string;
      messageApi: MessageInstance;
    },
  ) => ReactNode;
}
