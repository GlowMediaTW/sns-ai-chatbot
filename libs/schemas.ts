import { z } from 'zod';

export const models = ['openai', 'groq'] as const;
export const apps = ['line', 'discord'] as const;

export type ModelType = (typeof models)[number];
export type AppType = (typeof apps)[number];

export const baseModelSchema = z.object({
  temperature: z.number(),
});

export type BaseModelSchema = z.infer<typeof baseModelSchema>;

export type ModelSchema<T extends string = ModelType> = z.ZodObject<
  z.ZodRawShape & { type: z.ZodLiteral<T> },
  'strip',
  z.ZodTypeAny,
  z.objectOutputType<z.ZodRawShape, z.ZodTypeAny, 'strip'> &
    z.objectOutputType<{ type: z.ZodLiteral<T> }, z.ZodTypeAny, 'strip'>
>;

export type AppSchema<T extends string = AppType> = z.ZodObject<
  z.ZodRawShape & { type: z.ZodLiteral<T> },
  'strip',
  z.ZodTypeAny,
  z.objectOutputType<z.ZodRawShape, z.ZodTypeAny, 'strip'> &
    z.objectOutputType<{ type: z.ZodLiteral<T> }, z.ZodTypeAny, 'strip'>
>;

export const modelSchema = baseModelSchema.and(
  z.union(
    (await Promise.all(
      models.map((model) =>
        import(`./models/${model}/schema.ts`).then((m) => (m as { schema: ModelSchema }).schema),
      ),
    )) as [ModelSchema, ModelSchema, ...ModelSchema[]],
  ),
);

export const appSchema = z.union(
  (await Promise.all(
    apps.map((app) =>
      import(`./apps/${app}/schema.ts`).then((m) => (m as { schema: AppSchema }).schema),
    ),
  )) as [AppSchema, AppSchema, ...AppSchema[]],
);

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

export const discordRegisterCommandsSchema = z.object({
  botToken: z.string(),
});
