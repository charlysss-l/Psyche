import express, { Request, Response } from 'express';
import { getAllContentByTestType, getContentByKey, createOrUpdateContentByTestType, deleteContent } from '../controllers/textDisplayController';

const router = express.Router();

// Routes
// Fetch content based on test type (PF or IQ)
router.get('/contents/:testType', async (req: Request, res: Response) => {
    try {
      await getAllContentByTestType(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error getting content', error });
    }
  });
  
  // Create or update content based on test type (PF or IQ)
  router.post('/contents/:testType', async (req: Request, res: Response) => {
    try {
      await createOrUpdateContentByTestType(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error updating content', error });
    }
  });
  router.get('/contents/:key', async (req: Request, res: Response) => {
    try {
      await getContentByKey(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error getting test', error });
    }
  });
  router.delete('/contents/:key', async (req: Request, res: Response) => {
    try {
      await deleteContent(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Error getting test', error });
    }
  });

export default router;
