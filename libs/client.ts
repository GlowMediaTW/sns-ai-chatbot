import { BaseClientApp } from './apps/base-client';
import { BaseClientModel } from './models/base-client';
import { AppType, ModelType, apps, models } from './schemas';

export const clientModelRecord = {} as Record<ModelType, BaseClientModel<ModelType>>;
for (const model of models) {
  clientModelRecord[model] = new (
    (await import(`./models/${model}/client.tsx`)) as {
      default: new (
        ...args: ConstructorParameters<typeof BaseClientModel>
      ) => BaseClientModel<ModelType>;
    }
  ).default();
}

export const clientAppRecord = {} as Record<AppType, BaseClientApp<AppType>>;
for (const app of apps) {
  clientAppRecord[app] = new (
    (await import(`./apps/${app}/client.tsx`)) as {
      default: new (...args: ConstructorParameters<typeof BaseClientApp>) => BaseClientApp<AppType>;
    }
  ).default();
}
