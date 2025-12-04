import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CheckCircle2, 
  Truck,
  AlertTriangle,
  Package,
  Clock,
  LayoutGrid,
  Settings,
  Sparkles,
  Wand2,
  Users,
  FileText,
  Brain,
  Table2,
  LayoutTemplate,
  Eye,
  Camera,
  Target
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { ThemeCustomizer } from './ThemeCustomizer';
import { DashboardBuilder } from './DashboardBuilder';
import { AIAnalysisPanel } from './AIAnalysisPanel';
import { AIVisionPanel } from './AIVisionPanel';
import { CollaborationPanel } from './CollaborationPanel';
import { DataCleaningTools } from './DataCleaningTools';
import { PivotTableBuilder } from './PivotTableBuilder';
import { TemplateLibrary } from './TemplateLibrary';
import { Dashboard3D } from './Dashboard3D';
import { DashboardCyberpunk } from './DashboardCyberpunk';
import { AIRecommendationsTile } from './AIRecommendationsTile';
import { ChartDrillDown, DrillDownData, DrillAcrossReport } from './ChartDrillDown';
import { PlatformStorySlideshow } from './PlatformStorySlideshow';
import { useTheme } from '@/contexts/ThemeContext';
import { useFeature } from '@/contexts/FeatureFlagsContext';
import { WidgetConfig, WIDGET_COMPONENTS } from './WidgetLibrary';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';

type LayoutType = 'analyst' | 'executive' | 'warehouse' | 'custom';

// Export KPI data for use in other components (e.g., Cinematic Intro)
export const kpiData = [
  {
    label: 'Total Revenue',
    value: '$2.4M',
    numericValue: 2.4,
    prefix: '$',
    suffix: 'M',
    decimals: 1,
    change: '+18.2%',
    trend: 'up' as const,
    icon: DollarSign,
  },
  {
    label: 'On-Time Delivery',
    value: '94.2%',
    numericValue: 94.2,
    suffix: '%',
    decimals: 1,
    change: '+5.1%',
    trend: 'up' as const,
    icon: CheckCircle2,
  },
  {
    label: 'Active Shipments',
    value: '3,284',
    numericValue: 3284,
    change: '+12.5%',
    trend: 'up' as const,
    icon: Truck,
  },
  {
    label: 'Delayed Orders',
    value: '47',
    numericValue: 47,
    change: '-23.1%',
    trend: 'down' as const,
    icon: AlertTriangle,
  },
];

const revenueData = [
  { month: 'Jan', revenue: 185000, orders: 842 },
  { month: 'Feb', revenue: 210000, orders: 956 },
  { month: 'Mar', revenue: 198000, orders: 891 },
  { month: 'Apr', revenue: 235000, orders: 1024 },
  { month: 'May', revenue: 248000, orders: 1156 },
  { month: 'Jun', revenue: 267000, orders: 1248 },
];

const orderStatusData = [
  { status: 'Delivered', count: 2847 },
  { status: 'In Transit', count: 1243 },
  { status: 'Processing', count: 894 },
  { status: 'Delayed', count: 47 },
];

const warehouseData = [
  { warehouse: 'West Coast', utilization: 85, capacity: 100 },
  { warehouse: 'East Coast', utilization: 92, capacity: 100 },
  { warehouse: 'Midwest', utilization: 78, capacity: 100 },
  { warehouse: 'South', utilization: 81, capacity: 100 },
];

const recentActivities = [
  { id: 1, type: 'shipment', message: 'Shipment SH-2847 delivered to New York, NY', time: '5 min ago', status: 'success' },
  { id: 2, type: 'order', message: 'New purchase order PO-5832 created', time: '12 min ago', status: 'info' },
  { id: 3, type: 'alert', message: 'Low stock alert: Raw Material RM-4521', time: '28 min ago', status: 'warning' },
  { id: 4, type: 'receipt', message: 'Inbound receipt IR-3291 inspected and approved', time: '1 hour ago', status: 'success' },
  { id: 5, type: 'batch', message: 'Production batch B-8472 completed', time: '2 hours ago', status: 'success' },
];

