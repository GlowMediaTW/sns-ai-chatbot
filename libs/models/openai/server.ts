import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import { z } from 'zod';

import { BaseModelSchema } from '../../schemas';
import { BaseServerModel } from '../base-server';
import { schema } from './schema';

export default class OpenAIServerModel implements BaseServerModel<'openai', typeof schema> {
  public readonly type = 'openai';

  public config: BaseModelSchema & z.infer<typeof schema>;

  constructor(config: BaseModelSchema & z.infer<typeof schema>) {
    this.config = config;
  }

  public stream(messages: Parameters<typeof streamText>[0]['messages']) {
    const model = this.getModel();
    const result = streamText({
      model,
      messages,
      temperature: this.config.temperature,
      onError: (error) => {
        console.error(error);
      },
    });

    return result.toDataStreamResponse();
  }

  public async invoke(messages: Parameters<typeof generateText>[0]['messages']) {
    const model = this.getModel();
    try {
      const { text: output } = await generateText({
        model,
        messages,
        temperature: this.config.temperature,
      });
      return { success: true, output };
    } catch (error) {
      console.error(error);
      return { success: false, output: 'An error occurred' };
    }
  }

  private getModel() {
    const openai = createOpenAI({
      apiKey: this.config.apiKey,
    });

    return openai(this.config.modelName);
  }
}
