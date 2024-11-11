import { Router, Request, Response } from 'express';
import { getAllUsers, editUser, deleteUser } from '../authControllers/userController';

const router = Router();

// GET route to fetch all users
router.get('/users', async (req: Request, res: Response): Promise<void> => {
    try {
        await getAllUsers(req, res); // Call the getAllUsers controller function
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT route to edit a user
router.put('/users/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        await editUser(req, res); // Call the editUser controller function
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

// DELETE route to delete a user
router.delete('/users/:userId', async (req: Request, res: Response): Promise<void> => {
    try {
        await deleteUser(req, res); // Call the deleteUser controller function
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

export default router;
