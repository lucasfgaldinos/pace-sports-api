import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth.js';
import { User } from '../models/User.js';

// biome-ignore lint: false positive
export class SessionController {
  static async store(req, res) {
    const schema = Yup.object({
      email: Yup.string().required().trim().max(100).lowercase().email(),
      password: Yup.string().required().min(8).max(50),
    });

    const isValid = schema.isValidSync(req.body, { strict: true });

    function incorrectEmailOrPassword() {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    if (!isValid) return incorrectEmailOrPassword();

    const { email, password } = req.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (!userExists) return incorrectEmailOrPassword();

    const isSamePassword = await bcrypt.compare(
      password,
      userExists.password_hash,
    );

    if (!isSamePassword) return incorrectEmailOrPassword();

    const token = jwt.sign(
      {
        id: userExists.id,
        name: userExists.name,
        is_admin: userExists.is_admin,
      },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      },
    );

    return res.status(201).json({
      id: userExists.id,
      name: userExists.name,
      email: userExists.email,
      is_admin: userExists.is_admin,
      token,
    });
  }
}
