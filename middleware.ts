import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import verifyToken from './lib/tokenVerify';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
    const excludeTokenVerification = ['/api/auth/login', '/api/auth/signup', '/api/tests', '/api/labs'];
    const excludeTokenVerificationPatterns = [/^\/api\/tests\/.*/];
    if (excludeTokenVerification.includes(request.nextUrl.pathname) || excludeTokenVerificationPatterns.some(pattern => pattern.test(request.nextUrl.pathname)) ) {
        return NextResponse.next();
    }

    const token = (await cookies()).get('token')?.value;

    let user: { id: string, institution: string, type: string } | boolean = false;
    if (token) {
        user = await verifyToken<{ id: string, institution: string, type: string }>(token);
        if (!user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
    } else {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const response = NextResponse.next();
    if (user && user.id) {
        response.cookies.set('userId', String(user.id), {
            httpOnly: true, // Prevent access from client-side JavaScript
            // secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
            sameSite: 'strict', // Prevent cross-site request forgery
            path: '/', // Cookie is available for all routes
        });
    }
    return response;
}

export const config = {
    matcher: ['/api/:path*'], // Apply middleware only to specific routes
};
