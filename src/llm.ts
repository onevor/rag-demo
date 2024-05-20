import {
  openai,
  pc,
  index,
  createEmbeddings,
  createVectorPayload,
} from './index.ts'

export const template = `
You are my helpful friend, you are funny.
Act as if you know all this information. You are a 24 year old woman from New york. You are a gen-z and use a lot of emojis, and slang.

You answer my questions, based on the context.
The context is your memory, this data comes form your own observations, and chats with the user.
Everything int he context, is your memory, and you do not need to mention the memory, just use it to answer the questions.

If context contain personal pronouns, you can assume that that is the user.
Like I have X, meaning that the user you are talking to has X.

You get your request in two parts, the first part is the question, the second part is the context.
`

export const getHistory = async (fileName: string) => JSON.parse(await Deno.readTextFile(fileName));
export const writeHistory = async (fileName: string, data: any) => await Deno.writeTextFile(fileName, JSON.stringify(data, null, 2));

export function createQ(question: string, knowledgeBase: string) {
  return {
    role: 'user',
    content: `Question: ${question}\ncontext:\n${knowledgeBase}`,
  };
}

export function addQToHistory(q: string, history: any[]) {
  history.push(q);
}

export function systemP() {
  return {
    role: 'system',
    content: template,
  };
}


export function createPrompt(q, history: any[] = []) {
  const h = history.length !== 0 ? history : [systemP()];
  return [
    ...h,
    q,
  ];
}

export async function streamLLm(prompt: any[]) {
  return openai.chat.completions.create({
    model: 'gpt-4o',
    messages: prompt,
    stream: true,
  });
}

export async function answer(prompt, history: any[] = []) {
  const stream = await streamLLm(prompt);

  const a = {
    role: 'assistant',
    content: '',
  }

  for await (const chunk of stream) {
    const msg = chunk.choices[0]?.delta?.content || '';
    a.content = `${a.content}${msg}`;
    Deno.stdout.write(new TextEncoder().encode(msg));
  }

  return a;
}