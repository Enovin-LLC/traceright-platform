import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Zap,
  Terminal,
  Cpu,
  Database,
  Shield,
  Radio
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Sample data
const revenueData = [
  { month: 'JAN', value: 45000, target: 42000 },
  { month: 'FEB', value: 52000, target: 48000 },
  { month: 'MAR', value: 48000, target: 50000 },
  { month: 'APR', value: 61000, target: 55000 },
  { month: 'MAY', value: 58000, target: 58000 },
  { month: 'JUN', value: 67000, target: 62000 },
];

const performanceData = [
  { metric: 'Speed', value: 85, fullMark: 100 },
  { metric: 'Quality', value: 92, fullMark: 100 },
  { metric: 'Efficiency', value: 78, fullMark: 100 },
  { metric: 'Accuracy', value: 88, fullMark: 100 },
  { metric: 'Reliability', value: 94, fullMark: 100 },
];

const systemMetrics = [
  { time: '00:00', cpu: 45, memory: 62, network: 78 },
  { time: '04:00', cpu: 52, memory: 58, network: 82 },
  { time: '08:00', cpu: 78, memory: 74, network: 88 },
  { time: '12:00', cpu: 85, memory: 82, network: 92 },
  { time: '16:00', cpu: 72, memory: 68, network: 85 },
  { time: '20:00', cpu: 58, memory: 55, network: 75 },
];

const terminalLogs = [
  { id: 1, type: 'SUCCESS', message: 'SHIPMENT SH-2847 DELIVERED → NY WAREHOUSE', time: '00:02:34' },
  { id: 2, type: 'INFO', message: 'NEW ORDER PO-5832 INITIALIZED', time: '00:05:12' },
  { id: 3, type: 'WARNING', message: 'LOW STOCK ALERT → MATERIAL RM-4521', time: '00:08:45' },
  { id: 4, type: 'SUCCESS', message: 'BATCH B-8472 PRODUCTION COMPLETE', time: '00:12:08' },
  { id: 5, type: 'INFO', message: 'SYSTEM HEALTH CHECK → ALL SYSTEMS OPTIMAL', time: '00:15:22' },
];

