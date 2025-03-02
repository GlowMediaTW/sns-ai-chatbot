import { Store } from '@/libs/server/store';

import SettingsComponent from './settings';

export default async function SettingsPage() {
  const store = new Store(true);
  const connections = await store.getConnections();
  console.log({ connections });

  return <SettingsComponent connections={connections} />;
}
