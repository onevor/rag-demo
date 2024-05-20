import {
  openai,
  pc,
  index,
  createEmbeddings,
  createVectorPayload,
} from './index.ts'

export async function search(text: string) {
  try {
    const embeddingRes = await createEmbeddings(text)
    const embedding = embeddingRes.data[0].embedding;

    const queryRequest = {
        vector: embedding,
        topK: 10,
        includeValues: false,
        includeMetadata: true
    }
    const response = await index.query(queryRequest)
    return { data: response };
  } catch (error) {
      console.error('Error: searching', error);
      throw error;
  }
}