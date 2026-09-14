import * as Yup from 'yup';
import { Product } from '../models/Product.js';

// biome-ignore lint: false positive
export class ProductController {
  static async store(req, res) {
    const schema = Yup.object({
      name: Yup.string()
        .required('Name is required')
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),
      price: Yup.number().required('Price is required'),
      category: Yup.string()
        .required('Category is required')
        .min(3, 'Category must be at least 8 characters')
        .max(100, 'Category cannot exceed 50 characters'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { name, price, category } = req.body;
    const { filename: path } = req.file;

    const product = await Product.create({
      name,
      price,
      category,
      path,
    });

    return res.status(201).json(product);
  }

  static async index(_, res) {
    const products = await Product.findAll();

    return res.status(200).json(products);
  }
}
