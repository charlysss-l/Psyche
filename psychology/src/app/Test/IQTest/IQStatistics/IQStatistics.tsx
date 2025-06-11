import React, { useState, useEffect } from 'react';
import styles from './IQStatistics.module.scss'; // Import your CSS module
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Install via `npm install react-modal`
import backendUrl from '../../../../config';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IQgraphLogo = '/IQgraphLogo.png';

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
  const [totalResults, setTotalResults] = useState<number>(0); // State to store total results count
  const [onlineResults, setOnlineResults] = useState<number>(0); // State to store online results count
  const [physicalResults, setPhysicalResults] = useState<number>(0); // State to store physical results count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;
  const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
    startMonth: '', // Starting month for range filter
    endMonth: '',   // Ending month for range filter
  });
  

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const onlineResponse = await fetch(`${backendUrl}/api/useriq`);
      if (!onlineResponse.ok) {
        throw new Error(`Network response was not ok: ${onlineResponse.statusText}`);
      }
      const onlineData = await onlineResponse.json();
  
      const physicalResponse = await fetch(`${backendUrl}/api/omr`);
      if (!physicalResponse.ok) {
        throw new Error(`Network response was not ok: ${physicalResponse.statusText}`);
      }
      const physicalData = await physicalResponse.json();
  
      const iqTestResponse = await fetch(`${backendUrl}/api/IQtest/67277ea7aacfc314004dca20`);
      if (!iqTestResponse.ok) {
        throw new Error(`Failed to fetch IQ test: ${iqTestResponse.statusText}`);
      }
      const iqTestData = await iqTestResponse.json();
      const interpretations: Interpretation[] = iqTestData.interpretation;

      setOnlineResults(onlineData.data.length); // Store online results count
      setPhysicalResults(physicalData.data.length); // Store physical results count
  
  
      // Combine data from both sources
      const combinedData: UserIQTest[] = [...onlineData.data, ...physicalData.data].map((result) => {
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
  
      setResults(combinedData);
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

  // Filter the results based on the filter criteria
const filteredResults = results.filter((result) => {
  const ageFilter = filters.age;
  let ageMatch = true;

  // Handle age filter
  if (ageFilter) {
    const ageRange = ageFilter.split('-').map(Number);
    if (ageRange.length === 2) {
      ageMatch = result.age >= ageRange[0] && result.age <= ageRange[1];
    } else {
      ageMatch = result.age === Number(ageFilter);
    }
  }

  // Handle month filtering
  const testMonth = new Date(result.testDate).toISOString().slice(0, 7); // Extract YYYY-MM
  let startMonthMatch = true;
  let endMonthMatch = true;

  // If a start month is provided, filter based on it.
  if (filters.startMonth) {
    startMonthMatch = testMonth >= filters.startMonth;
    // If no endMonth is provided, the filter should stop at startMonth
    endMonthMatch = filters.endMonth ? testMonth <= filters.endMonth : testMonth === filters.startMonth;
  } else if (filters.endMonth) {
    // If only endMonth is provided, filter up to that month
    endMonthMatch = testMonth <= filters.endMonth;
  }

  return (
    startMonthMatch &&
    endMonthMatch &&
    (filters.userID ? result.userID.includes(filters.userID) : true) &&
    (filters.firstName ? result.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) : true) &&
    (filters.lastName ? result.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) : true) &&
    ageMatch &&
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

const getVioletShade = () => {
  // Generate a shade of violet by varying the red and blue channels a bit
  const red = 200 + Math.floor(Math.random() * 56);    // 200 - 255
  const green = 100 + Math.floor(Math.random() * 31);  // 100 - 130
  const blue = 200 + Math.floor(Math.random() * 56);   // 200 - 255
  return `rgb(${red}, ${green}, ${blue})`;
};

const chartData = {
  labels: Object.keys(interpretationCounts),
  datasets: [
    {
      label: 'Number of Students',
      data: Object.values(interpretationCounts),
      backgroundColor: Object.keys(interpretationCounts).map(() => getVioletShade()),
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
    <div className={styles.reportContainer}>

      <h2 className={styles.heading}>IQ Test Data</h2>


    <div className={styles.dashboardRow}>
      <div className={styles.onlineResultCount}>
        <p>Total Online Data: <span className={styles.count}>{onlineResults}</span></p>
      </div>
      <div className={styles.physicalResultCount}>
        <p>Total Physical Data: <span className={styles.count}>{physicalResults}</span></p>
      </div>
      <div className={styles.totalResultCount}>
        <p>Total Data:  <span className={styles.count}>{totalResults}</span></p>
      </div>
 
    </div>
    
    <button className={styles.seeGraphButton} onClick={openModal}>
  <div className={styles.miniGraphContainer}>
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      }}
    />
    <p className={styles.viewGraphText}>Click to View Graph</p>
  </div>
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
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'INTERPRETATION', // X-axis title
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
      
      <div className={styles.filterContainer}>
      <h2 className={styles.filterres}>Filter Result</h2>

        {/* Filter Inputs */}
        <input
          type="text"
          name="userID"
          value={filters.userID}
          onChange={handleFilterChange}
          placeholder="Filter by User ID"
          className={styles.select}        />
        <input
          type="text"
          name="age"
          value={filters.age}
          onChange={handleFilterChange}
          placeholder="Filter by Age/Range (e.g., 20-25)"
          className={styles.select}
        />
        <select name="sex" value={filters.sex} onChange={handleFilterChange} className={styles.select}>
          <option value="">Filter by Sex</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
        <select name="course" value={filters.course} onChange={handleFilterChange} className={styles.select}>
        <option value="" >Select Course</option>
        <option value="BSEduc">Bachelor of Secondary Education</option>
        <option value="BSBM">BS Business Management</option>
        <option value="BSCS">BS Computer Science</option>
        <option value="BSCrim">BS Criminology</option>
        <option value="BSHM">BS Hospitality Management</option>                    
        <option value="BSIT">BS Information Technology</option>
        <option value="BSP">BS Psychology</option>
        </select>
        <select name="year" value={filters.year} onChange={handleFilterChange} className={styles.select}>
        <option value="" >Select Year</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        </select>
        <select name="section" value={filters.section} onChange={handleFilterChange} className={styles.select}>
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
            onChange={handleFilterChange}
            className={styles.monthFilter}
          />
          <label>To:</label>
          <input
            type="month"
            name="endMonth"
            value={filters.endMonth}
            onChange={handleFilterChange}
            className={styles.monthFilter}
          />
        </div>




        {/* Display the filtered results */}
      <table className={styles.userListContaIner}>

        {/* Display Number of Results */}
        <h3 className={styles.heading}>Filtered User IDs</h3>

        <div className={styles.resultCount}>
        <p>
        Total UserID Results: <strong>{filteredResults.length}</strong>
        </p>
        </div>

        <div className={styles.responsesWrapper}>
        <tbody>
          {filteredResults.map((result) => (
            <tr className={styles.userList} key={result.userID}>
              <td className={styles.idIqlist}>{result.userID}</td>
            </tr>
          ))}
        </tbody>
        </div>
        </table>
      </div>

  </div>
  </Modal>
      
    </div>
  );
};

export default IQStatistics;
