import mongoose, { Schema, Document } from 'mongoose';

interface IAdminUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    patientDetails?: {
        name: string;
        phone: string;
        address: {
            pin: number;
            city: string;
            district: string;
            other?: string;
        };
    }[];

    verified: boolean;
    otp?: string;
    otpExpiry?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const AdminUserSchema: Schema = new Schema({
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },

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
    verified: { type: Boolean, default: false },
    otp: { type: String, required: false },
    otpExpiry: { type: Date, required: false },
}, { collection: 'admins', timestamps: true });

const AdminUser = mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;