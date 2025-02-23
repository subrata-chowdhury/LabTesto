import mongoose, { Schema, Document } from 'mongoose';

interface ITest extends Document {
    name: string;
    otherTerms: string[];
    sampleType: 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other Body Fluid';
    tubeType: 'Clot Tube' | 'Fluoride Tube' | 'EDTA Tube' | 'Citrate Tube';
    description: string;
    fastingRequired: string;
    // tubeType: 'Red Color Cap' | 'Gray Color Cap' | 'Purple Color cap' | 'Blue Color Cap';
    overview: string;
    testResultInterpretation: string;
    riskAssesment: string;
    // resultTime: string;

    createdAt: Date;
    updatedAt: Date;
}

const TestSchema: Schema = new Schema({
    name: { type: String, required: true },
    otherTerms: { type: [String], required: false },
    sampleType: {
        type: String,
        enum: ['Blood', 'Urine', 'Semen', 'Stool', 'Sputum', 'Other body fluid'],
        required: true
    },
    tubeType: {
        type: String,
        enum: ['Clot Tube', 'Fluoride Tube', 'EDTA Tube', 'Citrate Tube'],
        required: true
    },
    description: { type: String, required: true },
    fastingRequired: { type: String, required: false },
    overview: { type: String, required: false },
    testResultInterpretation: { type: String, required: false },
    riskAssesment: { type: String, required: false },
    // resultTime: { type: String, required: false },
}, { collection: 'tests', timestamps: true });

const Test = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);

export default Test;