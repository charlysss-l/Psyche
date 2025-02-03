import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './IntroCF.module.scss'; // Import SCSS file for styling
import backendUrl from '../../../../config';

interface UserCFTest {
  testDate: Date;
}

const IntroCF: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [introTitle, setIntroTitle] = useState<string>(''); // State for intro title
  const [termsTitle, setTermsTitle] = useState<string>(''); // State for terms and conditions title
  const [introText, setIntroText] = useState<string>(''); // State for intro text    
  const [termsText, setTermsText] = useState<string>(''); // State for terms and conditions text
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [userID, setUserID] = useState<string | null>(null);
  const [hasTakenTestToday, setHasTakenTestToday] = useState<boolean>(false); // New state to track if test has been taken today

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch content from the database
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${backendUrl}/api/textDisplay/contents/IQ`)
      .then((response) => {
        const introContent = response.data.find((content: any) => content.key === 'introductionIQ');
        const termsContent = response.data.find((content: any) => content.key === 'termsIQ');

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

  // Fetch userID from localStorage and set it in state
  useEffect(() => {
    const storedUserID = localStorage.getItem('userId');
    if (storedUserID) {
      setUserID(storedUserID);
    } else {
      setError('User ID not found. Please log in again.');
    }
  }, []);

  const fetchData = async () => {
    if (!userID) return; // Don't fetch if userID is not available

    try {
      const response = await fetch(`${backendUrl}/api/usercf/${userID}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();

      // Check if user has already taken the test today
      const today = new Date().setHours(0, 0, 0, 0); // Set time to 00:00:00 for comparison
      const takenToday = data.data.some((result: UserCFTest) => {
        const testDate = new Date(result.testDate).setHours(0, 0, 0, 0); // Ignore time part
        return testDate === today;
      });

      setHasTakenTestToday(takenToday); // Update state based on comparison

      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchData();
    }
  }, [userID]); // Trigger fetchData when userID changes

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
  };

  const handleStartClick = () => {
    if (isChecked && !hasTakenTestToday) {
      navigate('/cftestuserform'); // Navigate to the desired route
    } else if (hasTakenTestToday) {
      alert('You have already taken the test today. Please try again tomorrow.');
    } else {
      alert('Please check the Terms and Conditions in order to proceed!');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

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
      {/* Checkbox for Terms and Conditions */}
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="agreeCheckbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
        />
        <label htmlFor="agreeCheckbox">
          I agree to the terms and conditions
        </label>
      </div>

      {/* Test Start Button */}
      <div className={styles.TestPF}>
        <button onClick={handleStartClick} className={styles.pfButton} disabled={hasTakenTestToday}>
          {hasTakenTestToday ? 'You have already taken the test today. Try again tomorrow.' : 'Start Test'}
        </button>
      </div>
    </div>
  );
};

export default IntroCF;
