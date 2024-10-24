import { Request, Response } from 'express';
import User16PFTestSchema from '../models/User16PFTestSchema';

export const createUser16PFTest = async (req: Request, res: Response) => {
    try {
        const newUser16PFTest = new User16PFTestSchema(req.body);
        await newUser16PFTest.save();
        res.status(201).json({ message: 'Test created successfully', data: newUser16PFTest });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error creating test', error: errorMessage });
    }
};

export const getUser16PFTests = async (req: Request, res: Response) => {
    try {
        const allUser16PFtests = await User16PFTestSchema.find();
        res.status(200).json({ data: allUser16PFtests });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching tests', error: errorMessage });
    }
};

export const getUser16PFTestById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const PFuserTest = await User16PFTestSchema.findById(id);
        if (!PFuserTest) {
            res.status(404).json({ message: 'Test not found' });
            return; 
        }
        res.status(200).json({ data: PFuserTest });
    } catch (error: unknown) {
        if (error instanceof Error){
            res.status(500).json({message:'Error fetching user test', error: error.message})
        } else{
            res.status(500).json({message:'Error fetching user test', error: 'An unknown error occurred'})
        }
    }
};

export const updateUser16PFTest = async (req: Request, res: Response) =>{
    const {id} = req.params;
    try{
        const updatedUserPFTest = await User16PFTestSchema.findByIdAndUpdate(id, req.body, {new:true});
        if(!updatedUserPFTest){
            res.status(404).json({message: 'Test not found'});
            return;
        }
        res.status(200).json({message: 'Test updated successfully', data: updatedUserPFTest})
    } catch (error: unknown){
        if (error instanceof Error){
            res.status(500).json({message:'Error updating user test', error: error.message})
        } else{
            res.status(500).json({message:'Error updating user test', error: 'An unknown error occurred'})
        }
    }
}


export const deleteUser16PFTest = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedUserPFTest = await User16PFTestSchema.findByIdAndDelete(id);
        if (!deletedUserPFTest) {
         res.status(404).json({ message: 'Test not found' });
         return;
        }
        res.status(200).json({ message: 'User 16PF Test deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user test', error: (error as Error).message });
    }
};