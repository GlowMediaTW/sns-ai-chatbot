'use client';

import { connectionSchema } from '@/libs/schemas';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import ConnectionList from './ConnectionList';
import NewConnection from './NewConnection';

export default function Settings({
  connections: initialConnections,
}: {
  connections: z.infer<typeof connectionSchema>[];
}) {
  const [connections, setConnections] = useState(initialConnections);
  const [isNewConnection, setIsNewConnection] = useState(false);

  useEffect(() => {
    if (connections.length === 0) {
      setIsNewConnection(true);
    }
  }, [connections.length]);

  return (
    <div className="container my-5">
      {isNewConnection ? (
        <NewConnection
          connections={connections}
          setConnections={setConnections}
          setIsNewConnection={setIsNewConnection}
        />
      ) : (
        <ConnectionList connections={connections} setIsNewConnection={setIsNewConnection} />
      )}
    </div>
  );
}
