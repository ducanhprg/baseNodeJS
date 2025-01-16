import { createChannel } from '@shared/utils/RabbitMQClient';
import { getCache, setCache } from '@shared/utils/RedisClient';
import axios from 'axios';
import pLimit from 'p-limit';

export const startConsumer = async () => {
    const channel = await createChannel();
    await channel.assertQueue('rate_validation', { durable: true });

    await channel.prefetch(5);

    console.log('Listening to queue: rate_validation');

    channel.consume(
        'rate_validation',
        async (msg) => {
            if (msg) {
                const { requestId } = JSON.parse(msg.content.toString());
                console.log(`Processing request ID: ${requestId}`);

                const rateIdsKey = `request:${requestId}:rate_ids`;
                const rateIds: string[] = JSON.parse((await getCache(rateIdsKey)) || '[]');

                const limit = pLimit(10);
                const results = await Promise.all(
                    rateIds.map((rateId) =>
                        limit(async () => {
                            try {
                                const response = await axios.post('https://api.thirdparty.com/validate', { rateId });
                                return { rateId, validation: response.data };
                            } catch (error) {
                                if (error instanceof Error) {
                                    console.error('Validation failed for rate ID:', error.message);
                                } else {
                                    console.error('Validation failed for rate ID:', String(error));
                                }
                                return { rateId, validation: null };
                            }
                        })
                    )
                );

                const validationKey = `request:${requestId}:validated`;
                await setCache(validationKey, JSON.stringify(results));

                channel.ack(msg);
            }
        },
        { noAck: false }
    );
};
