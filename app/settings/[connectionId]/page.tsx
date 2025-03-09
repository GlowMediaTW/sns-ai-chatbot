import { Store } from '@/libs/store';

import ConnectionNotFound from './_components/ConnectionNotFound';
import ConnectionSettings from './_components/ConnectionSettings';

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

  return connection === null ? (
    <ConnectionNotFound />
  ) : (
    <ConnectionSettings connection={connection} />
  );
}
