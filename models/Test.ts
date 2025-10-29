import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
    name: string;
    otherTerms?: string[];
    sampleType: 'Blood' | 'Urine' | 'Semen' | 'Stool' | 'Sputum' | 'Other Body Fluid';
    tubeType: 'Clot Tube' | 'Fluoride Tube' | 'EDTA Tube' | 'Citrate Tube' | 'Sterile Container' | 'Non-Sterile Container';
    description?: string;
    fastingRequired?: string;
    overview?: string;
    testResultInterpretation?: string;
    riskAssesment?: string;
    labsDetails?: {
        [key: string]: {
            name: string;
            image?: string;
            lab: string;
            price: number;
            offer?: number;
            expenses?: number;
            resultTime: string;
            packages?: string[];
            ranges?: Map<string, string>;
        }
    };
    createdAt: Date;
    updatedAt: Date;
}

const TestSchema: Schema = new Schema({
    name: { type: String, required: true },
    otherTerms: { type: [String], required: false },
    sampleType: {
        type: String,
        enum: ['Blood', 'Urine', 'Semen', 'Stool', 'Sputum', 'Other Body Fluid'],
        required: true
    },
    tubeType: {
        type: String,
        enum: ['Clot Tube', 'Fluoride Tube', 'EDTA Tube', 'Citrate Tube', 'Sterile Container', 'Non-Sterile Container'],
        required: true
    },
    description: { type: String, required: false },
    fastingRequired: { type: String, required: false },
    overview: { type: String, required: false },
    testResultInterpretation: { type: String, required: false },
    riskAssesment: { type: String, required: false },

    labsDetails: {
        type: Map,
        to: {
            lab: { type: Schema.Types.ObjectId, ref: 'Lab', required: true },
            name: { type: String, required: true },
            image: { type: String, required: false },
            price: { type: Number, required: true },
            offer: { type: Number, required: false, default: 0 },
            expenses: { type: Number, required: false, default: 0 },
            resultTime: { type: String, required: true },
            packages: { type: [String], required: false },
            ranges: { type: Map, of: String, required: false }
        },
        required: false,
        default: {}
    },
}, { collection: 'tests', timestamps: true });

const Test = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);

export default Test;