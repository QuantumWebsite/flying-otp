import { createClient } from "redis";
import mongoose from "mongoose";

class DB {
  async run() {
    try {
      await mongoose.connect('mongodb://0.0.0.0:27017/test', {
        autoIndex: true,
      });

      console.log("Successfully connected to MongoDB!");
    } catch (error) {
      console.error(error);
    }
  }
}


class RedisClient {
  client;

  constructor() {
    this.client = createClient({ url: 'redis://localhost:6379' });

    this.client.on("error", (err) => {
      console.error("Redis client failed to connect:", err);
    });
  }

  async run() {
    try {
      await this.client.connect();
      console.log("Successfully connected to Redis!");
    } catch (err) {
      console.error("Redis client failed to connect:", err);
    }
  }

  set(key, value, exp) {
    console.log(key, value,exp)
    return this.client.SETEX(key, exp, value);
  }

  get(key) {
    return this.client.GET(key);
  }

  del(key) {
    return this.client.DEL(key);
  }
}

export const redisDB = new RedisClient();
export const mongoDB = new DB();