import React, { useState, useEffect } from 'react';
import styles from './IQStatistics.module.scss'; // Import your CSS module
import { useNavigate } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Response {
  questionID: string;
  selectedChoice: string;
  isCorrect: boolean;
}

interface Interpretation {
  minAge: number;
  maxAge: number;
  minTestScore: number;
  maxTestScore: number;
  percentilePoints: number;
  resultInterpretation: string;
}

interface UserIQTest {
  userID: string;
  firstName: string;
  lastName: string;
  age: number;
  sex: 'Female' | 'Male';
  course: string;
  year: number;
  section: number;
  testID: string;
  responses: Response[];
  totalScore: number;
  testType: 'Online' | 'Physical';
  testDate: Date;
  interpretation?: {
    percentilePoints: number;
    resultInterpretation: string;
  };
}

const IQStatistics: React.FC = () => {
  const [results, setResults] = useState<UserIQTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;
  const navigate = useNavigate();

  // Filter state variables
  const [filters, setFilters] = useState({
    userID: '',
    firstName: '',
    lastName: '',
    age: '',
    sex: '',
    course: '',
    year: '',
    section: '',
    testType: '',
  });

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/useriq');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();

      // Fetch IQ test interpretation data
      const iqTestResponse = await fetch('http://localhost:5000/api/IQtest/67277ea7aacfc314004dca20');
      if (!iqTestResponse.ok) {
        throw new Error(`Failed to fetch IQ test: ${iqTestResponse.statusText}`);
      }
      const iqTestData = await iqTestResponse.json();
      const interpretations: Interpretation[] = iqTestData.interpretation;

      // Add interpretation to each result
      const resultsWithInterpretation = data.data.map((result: UserIQTest) => {
        const interpretation = interpretations.find(
          (interp) =>
            result.age >= interp.minAge &&
            result.age <= interp.maxAge &&
            result.totalScore >= interp.minTestScore &&
            result.totalScore <= interp.maxTestScore
        );

        return {
          ...result,
          interpretation: interpretation
            ? {
                percentilePoints: interpretation.percentilePoints,
                resultInterpretation: interpretation.resultInterpretation,
              }
            : { percentilePoints: 0, resultInterpretation: 'No interpretation available' },
        };
      });

      setResults(resultsWithInterpretation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter the results based on the filter criteria
  const filteredResults = results.filter((result) => {
    return (
      (filters.userID ? result.userID.includes(filters.userID) : true) &&
      (filters.firstName ? result.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) : true) &&
      (filters.lastName ? result.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) : true) &&
      (filters.age ? result.age.toString() === filters.age : true) &&
      (filters.sex ? result.sex === filters.sex : true) &&
      (filters.course ? result.course.toLowerCase().includes(filters.course.toLowerCase()) : true) &&
      (filters.year ? result.year.toString() === filters.year : true) &&
      (filters.section ? result.section.toString() === filters.section : true) &&
      (filters.testType ? result.testType === filters.testType : true)
    );
  });

  // Prepare chart data for bar chart
  const interpretationCounts: Record<string, number> = {};
  filteredResults.forEach((result) => {
    const interpretation = result.interpretation?.resultInterpretation ?? 'No interpretation available';
    interpretationCounts[interpretation] = (interpretationCounts[interpretation] || 0) + 1;
  });

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const chartData = {
    labels: Object.keys(interpretationCounts),
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(interpretationCounts),
        backgroundColor: Object.keys(interpretationCounts).map(() => getRandomColor()),
      },
    ],
  };

  // Handle changes in filter inputs
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>IQ Analytics</h2>

      <div className={styles.chartContainer}>
        <Bar
          className={styles.tablegraph}
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Score Interpretations',
              },
            },
          }}
        />
      </div>
      
      <h2>Filter Result</h2>
      <div className={styles.filters}>
        {/* Filter Inputs */}
        <input
          type="text"
          name="userID"
          value={filters.userID}
          onChange={handleFilterChange}
          placeholder="Filter by User ID"
          className={styles.inputIQStat}
        />
        <input
          type="number"
          name="age"
          value={filters.age}
          onChange={handleFilterChange}
          placeholder="Filter by Age"
        />
        <select name="sex" value={filters.sex} onChange={handleFilterChange}>
          <option value="">Filter by Sex</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
        <select name="course" value={filters.course} onChange={handleFilterChange} >
        <option value="" disabled>Select Course</option>
        <option value="Educ">Bachelor of Secondary Education</option>
        <option value="BM">BS Business Management</option>
        <option value="CS">BS Computer Science</option>
        <option value="Crim">BS Criminology</option>
        <option value="HM">BS Hospitality Management</option>
        <option value="IT">BS Information Technology</option>
        <option value="psych">BS Psychology</option>
        </select>
        <select name="year" value={filters.year} onChange={handleFilterChange} >
        <option value="" disabled>Select Year</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        </select>
        <select name="section" value={filters.section} onChange={handleFilterChange} >
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

        {/*<select name="testType" value={filters.testType} onChange={handleFilterChange}>
          <option value="">Filter by Test Type</option>
          <option value="Online">Online</option>
          <option value="Physical">Physical</option>
        </select>*/}
      </div>

      {/* You can display the filtered results as a table or in any other format here */}
      {/* Example: */}
      <table className={styles.userListContaIner}>
        <thead>
          <tr>
            <th>List of Filtered User</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((result) => (
            <tr key={result.userID}  className={styles.userList} >
              <td className={styles.idIqlist}>{result.userID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IQStatistics;
