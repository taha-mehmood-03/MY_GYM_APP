import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env.local

const uri = "mongodb://localhost:27017/TAHAKHAN";
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
    console.log("connected to mongodb")
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  console.log("connected to mongodb")
}

export default clientPromise;