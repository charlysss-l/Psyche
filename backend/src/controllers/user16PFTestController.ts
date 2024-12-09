import { Request, Response } from 'express';
import User16PFTest, { Scoring, ScoreEntry } from '../models/User16PFTestSchema';

const calculateStenScore = (rawScore: number, factorLetter: string): number => {
    // Factor-specific mappings
    switch (factorLetter) {
        case 'A':
            if (rawScore >= 0 && rawScore <= 3) {
                return 1; // Factor A custom mapping
            }else if (rawScore >= 4 && rawScore <= 5) {
                return 2; 
            } else if (rawScore >= 6 && rawScore <= 8) {
                return 3; 
            }else if (rawScore >= 9 && rawScore <= 11) {
                return 4; 
            }
            else if (rawScore >= 12 && rawScore <= 14) {
                return 5; 
            }
            else if (rawScore >= 15 && rawScore <= 17) {
                return 6; 
            }
            else if (rawScore >= 18 && rawScore <= 19) {
                return 7; 
            }
            else if (rawScore === 20) {
                return 8; 
            }
            else if (rawScore >= 21 && rawScore <= 22) {
                return 9; 
            }
            break;
        case 'B':
            if (rawScore >= 0 && rawScore <= 3) {
                return 1; 
            } else if (rawScore === 4) {
                return 2; 
            }
            else if (rawScore >=  5 && rawScore <= 6 ) {
                return 3; 
            }
            else if (rawScore >= 7 && rawScore <= 8) {
                return 4; 
            }
            else if (rawScore >= 9 && rawScore <= 10) {
                return 5; 
            }
            else if (rawScore >=  11 && rawScore <= 12) {
                return 6; 
            }
            else if (rawScore === 13 ) {
                return 7; 
            }
            else if (rawScore === 14 ) {
                return 8; 
            }
            else if (rawScore === 15 ) {
                return 9; 
            }
            break;
            case 'C':
                if (rawScore >= 0 && rawScore <= 2 ) {
                    return 1; 
                } else if (rawScore >= 3 && rawScore <= 5 ) {
                    return 2; 
                }
                else if (rawScore >= 6 && rawScore <= 8) {
                    return 3; 
                }
                else if (rawScore >= 9 && rawScore <= 12 ) {
                    return 4; 
                }
                else if (rawScore >=  13 && rawScore <= 16) {
                    return 5; 
                }
                else if (rawScore >= 17  && rawScore <= 18 ) {
                    return 6; 
                }
                else if (rawScore === 19 ) {
                    return 7; 
                }
                else if (rawScore === 20 ) {
                    return 8; 
                }
                break;
                case 'E':
                    if (rawScore >= 0 && rawScore <= 2) {
                        return 1; 
                    } else if (rawScore >= 3 && rawScore <= 5) {
                        return 2; 
                    }
                    else if (rawScore >= 6 && rawScore <= 8) {
                        return 3; 
                    }
                    else if (rawScore >=  9 && rawScore <= 11) {
                        return 4; 
                    }
                    else if (rawScore >= 12 && rawScore <= 14) {
                        return 5; 
                    }
                    else if (rawScore >=  15 && rawScore <= 17) {
                        return 6; 
                    }
                    else if (rawScore === 18 ) {
                        return 7; 
                    }
                    else if (rawScore === 19 ) {
                        return 8; 
                    }
                    else if (rawScore === 20 ) {
                        return 9; 
                    }
                break;
                case 'F':
                if (rawScore >= 0 && rawScore <= 3) { return 2;
                }else if (rawScore >= 4 && rawScore <= 6) { return 3;
                }else if (rawScore >= 7 && rawScore <= 9) { return 4;
                }else if (rawScore >= 10 && rawScore <= 12) { return 5;
                }else if (rawScore >= 13 && rawScore <= 15) { return 6;
                }else if (rawScore >= 16 && rawScore <= 17) { return 7;
                }else if (rawScore === 18) { return 8;
                }else if (rawScore >= 19 && rawScore <= 20) { return 9;
                }break;
                case 'G':
                    if (rawScore >=  0&& rawScore <= 2) {
                        return 1; 
                    } else if (rawScore >= 3 && rawScore <= 5) {
                        return 2; 
                    }
                    else if (rawScore >= 6 && rawScore <=8 ) {
                        return 3; 
                    }
                    else if (rawScore >=  9&& rawScore <= 11) {
                        return 4; 
                    }
                    else if (rawScore >=  12&& rawScore <= 15) {
                        return 5; 
                    }
                    else if (rawScore >=  16&& rawScore <= 18 ) {
                        return 6; 
                    }
                    else if (rawScore >=  19&& rawScore <= 20) {
                        return 7; 
                    }
                    else if (rawScore === 21 ) {
                        return 8; 
                    }
                    else if (rawScore === 22 ) {
                        return 9; 
                    }
                break;
                case 'H':
                    if (rawScore >=   0&& rawScore <=1 ) {
                        return 2; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 3; 
                    }
                    else if (rawScore >= 4 && rawScore <= 7) {
                        return 4; 
                    }
                    else if (rawScore >=  8&& rawScore <=12 ) {
                        return 5; 
                    }
                    else if (rawScore >= 13 && rawScore <= 16) {
                        return 6; 
                    }
                    else if (rawScore >=  17&& rawScore <= 18) {
                        return 7; 
                    }
                    else if (rawScore === 19) {
                        return 8; 
                    }
                    else if (rawScore=== 20 ) {
                        return 9; 
                    }
                break;
                case 'I':
                    if (rawScore === 0 ) {
                        return 1; 
                    } else if (rawScore >= 1 && rawScore <=2 ) {
                        return 2; 
                    }
                    else if (rawScore >=  3&& rawScore <= 5) {
                        return 3; 
                    }
                    else if (rawScore >=  6&& rawScore <=8 ) {
                        return 4; 
                    }
                    else if (rawScore >=  9&& rawScore <= 12) {
                        return 5; 
                    }
                    else if (rawScore >= 13 && rawScore <= 16) {
                        return 6; 
                    }
                    else if (rawScore >= 17 && rawScore <= 19) {
                        return 7; 
                    }
                    else if (rawScore >= 20 && rawScore <= 21) {
                        return 8; 
                    }
                    else if (rawScore === 22) {
                        return 9; 
                    }
                break;
                case 'L':
                    if (rawScore >=  0&& rawScore <= 1) {
                        return 1; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 2; 
                    }
                    else if (rawScore >= 4 && rawScore <= 5) {
                        return 3; 
                    }
                    else if (rawScore >= 6 && rawScore <= 7) {
                        return 4; 
                    }
                    else if (rawScore >=  8&& rawScore <= 10) {
                        return 5; 
                    }
                    else if (rawScore >=  11&& rawScore <= 13) {
                        return 6; 
                    }
                    else if (rawScore >=  14&& rawScore <=15 ) {
                        return 7; 
                    }
                    else if (rawScore >=  16&& rawScore <= 17) {
                        return 8; 
                    }
                    else if (rawScore >= 18 && rawScore <= 19) {
                        return 9; 
                    }
                    else if (rawScore ===20) {
                        return 10; 
                    }
                break;
                case 'M':
                    if (rawScore ===0 ) {
                        return 2; 
                    } else if (rawScore ===1 ) {
                        return 3; 
                    }
                    else if (rawScore >= 2 && rawScore <= 3) {
                        return 4; 
                    }
                    else if (rawScore >=  4&& rawScore <= 6) {
                        return 5; 
                    }
                    else if (rawScore >=  7&& rawScore <=10 ) {
                        return 6; 
                    }
                    else if (rawScore >= 11 && rawScore <= 14) {
                        return 7; 
                    }
                    else if (rawScore >=  15&& rawScore <= 18) {
                        return 8; 
                    }
                    else if (rawScore >= 19 && rawScore <= 20) {
                        return 9; 
                    }
                    else if (rawScore >= 21 && rawScore <=22 ) {
                        return 10; 
                    }
                break;
                case 'N':
                    if (rawScore ===0 ) {
                        return 1; 
                    } else if (rawScore >= 1 && rawScore <=2 ) {
                        return 2; 
                    }
                    else if (rawScore >=  3&& rawScore <=4 ) {
                        return 3; 
                    }
                    else if (rawScore >= 5 && rawScore <= 7) {
                        return 4; 
                    }
                    else if (rawScore >=  8&& rawScore <= 10) {
                        return 5; 
                    }
                    else if (rawScore >=  11&& rawScore <= 14) {
                        return 6; 
                    }
                    else if (rawScore >= 15 && rawScore <=17 ) {
                        return 7; 
                    }
                    else if (rawScore >=  18&& rawScore <=19 ) {
                        return 8; 
                    }
                    else if (rawScore ===20 ) {
                        return 9; 
                    }
                break;
                case 'O':
                    if (rawScore >= 0 && rawScore <=1 ) {
                        return 2; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 3; 
                    }
                    else if (rawScore >= 4 && rawScore <=6 ) {
                        return 4; 
                    }
                    else if (rawScore >=  7&& rawScore <= 10) {
                        return 5; 
                    }
                    else if (rawScore >= 11 && rawScore <=14 ) {
                        return 6; 
                    }
                    else if (rawScore >= 15 && rawScore <= 17) {
                        return 7; 
                    }
                    else if (rawScore >=  18&& rawScore <= 19) {
                        return 8; 
                    }
                    else if (rawScore===20 ) {
                        return 9; 
                    }
                break;
                case 'Q1':
                    if (rawScore >=  0&& rawScore <= 4) {
                        return 1; 
                    } else if (rawScore >= 5 && rawScore <=7 ) {
                        return 2; 
                    }
                    else if (rawScore >=  8&& rawScore <= 9) {
                        return 3; 
                    }
                    else if (rawScore >= 10 && rawScore <= 13 ) {
                        return 4; 
                    }
                    else if (rawScore >=  14&& rawScore <= 17) {
                        return 5; 
                    }
                    else if (rawScore >= 18 && rawScore <=20 ) {
                        return 6; 
                    }
                    else if (rawScore >= 21 && rawScore <= 23) {
                        return 7; 
                    }
                    else if (rawScore >= 24 && rawScore <= 25) {
                        return 8; 
                    }
                    else if (rawScore >= 26 && rawScore <= 27 ) {
                        return 9; 
                    }
                    else if (rawScore === 28) {
                        return 10; 
                    }
                break;
                case 'Q2':
                    if (rawScore ===0 ) {
                        return 2; 
                    } else if (rawScore ===1 ) {
                        return 3; 
                    }
                    else if (rawScore >= 2 && rawScore <=3 ) {
                        return 4; 
                    }
                    else if (rawScore >= 4 && rawScore <=6 ) {
                        return 5; 
                    }
                    else if (rawScore >= 7 && rawScore <= 10) {
                        return 6; 
                    }
                    else if (rawScore >=  11&& rawScore <=14 ) {
                        return 7; 
                    }
                    else if (rawScore >=  15&& rawScore <= 16) {
                        return 8; 
                    }
                    else if (rawScore >=  17&& rawScore <=18 ) {
                        return 9; 
                    }
                    else if (rawScore >=  19&& rawScore <= 20) {
                        return 10; 
                    }
                break;
                case 'Q3':
                    if (rawScore >= 0 && rawScore <=1 ) {
                        return 1; 
                    } else if (rawScore >= 2 && rawScore <= 3) {
                        return 2; 
                    }
                    else if (rawScore >= 4 && rawScore <=5 ) {
                        return 3; 
                    }
                    else if (rawScore >= 6 && rawScore <= 8) {
                        return 4; 
                    }
                    else if (rawScore >= 9 && rawScore <= 12) {
                        return 5; 
                    }
                    else if (rawScore >=  13&& rawScore <=15 ) {
                        return 6; 
                    }
                    else if (rawScore >= 16 && rawScore <= 17) {
                        return 7; 
                    }
                    else if (rawScore ===18 ) {
                        return 8; 
                    }
                    else if (rawScore >=  19&& rawScore <= 20 ) {
                        return 9; 
                    }
                break;
                case 'Q4':
                    if (rawScore >= 0 && rawScore <= 1) {
                        return 2; 
                    } else if (rawScore >= 2 && rawScore <=3 ) {
                        return 3; 
                    }
                    else if (rawScore >= 4 && rawScore <= 6) {
                        return 4; 
                    }
                    else if (rawScore >=  7&& rawScore <=10 ) {
                        return 5; 
                    }
                    else if (rawScore >= 11 && rawScore <= 14) {
                        return 6; 
                    }
                    else if (rawScore >=  15&& rawScore <=17 ) {
                        return 7; 
                    }
                    else if (rawScore >= 18 && rawScore <=19 ) {
                        return 8; 
                    }
                    else if (rawScore === 20 ) {
                        return 9; 
                    }

                break;

    }
    // Default to 1 if no custom logic applies
    return 1;
};
export const createUser16PFTest = async (req: Request, res: Response): Promise<Response> => {
    const { userID, firstName, lastName, age, sex, course, year, section, responses, testType, testDate } = req.body;

    try {
        // Validate that required fields are present
        if (!userID || !firstName || !lastName || !age || !sex || !course || !year || !section  || !responses || !testType || !testDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
 

        // Check that responses array is not empty and contains the required structure
        if (!Array.isArray(responses) || responses.length === 0) {
            return res.status(400).json({ message: 'Responses must be a non-empty array' });
        }

        // Generate a unique testID using userID and current timestamp
        const testID = `${userID}-${Date.now()}`;

        // Map responses ensuring they contain the necessary fields
        const mappedResponses = responses.map((response: any) => {
            if (!response.factorLetter) {
                throw new Error('factorLetter is required in each response');
            }
            return {
                questionID: response.questionID,
                selectedChoice: response.selectedChoice,
                equivalentScore: response.equivalentScore,
                factorLetter: response.factorLetter,
            };
        });

        // Initialize scoring object
        const scoring: Scoring = {
            scores: [] // Start with an empty array for scores
        };

        // Create scoring based on factorLetter
        const factorLetters = [...new Set(mappedResponses.map(response => response.factorLetter))];

        factorLetters.forEach(factorLetter => {
            const totalScore = mappedResponses
                .filter(response => response.factorLetter === factorLetter)
                .reduce((sum, response) => sum + response.equivalentScore, 0);

            // Calculate stenScore based on rawScore and factorLetter
            const stenScore = calculateStenScore(totalScore, factorLetter);

            scoring.scores.push({
                factorLetter,
                rawScore: totalScore,
                stenScore, // Use the calculated stenScore
            });
        });

        // Create the test document
        const testDocument = new User16PFTest({
            userID,
            firstName,
            lastName,
            age,
            sex,
            course,
            year,
            section,
            testID,
            responses: mappedResponses,
            scoring, // Use the newly constructed scoring object
            testType,
            testDate
        });

        // Check for existing testID
        const existingTest = await User16PFTest.findOne({ testID });
        if (existingTest) {
            return res.status(400).json({ message: 'Duplicate testID found. Each test attempt must have a unique testID.' });
        }

        // Save the test document to the database
        await testDocument.save();
        return res.status(201).json({ message: 'Test created successfully!', data: testDocument });
    } catch (error) {
        console.error('Error creating test:', error);
        return res.status(500).json({
            message: 'Error creating test',
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            stack: error instanceof Error ? error.stack : undefined // Optional: Include stack trace for debugging
        });
    }
};

// Controller to get all User16PFTests
export const getUser16PFTests = async (req: Request, res: Response) => {
    try {
        const allUser16PFtests = await User16PFTest.find();
        res.status(200).json({ data: allUser16PFtests });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: 'Error fetching tests', error: errorMessage });
    }
};

