import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  AlertTriangle,
  Activity,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart,
  Table as TableIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeContext";
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
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

export type WidgetType =
  | "kpi"
  | "area-chart"
  | "bar-chart"
  | "line-chart"
  | "pie-chart"
  | "activity-feed"
  | "table"
  | "text-header";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  data?: any;
  size: "small" | "medium" | "large" | "xlarge";
  x: number;
  y: number;
  w: number;
  h: number;
}

interface WidgetProps {
  config: WidgetConfig;
}

// Sample data for widgets
const sampleKPIData = {
  label: "Total Revenue",
  value: "$2.4M",
  change: "+18.2%",
  trend: "up" as const,
};

const sampleChartData = [
  { month: "Jan", value: 185000 },
  { month: "Feb", value: 210000 },
  { month: "Mar", value: 198000 },
  { month: "Apr", value: 235000 },
  { month: "May", value: 248000 },
  { month: "Jun", value: 267000 },
];

const samplePieData = [
  { name: "Delivered", value: 2847, color: "#10b981" },
  { name: "In Transit", value: 1243, color: "#3b82f6" },
  { name: "Processing", value: 894, color: "#f59e0b" },
  { name: "Delayed", value: 47, color: "#ef4444" },
];

const sampleActivities = [
  {
    id: 1,
    message: "Shipment SH-2847 delivered",
    time: "5 min ago",
    status: "success",
  },
  {
    id: 2,
    message: "New purchase order created",
    time: "12 min ago",
    status: "info",
  },
  {
    id: 3,
    message: "Low stock alert triggered",
    time: "28 min ago",
    status: "warning",
  },
];

const sampleTableData = [
  {
    id: "ORD-001",
    product: "Widget A",
    quantity: 150,
    status: "Delivered",
  },
  {
    id: "ORD-002",
    product: "Widget B",
    quantity: 240,
    status: "In Transit",
  },
  {
    id: "ORD-003",
    product: "Widget C",
    quantity: 89,
    status: "Processing",
  },
];

export function KPIWidget({ config }: WidgetProps) {
  const { gradientStyleValue } = useTheme();
  const data = config.data || sampleKPIData;
  const isPositive = data.trend === "up";

  return (
    <Card className="p-6 border-slate-200 hover:shadow-lg transition-shadow h-full">
      <div
        className="inline-flex p-3 rounded-xl mb-4"
        style={{ background: gradientStyleValue }}
      >
        <DollarSign className="w-6 h-6 text-white" />
      </div>
      <div className="text-slate-600 text-sm mb-1">
        {data.label}
      </div>
      <div className="text-slate-900 text-2xl mb-2">
        {data.value}
      </div>
      <div className="flex items-center gap-1 text-sm">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600" />
        )}
        <span
          className={
            isPositive ? "text-green-600" : "text-red-600"
          }
        >
          {data.change}
        </span>
      </div>
    </Card>
  );
}

export function AreaChartWidget({ config }: WidgetProps) {
  const data = config.data || sampleChartData;

  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{config.title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id={`color-${config.id}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#8b5cf6"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="#8b5cf6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
          />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill={`url(#color-${config.id})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function BarChartWidget({ config }: WidgetProps) {
  const data = config.data || sampleChartData;

  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{config.title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
          />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Bar dataKey="value" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function LineChartWidget({ config }: WidgetProps) {
  const data = config.data || sampleChartData;

  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{config.title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
          />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: "#8b5cf6", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function PieChartWidget({ config }: WidgetProps) {
  const data = config.data || samplePieData;

  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{config.title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => entry.name}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function ActivityFeedWidget({ config }: WidgetProps) {
  const data = config.data || sampleActivities;

  return (
    <Card className="p-6 border-slate-200 h-full">
      <h3 className="text-slate-900 mb-4">{config.title}</h3>
      <div
        className="space-y-4 overflow-auto"
        style={{ maxHeight: "calc(100% - 3rem)" }}
      >
        {data.map((activity: any) => (
          <div
            key={activity.id}
            className="flex items-start gap-3"
          >
            <div
              className={`w-2 h-2 rounded-full mt-2 ${
                activity.status === "success"
                  ? "bg-green-500"
                  : activity.status === "warning"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">
                {activity.message}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function TableWidget({ config }: WidgetProps) {
  const data = config.data || sampleTableData;

  return (
    <Card className="p-6 border-slate-200 h-full overflow-auto">
      <h3 className="text-slate-900 mb-4">{config.title}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left pb-2 text-slate-600">
              Order ID
            </th>
            <th className="text-left pb-2 text-slate-600">
              Product
            </th>
            <th className="text-left pb-2 text-slate-600">
              Quantity
            </th>
            <th className="text-left pb-2 text-slate-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, index: number) => (
            <tr
              key={index}
              className="border-b border-slate-100"
            >
              <td className="py-3 text-slate-900">{row.id}</td>
              <td className="py-3 text-slate-700">
                {row.product}
              </td>
              <td className="py-3 text-slate-700">
                {row.quantity}
              </td>
              <td className="py-3">
                <Badge variant="outline">{row.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function TextHeaderWidget({ config }: WidgetProps) {
  const { gradientStyleValue } = useTheme();

  return (
    <Card
      className="p-6 border-slate-200 h-full flex items-center justify-center text-center"
      style={{ background: gradientStyleValue }}
    >
      <div>
        <h2 className="text-white text-3xl mb-2">
          {config.title}
        </h2>
        <p className="text-white/90">
          Custom dashboard section
        </p>
      </div>
    </Card>
  );
}

// Widget registry
export const WIDGET_COMPONENTS = {
  kpi: KPIWidget,
  "area-chart": AreaChartWidget,
  "bar-chart": BarChartWidget,
  "line-chart": LineChartWidget,
  "pie-chart": PieChartWidget,
  "activity-feed": ActivityFeedWidget,
  table: TableWidget,
  "text-header": TextHeaderWidget,
};

// Widget catalog for the builder
export const WIDGET_CATALOG = [
  {
    type: "kpi" as WidgetType,
    name: "KPI Card",
    icon: Activity,
    description: "Display key metrics",
    defaultSize: { w: 3, h: 2 },
  },
  {
    type: "area-chart" as WidgetType,
    name: "Area Chart",
    icon: BarChart3,
    description: "Trend visualization",
    defaultSize: { w: 6, h: 3 },
  },
  {
    type: "bar-chart" as WidgetType,
    name: "Bar Chart",
    icon: BarChart3,
    description: "Comparison chart",
    defaultSize: { w: 6, h: 3 },
  },
  {
    type: "line-chart" as WidgetType,
    name: "Line Chart",
    icon: LineChartIcon,
    description: "Time series data",
    defaultSize: { w: 6, h: 3 },
  },
  {
    type: "pie-chart" as WidgetType,
    name: "Pie Chart",
    icon: PieChart,
    description: "Distribution view",
    defaultSize: { w: 4, h: 3 },
  },
  {
    type: "activity-feed" as WidgetType,
    name: "Activity Feed",
    icon: Activity,
    description: "Recent activities",
    defaultSize: { w: 4, h: 4 },
  },
  {
    type: "table" as WidgetType,
    name: "Data Table",
    icon: TableIcon,
    description: "Tabular data",
    defaultSize: { w: 6, h: 4 },
  },
  {
    type: "text-header" as WidgetType,
    name: "Text Header",
    icon: AlertTriangle,
    description: "Section title",
    defaultSize: { w: 12, h: 2 },
  },
];