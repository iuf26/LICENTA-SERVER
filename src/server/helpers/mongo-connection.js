import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const DB_NAME = "server-store";
const USER_COLLECTION = "users";
const client = new MongoClient(process.env.MONGO_CONNECTION_STRING);
export const db = () => {
    return client.db(DB_NAME);
}

export const users = () => {
    return db().collection(USER_COLLECTION)
}

export async function establishDbConnection() {
  await client.connect();
  console.info("Connection established");
}

export async function closeDbConnection() {
  await client.close();
  console.info("Connection closed");
}


