import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserPsych from '../authModels/authPsychSchema';
import { IUserPsych } from '../authModels/authPsychSchema';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await UserPsych.findOne({ email }) as IUserPsych;
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

// New function to handle user update without requiring userId in the request body
export const updateUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Extract userId from JWT token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret is missing' });
    }

    // Verify the token and extract userId
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    const userId = decoded.userId;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update username and password
    const updatedUser = await UserPsych.findByIdAndUpdate(
      userId,
      { username, password: hashedPassword },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user' });
  }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  const { username, newPassword } = req.body;

  if (username !== "cvsu.psychologydepartment@gmail.com") {
    return res.status(400).json({ message: "Invalid username." });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await UserPsych.findOneAndUpdate(
      { email: username },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Password reset successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while resetting password." });
  }
};
