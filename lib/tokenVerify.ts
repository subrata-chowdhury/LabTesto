import { jwtVerify } from 'jose';
export default async function verifyToken<T>(token: string | undefined | null, isAdmin: boolean = false): Promise<false | T> {
    if (token && token !== '') {
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(isAdmin ? process.env.ADMIN_JWT_SECRET : process.env.JWT_SECRET));
            return payload as T;
        } catch {
            return false;
        }
    }
    return false;
}