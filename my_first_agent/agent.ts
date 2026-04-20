import {FunctionTool, LlmAgent} from '@google/adk';
import {z} from 'zod';

/* Mock tool implementation */
const getCurrentTime = new FunctionTool({
  name: 'get_current_time',
  description: 'Returns the current time in a specified city.',
  parameters: z.object({
    city: z.string().describe("The name of the city for which to retrieve the current time."),
  }),
  execute: ({city}) => {
    return {status: 'success', report: `The current time in ${city} is 10:00 AM!!!!`};
  },
});

/* Additional mock tool: returns the timezone for a city */
const getTimezone = new FunctionTool({
  name: 'get_timezone',
  description: 'Returns the IANA timezone for a specified city (mock implementation).',
  parameters: z.object({
    city: z.string().describe('The name of the city to lookup the timezone for.'),
  }),
  execute: ({city}) => {
    const map: Record<string, string> = {
      'New York': 'America/New_York',
      London: 'Europe/London',
      Dhaka: 'Asia/Dhaka',
      Tokyo: 'Asia/Tokyo',
    };
    const timezone = map[city] ?? 'UTC';
    return {status: 'success', timezone, report: `Timezone for ${city} is ${timezone}`};
  },
});

export const rootAgent = new LlmAgent({
  name: 'hello_time_agent',
  model: 'gemini-flash-latest',
  description: 'Tells the current time in a specified city.',
  instruction: `You are a helpful assistant that tells the current time and timezone for a city. Use the 'get_current_time' tool to fetch the current time and the 'get_timezone' tool to fetch the city's timezone. Call tools only when needed.`,
  tools: [getCurrentTime, getTimezone],
});