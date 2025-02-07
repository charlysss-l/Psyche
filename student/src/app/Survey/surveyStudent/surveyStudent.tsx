import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./surveyStudent.module.scss"; // Assuming you're using a CSS module for styling
import ArchivedSurveys from "../archivedSurveys/ArchivedSurveys";
import backendUrl from "../../../config";
//handles the survey listing and submission process for the students.

interface Survey {
  _id: string;
  title: string;
  description: string;
  releaseDate: string;
  category: string;
  status: string;
  filters: { field: string; options: string }[];
}

const SurveyAnswerForm: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]); // Current filtered surveys
  const [allSurveys, setAllSurveys] = useState<Survey[]>([]); // Full list of surveys (without filtering)
  const [answeredSurveys, setAnsweredSurveys] = useState<string[]>([]); // List of answered survey IDs
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const surveysPerPage = 5;
  const [isArchivedListVisible, setIsArchivedListVisible] = useState(false);
  const toggleArchivedList = () => {
    setIsArchivedListVisible(!isArchivedListVisible);
  };

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/surveys`);
        console.log("All Surveys:", response.data);
        setAllSurveys(response.data); // Set all surveys
        setSurveys(response.data); // Set surveys to all surveys initially

        // Using reduce to get unique categories
        const uniqueCategories = [
          "All",
          ...response.data.reduce((acc: string[], survey: Survey) => {
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

    const fetchAnsweredSurveys = async () => {
      const userId = localStorage.getItem("userId"); // Get user ID (you might use a different method)
      if (!userId) return;

      try {
        const response = await axios.get(
          `${backendUrl}/api/response/archived-surveys/${userId}`
        );
        const answeredSurveyIds = response.data.map(
          (survey: any) => survey.surveyId
        );
        setAnsweredSurveys(answeredSurveyIds);
      } catch (error) {
        console.error("Error fetching answered surveys", error);
      }
    };

    fetchSurveys();
    fetchAnsweredSurveys();
  }, []);

  // Get today's date in YYYY-MM-DD format (ignoring time)
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Function to remove time from releaseDate and compare only dates (ignores time part)
  const getDateWithoutTime = (date: string) => {
    const releaseDate = new Date(date);
    return releaseDate.toISOString().split("T")[0]; // Returns only the date part in YYYY-MM-DD
  };

  // Filter surveys to show only those released today or in the past and with status "ongoing"
const filteredSurveys = surveys.filter(
  (survey) => getDateWithoutTime(survey.releaseDate) <= todayString && survey.status === "ongoing"
);


  // Remove answered surveys from the list
  const unansweredSurveys = filteredSurveys.filter(
    (survey) => !answeredSurveys.includes(survey._id)
  );

  // Format release date to a more readable format (e.g., "November 26, 2024")
  const formatReleaseDate = (date: string) => {
    const releaseDate = new Date(date);
    return releaseDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Pagination Logic
  const indexOfLastSurvey = currentPage * surveysPerPage;
  const indexOfFirstSurvey = indexOfLastSurvey - surveysPerPage;
  const currentSurveys = unansweredSurveys.slice(
    indexOfFirstSurvey,
    indexOfLastSurvey
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    if (category === "All") {
      // Reset surveys to the full list when "All" is selected
      setSurveys(allSurveys);
    } else {
      // Filter surveys based on the selected category
      const filteredByCategory = allSurveys.filter(
        (survey) => survey.category === category
      );
      setSurveys(filteredByCategory);
    }
  };

  return (
    <div className={styles.surveyListContainer}>
      <h2>Available Surveys </h2>
      <span className={styles.surveyCount}>
        ({unansweredSurveys.length} surveys)
      </span>

      <div className={styles.filterContainer}>
        {/* Filter by Category */}
        <label htmlFor="category">Filter by Category:</label>
        <select id="category" onChange={handleCategoryChange}>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <button
        className={
          isArchivedListVisible ? styles.closeButton : styles.archiveButton
        }
        onClick={toggleArchivedList}
      >
        {isArchivedListVisible ? "Close" : "Archive List"}
      </button>

      {isArchivedListVisible && <ArchivedSurveys />}

      {currentSurveys.length === 0 ? (
        <p>No surveys available</p>
      ) : (
        currentSurveys.map((survey) => {
          return (
            <div key={survey._id} className={styles.surveyCard}>
              <h3>{survey.title}</h3>
              <p>Description: {survey.description}</p>
              <p>Category: {survey.category}</p>
              <div className={styles.filters}>
                <div className={styles.linkContainer}>
                  <h4>Participant Filters:</h4>
                  <div
                    className={styles.surveyLink}
                    onClick={() => {
                      const currentUrl = `${window.location.origin}/survey-details/${survey._id}`;
                      navigator.clipboard
                        .writeText(currentUrl)
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
                    {survey.filters.map((filter, index) => (
                      <tr key={index}>
                        <td>{filter.field}</td>
                        <td>{filter.options}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.surveyActions}>
                {/* Always show "View Details" regardless of whether answered or not */}
                <Link
                  to={`/survey-details/${survey._id}`}
                  className={styles.answerSurveyButton}
                >
                  Answer Survey
                </Link>
              </div>
            </div>
          );
        })
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastSurvey >= unansweredSurveys.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SurveyAnswerForm;
