import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./editContent.module.scss";
import backendUrl from "../../config";
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';

interface Content {
  key: string;
  title: string;
  text: string;
  _id?: string;
}

interface Image {
  url: string;
  name: string;
}

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

const ContentEditor: React.FC = () => {
  const [contentsPF, setContentsPF] = useState<Content[]>([]);
  const [contentsIQ, setContentsIQ] = useState<Content[]>([]);
  const [contentsCF, setContentsCF] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<string>("PF"); // 'PF' or 'IQ'
  const [editorVisible, setEditorVisible] = useState<boolean>(false); // Track editor visibility
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    if (!editorVisible) return;

    setLoading(true);
    axios
      .get(`${backendUrl}/api/textDisplay/contents/${testType}`)
      .then((response) => {
        const sortedContents = response.data.sort((a: Content, b: Content) => {
          const customOrder = ["introduction", "terms", "data_privacy", "outro"];
          const sectionA = a.key.split(testType)[0];
          const sectionB = b.key.split(testType)[0];
          const indexA = customOrder.indexOf(sectionA);
          const indexB = customOrder.indexOf(sectionB);
          return indexA - indexB;
        });

        if (testType === "PF") {
          setContentsPF(sortedContents);
        } else if (testType === "IQ") {
          setContentsIQ(sortedContents);
        } else if (testType === "CF") {
          setContentsCF(sortedContents);
        }
      })
      .catch(() => {
        setError("Error fetching content data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [testType, editorVisible]);

  useEffect(() => {
    // Fetch existing images from Firebase when editor is visible
    if (testType === "CF" && editorVisible) {
      fetchImagesFromFirebase();
    }
  }, [testType, editorVisible]);

  const fetchImagesFromFirebase = async () => {
    const imagesRef = ref(storage, "cf-test-examples/");
    try {
      const imageList = await listAll(imagesRef);
      const fetchedImages: Image[] = await Promise.all(
        imageList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { url, name: item.name };
        })
      );
      setImages(fetchedImages);
    } catch (err) {
      console.error("Error fetching images: ", err);
      setError("Error fetching images from Firebase");
    }
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedContents = testType === "PF" ? [...contentsPF] : testType === "IQ" ? [...contentsIQ] : [...contentsCF];
    updatedContents[index] = { ...updatedContents[index], [field]: value };
    testType === "PF" ? setContentsPF(updatedContents) : testType === "IQ" ? setContentsIQ(updatedContents) : setContentsCF(updatedContents);
  };

  const handleSubmit = (index: number) => {
    const updatedContent = testType === "PF" ? contentsPF[index] : testType === "IQ" ? contentsIQ[index] : contentsCF[index];

    axios
      .post(`${backendUrl}/api/textDisplay/contents/${testType}`, [updatedContent])
      .then(() => alert("Content updated successfully"))
      .catch(() => alert("Error updating content"));
  };

  const uploadImageToFirebase = async (file: File, path: string) => {
    const imageRef = ref(storage, path);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const confirmUpload = window.confirm("Are you sure you want to upload this image?");
    if (!confirmUpload) return;

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
  
      // Generate a unique name for the image (timestamp + original filename)
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${file.name}`;
      const path = `cf-test-examples/${uniqueFileName}`;
  
      // If there's an old image, delete it
      if (index !== undefined && images[index]?.name) {
        const oldImageRef = ref(storage, `cf-test-examples/${images[index].name}`);
        try {
          await deleteObject(oldImageRef); // Delete the old image
          console.log("Old image deleted successfully");
        } catch (error) {
          console.error("Error deleting old image: ", error);
        }
      }
  
      // Upload the new image with the unique name
      const url = await uploadImageToFirebase(file, path);
      alert ("Image uploaded successfully!");
      if (index !== undefined) {
        // Update the specific image with the new URL and name
        const updatedImages = [...images];
        updatedImages[index] = { url, name: uniqueFileName };
        setImages(updatedImages);
      } else {
        // Add new image
        setImages([...images, { url, name: uniqueFileName }].slice(0, 4)); // Ensure only 4 images are stored
      }
    }
  };
  

  if (!editorVisible) {
    return (
      <div className={styles.container}>
        <h1 className={styles.firstheader}>Select Test Type to Edit Content</h1>
        <div className={styles.testTypeSelector}>
          <button
            onClick={() => {
              setTestType("PF");
              setEditorVisible(true);
            }}
            className={styles.button}
          >
            Edit 16PF Content
          </button>
          <button
            onClick={() => {
              setTestType("IQ");
              setEditorVisible(true);
            }}
            className={styles.button}
          >
            Edit IQ Content
          </button>
          <button
            onClick={() => {
              setTestType("CF");
              setEditorVisible(true);
            }}
            className={styles.button}
          >
            Edit CF Content
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className={styles.loading}>Loading content...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.container}>
     

      <div className={styles.contentEditor}>
         <button
        onClick={() => setEditorVisible(false)}
        className={`${styles.backbutton} ${styles.backButton}`}
      >
        Back to Test Type Selection
      </button>
        <h1 className={styles.header}>Edit Content for {testType}</h1>
        {(testType === "PF" ? contentsPF : testType === "IQ" ? contentsIQ : contentsCF).map((content, index) => (
          <div key={content.key} className={styles.contentItem}>
            <h2 className={styles.contentTitle}>{content.title}</h2>
            <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor={`title-${content.key}`} className={styles.label}>
                  Title:
                </label>
                <input
                  id={`title-${content.key}`}
                  type="text"
                  value={content.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={`text-${content.key}`} className={styles.label}>
                  Text:
                </label>
                <textarea
                  id={`text-${content.key}`}
                  value={content.text}
                  onChange={(e) => handleChange(index, "text", e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.saveGroup}>
                <button
                  type="button"
                  onClick={() => handleSubmit(index)}
                  className={styles.savebutton}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ))}

        {testType === "CF" && (
          <div className={styles.imageUploadSection}>
            <h2 className={styles.contentTitle}>Culture Fair Test Examples</h2>
            <div className={styles.imageGrid}>
              {images.map((image, index) => (
                <div key={index} className={styles.imageItem}>
                  <img src={image.url} alt={image.name} className={styles.image} />
                  <br/>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    className={styles.fileInput}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;