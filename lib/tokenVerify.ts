import { jwtVerify } from 'jose';
export default async function verifyToken<T>(token: string | undefined | null): Promise<false | T> {
    if (token && token !== '') {
        try {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
            return payload as T;
        } catch {
            return false;
        }
    }
    return false;
}