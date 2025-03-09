import { Store } from '@/libs/store';

import Settings from './_components/Settings';

export default async function SettingsPage() {
  const store = new Store(true);
  const connections = await store.getConnections();
  console.log({ connections });

  return <Settings connections={connections} />;
}
