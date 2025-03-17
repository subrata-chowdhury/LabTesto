import dbConnect from '@/config/db';
import AdminUser from '@/models/AdminUser';
// import User from '@/models/User';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
// import { hash } from 'bcryptjs';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = await JSON.parse(searchParams.get('filter') || '{}');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        await dbConnect();

        if (filter.email) {
            filter.email = { $regex: `${filter.email}`, $options: 'i' };
        } else {
            delete filter.email;
        }

        const users = await AdminUser.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        users.forEach(user => {
            user.password = '';
        });
        const totalUsers = await AdminUser.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / limit);

        return NextResponse.json({
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });
    } catch {
        return new NextResponse('Error fetching users', { status: 500 });
    }
}