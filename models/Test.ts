import mongoose, { Schema, Document } from 'mongoose';

interface ITest extends Document {
    name: string;
    sampleType: 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other body fluid';
    tubeType: 'Clot/Plain tube (red color cap)' | 'Fluoride/Sugar tube (gray color cap)' | 'EDTA tube (purple color cap)' | 'Citrate tube (blue color cap)';
    description: string;
    fastingRequired: string;
    overview: string;
    testResultInterpretation: string;
    riskAssesment: string;
    resultTime: string;

    createdAt: Date;
    updatedAt: Date;
}

const TestSchema: Schema = new Schema({
    name: { type: String, required: true },
    sampleType: {
        type: String,
        enum: ['Blood', 'Urine', 'Semen', 'Stool', 'Sputum', 'Other body fluid'],
        required: true
    },
    tubeType: {
        type: String,
        enum: ['Clot/Plain tube (red color cap)', 'Fluoride/Sugar tube (gray color cap)', 'EDTA tube (purple color cap)', 'Citrate tube (blue color cap)'],
        required: true
    },
    description: { type: String, required: true },
    fastingRequired: { type: String, required: false },
    overview: { type: String, required: true },
    testResultInterpretation: { type: String, required: true },
    riskAssesment: { type: String, required: true },
    resultTime: { type: String, required: true },
}, { collection: 'tests', timestamps: true });

const Test = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);

export default Test;