import { createGroq } from '@ai-sdk/groq';
import { CoreMessage, generateText, streamText } from 'ai';
import { z } from 'zod';

import { BaseModelSchema } from '../../schemas';
import { BaseServerModel } from '../base-server';
import { schema } from './schema';

export default class GroqServerModel implements BaseServerModel<'groq', typeof schema> {
  public readonly type = 'groq';

  public config: BaseModelSchema & z.infer<typeof schema>;

  constructor(config: BaseModelSchema & z.infer<typeof schema>) {
    this.config = config;
  }

  public stream(messages: CoreMessage[]) {
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
    const groq = createGroq({
      apiKey: this.config.apiKey,
    });

    return groq(this.config.modelName);
  }
}
