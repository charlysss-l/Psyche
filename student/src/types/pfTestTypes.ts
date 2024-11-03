
// Define the structure for Choices in a question.
export interface Choice {
    a: string;
    b: string;
    c: string;
}

// Define the structure for a single question.
export interface Question {
    questionID: string;
    questionNum: number;
    questionText: string;
    choices: Choice; // Use the Choice type here
    choiceEquivalentScore: { [key: string]: number }; 
}

// Define structure for the entire test.
export interface Test {
    testID: string;
    nameofTest: string;
    numOfQuestions: number;
    question: Question[];
}
