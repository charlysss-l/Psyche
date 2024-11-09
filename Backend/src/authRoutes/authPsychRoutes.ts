import { Router, Request, Response } from 'express';
import { login } from '../authControllers/authPsychController';

const router = Router();

// POST route for login
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    await login(req, res); // Call the login controller function
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
