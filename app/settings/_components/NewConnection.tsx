'use client';

import Button from 'antd/es/button';
import Input from 'antd/es/input';
import Modal from 'antd/es/modal';
import Steps from 'antd/es/steps';
import { nanoid } from 'nanoid';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { z } from 'zod';

import { appSchema, connectionSchema, modelSchema } from '../../../libs/schemas';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';

export default function NewConnection({
  connections,
  setConnections,
  setIsNewConnection,
}: {
  connections: z.infer<typeof connectionSchema>[];
  setConnections: Dispatch<SetStateAction<z.infer<typeof connectionSchema>[]>>;
  setIsNewConnection: Dispatch<SetStateAction<boolean>>;
}) {
  const [openNewConnectionModal, setOpenNewConnectionModal] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState('');
  const [newConnectionId, setNewConnectionId] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const [modelConfig, setModelConfig] = useState<z.infer<typeof modelSchema> | null>(null);
  const [appConfig, setAppConfig] = useState<z.infer<typeof appSchema> | null>(null);
  const [newConnection, setNewConnection] = useState<z.infer<typeof connectionSchema> | null>(null);

  useEffect(() => {
    setOpenNewConnectionModal(true);
    setCurrentStep(0);
    setModelConfig(null);
    setAppConfig(null);
    setNewConnection(null);
    setNewConnectionId(nanoid());
  }, []);

  return (
    <>
      <Modal
        title="New Connection Name"
        open={openNewConnectionModal}
        onCancel={() => {
          setOpenNewConnectionModal(false);
          setIsNewConnection(false);
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
              setOpenNewConnectionModal(false);
            }}
          >
            Add
          </Button>
        </div>
      </Modal>
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
  );
}
