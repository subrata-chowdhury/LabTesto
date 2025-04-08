import dbConnect from '@/config/db';
import Contact from '@/models/Contact';

export async function GET() {
    try {
        await dbConnect();
        
        const totalContacts = await Contact.countDocuments({});
        const resolved = await Contact.countDocuments({ status: 'Resolved' });

        return new Response(JSON.stringify({
            totalContacts,
            resolved,
        }), { status: 200 });
    } catch {
        return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), { status: 500 });
    }
}