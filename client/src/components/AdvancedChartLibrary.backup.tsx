import { useTheme } from '@/contexts/ThemeContext';
import { Card } from './ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Treemap,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle
} from 'recharts';

// Waterfall Chart Component
export function WaterfallChart({ data, title }: { data: any[]; title: string }) {
  const { gradientStyleValue } = useTheme();
  
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8b5cf6" />
          <Bar dataKey="increase" stackId="a" fill="#10b981" />
          <Bar dataKey="decrease" stackId="a" fill="#ef4444" />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Treemap Chart Component
export function TreemapChart({ data, title }: { data: any[]; title: string }) {
  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8b5cf6"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Treemap>
      </ResponsiveContainer>
    </Card>
  );
}

// Scatter Plot Component
export function ScatterPlot({ data, title }: { data: any[]; title: string }) {
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="x" name="Variable X" stroke="#64748b" />
          <YAxis dataKey="y" name="Variable Y" stroke="#64748b" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Data Points" data={data} fill="#8b5cf6" />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Radar Chart Component
export function RadarChartComponent({ data, title }: { data: any[]; title: string }) {
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" stroke="#64748b" />
          <PolarRadiusAxis stroke="#64748b" />
          <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Funnel Chart Component
export function FunnelChart({ data, title }: { data: any[]; title: string }) {
  const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];
  
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => {
          const maxValue = Math.max(...data.map(d => d.value));
          const percentage = (item.value / maxValue) * 100;
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{item.name}</span>
                <span className="text-slate-900">{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
                <div
                  className="h-full flex items-center justify-center text-white text-xs transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                >
                  {percentage.toFixed(0)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Combination Chart (Line + Bar)
export function CombinationChart({ data, title }: { data: any[]; title: string }) {
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" />
          <YAxis yAxisId="left" stroke="#64748b" />
          <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="value1" fill="#8b5cf6" name="Revenue" />
          <Line yAxisId="right" type="monotone" dataKey="value2" stroke="#10b981" strokeWidth={2} name="Growth %" />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Stacked Area Chart
export function StackedAreaChart({ data, title }: { data: any[]; title: string }) {
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorProduct1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorProduct2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorProduct3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="product1" stackId="1" stroke="#8b5cf6" fill="url(#colorProduct1)" />
          <Area type="monotone" dataKey="product2" stackId="1" stroke="#3b82f6" fill="url(#colorProduct2)" />
          <Area type="monotone" dataKey="product3" stackId="1" stroke="#10b981" fill="url(#colorProduct3)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Gauge Chart Component
export function GaugeChart({ value, max, title, label }: { value: number; max: number; title: string; label: string }) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  let color = '#10b981'; // green
  if (percentage < 30) color = '#ef4444'; // red
  else if (percentage < 70) color = '#f59e0b'; // orange
  
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="#e2e8f0"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke={color}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl text-slate-900">{value}</div>
            <div className="text-sm text-slate-600">{label}</div>
            <div className="text-xs text-slate-500 mt-1">{percentage.toFixed(0)}%</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Bullet Chart Component
export function BulletChart({ actual, target, title }: { actual: number; target: number; title: string }) {
  const percentage = (actual / target) * 100;
  
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <div className="space-y-4">
        <div className="relative">
          <div className="w-full bg-slate-100 rounded-full h-8">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-1000"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            >
              <span className="text-white text-xs">{actual.toLocaleString()}</span>
            </div>
          </div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-red-500"
            style={{ left: '100%' }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-red-600">
              Target: {target.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Progress</span>
          <span className="text-slate-900">{percentage.toFixed(1)}%</span>
        </div>
      </div>
    </Card>
  );
}

// Heatmap Component
export function HeatmapChart({ data, title }: { data: any[][]; title: string }) {
  const getColor = (value: number) => {
    const colors = [
      '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9'
    ];
    const index = Math.min(Math.floor(value / 15), colors.length - 1);
    return colors[index];
  };
  
  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{title}</h3>
      <div className="grid grid-cols-7 gap-1">
        {data.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="aspect-square rounded flex items-center justify-center text-xs"
              style={{ backgroundColor: getColor(value) }}
              title={`Value: ${value}`}
            >
              {value > 50 && <span className="text-white">{value}</span>}
              {value <= 50 && <span className="text-slate-700">{value}</span>}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

// Sample data generators
export const sampleWaterfallData = [
  { name: 'Starting', value: 100000, increase: 0, decrease: 0 },
  { name: 'Q1 Sales', value: 0, increase: 25000, decrease: 0 },
  { name: 'Q2 Sales', value: 0, increase: 30000, decrease: 0 },
  { name: 'Operating Costs', value: 0, increase: 0, decrease: -40000 },
  { name: 'Marketing', value: 0, increase: 0, decrease: -15000 },
  { name: 'Ending', value: 100000, increase: 0, decrease: 0 },
];

export const sampleTreemapData = [
  { name: 'Electronics', size: 45000 },
  { name: 'Clothing', size: 32000 },
  { name: 'Food', size: 28000 },
  { name: 'Home & Garden', size: 18000 },
  { name: 'Sports', size: 12000 },
  { name: 'Books', size: 8000 },
];

export const sampleScatterData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
}));

export const sampleRadarData = [
  { subject: 'Quality', value: 85 },
  { subject: 'Speed', value: 92 },
  { subject: 'Cost', value: 78 },
  { subject: 'Reliability', value: 88 },
  { subject: 'Support', value: 95 },
];

export const sampleFunnelData = [
  { name: 'Website Visitors', value: 10000 },
  { name: 'Product Views', value: 6500 },
  { name: 'Add to Cart', value: 3200 },
  { name: 'Checkout Started', value: 1800 },
  { name: 'Purchases', value: 1200 },
];

export const sampleCombinationData = [
  { name: 'Jan', value1: 120000, value2: 15 },
  { name: 'Feb', value1: 145000, value2: 20 },
  { name: 'Mar', value1: 135000, value2: 12 },
  { name: 'Apr', value1: 168000, value2: 24 },
  { name: 'May', value1: 182000, value2: 18 },
  { name: 'Jun', value1: 205000, value2: 22 },
];

export const sampleStackedAreaData = [
  { month: 'Jan', product1: 4000, product2: 2400, product3: 1400 },
  { month: 'Feb', product1: 3000, product2: 1398, product3: 2210 },
  { month: 'Mar', product1: 2000, product2: 9800, product3: 2290 },
  { month: 'Apr', product1: 2780, product2: 3908, product3: 2000 },
  { month: 'May', product1: 1890, product2: 4800, product3: 2181 },
  { month: 'Jun', product1: 2390, product2: 3800, product3: 2500 },
];

export const sampleHeatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
);
