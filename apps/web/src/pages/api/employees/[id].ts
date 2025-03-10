import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the employee ID from the request
    const { id } = req.query;
    
    // Get the API URL from environment variable or use default
    const nestJsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    
    if (req.method === 'GET') {
      // Forward the GET request to NestJS API
      const response = await fetch(`${nestJsApiUrl}/employees/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization ? { 'Authorization': req.headers.authorization as string } : {})
        }
      });
      
      const data = await response.json();
      return res.status(response.status).json(data);
    } else if (req.method === 'PATCH' || req.method === 'PUT') {
      // Forward the update request to NestJS API
      const response = await fetch(`${nestJsApiUrl}/employees/${id}`, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization ? { 'Authorization': req.headers.authorization as string } : {})
        },
        body: JSON.stringify(req.body)
      });
      
      const data = await response.json();
      return res.status(response.status).json(data);
    } else if (req.method === 'DELETE') {
      // Forward the DELETE request to NestJS API
      const response = await fetch(`${nestJsApiUrl}/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization ? { 'Authorization': req.headers.authorization as string } : {})
        }
      });
      
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      res.setHeader('Allow', ['GET', 'PATCH', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error connecting to NestJS API:', error);
    return res.status(500).json({ message: 'Internal server error connecting to API' });
  }
} 