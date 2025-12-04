import { useState } from 'react';
import { 
  Table2, 
  X, 
  Plus,
  ArrowRight,
  BarChart3,
  Settings,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface PivotTableBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PivotConfig {
  rows: string[];
  columns: string[];
  values: string[];
  aggregation: 'sum' | 'average' | 'count' | 'min' | 'max';
}

export function PivotTableBuilder({ isOpen, onClose }: PivotTableBuilderProps) {
  const { gradientStyleValue, gradientClass } = useTheme();
  const [config, setConfig] = useState<PivotConfig>({
    rows: [],
    columns: [],
    values: [],
    aggregation: 'sum'
  });
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [extendedRange, setExtendedRange] = useState(true);

  if (!isOpen) return null;

  // Sample available fields
  const availableFields = [
    'Region', 'Product', 'Category', 'Month', 'Quarter', 
    'Supplier', 'Customer', 'Revenue', 'Units', 'Cost', 'Profit'
  ];

  // Sample pivot table data
  const samplePivotData = [
    { region: 'West', product: 'Widget A', revenue: 125000, units: 1250 },
    { region: 'West', product: 'Widget B', revenue: 98000, units: 980 },
    { region: 'East', product: 'Widget A', revenue: 142000, units: 1420 },
    { region: 'East', product: 'Widget B', revenue: 156000, units: 1560 },
  ];

  const addRow = (field: string) => {
    if (!config.rows.includes(field)) {
      setConfig({ ...config, rows: [...config.rows, field] });
    }
  };

  const addColumn = (field: string) => {
    if (!config.columns.includes(field)) {
      setConfig({ ...config, columns: [...config.columns, field] });
    }
  };

  const addValue = (field: string) => {
    if (!config.values.includes(field)) {
      setConfig({ ...config, values: [...config.values, field] });
    }
  };

  const removeRow = (field: string) => {
    setConfig({ ...config, rows: config.rows.filter(f => f !== field) });
  };

  const removeColumn = (field: string) => {
    setConfig({ ...config, columns: config.columns.filter(f => f !== field) });
  };

  const removeValue = (field: string) => {
    setConfig({ ...config, values: config.values.filter(f => f !== field) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-[700px] h-full bg-white shadow-2xl pointer-events-auto overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 ${gradientClass} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Table2 className="w-6 h-6" />
              <div>
                <h2 className="text-xl">Pivot Table Builder</h2>
                <p className="text-sm text-white/90">Create dynamic data summaries</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Configuration Section */}
          <Card className="p-4 border-slate-200">
            <h3 className="text-slate-900 mb-4">Configure Pivot Table</h3>
            
            {/* Available Fields */}
            <div className="mb-4">
              <Label className="text-sm text-slate-700 mb-2 block">Available Fields</Label>
              <div className="flex flex-wrap gap-2">
                {availableFields.map((field) => (
                  <Badge 
                    key={field}
                    variant="outline"
                    className="cursor-pointer hover:bg-violet-50 hover:border-violet-500 transition-colors"
                  >
                    {field}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Drag fields to Rows, Columns, or Values below
              </p>
            </div>

            {/* Rows */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-slate-700">Rows</Label>
                <Select onValueChange={addRow}>
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue placeholder="Add field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field} value={field} className="text-xs">
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-h-[40px] p-2 border-2 border-dashed border-slate-200 rounded-lg flex flex-wrap gap-2">
                {config.rows.length === 0 ? (
                  <span className="text-xs text-slate-400">Add fields to group by rows</span>
                ) : (
                  config.rows.map((field) => (
                    <Badge 
                      key={field}
                      style={{ background: gradientStyleValue }}
                      className="text-white"
                    >
                      {field}
                      <button
                        onClick={() => removeRow(field)}
                        className="ml-1 hover:text-red-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Columns */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-slate-700">Columns</Label>
                <Select onValueChange={addColumn}>
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue placeholder="Add field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field} value={field} className="text-xs">
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-h-[40px] p-2 border-2 border-dashed border-slate-200 rounded-lg flex flex-wrap gap-2">
                {config.columns.length === 0 ? (
                  <span className="text-xs text-slate-400">Add fields to group by columns</span>
                ) : (
                  config.columns.map((field) => (
                    <Badge 
                      key={field}
                      style={{ background: gradientStyleValue }}
                      className="text-white"
                    >
                      {field}
                      <button
                        onClick={() => removeColumn(field)}
                        className="ml-1 hover:text-red-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Values */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-slate-700">Values</Label>
                <Select onValueChange={addValue}>
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue placeholder="Add field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field} value={field} className="text-xs">
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-h-[40px] p-2 border-2 border-dashed border-slate-200 rounded-lg flex flex-wrap gap-2">
                {config.values.length === 0 ? (
                  <span className="text-xs text-slate-400">Add fields to calculate</span>
                ) : (
                  config.values.map((field) => (
                    <Badge 
                      key={field}
                      style={{ background: gradientStyleValue }}
                      className="text-white"
                    >
                      {field}
                      <button
                        onClick={() => removeValue(field)}
                        className="ml-1 hover:text-red-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Aggregation */}
            <div>
              <Label className="text-sm text-slate-700 mb-2 block">Aggregation Function</Label>
              <Select 
                value={config.aggregation}
                onValueChange={(value: any) => setConfig({ ...config, aggregation: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="min">Minimum</SelectItem>
                  <SelectItem value="max">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Dynamic Update Settings */}
          <Card className="p-4 border-slate-200 bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-violet-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm text-violet-900 mb-3">Dynamic Update Settings</h4>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoUpdate}
                      onChange={(e) => setAutoUpdate(e.target.checked)}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="text-sm text-violet-900">Auto-update on data change</div>
                      <div className="text-xs text-violet-700">
                        Pivot table and charts update automatically when source data changes
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extendedRange}
                      onChange={(e) => setExtendedRange(e.target.checked)}
                      className="mt-0.5"
                    />
                    <div>
                      <div className="text-sm text-violet-900">Extended data range</div>
                      <div className="text-xs text-violet-700">
                        Include additional rows beyond current data for future growth
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Preview */}
          {(config.rows.length > 0 || config.columns.length > 0) && config.values.length > 0 && (
            <Card className="p-4 border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900">Preview</h3>
                <Badge variant="outline" className="text-xs">
                  Sample Data
                </Badge>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Units</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samplePivotData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.region}</TableCell>
                        <TableCell>{row.product}</TableCell>
                        <TableCell className="text-right">${row.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{row.units.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}

          {/* Create Chart from Pivot */}
          {(config.rows.length > 0 || config.columns.length > 0) && config.values.length > 0 && (
            <Card className="p-4 border-slate-200 bg-blue-50">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm text-blue-900 mb-2">Create Pivot Chart</h4>
                  <p className="text-xs text-blue-700 mb-3">
                    Visualize your pivot table data with a dynamic chart that updates automatically
                  </p>
                  <Button
                    size="sm"
                    style={{ background: gradientStyleValue }}
                    className="text-white"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Create Chart
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Best Practices */}
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm text-green-900 mb-2">💡 Best Practices</h4>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Use extended range to accommodate future data growth</li>
                  <li>• Enable auto-update for real-time insights</li>
                  <li>• Group date fields (daily/monthly/quarterly) for better analysis</li>
                  <li>• Limit data ranges to relevant periods for faster processing</li>
                  <li>• Create calculated fields for custom metrics</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              style={{ background: gradientStyleValue }}
              disabled={config.values.length === 0}
            >
              Create Pivot Table
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
