import mongoose, { Schema, Document } from 'mongoose';
export interface ILab extends Document {
    name: string;
    description?: string;
    image?: string;
    location?: {
        address: {
            pin: string;
            city: string;
            district: string;
            other?: string; // road details
        };
        location?: {
            lat?: number;
            lang?: number;
        };
    };
    certification?: {
        organization: string;
        year?: number;
        imageUrl?: string;
    }[];
    rating: number;
    rated: number;
    contractDetails?: {
        email?: string[];
        phone?: string[];
    };
}

const LabSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false },
    location: {
        type: {
            address: {
                pin: { type: String, required: true },
                city: { type: String, required: true },
                district: { type: String, required: true },
                other: { type: String, required: false }, // road details
            },
            location: { lat: { type: Number, required: false }, lang: { type: Number, required: false } }
        }, required: false
    },
    certification: {
        type: [{
            organization: { type: String, required: true },
            year: { type: Number, required: false },
            imageUrl: { type: String, required: false }
        }], required: false
    },
    rating: { type: Number, required: false, default: 0 },
    rated: { type: Number, required: false, default: 0 },
    contractDetails: {
        type: {
            email: { type: [String], required: false },
            phone: { type: [String], required: false }
        },
        required: false
    }
}, { collection: 'labs', timestamps: true });

const Lab = mongoose.models.Lab || mongoose.model<ILab>('Lab', LabSchema);

export default Lab;