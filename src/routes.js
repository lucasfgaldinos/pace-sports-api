import { Router } from 'express';
import multer from 'multer';
import { CategoryController } from './app/controllers/CategoryController.js';
import { ProductController } from './app/controllers/ProductController.js';
import { SessionController } from './app/controllers/SessionController.js';
import { UserController } from './app/controllers/UserController.js';
import fileRoutesConfig from './config/fileRoutes.cjs';
import multerConfig from './config/multer.cjs';
import { adminMiddleware } from './middlewares/admin.js';
import { authMiddleware } from './middlewares/auth.js';

export const routes = Router();

const upload = multer(multerConfig);

routes.get('/', (_, res) => res.status(200).json({ status: 'ok' }));

routes.post('/users', await UserController.store);
routes.post('/session', await SessionController.store);

routes.use('/product-file', fileRoutesConfig);
routes.use('/category-file', fileRoutesConfig);

routes.use(authMiddleware, adminMiddleware);

routes.post('/products', upload.single('file'), await ProductController.store);
routes.get('/products', await ProductController.index);
routes.post(
  '/categories',
  upload.single('file'),
  await CategoryController.store,
);
routes.put(
  '/categories/:id',
  upload.single('file'),
  await CategoryController.update,
);
routes.get('/categories', await CategoryController.index);
