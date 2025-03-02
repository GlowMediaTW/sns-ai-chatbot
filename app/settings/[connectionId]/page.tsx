import { Store } from '@/libs/server/store';

import ConnectionNotFound from './connection-not-found';
import ConnectionSettings from './connection-settings';

export default async function ConnectionSettingsPage({
  params,
}: {
  params: Promise<{
    connectionId: string;
  }>;
}) {
  const { connectionId } = await params;

  const store = new Store(true);
  const connections = await store.getConnections();

  const connection = connections.find((c) => c.id === connectionId) ?? null;
  if (connection === null) {
    return <ConnectionNotFound />;
  }

  return <ConnectionSettings connection={connection} />;
}
