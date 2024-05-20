
import {
  openai,
  pc,
  index,
  createEmbeddings,
  createVectorPayload,
} from './index.ts'

async function run() {
  const data = [
    { id: 'A', text: `My cat is stuck on the roof!` },
    { id: 'B', text: `My dog is in the park.` },
    { id: 'C', text: `Dogs are objectively better than cats.` },
    { id: 'D', text: `Cats are dicks.` },
    {
      id: 'E',
      text: `My cat is planning to overthrow the government on the roof, with all the neighbor cats.`,
    },
    { id: 'F', text: `Overthrowing the government is illegal.` },
  ];

  const vectorPayload = await createVectorPayload(data);

  const storePayload = await index.upsert(vectorPayload);
}

run();
