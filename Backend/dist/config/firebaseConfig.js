"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageDb = void 0;
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
// Firebase configuration with project details
const firebaseConfig = {
    apiKey: "AIzaSyBWj1L7qdsRH4sFpE7q0CaoyL55KWMGRZI",
    authDomain: "iqtestupload.firebaseapp.com",
    projectId: "iqtestupload",
    storageBucket: "iqtestupload.appspot.com",
    messagingSenderId: "1045353089399",
    appId: "1:1045353089399:web:e921f8910028d4b91db972",
    measurementId: "G-Y50EWBBRFQ"
};
// Initialize Firebase app
const app = (0, app_1.initializeApp)(firebaseConfig);
// Initialize Firebase storage and export for use
exports.imageDb = (0, storage_1.getStorage)(app);
