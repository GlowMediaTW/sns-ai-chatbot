import { modelSchema } from '@/libs/schemas';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';
import { z } from 'zod';

import { BaseServerModel } from './base';

export class OpenAIServerModel implements BaseServerModel<'openai'> {
  public readonly type = 'openai';

  public config: Extract<z.infer<typeof modelSchema>, { type: 'openai' }>;

  constructor(config: z.infer<typeof modelSchema>) {
    this.config = config as Extract<z.infer<typeof modelSchema>, { type: 'openai' }>;
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
