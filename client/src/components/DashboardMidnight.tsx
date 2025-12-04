import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  Truck,
  AlertTriangle,
  Activity,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { LiveLogStream } from './ui/LiveLogStream';
import { ChartDrillDown, DrillDownData, DrillAcrossReport } from './ChartDrillDown';
// import { ColorMixer } from './ColorMixer'; // Commented out - file doesn't exist
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// KPI Data
const kpiData = [
  {
    label: 'Total Revenue',
    value: 2400000,
    displayValue: '$2.4M',
    change: '+18.2%',
    trend: 'up' as const,
    icon: DollarSign,
    prefix: '$',
    decimals: 1,
    divisor: 1000000,
    suffix: 'M',
  },
  {
    label: 'On-Time Delivery',
    value: 94.2,
    displayValue: '94.2%',
    change: '+5.1%',
    trend: 'up' as const,
    icon: CheckCircle2,
    suffix: '%',
    decimals: 1,
  },
  {
    label: 'Active Shipments',
    value: 3284,
    displayValue: '3,284',
    change: '+12.5%',
    trend: 'up' as const,
    icon: Truck,
  },
  {
    label: 'Delayed Orders',
    value: 47,
    displayValue: '47',
    change: '-23.1%',
    trend: 'down' as const,
    icon: AlertTriangle,
  },
];

// Chart Data
const revenueData = [
  { month: 'JAN', revenue: 185000, target: 175000 },
  { month: 'FEB', revenue: 210000, target: 195000 },
  { month: 'MAR', revenue: 198000, target: 200000 },
  { month: 'APR', revenue: 235000, target: 220000 },
  { month: 'MAY', revenue: 248000, target: 240000 },
  { month: 'JUN', revenue: 267000, target: 250000 },
];

const performanceData = [
  { category: 'Quality', current: 92, target: 95 },
  { category: 'Delivery', current: 94, target: 90 },
  { category: 'Cost', current: 88, target: 85 },
  { category: 'Innovation', current: 85, target: 80 },
  { category: 'Sustainability', current: 78, target: 75 },
];

const systemMetricsData = [
  { time: '00:00', uptime: 99.9, latency: 45, throughput: 1200 },
  { time: '04:00', uptime: 99.8, latency: 48, throughput: 1150 },
  { time: '08:00', uptime: 99.9, latency: 42, throughput: 1280 },
  { time: '12:00', uptime: 99.7, latency: 52, throughput: 1320 },
  { time: '16:00', uptime: 99.9, latency: 46, throughput: 1290 },
  { time: '20:00', uptime: 99.8, latency: 49, throughput: 1240 },
];

// Terminal Events
const terminalEvents = [
  { time: '14:23:45', level: 'SUCCESS', message: 'Shipment SH-2847 delivered to New York, NY', category: 'LOGISTICS' },
  { time: '14:22:18', level: 'INFO', message: 'AI Agent processed 347 inventory adjustments', category: 'AUTOMATION' },
  { time: '14:21:02', level: 'WARNING', message: 'Low stock alert: Raw Material RM-4521 below threshold', category: 'INVENTORY' },
  { time: '14:19:33', level: 'SUCCESS', message: 'Quality inspection batch QI-8472 approved (98.2% pass rate)', category: 'QUALITY' },
  { time: '14:18:11', level: 'INFO', message: 'Blockchain verification complete for PO-5832', category: 'SECURITY' },
  { time: '14:16:47', level: 'SUCCESS', message: 'Predictive model updated: 94.7% accuracy on delivery estimates', category: 'AI' },
];

