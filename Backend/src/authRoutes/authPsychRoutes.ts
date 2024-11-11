import { Router, Request, Response } from 'express';
import { login, updateUser } from '../authControllers/authPsychController';

const router = Router();

// POST route for login
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    await login(req, res); // Call the login controller function
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT route for updating username and password
router.put('/update', async (req: Request, res: Response): Promise<void> => {
  try {
    await updateUser(req, res); // Call the update controller function
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
