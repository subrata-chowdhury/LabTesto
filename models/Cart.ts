import mongoose, { Schema, Document } from 'mongoose';

interface ICart extends Document {
    items: { product: string, quantity: number }[];
    user: string;
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema = new Schema({
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Test' },
        quantity: { type: Number, required: true }
    }],
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { collection: 'carts', timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;