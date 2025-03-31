import mongoose, { Schema, Document } from 'mongoose';

export interface ICollector extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;

    adhaar?: string;
    experience?: number;
    qualification?: {
        degree?: string;
        college?: string;
        year?: number;
    }[];
    reachableAreas: string[],
    chatId: string,

    verified: boolean;
    otp?: string;
    otpExpiry?: Date;

    rating: number;
    rated: number;

    createdAt: Date;
    updatedAt: Date;
}

const CollectorSchema: Schema = new Schema({
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },

    adhaar: { type: String, required: false },
    experience: { type: Number, required: false },
    qualification: {
        type: [{
            degree: { type: String, required: false },
            college: { type: String, required: false },
            year: { type: Number, required: false },
        }], required: false, default: []
    },
    reachableAreas: { type: [String], required: false, default: [] },
    chatId: { type: String, required: false },

    verified: { type: Boolean, default: false },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false },

    rating: { type: Number, required: false, default: 0 },
    rated: { type: Number, required: false, default: 0 },
}, { collection: 'collectors', timestamps: true });

const Collector = mongoose.models.Collector || mongoose.model<ICollector>('Collector', CollectorSchema);

export default Collector;