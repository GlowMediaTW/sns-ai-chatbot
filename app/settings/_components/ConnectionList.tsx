'use client';

import { clientAppRecord, clientModelRecord } from '@/libs/client';
import { connectionSchema } from '@/libs/schemas';
import Button from 'antd/es/button';
import Table from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';

export default function ConnectionList({
  connections,
  setIsNewConnection,
}: {
  connections: z.infer<typeof connectionSchema>[];
  setIsNewConnection: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  if (Object.keys(clientModelRecord).length === 0) {
    return <>Loading</>;
  }

  return (
    <>
      <div className="w-100 d-flex justify-content-between align-items-center mb-5">
        <h2 className="fs-4 mb-0">Connections</h2>
        <Button
          type="primary"
          onClick={() => {
            setIsNewConnection(true);
          }}
        >
          + Add New Connection
        </Button>
      </div>
      <Table
        columns={[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            render: (_, { model }) => (
              <div className="d-flex align-items-center">
                <Image
                  className="me-2"
                  src={clientModelRecord[model.type].icon}
                  alt={clientModelRecord[model.type].label}
                  height={24}
                  width={24}
                />
                <div>{clientModelRecord[model.type].label}</div>
              </div>
            ),
          },
          {
            title: 'App',
            dataIndex: 'app',
            key: 'app',
            render: (_, { app }) => (
              <div className="d-flex align-items-center">
                <Image
                  className="me-2"
                  src={clientAppRecord[app.type].icon}
                  alt={clientAppRecord[app.type].label}
                  height={24}
                  width={24}
                />
                <div>{clientAppRecord[app.type].label}</div>
              </div>
            ),
          },
          {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (_, { updatedAt }) => new Date(updatedAt).toLocaleString(),
          },
        ]}
        dataSource={connections}
        rowKey={(connection) => connection.id}
        onRow={(connection) => ({
          onClick: async () => {
            router.push(`/settings/${connection.id}`);
          },
          role: 'button',
        })}
      />
    </>
  );
}