export const getUser16PFTestByUserId = async (req: Request, res: Response): Promise<Response> => {
    const { userID } = req.params; // Extract `userID` from route params

    try {
        // Ensure `userID` is provided and not empty
        if (!userID) {
            return res.status(400).json({ message: 'userID is required' });
        }

        console.log("Fetching tests for userID:", userID);

        // Query the User16PFTest collection for the specific userID
        const userTests = await User16PFTest.find({ userID });

        // Check if any tests were found
        if (!userTests || userTests.length === 0) {
            return res.status(404).json({ message: 'No tests found for this user' });
        }

        return res.status(200).json({ data: userTests });
    } catch (error) {
        console.error('Error fetching test by userID:', error);
        return res.status(500).json({ message: 'Error fetching test', error: (error as Error).message });
    }
};

export const getUser16PFTestByTestID = async (req: Request, res: Response): Promise<Response> => {
    const { testID } = req.params; // Extract `userID` from route params

    try {
        // Ensure `userID` is provided and not empty
        if (!testID) {
            return res.status(400).json({ message: 'userID is required' });
        }

        console.log("Fetching tests for userID:", testID);

        // Query the User16PFTest collection for the specific userID
        const userTests = await User16PFTest.find({ testID });

        // Check if any tests were found
        if (!userTests || userTests.length === 0) {
            return res.status(404).json({ message: 'No tests found for this user' });
        }

        return res.status(200).json({ data: userTests });
    } catch (error) {
        console.error('Error fetching test by userID:', error);
        return res.status(500).json({ message: 'Error fetching test', error: (error as Error).message });
    }
};




