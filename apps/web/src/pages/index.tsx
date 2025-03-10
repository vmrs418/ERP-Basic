import { useEffect, useState } from 'react';
import Home from '../app/page';

export default function Index() {
  const [health, setHealth] = useState<{ status: string; timestamp: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        console.error('Error fetching health status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchHealth();
  }, []);

  return (
    <div>
      <Home />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">API Health Status</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            {health ? (
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{health.status}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{health.timestamp}</dd>
                </div>
              </dl>
            ) : error ? (
              <div className="py-4 px-6 text-red-500">Error: {error}</div>
            ) : (
              <div className="py-4 px-6">Loading health status...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 