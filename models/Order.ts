import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    name: string;
    // email: string;
    // password: string;
    phone: string;
    address: {
        pin: number,
        city: string,
        district: string,
        other: string // road details
    }
    date: string,
    time: string

    // verified: boolean;
    // otp?: string;
    // otpExpiry?: Date;
    
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    name: { type: String, default: '' },
    // email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        pin: { type: String, required: false },
        city: { type: String, required: false },
        district: { type: String, required: false },
        other: { type: String, required: false }, // road details
    },
    date: { type: String, required: false },
    time: { type: String, required: false }
    
    // verified: { type: Boolean, default: false },
    // otp: { type: String, required: false },
    // otpExpiry: { type: Date, required: false },
}, { collection: 'orders', timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;