import { connectionSchema } from '@/libs/schemas';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

import ConnectionNotFound from './connection-not-found';
import ConnectionSettings from './connection-settings';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_READ_ONLY_TOKEN,
});

export default async function ConnectionSettingsPage({
  params,
}: {
  params: Promise<{
    connectionId: string;
  }>;
}) {
  const { connectionId } = await params;
  const connections = await redis
    .get('connections')
    .then((data) => z.array(connectionSchema).parse(data))
    .catch((error: unknown) => {
      console.error(error);
      return [];
    });
  const connection = connections.find((c) => c.id === connectionId) ?? null;
  if (connection === null) {
    return <ConnectionNotFound />;
  }

  return <ConnectionSettings connection={connection} />;
}
