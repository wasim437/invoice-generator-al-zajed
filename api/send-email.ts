import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const targetUrl = process.env.SEND_EMAIL_URL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!targetUrl) {
        return res.status(500).json({ error: 'SEND_EMAIL_URL not configured' });
    }

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...req.body,
                password: adminPassword || req.body.password,
            }),
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Error in send-email proxy:', error);
        return res.status(500).json({ error: 'Failed to proxy request' });
    }
}
