import { DiscordServerApp } from './apps/discord';
import { LineServerApp } from './apps/line';
import { GroqServerModel } from './models/groq';
import { OpenAIServerModel } from './models/openai';

export const serverModelRecord = {
  groq: GroqServerModel,
  openai: OpenAIServerModel,
};

export const serverAppRecord = {
  line: LineServerApp,
  discord: DiscordServerApp,
};
