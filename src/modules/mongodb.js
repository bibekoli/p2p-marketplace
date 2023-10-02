import { MongoClient, ServerApiVersion } from "mongodb";

const MongoDBConfig = {
  serverApi: ServerApiVersion.v1,
};

let client = null;
let db = null;

export default async function ConnectToDatabase() {
  if (!client || !db) {
    client = new MongoClient(process.env.MONGODB_URL, MongoDBConfig);
    await client.connect();
    db = client.db(process.env.MONGODB_NAME);
  }
  return { client, db };
}