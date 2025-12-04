import { useState } from 'react';
import { 
  LayoutTemplate, 
  X, 
  Download,
  Star,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  BarChart3,
  ShoppingCart,
  Factory,
  Truck,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate?: (templateId: string) => void;
}

interface Template {
  id: string;
  name: string;
  category: 'financial' | 'sales' | 'operations' | 'executive' | 'marketing';
  description: string;
  icon: any;
  widgets: number;
  rating: number;
  downloads: number;
  preview: string;
}

export function TemplateLibrary({ isOpen, onClose, onApplyTemplate }: TemplateLibraryProps) {
  const { gradientStyleValue, gradientClass } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const templates: Template[] = [
    {
      id: '1',
      name: 'Executive Financial Dashboard',
      category: 'financial',
      description: 'High-level KPIs, revenue tracking, budget variance, and cash flow projections',
      icon: DollarSign,
      widgets: 12,
      rating: 4.9,
      downloads: 2847,
      preview: '#8b5cf6'
    },
    {
      id: '2',
      name: 'Sales Performance Tracker',
      category: 'sales',
      description: 'Sales funnel analysis, conversion rates, team performance, and revenue by region',
      icon: TrendingUp,
      widgets: 10,
      rating: 4.8,
      downloads: 3421,
      preview: '#3b82f6'
    },
    {
      id: '3',
      name: 'Supply Chain Operations',
      category: 'operations',
      description: 'Inventory levels, supplier performance, shipment tracking, and warehouse utilization',
      icon: Package,
      widgets: 15,
      rating: 4.7,
      downloads: 1923,
      preview: '#10b981'
    },
    {
      id: '4',
      name: 'Marketing Analytics Hub',
      category: 'marketing',
      description: 'Multi-channel campaign performance, ROI tracking, and customer acquisition metrics',
      icon: BarChart3,
      widgets: 11,
      rating: 4.8,
      downloads: 2156,
      preview: '#f59e0b'
    },
    {
      id: '5',
      name: 'Customer Success Dashboard',
      category: 'sales',
      description: 'Customer satisfaction, retention rates, support tickets, and NPS tracking',
      icon: Users,
      widgets: 9,
      rating: 4.6,
      downloads: 1654,
      preview: '#ec4899'
    },
    {
      id: '6',
      name: 'E-commerce Analytics',
      category: 'sales',
      description: 'Online sales, conversion funnels, cart abandonment, and product performance',
      icon: ShoppingCart,
      widgets: 13,
      rating: 4.9,
      downloads: 3892,
      preview: '#8b5cf6'
    },
    {
      id: '7',
      name: 'Production Efficiency Monitor',
      category: 'operations',
      description: 'Manufacturing output, quality metrics, downtime tracking, and resource utilization',
      icon: Factory,
      widgets: 14,
      rating: 4.7,
      downloads: 1432,
      preview: '#3b82f6'
    },
    {
      id: '8',
      name: 'Logistics Command Center',
      category: 'operations',
      description: 'Fleet tracking, delivery performance, route optimization, and fuel efficiency',
      icon: Truck,
      widgets: 12,
      rating: 4.8,
      downloads: 2234,
      preview: '#10b981'
    },
    {
      id: '9',
      name: 'CEO Executive Summary',
      category: 'executive',
      description: 'Company-wide KPIs, strategic initiatives, departmental performance, and trends',
      icon: Star,
      widgets: 8,
      rating: 5.0,
      downloads: 4521,
      preview: '#f59e0b'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'financial', label: 'Financial' },
    { value: 'sales', label: 'Sales' },
    { value: 'operations', label: 'Operations' },
    { value: 'executive', label: 'Executive' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <LayoutTemplate className="w-6 h-6" />
              <div>
                <h2 className="text-xl">Template Library</h2>
                <p className="text-sm text-white/90">Professional dashboard templates</p>
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

        {/* Filters */}
        <div className="p-6 border-b border-slate-200 bg-white sticky top-[112px] z-10">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-600">
              {filteredTemplates.length} templates found
            </div>
            <Select defaultValue="popular">
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates Grid */}
          <div className="space-y-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              
              return (
                <Card key={template.id} className="p-4 border-slate-200 hover:shadow-lg transition-all">
                  <div className="flex gap-4">
                    {/* Preview */}
                    <div 
                      className="w-32 h-32 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: template.preview }}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-slate-900 mb-1">{template.name}</h3>
                          <Badge variant="outline" className="text-xs capitalize">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-3">
                        {template.description}
                      </p>

                      <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span>{template.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{template.downloads.toLocaleString()} uses</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <LayoutTemplate className="w-3 h-3" />
                          <span>{template.widgets} widgets</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            onApplyTemplate?.(template.id);
                            onClose();
                          }}
                          style={{ background: gradientStyleValue }}
                          className="text-white text-xs"
                        >
                          Use Template
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="p-12 border-slate-200 text-center">
              <LayoutTemplate className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <div className="text-slate-900 mb-1">No templates found</div>
              <div className="text-sm text-slate-600">
                Try adjusting your search or filters
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card className="p-4 border-blue-200 bg-blue-50">
            <h4 className="text-sm text-blue-900 mb-2">💡 About Templates</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Templates are fully customizable after application</li>
              <li>• All widgets and layouts can be modified</li>
              <li>• Connect your own data sources for live updates</li>
              <li>• Templates include best-practice visualizations</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
