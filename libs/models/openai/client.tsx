import Markdown from '@/components/Markdown';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { z } from 'zod';

import { BaseModelSchema, ModelSchema } from '../../schemas';
import { BaseClientModel } from '../base-client';
import { schema } from './schema';

export default class OpenAIClientModel implements BaseClientModel<'openai'> {
  public readonly type = 'openai';
  public readonly label = 'OpenAI';
  public readonly icon = '/images/models/openai/icon.png';
  public readonly payment = 'paid';

  public getDefaultConfig(): BaseModelSchema & z.infer<typeof schema> {
    return {
      type: 'openai',
      apiKey: '',
      modelName: 'gpt-4o',
      temperature: 0,
    };
  }

  public getForm(_config: BaseModelSchema & z.infer<ModelSchema>) {
    const config = _config as BaseModelSchema & z.infer<typeof schema>;
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

  public getTutorial() {
    return (
      <Markdown
        content={`1. Sign in at [OpenAI Platform](https://platform.openai.com/settings/organization/api-keys)
2. Create a new API key.

![](/images/models/openai/tutorial_1.png)

![](/images/models/openai/tutorial_2.png)

3. Copy the API key and paste it into the \`API key\` field.

![](/images/models/openai/tutorial_3.png)`}
      />
    );
  }
}
