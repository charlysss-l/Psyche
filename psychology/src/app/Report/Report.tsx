import React, { useEffect, useState } from "react";
import PFStatistics from '../Test/PFTest/PFStatistics/PFStatistics';
import IQStatistics from '../Test/IQTest/IQStatistics/IQStatistics';
import CFStatistics from "../Test/CFTest/CFStatistics/CFStatistics";
import styles from './report.module.scss';
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

  useEffect(() => {
    const fetchPFTest = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/16pf`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data: Test[] = await response.json();
        setPfTest(data);
      } catch (error) {
        console.error("Error fetching PF tests", error);
      }
    };
    fetchPFTest();
  }, []);

  useEffect(() => {
    const fetchIQTest = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/IQtest`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data: IQTests[] = await response.json();
        setIqTests(data);
      } catch (error) {
        console.error("Error fetching IQ tests", error);
      }
    };
    fetchIQTest();
  }, []);

  useEffect(() => {
    const fetchCFTest = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/CFtest`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data: CFTests[] = await response.json();
        setCfTests(data);
      } catch (error) {
        console.error("Error fetching CF tests", error);
      }
    };
    fetchCFTest();
  }, []);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
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
      <h1 className={styles.reportHeader}>Report Dashboard</h1>

      <div className={styles.dashboardRow}>
        <section className={styles.allTest}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Number of Questions</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pfTest.map(test => (
                <tr key={test._id}>
                  <td>{test.nameofTest}</td>
                  <td>{test.numOfQuestions}</td>
                  <td>
                    <button onClick={() => navigate("/pftest")} className={styles.seeButton}>See PF Test</button>
                  </td>
                </tr>
              ))}
              {iqTests.map(test => (
                <tr key={test._id}>
                  <td>Raven's Standard Progressive Matrices</td>
                  <td>{test.numOfQuestions}</td>
                  <td>
                    <button onClick={() => navigate("/iqtest")} className={styles.seeButton}>See IQ Test</button>
                  </td>
                </tr>
              ))}
              {cfTests.map(test => (
                <tr key={test._id}>
                  <td>Measuring Intelligence with the Culture Fair Test</td>
                  <td>{test.numOfQuestions}</td>
                  <td>
                    <button onClick={() => navigate("/cftest")} className={styles.seeButton}>See CF Test</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.infoBox}>
          <p>Total Surveys</p>
          <span className={styles.count}>{surveys.length}</span>
          <button className={styles.seeButton} onClick={() => navigate("/surveyDashboard")}>See Surveys</button>
        </section>

        <section className={styles.infoBox}>
          <p>Total Users</p>
          <span className={styles.count}>{users.length}</span>
          <button className={styles.seeButton} onClick={() => navigate("/user")}>See Users</button>
        </section>
      </div>

      <div className={styles.reportContainer}>
        <section className={styles.resultSection}>
          <PFStatistics />
        </section>
        <section className={styles.resultSection}>
          <IQStatistics />
        </section>
        <section className={styles.resultSection}>
          <CFStatistics />
        </section>
      </div>
    </div>
  );
};

export default Report;
