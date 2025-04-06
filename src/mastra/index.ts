import { Mastra } from '@mastra/core';
import { createLogger } from '@mastra/core/logger';
import { chefAgent } from "./agents/chefAgent.js";
import type { IncomingMessage, ServerResponse } from 'http';

const mastra = new Mastra({
  agents: { 
    chefAgent
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

export { mastra };

interface ExtendedIncomingMessage extends IncomingMessage {
  body: any;
}

interface ExtendedServerResponse extends ServerResponse {
  json: (data: any) => void;
  status: (code: number) => ExtendedServerResponse;
}

export default async function handler(
  req: ExtendedIncomingMessage,
  res: ExtendedServerResponse
) {
  try {
    if (req.method === 'POST') {
      const { message } = req.body;
      const result = await chefAgent.handleMessage(message);
      return res.status(200).json(result);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 