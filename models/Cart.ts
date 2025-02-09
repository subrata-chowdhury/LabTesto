import mongoose, { Schema, Document } from 'mongoose';

interface ICart extends Document {
    items: { product: string, quantity: number }[];
    user: string;
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema = new Schema({
    items: {
        type: [{
            product: {
                test: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Test' },
                lab: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lab' },
                price: { type: Number, required: true }
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
                }], required: false, default: []
            },
            quantity: { type: Number, required: true },
            date: { type: Date, require: false, default: Date.now }
        }], required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { collection: 'carts', timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;