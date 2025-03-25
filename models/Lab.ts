import mongoose, { Schema, Document } from 'mongoose';

export interface ILab extends Document {
    name: string;
    description?: string;
    image?: string;
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
    resultTimes: {
        [key: string]: {
            test: mongoose.Schema.Types.ObjectId;
            resultTime: string;
        };
    }
    prices: {
        [key: string]: {
            test: mongoose.Schema.Types.ObjectId;
            price: number;
            offer?: number;
            expenses?: number;
        }
    };
    packagesInclude?: {
        [key: string]: {
            test: mongoose.Schema.Types.ObjectId;
            packages: string[];
        }
    };
    ranges?: {
        [key: string]: {
            test: mongoose.Schema.Types.ObjectId;
            ranges: object[];
        }
    };
    rating: number;
    rated: number;
    contractDetails?: {
        email?: string[],
        phone?: string[]
    }
}


const PriceSchema = new Schema({
    test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    price: { type: Number, required: true },
    offer: { type: Number, required: false, default: 0 },
    expenses: { type: Number, required: false, default: 0 }
});

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
    resultTimes: {
        type: Map,
        to: {
            test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
            resultTime: { type: String, require: true }
        },
        require: false,
    },
    prices: {
        type: Map,
        of: PriceSchema,
        required: false,
    },
    packagesInclude: {
        type: Map,
        of: {
            test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
            packages: [String]
        },
        required: false,
    },
    ranges: {
        type: Map,
        of: {
            test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
            ranges: [Object]
        },
        required: false,
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