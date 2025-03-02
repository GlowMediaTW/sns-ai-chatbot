import { z } from 'zod';

export const modelSchema = z
  .object({
    temperature: z.number(),
  })
  .and(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('openai'),
        apiKey: z.string(),
        modelName: z.string(),
      }),
      z.object({
        type: z.literal('groq'),
        apiKey: z.string(),
        modelName: z.string(),
      }),
    ]),
  );

export const appSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('line'),
    channelAccessToken: z.string(),
    channelSecret: z.string(),
  }),
  z.object({
    type: z.literal('discord'),
    applicationId: z.string(),
    publicKey: z.string(),
  }),
]);

export const connectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  model: modelSchema,
  app: appSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const rawConnectionSchema = connectionSchema.omit({ createdAt: true, updatedAt: true });

export const updateConnectionSchema = connectionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const connectionSettingsSchema = z.object({
  type: z.literal('register-discord-commands'),
  botToken: z.string(),
});
