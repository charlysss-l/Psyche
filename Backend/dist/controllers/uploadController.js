"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const storage_1 = require("firebase/storage");
const app_1 = require("firebase/app");
const uuid_1 = require("uuid");
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
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
// Set up Firebase storage instance
const storage = (0, storage_1.getStorage)(firebaseApp);
// Configure multer to handle file uploads in memory
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = express_1.default.Router(); // Create Express router for handling routes
// Define upload route to handle multiple image file uploads
router.post('/upload', upload.array('images', 10), async (req, res) => {
    try {
        // Get the files from the request
        const files = req.files;
        // Check if files were uploaded
        if (!files || files.length === 0) {
            res.status(400).json({ error: "No files uploaded" });
            return;
        }
        const uploadedFileURLs = []; // Array to store URLs of successfully uploaded files
        // Loop through each uploaded file
        for (const file of files) {
            // Generate a unique filename with UUID to avoid naming conflicts
            const fileName = `uploads/${(0, uuid_1.v4)()}_${file.originalname}`;
            // Create a reference in Firebase storage for this file
            const storageRef = (0, storage_1.ref)(storage, fileName);
            // Upload file to Firebase storage
            await (0, storage_1.uploadBytes)(storageRef, file.buffer);
            // Get the download URL of the uploaded file
            const downloadURL = await (0, storage_1.getDownloadURL)(storageRef);
            uploadedFileURLs.push(downloadURL); // Add URL to array
        }
        // Send success response with URLs of uploaded files
        res.status(200).json({ message: "Images uploaded successfully", urls: uploadedFileURLs });
    }
    catch (error) {
        // Log and return error if upload fails
        console.error("Error uploading files:", error);
        res.status(500).json({ error: "File upload failed" });
    }
});
exports.default = router;
