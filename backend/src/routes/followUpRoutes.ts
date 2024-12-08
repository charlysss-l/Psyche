import express, { Request, Response } from 'express';
import {
  createFollowUpSchedule,
  getAllFollowUpSchedules,
  updateFollowUpScheduleById,
  deleteFollowUpScheduleById,
  getFollowUpSchedulesByUserId,
} from "../controllers/followUpController";

const router = express.Router();

router.post("/", createFollowUpSchedule);

router.get("/", getAllFollowUpSchedules);

router.get("/user/:userId", getFollowUpSchedulesByUserId);

router.put('/:id', async (req: Request, res: Response) => {
    try {
      await updateFollowUpScheduleById(req, res);  // Use the testID for deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
  });

router.delete('/:id', async (req: Request, res: Response) => {
    try {
      await deleteFollowUpScheduleById(req, res);  // Use the testID for deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting consultation by testID', error });
    }
  });
export default router;
