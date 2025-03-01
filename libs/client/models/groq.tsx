import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { z } from 'zod';

import { modelSchema } from '../../schemas';
import { BaseClientModel } from './base';

export class GroqClientModel implements BaseClientModel<'groq'> {
  public readonly type = 'groq';
  public readonly label = 'Groq';
  public readonly icon = '/groq_model_icon.png';
  public readonly tutorial = `Groq is an AI company that offers free and fast AI solutions through its GroqCloud™ platform. They provide a range of advanced AI models, including DeepSeek-R1-Distill-Llama-70B, Llama 3.3 70B, and so on. You can apply for a free API key on their website.
  
1. Sign in at [Groq Cloud](https://console.groq.com).
2. Create a new API key.

![](/tutorials/groq/1.png)

3. Copy the API key and paste it into the \`API key\` field.

![](/tutorials/groq/2.png)`;

  public getDefaultConfig() {
    return {
      type: 'groq',
      apiKey: '',
      modelName: 'llama-3.3-70b-versatile',
      temperature: 0,
    } as const;
  }

  public getForm(_config: z.infer<typeof modelSchema>) {
    const config = _config as Extract<z.infer<typeof modelSchema>, { type: 'groq' }>;
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
