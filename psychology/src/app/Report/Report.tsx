import React, { useEffect, useState } from "react";
import PFStatistics from '../Test/PFTest/PFStatistics/PFStatistics'
import IQStatistics from '../Test/IQTest/IQStatistics/IQStatistics'
import CFStatistics from "../Test/CFTest/CFStatistics/CFStatistics";
import styles from './report.module.scss'
import backendUrl from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface IQTests {
  _id: string;
  testID: string;
  nameOfTest: string;
  numOfQuestions: number;
}

interface CFTests {
  _id: string;
  testID: string;
  nameOfTest: string;
  numOfQuestions: number;
}

interface Test {
  _id: string;
  testID: string;
  nameofTest: string;
  numOfQuestions: number;
}


const Report = () => {
  const [pfTest, setPfTest] = useState<Test[]>([]);
  const [iqTests, setIqTests] = useState<IQTests[]>([]);
  const [cfTests, setCfTests] = useState<CFTests[]>([]);
  const [users, setUsers] = useState([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const fetchPFTest = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/16pf`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data: Test[] = await response.json();
        setPfTest(data);
    } catch (error) {
      console.error("Error fetching surveys", error);
    }
};

useEffect(() => {
  fetchPFTest();
}, []);

const fetchIQTest = async () => {
  try {
      const response = await fetch(`${backendUrl}/api/IQtest`);
      if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data: IQTests[] = await response.json();
      setIqTests(data);
  } catch (error) {
    console.error("Error fetching surveys", error);
  }
};

// useEffect hook to fetch data on component mount
useEffect(() => {
  fetchIQTest();
}, []);

const fetchCFTest = async () => {
  try {
      const response = await fetch(`${backendUrl}/api/CFtest`);
      if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data: CFTests[] = await response.json();
      setCfTests(data);
  } catch (error) {
    console.error("Error fetching surveys", error);
  }
};

// useEffect hook to fetch data on component mount
useEffect(() => {
  fetchCFTest();
}, []);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {          // Fetch surveys from the API
        const response = await axios.get(`${backendUrl}/api/surveys`);
        setSurveys(response.data);
      } catch (error) {
        console.error("Error fetching surveys", error);
      }
    };
    fetchSurveys();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/allusers/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    
    <div className={styles.mainContainer}>
      <h1 className={styles.reportHeader}>Admin Dashboard</h1>
    <div className={styles.dashboardRow}>
      <div className={styles.allTest}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Test Name</th>
                            <th className={styles.th}>Number of Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pfTest.map(test => (
                            <tr key={test._id}>
                                <td className={styles.td}>{test.nameofTest}</td>
                                <td className={styles.td}>{test.numOfQuestions}</td>
                                <td className={styles.td}><button className={styles.seeButton} onClick={() => navigate("/pftest")}> See PF Test</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tbody>
                        {iqTests.map(test => (
                            <tr key={test._id}>
                                <td className={styles.td}> Raven's Standard Progressive Matrices</td>
                                <td className={styles.td}>{test.numOfQuestions}</td>
                                <td className={styles.td}><button className={styles.seeButton} onClick={() => navigate("/iqtest")}> See IQ Test</button>
                                </td>
                      </tr>     
                        ))}
                    </tbody>
                    <tbody>
                        {cfTests.map(test => (
                            <tr key={test._id}>
                                <td className={styles.td}> Measuring Intelligence with the Culture Fair Test</td>
                                <td className={styles.td}>{test.numOfQuestions}</td>
                                <td className={styles.td}><button className={styles.seeButton} onClick={() => navigate("/cftest")}> See CF Test</button>
                                </td>
                      </tr>     
                        ))}
                    </tbody>

                </table>

        </div>
        <div className={styles.surveyCount}>
            <p>Total Surveys: <br/> <span className={styles.count}>{surveys.length} </span> <br/>
            <button className={styles.seeButton} onClick={() => navigate("/surveyDashboard")}> See Surveys</button>
            </p>
        </div>
        <div className={styles.userCount}>
            <p>Total Users: <br/> <span className={styles.count}>{users.length}</span> <br/>
            <button className={styles.seeButton} onClick={() => navigate("/user")}> See Users</button>
            </p>
        </div>
    </div>

<div className={styles.reportContainer}>
      <section className={styles.resultSectionPF}>
        <PFStatistics /> 
      </section>
      <section className={styles.resultSectionIQ}>
        <IQStatistics /> 
      </section>
      <section className={styles.resultSectionCF}>
        <CFStatistics /> 
      </section>

    </div>
    </div>
  )
}

export default Report