import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    items: {
        product: {
            test: mongoose.Schema.Types.ObjectId;
            lab: mongoose.Schema.Types.ObjectId;
            price: number;
            expenses: number;
        };
        patientDetails: {
            name: string;
            // phone: string;
            gender: 'Male' | 'Female' | 'Other';
            age: number;
            other?: string;
        }[];
        quantity: number;
        date?: Date;
    }[];
    address: {
        pin: string;
        city: string;
        district: string;
        other?: string; // road details
        phone: string;
    };

    user: mongoose.Schema.Types.ObjectId;
    collector?: mongoose.Schema.Types.ObjectId;
    status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered' | 'Canceled';
    sampleTakenDateTime: {
        date: {
            start?: Date;
            end?: Date;
        };
    };
    reportDeliverTime: {
        date: {
            start?: Date;
            end?: Date;
        };
    };
    review: {
        labRating: number,
        collectorRating: number,
        platformRating: number,
        reviewText: string
    };
    paid: number;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    items: {
        type: [{
            product: {
                test: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Test' },
                lab: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lab' },
                price: { type: Number, required: true },
                expenses: { type: Number, required: false, default: 0 }
            },
            patientDetails: {
                type: [{
                    name: { type: String, required: true },
                    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false },
                    // phone: { type: String, required: true },
                    age: { type: Number, required: true },
                    other: { type: String, required: false }
                }], required: false, default: []
            },
            quantity: { type: Number, required: true },
            date: { type: Date, required: false, default: Date.now }
        }], required: true
    },
    address: {
        pin: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        other: { type: String, required: false }, // road details
        phone: { type: String, required: true },
    },

    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    collector: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Collector' },
    status: { type: String, enum: ['Ordered', 'Sample Collected', 'Report Generated', 'Report Delivered', 'Canceled'], default: 'Ordered' },
    sampleTakenDateTime: {
        date: {
            start: { type: Date, required: false, default: Date.now },
            end: { type: Date, required: false, default: Date.now }
        }
    },
    reportDeliverTime: {
        date: {
            start: { type: Date, required: false, default: Date.now },
            end: { type: Date, required: false, default: Date.now }
        }
    },
    review: {
        type: {
            labRating: { type: Number, require: false },
            collectorRating: { type: Number, require: false },
            platformRating: { type: Number, require: false },
            reviewText: { type: String, require: false }
        }, require: false
    },
    paid: { type: Number, required: false, default: 0 },
}, { collection: 'orders', timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;