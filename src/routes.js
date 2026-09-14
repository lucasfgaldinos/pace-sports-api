import { Router } from 'express';
import { SessionController } from './app/controllers/SessionController.js';
import { UserController } from './app/controllers/UserController.js';

export const routes = Router();

routes.get('/', (_, res) => res.status(200).json({ status: 'Ok' }));
routes.post('/users', await UserController.store);
routes.post('/session', await SessionController.store);
