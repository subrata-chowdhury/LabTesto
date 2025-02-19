import mongoose, { Schema, Document } from 'mongoose';

interface ICart extends Document {
    items: {
        product: {
            test: mongoose.Types.ObjectId;
            lab: mongoose.Types.ObjectId;
            price: number;
        };
        patientDetails: {
            name: string;
            gender: 'Male' | 'Female' | 'Other';
            age: number;
            other?: string;
        }[];
        quantity: number;
        date: Date;
    }[],
    // address: {
    //     pin: number;
    //     city: string;
    //     district: string;
    //     other?: string; // road details
    // };
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema = new Schema({
    items: {
        type: [{
            product: {
                test: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Test' },
                lab: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Lab' },
                price: { type: Number, required: true },
            },
            patientDetails: {
                type: [{
                    name: { type: String, required: false },
                    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false },
                    age: { type: Number, required: true },
                    other: { type: String, required: false }
                }], required: false, default: []
            },
            quantity: { type: Number, required: true },
            date: { type: Date, required: false, default: Date.now }
        }], required: true
    },
    // address: {
    //     pin: { type: Number, required: false },
    //     city: { type: String, required: false },
    //     district: { type: String, required: false },
    //     other: { type: String, required: false } // road details
    // },

    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { collection: 'carts', timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;