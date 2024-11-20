import React, { useState } from "react";
import axios from "axios";
import styles from "./survey.module.scss";
import { useNavigate } from 'react-router-dom';

const SurveyForm: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<
    {
      sectionTitle: string;
      questions: { questionText: string; choices: string[] }[];
    }[]
  >([{ sectionTitle: "", questions: [{ questionText: "", choices: [""] }] }]);

  const handleAddSection = () => {
    setSections([
      ...sections,
      { sectionTitle: "", questions: [{ questionText: "", choices: [""] }] },
    ]);
  };

  const handleAddQuestion = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.push({
      questionText: "",
      choices: [""],
    });
    setSections(newSections);
  };

  const handleDeleteSection = (sectionIndex: number) => {
    const newSections = sections.filter((_, index) => index !== sectionIndex);
    setSections(newSections);
  };

  const handleAddChoice = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].choices.push("");
    setSections(newSections);
  };
  const handleDeleteQuestion = (
    sectionIndex: number,
    questionIndex: number
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.splice(questionIndex, 1);
    setSections(newSections);
  };

  const handleDeleteChoice = (
    sectionIndex: number,
    questionIndex: number,
    choiceIndex: number
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].choices.splice(
      choiceIndex,
      1
    );
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const surveyData = { title, description, sections };
    try {
      await axios.post("http://localhost:5000/api/surveys/create", surveyData);
      alert("Survey created successfully");
      navigate("/surveyDashboard");
    } catch (error) {
      console.error("Error creating survey:", error);
      alert("Error creating survey");
    }
  };

  const handleChangeSectionTitle = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index].sectionTitle = value;
    setSections(newSections);
  };

  const handleChangeQuestion = (
    sectionIndex: number,
    questionIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].questionText = value;
    setSections(newSections);
  };

  const handleChangeChoice = (
    sectionIndex: number,
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].choices[choiceIndex] =
      value;
    setSections(newSections);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
    <h2>Create Survey</h2>
    <input
      type="text"
      placeholder="Survey Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
    />
    <textarea
      placeholder="Survey Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
    />
    {sections.map((section, sIndex) => (
      <div key={sIndex} className={styles.sectionContainer}>
        <input
          type="text"
          placeholder={`Section Title ${sIndex + 1}`}
          value={section.sectionTitle}
          onChange={(e) => handleChangeSectionTitle(sIndex, e.target.value)}
          className={styles.sectionTitle}
          required
        />
        <button
          type="button"
          className={styles.addSectionButton}
          onClick={handleAddSection}
        >
          Add Section
        </button>
        <button
          type="button"
          className={styles.deleteSectionButton}
          onClick={() => handleDeleteSection(sIndex)}
        >
          Delete Section
        </button>
        {section.questions.map((q, qIndex) => (
          <div key={qIndex} className={styles.questionContainer}>
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.questionText}
              onChange={(e) =>
                handleChangeQuestion(sIndex, qIndex, e.target.value)
              }
              required
            />
            <button
              type="button"
              className={styles.addQuestionButton}
              onClick={() => handleAddQuestion(sIndex)}
            >
              Add Question
            </button>
            <button
              type="button"
              className={styles.deleteQuestionButton}
              onClick={() => handleDeleteQuestion(sIndex, qIndex)}
            >
              Delete Question
            </button>
            {q.choices.map((choice, cIndex) => (
              <div key={cIndex} className={styles.choicesContainer}>
                <input
                  type="text"
                  placeholder={`Choice ${cIndex + 1}`}
                  value={choice}
                  onChange={(e) =>
                    handleChangeChoice(sIndex, qIndex, cIndex, e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className={styles.addChoiceButton}
                  onClick={() => handleAddChoice(sIndex, qIndex)}
                >
                  Add Choice
                </button>
                <button
                  type="button"
                  className={styles.deleteChoiceButton}
                  onClick={() => handleDeleteChoice(sIndex, qIndex, cIndex)}
                >
                  Delete Choice
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    ))}
    <div className={styles.formActions}>
      <button type="submit" className={styles.createSurveyButton}>
        Create Survey
      </button>
    </div>
  </form>
  
 
  );
};

export default SurveyForm;