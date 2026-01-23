import { Db, MongoClient } from "mongodb";

console.log(process.env.MONGODB_URI);

const uri = process.env.MONGODB_URI!;
const dbName = process.env.DB_NAME;
const options = {};

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your environment variables");
}

const client = new MongoClient(uri, options);
const mongoClient: Promise<MongoClient> = client.connect();

export async function getDB(): Promise<Db> {
  const dbClient = await mongoClient;
  return dbClient.db(dbName);
}
