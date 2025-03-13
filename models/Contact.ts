import mongoose, { Schema, Document } from 'mongoose';

interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false }
}, { collection: 'contacts', timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;