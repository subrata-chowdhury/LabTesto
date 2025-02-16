import mongoose, { Schema, Document } from 'mongoose';

interface ILab extends Document {
    name: string;
    description?: string;
    location: {
        address: string;
        pin: number;
        location: {
            lat: number;
            lang: number;
        };
    };
    certification?: {
        organization: string;
        imageUrl?: string;
    };
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
}

const LabSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    location: {
        type: {
            address: { type: String, require: true },
            pin: { type: Number, require: true },
            location: { type: { lat: { type: Number, require: true }, lang: { type: Number, require: true } }, require: true }
        }, required: true
    },
    certification: {
        type: {
            organization: { type: String, require: true },
            imageUrl: { type: String, require: false }
        }, required: false
    },
    prices: {
        type: [{
            test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
            price: { type: Number, require: true },
            offer: { type: Number, require: false, default: 0 },
            expenses: { type: Number, require: false, default: 0 }
        }],
        required: true,
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
}, { collection: 'labs', timestamps: true });

const Lab = mongoose.models.Lab || mongoose.model<ILab>('Lab', LabSchema);

export default Lab;