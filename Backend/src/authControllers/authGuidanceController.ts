import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserGuidance from '../authModels/authGuidanceSchema';

export const loginGuidance = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await UserGuidance.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret is missing' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};