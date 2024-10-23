import { Request, Response } from 'express';
import User16PFTestSchema from '../models/User16PFTestSchema'

export const createUser16PFTest = async (req: Request, res: Response) =>{
    try{
        const newTest = new User16PFTestSchema(req.body);
        await newTest.save();
        res.status(201).json({
            message: 'Test created successfully',
            data: newTest
        });
    } catch (error: unknown) {
        if (error instanceof Error){
            res.status(500).json({
                message: 'Error creating test', 
                error: error.message
            });
        } else {
            res.status(500).json({
                message:'Error creating test',
                error: 'An unknown error occurred'
            });
        }
    }
};