export function DashboardMidnight() {
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [scanlinePosition, setScanlinePosition] = useState(0);

  // Drill-down state
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [drillDownDetails, setDrillDownDetails] = useState<any[]>([]);
  const [drillDownColumns, setDrillDownColumns] = useState<{ key: string; label: string }[]>([]);
  const [drillAcrossReports, setDrillAcrossReports] = useState<DrillAcrossReport[]>([]);
  const [isLoadingDrillDown, setIsLoadingDrillDown] = useState(false);

  // Glitch effect animation
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 100);
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Scanline animation
  useEffect(() => {
    const scanlineInterval = setInterval(() => {
      setScanlinePosition((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(scanlineInterval);
  }, []);

  // Handle chart interactions
  const handleRevenueClick = async (data: any) => {
    setIsLoadingDrillDown(true);
    try {
      const response = await fetch(`/api/dashboard/drilldown/revenue?dataPointId=${data.month}`);
      if (!response.ok) throw new Error('Failed to fetch revenue drill-down data');

      const apiData = await response.json();

      setDrillDownData(apiData.drillDownData);
      setDrillDownDetails(apiData.detailTableData);
      setDrillDownColumns(apiData.detailTableColumns);
      setDrillAcrossReports(apiData.drillAcrossReports);
      setDrillDownOpen(true);
    } catch (error) {
      console.error('Error fetching revenue drill-down:', error);
      // TODO: Show error toast/notification to user
    } finally {
      setIsLoadingDrillDown(false);
    }
  };

  const handlePerformanceClick = async (data: any) => {
    setIsLoadingDrillDown(true);
    try {
      const response = await fetch(`/api/dashboard/drilldown/performance?category=${data.category}`);
      if (!response.ok) throw new Error('Failed to fetch performance drill-down data');

      const apiData = await response.json();

      setDrillDownData(apiData.drillDownData);
      setDrillDownDetails(apiData.detailTableData);
      setDrillDownColumns(apiData.detailTableColumns);
      setDrillAcrossReports(apiData.drillAcrossReports);
      setDrillDownOpen(true);
    } catch (error) {
      console.error('Error fetching performance drill-down:', error);
      // TODO: Show error toast/notification to user
    } finally {
      setIsLoadingDrillDown(false);
    }
  };

  const handleSystemMetricsClick = async (data: any) => {
    setIsLoadingDrillDown(true);
    try {
      const response = await fetch(`/api/dashboard/drilldown/system?time=${data.time}`);
      if (!response.ok) throw new Error('Failed to fetch system metrics drill-down data');

      const apiData = await response.json();

      setDrillDownData(apiData.drillDownData);
      setDrillDownDetails(apiData.detailTableData);
      setDrillDownColumns(apiData.detailTableColumns);
      setDrillAcrossReports(apiData.drillAcrossReports);
      setDrillDownOpen(true);
    } catch (error) {
      console.error('Error fetching system metrics drill-down:', error);
      // TODO: Show error toast/notification to user
    } finally {
      setIsLoadingDrillDown(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridPulse 4s ease-in-out infinite'
        }}
      />

      {/* Scanline Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent ${scanlinePosition}%,
            rgba(168, 85, 247, 0.3) ${scanlinePosition}%,
            rgba(168, 85, 247, 0.3) ${scanlinePosition + 1}%,
            transparent ${scanlinePosition + 1}%
          )`
        }}
      />

      {/* Glitch Effect Overlay */}
      {glitchEffect && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(168, 85, 247, 0.05)',
            animation: 'glitchFlash 0.1s ease-out'
          }}
        />
      )}

      {/* Main Content */}
      <div className="relative z-10 p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              className="text-3xl text-cyan-50 tracking-wider font-semibold uppercase"
              style={{
                letterSpacing: '0.05em',
                textShadow: '0 0 15px rgba(168, 85, 247, 0.3)'
              }}
            >
              Midnight Command Center
            </h1>
            <p
              className="text-purple-400/80 text-sm tracking-widest mt-1"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                letterSpacing: '0.1em'
              }}
            >
              AI-POWERED AUTONOMOUS OPERATIONS // REAL-TIME MONITORING
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className="px-4 py-2 bg-emerald-400/20 border border-emerald-400/40 text-emerald-400 text-xs tracking-widest font-semibold"
              style={{ letterSpacing: '0.15em' }}
            >
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
              SYSTEM OPERATIONAL
            </Badge>
            <Badge
              className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs tracking-widest font-semibold"
              style={{ letterSpacing: '0.15em' }}
            >
              <Zap className="w-3 h-3 mr-2" />
              AI ACTIVE
            </Badge>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.trend === 'up' && !kpi.label.includes('Delayed');
            const isImprovement = kpi.label.includes('Delayed') && kpi.trend === 'down';

            return (
              <Card
                key={kpi.label}
                className="p-6 bg-[#1A1A1A] border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
                style={{
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30"
                    style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)' }}
                  >
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  {(isPositive || isImprovement) ? (
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>

                <p
                  className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2"
                  style={{ letterSpacing: '0.1em' }}
                >
                  {kpi.label}
                </p>

                <p
                  className="text-cyan-50 text-3xl mb-2 font-semibold"
                  style={{
                    fontFamily: '"Segoe UI", system-ui, sans-serif',
                    letterSpacing: '-0.02em'
                  }}
                >
                  <AnimatedCounter
                    value={kpi.divisor ? kpi.value / kpi.divisor : kpi.value}
                    prefix={kpi.prefix || ''}
                    suffix={kpi.suffix || ''}
                    decimals={kpi.decimals || 0}
                    duration={1500}
                  />
                </p>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${isPositive || isImprovement ? 'text-emerald-400' : 'text-red-400'
                      }`}
                  >
                    {kpi.change}
                  </span>
                  <span className="text-gray-500 text-xs">vs last month</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Revenue Chart - 7 cols */}
          <Card
            className="col-span-7 p-6 bg-[#1A1A1A] border-purple-500/30"
            style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)' }}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className="text-cyan-50 text-xl font-semibold tracking-wide mb-1"
                    style={{ letterSpacing: '0.02em' }}
                  >
                    Revenue Performance
                  </h3>
                  <p
                    className="text-gray-400 text-xs tracking-wider"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    6-MONTH TREND ANALYSIS
                  </p>
                </div>
                <Badge
                  className="bg-purple-500/20 border-purple-500/40 text-purple-200 text-xs px-3 py-1"
                >
                  DRILLABLE
                </Badge>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} onClick={(e) => e?.activePayload?.[0]?.payload && handleRevenueClick(e.activePayload[0].payload)}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6B7280" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  style={{
                    fontSize: '11px',
                    fontFamily: 'ui-monospace, monospace',
                    letterSpacing: '0.05em',
                    fill: '#9CA3AF'
                  }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  style={{
                    fontSize: '11px',
                    fontFamily: 'ui-monospace, monospace',
                    fill: '#9CA3AF'
                  }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1F1F1F',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: '#E0E7FF', fontWeight: 600 }}
                  itemStyle={{ color: '#D1D5DB' }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '11px',
                    letterSpacing: '0.05em'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#A855F7"
                  fill="url(#revenueGradient)"
                  strokeWidth={2.5}
                  name="Actual Revenue"
                  style={{ cursor: 'pointer' }}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#6B7280"
                  fill="url(#targetGradient)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Radar - 5 cols */}
          <Card
            className="col-span-5 p-6 bg-[#1A1A1A] border-purple-500/30"
            style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)' }}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className="text-cyan-50 text-xl font-semibold tracking-wide mb-1"
                    style={{ letterSpacing: '0.02em' }}
                  >
                    Performance Metrics
                  </h3>
                  <p
                    className="text-gray-400 text-xs tracking-wider"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    MULTI-DIMENSIONAL ANALYSIS
                  </p>
                </div>
                <Badge
                  className="bg-purple-500/20 border-purple-500/40 text-purple-200 text-xs px-3 py-1"
                >
                  DRILLABLE
                </Badge>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={performanceData} onClick={(e) => e?.activePayload?.[0]?.payload && handlePerformanceClick(e.activePayload[0].payload)}>
                <PolarGrid stroke="#374151" opacity={0.3} />
                <PolarAngleAxis
                  dataKey="category"
                  stroke="#9CA3AF"
                  style={{
                    fontSize: '10px',
                    fontFamily: 'ui-monospace, monospace',
                    letterSpacing: '0.05em',
                    fill: '#9CA3AF'
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  stroke="#9CA3AF"
                  style={{ fontSize: '10px', fill: '#9CA3AF' }}
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#06B6D4"
                  fill="#06B6D4"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  style={{ cursor: 'pointer' }}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#6B7280"
                  fill="#6B7280"
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                />
                <Tooltip
                  contentStyle={{
                    background: '#1F1F1F',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: '#E0E7FF', fontWeight: 600 }}
                  itemStyle={{ color: '#D1D5DB' }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '11px',
                    letterSpacing: '0.05em'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Color Mixer - Commented out until component is created */}
        {/* <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <ColorMixer />
          </div>
        </div> */}

        {/* System Metrics & Terminal */}
        <div className="grid grid-cols-12 gap-6">
          {/* System Metrics Line Chart - 8 cols */}
          <Card
            className="col-span-8 p-6 bg-[#1A1A1A] border-purple-500/30"
            style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)' }}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className="text-cyan-50 text-xl font-semibold tracking-wide mb-1"
                    style={{ letterSpacing: '0.02em' }}
                  >
                    System Health Metrics
                  </h3>
                  <p
                    className="text-gray-400 text-xs tracking-wider"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    24-HOUR INFRASTRUCTURE MONITORING
                  </p>
                </div>
                <Badge
                  className="bg-purple-500/20 border-purple-500/40 text-purple-200 text-xs px-3 py-1"
                >
                  DRILLABLE
                </Badge>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={systemMetricsData} onClick={(e) => e?.activePayload?.[0]?.payload && handleSystemMetricsClick(e.activePayload[0].payload)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  style={{
                    fontSize: '11px',
                    fontFamily: 'ui-monospace, monospace',
                    letterSpacing: '0.05em',
                    fill: '#9CA3AF'
                  }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  style={{
                    fontSize: '11px',
                    fontFamily: 'ui-monospace, monospace',
                    fill: '#9CA3AF'
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1F1F1F',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: '#E0E7FF', fontWeight: 600 }}
                  itemStyle={{ color: '#D1D5DB' }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '11px',
                    letterSpacing: '0.05em'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="uptime"
                  stroke="#34D399"
                  strokeWidth={2}
                  dot={{ fill: '#34D399', r: 3 }}
                  name="Uptime %"
                  style={{ cursor: 'pointer' }}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={{ fill: '#EC4899', r: 3 }}
                  name="Latency (ms)"
                  style={{ cursor: 'pointer' }}
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  dot={{ fill: '#06B6D4', r: 3 }}
                  name="Throughput"
                  style={{ cursor: 'pointer' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Terminal Activity Feed - 4 cols */}
          <Card
            className="col-span-4 p-6 bg-[#0F0F0F] border-purple-500/30"
            style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)' }}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-cyan-50 text-xl font-semibold tracking-wide"
                  style={{ letterSpacing: '0.02em' }}
                >
                  Live Activity
                </h3>
                <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
              <p
                className="text-gray-400 text-xs tracking-wider"
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  letterSpacing: '0.05em'
                }}
              >
                REAL-TIME EVENT STREAM
              </p>
            </div>

            <LiveLogStream
              events={terminalEvents}
              maxEntries={10}
              entryHeight={30}
              entryPadding={5}
              entryBorderRadius={5}
              entryBackgroundColor="#1A1A1A"
              entryBorderColor="#374151"
              entryBorderOpacity={0.2}
              entryTextColor="#D1D5DB"
              entryTextFontSize="10px"
              entryTextFontFamily="ui-monospace, monospace"
              entryTextLetterSpacing="0.05em"
              entryTextLineHeight="1.6"
              entryLevelBadgeBackgroundColor="#34D399"
              entryLevelBadgeTextColor="#34D399"
              entryLevelBadgeBorderColor="#34D399"
              entryLevelBadgeOpacity={0.2}
              entryLevelBadgeFontSize="10px"
              entryLevelBadgeFontFamily="ui-monospace, monospace"
              entryLevelBadgeLetterSpacing="0.1em"
              entryLevelBadgePadding="2px 0.5px"
              entryLevelBadgeBorderRadius="5px"
              entryLevelBadgeFontWeight="600"
              entryCategoryBadgeBackgroundColor="#6B7280"
              entryCategoryBadgeTextColor="#6B7280"
              entryCategoryBadgeBorderColor="#6B7280"
              entryCategoryBadgeOpacity={0.2}
              entryCategoryBadgeFontSize="9px"
              entryCategoryBadgeFontFamily="ui-monospace, monospace"
              entryCategoryBadgeLetterSpacing="0.08em"
              entryCategoryBadgePadding="2px 0.5px"
              entryCategoryBadgeBorderRadius="5px"
              entryCategoryBadgeFontWeight="600"
            />
          </Card>
        </div>
      </div>

      {/* Chart Drill-Down Modal */}
      <ChartDrillDown
        isOpen={drillDownOpen}
        onClose={() => setDrillDownOpen(false)}
        drillDownData={drillDownData}
        detailTableData={drillDownDetails}
        detailTableColumns={drillDownColumns}
        drillAcrossReports={drillAcrossReports}
        isLoading={isLoadingDrillDown}
      />

      {/* Global Animations */}
      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        
        @keyframes glitchFlash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}