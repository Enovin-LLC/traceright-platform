import { useState } from 'react';
import { 
  Wand2, 
  X, 
  CheckCircle2,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Zap,
  FileSearch,
  Filter,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useTheme } from '@/contexts/ThemeContext';

interface DataCleaningToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DataIssue {
  id: string;
  type: 'duplicate' | 'missing' | 'outlier' | 'format' | 'inconsistent';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affected: number;
  autoFixable: boolean;
}

export function DataCleaningTools({ isOpen, onClose }: DataCleaningToolsProps) {
  const { gradientStyleValue, gradientClass } = useTheme();
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [issues, setIssues] = useState<DataIssue[]>([]);
  const [fixed, setFixed] = useState<string[]>([]);

  if (!isOpen) return null;

  // Sample detected issues
  const sampleIssues: DataIssue[] = [
    {
      id: '1',
      type: 'duplicate',
      severity: 'high',
      description: '23 duplicate supplier records found based on Tax ID',
      affected: 23,
      autoFixable: true
    },
    {
      id: '2',
      type: 'missing',
      severity: 'high',
      description: 'Missing delivery dates in 47 shipment records',
      affected: 47,
      autoFixable: false
    },
    {
      id: '3',
      type: 'outlier',
      severity: 'medium',
      description: '8 purchase orders with unusually high unit costs (>3 standard deviations)',
      affected: 8,
      autoFixable: false
    },
    {
      id: '4',
      type: 'format',
      severity: 'medium',
      description: 'Phone numbers have inconsistent formatting across 156 records',
      affected: 156,
      autoFixable: true
    },
    {
      id: '5',
      type: 'inconsistent',
      severity: 'low',
      description: 'Product category names have mixed capitalization',
      affected: 89,
      autoFixable: true
    }
  ];

  const handleScan = () => {
    setScanning(true);
    setScanProgress(0);
    setIssues([]);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setIssues(sampleIssues);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFix = (issueId: string) => {
    setFixed([...fixed, issueId]);
  };

  const handleFixAll = () => {
    const autoFixableIds = issues
      .filter(issue => issue.autoFixable && !fixed.includes(issue.id))
      .map(issue => issue.id);
    setFixed([...fixed, ...autoFixableIds]);
  };

  const getIssueIcon = (type: DataIssue['type']) => {
    switch (type) {
      case 'duplicate': return Trash2;
      case 'missing': return AlertTriangle;
      case 'outlier': return FileSearch;
      case 'format': return RefreshCw;
      case 'inconsistent': return Filter;
    }
  };

  const getIssueColor = (severity: DataIssue['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getSeverityBadgeColor = (severity: DataIssue['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-orange-600';
      case 'low': return 'bg-yellow-600';
    }
  };

  const totalIssues = issues.length;
  const fixedCount = fixed.length;
  const remainingIssues = totalIssues - fixedCount;

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
              <Wand2 className="w-6 h-6" />
              <div>
                <h2 className="text-xl">Data Cleaning Tools</h2>
                <p className="text-sm text-white/90">AI-powered data quality management</p>
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
          {/* Scan Control */}
          <Card className="p-4 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-slate-900 mb-1">Data Quality Scan</h3>
                <p className="text-sm text-slate-600">
                  AI-powered analysis to detect data quality issues
                </p>
              </div>
              <Button
                onClick={handleScan}
                disabled={scanning}
                style={{ background: gradientStyleValue }}
                className="text-white"
              >
                {scanning ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <FileSearch className="w-4 h-4 mr-2" />
                    Start Scan
                  </>
                )}
              </Button>
            </div>

            {scanning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Analyzing data...</span>
                  <span className="text-slate-900">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            )}
          </Card>

          {/* Summary */}
          {issues.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 border-slate-200 bg-gradient-to-br from-red-50 to-red-100">
                <div className="text-2xl text-red-900 mb-1">{totalIssues}</div>
                <div className="text-sm text-red-700">Issues Found</div>
              </Card>
              <Card className="p-4 border-slate-200 bg-gradient-to-br from-green-50 to-green-100">
                <div className="text-2xl text-green-900 mb-1">{fixedCount}</div>
                <div className="text-sm text-green-700">Fixed</div>
              </Card>
              <Card className="p-4 border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="text-2xl text-orange-900 mb-1">{remainingIssues}</div>
                <div className="text-sm text-orange-700">Remaining</div>
              </Card>
            </div>
          )}

          {/* Issues List */}
          {issues.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900">Detected Issues</h3>
                <Button
                  size="sm"
                  onClick={handleFixAll}
                  disabled={issues.filter(i => i.autoFixable && !fixed.includes(i.id)).length === 0}
                  style={{ background: gradientStyleValue }}
                  className="text-white"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Fix All Auto-Fixable
                </Button>
              </div>

              <div className="space-y-3">
                {issues.map((issue) => {
                  const Icon = getIssueIcon(issue.type);
                  const colorClass = getIssueColor(issue.severity);
                  const isFixed = fixed.includes(issue.id);
                  
                  return (
                    <Card 
                      key={issue.id} 
                      className={`p-4 border-2 transition-all ${
                        isFixed 
                          ? 'border-green-200 bg-green-50 opacity-60' 
                          : colorClass
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isFixed ? 'bg-green-100' : ''}`}>
                          {isFixed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={`text-white text-xs ${getSeverityBadgeColor(issue.severity)}`}>
                                {issue.severity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {issue.type}
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {issue.affected} records
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-900 mb-3">
                            {issue.description}
                          </p>
                          {!isFixed && (
                            <div className="flex gap-2">
                              {issue.autoFixable ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleFix(issue.id)}
                                  style={{ background: gradientStyleValue }}
                                  className="text-white text-xs"
                                >
                                  <Zap className="w-3 h-3 mr-1" />
                                  Auto-Fix
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" className="text-xs">
                                  Review Manually
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="text-xs">
                                View Details
                              </Button>
                            </div>
                          )}
                          {isFixed && (
                            <div className="flex items-center gap-2 text-sm text-green-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Fixed successfully</span>
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

          {/* AI Capabilities */}
          <Card className="p-4 border-slate-200 bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm text-violet-900 mb-2">AI-Enhanced Cleaning</h4>
                <div className="space-y-2 text-xs text-violet-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Automatic duplicate detection using fuzzy matching</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Statistical outlier detection with confidence scoring</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Smart format standardization (dates, phones, addresses)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Pattern recognition for data consistency</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Intelligent missing data imputation suggestions</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4 border-blue-200 bg-blue-50">
            <h4 className="text-sm text-blue-900 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Remove Duplicates
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Standardize Formats
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Fill Missing Values
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Normalize Text
              </Button>
            </div>
          </Card>

          {/* Export Report */}
          {issues.length > 0 && (
            <Button variant="outline" className="w-full">
              Export Data Quality Report
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
