'use client';

import { clientAppRecord } from '@/libs/client';
import { connectionSchema } from '@/libs/schemas';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import message from 'antd/es/message';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';

export default function Step2({
  connection,
  setIsNewConnection,
}: {
  connection: z.infer<typeof connectionSchema>;
  setIsNewConnection: Dispatch<SetStateAction<boolean>>;
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const [pageOrigin, setPageOrigin] = useState('');

  const clientApp = useMemo(() => clientAppRecord[connection.app.type], [connection.app.type]);

  useEffect(() => {
    setPageOrigin(window.location.origin);
  }, []);

  return (
    <>
      {contextHolder}
      <h2 className="fs-4 mb-3">{`Test your ${clientApp.label} Connection`}</h2>
      <Card
        title={
          <div className="d-flex align-items-center">
            <Image
              className="me-2"
              src={clientApp.icon}
              alt={clientApp.label}
              width={24}
              height={24}
            />
            <div>{clientApp.label} App Test</div>
          </div>
        }
      >
        {clientApp.getPostTutorial(connection, {
          pageOrigin,
          messageApi,
        })}
        <Button
          type="primary"
          onClick={() => {
            setIsNewConnection(false);
          }}
        >
          Back to Connections
        </Button>
      </Card>
    </>
  );
}
