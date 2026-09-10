import { Router } from 'express';
import { UserController } from './app/controllers/UserController.js';

export const routes = Router();

routes.post('/users', await UserController.store);
