import express, { Application } from 'express';
import cors from 'cors';
import routes from './api/routes';
import {createRequest} from "@api/controllers/ProducerController";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/', routes);

app.post('/api/create-request', createRequest);

export default app;
