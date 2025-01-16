import Redis from 'ioredis';

const redisClient = new Redis({
    host: 'docker_redis',
    port: 6379,
});

export const getRedisClient = () => redisClient;

export const getCache = async (key: string): Promise<string | null> => {
    return await redisClient.get(key);
};

export const setCache = async (key: string, value: string, ttl: number = 3600): Promise<void> => {
    await redisClient.set(key, value, 'EX', ttl);
};
