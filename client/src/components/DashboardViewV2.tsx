import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Filter,
  Download,
  RefreshCw,
  Sparkles,
  Eye,
  Users,
  BarChart3,
  Activity
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Sample data
const revenueData = [
  { month: 'Jan', value: 45000, target: 42000 },
  { month: 'Feb', value: 52000, target: 48000 },
  { month: 'Mar', value: 48000, target: 50000 },
  { month: 'Apr', value: 61000, target: 55000 },
  { month: 'May', value: 58000, target: 58000 },
  { month: 'Jun', value: 67000, target: 62000 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#8b5cf6' },
  { name: 'Clothing', value: 25, color: '#3b82f6' },
  { name: 'Food', value: 20, color: '#10b981' },
  { name: 'Others', value: 20, color: '#f59e0b' },
];

const topProducts = [
  { name: 'Widget Pro X', sales: 2847, change: +12.5, trend: 'up' },
  { name: 'Supply Kit A', sales: 2341, change: +8.2, trend: 'up' },
  { name: 'Component Z-42', sales: 1923, change: -3.1, trend: 'down' },
  { name: 'Assembly Unit', sales: 1654, change: +15.7, trend: 'up' },
];

const recentActivity = [
  { user: 'Sarah Chen', action: 'approved shipment SH-2847', time: '2m ago', avatar: 'SC' },
  { user: 'Mike Johnson', action: 'created new PO-5832', time: '15m ago', avatar: 'MJ' },
  { user: 'Emily Davis', action: 'updated inventory counts', time: '1h ago', avatar: 'ED' },
  { user: 'James Wilson', action: 'completed batch B-8472', time: '2h ago', avatar: 'JW' },
];

export function DashboardViewV2() {
  const { gradientStyleValue, fontClass } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 ${fontClass}`}>
      {/* Header */}
      <div className="border-b border-white/20 bg-white/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: gradientStyleValue }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-slate-900 text-2xl">Dashboard</h1>
                  <p className="text-sm text-slate-600">Welcome back, here's your overview</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                size="sm" 
                className="gap-2 text-white shadow-lg"
                style={{ background: gradientStyleValue }}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPI Cards - Glassmorphic Design */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { 
              label: 'Total Revenue',
              value: '$2.4M',
              change: '+18.2%',
              trend: 'up',
              icon: DollarSign,
              gradient: 'from-violet-500 to-purple-600',
              lightBg: 'from-violet-50 to-purple-50'
            },
            { 
              label: 'Active Orders',
              value: '3,284',
              change: '+12.5%',
              trend: 'up',
              icon: Package,
              gradient: 'from-blue-500 to-cyan-600',
              lightBg: 'from-blue-50 to-cyan-50'
            },
            { 
              label: 'On-Time Delivery',
              value: '94.2%',
              change: '+2.3%',
              trend: 'up',
              icon: Truck,
              gradient: 'from-green-500 to-emerald-600',
              lightBg: 'from-green-50 to-emerald-50'
            },
            { 
              label: 'Avg. Processing',
              value: '2.4h',
              change: '-8.1%',
              trend: 'down',
              icon: Clock,
              gradient: 'from-orange-500 to-red-600',
              lightBg: 'from-orange-50 to-red-50'
            },
          ].map((kpi, index) => {
            const Icon = kpi.icon;
            const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : ArrowDownRight;
            
            return (
              <Card 
                key={index}
                className="relative overflow-hidden border-white/20 bg-white/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.lightBg} opacity-50`} />
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${kpi.trend === 'up' ? 'text-green-700 border-green-200 bg-green-50' : 'text-red-700 border-red-200 bg-red-50'}`}
                    >
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {kpi.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-600">{kpi.label}</div>
                    <div className="text-3xl text-slate-900">{kpi.value}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card className="col-span-2 border-white/20 bg-white/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-slate-900 mb-1">Revenue Overview</h3>
                  <p className="text-sm text-slate-600">Monthly performance vs target</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fill="url(#colorValue)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category Distribution */}
          <Card className="border-white/20 bg-white/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-slate-900 mb-1">By Category</h3>
                  <p className="text-sm text-slate-600">Distribution</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center mb-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {categoryData.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ background: cat.color }}
                      />
                      <span className="text-slate-700">{cat.name}</span>
                    </div>
                    <span className="text-slate-900">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="border-white/20 bg-white/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-slate-900 mb-1">Top Products</h3>
                  <p className="text-sm text-slate-600">Best performing items</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg"
                      >
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-sm text-slate-900 mb-1">{product.name}</div>
                        <div className="text-xs text-slate-600">{product.sales.toLocaleString()} units</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={product.trend === 'up' ? 'text-green-700 border-green-200 bg-green-50' : 'text-red-700 border-red-200 bg-red-50'}
                    >
                      {product.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {Math.abs(product.change)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="border-white/20 bg-white/40 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-slate-900 mb-1">Recent Activity</h3>
                  <p className="text-sm text-slate-600">Latest team updates</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback 
                        className="text-white text-sm shadow-lg"
                        style={{ background: gradientStyleValue }}
                      >
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-900">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span className="text-slate-600">{activity.action}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats Bar */}
        <Card className="border-white/20 bg-white/40 backdrop-blur-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-5 gap-6">
              {[
                { label: 'Active Suppliers', value: '247', icon: Users, color: 'text-blue-600' },
                { label: 'Pending Orders', value: '89', icon: Package, color: 'text-orange-600' },
                { label: 'In Transit', value: '156', icon: Truck, color: 'text-green-600' },
                { label: 'Quality Issues', value: '12', icon: AlertTriangle, color: 'text-red-600' },
                { label: 'Completed Today', value: '342', icon: CheckCircle2, color: 'text-emerald-600' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-xs text-slate-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
