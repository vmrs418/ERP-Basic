import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Forward the request to the NestJS API
    const nestJsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    
    const response = await fetch(`${nestJsApiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Get the response data
    const data = await response.json();

    // Forward the status and response from the NestJS API
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error connecting to NestJS API:', error);
    return res.status(500).json({ message: 'Internal server error connecting to API' });
  }
} 