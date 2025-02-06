import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./editContent.module.scss";
import backendUrl from "../../config";
import test from "node:test";

interface Content {
  key: string;
  title: string;
  text: string;
  _id?: string;
}

const ContentEditor: React.FC = () => {
  const [contentsPF, setContentsPF] = useState<Content[]>([]);
  const [contentsIQ, setContentsIQ] = useState<Content[]>([]);
  const [contentsCF, setContentsCF] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<string>("PF"); // 'PF' or 'IQ'
  const [editorVisible, setEditorVisible] = useState<boolean>(false); // Track editor visibility

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
      <button
        onClick={() => setEditorVisible(false)}
        className={`${styles.backbutton} ${styles.backButton}`}
      >
        Back to Test Type Selection
      </button>

      <div className={styles.contentEditor}>
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
      </div>
    </div>
  );
};

export default ContentEditor;
