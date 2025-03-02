import { DiscordClientApp } from './apps/discord';
import { LineClientApp } from './apps/line';
import { GroqClientModel } from './models/groq';
import { OpenAIClientModel } from './models/openai';

export const freeClientModelRecord = {
  groq: new GroqClientModel(),
};

export const paidClientModelRecord = {
  openai: new OpenAIClientModel(),
};

export const clientModelRecord = {
  ...freeClientModelRecord,
  ...paidClientModelRecord,
};

export const clientAppRecord = {
  line: new LineClientApp(),
  discord: new DiscordClientApp(),
};
