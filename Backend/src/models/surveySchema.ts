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
}

// Define the filterSchema
const filterSchema = new Schema<FilterOption>({
  field: { type: String, required: true },
  options: { type: String, required: true },  
});

// Define the main survey schema
const surveySchema = new Schema<Survey>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },  
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
});

const SurveyModel = mongoose.model<Survey>('Survey', surveySchema);

export default SurveyModel;
