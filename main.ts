import { search } from './get.ts'

import {
  createPrompt,
  streamLLm,
  answer,
  getHistory,
  writeHistory,
  createQ,
  systemP,
} from './llm.ts'

const q1 = 'What kind of animal do i have?'
const q2 = 'Why are dogs better than cats?'
const q3 = 'Is any of my pets, criminals?'

const q = Deno.args.join(' ');

if (!q) {
  console.error('Please provide a question');
  Deno.exit(1);
}

const historyFile = './history.json';

async function run(q: string) {
  try {
    const historyData = await getHistory(historyFile);
    const kb = await search(q);

    if (historyData.length === 0) {
      const sys = systemP();
      historyData.push(sys);
    }

    const query = createQ(q, JSON.stringify(kb));
    historyData.push(query);

    const prompt = createPrompt(query, historyData);

    const stream = await answer(prompt, historyData)

    historyData.push(stream);

    await writeHistory(historyFile, historyData);
  } catch (error) {
    console.error('Error: running', error);
    Deno.exit(1);
  }
}

run(q);
