import {Router, Request, Response} from 'express';
import{
    loginGuidance,
    updateGuidanceUser
} from '../authControllers/authGuidanceController';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        await loginGuidance(req, res); 
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT route for updating username and password
router.put('/update', async (req: Request, res: Response): Promise<void> => {
    try {
      await updateGuidanceUser(req, res); 
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;