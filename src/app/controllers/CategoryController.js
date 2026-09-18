import * as Yup from 'yup';
import { Category } from '../models/Category.js';

// biome-ignore lint: false positive
export class CategoryController {
  static async store(req, res) {
    const schema = Yup.object({
      name: Yup.string()
        .required('Name is required')
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { name } = req.body;

    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    });

    if (categoryExists) {
      return res.status(400).json({ error: 'Category already exists.' });
    }

    const { filename: path } = req.file;

    const category = await Category.create({
      name,
      path,
    });

    return res.status(201).json(category);
  }

  static async update(req, res) {
    const schema = Yup.object({
      name: Yup.string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { id } = req.params;

    const categoryExists = await Category.findOne({
      where: {
        id,
      },
    });

    if (!categoryExists) {
      return res.status(400).json({ error: 'Category not found.' });
    }

    const name = req.body?.name;

    if (name) {
      const categoryNameExists = await Category.findOne({
        where: {
          name,
        },
      });

      if (categoryNameExists) {
        return res.status(400).json({ error: 'Category already exists.' });
      }
    }

    let path;
    if (req.file) {
      const { filename } = req.file;
      path = filename;
    }

    await Category.update(
      {
        name,
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
    const categories = await Category.findAll();

    return res.status(200).json(categories);
  }
}
