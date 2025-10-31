import { Client, Databases, Storage, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // ✅ Appwrite Cloud endpoint
  .setProject("68dfc7a7001260284dec"); // ⚠️ replace with your Appwrite Project ID

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export const DATABASE_ID = "68dfc96e000bf0ad885a";
export const POSTS_COLLECTION_ID = "problems";
export const COMMENTS_COLLECTION_ID = "comments";
export const STORAGE_BUCKET_ID = "68e67ce9000f486e7e00";

export default client;
