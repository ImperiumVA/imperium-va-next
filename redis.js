import * as dotenv from 'dotenv'
dotenv.config()
import Redis from "ioredis"

const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD
} = process.env
console.log({
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD
});

export const redis = new Redis({
    host: REDIS_HOST || 'localhost',
    port: Number(REDIS_PORT) || 6379,
    password: REDIS_PASSWORD || '',
});

export default redis;