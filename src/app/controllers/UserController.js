import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import * as Yup from 'yup';
import { User } from '../models/User.js';

// biome-ignore lint: false positive
export class UserController {
  static async store(req, res) {
    const schema = Yup.object({
      name: Yup.string()
        .required('Name is required')
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),
      email: Yup.string()
        .required('Email is required')
        .trim()
        .max(100, 'Email cannot exceed 100 characters')
        .lowercase()
        .email('Invalid email address'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password cannot exceed 50 characters'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return res
        .status(409)
        .json({ message: 'This email address is already in use.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      id: v4(),
      name,
      email,
      password_hash,
      is_admin: false,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  }
}
