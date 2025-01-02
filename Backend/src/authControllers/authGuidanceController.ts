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

    // Assuming your user model has a 'role' field
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    
    return res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role, // Send the role along with the token
      email: user.email,
      userId: user.userId,
      fullName: user.fullName

    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// New function to handle user update without requiring userId in the request body
export const updateGuidanceUser = async (req: Request, res: Response) => {
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
    const updatedUser = await UserGuidance.findByIdAndUpdate(
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

  if (username !== "cvsu.guidance@gmail.com") {
    return res.status(400).json({ message: "Invalid username." });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await UserGuidance.findOneAndUpdate(
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


export const updateUserRole = async (req: Request, res: Response) => {
  const { role } = req.body;

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

    // Update role
    const updatedUser = await UserGuidance.findByIdAndUpdate(
      userId,
      { role }, // Update role
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
};

export const subGuidance = async (req: Request, res: Response): Promise<Response> => {
  const { email, fullName, password, role, userId} = req.body;

  try {
      // Check if email or userId already exists
      const existingGuidance = await UserGuidance.findOne({ $or: [{ email }, { userId }] });

      if (existingGuidance) {
        // Send specific errors if email or userId exists
        if (existingGuidance.email === email) {
            return res.status(400).json({ error: 'email_exists' }); // Correct error handling for email
        }
        if (existingGuidance.userId === userId) {
            return res.status(400).json({ error: 'userId_exists' }); // Handle userId error
        }
    }
    

      // Hash the password and save the new student
      const hashedPassword = await bcrypt.hash(password, 12);
      const newGuidance = new UserGuidance({
          email,
          fullName,
          password: hashedPassword,
          role,
          userId
         
      });

      await newGuidance.save();
      return res.status(201).json({ message: 'sub account created successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
};


export const getAllGuidance = async (req: Request, res: Response): Promise<Response> => {
  
  try {
      const guidance = await UserGuidance.find({}, 'email userId role fullName'); // Fetch only email and userId fields
      return res.status(200).json(guidance);
  } catch (error) {
      console.error('Error fetching accounts:', error);
      return res.status(500).json({ message: 'Server error while fetching accounts' });
  }
};

export const getGuidanceByUserId = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;

  try {
      const guidance = await UserGuidance.find({ userId }, 'email userId role'); // Fetch only email and userId fields
      
      if (!guidance) {
          return res.status(404).json({ message: 'Guidance not found' });
      }

      return res.status(200).json(guidance);  
  } catch (error) {
      console.error('Error fetching guidance:', error);
      return res.status(500).json({ message: 'Server error while fetching guidance' });   
  }
}

export const deleteGuidanceByUserId = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;

  try {
      const guidance = await UserGuidance.findOneAndDelete({ userId }); // Fetch only email and userId fields
      
      if (!guidance) {
          return res.status(404).json({ message: 'Guidance not found' });
      }

      return res.status(200).json(guidance);  
  } catch (error) {
      console.error('Error fetching guidance:', error);
      return res.status(500).json({ message: 'Server error while fetching guidance' });   
  }
}

export const updateGuidanceByUserId = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;
  const { email, fullName, role } = req.body;

  try {
    // Check if the email already exists for another user
    if (email) {
      const existingEmail = await UserGuidance.findOne({ email, userId: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({ error: 'email_exists' });
      }
    }

    // Update the user fields
    const updatedGuidance = await UserGuidance.findOneAndUpdate(
      { userId },
      { $set: { email, fullName, role } },
      { new: true, runValidators: true } // Return the updated document and ensure validation
    );

    if (!updatedGuidance) {
      return res.status(404).json({ message: 'Guidance not found' });
    }

    return res.status(200).json({ message: 'Guidance updated successfully', updatedGuidance });
  } catch (error) {
    console.error('Error updating guidance:', error);
    return res.status(500).json({ message: 'Server error while updating guidance' });
  }
};
