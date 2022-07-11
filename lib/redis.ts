import { createClient } from "redis";

const client = createClient({
  url: 'redis://containers-us-west-56.railway.app:6435',
  password: '4OhPIaNlypnApiJdNm2E',
  username: 'default'
});

client.on("error", (err) => {
  console.log("Redis Error: ", err);
});

let connected = false;

export async function connectDB() {
  if (connected) return;
  await client.connect();
  connected = true;
}

export async function setAsync(key: string, value: any) {
  if (!connected) await connectDB();
  await client.set(key, JSON.stringify(value));
  return true;
}

export async function getAsync(key: string) {
  if (!connected) await connectDB();
  return JSON.parse((await client.get(key))!!);
}

export async function deleteAsync(key: string) {
  if (!connected) await connectDB();
  await client.del(key);
  return true;
}
