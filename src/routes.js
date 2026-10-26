import { Router } from 'express';
import multer from 'multer';
import { CategoryController } from './app/controllers/CategoryController.js';
import { OrderController } from './app/controllers/OrderController.js';
import { ProductController } from './app/controllers/ProductController.js';
import { SessionController } from './app/controllers/SessionController.js';
import { CreatePaymentIntentController } from './app/controllers/stripe/CreatePaymentIntentController.js';
import { UserController } from './app/controllers/UserController.js';
import { adminMiddleware } from './app/middlewares/admin.js';
import { authMiddleware } from './app/middlewares/auth.js';
import fileRoutesConfig from './config/fileRoutes.cjs';
import multerConfig from './config/multer.cjs';

export const routes = Router();

const upload = multer(multerConfig);

routes.get('/', (_, res) => res.status(200).json({ status: 'ok' }));

routes.post('/users', await UserController.store);
routes.post('/sessions', await SessionController.store);

routes.use('/product-file', fileRoutesConfig);
routes.use('/category-file', fileRoutesConfig);

routes.use(authMiddleware);

routes.post(
  '/products',
  adminMiddleware,
  upload.single('file'),
  await ProductController.store,
);
routes.get('/products', await ProductController.index);
routes.post(
  '/categories',
  adminMiddleware,
  upload.single('file'),
  await CategoryController.store,
);
routes.put(
  '/products/:id',
  adminMiddleware,
  upload.single('file'),
  await ProductController.update,
);
routes.delete('/products/:id', adminMiddleware, await ProductController.delete);
routes.put(
  '/categories/:id',
  adminMiddleware,
  upload.single('file'),
  await CategoryController.update,
);
routes.get('/categories', await CategoryController.index);
routes.post('/orders', await OrderController.store);
routes.get('/orders', await OrderController.index);
routes.patch('/orders/:id', adminMiddleware, await OrderController.update);

routes.post('/create-payment-intent', CreatePaymentIntentController.store);
