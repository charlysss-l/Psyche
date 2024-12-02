import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the interface for the user results
interface User16PFTest {
  userID: string;
  firstName: string;
  lastName: string;
  age: string;
  sex: 'Female' | 'Male' | '';
  course: string;
  year: number;
  section: number;
  scoring: {
    scores: {
      factorLetter: string;
      stenScore: number;
    }[]; 
  };
}

const PFStatistics: React.FC = () => {
  const [results, setResults] = useState<User16PFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'left' | 'average' | 'right' | 'all'>('all'); // Filter state
  const [selectedFactor, setSelectedFactor] = useState<string>('A'); // Factor Letter state
  const [filters, setFilters] = useState({
    age: '',
    sex: '',
    course: '',
    year: '',
    section: '',
  });

  const [filteredResults, setFilteredResults] = useState<any[]>([]); // Store the filtered results for the chart
  const [filteredUserIDs, setFilteredUserIDs] = useState<string[]>([]); // Store the filtered user IDs

  const factorDescriptions: Record<string, string> = {
    A: 'Warmth',
    B: 'Reasoning',
    C: 'Emotional Stability',
    E: 'Dominance',
    F: 'Liveliness',
    G: 'Rule-Consciousness',
    H: 'Social Boldness',
    I: 'Sensitivity',
    L: 'Vigilance',
    M: 'Abstractedness',
    N: 'Privateness',
    O: 'Apprehension',
    Q1: 'Openness to Change',
    Q2: 'Self-Reliance',
    Q3: 'Perfectionism',
    Q4: 'Tension',
  };
  
  // Factor order
  const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];

  // Fetch data function
  const fetchData = async () => {
    try {
      const onlineResponse = await fetch('http://localhost:5000/api/user16pf');
      if (!onlineResponse.ok) {
        throw new Error(`Network response was not ok: ${onlineResponse.statusText}`);
      }

      const onlineData = await onlineResponse.json();

      const physicalResponse = await fetch('http://localhost:5000/api/omr16pf');
      if (!physicalResponse.ok) {
        throw new Error(`Network response was not ok: ${physicalResponse.statusText}`);
      }

      const physicalData = await physicalResponse.json();

      // Combine data from both sources
      onlineData.data = [...onlineData.data, ...physicalData.data];

      setResults(onlineData.data); // Set fetched data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterUserIDs = () => {
      let filteredData = results;
  
      // Apply the additional filters (age, sex, course, year, section)
      filteredData = filteredData.filter((result) => {
        const ageFilter = filters.age ? result.age === filters.age : true;
        const sexFilter = filters.sex ? result.sex === filters.sex : true;
        const courseFilter = filters.course ? result.course === filters.course : true;
        const yearFilter = filters.year ? result.year === parseInt(filters.year) : true;
        const sectionFilter = filters.section ? result.section === parseInt(filters.section) : true;
  
        return ageFilter && sexFilter && courseFilter && yearFilter && sectionFilter;
      });
  
      // Apply factor filter (based on selectedFactor)
      filteredData = filteredData.filter((result) => {
        const factorScore = result.scoring.scores.find(
          (score) => score.factorLetter === selectedFactor
        );
        return factorScore !== undefined;
      });
  
      // Filter based on factor and left/average/right meaning
      const filteredResults = factorOrder.map((factorLetter) => {
        const countLeftMeaning = filteredData.filter((result) => {
          const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
          return score && score.stenScore <= 3; // Left meaning based on sten score 1-3
        }).length;
  
        const countAverage = filteredData.filter((result) => {
          const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
          const stenScore = score?.stenScore || 0;
          return stenScore >= 4 && stenScore <= 7; // Average range based on sten score 4-7
        }).length;
  
        const countRightMeaning = filteredData.filter((result) => {
          const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
          return score && score.stenScore >= 8; // Right meaning based on sten score 8-10
        }).length;
  
        return {
          factorLetter,
          left: filter === 'left' || filter === 'all' ? countLeftMeaning : 0,
          average: filter === 'average' || filter === 'all' ? countAverage : 0,
          right: filter === 'right' || filter === 'all' ? countRightMeaning : 0,
        };
      });
  
      setFilteredResults(filteredResults); // Update filtered results
  
      // Extract filtered user IDs based on applied filters
      const filteredUserIDs = filteredData.map(result => result.userID);
      setFilteredUserIDs(filteredUserIDs); // Update filtered user IDs
    };
  
    filterUserIDs(); // Trigger filtering whenever the filter or factor changes
  }, [filter, selectedFactor, filters, results]);
  

  // Conditional rendering based on loading or error
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  // Prepare data for the stacked bar chart with filter applied
  const chartData = {
    labels: factorOrder.map(factor => factorDescriptions[factor] || factor), // Use description instead of letter
    datasets: [
      {
        label: 'Left Meaning',
        data: filteredResults.map(result => result.left),
        backgroundColor: 'purple',
      },
      {
        label: 'Average',
        data: filteredResults.map(result => result.average),
        backgroundColor: 'gray',
      },
      {
        label: 'Right Meaning',
        data: filteredResults.map(result => result.right),
        backgroundColor: 'green',
      },
    ],
  };

  // Filter widget components
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as 'left' | 'average' | 'right' | 'all');
  };

  const handleFactorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFactor(event.target.value);
  };

  const handleFilterInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Check if the event target is an input or select element
    if (event.target instanceof HTMLSelectElement) {
      setFilters({ ...filters, [event.target.name]: event.target.value });
    } else if (event.target instanceof HTMLInputElement) {
      setFilters({ ...filters, [event.target.name]: event.target.value });
    }
  };
  

  return (
    <div className={styles.reportContainer}>
      <h2 className={styles.heading}>16PF Analytics</h2>

      {/* Bar chart */}
      <div className={styles.chartContainerPF}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: { title: { display: true, text: "Factor Interpretations" } },
          scales: {
            x: {
              title: {
                display: true,
                text: 'FACTOR', // X-axis title
              },
            },
            y: {
              title: {
                display: true,
                text: 'NUMBER OF DATA', // Y-axis title
              },
            },
          },
        }}
      />

      </div>

      <h2 className={styles.heading}>Filter Results</h2>

      {/* Filter Widget */}
      <div className={styles.filterContainer}>
        <label htmlFor="filter" className={styles.label}>Filter by factor interpretation:</label>
        <select id="filter" value={filter} onChange={handleFilterChange} className={styles.select}>
          <option value="all">All</option>
          <option value="left">Left Meaning</option>
          <option value="average">Average</option>
          <option value="right">Right Meaning</option>
        </select>

        <label htmlFor="factor" className={styles.label}>Factor:</label>
        <select id="factor" value={selectedFactor} onChange={handleFactorChange}>
          {factorOrder.map((factor, index) => (
            <option key={index} value={factor}>{factorDescriptions[factor]}</option> // Use description
          ))}
        </select>

        {/* Additional filters */}
        <input
          type="text"
          name="age"
          placeholder="Age"
          value={filters.age}
          onChange={handleFilterInputChange}
        />

        <select name="sex" value={filters.sex} onChange={handleFilterInputChange}>
          <option value="">Filter by Sex</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
        <select name="course" value={filters.course} onChange={handleFilterInputChange} >
        <option value="" >Select Course</option>
        <option value="Educ">Bachelor of Secondary Education</option>
        <option value="BM">BS Business Management</option>
        <option value="CS">BS Computer Science</option>
        <option value="Crim">BS Criminology</option>
        <option value="HM">BS Hospitality Management</option>
        <option value="IT">BS Information Technology</option>
        <option value="psych">BS Psychology</option>
        </select>
        <select name="year" value={filters.year} onChange={handleFilterInputChange} >
        <option value="" >Select Year</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        </select>
        <select name="section" value={filters.section} onChange={handleFilterInputChange} >
        <option value="" >Select Section</option>
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
      </div>

      <h3 className={styles.heading}>Filtered User IDs</h3>
      <ul className={styles.filteredUserIDs}>
        {filteredUserIDs.map((userID, index) => (
          <li key={index}>{userID}</li>
        ))}
      </ul>
    </div>
  );
};

export default PFStatistics;
