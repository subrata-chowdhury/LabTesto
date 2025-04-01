import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
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
    status: 'Ordered' | 'Out for Sample Collection' | 'Sample Collected' | 'Report Delivered to Lab' | 'Report Generated' | 'Out for Report Delivery' | 'Report Delivered' | 'Canceled';
    sampleTakenDateTime: {
        start?: Date;
        end?: Date;
    };
    reportDeliverTime: {
        start?: Date;
        end?: Date;
    };
    review: {
        test: mongoose.Schema.Types.ObjectId;
        lab: mongoose.Schema.Types.ObjectId;
        labRating: number,
        collectorRating: number,
        platformRating: number,
        reviewText: string
    }[];
    paid: number;
    exceptCollectors: mongoose.Schema.Types.ObjectId[];
    statusRecords: {
        status: 'Out for Sample Collection' | 'Sample Collected' | 'Report Delivered to Lab' | 'Report Generated' | 'Out for Report Delivery' | 'Report Delivered' | 'Canceled',
        date: Date
    }[];
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
    status: { type: String, enum: ['Ordered', 'Out for Sample Collection', 'Sample Collected', 'Report Delivered to Lab', 'Report Generated', 'Out for Report Delivery', 'Report Delivered', 'Canceled'], default: 'Ordered' },
    sampleTakenDateTime: {
        start: { type: Date, required: false, default: Date.now },
        end: { type: Date, required: false, default: Date.now }
    },
    reportDeliverTime: {
        start: { type: Date, required: false, default: Date.now },
        end: { type: Date, required: false, default: Date.now }
    },
    review: {
        type: [{
            lab: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lab' },
            test: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Test' },
            labRating: { type: Number, required: false },
            collectorRating: { type: Number, required: false },
            platformRating: { type: Number, required: false },
            reviewText: { type: String, required: false }
        }], required: false, default: []
    },
    paid: { type: Number, required: false, default: 0 },
    exceptCollectors: { type: [mongoose.Schema.Types.ObjectId], required: false, ref: 'Collector', default: [] },
    statusRecords: {
        type: [{
            status: { type: String, enum: ['Out for Sample Collection', 'Sample Collected', 'Report Delivered to Lab', 'Report Generated', 'Out for Report Delivery', 'Report Delivered', 'Canceled'], required: true },
            date: { type: Date, required: false, default: Date.now }
        }], require: false, default: []
    }
}, { collection: 'orders', timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;