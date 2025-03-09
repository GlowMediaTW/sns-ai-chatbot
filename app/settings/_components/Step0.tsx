'use client';

import Markdown from '@/components/Markdown';
import { clientModelRecord } from '@/libs/client';
import { modelSchema } from '@/libs/schemas';
import { useChat } from '@ai-sdk/react';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import Alert from 'antd/es/alert';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Collapse from 'antd/es/collapse';
import Form from 'antd/es/form';
import Image from 'next/image';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { z } from 'zod';

export default function Step0({
  setCurrentStep,
  modelConfig,
  setModelConfig,
}: {
  setCurrentStep: Dispatch<SetStateAction<number>>;
  modelConfig: z.infer<typeof modelSchema> | null;
  setModelConfig: Dispatch<SetStateAction<z.infer<typeof modelSchema> | null>>;
}) {
  const [isTestingModel, setIsTestingModel] = useState(false);
  const [modelTestResult, setModelTestResult] = useState<'success' | 'error' | null>(null);

  const clientModels = Object.entries(clientModelRecord);
  const freeClientModels = clientModels.filter(([, { payment }]) => payment === 'free');
  const paidClientModels = clientModels.filter(([, { payment }]) => payment === 'paid');

  const clientModel = useMemo(
    () => (modelConfig !== null ? clientModelRecord[modelConfig.type] : null),
    [modelConfig],
  );

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

  if (modelConfig === null || clientModel === null) {
    return (
      <>
        <h2 className="fs-4 mb-3">Free Models</h2>
        <div className="col-12 d-flex align-items-center flex-wrap">
          {freeClientModels.map(([modelType, clientModel]) => (
            <div
              key={modelType}
              className="col-lg-4 col-12"
              style={{ height: '64px', padding: '2px' }}
            >
              <Button
                className="w-100 h-100 d-flex align-items-center"
                onClick={() => {
                  setIsTestingModel(false);
                  setModelTestResult(null);
                  setModelConfig(clientModel.getDefaultConfig());
                }}
              >
                <div className="flex-shrink-0">
                  <Image src={clientModel.icon} alt={clientModel.label} height={32} width={32} />
                </div>
                <div className="flex-grow-1 ms-2 fs-6 d-flex">{clientModel.label}</div>
              </Button>
            </div>
          ))}
        </div>
        <h2 className="fs-4 mt-4 mb-3">Paid Models</h2>
        <div className="col-12 d-flex align-items-center">
          {paidClientModels.map(([modelType, clientModel]) => (
            <div
              key={modelType}
              className="col-lg-4 col-12"
              style={{ height: '64px', padding: '2px' }}
            >
              <Button
                className="w-100 h-100 d-flex align-items-center"
                onClick={() => {
                  setIsTestingModel(false);
                  setModelTestResult(null);
                  setModelConfig(clientModel.getDefaultConfig());
                }}
              >
                <div className="flex-shrink-0">
                  <Image src={clientModel.icon} alt={clientModel.label} height={32} width={32} />
                </div>
                <div className="flex-grow-1 ms-2 fs-6 d-flex">{clientModel.label}</div>
              </Button>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-3 d-flex">
        <h2 className="fs-4 mb-0 me-2">{`Setup ${clientModel.label} Provider`}</h2>
        <Button
          className="text-secondary"
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            setModelConfig(null);
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
            children: clientModel.getTutorial(),
          },
        ]}
      />
      <div className="d-flex flex-wrap">
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
                  ...modelConfig,
                  ...data,
                };
                setIsTestingModel(true);
                setModelTestResult(null);
                setModelConfig(newModelConfig);
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
              {clientModel.getForm(modelConfig)}
              <Form.Item>
                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    style={{ width: '49%' }}
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isTestingModel}
                  >
                    Test
                  </Button>
                  <Button
                    style={{ width: '49%' }}
                    type="primary"
                    disabled={modelTestResult !== 'success'}
                    onClick={() => {
                      setCurrentStep(1);
                    }}
                  >
                    Continue
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
              <Markdown key={message.id} content={`**${message.role}**\n\n${message.content}`} />
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
    </>
  );
}
