import { Router, Request, Response } from 'express';
import { signupStudent, loginStudent, updateStudentProfile, getStudentProfile } from '../authControllers/authStudentsController';

const router = Router();

// Student Signup Route
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    try {
        await signupStudent(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Student Login Route
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        await loginStudent(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Student Profile
router.put('/update', async (req: Request, res: Response) => {
    try {
        await updateStudentProfile(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Student Profile
router.get('/profile', async (req: Request, res: Response) => {
    try {
        await getStudentProfile(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
