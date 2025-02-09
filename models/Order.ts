import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    name: string;
    tests: string[];
    user: string;
    status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered';
    phone: string;
    address: {
        pin: number;
        city: string;
        district: string;
        other?: string; // road details
    };
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

    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    name: { type: String, default: '' },
    tests: {
        type: [{
            test: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Test' },
            lab: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lab' },
            price: { type: Number, required: true }
        }], required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    collector: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Collector' },
    status: { type: String, enum: ['Ordered', 'Sample Collected', 'Report Generated', 'Report Delivered'], default: 'Ordered' },
    phone: { type: String, required: true },
    address: {
        pin: { type: Number, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        other: { type: String, required: false } // road details
    },
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
    }
}, { collection: 'orders', timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;