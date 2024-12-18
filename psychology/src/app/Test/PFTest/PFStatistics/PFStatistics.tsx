import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import backendUrl from '../../../../config';
import Modal from 'react-modal'; // Install via `npm install react-modal`
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
  section: string;
  testDate: Date;
  scoring: {
    scores: {
      factorLetter: string;
      stenScore: number;
    }[]; 
  };
}

const PFgraphLogo = '/PFgraphLogo.png';


const PFStatistics: React.FC = () => {
  const [results, setResults] = useState<User16PFTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meaning, setFilter] = useState<'left' | 'average' | 'right' | 'all'>('all'); // Filter state
  const [selectedFactor, setSelectedFactor] = useState<string>(""); // Factor Letter state
  const [totalResults, setTotalResults] = useState<number>(0); // State to store total results count
  const [onlineResults, setOnlineResults] = useState<number>(0); // State to store online results count
  const [physicalResults, setPhysicalResults] = useState<number>(0); // State to store physical results count
  const [filters, setFilters] = useState({
    age: '',
    sex: '',
    course: '',
    year: '',
    section: '',
    startMonth: '', // Start month filter
    endMonth: '', // End month filter
  });

  const [filteredResults, setFilteredResults] = useState<any[]>([]); // Store the filtered results for the chart
  const [filteredUserIDs, setFilteredUserIDs] = useState<string[]>([]); // Store the filtered user IDs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  // Function to get factor descriptions
  const getFactorMeanings = (factorLetter: string) => {
    switch (factorLetter) {
      case 'A':
        return { leftMeaning: 'Reserved, Impersonal, Distant', rightMeaning: 'Warm, Outgoing, Attentive to Others' };
      case 'B':
        return { leftMeaning: 'Concrete', rightMeaning: 'Abstract' };
      case 'C':
        return { leftMeaning: 'Reactive, Emotionally Changeable', rightMeaning: 'Emotionally Stable, Adaptive, Mature' };
      case 'E':
        return { leftMeaning: 'Deferential, Cooperative, Avoids Conflict', rightMeaning: 'Dominant, Forceful, Assertive' };
      case 'F':
        return { leftMeaning: 'Serious, Restrained, Careful', rightMeaning: 'Lively, Animated, Spontaneous' };
      case 'G':
        return { leftMeaning: 'Expedient, Nonconforming', rightMeaning: 'Rule-conscious, Dutiful' };
      case 'H':
        return { leftMeaning: 'Shy, Threat-Sensitive, Timid', rightMeaning: 'Socially Bold, Venturesome, Thick Skinned' };
      case 'I':
        return { leftMeaning: 'Utilitarian, Objective, Unsentimental', rightMeaning: 'Sensitive, Aesthetic, Sentimental' };
      case 'L':
        return { leftMeaning: 'Trusting, Unsuspecting, Accepting', rightMeaning: 'Vigilant, Suspicious, Skeptical, Wary' };
      case 'M':
        return { leftMeaning: 'Grounded, Practical, Solution-Oriented', rightMeaning: 'Abstracted, Imaginative, Idea-Oriented' };
      case 'N':
        return { leftMeaning: 'Forthright, Genuine, Artless', rightMeaning: 'Private, Discreet, Non-Disclosing' };
      case 'O':
        return { leftMeaning: 'Self-Assured, Unworried, Complacent', rightMeaning: 'Apprehensive, Self-Doubting, Worried' };
      case 'Q1':
        return { leftMeaning: 'Traditional, Attached to Familiar', rightMeaning: 'Open to Change, Experimenting' };
      case 'Q2':
        return { leftMeaning: 'Group-Oriented, Affiliative', rightMeaning: 'Self-reliant, Solitary, Individualistic' };
      case 'Q3':
        return { leftMeaning: 'Tolerates Disorder, Unexciting, Flexible', rightMeaning: 'Perfectionistic, Organized, Self-Disciplined' };
      case 'Q4':
        return { leftMeaning: 'Relaxed, Placid, Patient', rightMeaning: 'Tense, High Energy, Impatient, Driven' };
      default:
        return { leftMeaning: '', rightMeaning: '' };
    }
  };

  const handleFactorSelect = (factorLetter: string) => {
    setSelectedFactor(factorLetter);
  };

  const selectedFactorMeanings = getFactorMeanings(selectedFactor);
  
  // Fetch data function
  const fetchData = async () => {
    try {
      const onlineResponse = await fetch(`${backendUrl}/api/user16pf`);
      if (!onlineResponse.ok) {
        throw new Error(`Network response was not ok: ${onlineResponse.statusText}`);
      }
  
      const onlineData = await onlineResponse.json();
  
      const physicalResponse = await fetch(`${backendUrl}/api/omr16pf`);
      if (!physicalResponse.ok) {
        throw new Error(`Network response was not ok: ${physicalResponse.statusText}`);
      }
  
      const physicalData = await physicalResponse.json();

      setOnlineResults(onlineData.data.length); // Store online results count
      setPhysicalResults(physicalData.data.length); // Store physical results count
  
      // Combine data from both sources
      const combinedData = [...onlineData.data, ...physicalData.data];
      setResults(combinedData); // Set the combined data
      setTotalResults(combinedData.length); // Store total results count
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
  
      // Parse the age filter input
      const parseAgeFilter = (ageFilter: string) => {
        if (!ageFilter) return null;
  
        const rangeMatch = ageFilter.match(/^(\d+)\s*-\s*(\d+)$/); // Matches "20 - 25" format
        if (rangeMatch) {
          const [_, minAge, maxAge] = rangeMatch;
          return { minAge: parseInt(minAge), maxAge: parseInt(maxAge) };
        }
  
        const singleAge = parseInt(ageFilter); // Single age input
        return singleAge ? { minAge: singleAge, maxAge: singleAge } : null;
      };
  
      const ageFilter = parseAgeFilter(filters.age);
  
      // Apply month filter
      if (filters.startMonth) {
        const startMonthDate = new Date(filters.startMonth + '-01'); // Use the first day of the start month
        let endMonthDate = new Date(startMonthDate); // Initialize endMonthDate as startMonthDate
        endMonthDate.setMonth(endMonthDate.getMonth() + 1); // Move to the next month
  
        // If endMonth is provided, use it for a range filter
        if (filters.endMonth) {
          const endMonth = new Date(filters.endMonth + '-01');
          endMonth.setMonth(endMonth.getMonth() + 1); // Adjust for end month range
          filteredData = filteredData.filter((result) => {
            const testDate = new Date(result.testDate); // Assuming testDate is a Date object
            return testDate >= startMonthDate && testDate < endMonth;
          });
        } else {
          // If only startMonth is provided, filter for that single month
          filteredData = filteredData.filter((result) => {
            const testDate = new Date(result.testDate); // Assuming testDate is a Date object
            return testDate >= startMonthDate && testDate < endMonthDate;
          });
        }
      }
  
      // Apply the additional filters (age, sex, course, year, section)
      filteredData = filteredData.filter((result) => {
        const age = parseInt(result.age);
        const ageCondition = ageFilter
          ? age >= ageFilter.minAge && age <= ageFilter.maxAge
          : true;
        const sexFilter = filters.sex ? result.sex === filters.sex : true;
        const courseFilter = filters.course ? result.course === filters.course : true;
        const yearFilter = filters.year ? result.year === parseInt(filters.year) : true;
        const sectionFilter = filters.section ? result.section === filters.section : true;
  
        return ageCondition && sexFilter && courseFilter && yearFilter && sectionFilter;
      });
  
      // Apply selectedFactor filter
      if (selectedFactor && selectedFactor !== 'all') {
        filteredData = filteredData.filter((result) =>
          result.scoring.scores.some((score) => score.factorLetter === selectedFactor)
        );
      }
  
      // Filter based on factor interpretation and update the filtered results
      const filteredResults = factorOrder.map((factorLetter) => {
        // Skip this factor if the user hasn't selected it
        if (selectedFactor && selectedFactor !== 'all' && selectedFactor !== factorLetter) {
          return null;
        }
  
        const countLeftMeaning = filteredData.filter((result) => {
          const score = result.scoring.scores.find((score) => score.factorLetter === factorLetter);
          return score && score.stenScore <= 3; // Left meaning based on sten score 1-3
        }).map(result => result.userID); // Track user IDs for left meaning
  
        const countAverage = filteredData.filter((result) => {
          const score = result.scoring.scores.find((score) => score.factorLetter === factorLetter);
          const stenScore = score?.stenScore || 0;
          return stenScore >= 4 && stenScore <= 7; // Average range based on sten score 4-7
        }).map(result => result.userID); // Track user IDs for average meaning
  
        const countRightMeaning = filteredData.filter((result) => {
          const score = result.scoring.scores.find((score) => score.factorLetter === factorLetter);
          return score && score.stenScore >= 8; // Right meaning based on sten score 8-10
        }).map(result => result.userID); // Track user IDs for right meaning
  
        return {
          factorLetter,
          left: meaning === 'left' || meaning === 'all' ? countLeftMeaning.length : 0,
          average: meaning === 'average' || meaning === 'all' ? countAverage.length : 0,
          right: meaning === 'right' || meaning === 'all' ? countRightMeaning.length : 0,
          leftUserIDs: meaning === 'left' || meaning === 'all' ? countLeftMeaning : [], // Only include if selected 'left'
          averageUserIDs: meaning === 'average' || meaning === 'all' ? countAverage : [], // Only include if selected 'average'
          rightUserIDs: meaning === 'right' || meaning === 'all' ? countRightMeaning : [], // Only include if selected 'right'
        };
      }).filter(Boolean); // Remove null results if the factor was not selected
  
      setFilteredResults(filteredResults);
  
      // Update filteredUserIDs based on the selected factor and meaning
      let filteredUserIDs: any[] | ((prevState: string[]) => string[]) = [];
      if (meaning === 'left' || meaning === 'all') {
        filteredUserIDs = filteredData.filter((result) => {
          const score = result.scoring.scores.find((score) => score.factorLetter === selectedFactor);
          return score && score.stenScore <= 3; // Left meaning
        }).map(result => result.userID); // Get the user IDs for left meaning
      }
  
      if (meaning === 'average' || meaning === 'all') {
        filteredUserIDs = [...filteredUserIDs, ...filteredData.filter((result) => {
          const score = result.scoring.scores.find((score) => score.factorLetter === selectedFactor);
          const stenScore = score?.stenScore || 0;
          return stenScore >= 4 && stenScore <= 7; // Average range
        }).map(result => result.userID)]; // Add the user IDs for average meaning
      }
  
      if (meaning === 'right' || meaning === 'all') {
        filteredUserIDs = [...filteredUserIDs, ...filteredData.filter((result) => {
          const score = result.scoring.scores.find((score) => score.factorLetter === selectedFactor);
          return score && score.stenScore >= 8; // Right meaning
        }).map(result => result.userID)]; // Add the user IDs for right meaning
      }
  
      // If no filters are applied, show all user IDs
      if (meaning === 'all' && selectedFactor === '') {
        filteredUserIDs = results.map((result) => result.userID); // Show all user IDs when no filters are applied
      }
  
      setFilteredUserIDs(filteredUserIDs);
    };
  
    // Call the function to filter the user IDs when filters or other state changes
    filterUserIDs();
  }, [filters, selectedFactor, meaning, results]);
  

  // Conditional rendering based on loading or error
  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;
  
  // Prepare data for the stacked bar chart with filter applied
  const chartData = {
    labels: selectedFactor === 'all' || selectedFactor === ''
      ? factorOrder.map((factor) => factorDescriptions[factor] || factor)
      : [factorDescriptions[selectedFactor] || selectedFactor],
    datasets: [
      {
        label: 'Left Meaning',
        data: selectedFactor === 'all' || selectedFactor === ''
          ? filteredResults.map((result) => result.left)
          : [filteredResults.find((res) => res.factorLetter === selectedFactor)?.left || 0],
        backgroundColor: 'gold',
      },
      {
        label: 'Average',
        data: selectedFactor === 'all' || selectedFactor === ''
          ? filteredResults.map((result) => result.average)
          : [filteredResults.find((res) => res.factorLetter === selectedFactor)?.average || 0],
        backgroundColor: 'gray',
      },
      {
        label: 'Right Meaning',
        data: selectedFactor === 'all' || selectedFactor === ''
          ? filteredResults.map((result) => result.right)
          : [filteredResults.find((res) => res.factorLetter === selectedFactor)?.right || 0],
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
    const { name, value } = event.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };
  
  return (
    <div className={styles.reportContainer}>

    <h2 className={styles.heading}>16Personality Factor Data</h2>


    <div className={styles.dashboardRow}>
      <div className={styles.onlineResultCount}>
        <p>Total Online Data: <br/> <span className={styles.count}>{onlineResults}</span></p>
      </div>
      <div className={styles.physicalResultCount}>
        <p>Total Physical Data: <br/> <span className={styles.count}>{physicalResults}</span></p>
      </div>
      <div className={styles.totalResultCount}>
        <p>Total Data: <br/> <span className={styles.count}>{totalResults}</span></p>
      </div>
    
    </div>
    <button className={styles.seeGraphButton} onClick={openModal}>
            Click To View Graph <br/> <img src={PFgraphLogo} alt="Graph Logo" className={styles.graphLogo}/>
          </button>




      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Graph Modal"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <button className={styles.closeButton} onClick={closeModal}>Close</button>


<div className={styles.contentRow}>

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



      {/* Display Factor Meanings if a factor is selected */}
{selectedFactor && (
  <div className={styles.factorMeaning}>
    {meaning === 'left' && selectedFactorMeanings.leftMeaning && (
      <p><strong className={styles.leftMeaning}>Left Meaning:</strong> {selectedFactorMeanings.leftMeaning}</p>
    )}

    {meaning === 'right' && selectedFactorMeanings.rightMeaning && (
      <p><strong className={styles.rightMeaning}>Right Meaning:</strong> {selectedFactorMeanings.rightMeaning}</p>
    )}

<div className={styles.averageContainer}>
    {meaning === 'average' && (
      <>
        {selectedFactorMeanings.leftMeaning && (
          <p><strong className={styles.averageMeaning}>(Average)</strong></p>
        )}
        {selectedFactorMeanings.leftMeaning && (
          <p><strong className={styles.averageLeftMeaning}>Left Meaning:</strong> {selectedFactorMeanings.leftMeaning}</p>
        )}
        {selectedFactorMeanings.rightMeaning && (
          <p><strong className={styles.averageRightMeaning}>Right Meaning:</strong> {selectedFactorMeanings.rightMeaning}</p>
        )}
      </>
    )}
</div>
    {meaning === 'all' && (
      <>
        {selectedFactorMeanings.leftMeaning && (
          <p><strong className={styles.allLeftMeaning}>Left Meaning:</strong> {selectedFactorMeanings.leftMeaning}</p>
        )}
        {selectedFactorMeanings.leftMeaning && (
          <p><strong className={styles.allAverage}>(Average)</strong></p>
        )}
        {selectedFactorMeanings.rightMeaning && (
          <p><strong className={styles.allRightMeaning}>Right Meaning:</strong> {selectedFactorMeanings.rightMeaning}</p>
        )}
      </>
    )}
  </div>
)}

      </div>

       {/* Filter Widget */}
  <div className={styles.filterContainer}>
      <h2 className={styles.heading}>Filter Results</h2>
        <select id="Meaning" value={meaning} onChange={handleFilterChange} className={styles.select}>
          <option value="all">All</option>
          <option value="left">Left Meaning</option>
          <option value="average">Average</option>
          <option value="right">Right Meaning</option>
        </select>
        <select id="factor" value={selectedFactor} onChange={handleFactorChange} className={styles.select}>
          <option value="">Select by Factor</option>
          {factorOrder.map((factor, index) => (
            <option key={index} value={factor}>{factorDescriptions[factor]}</option>
          ))}
        </select>
        {/* Additional filters */}
        <input
          type="text"
          name="age"
          placeholder="Filter by Age/Range (e.g., 20-25)"
          value={filters.age}
          onChange={handleFilterInputChange}
          className={styles.select}
        />
        <select name="sex" value={filters.sex} onChange={handleFilterInputChange} className={styles.select}>
          <option value="">Filter by Sex</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
        <select name="course" value={filters.course} onChange={handleFilterInputChange} className={styles.select} >
        <option value="" >Select Course</option>
        <option value="BSEduc">Bachelor of Secondary Education</option>
        <option value="BSBM">BS Business Management</option>
        <option value="BSCS">BS Computer Science</option>
        <option value="BSCrim">BS Criminology</option>
        <option value="BSHM">BS Hospitality Management</option>                    
        <option value="BSIT">BS Information Technology</option>
        <option value="BSP">BS Psychology</option>
        </select>
        <select name="year" value={filters.year} onChange={handleFilterInputChange} className={styles.select}>
        <option value="" >Select Year</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        </select>
        <select name="section" value={filters.section} onChange={handleFilterInputChange} className={styles.select}>
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
        <div className={styles.monthFilterRow}>
          <label>From:</label>
          <input
            type="month"
            name="startMonth"
            value={filters.startMonth}
            onChange={handleFilterInputChange}
            className={styles.monthFilter}
          />
          <label>To:</label>
          <input
            type="month"
            name="endMonth"
            value={filters.endMonth}
            onChange={handleFilterInputChange}
            className={styles.monthFilter}
          />
        </div>
        

        <table className={styles.userListContaIner}>
        {/* Display heading and number of results */}
       
          
            <h3 className={styles.heading}>Filtered User IDs</h3>
            <div className={styles.resultCount}>
              <p>Total UserID Results: {filteredUserIDs.length}</p>
            </div>
          
        
      <div className={styles.responsesWrapper}>

      <ul className={styles.filteredUserIDs}>
        {filteredUserIDs.map((userID, index) => (
          <tr   className={styles.userList} >
          <td key={index} className={styles.idIqlist}>{userID}</td>
          </tr>
        ))}
      </ul>
      </div>
      </table>
      </div>
      </div>
      </Modal>
    </div>
  );
};

export default PFStatistics;
