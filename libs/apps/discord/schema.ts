import { z } from 'zod';

export const schema = z.object({
  type: z.literal('discord'),
  applicationId: z.string(),
  publicKey: z.string(),
});
