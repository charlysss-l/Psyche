import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './studentiqtest.module.scss';

const UserForm: React.FC = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [course, setCourse] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [section, setSection] = useState<string>('');
    const [sex, setSex] = useState<'Male' | 'Female' | ''>('');
    const [testType, setTestType] = useState<'Online' | 'Physical' | ''>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the user is 20 years or older
        if (parseInt(age) < 20) {
            alert("You must be 20 years or older to take this test.");
            return;
        }

        // Store the user data in localStorage or pass to IQTest as state
        localStorage.setItem('userDetails', JSON.stringify({ firstName, lastName, age, course, year, section, sex, testType }));

        // Navigate to the IQ test page
        navigate('/iqtest');
    };

    return (
        <form onSubmit={handleSubmit} className={style.formTest}>
            <h1 className={style.iqTitle}>IQ Test</h1>
            <p className={style.ageWarning}>
               <span className ={style.highlight}>*</span> You Must Be 20 Years Old and Above To Take This Test <br/> 
               <span className ={style.highlight}>*</span>  You Only Have 45 Minutes To Complete This Test. The Test Will Automatically Submit Once Time Is Up" <br/>
               <span className ={style.highlight}>*</span> You can only answer this test once a day, if any error occurs and need to retake the test, please direct to the administrator (Psychology Department).
            </p>
            <h1 className={style.rulesTitle}>Rules:</h1>
            <p className={style.rules}>
            <span className={style.highlight}>*</span> Please do not take screenshots or share the content of this test. It is confidential and for your use only. <br />
                <span className={style.highlight}>*</span> Those who do will be penalized and as your student record will be tracked by the Administrators. <br />
            </p>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
            <select value={sex} onChange={(e) => setSex(e.target.value as 'Male' | 'Female')} required>
                <option value="" disabled>Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <select value={course} onChange={(e) => setCourse(e.target.value)} required>
                <option value="" disabled>Select Course</option>
                <option value="BSEduc">Bachelor of Secondary Education</option>
                <option value="BSBM">BS Business Management</option>
                <option value="BSCS">BS Computer Science</option>
                <option value="BSCrim">BS Criminology</option>
                <option value="BSHM">BS Hospitality Management</option>                    
                <option value="BSIT">BS Information Technology</option>
                <option value="BSP">BS Psychology</option>
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} required>
                <option value="" disabled>Select Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
            <select value={section} onChange={(e) => setSection(e.target.value)} required>
                <option value="" disabled>Select Section</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="Irregular">Irregular</option>
            </select>
            <select value={testType} onChange={(e) => setTestType(e.target.value as 'Online' | 'Physical')} required>
                <option value="" disabled>Select Exam Type</option>
                <option value="Online">Online</option>
            </select>
            <p className={style.note}>Note: Timer Will Start Once You Click The Start Button</p>
            <button className={style.start} type="submit">Start Test</button>
        </form>
    );
};

export default UserForm;
