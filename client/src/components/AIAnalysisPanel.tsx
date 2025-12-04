import { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Lightbulb,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Brain,
  Zap,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

interface AIAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'summary';
  title: string;
  description: string;
  confidence: number;
  actionable?: boolean;
}

export function AIAnalysisPanel({ isOpen, onClose }: AIAnalysisPanelProps) {
  const { gradientStyleValue, gradientClass } = useTheme();
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  if (!isOpen) return null;

  // Sample AI insights (in production, these would come from actual AI analysis)
  const sampleInsights: AIInsight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Revenue Growth Acceleration',
      description: 'Revenue has increased 23% month-over-month. This trend is 2.3x above the quarterly average.',
      confidence: 94,
      actionable: true
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Unusual Shipment Delays in West Region',
      description: 'West Coast shipments are experiencing 47% longer delivery times compared to other regions. Consider investigating logistics partners.',
      confidence: 87,
      actionable: true
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Inventory Optimization Opportunity',
      description: 'Raw material RM-4521 is overstocked by 340%. Recommend reducing next month\'s order by 60% to optimize cash flow.',
      confidence: 91,
      actionable: true
    },
    {
      id: '4',
      type: 'summary',
      title: 'Cross-Table Analysis Complete',
      description: 'Analyzed relationships across 8 data tables. Found strong correlation (r=0.82) between supplier rating and on-time delivery performance.',
      confidence: 96,
      actionable: false
    }
  ];

  const handleAnalyze = () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setInsights(sampleInsights);
      setAnalyzing(false);
      setQuery('');
    }, 2000);
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'anomaly': return AlertCircle;
      case 'recommendation': return Lightbulb;
      case 'summary': return FileText;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend': return 'text-blue-600 bg-blue-50';
      case 'anomaly': return 'text-orange-600 bg-orange-50';
      case 'recommendation': return 'text-green-600 bg-green-50';
      case 'summary': return 'text-violet-600 bg-violet-50';
    }
  };

  const quickPrompts = [
    "Analyze sales trends across all regions",
    "Find anomalies in shipment data",
    "Summarize supplier performance",
    "Identify cost optimization opportunities",
    "Compare this quarter vs last quarter",
    "Predict next month's inventory needs"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-[600px] h-full bg-white shadow-2xl pointer-events-auto overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 ${gradientClass} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h2 className="text-xl">AI Analysis</h2>
                <p className="text-sm text-white/90">Natural language data insights</p>
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
          {/* Natural Language Input */}
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-violet-600" />
              <h3 className="text-slate-900">Ask AI Anything</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Analyze revenue trends across all regions..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || !query.trim()}
                  style={{ background: gradientStyleValue }}
                  className="text-white"
                >
                  {analyzing ? (
                    <Zap className="w-4 h-4 animate-pulse" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Ask questions in plain English. AI will analyze your data and provide insights.
              </p>
            </div>
          </Card>

          {/* Quick Prompts */}
          <div>
            <h4 className="text-sm text-slate-700 mb-3">Quick Prompts</h4>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(prompt)}
                  className="px-3 py-1.5 text-xs rounded-full border-2 border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Analyzing State */}
          {analyzing && (
            <Card className="p-6 border-slate-200 bg-gradient-to-br from-violet-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="animate-spin">
                  <Sparkles className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <div className="text-sm text-violet-900 mb-1">AI is analyzing your data...</div>
                  <div className="text-xs text-violet-700">
                    Processing multi-table relationships, detecting patterns, and generating insights
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* AI Insights */}
          {insights.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-slate-900">AI-Generated Insights</h4>
                <Badge variant="outline" className="text-xs">
                  {insights.length} insights found
                </Badge>
              </div>
              <div className="space-y-3">
                {insights.map((insight) => {
                  const Icon = getInsightIcon(insight.type);
                  const colorClass = getInsightColor(insight.type);
                  
                  return (
                    <Card key={insight.id} className="p-4 border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="text-sm text-slate-900">{insight.title}</h5>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-slate-500">{insight.confidence}%</span>
                              {insight.confidence >= 90 && (
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                          {insight.actionable && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-xs">
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                style={{ background: gradientStyleValue }}
                                className="text-white text-xs"
                              >
                                Take Action
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Capabilities Overview */}
          <Card className="p-4 border-slate-200 bg-slate-50">
            <h4 className="text-sm text-slate-900 mb-3">AI Capabilities</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Multi-table analysis across entire data ecosystem</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Automatic pattern detection and trend identification</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Anomaly detection with confidence scoring</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Intelligent categorization and data classification</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Dynamic chart recommendations based on data structure</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Predictive analytics and forecasting</span>
              </div>
            </div>
          </Card>

          {/* Usage Tips */}
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm text-blue-900 mb-2">💡 Pro Tips</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Be specific: "Compare Q1 vs Q2 revenue by region"</li>
                  <li>• Ask for correlations: "Find relationships between supplier rating and delivery time"</li>
                  <li>• Request predictions: "Forecast next month's demand based on trends"</li>
                  <li>• Seek anomalies: "Identify unusual patterns in shipment delays"</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
