'use client';

import { appSchema, connectionSchema, modelSchema } from '@/libs/schemas';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import Modal from 'antd/es/modal';
import Steps from 'antd/es/steps';
import Table from 'antd/es/table';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { clientAppRecord, clientModelRecord } from '../../libs/client';
import Step0 from './step-0';
import Step1 from './step-1';
import Step2 from './step-2';

export default function SettingsComponent({
  connections: initialConnections,
}: {
  connections: z.infer<typeof connectionSchema>[];
}) {
  const router = useRouter();
  const [connections, setConnections] = useState(initialConnections);
  const [openNewConnectionModal, setOpenNewConnectionModal] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState('');
  const [isNewConnection, setIsNewConnection] = useState(false);
  const [newConnectionId, setNewConnectionId] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [newConnection, setNewConnection] = useState<z.infer<typeof connectionSchema> | null>(null);

  const [modelConfig, setModelConfig] = useState<z.infer<typeof modelSchema> | null>(null);
  const [appConfig, setAppConfig] = useState<z.infer<typeof appSchema> | null>(null);

  useEffect(() => {
    if (connections.length === 0) {
      setOpenNewConnectionModal(true);
    }
  }, [connections.length]);

  return (
    <div className="container my-5">
      {isNewConnection ? (
        <>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <h1 className="fs-3 mb-0">{`Create New Connection '${newConnectionName}'`}</h1>
            <Button
              className="text-secondary"
              onClick={() => {
                setIsNewConnection(false);
              }}
            >
              Cancel
            </Button>
          </div>
          <Steps
            current={currentStep}
            items={[
              {
                title: 'Setup a LLM Provider',
              },
              {
                title: 'Connect an App',
              },
              {
                title: 'Test Connection',
              },
            ]}
          />
          <hr className="my-4" />
          {currentStep === 0 && (
            <Step0
              setCurrentStep={setCurrentStep}
              modelConfig={modelConfig}
              setModelConfig={setModelConfig}
            />
          )}
          {currentStep === 1 && (
            <Step1
              setCurrentStep={setCurrentStep}
              appConfig={appConfig}
              setAppConfig={setAppConfig}
              modelConfig={modelConfig}
              connectionId={newConnectionId}
              connectionName={newConnectionName}
              connections={connections}
              setConnections={setConnections}
              setNewConnection={setNewConnection}
            />
          )}
          {currentStep === 2 && newConnection !== null && (
            <Step2 connection={newConnection} setIsNewConnection={setIsNewConnection} />
          )}
        </>
      ) : (
        <>
          <div className="w-100 d-flex justify-content-between align-items-center mb-5">
            <h2 className="fs-4 mb-0">Connections</h2>
            <Button
              type="primary"
              onClick={() => {
                setNewConnectionName('');
                setOpenNewConnectionModal(true);
              }}
            >
              + Add New Connection
            </Button>
            <Modal
              title="New Connection Name"
              open={openNewConnectionModal}
              onCancel={() => {
                setOpenNewConnectionModal(false);
              }}
              centered
              footer={null}
            >
              <Input
                className="my-3"
                value={newConnectionName}
                onChange={(e) => {
                  setNewConnectionName(e.target.value);
                }}
              />
              <div className="d-flex justify-content-end">
                <Button
                  type="primary"
                  disabled={newConnectionName.length === 0}
                  onClick={() => {
                    setCurrentStep(0);
                    setModelConfig(null);
                    setAppConfig(null);
                    setIsNewConnection(true);
                    setNewConnection(null);
                    setNewConnectionId(nanoid());
                  }}
                >
                  Create
                </Button>
              </div>
            </Modal>
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
      )}
    </div>
  );
}
