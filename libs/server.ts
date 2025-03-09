import { BaseServerApp } from './apps/base-server';
import { BaseServerModel } from './models/base-server';
import { AppType, ModelType, apps, models } from './schemas';

export const serverModelRecord = {} as Record<
  ModelType,
  new (...args: ConstructorParameters<typeof BaseServerModel>) => BaseServerModel<ModelType>
>;
for (const model of models) {
  serverModelRecord[model] = (await import(
    `./models/${model}/server.ts`
  )) as (typeof serverModelRecord)[ModelType];
}

export const serverAppRecord = {} as Record<
  AppType,
  new (...args: ConstructorParameters<typeof BaseServerApp>) => BaseServerApp<AppType>
>;
for (const app of apps) {
  serverAppRecord[app] = (await import(
    `./apps/${app}/server.ts`
  )) as (typeof serverAppRecord)[AppType];
}
