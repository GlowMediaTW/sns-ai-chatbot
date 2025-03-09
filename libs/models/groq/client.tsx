import Markdown from '@/components/Markdown';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { z } from 'zod';

import { BaseModelSchema, ModelSchema } from '../../schemas';
import { BaseClientModel } from '../base-client';
import { schema } from './schema';

export default class GroqClientModel implements BaseClientModel<'groq'> {
  public readonly type = 'groq';
  public readonly label = 'Groq';
  public readonly icon = '/images/models/groq/icon.png';
  public readonly payment = 'free';

  public getDefaultConfig(): BaseModelSchema & z.infer<typeof schema> {
    return {
      type: 'groq',
      apiKey: '',
      modelName: 'llama-3.3-70b-versatile',
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
        content={`Groq is an AI company that offers free and fast AI solutions through its GroqCloud™ platform. They provide a range of advanced AI models, including DeepSeek-R1-Distill-Llama-70B, Llama 3.3 70B, and so on. You can apply for a free API key on their website.
  
1. Sign in at [Groq Cloud](https://console.groq.com).
2. Create a new API key.

![](/images/models/groq/tutorial_1.png)

3. Copy the API key and paste it into the \`API key\` field.

![](/images/models/groq/tutorial_2.png)`}
      />
    );
  }
}
