import express, { Request, Response } from 'express';
import multer from 'multer';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBWj1L7qdsRH4sFpE7q0CaoyL55KWMGRZI",
  authDomain: "iqtestupload.firebaseapp.com",
  projectId: "iqtestupload",
  storageBucket: "iqtestupload.appspot.com",
  messagingSenderId: "1045353089399",
  appId: "1:1045353089399:web:e921f8910028d4b91db972",
  measurementId: "G-Y50EWBBRFQ"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Set up multer storage
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Upload route for multiple files
router.post('/upload', upload.array('images', 10), async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    const uploadedFileURLs = [];

    // Upload each file
    for (const file of files) {
      const fileName = `uploads/${uuidv4()}_${file.originalname}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file.buffer);

      const downloadURL = await getDownloadURL(storageRef);
      uploadedFileURLs.push(downloadURL);
    }

    res.status(200).json({ message: "Images uploaded successfully", urls: uploadedFileURLs });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

export default router;
