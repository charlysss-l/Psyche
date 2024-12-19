import { Request, Response } from 'express';
import { Content } from '../models/textDisplaySchema';



// Define custom sorting order for the content
const customOrder = ['introduction', 'terms', 'data_privacy', 'outro'];

export const getAllContentByTestType = async (req: Request, res: Response) => {
  const { testType } = req.params; // 'PF' or 'IQ'
  try {
    const contents = await Content.find({ key: new RegExp(testType) });

    // Sort content by predefined order
    contents.sort((a, b) => {
      const sectionA = a.key.split(testType)[0]; // Extract section (e.g., 'introduction' from 'introductionIQ')
      const sectionB = b.key.split(testType)[0]; // Extract section (e.g., 'terms' from 'termsIQ')

      const indexA = customOrder.indexOf(sectionA); // Get index from customOrder array
      const indexB = customOrder.indexOf(sectionB); // Get index from customOrder array

      return indexA - indexB; // Compare based on order in customOrder
    });

    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

  
  
  
  // Create or update content, filtering by test type
  export const createOrUpdateContentByTestType = async (req: Request, res: Response) => {
    const { testType } = req.params; // 'PF' or 'IQ'
    try {
      const contents = req.body; // Expecting an array of content objects
  
      if (!Array.isArray(contents)) {
        return res.status(400).json({ message: "Invalid data format. Expected an array." });
      }
  
      const results = await Promise.all(
        contents.map(async (content) => {
          if (!content.key || !content.title || !content.text) {
            throw new Error("Key, title, and text are required for each content.");
          }
  
          if (!content.key.includes(testType)) {
            throw new Error(`Content key must include ${testType}`);
          }
  
          const updatedContent = await Content.findOneAndUpdate(
            { key: content.key },
            { title: content.title, text: content.text },
            { upsert: true, new: true }
          );
          return updatedContent;
        })
      );
  
      res.status(201).json(results);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };

  // Get content by key
  export const getContentByKey = async (req: Request, res: Response) => {
    const { key } = req.params;
    try {
      const content = await Content.findOne({ key });
      if (!content) return res.status(404).json({ error: 'Content not found' });
      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  }

  // Delete content
  export const deleteContent = async (req: Request, res: Response) => {
      
    const { key } = req.params;
    try {
      const deletedContent = await Content.findOneAndDelete({ key });
      if (!deletedContent) return res.status(404).json({ error: 'Content not found' });
      res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete content' });
    }
  }

