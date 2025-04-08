import mongoose, { Schema, Document } from 'mongoose';

interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    user?: mongoose.Types.ObjectId;
    status: 'Pending' | 'Resolved';
    resolvedAt?: Date | null;
    resolvedBy?: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    resolvedAt: { type: Date, default: null },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', default: null },
}, { collection: 'contacts', timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;