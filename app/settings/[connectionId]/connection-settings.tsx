'use client';

import { appSchema, connectionSchema, modelSchema, updateConnectionSchema } from '@/libs/schemas';
import { useChat } from '@ai-sdk/react';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import Alert from 'antd/es/alert';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import message from 'antd/es/message';
import Modal from 'antd/es/modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import { z } from 'zod';

import { clientAppRecord, clientModelRecord } from '../../../libs/client';

export default function ConnectionSettings({
  connection: initialConnection,
}: {
  connection: z.infer<typeof connectionSchema>;
}) {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [connection, setConnection] = useState(initialConnection);
  const [isTestingModel, setIsTestingModel] = useState(false);
  const [modelTestResult, setModelTestResult] = useState<'success' | 'error' | null>(null);
  const [pageOrigin, setPageOrigin] = useState('');
  const [isSavingConnection, setIsSavingConnection] = useState(false);
  const [isDeletingConnection, setIsDeletingConnection] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const clientModel = useMemo(
    () => clientModelRecord[connection.model.type],
    [connection.model.type],
  );

  const clientApp = useMemo(() => clientAppRecord[connection.app.type], [connection.app.type]);

  const { messages, setMessages, append } = useChat({
    api: '/api/test/model',
    onError: () => {
      setModelTestResult('error');
      setIsTestingModel(false);
    },
    onFinish: () => {
      setModelTestResult('success');
      setIsTestingModel(false);
    },
  });

  useEffect(() => {
    setPageOrigin(window.location.origin);
  }, []);

  return (
    <>
      {contextHolder}
      <div className="container my-5">
        <div className="mb-5 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h1 className="fs-4 mb-0 me-2">{`Connection '${connection.name}'`}</h1>
            <Button
              className="text-secondary"
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                router.push('/settings');
              }}
            >
              Back
            </Button>
          </div>
          <div className="d-flex align-items-center">
            <Button
              type="primary"
              disabled={isSavingConnection}
              loading={isSavingConnection}
              className="me-3"
              onClick={async () => {
                const body: z.infer<typeof updateConnectionSchema> = {
                  name: connection.name,
                  model: connection.model,
                  app: connection.app,
                };
                try {
                  setIsSavingConnection(true);
                  const res = await fetch(`/api/connections/${connection.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(body),
                  });
                  if (!res.ok) {
                    throw new Error('Failed to update connection');
                  }
                  const updatedConnection = connectionSchema.parse((await res.json()) as unknown);
                  setConnection(updatedConnection);
                  messageApi.success('Connection updated successfully');
                } catch (error) {
                  console.error(error);
                  messageApi.error('Failed to update connection');
                } finally {
                  setIsSavingConnection(false);
                }
              }}
            >
              Save
            </Button>
            <Button
              danger
              onClick={() => {
                setOpenDeleteModal(true);
              }}
            >
              Delete
            </Button>
            <Modal
              title="Delete Connection"
              open={openDeleteModal}
              onCancel={() => {
                setOpenDeleteModal(false);
              }}
              centered
              footer={null}
            >
              <div className="mb-2">
                Are you sure you want to delete this connection? This action cannot be undone.
              </div>
              <div className="mb-2">
                <span>Input</span>&nbsp;
                <span className="fw-bold">{connection.name}</span>&nbsp;
                <span>to confirm.</span>
              </div>
              <Input
                className="mb-3"
                value={deleteInput}
                onChange={(e) => {
                  setDeleteInput(e.target.value);
                }}
              />
              <div className="d-flex justify-content-end">
                <Button
                  type="primary"
                  danger
                  disabled={deleteInput !== connection.name || isDeletingConnection}
                  loading={isDeletingConnection}
                  onClick={async () => {
                    try {
                      setIsDeletingConnection(true);
                      const res = await fetch(`/api/connections/${connection.id}`, {
                        method: 'DELETE',
                      });
                      if (!res.ok) {
                        throw new Error('Failed to delete connection');
                      }
                      messageApi.success('Connection deleted successfully');
                      setTimeout(() => {
                        router.push('/settings');
                      }, 2000);
                    } catch (error) {
                      console.error(error);
                      messageApi.error('Failed to delete connection');
                    } finally {
                      setIsDeletingConnection(false);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </Modal>
          </div>
        </div>
        <div className="ms-1 mb-3">
          Last updated at: {new Date(connection.updatedAt).toLocaleString()}
        </div>
        <Card title="Common properties" className="mb-3">
          <div className="ms-1 mb-2">Name</div>
          <Input
            value={connection.name}
            onChange={(e) => {
              setConnection({ ...connection, name: e.target.value });
            }}
          />
        </Card>
        <div className="mb-3 d-flex flex-wrap">
          <div className="col-lg-6 col-12" style={{ padding: '2px' }}>
            <Card
              title={
                <div className="d-flex align-items-center">
                  <Image
                    className="me-2"
                    src={clientModel.icon}
                    alt={clientModel.label}
                    width={24}
                    height={24}
                  />
                  <div>{clientModel.label} Model Settings</div>
                </div>
              }
              className="h-100"
            >
              <Form<z.infer<typeof modelSchema>>
                layout="vertical"
                onFinish={async (data) => {
                  const newModelConfig = {
                    ...connection.model,
                    ...data,
                  };
                  setIsTestingModel(true);
                  setModelTestResult(null);
                  setConnection({ ...connection, model: newModelConfig });
                  setMessages(() => []);
                  await append(
                    {
                      role: 'user',
                      content: 'Please introduce yourself in 3 sentences.',
                    },
                    {
                      body: { config: newModelConfig },
                    },
                  );
                }}
              >
                {clientModel.getForm(connection.model)}
                <Form.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button type="primary" htmlType="submit" block loading={isTestingModel}>
                      Test
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Card>
          </div>
          <div className="col-lg-6 col-12" style={{ padding: '2px' }}>
            <Card
              title={
                <div className="d-flex align-items-center">
                  <Image
                    className="me-2"
                    src={clientModel.icon}
                    alt={clientModel.label}
                    width={24}
                    height={24}
                  />
                  <div>{clientModel.label} Model Test</div>
                </div>
              }
              className="h-100"
            >
              {messages.map((message) => (
                <Markdown key={message.id}>{`**${message.role}**\n\n${message.content}`}</Markdown>
              ))}
              {modelTestResult === 'error' && (
                <Alert
                  type="error"
                  message="Model test failed. Please check your config and try again."
                />
              )}
              {modelTestResult === 'success' && (
                <Alert type="success" message="Model test succeeded." />
              )}
            </Card>
          </div>
        </div>
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
              const newAppConfig = {
                ...connection.app,
                ...data,
              };
              setConnection({ ...connection, app: newAppConfig });
            }}
          >
            {clientApp.getForm(connection.app, {
              connectionId: connection.id,
              pageOrigin,
              messageApi,
            })}
          </Form>
        </Card>
      </div>
    </>
  );
}
