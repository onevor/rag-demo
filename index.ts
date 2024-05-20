import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';


const env = await load();
const PINECONE_API_KEY = env['PINECONE_API_KEY']
const OPENAI_API_KEY = env['OPENAI_API_KEY']


export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const pc = new Pinecone({
  apiKey: PINECONE_API_KEY as string,
});

export const index = pc.index('startup-demo');

export async function createEmbeddings(text: string) {
  return openai.embeddings.create({
    input: text,
    model: 'text-embedding-ada-002',
  });
}

export async function createVectorPayload(data: Record<string, any>[]) {
  return Promise.all(
    data.map(async (d) => {
      const res = await createEmbeddings(d.text);
      const embedding = res.data[0].embedding;
      return { id: d.id, values: embedding, metadata: { text: d.text } };
    }),
  );
}