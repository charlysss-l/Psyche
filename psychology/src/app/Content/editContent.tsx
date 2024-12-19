import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./editContent.module.scss";

interface Content {
  key: string;
  title: string;
  text: string;
  _id?: string;
}

const ContentEditor: React.FC = () => {
  const [contentsPF, setContentsPF] = useState<Content[]>([]);
  const [contentsIQ, setContentsIQ] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<string>('PF'); // 'PF' or 'IQ'

  // Fetch the content based on test type (PF or IQ)
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/textDisplay/contents/${testType}`)
      .then((response) => {
        const sortedContents = response.data.sort((a: Content, b: Content) => {
          // Define custom order for sorting
          const customOrder = ['introduction', 'terms', 'data_privacy', 'outro'];
  
          const sectionA = a.key.split(testType)[0]; // Extract section (e.g., 'introduction' from 'introductionIQ')
          const sectionB = b.key.split(testType)[0]; // Extract section (e.g., 'terms' from 'termsIQ')
  
          const indexA = customOrder.indexOf(sectionA); // Get index from customOrder array
          const indexB = customOrder.indexOf(sectionB); // Get index from customOrder array
  
          return indexA - indexB; // Compare based on order in customOrder
        });
  
        if (testType === 'PF') {
          setContentsPF(sortedContents);
        } else {
          setContentsIQ(sortedContents);
        }
      })
      .catch((err) => {
        setError("Error fetching content data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [testType]);
  
  
  // Handle form field changes
  const handleChange = (index: number, field: string, value: string) => {
    const updatedContents = testType === 'PF' ? [...contentsPF] : [...contentsIQ];
    updatedContents[index] = {
      ...updatedContents[index],
      [field]: value,
    };
    testType === 'PF' ? setContentsPF(updatedContents) : setContentsIQ(updatedContents);
  };

  // Handle form submission
  const handleSubmit = (index: number) => {
    const updatedContent = testType === 'PF' ? contentsPF[index] : contentsIQ[index];

    axios
      .post(`http://localhost:5000/api/textDisplay/contents/${testType}`, [updatedContent])
      .then((response) => {
        alert("Content updated successfully");
      })
      .catch((err) => {
        alert("Error updating content");
      });
  };

  if (loading) {
    return <p className={styles.loading}>Loading content...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      {/* Switch between PF and IQ content editor */}
      <div className={styles.testTypeSelector}>
        <button onClick={() => setTestType('PF')} className={styles.button}>
          Edit 16PF Content
        </button>
        <button onClick={() => setTestType('IQ')} className={styles.button}>
          Edit IQ Content
        </button>
      </div>

      <div className={styles.contentEditor}>
        <h1 className={styles.header}>Edit Content for {testType}</h1>
        {(testType === 'PF' ? contentsPF : contentsIQ).map((content, index) => (
          <div key={content.key} className={styles.contentItem}>
            <h2 className={styles.contentTitle}>{content.title}</h2>
            <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor={`title-${content.key}`} className={styles.label}>
                  Title
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
                  Text
                </label>
                <textarea
                  id={`text-${content.key}`}
                  value={content.text}
                  onChange={(e) => handleChange(index, "text", e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <button
                  type="button"
                  onClick={() => handleSubmit(index)}
                  className={styles.button}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentEditor;
