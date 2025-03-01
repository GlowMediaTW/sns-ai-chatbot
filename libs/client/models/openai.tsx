import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { z } from 'zod';

import { modelSchema } from '../../schemas';
import { BaseClientModel } from './base';

export class OpenAIClientModel implements BaseClientModel<'openai'> {
  public readonly type = 'openai';
  public readonly label = 'OpenAI';
  public readonly icon = '/openai_model_icon.png';
  public readonly tutorial = `1. Sign in at [OpenAI Platform](https://platform.openai.com/settings/organization/api-keys)
2. Create a new API key.

![](/tutorials/openai/1.png)

![](/tutorials/openai/2.png)

3. Copy the API key and paste it into the \`API key\` field.

![](/tutorials/openai/3.png)`;

  public getDefaultConfig = () =>
    ({
      type: 'openai',
      apiKey: '',
      modelName: 'gpt-4o',
      temperature: 0,
    }) as const;

  public getForm(_config: z.infer<typeof modelSchema>) {
    const config = _config as Extract<z.infer<typeof modelSchema>, { type: 'openai' }>;
    return (
      <>
        <Form.Item
          label="API Key"
          name="apiKey"
          rules={[{ required: true, message: 'API Key cannot be empty' }]}
          initialValue={config.apiKey}
        >
          <Input.Password placeholder="API Key" />
        </Form.Item>
        <Form.Item
          label="Model Name"
          name="modelName"
          rules={[{ required: true, message: 'Model Name cannot be empty' }]}
          initialValue={config.modelName}
        >
          <Input placeholder="Model Name" />
        </Form.Item>
        <Form.Item
          label="Temperature"
          name="temperature"
          rules={[
            {
              required: true,
              message: 'Temperature must be between 0 and 1',
            },
          ]}
          initialValue={config.temperature}
        >
          <Input type="number" max={1} min={0} step={0.1} placeholder="Temperature" />
        </Form.Item>
      </>
    );
  }
}
