import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './IntroPF.module.scss'; // Import SCSS file for styling

const IntroPF: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [introTitle, setIntroTitle] = useState<string>(''); // State for intro title
  const [termsTitle, setTermsTitle] = useState<string>(''); // State for terms and conditions title
  const [introText, setIntroText] = useState<string>(''); // State for intro text
  const [termsText, setTermsText] = useState<string>(''); // State for terms and conditions text
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch content from the database
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/api/textDisplay/contents/PF')
      .then((response) => {
        const introContent = response.data.find((content: any) => content.key === 'introductionPF');
        const termsContent = response.data.find((content: any) => content.key === 'termsPF');

        if (introContent) setIntroText(introContent.text);
        if (termsContent) setTermsText(termsContent.text);
        if (introContent) setIntroTitle(introContent.title);
        if (termsContent) setTermsTitle(termsContent.title);
      })
      .catch((err) => {
        setError('Failed to fetch content. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
  };

  const handleStartClick = () => {
    if (isChecked) {
      navigate('/pftest'); // Navigate to the desired route
    } else {
      alert('Please check the Terms and Conditions in order to proceed!');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pfintro}>{introTitle}</h1>
      <p className={styles.pfintroinfo}>
  {introText.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line.split(/(https?:\/\/[^\s]+)/).map((part, idx) => (
          // Check if the part is a URL
          /https?:\/\/[^\s]+/.test(part) ? (
            <a
              key={idx}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link} // Optional: Style the link
            >
              {part}
            </a>
          ) : (
            part
          )
        ))}
        <br />
    </React.Fragment>
  ))}
</p>

<h1 className={styles.termsandconditionpf}>{termsTitle}</h1>
<p className={styles.pftermsinfo}>
  {termsText.split('\n').map((line, index) => {
    // Check if the line starts with a numbered section
    const match = line.match(/^(\d+\.\s.*?)(\s-\s)(.*)$/);

    if (match) {
      // Split the line into heading and body
      const [, heading, separator, body] = match;
      return (
        <React.Fragment key={index}>
          <strong>{heading}</strong>
          {separator}
          {body}
          <br />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    );
  })}
</p>


      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="agreeCheckbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
        />
        <label htmlFor="agreeCheckbox">I agree to the terms and conditions</label>
      </div>

      <div className={styles.TestPF}>
        <button onClick={handleStartClick} className={styles.pfButton}>
          Start Test
        </button>
      </div>
    </div>
  );
};

export default IntroPF;