export function DashboardView() {
  const [layout, setLayout] = useState<LayoutType>('analyst');
  const [view3D, setView3D] = useState(false);
  const [viewCyberpunk, setViewCyberpunk] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [aiAnalysisOpen, setAIAnalysisOpen] = useState(false);
  const [aiVisionOpen, setAIVisionOpen] = useState(false);
  const [collaborationOpen, setCollaborationOpen] = useState(false);
  const [dataCleaningOpen, setDataCleaningOpen] = useState(false);
  const [pivotBuilderOpen, setPivotBuilderOpen] = useState(false);
  const [templateLibraryOpen, setTemplateLibraryOpen] = useState(false);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [customWidgets, setCustomWidgets] = useState<WidgetConfig[]>([]);
  
  // Drill-down state
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [drillDownDetails, setDrillDownDetails] = useState<any[]>([]);
  const [drillDownColumns, setDrillDownColumns] = useState<{key: string; label: string}[]>([]);
  const [drillAcrossReports, setDrillAcrossReports] = useState<DrillAcrossReport[]>([]);
  
  const { gradientClass, gradientStyleValue, getPrimaryColors, fontClass, isDarkMode } = useTheme();
  
  // Feature Flags
  const show3D = useFeature('dashboard3D');
  const showCyberpunk = useFeature('dashboardCyberpunk');
  const showAIVision = useFeature('aiVision');
  const showAIAnalysis = useFeature('aiAnalysis');
  const showCollaboration = useFeature('collaboration');
  const showThemeCustomizer = useFeature('themeCustomizer');
  const showTemplates = useFeature('templateLibrary');
  const showPivotTables = useFeature('pivotTables');
  const showDataCleaning = useFeature('dataCleaningTools');

  // Load saved widgets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('traceright-custom-widgets');
    if (saved) {
      try {
        setCustomWidgets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load custom widgets:', e);
      }
    }
  }, []);

  // Save widgets to localStorage
  const handleWidgetsChange = (widgets: WidgetConfig[]) => {
    setCustomWidgets(widgets);
    localStorage.setItem('traceright-custom-widgets', JSON.stringify(widgets));
  };

  const layouts: { id: LayoutType | 'custom'; name: string; description: string }[] = [
    { id: 'analyst', name: 'Analyst View', description: 'Detailed charts and trends' },
    { id: 'executive', name: 'Executive Summary', description: 'High-level KPIs' },
    { id: 'warehouse', name: 'Warehouse Ops', description: 'Operations focused' },
    { id: 'custom', name: `Custom${customWidgets.length > 0 ? ` (${customWidgets.length})` : ''}`, description: 'Your widgets' },
  ];

  const primaryColors = getPrimaryColors();

  // Show Slideshow if open
  if (slideshowOpen) {
    return <PlatformStorySlideshow onClose={() => setSlideshowOpen(false)} />;
  }

  // Show Cyberpunk Dashboard if enabled
  if (viewCyberpunk) {
    return (
      <>
        <DashboardCyberpunk />
        <Button
          onClick={() => setViewCyberpunk(false)}
          className="fixed bottom-8 right-8 shadow-2xl bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
        >
          <Eye className="w-5 h-5 mr-2" />
          Exit Cyberpunk Mode
        </Button>
        
        {/* Panels still accessible in Cyberpunk mode */}
        <AIAnalysisPanel isOpen={aiAnalysisOpen} onClose={() => setAIAnalysisOpen(false)} />
        <AIVisionPanel isOpen={aiVisionOpen} onClose={() => setAIVisionOpen(false)} />
        <CollaborationPanel isOpen={collaborationOpen} onClose={() => setCollaborationOpen(false)} />
        <DataCleaningTools isOpen={dataCleaningOpen} onClose={() => setDataCleaningOpen(false)} />
        <PivotTableBuilder isOpen={pivotBuilderOpen} onClose={() => setPivotBuilderOpen(false)} />
        <TemplateLibrary isOpen={templateLibraryOpen} onClose={() => setTemplateLibraryOpen(false)} onApplyTemplate={(templateId) => console.log('Applying template:', templateId)} />
        <ThemeCustomizer isOpen={customizerOpen} onClose={() => setCustomizerOpen(false)} />
      </>
    );
  }

  // Show 3D Dashboard if enabled
  if (view3D) {
    return (
      <>
        <Dashboard3D />
        <Button
          onClick={() => setView3D(false)}
          className="fixed bottom-8 right-8 shadow-2xl text-white"
          style={{ background: gradientStyleValue }}
          size="lg"
        >
          <Eye className="w-5 h-5 mr-2" />
          Switch to 2D View
        </Button>
        
        {/* Panels still accessible in 3D mode */}
        <AIAnalysisPanel isOpen={aiAnalysisOpen} onClose={() => setAIAnalysisOpen(false)} />
        <AIVisionPanel isOpen={aiVisionOpen} onClose={() => setAIVisionOpen(false)} />
        <CollaborationPanel isOpen={collaborationOpen} onClose={() => setCollaborationOpen(false)} />
        <DataCleaningTools isOpen={dataCleaningOpen} onClose={() => setDataCleaningOpen(false)} />
        <PivotTableBuilder isOpen={pivotBuilderOpen} onClose={() => setPivotBuilderOpen(false)} />
        <TemplateLibrary isOpen={templateLibraryOpen} onClose={() => setTemplateLibraryOpen(false)} onApplyTemplate={(templateId) => console.log('Applying template:', templateId)} />
        <ThemeCustomizer isOpen={customizerOpen} onClose={() => setCustomizerOpen(false)} />
      </>
    );
  }

  // Handle chart click for drill-down
  const handleChartClick = (category: string, value: number, context?: Record<string, any>) => {
    // Generate mock detail data based on category
    let detailData: any[] = [];
    let columns: {key: string; label: string}[] = [];
    let reports: DrillAcrossReport[] = [];

    if (category === 'On-Time') {
      columns = [
        { key: 'shipmentId', label: 'Shipment ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'destination', label: 'Destination' },
        { key: 'deliveredDate', label: 'Delivered' },
        { key: 'carrier', label: 'Carrier' }
      ];
      detailData = Array.from({ length: 20 }, (_, i) => ({
        shipmentId: `SH-${2847 + i}`,
        customer: ['Acme Corp', 'TechStart', 'Global Goods', 'MegaMart'][i % 4],
        destination: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX'][i % 4],
        deliveredDate: `Nov ${15 + (i % 10)}, 2024`,
        carrier: ['FedEx', 'UPS', 'DHL'][i % 3]
      }));
      reports = [
        {
          id: 'carrier_performance',
          title: 'Carrier Performance Analysis',
          description: 'Detailed breakdown of on-time performance by carrier',
          chartType: 'bar',
          data: [
            { name: 'FedEx', value: 95 },
            { name: 'UPS', value: 92 },
            { name: 'DHL', value: 88 }
          ]
        },
        {
          id: 'monthly_trend',
          title: 'Monthly On-Time Trend',
          description: 'Historical on-time delivery performance over the past 6 months',
          chartType: 'line',
          data: [
            { name: 'Jun', value: 87 },
            { name: 'Jul', value: 89 },
            { name: 'Aug', value: 91 },
            { name: 'Sep', value: 90 },
            { name: 'Oct', value: 93 },
            { name: 'Nov', value: 95 }
          ]
        }
      ];
    } else if (category === 'Delayed') {
      columns = [
        { key: 'shipmentId', label: 'Shipment ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'delayDays', label: 'Days Delayed' },
        { key: 'reason', label: 'Reason' },
        { key: 'status', label: 'Status' }
      ];
      detailData = Array.from({ length: 15 }, (_, i) => ({
        shipmentId: `SH-${3000 + i}`,
        customer: ['FastFood Inc', 'Retail Giant', 'Tech Startup'][i % 3],
        delayDays: `${1 + (i % 5)} days`,
        reason: ['Weather', 'Customs Hold', 'Carrier Delay', 'Missing Docs'][i % 4],
        status: ['In Transit', 'Processing', 'Escalated'][i % 3]
      }));
      reports = [
        {
          id: 'delay_reasons',
          title: 'Root Cause Analysis',
          description: 'Breakdown of delay reasons with frequency and impact',
          chartType: 'bar',
          data: [
            { name: 'Weather', value: 18 },
            { name: 'Customs', value: 12 },
            { name: 'Carrier', value: 10 },
            { name: 'Docs', value: 7 }
          ]
        },
        {
          id: 'sla_impact',
          title: 'SLA Breach Impact',
          description: 'Financial and customer satisfaction impact of delays',
          chartType: 'table',
          data: [
            { Month: 'October', Breaches: 42, Cost: '$24,500', CSAT: '3.2/5' },
            { Month: 'November', Breaches: 47, Cost: '$27,800', CSAT: '3.1/5' }
          ]
        }
      ];
    }

    setDrillDownData({
      title: `${category} Shipments - Detail View`,
      category,
      value,
      context
    });
    setDrillDownDetails(detailData);
    setDrillDownColumns(columns);
    setDrillAcrossReports(reports);
    setDrillDownOpen(true);
  };

  return (
    <div className={`p-8 space-y-6 ${fontClass}`}>
      {/* Header with Layout Switcher */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-slate-900 dark:text-slate-100">Command Center</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">AI-powered autonomous operations</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Layout Switcher */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {layouts.map((l) => (
              <button
                key={l.id}
                onClick={() => setLayout(l.id as LayoutType)}
                className={`px-4 py-2 rounded-md text-sm transition-all ${
                  layout === l.id
                    ? 'text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                style={layout === l.id ? { background: gradientStyleValue } : {}}
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  {l.name}
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {show3D && (
              <Button
                onClick={() => setView3D(true)}
                variant="outline"
                className="text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                3D View
              </Button>
            )}
            {showCyberpunk && (
              <Button
                onClick={() => setViewCyberpunk(true)}
                variant="outline"
                className="text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Cyberpunk
              </Button>
            )}
            {showAIVision && (
              <Button
                onClick={() => setAIVisionOpen(true)}
                variant="outline"
                className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Vision
              </Button>
            )}
            <Button
              onClick={() => setSlideshowOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-lg"
            >
              <Camera className="w-4 h-4 mr-2" />
              Platform Story
            </Button>
            {showAIAnalysis && (
              <Button
                onClick={() => setAIAnalysisOpen(true)}
                variant="outline"
                className="text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/50"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Analysis
              </Button>
            )}
            {showCollaboration && (
              <Button
                onClick={() => setCollaborationOpen(true)}
                variant="outline"
              >
                <Users className="w-4 h-4 mr-2" />
                Team
              </Button>
            )}
            {showThemeCustomizer && !isDarkMode && (
              <Button
                onClick={() => setCustomizerOpen(true)}
                className="text-white hover:opacity-90"
                style={{ background: gradientStyleValue }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      {(showTemplates || showPivotTables || showDataCleaning) && (
        <Card className="p-4 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wand2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <div>
                <div className="text-sm text-violet-900 dark:text-violet-100">Advanced Tools</div>
                <div className="text-xs text-violet-700 dark:text-violet-300">Powerful features for data analysis</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showTemplates && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTemplateLibraryOpen(true)}
                >
                  <LayoutTemplate className="w-3 h-3 mr-1" />
                  Templates
                </Button>
              )}
              {showPivotTables && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPivotBuilderOpen(true)}
                >
                  <Table2 className="w-3 h-3 mr-1" />
                  Pivot Table
                </Button>
              )}
              {showDataCleaning && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDataCleaningOpen(true)}
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Data Cleaning
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Layout Description */}
      <Card className="p-4 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className={`w-5 h-5 text-${primaryColors.from.split('-')[1]}-600`} />
            <div>
              <span className="text-sm text-slate-900 dark:text-slate-100">
                Active Layout: <strong>{layouts.find(l => l.id === layout)?.name}</strong>
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                — {layouts.find(l => l.id === layout)?.description}
              </span>
            </div>
          </div>
          {layout === 'custom' && customWidgets.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBuilderOpen(true)}
            >
              <Wand2 className="w-3 h-3 mr-1" />
              Edit Widgets
            </Button>
          )}
        </div>
      </Card>

      {/* Executive Summary Layout */}
      {layout === 'executive' && (
        <>
          {/* KPI Cards - Larger for Executive */}
          <div className="grid grid-cols-2 gap-6">
            {kpiData.map((kpi) => {
              const Icon = kpi.icon;
              const isPositive = kpi.trend === 'up' && !kpi.label.includes('Delayed');
              const isImprovement = kpi.label.includes('Delayed') && kpi.trend === 'down';
              
              return (
                <Card key={kpi.label} className="p-8 border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-700/50 transition-shadow">
                  <div 
                    className="inline-flex p-4 rounded-xl mb-6"
                    style={{ background: gradientStyleValue }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mb-2">{kpi.label}</div>
                  <div className="text-slate-900 dark:text-slate-100 text-4xl mb-3">{kpi.value}</div>
                  <div className="flex items-center gap-1">
                    {(isPositive || isImprovement) ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`text-lg ${isPositive || isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                    <span className="text-slate-500 ml-1">vs last month</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Revenue Trend - Full Width */}
          <Card className="p-8 border-slate-200">
            <div className="mb-6">
              <h3 className="text-slate-900 text-2xl">Revenue Performance</h3>
              <p className="text-slate-600 mt-1">6-month trend analysis</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {/* Analyst View Layout */}
      {layout === 'analyst' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-6">
            {kpiData.map((kpi) => {
              const Icon = kpi.icon;
              const isPositive = kpi.trend === 'up' && !kpi.label.includes('Delayed');
              const isImprovement = kpi.label.includes('Delayed') && kpi.trend === 'down';
              
              return (
                <Card key={kpi.label} className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
                  <div 
                    className="inline-flex p-3 rounded-xl mb-4"
                    style={{ background: gradientStyleValue }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-slate-600 text-sm mb-1">{kpi.label}</div>
                  <div className="text-slate-900 text-2xl mb-2">
                    <AnimatedCounter
                      value={kpi.numericValue}
                      prefix={kpi.prefix || ''}
                      suffix={kpi.suffix || ''}
                      decimals={kpi.decimals || 0}
                      duration={1500}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {(isPositive || isImprovement) ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={isPositive || isImprovement ? 'text-green-600' : 'text-red-600'}>
                      {kpi.change}
                    </span>
                    <span className="text-slate-500 ml-1">vs last month</span>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* AI Recommendations Tile */}
            <AIRecommendationsTile />

            {/* Revenue Trend */}
            <Card className="p-6 border-slate-200">
              <div className="mb-6">
                <h3 className="text-slate-900">Revenue & Orders</h3>
                <p className="text-sm text-slate-600 mt-1">6-month trend</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Order Status - Drillable */}
            <Card className="p-6 border-slate-200">
              <div className="mb-6">
                <h3 className="text-slate-900">Order Status</h3>
                <p className="text-sm text-slate-600 mt-1">Current distribution • Click to drill down</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="status" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
                  <Bar 
                    dataKey="count" 
                    fill="#8b5cf6"
                    onClick={(data: any) => handleChartClick(data.status, data.count)}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Warehouse Utilization */}
            <Card className="p-6 border-slate-200">
              <div className="mb-6">
                <h3 className="text-slate-900">Warehouse Utilization</h3>
                <p className="text-sm text-slate-600 mt-1">Capacity usage</p>
              </div>
              <div className="space-y-4">
                {warehouseData.map((warehouse) => (
                  <div key={warehouse.warehouse}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-700">{warehouse.warehouse}</span>
                      <span className="text-sm text-slate-900">{warehouse.utilization}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          warehouse.utilization > 90 ? 'bg-red-500' :
                          warehouse.utilization > 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${warehouse.utilization}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 border-slate-200">
              <div className="mb-6">
                <h3 className="text-slate-900">Recent Activity</h3>
                <p className="text-sm text-slate-600 mt-1">Latest updates</p>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700">{activity.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Supply Chain Health Score */}
            <Card className="p-6 border-slate-200">
              <div className="mb-6">
                <h3 className="text-slate-900">Supply Chain Health</h3>
                <p className="text-sm text-slate-600 mt-1">Overall performance score</p>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#healthGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - 0.87)}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl text-slate-900">87%</span>
                    <span className="text-xs text-slate-500">Excellent</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">On-Time Delivery</span>
                  <span className="text-green-600 font-medium">94%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Inventory Accuracy</span>
                  <span className="text-green-600 font-medium">91%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Quality Score</span>
                  <span className="text-yellow-600 font-medium">78%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Platform Performance Insights */}
          <Card className="p-6 border-slate-200 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-slate-900 dark:text-slate-100">Platform Performance Insights</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Real-time system metrics and adoption</p>
              </div>
              <Button
                size="sm"
                onClick={() => setSlideshowOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700"
              >
                <Camera className="w-3 h-3 mr-1" />
                View Story
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl text-slate-900 dark:text-slate-100">8.4%</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Demo Completion</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl text-slate-900 dark:text-slate-100">420</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Qualified Leads</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl text-slate-900 dark:text-slate-100">52s</span>
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Avg Engagement</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl text-slate-900 dark:text-slate-100">91%</span>
                  <Target className="w-4 h-4 text-orange-600" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Feature Adoption</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-700 dark:text-slate-300">Most Engaging Pillar: <strong>Autonomous Action</strong></span>
                  <span className="text-purple-600 dark:text-purple-400">91% click rate</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-slate-700 dark:text-slate-300">Crisis Demo Success Rate</span>
                  <span className="text-green-600">60% complete</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Custom Dashboard Layout */}
      {layout === 'custom' && (
        <>
          {customWidgets.length === 0 ? (
            <div className="space-y-6">
              <Card className="p-12 border-slate-200 text-center">
                <LayoutGrid className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">No Custom Widgets Yet</h3>
                <p className="text-slate-600 mb-6">
                  Create your personalized dashboard by adding widgets from our library
                </p>
                <Button
                  onClick={() => setBuilderOpen(true)}
                  style={{ background: gradientStyleValue }}
                  className="text-white"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Open Dashboard Builder
                </Button>
              </Card>

              {/* Preview of Available Widgets */}
              <Card className="p-6 border-slate-200">
                <div className="mb-4">
                  <h3 className="text-slate-900">Available Widgets</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Choose from 8 different widget types to build your perfect dashboard
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: DollarSign, name: 'KPI Cards' },
                    { icon: TrendingUp, name: 'Charts' },
                    { icon: Clock, name: 'Activity Feed' },
                    { icon: Package, name: 'Data Tables' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.name} className="p-4 rounded-lg border-2 border-slate-200 text-center">
                        <div 
                          className="inline-flex p-3 rounded-lg mb-2"
                          style={{ background: gradientStyleValue }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-xs text-slate-700">{item.name}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {customWidgets.map((widget) => {
                const WidgetComponent = WIDGET_COMPONENTS[widget.type];
                
                return (
                  <div key={widget.id}>
                    <WidgetComponent config={widget} />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Warehouse Ops Layout */}
      {layout === 'warehouse' && (
        <>
          {/* Simplified KPIs for Warehouse */}
          <div className="grid grid-cols-4 gap-6">
            <Card className="p-6 border-slate-200">
              <div 
                className="inline-flex p-3 rounded-xl mb-4"
                style={{ background: gradientStyleValue }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-slate-600 text-sm mb-1">Active Shipments</div>
              <div className="text-slate-900 text-3xl">3,284</div>
            </Card>
            <Card className="p-6 border-slate-200">
              <div 
                className="inline-flex p-3 rounded-xl mb-4"
                style={{ background: gradientStyleValue }}
              >
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-slate-600 text-sm mb-1">Avg Processing Time</div>
              <div className="text-slate-900 text-3xl">2.4h</div>
            </Card>
            <Card className="p-6 border-slate-200">
              <div 
                className="inline-flex p-3 rounded-xl mb-4"
                style={{ background: gradientStyleValue }}
              >
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-slate-600 text-sm mb-1">Low Stock Items</div>
              <div className="text-slate-900 text-3xl">88</div>
            </Card>
            <Card className="p-6 border-slate-200">
              <div 
                className="inline-flex p-3 rounded-xl mb-4"
                style={{ background: gradientStyleValue }}
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-slate-600 text-sm mb-1">Quality Pass Rate</div>
              <div className="text-slate-900 text-3xl">97.8%</div>
            </Card>
          </div>

          {/* Warehouse Details */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 border-slate-200">
              <div className="mb-6">
                <h3 className="text-slate-900">Warehouse Utilization</h3>
                <p className="text-sm text-slate-600 mt-1">Real-time capacity</p>
              </div>
              <div className="space-y-6">
                {warehouseData.map((warehouse) => (
                  <div key={warehouse.warehouse}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-900">{warehouse.warehouse}</span>
                      <Badge variant="outline">{warehouse.utilization}% Full</Badge>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${warehouse.utilization}%`,
                          background: gradientStyleValue
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Live Map Placeholder */}
            <Card className="p-6 border-slate-200">
              <div className="mb-4">
                <h3 className="text-slate-900">Live Shipment Map</h3>
                <p className="text-sm text-slate-600 mt-1">Real-time tracking</p>
              </div>
              <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `
                    linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px'
                }} />
                <div className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Truck className={`w-8 h-8 text-${primaryColors.from.split('-')[1]}-600`} />
                  </div>
                  <p className="text-slate-600">Navigate to Logistics view</p>
                  <p className="text-sm text-slate-500 mt-1">for interactive map</p>
                </div>
              </div>
            </Card>

            {/* Recent Activity - Warehouse Focused */}
            <Card className="p-6 border-slate-200 col-span-2">
              <div className="mb-6">
                <h3 className="text-slate-900">Warehouse Operations Log</h3>
                <p className="text-sm text-slate-600 mt-1">Recent warehouse activities</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700">{activity.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Theme Customizer */}
      <ThemeCustomizer isOpen={customizerOpen} onClose={() => setCustomizerOpen(false)} />
      
      {/* Dashboard Builder */}
      <DashboardBuilder 
        isOpen={builderOpen} 
        onClose={() => setBuilderOpen(false)}
        widgets={customWidgets}
        onWidgetsChange={handleWidgetsChange}
      />

      {/* AI Vision Panel */}
      <AIVisionPanel 
        isOpen={aiVisionOpen} 
        onClose={() => setAIVisionOpen(false)} 
      />

      {/* AI Analysis Panel */}
      <AIAnalysisPanel 
        isOpen={aiAnalysisOpen} 
        onClose={() => setAIAnalysisOpen(false)} 
      />

      {/* Collaboration Panel */}
      <CollaborationPanel 
        isOpen={collaborationOpen} 
        onClose={() => setCollaborationOpen(false)} 
      />

      {/* Data Cleaning Tools */}
      <DataCleaningTools 
        isOpen={dataCleaningOpen} 
        onClose={() => setDataCleaningOpen(false)} 
      />

      {/* Pivot Table Builder */}
      <PivotTableBuilder 
        isOpen={pivotBuilderOpen} 
        onClose={() => setPivotBuilderOpen(false)} 
      />

      {/* Template Library */}
      <TemplateLibrary 
        isOpen={templateLibraryOpen} 
        onClose={() => setTemplateLibraryOpen(false)} 
        onApplyTemplate={(templateId) => {
          console.log('Applying template:', templateId);
          // In production, this would load the template's widgets
        }}
      />

      {/* Chart Drill Down Modal */}
      <ChartDrillDown
        isOpen={drillDownOpen}
        onClose={() => setDrillDownOpen(false)}
        drillDownData={drillDownData}
        detailTableData={drillDownDetails}
        detailTableColumns={drillDownColumns}
        drillAcrossReports={drillAcrossReports}
      />
    </div>
  );
}