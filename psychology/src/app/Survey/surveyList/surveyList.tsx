import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./surveyList.module.scss"; // SCSS module for styling
import { Link } from "react-router-dom";
import backendUrl from "../../../config";
import surveyLinkUrl from "../../../surveyConfig";

// SurveyList component to display a list of available surveys
const SurveyList: React.FC = () => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const surveysPerPage = 5;
  // useEffect hook to fetch surveys and categories on component mount
  useEffect(() => {
    const fetchSurveys = async () => {
      try {          // Fetch surveys from the API
        const response = await axios.get(`${backendUrl}/api/surveys`);
        setSurveys(response.data);
        setFilteredSurveys(response.data);

        // Extract unique categories from surveys for filter options
        const uniqueCategories = [
          "All", 
          ...response.data.reduce((acc: string[], survey: any) => {
            if (!acc.includes(survey.category)) {
              acc.push(survey.category);
            }
            return acc;
          }, []),
        ];
        setCategories(uniqueCategories); // Set the unique categories for the dropdown
      } catch (error) {
        console.error("Error fetching surveys", error);
      }
    };
    fetchSurveys();
  }, []);
  // Calculate the indexes for pagination based on current page
  const indexOfLastSurvey = currentPage * surveysPerPage;
  const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage;
  const currentSurveys = filteredSurveys.slice(indexOfFirstSurvey, indexOfLastSurvey);

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
  const handleRemoveSurvey = async (surveyId: string) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      try {
        await axios.delete(`${backendUrl}/api/surveys/${surveyId}`);
        // Update the state to remove the deleted survey
        setSurveys((prevSurveys) => prevSurveys.filter((s) => s._id !== surveyId));
        setFilteredSurveys((prevSurveys) => prevSurveys.filter((s) => s._id !== surveyId)); // Update filtered surveys
        alert("Survey removed successfully!");
      } catch (error) {
        console.error("Error deleting survey", error);
        alert("Failed to delete the survey.");
      }
    }
  };

  // Handle category filtering
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "All") {
      setFilteredSurveys(surveys);
    } else {
      const filtered = surveys.filter((survey) => survey.category === selectedCategory);
      setFilteredSurveys(filtered);
    }
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  return (
    <div className={styles.surveyListContainer}>
      <div className={styles.linkSurveyChoices}>
        <Link to="/survey-form" className={styles.createsurveyButton}>
          Create Survey
        </Link>
      </div>

      <h2>
        Available Surveys{" "}
        <span className={styles.surveyCount}>({filteredSurveys.length} surveys)</span>
      </h2>

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

      {/* Display Surveys with Title, Description, Field, and Options */}
      {currentSurveys.map((survey) => (
        <div key={survey._id} className={styles.surveyCard}>
          <h3 className ={styles.surveytitle}>{survey.title}</h3>
          <p>Description: {survey.description}</p>
          <p>Category: {survey.category}</p>
          <p>Release Date: {formatDate(survey.releaseDate)}</p>
          <div className={styles.filters}>
            <h4>Participant Filters:</h4>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {survey.filters.map((filter: { field: string; options: string }, index: number) => (
                  <tr key={index}>
                    <td>{filter.field}</td>
                    <td>{filter.options}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div 
              className={styles.surveyLink} 
              onClick={() => {
                const linkText = `${surveyLinkUrl}/survey-details/${survey._id}`;
                navigator.clipboard.writeText(linkText).then(() => {
                  alert("Link copied to clipboard!");
                }).catch((err) => {
                  console.error("Failed to copy: ", err);
                });
              }}
            >
              <p>Click the Survey Link to Copy:</p>  {backendUrl}/survey-details/{survey._id}
            </div>

          </div>
          <div className={styles.surveyActions}>
            <Link
              to={`/survey-details/${survey._id}`}
              className={styles.viewDetailsButton}
            >
              View Details
            </Link>
            <button
              onClick={() => handleRemoveSurvey(survey._id)}
              className={styles.removeButton}
            >
              Remove
            </button>
            <Link to={`/survey-responses/${survey._id}`} className={styles.viewDetailsButton}>
              Responses List
            </Link>
          </div>
        </div>
      ))}

      <div className={styles.pagination}>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastSurvey >= filteredSurveys.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SurveyList;
