import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./survey.module.scss";
import backendUrl from "../../../config";

const SurveyForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [releaseDate, setreleaseDate] = useState("");
  const [filters, setFilters] = useState([{ field: "", options: "" }]);
  const [sections, setSections] = useState([
    {
      sectionTitle: "",
      questions: [{ questionText: "", choices: [""] }],
    },
  ]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const handleChangeSectionTitle = (sIndex: number, value: string) => {
    const newSections = [...sections];
    newSections[sIndex].sectionTitle = value;
    setSections(newSections);
  };

  const handleChangeQuestionText = (
    sIndex: number,
    qIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sIndex].questions[qIndex].questionText = value;
    setSections(newSections);
  };

  const handleChangeChoices = (
    sIndex: number,
    qIndex: number,
    cIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sIndex].questions[qIndex].choices[cIndex] = value;
    setSections(newSections);
  };

  const handleAddChoice = (sIndex: number, qIndex: number) => {
    const newSections = [...sections];
    newSections[sIndex].questions[qIndex].choices.push("");
    setSections(newSections);
  };

  const handleDeleteChoice = (
    sIndex: number,
    qIndex: number,
    cIndex: number
  ) => {
    const newSections = [...sections];
    newSections[sIndex].questions[qIndex].choices.splice(cIndex, 1);
    setSections(newSections);
  };

  const handleAddQuestion = (p0: number) => {
    const newSections = [...sections];
    newSections[currentSectionIndex].questions.push({
      questionText: "",
      choices: [""],
    });
    setSections(newSections);
  };

  const handleDeleteQuestion = (sIndex: number, qIndex: number) => {
    const newSections = [...sections];
    newSections[sIndex].questions.splice(qIndex, 1);
    setSections(newSections);
  };

  const handleAddSection = () => {
    const newSections = [
      ...sections,
      { sectionTitle: "", questions: [{ questionText: "", choices: [""] }] },
    ];
    setSections(newSections);
    setCurrentSectionIndex(newSections.length - 1); // Set the new section as the selected one
  };

  const handleDeleteSection = (sIndex: number) => {
    const newSections = [...sections];
    newSections.splice(sIndex, 1);
    setSections(newSections);
    setCurrentSectionIndex(Math.max(0, sIndex - 1)); // Update selected section index
  };

  const handleDeleteFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const surveyData = {
      title,
      description,
      category,
      releaseDate,
      filters,
      sections,
    };

    try {
      const response = await fetch(`${backendUrl}/api/surveys/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Survey created successfully", result);

      navigate("/surveyDashboard");
    } catch (error) {
      console.error("Error creating survey:", error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.titleGroup}>
            <h2 className={styles.survTitleh2}>Create Survey</h2>
            <div className={styles.formGroup}>
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.surInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.surTextArea}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.input}
                placeholder="Psychology, Health, Mental Health, etc... or others."
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Release date:</label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setreleaseDate(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>

          {filters.length > 0 && (
            <div className={styles.filterGroup}>
              <div className={styles.filters}>
                <h3>Participants Filters</h3>
                <h4>(Remove filters if not needed)</h4>
                {filters.map((filter, index) => (
                  <div key={index} className={styles.filterInput}>
                    <input
                      type="text"
                      placeholder="Field: age, sex, ethnicity, etc..."
                      value={filter.field}
                      onChange={(e) => {
                        const newFilters = [...filters];
                        newFilters[index].field = e.target.value;
                        setFilters(newFilters);
                      }}
                      className={styles.input}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Options (comma-separated)"
                      value={filter.options}
                      onChange={(e) => {
                        const newFilters = [...filters];
                        newFilters[index].options = e.target.value;
                        setFilters(newFilters);
                      }}
                      className={styles.input}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFilter(index)}
                      className={styles.removeFilterBtn}
                    >
                      Remove Filter
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.sectionGroup}>
            <div className={styles.sections}>
              {sections.map((section, sIndex) => (
                <div
                  key={sIndex}
                  className={`${styles.section} ${
                    currentSectionIndex === sIndex ? styles.activeSection : ""
                  }`}
                  onClick={() => setCurrentSectionIndex(sIndex)}
                >
                  <h3>Section</h3>
                  <div className={styles.formGroup}>
                    <label>Section Title:</label>
                    <input
                      type="text"
                      value={section.sectionTitle}
                      onChange={(e) =>
                        handleChangeSectionTitle(sIndex, e.target.value)
                      }
                      className={styles.input}
                      required
                    />
                  </div>

                  {section.questions.map((question, qIndex) => (
                    <div key={qIndex} className={styles.question}>
                      <div className={styles.formGroup}>
                        <label>Question Text:</label>
                        <input
                          type="text"
                          value={question.questionText}
                          onChange={(e) =>
                            handleChangeQuestionText(
                              sIndex,
                              qIndex,
                              e.target.value
                            )
                          }
                          className={styles.input}
                          required
                        />
                      </div>

                      <div className={styles.choices}>
                        <label>Choices:</label>
                        {question.choices.map((choice, cIndex) => (
                          <div key={cIndex} className={styles.choice}>
                            <input
                              type="text"
                              placeholder="Choice"
                              value={choice}
                              onChange={(e) =>
                                handleChangeChoices(
                                  sIndex,
                                  qIndex,
                                  cIndex,
                                  e.target.value
                                )
                              }
                              className={styles.input}
                            />
                            {question.choices.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteChoice(sIndex, qIndex, cIndex)
                                }
                                className={styles.addChoiceBtn}
                              >
                                Remove Choice
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddChoice(sIndex, qIndex)}
                          className={styles.addChoiceBtn}
                        >
                          Add Choice
                        </button>
                      </div>

                      {section.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(sIndex, qIndex)}
                          className={styles.removeQuestionBtn}
                        >
                          Remove Question
                        </button>
                      )}
                    </div>
                  ))}
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(sIndex)}
                      className={styles.removeSectionBtn}
                    >
                      Remove Section
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" className={styles.submitBtn}>
              Submit Survey
            </button>
          </div>
        </form>

        {/* control Panel */}
        <div className={styles.controlContainer}>
          <h3>Controls</h3>
          <button
            type="button"
            onClick={() => setFilters([...filters, { field: "", options: "" }])}
            className={styles.addFilterBtn}
          >
            Add Filter
          </button>
          <button
            type="button"
            onClick={() => handleAddQuestion(sections.length - 1)}
            className={styles.addQuestionBtn}
          >
            Add Question
          </button>
          <button
            type="button"
            onClick={handleAddSection}
            className={styles.addSectionBtn}
          >
            Add Section
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
