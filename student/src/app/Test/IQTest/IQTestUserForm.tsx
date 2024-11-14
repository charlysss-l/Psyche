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

        // Store the user data in localStorage or pass to IQTest as state
        localStorage.setItem('userDetails', JSON.stringify({ firstName, lastName, age, course, year, section, sex, testType }));

        // Navigate to the IQ test page
        navigate('/iqtest');
    };

    return (
        <form onSubmit={handleSubmit} className={style.formTest}>
            <h1>IQ Test</h1>
            <p className={style.ageWarning}> "You Must Be 20 Years Old and Above To Take This Test" <br/> 
            "You Only Have 45 Minutes To Complete This Test. The Test Will Automatically Submit Once Time Is Up"
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
                <option value="BSCS">BSCS</option>
                <option value="BSIT">BSIT</option>
                <option value="BSP">BSP</option>
                <option value="BSCrim">BSCrim</option>
                <option value="BSEd">BSEd</option>
                <option value="BSHRM">BSHRM</option>
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
            </select>
            <select value={testType} onChange={(e) => setTestType(e.target.value as 'Online' | 'Physical')} required>
                <option value="" disabled>Select Exam Type</option>
                <option value="Online">Online</option>
                <option value="Physical">Physical</option>
            </select>
            <button className={style.start} type="submit">Start Test</button>
        </form>
    );
};

export default UserForm;
