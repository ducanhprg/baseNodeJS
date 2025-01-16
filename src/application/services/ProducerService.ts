import { v4 as uuidv4 } from 'uuid';
import { getRedisClient } from '@shared/utils/RedisClient';
import { sendMessageToQueue } from '@shared/utils/RabbitMQClient';

export const handleRequest = async (): Promise<string> => {
    const redisClient = getRedisClient();
    const requestId = uuidv4();
    const rateIds = Array.from({ length: 10 }, () => uuidv4());

    await redisClient.set(`request:${requestId}:rate_ids`, JSON.stringify(rateIds));

    await sendMessageToQueue('rate_validation', JSON.stringify({ requestId }));

    return requestId;
};
