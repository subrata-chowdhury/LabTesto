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
            phone: string;
            address: {
                pin: number;
                city: string;
                district: string;
                other: string;
            };
        }[];
        quantity: number;
        date: Date;
    }[],
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
                    phone: { type: String, required: false },
                    address: {
                        pin: { type: Number, required: false },
                        city: { type: String, required: false },
                        district: { type: String, required: false },
                        other: { type: String, required: false } // road details
                    }
                }], required: false, default: []
            },
            quantity: { type: Number, required: true },
            date: { type: Date, required: false, default: Date.now }
        }], required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { collection: 'carts', timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;