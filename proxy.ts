import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import verifyToken from './lib/tokenVerify';
import { cookies } from 'next/headers';

export async function proxy(request: NextRequest) {
    const excludeTokenVerification = ['/api/auth/login', '/api/auth/signup', '/api/admin/auth/login', '/api/collector/auth/login', '/api/tests', '/api/labs', '/api/cart/count', '/api/contact'];
    const excludeTokenVerificationPatterns = [/^\/api\/tests\/.*/, /^\/api\/labs\/.*/];
    if (excludeTokenVerification.includes(request.nextUrl.pathname) || excludeTokenVerificationPatterns.some(pattern => pattern.test(request.nextUrl.pathname))) {
        return NextResponse.next();
    }

    let userType: 'admin' | 'user' | 'collector' = 'user';
    if (request.nextUrl.pathname.includes('/collector')) userType = 'collector';
    if (request.nextUrl.pathname.includes('/admin')) userType = 'admin';

    let token = null;
    switch (userType) {
        case 'admin':
            token = (await cookies()).get('adminToken')?.value;
            break;
        case 'collector':
            token = (await cookies()).get('collectorToken')?.value;
            break;
        case 'user':
            token = (await cookies()).get('token')?.value;
            break;

        default:
            token = (await cookies()).get('token')?.value;
            break;
    }

    let user: { id: string, verified: string } | boolean = false;
    if (token) {
        user = await verifyToken<{ id: string, verified: string }>(token, userType);
        if (!user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        const requestHeaders = new Headers(request.headers);
        console.log('User ID from token:', user);
        requestHeaders.set('x-user', user.id);

        return NextResponse.next({
            request: { headers: requestHeaders }
        });
    } else {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // return NextResponse.next();
    // if (user && user.id) {
    //     response.cookies.set('userId', String(user.id), {
    //         httpOnly: true, // Prevent access from client-side JavaScript
    //         // secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
    //         sameSite: 'strict', // Prevent cross-site request forgery
    //         path: '/', // Cookie is available for all routes
    //     });
    // }
    // return response;
}

export const config = {
    matcher: ['/api/:path*'], // Apply middleware only to specific routes
};
