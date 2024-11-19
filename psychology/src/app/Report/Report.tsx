import React, { useState, useEffect } from 'react';
import styles from './report.module.scss';  
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

const Report: React.FC = () => {
  const [results, setResults] = useState<User16PFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'left' | 'average' | 'right' | 'all'>('all'); // Filter state
  const [selectedFactor, setSelectedFactor] = useState<string>('A'); // Factor Letter state
  const [filteredUserIDs, setFilteredUserIDs] = useState<string[]>([]); // Store filtered user IDs

  // Factor order
  const factorOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'];

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user16pf');
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.data); // Set fetched data
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
    // Filter userIDs based on the selected filter and factor
    const filterUserIDs = () => {
      let filteredIDs: string[] = [];

      if (filter === 'left') {
        filteredIDs = results
          .filter((result) => result.scoring.scores.some(score => score.factorLetter === selectedFactor && score.stenScore <= 3))
          .map(result => result.userID);
      } else if (filter === 'average') {
        filteredIDs = results
          .filter((result) => result.scoring.scores.some(score => score.factorLetter === selectedFactor && score.stenScore >= 4 && score.stenScore <= 7))
          .map(result => result.userID);
      } else if (filter === 'right') {
        filteredIDs = results
          .filter((result) => result.scoring.scores.some(score => score.factorLetter === selectedFactor && score.stenScore >= 8))
          .map(result => result.userID);
      } else {
        filteredIDs = results
          .filter((result) => result.scoring.scores.some(score => score.factorLetter === selectedFactor))
          .map(result => result.userID); // Show all user IDs when 'all' is selected for the factor
      }

      setFilteredUserIDs(filteredIDs); // Update state with filtered user IDs
    };

    filterUserIDs(); // Trigger filtering whenever the filter or factor changes
  }, [filter, selectedFactor, results]);

  // Conditional rendering based on loading or error
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  // Prepare data for the stacked bar chart with filter applied
  const chartData = {
    labels: factorOrder,
    datasets: [
      {
        label: 'Left Meaning',
        data: factorOrder.map((factorLetter) => {
          const countLeftMeaning = results.filter((result) => {
            const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
            return score && score.stenScore <= 3; // Left meaning based on sten score 1-3
          }).length;
          return filter === 'left' || filter === 'all' ? countLeftMeaning : 0;
        }),
        backgroundColor: 'green',
      },
      {
        label: 'Average',
        data: factorOrder.map((factorLetter) => {
          const countAverage = results.filter((result) => {
            const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
            const stenScore = score?.stenScore || 0;
            return stenScore >= 4 && stenScore <= 7; // Average range based on sten score 4-7
          }).length;
          return filter === 'average' || filter === 'all' ? countAverage : 0;
        }),
        backgroundColor: 'gray',
      },
      {
        label: 'Right Meaning',
        data: factorOrder.map((factorLetter) => {
          const countRightMeaning = results.filter((result) => {
            const score = result.scoring.scores.find(score => score.factorLetter === factorLetter);
            return score && score.stenScore >= 8; // Right meaning based on sten score 8-10
          }).length;
          return filter === 'right' || filter === 'all' ? countRightMeaning : 0;
        }),
        backgroundColor: 'red',
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

  return (
    <div className={styles.reportContainer}>
      <h2 className={styles.heading}>16PF Report</h2>

      {/* Filter Widget */}
      <div className={styles.filterContainer}>
        <label htmlFor="filter" className={styles.label}>Filter by factor interpretation:</label>
        <select id="filter" value={filter} onChange={handleFilterChange} className={styles.select}>
          <option value="all">All</option>
          <option value="left">Left Meaning</option>
          <option value="average">Average</option>
          <option value="right">Right Meaning</option>
        </select>

        <label htmlFor="factor" className={styles.label}>Factor Letter:</label>
        <select id="factor" value={selectedFactor} onChange={handleFactorChange} className={styles.select}>
          {factorOrder.map((factor, index) => (
            <option key={index} value={factor}>{factor}</option>
          ))}
        </select>
      </div>

      {/* Display filtered User IDs only when filter is not 'all' */}
      {filter !== 'all' && (
        <div className={styles.userListContainer}>
          <h3 className={styles.subHeading}>
            User IDs of Students with {filter.charAt(0).toUpperCase() + filter.slice(1)} Meaning for Factor {selectedFactor}:
          </h3>
          <ul className={styles.userList}>
            {filteredUserIDs.length > 0 ? (
              filteredUserIDs.map((userID, index) => (
                <li key={index} className={styles.userListItem}>
                  Student {index + 1} - {userID}
                </li>
              ))
            ) : (
              <li className={styles.noUsers}>No users found.</li>
            )}
          </ul>
        </div>
      )}

      {/* Bar chart */}
      <div className={styles.chartContainer}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { title: { display: true, text: "Factor Interpretations" } },
          }}
        />
      </div>
    </div>
  );
};

export default Report;