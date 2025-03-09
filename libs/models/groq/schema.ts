import { z } from 'zod';

export const schema = z.object({
  type: z.literal('groq'),
  apiKey: z.string(),
  modelName: z.string(),
});