// Controller to get a specific User16PFTest by ID
export const getUser16PFTestById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const PFuserTest = await User16PFTest.findById(id);
        if (!PFuserTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }

        // Calculate stenScore for each factor in the test result
        PFuserTest.scoring.scores.forEach(score => {
            score.stenScore = calculateStenScore(score.rawScore, score.factorLetter); // Recalculate stenScore if needed
        });

        res.status(200).json({ data: PFuserTest });
    } catch (error: unknown) {
        res.status(500).json({
            message: 'Error fetching user test',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};







// Controller to update a User16PFTest by ID
export const updateUser16PFTest = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedUserPFTest = await User16PFTest.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUserPFTest) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.status(200).json({ message: 'Test updated successfully', data: updatedUserPFTest });
    } catch (error: unknown) {
        res.status(500).json({
            message: 'Error updating user test',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

// Controller to delete a User16PFTest by ID
export const deleteUser16PFTest = async (req: Request, res: Response) => {
    const { id } = req.params; // `id` here is the testID
    try {
      const deletedIQTestResult = await User16PFTest.findOneAndDelete({ testID: id });
      if (!deletedIQTestResult) {
        res.status(404).json({ message: 'Test result not found' });
        return;
      }
      res.status(200).json({ message: 'PF test result deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting PF test result',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };





// Archive Controller to archive an IQ test result



// Controller to archive an IQ test result
export const archivePFTestResult = async (req: Request, res: Response) => {
    const { testID } = req.params;
    try {
        // Use findOne() to search by testID (assuming testID is a string or custom ID)
        const testResult = await User16PFTest.findOne({ testID: testID });

        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }

        // Mark the test result as archived
        testResult.isArchived = true; // Assuming there's an `isArchived` field

        await testResult.save();
        res.status(200).json({ message: 'IQ test result archived successfully', data: testResult });
    } catch (error) {
        res.status(500).json({
            message: 'Error archiving IQ test result',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};




// Controller for fetching archived IQ test results
export const getArchivedPFTests = async (req: Request, res: Response) => {
    try {
        const archivedTests = await User16PFTest.find({ isArchived: true });
        console.log('Archived tests:', archivedTests);  // This logs the archived tests to check if they're being returned

        if (archivedTests.length === 0) {
            return res.status(404).json({ message: 'No archived test results found' });
        }

        res.status(200).json({ message: 'Archived IQ test results fetched successfully', data: archivedTests });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching archived IQ test results',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};






export const deleteArchivedPFTestResult = async (req: Request, res: Response) => {
    const { testID } = req.params;
  try {
    const consultationRequest = await User16PFTest.findOne({ testID });
    if (!consultationRequest) {
      return res.status(404).json({ message: 'Consultation request not found' });
    }

    // Delete the consultation request
    await User16PFTest.deleteOne({ testID });

    res.status(200).json({ message: 'Consultation request deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting consultation request',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};