export function DashboardCyberpunk() {
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [scanlinePosition, setScanlinePosition] = useState(0);

  // Glitch effect animation
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 100);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Scanline animation
  useEffect(() => {
    const scanlineInterval = setInterval(() => {
      setScanlinePosition((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(scanlineInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridPulse 4s ease-in-out infinite'
        }} />
      </div>

      {/* Scanline Effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          background: `linear-gradient(0deg, transparent ${scanlinePosition}%, rgba(0, 255, 255, 0.5) ${scanlinePosition + 1}%, transparent ${scanlinePosition + 2}%)`
        }}
      />

      {/* Glitch Effect Overlay */}
      {glitchEffect && (
        <div className="fixed inset-0 pointer-events-none mix-blend-overlay">
          <div className="absolute inset-0 bg-cyan-500 opacity-20 animate-pulse" />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  <Terminal className="w-6 h-6 text-black" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              </div>
              <div>
                <h1 className="text-3xl text-white tracking-wider" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                  CYBERPUNK COMMAND CENTER
                </h1>
                <p className="text-cyan-400 text-sm tracking-widest mt-1 font-mono">
                  SYSTEM.STATUS → ONLINE | SECURITY.LEVEL → MAXIMUM
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-black border border-green-400 rounded-md text-green-400 text-xs font-mono shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <div className="flex items-center gap-2">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>LIVE</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-black border border-cyan-400 rounded-md text-cyan-400 text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>
        </div>

        {/* System Status KPIs */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { 
              label: 'TOTAL REVENUE', 
              value: '$2.4M', 
              change: '+18.2%', 
              trend: 'up',
              icon: DollarSign,
              color: 'cyan'
            },
            { 
              label: 'ON-TIME DELIVERY', 
              value: '94.2%', 
              change: '+5.1%', 
              trend: 'up',
              icon: CheckCircle2,
              color: 'green'
            },
            { 
              label: 'ACTIVE SHIPMENTS', 
              value: '3,284', 
              change: '+12.5%', 
              trend: 'up',
              icon: Truck,
              color: 'blue'
            },
            { 
              label: 'SYSTEM ALERTS', 
              value: '47', 
              change: '-23.1%', 
              trend: 'down',
              icon: AlertTriangle,
              color: 'yellow'
            },
          ].map((kpi) => {
            const Icon = kpi.icon;
            const borderColor = kpi.color === 'cyan' ? 'border-cyan-400' : 
                               kpi.color === 'green' ? 'border-green-400' : 
                               kpi.color === 'blue' ? 'border-blue-400' : 
                               'border-yellow-400';
            const textColor = kpi.color === 'cyan' ? 'text-cyan-400' : 
                             kpi.color === 'green' ? 'text-green-400' : 
                             kpi.color === 'blue' ? 'text-blue-400' : 
                             'text-yellow-400';
            const shadowColor = kpi.color === 'cyan' ? 'rgba(6,182,212,0.3)' : 
                               kpi.color === 'green' ? 'rgba(34,197,94,0.3)' : 
                               kpi.color === 'blue' ? 'rgba(59,130,246,0.3)' : 
                               'rgba(234,179,8,0.3)';

            return (
              <div 
                key={kpi.label}
                className={`relative bg-black border ${borderColor} rounded-lg p-6 hover:shadow-2xl transition-all duration-300 group`}
                style={{ boxShadow: `0 0 20px ${shadowColor}` }}
              >
                {/* Animated corner accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 ${borderColor} opacity-20`} style={{
                  clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                }} />

                <div className="relative">
                  <div className={`inline-flex p-3 rounded-lg mb-4 bg-gradient-to-br ${
                    kpi.color === 'cyan' ? 'from-cyan-500/20 to-blue-500/20' :
                    kpi.color === 'green' ? 'from-green-500/20 to-emerald-500/20' :
                    kpi.color === 'blue' ? 'from-blue-500/20 to-indigo-500/20' :
                    'from-yellow-500/20 to-orange-500/20'
                  }`}>
                    <Icon className={`w-6 h-6 ${textColor}`} />
                  </div>
                  <div className="text-gray-400 text-xs tracking-widest font-mono mb-2">
                    {kpi.label}
                  </div>
                  <div className={`text-3xl mb-3 ${textColor} tracking-tight`} style={{
                    textShadow: `0 0 15px ${shadowColor}`
                  }}>
                    {kpi.value}
                  </div>
                  <div className="flex items-center gap-2">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-mono ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.change}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">VS LAST PERIOD</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Revenue Analysis */}
          <div className="bg-black border border-cyan-400/30 rounded-lg p-6" style={{
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)'
          }}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-cyan-400 tracking-wider font-mono">REVENUE ANALYSIS</h3>
                <Badge variant="outline" className="border-cyan-400 text-cyan-400 font-mono text-xs">
                  REAL-TIME
                </Badge>
              </div>
              <p className="text-gray-500 text-xs tracking-widest font-mono">6-MONTH PERFORMANCE TREND</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="month" 
                  stroke="#475569" 
                  style={{ fontSize: '10px', fontFamily: 'monospace' }}
                />
                <YAxis 
                  stroke="#475569" 
                  style={{ fontSize: '10px', fontFamily: 'monospace' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #06b6d4',
                    borderRadius: '4px',
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                  }}
                  labelStyle={{ color: '#06b6d4', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorTarget)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Radar */}
          <div className="bg-black border border-blue-400/30 rounded-lg p-6" style={{
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)'
          }}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-blue-400 tracking-wider font-mono">SYSTEM PERFORMANCE</h3>
                <Badge variant="outline" className="border-green-400 text-green-400 font-mono text-xs">
                  OPTIMAL
                </Badge>
              </div>
              <p className="text-gray-500 text-xs tracking-widest font-mono">MULTI-DIMENSIONAL ANALYSIS</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  stroke="#475569"
                  style={{ fontSize: '10px', fontFamily: 'monospace' }}
                />
                <PolarRadiusAxis 
                  stroke="#475569"
                  style={{ fontSize: '10px', fontFamily: 'monospace' }}
                />
                <Radar 
                  name="Performance" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* System Metrics */}
          <div className="bg-black border border-purple-400/30 rounded-lg p-6" style={{
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.15)'
          }}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-purple-400 tracking-wider font-mono">SYSTEM METRICS</h3>
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-purple-400 animate-pulse" />
                  <span className="text-purple-400 font-mono text-xs">MONITORING</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs tracking-widest font-mono">24-HOUR RESOURCE USAGE</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569"
                  style={{ fontSize: '10px', fontFamily: 'monospace' }}
                />
                <YAxis 
                  stroke="#475569"
                  style={{ fontSize: '10px', fontFamily: 'monospace' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid #a855f7',
                    borderRadius: '4px',
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
                  }}
                  labelStyle={{ color: '#a855f7', fontFamily: 'monospace' }}
                  itemStyle={{ fontFamily: 'monospace' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="network" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Terminal Log Feed */}
          <div className="bg-black border border-green-400/30 rounded-lg p-6" style={{
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.15)'
          }}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-green-400 tracking-wider font-mono">TERMINAL LOG</h3>
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-green-400 animate-pulse" />
                  <span className="text-green-400 font-mono text-xs">STREAMING</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs tracking-widest font-mono">REAL-TIME EVENT MONITOR</p>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {terminalLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-3 p-3 bg-black/50 border-l-2 rounded-r hover:bg-gray-900/50 transition-colors"
                  style={{
                    borderLeftColor: log.type === 'SUCCESS' ? '#22c55e' : 
                                    log.type === 'WARNING' ? '#eab308' : '#06b6d4'
                  }}
                >
                  <div className={`px-2 py-1 rounded text-[10px] ${
                    log.type === 'SUCCESS' ? 'bg-green-500/20 text-green-400 border border-green-400/30' :
                    log.type === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' :
                    'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                  }`}>
                    {log.type}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300">{log.message}</p>
                  </div>
                  <div className="text-gray-500">{log.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-8 p-4 bg-black border border-cyan-400/20 rounded-lg font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">SECURITY:</span>
                <span className="text-green-400">ENCRYPTED</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-400">DATABASE:</span>
                <span className="text-cyan-400">SYNCED</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-gray-400">POWER:</span>
                <span className="text-yellow-400">98.7%</span>
              </div>
            </div>
            <div className="text-gray-500">
              TRACERIGHT v2.0 CYBERPUNK EDITION | BUILD 2025.10.28
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
