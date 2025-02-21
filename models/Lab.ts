import mongoose, { Schema, Document } from 'mongoose';

interface ILab extends Document {
    name: string;
    description?: string;
    location: {
        address: {
            pin: string,
            city: string,
            district: string,
            other: string, // road details
        };
        location: {
            lat: number;
            lang: number;
        };
    };
    certification?: {
        organization: string;
        year?: number;
        imageUrl?: string;
    }[];
    prices: {
        test: mongoose.Schema.Types.ObjectId;
        price: number;
        offer?: number;
        expenses?: number;
    }[];
    packagesInclude?: {
        test: mongoose.Schema.Types.ObjectId;
        packages: string[];
    }[];
    ranges?: {
        test: mongoose.Schema.Types.ObjectId;
        ranges: object[];
    }[];
    rating: number;
    rated: number;
    contractDetails?: {
        email?: string[],
        phone?: string[]
    }
}

const LabSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    location: {
        type: {
            address: {
                pin: { type: String, required: true },
                city: { type: String, required: true },
                district: { type: String, required: true },
                other: { type: String, required: false }, // road details
            },
            location: { lat: { type: Number, require: false }, lang: { type: Number, require: false } }
        }, required: false
    },
    certification: {
        type: [{
            organization: { type: String, require: true },
            year: { type: Number, require: false },
            imageUrl: { type: String, require: false }
        }], required: false
    },
    prices: {
        type: [{
            test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
            price: { type: Number, require: true },
            offer: { type: Number, require: false, default: 0 },
            expenses: { type: Number, require: false, default: 0 }
        }],
        required: false,
        default: []
    },
    packagesInclude: {
        type: [{
            test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
            packages: [String]
        }],
        required: false,
        default: []
    },
    ranges: {
        type: [{
            test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
            ranges: [Object]
        }],
        required: false,
        default: []
    },
    rating: { type: Number, require: false, default: 0 },
    rated: { type: Number, require: false, default: 0 },
    contractDetails: {
        type: {
            email: [String],
            phone: [String]
        },
        required: false
    }
}, { collection: 'labs', timestamps: true });

const Lab = mongoose.models.Lab || mongoose.model<ILab>('Lab', LabSchema);

export default Lab;