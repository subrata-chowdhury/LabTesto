import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    items: {
        product: {
            test: mongoose.Schema.Types.ObjectId;
            lab: mongoose.Schema.Types.ObjectId;
            price: number;
        };
        patientDetails: {
            name: string;
            phone: string;
            address: {
                pin: number;
                city: string;
                district: string;
                other?: string; // road details
            };
        }[];
        quantity: number;
        date?: Date;
    }[];
    user: mongoose.Schema.Types.ObjectId;
    collector?: mongoose.Schema.Types.ObjectId;
    status: 'Ordered' | 'Sample Collected' | 'Report Generated' | 'Report Delivered';
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
    items: {
        type: [{
            product: {
                test: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Test' },
                lab: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lab' },
                price: { type: Number, required: true },
            },
            patientDetails: {
                type: [{
                    name: { type: String, required: true },
                    phone: { type: String, required: true },
                    address: {
                        pin: { type: Number, required: true },
                        city: { type: String, required: true },
                        district: { type: String, required: true },
                        other: { type: String, required: false } // road details
                    }
                }], required: true, default: []
            },
            quantity: { type: Number, required: true },
            date: { type: Date, required: false, default: Date.now }
        }], required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    collector: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Collector' },
    status: { type: String, enum: ['Ordered', 'Sample Collected', 'Report Generated', 'Report Delivered'], default: 'Ordered' },
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