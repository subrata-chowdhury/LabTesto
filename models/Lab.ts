import mongoose, { Schema, Document } from 'mongoose';

interface ILab extends Document {
    name: string;
    location: {
        address: string;
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
        name: number;
        price: number;
        offer?: number;
    }[];
    packagesInclude?: {
        test: mongoose.Schema.Types.ObjectId;
        packages: string[];
    }[];
    ranges?: {
        test: mongoose.Schema.Types.ObjectId;
        ranges: object[];
    }[];
}

const LabSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    location: {
        type: {
            address: { type: String, require: true },
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
    }
}, { collection: 'labs', timestamps: true });

const Lab = mongoose.models.Lab || mongoose.model<ILab>('Lab', LabSchema);

export default Lab;