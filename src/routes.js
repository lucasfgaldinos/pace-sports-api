import { Router } from 'express';
import { v4 } from 'uuid';
import { User } from './app/models/User.js';

export const routes = Router();

routes.post('/', async (_, res) => {
  const user = {
    id: v4(),
    name: 'Adriana',
    email: 'adriana@email.com',
    password_hash: '128093749123jshdfuasdhf123946',
    is_admin: false,
  };

  const userCreated = await User.create(user);

  return res.status(201).json({ userCreated });
});
