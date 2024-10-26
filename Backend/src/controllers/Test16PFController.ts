import { Request, Response } from 'express';
import Test16PF from '../models/Test16PFModel';


export const create16PFTest = async (req: Request, res: Response) => {
    try {
        const test = new Test16PF(req.body);
        await test.save();
        res.status(201).json(test);
    } catch (error) {
        res.status(400).json({ message: 'Error creating test', error: (error as Error).message });
    }
};


export const getAll16PFTests = async (req: Request, res: Response) => {
    try {
        const tests = await Test16PF.find();
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tests', error: (error as Error).message });
    }
};


export const get16PFTestByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const test = await Test16PF.findById(id);
        if (!test) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching test', error: (error as Error).message });
    }
};


export const update16PFTest = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedTest = await Test16PF.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(400).json({ message: 'Error updating test', error: (error as Error).message });
    }
};


export const delete16PFTest = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedTest = await Test16PF.findByIdAndDelete(id);
        if (!deletedTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ message: '16PF Test deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting test', error: (error as Error).message });
    }
};
