import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./surveyList.module.scss"; // SCSS module for styling
import { Link } from "react-router-dom";
import backendUrl from "../../../config";
import surveyLinkUrl from "../../../surveyConfig";
import CompletedSurveysModal from "../surveyList/surveyListCompleted";

// SurveyList component to display a list of available surveys
const SurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showCompletedModal, setShowCompletedModal] = useState<boolean>(false);
  const surveysPerPage = 5;

  // useEffect hook to fetch surveys and categories on component mount
useEffect(() => {
  const fetchSurveys = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/surveys`);
      const ongoingSurveys = response.data.filter((survey: any) => survey.status === "ongoing");
      setSurveys(response.data);
      setFilteredSurveys(ongoingSurveys);

      const uniqueCategories = [
        "All",
        ...response.data.reduce((acc: string[], survey: any) => {
          if (!acc.includes(survey.category)) {
            acc.push(survey.category);
          }
          return acc;
        }, []),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching surveys", error);
    }
  };
  fetchSurveys();
}, []);

const completedSurveys = surveys.filter((survey) => survey.status === "completed");


  // Calculate the indexes for pagination based on current page
  const indexOfLastSurvey = currentPage * surveysPerPage;
  const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage;
  const currentSurveys = filteredSurveys.slice(
    indexOfFirstSurvey,
    indexOfLastSurvey
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Function to format the date
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Handler for removing a survey
  const handleCompleteSurvey = async (surveyId: string) => {
    if (window.confirm("Are you sure you want to conclude this survey?")) {
      try {
        await axios.put(`${backendUrl}/api/surveys/complete/${surveyId}`);
      
        alert("Survey concluded successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error concluding survey", error);
        alert("Failed to conclude the survey.");
      }
    }
  };

  // Handle category filtering
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "All") {
      setFilteredSurveys(surveys);
    } else {
      const filtered = surveys.filter(
        (survey) => survey.category === selectedCategory
      );
      setFilteredSurveys(filtered);
    }
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  return (
    <div className={styles.surveyListContainer}>
      <h2 className={styles.surveyAvailable}>Available Surveys </h2>
      <span className={styles.surveyCount}>
        ({filteredSurveys.length} surveys)
      </span>
      <div className={styles.linkSurveyChoices}>
        <Link to="/survey-form" className={styles.createsurveyButton}>
          Create Survey
        </Link>
        
      </div>

      {/* Filter Dropdown */}
      <div className={styles.filterContainer}>
        <label htmlFor="category">Filter by Category:</label>
        <select id="category" onChange={handleCategoryChange}>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.completedContainer}>
      <button onClick={() => setShowCompletedModal(true)} className={styles.viewCompletedButton}>
          View Completed Surveys
        </button>
      </div>
      {/* Display Surveys with Title, Description, Field, and Options */}
      {currentSurveys.map((survey) => (
        <div key={survey._id} className={styles.surveyCard}>
          <h3 className={styles.surveytitle}>{survey.title}</h3>
          <p>Description: {survey.description}</p>
          <p>Category: {survey.category}</p>
          <p>Release Date: {formatDate(survey.releaseDate)}</p>
          <div className={styles.filters}>
            <div className={styles.linkContainer}>
              <h4>Participant Filters:</h4>
              <div
                className={styles.surveyLink}
                onClick={() => {
                  const linkText = `${surveyLinkUrl}/survey-details/${survey._id}`;
                  navigator.clipboard
                    .writeText(linkText)
                    .then(() => {
                      alert("Link copied to clipboard!");
                    })
                    .catch((err) => {
                      console.error("Failed to copy: ", err);
                    });
                }}
              >
                <p className={styles.copyLinkText}>Copy Link</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {survey.filters.map(
                  (
                    filter: { field: string; options: string },
                    index: number
                  ) => (
                    <tr key={index}>
                      <td>{filter.field}</td>
                      <td>{filter.options}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.surveyActions}>
            <Link
              to={`/survey-details/${survey._id}`}
              className={styles.viewDetailsButton}
            >
              View Details
            </Link>
            <button
              onClick={() => handleCompleteSurvey(survey._id)}
              className={styles.completeButton}
            >
              Complete
            </button>
            <Link
              to={`/survey-responses/${survey._id}`}
              className={styles.viewDetailsButton}
            >
              Responses List
            </Link>
          </div>
        </div>
      ))}

      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastSurvey >= filteredSurveys.length}
        >
          Next
        </button>
      </div>

      {showCompletedModal && (
        <CompletedSurveysModal
          completedSurveys={completedSurveys}
          onClose={() => setShowCompletedModal(false)}
        />
      )}
    </div>
  );
};

export default SurveyList;
