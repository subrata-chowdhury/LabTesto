import mongoose, { Schema, Document } from 'mongoose';

interface ICollector extends Document {
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

    verified: boolean;
    otp?: string;
    otpExpiry?: Date;

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

    verified: { type: Boolean, default: false },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false },
}, { collection: 'collectors', timestamps: true });

const Collector = mongoose.models.Collector || mongoose.model<ICollector>('Collector', CollectorSchema);

export default Collector;