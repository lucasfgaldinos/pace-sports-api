import * as Yup from 'yup';
import { Category } from '../models/Category.js';
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
      category_id: Yup.number().required('category_id is required'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { name, price, category_id } = req.body;
    const { filename: path } = req.file;

    const product = await Product.create({
      name,
      price,
      category_id,
      path,
    });

    return res.status(201).json(product);
  }

  static async index(_, res) {
    const products = await Product.findAll({
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    });

    return res.status(200).json(products);
  }
}
