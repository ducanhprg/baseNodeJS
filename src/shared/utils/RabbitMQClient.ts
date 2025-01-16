import amqplib from 'amqplib';

const RABBITMQ_URL = 'amqp://guest:guest@docker_rabbitmq:5672';

export const sendMessageToQueue = async (queue: string, message: string) => {
    const connection = await amqplib.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));

    await channel.close();
    await connection.close();
};

export const createChannel = async () => {
    const connection = await amqplib.connect(RABBITMQ_URL);
    return await connection.createChannel();
};
