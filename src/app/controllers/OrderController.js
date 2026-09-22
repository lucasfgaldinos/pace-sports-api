import * as Yup from 'yup';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import Order from '../schemas/Order.js';

// biome-ignore lint: false positive
export class OrderController {
  static async store(req, res) {
    const schema = Yup.object({
      products: Yup.array()
        .required('Products is required')
        .of(
          Yup.object({
            id: Yup.number().required('Id is required'),
            quantity: Yup.number().required('Quantity is required'),
          }),
        ),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { userId, userName } = req;
    const { products } = req.body;

    const productsIds = products.map((product) => product.id);

    const findedProducts = await Product.findAll({
      where: {
        id: productsIds,
      },
      include: {
        model: Category,
        as: 'category',
        attributes: ['name'],
      },
    });

    const mapedProducts = findedProducts.map((product) => {
      const quantity = products.find((p) => p.id === product.id).quantity;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        url: product.url,
        category: product.category.name,
        quantity,
      };
    });

    const order = {
      user: {
        id: userId,
        name: userName,
      },
      products: mapedProducts,
      status: 'Pedido realizado',
    };

    const newOrder = await Order.create(order);

    return res.status(201).json(newOrder);
  }

  static async update(req, res) {
    const schema = Yup.object({
      status: Yup.string().required('Status is required'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { id } = req.params;
    const { status } = req.body;

    try {
      await Order.updateOne({ _id: id }, { status });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(200).json();
  }

  static async index(_req, res) {
    try {
      const orders = await Order.find();

      return res.status(200).json(orders);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
