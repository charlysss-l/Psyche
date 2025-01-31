import express, { Request, Response } from 'express';
import multer from 'multer';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';

// Firebase configuration settings, used to initialize Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyBWj1L7qdsRH4sFpE7q0CaoyL55KWMGRZI",
  authDomain: "iqtestupload.firebaseapp.com",
  projectId: "iqtestupload",
  storageBucket: "iqtestupload.appspot.com",
  messagingSenderId: "1045353089399",
  appId: "1:1045353089399:web:e921f8910028d4b91db972",
  measurementId: "G-Y50EWBBRFQ"
};

// Initialize Firebase app with provided configuration
const firebaseApp = initializeApp(firebaseConfig);
// Set up Firebase storage instance
const storage = getStorage(firebaseApp);

// Configure multer to handle file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router(); // Create Express router for handling routes

// Define upload route to handle multiple image file uploads
router.post('/upload', upload.array('images', 10), async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the files from the request
    const files = req.files as Express.Multer.File[];

    // Check if files were uploaded
    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    const uploadedFileURLs = []; // Array to store URLs of successfully uploaded files

    // Loop through each uploaded file
    for (const file of files) {
      // Generate a unique filename with UUID to avoid naming conflicts
      const fileName = `uploads/Test 1/${uuidv4()}_${file.originalname}`;
      // Create a reference in Firebase storage for this file
      const storageRef = ref(storage, fileName);

      // Upload file to Firebase storage
      await uploadBytes(storageRef, file.buffer);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      uploadedFileURLs.push(downloadURL); // Add URL to array
    }

    // Send success response with URLs of uploaded files
    res.status(200).json({ message: "Images uploaded successfully", urls: uploadedFileURLs });
  } catch (error) {
    // Log and return error if upload fails
    console.error("Error uploading files:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

export default router;
