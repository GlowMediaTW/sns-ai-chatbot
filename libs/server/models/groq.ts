import { modelSchema } from '@/libs/schemas';
import { createGroq } from '@ai-sdk/groq';
import { CoreMessage, generateText, streamText } from 'ai';
import { z } from 'zod';

import { BaseServerModel } from './base';

export class GroqServerModel implements BaseServerModel<'groq'> {
  public readonly type = 'groq';

  public config: Extract<z.infer<typeof modelSchema>, { type: 'groq' }>;

  constructor(config: z.infer<typeof modelSchema>) {
    this.config = config as Extract<z.infer<typeof modelSchema>, { type: 'groq' }>;
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
