import React, { useEffect, useState } from 'react';
import style from './pftest.module.scss';
import { Link } from 'react-router-dom';
import backendUrl from '../../../config';

interface Choice {
  a: string;
  b: string;
  c: string;
}

interface ChoiceEquivalentScore {
  a: number;
  b: number;
  c: number;
}

interface Question {
  questionID: string;
  questionNum: number;
  questionText: string;
  choices: Choice;
  choiceEquivalentScore: ChoiceEquivalentScore;
  factorLetter: string;
}

interface Test {
  _id: string;
  testID: string;
  nameofTest: string;
  numOfQuestions: number;
  question: Question[];
}

const PFTest: React.FC = () => {
  const [pfTest, setPfTest] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newChoices, setNewChoices] = useState<Choice>({ a: '', b: '', c: '' });
  const [newChoiceEquivalentScore, setNewChoiceEquivalentScore] = useState<ChoiceEquivalentScore>({ a: 0, b: 0, c: 0 });

  const resultsPerPage = 5;

  const [filterFactorLetter, setFilterFactorLetter] = useState('');
  const [filterQuestionNum, setFilterQuestionNum] = useState<string>(''); // string to allow empty input

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterFactorLetter, filterQuestionNum]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/16pf`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data: Test[] = await response.json();
      setPfTest(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (question: Question) => {
    setEditQuestion(question);
    setNewQuestionText(question.questionText);
    setNewChoices(question.choices);
    setNewChoiceEquivalentScore(question.choiceEquivalentScore);
  };

  const handleUpdateQuestion = async () => {
    if (!editQuestion) return;

    const { questionID, questionNum, factorLetter } = editQuestion;

    const updatedQuestion = {
      questionNum,
      factorLetter,
      questionText: newQuestionText,
      choices: newChoices,
      choiceEquivalentScore: newChoiceEquivalentScore,
    };

    try {
      const response = await fetch(`${backendUrl}/api/16pf/67282807d9bdba831a7e9063/question/${questionID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuestion),
      });

      if (!response.ok) {
        throw new Error(`Failed to update question: ${response.statusText}`);
      }

      const updatedTest = await response.json();

      setPfTest((prevTests) =>
        prevTests.map((test) => (test._id === updatedTest._id ? updatedTest : test))
      );
      setEditQuestion(null);
      alert('Question updated successfully');
    } catch {
      setError('Error updating question');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const allQuestions = pfTest.flatMap((test) => test.question);

  // Filter questions by factorLetter and questionNum (if provided)
  const filteredQuestions = allQuestions.filter((q) => {
    const matchesFactor = q.factorLetter.toLowerCase().includes(filterFactorLetter.toLowerCase());
    const matchesNum = filterQuestionNum === '' || q.questionNum === Number(filterQuestionNum);
    return matchesFactor && matchesNum;
  });

  const totalPages = Math.ceil(filteredQuestions.length / resultsPerPage);

  // Ensure currentPage is never out of range
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  const currentQuestions = filteredQuestions.slice(
    (safeCurrentPage - 1) * resultsPerPage,
    safeCurrentPage * resultsPerPage
  );

  return (
    <div className={style.maincontainer}>
      <table className={style.table}>
        <thead>
          <tr>
            <th className={style.th}>Test Name</th>
            <th className={style.th}>Num of Questions</th>
          </tr>
        </thead>
        <tbody>
          {pfTest.map((test) => (
            <tr key={test._id}>
              <td className={style.td}>{test.nameofTest}</td>
              <td className={style.td}>{test.numOfQuestions}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={style.inkPFTestList}>
        <Link to="/all-pf-test-list" className={style.testResultsLink}>
          Test Results
        </Link>
      </div>

      <h2>Questions</h2>

      <div
        style={{
          width: '90%',
          margin: '10px auto 20px auto',
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Filter by Factor Letter"
          value={filterFactorLetter}
          onChange={(e) => setFilterFactorLetter(e.target.value)}
          style={{ padding: '6px', width: '200px' }}
        />
        <input
          type="number"
          placeholder="Filter by Question Number"
          value={filterQuestionNum}
          onChange={(e) => setFilterQuestionNum(e.target.value)}
          style={{ padding: '6px', width: '200px' }}
          min={1}
        />
      </div>

      <table className={style.table}>
        <thead>
          <tr>
            <th className={style.th}>Factor Letter</th>
            <th className={style.th}>Question Number</th>
            <th className={style.th}>Question Text</th>
            <th className={style.th}>Choices</th>
            <th className={style.th}>Equivalent Score</th>
            <th className={style.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentQuestions.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>
                No questions found.
              </td>
            </tr>
          ) : (
            currentQuestions.map((q) => (
              <tr key={q.questionID}>
                <td className={style.td}>{q.factorLetter}</td>
                <td className={style.td}>{q.questionNum}</td>
                <td className={style.td}>{q.questionText}</td>
                <td className={style.td}>
                  A: {q.choices.a}
                  <br />
                  B: {q.choices.b}
                  <br />
                  C: {q.choices.c}
                </td>
                <td className={style.td}>
                  A: {q.choiceEquivalentScore.a}
                  <br />
                  B: {q.choiceEquivalentScore.b}
                  <br />
                  C: {q.choiceEquivalentScore.c}
                </td>
                <td className={style.td}>
                  <button className={style.editPF} onClick={() => handleEditClick(q)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editQuestion && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Edit Question</h3>
            <label>
              Question Text:
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
            </label>
            <label>
              A:
              <input
                type="text"
                value={newChoices.a}
                onChange={(e) => setNewChoices({ ...newChoices, a: e.target.value })}
              />
            </label>
            <label>
              B:
              <input
                type="text"
                value={newChoices.b}
                onChange={(e) => setNewChoices({ ...newChoices, b: e.target.value })}
              />
            </label>
            <label>
              C:
              <input
                type="text"
                value={newChoices.c}
                onChange={(e) => setNewChoices({ ...newChoices, c: e.target.value })}
              />
            </label>
            <label>
              A Score:
              <input
                type="number"
                value={newChoiceEquivalentScore.a}
                onChange={(e) =>
                  setNewChoiceEquivalentScore({ ...newChoiceEquivalentScore, a: +e.target.value })
                }
              />
            </label>
            <label>
              B Score:
              <input
                type="number"
                value={newChoiceEquivalentScore.b}
                onChange={(e) =>
                  setNewChoiceEquivalentScore({ ...newChoiceEquivalentScore, b: +e.target.value })
                }
              />
            </label>
            <label>
              C Score:
              <input
                type="number"
                value={newChoiceEquivalentScore.c}
                onChange={(e) =>
                  setNewChoiceEquivalentScore({ ...newChoiceEquivalentScore, c: +e.target.value })
                }
              />
            </label>
            <button onClick={handleUpdateQuestion}>Save</button>
            <button onClick={() => setEditQuestion(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          disabled={safeCurrentPage <= 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          style={{ marginRight: '10px' }}
        >
          Previous
        </button>
        <span>
          Page {safeCurrentPage} of {totalPages || 1}
        </span>
        <button
          disabled={totalPages === 0}
          onClick={() =>
            setCurrentPage((prev) => {
              if (prev >= totalPages) {
                return 1; // loop back to first page
              }
              return prev + 1;
            })
          }
          style={{ marginLeft: '10px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PFTest;
