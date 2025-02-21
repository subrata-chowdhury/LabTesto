import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    patientDetails?: {
        name: string;
        // phone: string;
        gender: 'Male' | 'Female' | 'Other';
        age: number;
        other?: string;
    }[];
    address: {
        pin: string,
        city: string,
        district: string,
        other: string, // road details
        phone: string;
    }[];

    verified: boolean;
    otp?: string;
    otpExpiry?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },

    patientDetails: {
        type: [{
            name: { type: String, required: true },
            // phone: { type: String, required: true },                    
            gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
            age: { type: Number, required: true },
            other: { type: String, required: false }
        }], required: false, default: []
    },
    address: {
        type: [{
            pin: { type: String, required: true },
            city: { type: String, required: true },
            district: { type: String, required: true },
            other: { type: String, required: false }, // road details
            phone: { type: String, required: true },
        }], required: false, default: []
    },
    verified: { type: Boolean, default: false },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false },
}, { collection: 'users', timestamps: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;