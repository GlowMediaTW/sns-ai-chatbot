import { connectionSchema } from '@/libs/schemas';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

import SettingsComponent from './settings';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_READ_ONLY_TOKEN,
});

export default async function SettingsPage() {
  const connections = await redis
    .get('connections')
    .then((data) => z.array(connectionSchema).parse(data))
    .catch((error: unknown) => {
      console.error(error);
      return [];
    });
  console.log({ connections });

  return <SettingsComponent connections={connections} />;
}
