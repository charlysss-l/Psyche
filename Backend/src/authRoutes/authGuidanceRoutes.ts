import {Router, Request, Response} from 'express';
import{
    loginGuidance,
    updateGuidanceUser,
    forgotPassword,
    updateUserRole,
    subGuidance,
    getAllGuidance,
    getGuidanceByUserId
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

  router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
    try {
      await forgotPassword(req, res); // Call the login controller function
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.put('/role/update', async (req: Request, res: Response): Promise<void> => {
    try {
      await updateUserRole(req, res); 
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/subGuidance/create', async (req: Request, res: Response): Promise<void> => {
      try {
          await subGuidance(req, res);
      } catch (error) {
          res.status(500).json({ message: 'Internal server error' });
      }
  });

  router.get('/guidance', async (req: Request, res: Response): Promise<void> => {
    try {
        await getAllGuidance(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    } 
});

router.get('/userId/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
      await getGuidanceByUserId(req, res);
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  } 
});

export default router;