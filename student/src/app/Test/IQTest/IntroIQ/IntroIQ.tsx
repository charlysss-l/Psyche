import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './IntroIQ.module.scss'; // Import SCSS file for styling

const IntroPF: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false); // State for checkbox

  const navigate = useNavigate(); // Initialize useNavigate

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
  };

  const handleStartClick = () => {
    if (isChecked) {
      navigate('/iqtestuserform'); // Navigate to the desired route
    } else {
        alert('Please check the Terms and Conditions in able to proceed!')
    }
  };

  return (
    <div className={styles.container}>
      <h1>What is Raven IQ Test?</h1>
      <p>
        lksaldhaslhda
      </p>
      <p>
        lfljhdlshfls
      </p>
      <p>
        knvlksnls
      </p>

      {/* Terms and Conditions Section */}
      <h1 className={styles.termsandconditioniq}>Terms and Conditions</h1>
      <p className={styles.termsinfo}>
        By using this test, you agree to the following terms and conditions. Please read these terms carefully before proceeding with the test. 
        If you do not agree with any of these terms, you should not access or use the test. 
      </p>
      <p className={styles.termsinfo}>
        <strong className={styles.termsnumiq}>1. General Terms </strong>
        The Test is designed for individuals interested in gaining insights into their personality traits. The Test is 
        based on the Sixteen Personality Factor Questionnaire (16PF) developed through years of research and analysis. 
        Your participation in the Test is voluntary and you may choose to discontinue at any time. By participating, 
        you consent to the collection of responses provided during the Test.
      </p>
      <p className={styles.termsinfo}>
        <strong className={styles.termsnumiq}>2. Privacy and Data Collection </strong>
        We respect your privacy and are committed to protecting your personal data. By using the Test, you agree that 
        we may collect, process, and store information you provide during the assessment for the purpose of analyzing 
        your results and improving the service. However, we will never share your data with third parties without your 
        explicit consent, except as required by law or in connection with business operations. We advise that you do 
        not share sensitive personal information such as medical history or other private details that are not relevant 
        to the Test. 
      </p>
      <p className={styles.termsinfo}>
        <strong className={styles.termsnumiq}>3. Test Results </strong>
        The results you receive from the Test are based on the information you provide and the responses you select. 
        While the Test is designed to provide useful insights into your personality, the results should not be regarded 
        as definitive or absolute. Personality traits can evolve over time and the results of the Test reflect your 
        characteristics at the time of taking it. Results are not intended to diagnose or label individuals and should 
        not be used as the sole basis for important life decisions.
      </p>
      <p className={styles.termsinfo}>
        <strong className={styles.termsnumiq}>4. Limitation of Liability </strong>
        The Test and any related content are provided "as is" and we do not make any representations or warranties, 
        express or implied, about the accuracy, reliability, or completeness of the Test or the results provided. 
        In no event will we be liable for any loss, damage, or harm arising from your use of the Test, including, 
        but not limited to, direct, indirect, incidental, or consequential damages. Your use of the Test is at your 
        own risk.
      </p>
      <p className={styles.termsinfo}>
        <strong className={styles.termsnumiq}>5. Changes to Terms </strong>
        We reserve the right to modify or update these Terms at any time without prior notice. Any changes to these 
        Terms will be reflected on this page. It is your responsibility to check this page regularly for updates. Your 
        continued use of the Test after any modifications to the Terms constitutes your acceptance of those changes.
      </p>
      <p className={styles.termsinfo}>
        <strong className={styles.termsnumiq}>6. Governing Law </strong>
        These Terms are governed by and construed in accordance with the laws of the jurisdiction in which we operate. 
        Any disputes arising from the use of the Test will be subject to the exclusive jurisdiction of the courts in 
        that jurisdiction.
      </p>

      <p className={styles.confirm}>
        By proceeding with the test, you acknowledge that you have read, understood, and agree to these terms and conditions.
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
        <button onClick={handleStartClick} className={styles.pfButton}>
          Start Test
        </button>
      </div>
    </div>
  );
};

export default IntroPF;
