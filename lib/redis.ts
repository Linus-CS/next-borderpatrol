import { createClient } from "redis";

const client = createClient();

console.log("test");

client.on("error", (err) => {
  console.log("Redis Error: ", err);
});

let connected = false;

export async function connectDB() {
  await client.connect();
  connected = true;
}

export async function setAsync(key: string, value: any) {
  if (!connected) return "not connected.";
  await client.set(key, value);
  return "success";
}

export async function getAsync(key: string) {
  if (!connected) return "not connected.";
  return await client.get(key);
}

export async function deleteAsync(key: string) {
  if (!connected) return "not connected.";
  await client.del(key);
  return "success";
}
