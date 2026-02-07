import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const targetUrl = process.env.FETCH_INVOICES_URL;

    if (!targetUrl) {
        return res.status(500).json({ error: 'FETCH_INVOICES_URL not configured' });
    }

    try {
        const response = await fetch(targetUrl);
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Error in fetch-invoices proxy:', error);
        return res.status(500).json({ error: 'Failed to proxy request' });
    }
}
