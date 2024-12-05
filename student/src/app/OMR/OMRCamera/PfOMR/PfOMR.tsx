import React, { useState, useRef, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import styles from './PfOMR.module.scss'; // Import SCSS styles
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';







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

const PfOMR: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadURL, setUploadURL] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [omrScore, setOmrScore] = useState<number | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  // Loading state for spinner



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

  

  const validateTextInImage = async (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          let angle = 0;
          const maxRotation = 360;  // Max rotation in degrees
          const rotationStep = 5;   // Rotation step in degrees (you can adjust for faster/slower rotation)
          const maxAttempts = maxRotation / rotationStep;
  
          // Create a canvas to rotate and process the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject('Canvas context not available');
            return;
          }
  
          // Set canvas size to image size
          canvas.width = img.width;
          canvas.height = img.height;

          // Function to render the rotated image
        const renderImage = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((angle * Math.PI) / 180); // Convert angle to radians
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.restore();

          // Update image preview state to show rotated image
          setImagePreview(canvas.toDataURL()); // Display the rotated image in your component
        };
  
          while (angle < maxRotation) {
            
            // Perform OCR using Tesseract.js
            try {
              renderImage(); // Render the rotated image at the current angle

              const { data: { text } } = await Tesseract.recognize(canvas.toDataURL(), 'eng');
              console.log(`OCR Text at ${angle} degrees:`, text);
  
              // Check if the text includes the word "PF"
              if (text.toLowerCase().includes('pf')) {
                resolve(true); // Text found, stop and resolve
                return;
              }
            } catch (err) {
              reject(err);
              return;
            }
  
            // Increment the angle by the rotation step
            angle += rotationStep;
  
            // If we have checked all rotations and didn't find the text, reject
            if (angle >= maxRotation) {
              resolve(false);
            }
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };
  
  
 

  const validateImageOrientation = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => {
          const isPortrait = img.width < img.height; // Check if image is portrait
          resolve(isPortrait);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    });
  };

  
  
  
  
  
  const validateBackgroundColor = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(false);
            return;
          }
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imgData.data;
          let totalLuminance = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
            totalLuminance += luminance;
          }
          const avgLuminance = totalLuminance / (pixels.length / 4);
          resolve(avgLuminance > 200); // Higher value ensures the background is light
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);  // Show loading spinner when upload starts


    try {
      const fileName = `uploads/OMR/${uuidv4()}_${selectedFile.name}`;
      const storageRef = ref(storage, fileName);

      // Check if the file is a valid image format
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        setLoading(false);  // Hide loading spinner on failure

        return;

      }

     // Validate if the image contains "Name"
    const isValidText = await validateTextInImage(selectedFile);
    if (!isValidText) {
      alert('Invalid image: The word "PF" is not found in the image.');
      setLoading(false);
      return;
    }

     


      // Validate image orientation (portrait)
      const isPortrait = await validateImageOrientation(selectedFile);
      if (!isPortrait) {
        alert('Please upload a portrait-oriented PF answer sheet.');
        setLoading(false);  // Hide loading spinner on failure

        return;
      }

    

    // Validate background color
    const isValidBackground = await validateBackgroundColor(selectedFile);
    if (!isValidBackground) {
      alert('Invalid image: Background is not predominantly white.');
      setLoading(false);  // Hide loading spinner on failure

      return;
    }

      // Upload the file to Firebase
      await uploadBytes(storageRef, selectedFile);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      setUploadURL(downloadURL); // This URL will be used by the Python backend

      console.log("File uploaded successfully:", downloadURL);
      setImagePreview(downloadURL); // Display the uploaded image here
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOMRProcessing = async () => {
    if (!uploadURL) return;

    setLoading(true);  // Hide loading spinner on failure

  
    try {
      const response = await fetch('http://127.0.0.1:5001/process_omr_PF', {
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
      console.log('OMR response:', data); // Log the response to check its structure
      setOmrScore(data.score); // Assuming data.score is a number
      alert('OMR processed successfully!');
    } catch (error) {
      console.error("Error processing OMR:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSaveScore = () => {
    if (omrScore !== null) {
      localStorage.setItem('omrScore', JSON.stringify(omrScore));
      alert('Score saved successfully!');
      navigate('/pfomrresult');
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

    <div className={styles.omrCameraContainer}>
      <h2>Personality Test Upload</h2>
      <div className={styles.fileInputWrapper}>
        <label htmlFor="fileInput" className={styles.uploadLabel}>Choose Image</label>
        <input id="fileInput" type="file" onChange={handleFileChange} />
      </div>

      {/* Display image preview if available */}
      {imagePreview && (
        <div className={styles.imagePreview}>
          {/* <img src={imagePreview} alt="Image Preview" className={styles.previewImage} /> */}
          <img src={imagePreview} alt="Rotating Image" />

        </div>
      )}

      {/* Show loading spinner while uploading or processing */}
      {loading && (
  <div className={styles.spinnerContainer}>
    <div className={styles.spinner}>
      <div className={styles.spinnerCircle}></div>
    </div>
    <p className={styles.loadingText}>Please wait a moment...</p>
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
        Start Processing Your Test Paper
      </button>

      {omrScore && (
  <div>
    
    <button onClick={handleSaveScore} className={styles.saveScoreButton}>
      Save and Interpret Your Score
    </button>
  </div>
)}



      <canvas ref={canvasRef} style={{ display: 'none' }} />

      </div>

    {/* Instruction Container */}
    <div className={styles.instructionContainer}>
    <h1>Instructions</h1>
    <p>1. Choose an image of your OMR sheet using the "Choose Image" button.</p>
    <p>2. Alternatively, capture an image using your camera.</p>
    <p>3. Upload the image to the system by clicking the "Upload Image" button.</p>
    <p>4. Process the uploaded image to calculate your OMR score.</p>
    <p>5. Save and interpret your score to view detailed results.</p>
  </div>
</div>
  );
};

export default PfOMR;
