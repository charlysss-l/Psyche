import { Request, Response } from 'express';
import UserGuidance from '../authModels/authGuidanceSchema';  // Guidance model
import Student from '../authModels/authStudentsSchema';  // Student model
import PsychStudent from '../authModels/authPsychSchema';  // Psychology model (fix the name of the model file)

// Fetch all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch all guidance users
        const guidanceUsers = await UserGuidance.find().select('email');  // Select only email
        // Fetch all psychology users
        const psychUsers = await PsychStudent.find().select('email');  // Select only email
        // Fetch all students
        const studentUsers = await Student.find().select('userId email studentNumber');  // Select only email

        // Combine the data into one array
        const allUsers = [
            ...guidanceUsers.map(user => ({ userId: user._id, email: user.email, role: 'Guidance' })),
            ...psychUsers.map(user => ({ userId: user._id, email: user.email, role: 'Psychology' })),
            ...studentUsers.map(user => ({ userId: user.userId, studentNumber: user.studentNumber, email: user.email, role: 'Student' }))
        ];

        // Return the combined user list as JSON
        res.status(200).json(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

// Edit a user (Update their email or role)
export const editUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { email, studentNumber, role } = req.body;  // Include studentNumber in the request body

    try {
        let user;
        if (role === 'Guidance') {
            user = await UserGuidance.findByIdAndUpdate(userId, { email }, { new: true });
        } else if (role === 'Psychology') {
            user = await PsychStudent.findByIdAndUpdate(userId, { email }, { new: true });
        } else if (role === 'Student') {
            user = await Student.findOneAndUpdate({ userId }, { email, studentNumber }, { new: true });  // Update studentNumber
        }

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error editing user:', error);
        res.status(500).json({ message: 'Server error while editing user' });
    }
};


// Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { role } = req.body;

    try {
        let user;
        if (role === 'Guidance') {
            user = await UserGuidance.findByIdAndDelete(userId);
        } else if (role === 'Psychology') {
            user = await PsychStudent.findByIdAndDelete(userId);
        } else if (role === 'Student') {
            user = await Student.findOneAndDelete({ userId });
        }

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
};
