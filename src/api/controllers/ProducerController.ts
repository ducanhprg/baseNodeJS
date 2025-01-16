import { Request, Response } from 'express';
import { handleRequest } from '@application/services/ProducerService';

export const createRequest = async (_req: Request, res: Response) => {
    try {
        // process data
        const requestId = await handleRequest();
        // wait: request:${requestId}:validated`& request:${requestId}:get_cost`
        // print label logic
        res.status(200).json({ message: 'Request processed', requestId });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to process request', error: error.message });
        } else {
            res.status(500).json({ message: 'Failed to process request', error: String(error) });
        }
    }
};
