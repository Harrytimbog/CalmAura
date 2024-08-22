// Database.js
import {MongoClient} from 'mongodb';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';

// Replace with your MongoDB Atlas connection string
const uri = 'mongodb+srv://abedo:Abedo2022@cluster0.5t4ke.mongodb.net/';

let client;
let db;

const getDBConnection = async () => {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db('PeripheralActivityTracker');
  }
  return db;
};

export const insertActivity = async activity => {
  const db = await getDBConnection();
  const collection = db.collection('activities');
  await collection.insertOne({...activity, id: uuidv4()});
};
