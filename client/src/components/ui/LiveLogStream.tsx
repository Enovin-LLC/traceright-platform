import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'automation';
}

export function LiveLogStream() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const mockLogs = [
      { type: 'success', message: () => `Shipment ${faker.string.alphanumeric(6).toUpperCase()} delivered to ${faker.location.city()}, ${faker.location.state()}` },
      { type: 'info', message: () => `AI Agent processed ${faker.number.int({ min: 100, max: 500 })} inventory adjustments` },
      { type: 'automation', message: () => 'Autonomous penalty claim filed for late delivery' },
      { type: 'warning', message: () => `High temperature alert for warehouse ${faker.string.alphanumeric(4).toUpperCase()}` },
      { type: 'error', message: () => 'Failed to connect to supplier API - retrying...' },
      { type: 'success', message: () => `Order #${faker.string.alphanumeric(8).toUpperCase()} confirmed` },
      { type: 'automation', message: () => `Auto-rerouted ${faker.number.int({ min: 10, max: 50 })} shipments due to port closure` },
      { type: 'info', message: () => `Blockchain verification complete for batch ${faker.string.alphanumeric(6).toUpperCase()}` },
    ];

    const interval = setInterval(() => {
      const log = faker.helpers.arrayElement(mockLogs);
      setLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          message: log.message(),
          type: log.type as any,
        },
        ...prev,
      ].slice(0, 20));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const typeColors = {
    info: 'text-gray-400',
    success: 'text-railway-green',
    warning: 'text-railway-orange',
    error: 'text-railway-pink',
    automation: 'text-railway-cyan',
  };

  return (
    <div className="bg-railway-black rounded-lg p-4 font-mono text-sm h-[400px] overflow-y-auto">
      {logs.length === 0 && (
        <div className="text-gray-600 text-center py-8">Waiting for activity...</div>
      )}
      {logs.map((log) => (
        <div
          key={log.id}
          className={`mb-2 ${typeColors[log.type]} animate-in fade-in slide-in-from-top-2 duration-300`}
        >
          <span className="text-gray-600">[{log.timestamp}]</span> {log.message}
        </div>
      ))}
    </div>
  );
}
