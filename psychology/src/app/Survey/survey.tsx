import React, { useState } from 'react';
import axios from 'axios';
import styles from './survey.module.scss';  // Import SCSS styles

const SurveyForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // New state for description
  const [questions, setQuestions] = useState<{ questionText: string; choices: string[] }[]>([
    { questionText: '', choices: [''] },
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', choices: [''] }]);
  };

  const handleAddChoice = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].choices.push('');
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1); // Remove the question at the specified index
    setQuestions(newQuestions);
  };

  const handleDeleteChoice = (questionIndex: number, choiceIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices.splice(choiceIndex, 1); // Remove the choice
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const surveyData = { title, description, questions }; // Include description in survey data
    try {
      await axios.post('http://localhost:5000/api/surveys/create', surveyData);
      alert('Survey created successfully');
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('Error creating survey');
    }
  };

  const handleChangeQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleChangeChoice = (questionIndex: number, choiceIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[choiceIndex] = value;
    setQuestions(newQuestions);
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
        onChange={(e) => setDescription(e.target.value)} // Handle description change
        required
      />
      {questions.map((q, qIndex) => (
        <div key={qIndex} className={styles.questionContainer}>
          <input
            type="text"
            placeholder={`Question ${qIndex + 1}`}
            value={q.questionText}
            onChange={(e) => handleChangeQuestion(qIndex, e.target.value)}
            required
          />
          {q.choices.map((choice, cIndex) => (
            <div key={cIndex} className={styles.choicesContainer}>
              <input
                type="text"
                placeholder={`Choice ${cIndex + 1}`}
                value={choice}
                onChange={(e) => handleChangeChoice(qIndex, cIndex, e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => handleDeleteChoice(qIndex, cIndex)}
              >
                Delete Choice
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddChoice(qIndex)}>Add Choice</button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => handleDeleteQuestion(qIndex)}
          >
            Delete Question
          </button>
        </div>
      ))}
      <div className={styles.formActions}>
        <button type="button" onClick={handleAddQuestion}>
          Add Question
        </button>
        <button type="submit" className={styles.createSurveyButton}>Create Survey</button>
      </div>
    </form>
  );
};

export default SurveyForm;
