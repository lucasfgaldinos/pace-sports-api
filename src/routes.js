import { Router } from 'express';
import multer from 'multer';
import { CategoryController } from './app/controllers/CategoryController.js';
import { ProductController } from './app/controllers/ProductController.js';
import { SessionController } from './app/controllers/SessionController.js';
import { UserController } from './app/controllers/UserController.js';
import multerConfig from './config/multer.cjs';
import { adminMiddleware } from './middlewares/admin.js';
import { authMiddleware } from './middlewares/auth.js';

export const routes = Router();

const upload = multer(multerConfig);

routes.get('/', (_, res) => res.status(200).json({ status: 'Ok' }));
routes.post('/users', await UserController.store);
routes.post('/session', await SessionController.store);

routes.use(authMiddleware, adminMiddleware);

routes.post('/products', upload.single('file'), await ProductController.store);
routes.get('/products', await ProductController.index);
routes.post('/categories', await CategoryController.store);
routes.get('/categories', await CategoryController.index);
