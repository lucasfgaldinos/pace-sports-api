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
      description: Yup.string().required('Description is required'),
      category_id: Yup.number().required('category_id is required'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { name, description, price, category_id } = req.body;
    const { filename: path } = req.file;

    const product = await Product.create({
      name,
      description,
      price,
      category_id,
      path,
    });

    return res.status(201).json(product);
  }

  static async update(req, res) {
    const schema = Yup.object({
      name: Yup.string().trim(),
      price: Yup.number(),
      description: Yup.string(),
      category_id: Yup.number(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { id } = req.params;

    const productExists = await Product.findOne({
      where: {
        id,
      },
    });

    if (!productExists) {
      return res.status(400).json({ error: 'Product not found.' });
    }

    const name = req.body?.name;
    const price = req.body?.price;
    const description = req.body?.description;
    const category_id = req.body?.category_id;

    let path;
    if (req.file) {
      const { filename } = req.file;
      path = filename;
    }

    await Product.update(
      {
        name,
        description,
        price,
        category_id,
        path,
      },
      {
        where: {
          id,
        },
      },
    );

    return res.status(200).json();
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

  static async delete(_, res) {
    const { id } = req.params;

    const productExists = await Product.findOne({
      where: {
        id,
      },
    });

    if (!productExists) {
      return res.status(400).json({ error: 'Product not found.' });
    }

    try {
      await Product.destroy({
        where: {
          id,
        },
      });
      return res.status(200).json(products);
    } catch (_err) {
      return res.status(400).json({ error: 'Product not found.' });
    }
  }
}
