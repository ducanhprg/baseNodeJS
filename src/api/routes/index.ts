import { Router, Request, Response } from 'express';

const router = Router();

// Define a route for "/"
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('API is working!');
});

export default router;
