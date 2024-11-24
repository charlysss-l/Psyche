import React, { useState, useRef, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import styles from './IqOMR.module.scss'; // Import SCSS styles
import { useNavigate } from 'react-router-dom';


// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWj1L7qdsRH4sFpE7q0CaoyL55KWMGRZI",
  authDomain: "iqtestupload.firebaseapp.com",
  projectId: "iqtestupload",
  storageBucket: "iqtestupload.appspot.com",
  messagingSenderId: "1045353089399",
  appId: "1:1045353089399:web:e921f8910028d4b91db972",
  measurementId: "G-Y50EWBBRFQ"
};

initializeApp(firebaseConfig);
const storage = getStorage();

const IqOMR: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadURL, setUploadURL] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [omrScore, setOmrScore] = useState<number | null>(null);
  const navigate = useNavigate();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);

    // If a file is selected, create a preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const fileName = `uploads/OMR/${uuidv4()}_${selectedFile.name}`;
      const storageRef = ref(storage, fileName);

      // Upload the file to Firebase
      await uploadBytes(storageRef, selectedFile);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      setUploadURL(downloadURL); // This URL will be used by the Python backend

      console.log("File uploaded successfully:", downloadURL);
      setImagePreview(downloadURL); // Display the uploaded image here
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleOMRProcessing = async () => {
    if (!uploadURL) return;
  
    try {
      const response = await fetch('http://127.0.0.1:5000/process_omr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: uploadURL,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setOmrScore(data.score); // Assuming data.score is a number
    } catch (error) {
      console.error("Error processing OMR:", error);
    }
  };
  

  const handleSaveScore = () => {
    if (omrScore !== null) {
      localStorage.setItem('omrScore', omrScore.toString());
      alert('Score saved successfully!');
      navigate('/iqomrresult');
    }
  };
  

  useEffect(() => {
    // Start the camera when the component is mounted
    if (isCameraActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing camera: ", error);
        });
    }

    return () => {
      // Stop the camera when the component is unmounted
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream?.getTracks();
        tracks?.forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageUrl = canvasRef.current.toDataURL('image/png');
        setImagePreview(imageUrl);
        setSelectedFile(dataURLtoFile(imageUrl, 'captured-image.png'));
        setIsCameraActive(false);
      }
    }
  };

  const handleCancelCamera = () => {
    setIsCameraActive(false);
  };

  // Convert base64 data URL to a File object
  const dataURLtoFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className={styles.mainContainer}>
      {/* OMR Container */}
      <div className={styles.omrCameraContainer}>
        <h2>IQ Test Upload</h2>
        <div className={styles.fileInputWrapper}>
          <label htmlFor="fileInput" className={styles.uploadLabel}>Choose Image</label>
          <input id="fileInput" type="file" onChange={handleFileChange} />
        </div>
  
        {/* Display image preview if available */}
        {imagePreview && (
          <div className={styles.imagePreview}>
            <img src={imagePreview} alt="Image Preview" className={styles.previewImage} />
          </div>
        )}
  
        <div className={styles.cameraWrapper}>
          {isCameraActive ? (
            <div>
              <video ref={videoRef} autoPlay playsInline className={styles.video} />
              <div className={styles.cameraControls}>
                <button onClick={handleCapture} className={styles.captureButton}>Capture</button>
                <button onClick={handleCancelCamera} className={styles.cancelButton}>X</button>
              </div>
            </div>
          ) : (
            <div>
              <button onClick={() => setIsCameraActive(true)} className={styles.openCameraButton}>Use Camera</button>
            </div>
          )}
        </div>
  
        <button
          onClick={handleUpload}
          className={styles.uploadButton}
          disabled={!selectedFile}
        >
          Upload Image
        </button>
  
        {uploadURL && (
          <div className={styles.uploadedImage}>
            <p className={styles.uploadedImageText}>Image uploaded successfully:</p>
            <img src={uploadURL} alt="Uploaded Image" className={styles.uploadedImagePreview} />
          </div>
        )}
  
        <button onClick={handleOMRProcessing} className={styles.omrProcessButton} disabled={!uploadURL}>
          Process OMR and Score
        </button>
  
        {omrScore !== null && (
          <div>
            <h3>OMR Score: {omrScore}</h3>
            <button onClick={handleSaveScore} className={styles.saveScoreButton}>
              Save and Interpret Your Score
            </button>
          </div>
        )}
  
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
  
      {/* Instruction Container */}
      <div className={styles.instructionContainer}>
        <h2>Instructions</h2>
        <p>1. Choose an image of your OMR sheet using the "Choose Image" button.</p>
        <p>2. Alternatively, capture an image using your camera.</p>
        <p>3. Upload the image to the system by clicking the "Upload Image" button.</p>
        <p>4. Process the uploaded image to calculate your OMR score.</p>
        <p>5. Save and interpret your score to view detailed results.</p>
      </div>
    </div>
  );
  
};

export default IqOMR;
