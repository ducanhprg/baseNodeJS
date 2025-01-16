import { startConsumer } from '@application/services/ConsumerService';
import express from 'express';
import { createChannel } from '@shared/utils/RabbitMQClient';
import { getRedisClient } from '@shared/utils/RedisClient';

(async () => {
    try {
        console.log('Starting RabbitMQ consumer...');
        await startConsumer();
        console.log('Consumer is running.');

        const app = express();
        app.get('/health', async (_req, res) => {
            try {
                // Check RabbitMQ connection
                const channel = await createChannel();
                await channel.assertQueue('rate_validation', { durable: true });
                await channel.close();

                // Check Redis connection
                const redisClient = getRedisClient();
                const redisPing = await redisClient.ping();

                if (redisPing !== 'PONG') {
                    throw new Error('Redis connection failed');
                }

                res.status(200).json({
                    status: 'UP',
                    services: {
                        rabbitmq: 'connected',
                        redis: 'connected'
                    }
                });
            } catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ status: 'DOWN', message: 'Health check failed', error: error.message });
                } else {
                    res.status(500).json({ status: 'DOWN', message: 'Health check failed', error: String(error) });
                }
            }
        });

        const healthPort = process.env.HEALTH_PORT || 3001;
        app.listen(healthPort, () => {
            console.log(`Health check endpoint available at http://localhost:${healthPort}/health`);
        });
    } catch (error) {
        console.error('Error starting consumer:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
})();
