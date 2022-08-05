import { createClient } from "redis";

export async function getClient() {
  const client = createClient();

  client.on("error", (err) => {
    console.log("Redis Error: ", err);
  });

  await client.connect();
  return client;
}

export async function connectDB(client) {
  if (client.isOpen) return;
  await client.connect();
}

export async function setAsync(client, key: string, value: any, expire?: number) {
  await client.set(key, JSON.stringify(value));
  if (expire) await client.expire(key, expire);
  return true;
}

export async function getAsync(client, key: string) {
  return JSON.parse((await client.get(key))!!);
}

export async function deleteAsync(client, key: string) {
  await client.del(key);
  return true;
}
