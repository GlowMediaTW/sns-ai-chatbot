import { z } from 'zod';

export const schema = z.object({
  type: z.literal('line'),
  channelAccessToken: z.string(),
  channelSecret: z.string(),
});
