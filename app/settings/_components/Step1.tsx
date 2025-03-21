'use client';

import { clientAppRecord } from '@/libs/client';
import { appSchema, connectionSchema, modelSchema, rawConnectionSchema } from '@/libs/schemas';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Collapse from 'antd/es/collapse';
import Form from 'antd/es/form';
import message from 'antd/es/message';
import Image from 'next/image';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { z } from 'zod';

export default function Step1({
  setCurrentStep,
  appConfig,
  setAppConfig,
  modelConfig,
  connectionId,
  connectionName,
  connections,
  setConnections,
  setNewConnection,
}: {
  setCurrentStep: Dispatch<SetStateAction<number>>;
  appConfig: z.infer<typeof appSchema> | null;
  setAppConfig: Dispatch<SetStateAction<z.infer<typeof appSchema> | null>>;
  modelConfig: z.infer<typeof modelSchema> | null;
  connectionId: string;
  connectionName: string;
  connections: z.infer<typeof connectionSchema>[];
  setConnections: Dispatch<SetStateAction<z.infer<typeof connectionSchema>[]>>;
  setNewConnection: Dispatch<SetStateAction<z.infer<typeof connectionSchema> | null>>;
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const [isSavingConnection, setIsSavingConnection] = useState(false);

  const clientApp = useMemo(
    () => (appConfig !== null ? clientAppRecord[appConfig.type] : null),
    [appConfig],
  );

  if (appConfig === null || clientApp === null) {
    return (
      <>
        <div className="mb-3 d-flex">
          <h2 className="fs-4 mb-0 me-2">Choose an App to connect</h2>
          <Button
            className="text-secondary"
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              setCurrentStep(0);
            }}
          >
            Back
          </Button>
        </div>
        <div className="col-12 d-flex align-items-center flex-wrap">
          {Object.values(clientAppRecord).map((clientApp) => (
            <div
              key={clientApp.type}
              className="col-lg-4 col-12"
              style={{ height: '64px', padding: '2px' }}
            >
              <Button
                className="w-100 h-100 d-flex align-items-center"
                onClick={() => {
                  setAppConfig(clientApp.getDefaultConfig());
                }}
              >
                <div className="flex-shrink-0">
                  <Image src={clientApp.icon} alt={clientApp.label} height={32} width={32} />
                </div>
                <div className="flex-grow-1 ms-2 fs-6 d-flex">{clientApp.label}</div>
              </Button>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="mb-3 d-flex">
        <h2 className="fs-4 mb-0">{`Setup ${clientApp.label} Connection`}</h2>
        <Button
          className="text-secondary"
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            setAppConfig(null);
          }}
        >
          Back
        </Button>
      </div>
      <Collapse
        className="mb-3"
        items={[
          {
            key: '1',
            label: 'Tutorial',
            children: clientApp.getTutorial(),
          },
        ]}
      />
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
            <div>{clientApp.label} App Settings</div>
          </div>
        }
      >
        <Form<z.infer<typeof appSchema>>
          layout="vertical"
          onFinish={async (data) => {
            if (modelConfig === null) return;
            const newAppConfig = {
              ...appConfig,
              ...data,
            };
            const body: z.infer<typeof rawConnectionSchema> = {
              id: connectionId,
              name: connectionName,
              model: modelConfig,
              app: newAppConfig,
            };
            try {
              setIsSavingConnection(true);
              const res = await fetch('/api/connections', {
                method: 'POST',
                body: JSON.stringify(body),
              });
              if (!res.ok) {
                throw new Error('Failed to create new connection');
              }
              const newConnection = connectionSchema.parse((await res.json()) as unknown);
              setConnections([...connections, newConnection]);
              setNewConnection(newConnection);
              setCurrentStep(2);
              messageApi.success('Connection created successfully');
            } catch (error) {
              console.error(error);
              messageApi.error('Failed to create new connection');
            } finally {
              setIsSavingConnection(false);
            }
          }}
        >
          {clientApp.getForm(appConfig)}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isSavingConnection}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
