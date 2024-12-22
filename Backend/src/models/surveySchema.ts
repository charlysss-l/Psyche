import mongoose, { Schema, Document } from 'mongoose';

// Define the FilterOption type with only 'field' and 'options' as strings
interface FilterOption {
  field: string;    // e.g., "age", "sex", "health issue"
  options: string;  // Predefined options for the filter (e.g., "Male,Female")
}

// Define the Survey schema interface
interface Survey extends Document {
  title: string;
  description: string;
  category: string; 
  filters: FilterOption[];  
  sections: {
    sectionTitle: string;
    questions: {
      questionText: string;
      choices: string[];
    }[]; 
  }[];
  releaseDate: Date;  
  surveyId: string;   
}

// Define the filterSchema
const filterSchema = new Schema<FilterOption>({
  field: { type: String, required: false },
  options: { type: String, required: false },  
});

// Define the main survey schema
const surveySchema = new Schema<Survey>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: false },  
  filters: { type: [filterSchema], required: false }, 
  sections: [
    {
      sectionTitle: { type: String, required: true },
      questions: [
        {
          questionText: { type: String, required: true },
          choices: { type: [String], required: true },
        },
      ],
    },
  ],
  releaseDate: { type: Date, required: true },  
  surveyId: { type: String, unique: true, required: true },  
});

const SurveyModel = mongoose.model<Survey>('Survey', surveySchema);

export default SurveyModel;
