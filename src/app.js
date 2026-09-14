import express from 'express';
import fileRoutesConfig from './config/fileRoutes.cjs';
import { routes } from './routes.js';

export const app = express();

app.use(express.json());
app.use('/product-file', fileRoutesConfig);
app.use(routes);
