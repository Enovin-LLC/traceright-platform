import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Brain, 
  Search, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Sparkles,
  Loader2,
  Send,
  RefreshCw,
  Download,
  BarChart3,
  Shield,
  Zap,
  Users,
  Clock,
  Package,
  Activity,
  TruckIcon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';
import { aiCommandCenterData } from '../lib/ai-command-center-data';
import { aiCommandFlows } from '../lib/ai-command-flows';
import { toast } from 'sonner';

export function AICommandCenterV2() {
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [userInput, setUserInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  
  // Use real generated data
  const data = aiCommandCenterData;

  // Check if API key is configured
  const isAPIConfigured = () => {
    return !!import.meta.env.VITE_GOOGLE_AI_API_KEY;
  };

  // Handle supply chain analysis
  const handleAnalyze = async () => {
    if (!isAPIConfigured()) {
      toast.error('Google AI API key not configured. Add VITE_GOOGLE_AI_API_KEY to your .env file.');
      return;
    }
    
    setLoading(true);
    try {
      const result = await aiCommandFlows.analyzeSupplyChain({
        metrics: {
          shipments: data.shipments.slice(0, 20),
          suppliers: data.suppliers.slice(0, 10),
          performance: data.performanceHistory.slice(-7),
        },
        timeframe: 'last 30 days',
        focus: 'overall',
      });
      
      setAnalysisResult(result);
      toast.success('Supply chain analysis completed!');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze supply chain');
    } finally {
      setLoading(false);
    }
  };

  // Handle demand forecasting
  const handleForecast = async () => {
    if (!isAPIConfigured()) {
      toast.error('Google AI API key not configured');
      return;
    }
    
    setLoading(true);
    try {
      // Prepare historical data from performance history
      const historicalData = data.performanceHistory.map((day, index) => ({
        date: new Date(Date.now() - (30 - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        demand: Math.floor(Math.random() * 1000) + 500,
        factors: {
          efficiency: day.efficiency,
          satisfaction: day.satisfaction,
        }
      }));

      const result = await aiCommandFlows.forecastDemand({
        historicalData,
        productCategory: 'Electronics Components',
        forecastPeriod: 14,
      });
      
      setForecastResult(result);
      toast.success('Demand forecast generated!');
    } catch (error) {
      console.error('Forecast failed:', error);
      toast.error('Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  };

  // Handle risk assessment
  const handleRiskAssessment = async () => {
    if (!isAPIConfigured()) {
      toast.error('Google AI API key not configured');
      return;
    }
    
    setLoading(true);
    try {
      const result = await aiCommandFlows.assessRisks({
        supplyChainData: {
          suppliers: data.suppliers,
          shipments: data.shipments,
          inventory: data.suppliers.map(s => ({
            supplierId: s.id,
            stockLevel: Math.floor(Math.random() * 1000) + 100,
          })),
        },
        externalFactors: ['Weather disruptions', 'Geopolitical tensions', 'Market volatility'],
      });
      
      setRiskAssessment(result);
      toast.success('Risk assessment completed!');
    } catch (error) {
      console.error('Risk assessment failed:', error);
      toast.error('Failed to assess risks');
    } finally {
      setLoading(false);
    }
  };

  // Handle chat interaction
  const handleChat = async () => {
    if (!userInput.trim() || !isAPIConfigured()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: userInput }]);
    setUserInput('');
    setStreamingText('');
    
    try {
      const response = aiCommandFlows.chat.stream({
        question: userInput,
        context: {
          currentMetrics: {
            activeShipments: data.summary.activeShipments,
            totalSuppliers: data.summary.totalSuppliers,
            avgLeadTime: data.summary.avgLeadTime,
          },
          recentAlerts: data.alerts.slice(0, 3),
        },
      });

      let fullResponse = '';
      for await (const chunk of response.stream) {
        fullResponse += chunk;
        setStreamingText(fullResponse);
      }

      const result = await response.output;
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: result.answer 
      }]);
      
      setStreamingText('');
    } catch (error) {
      console.error('Chat failed:', error);
      toast.error('Failed to process chat request');
    }
  };

  // Chart colors
  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Command Center</h1>
            <p className="text-slate-600">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <Badge variant={isAPIConfigured() ? "default" : "secondary"} className="gap-1">
          <Activity className="w-3 h-3" />
          {isAPIConfigured() ? 'AI Ready' : 'API Key Required'}
        </Badge>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analyze">Analyze</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.activeShipments}</div>
                <p className="text-xs text-slate-500">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.totalSuppliers}</div>
                <p className="text-xs text-slate-500">98% active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Avg Lead Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.summary.avgLeadTime}d</div>
                <p className="text-xs text-green-600">-2 days improved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${data.summary.totalValue.toLocaleString()}</div>
                <p className="text-xs text-slate-500">This quarter</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Efficiency and satisfaction metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#8B5CF6" name="Efficiency %" />
                  <Line type="monotone" dataKey="satisfaction" stroke="#10B981" name="Satisfaction %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Real-time supply chain notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.alerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.severity === 'high' ? 'text-red-500' :
                    alert.severity === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-slate-500">{alert.timestamp}</p>
                  </div>
                  <Badge variant={
                    alert.severity === 'high' ? 'destructive' :
                    alert.severity === 'medium' ? 'outline' :
                    'secondary'
                  }>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyze Tab */}
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Analysis</CardTitle>
              <CardDescription>AI-powered insights into your supply chain operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !isAPIConfigured()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Supply Chain
                  </>
                )}
              </Button>

              {analysisResult && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="text-sm text-slate-600">{analysisResult.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Findings</h4>
                    <ul className="space-y-1">
                      {analysisResult.keyFindings.map((finding: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-purple-500 mt-0.5" />
                          <span className="text-sm">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <div className="space-y-2">
                      {analysisResult.recommendations.map((rec: any, i: number) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{rec.action}</span>
                            <Badge variant={
                              rec.priority === 'high' ? 'destructive' :
                              rec.priority === 'medium' ? 'default' :
                              'secondary'
                            }>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">{rec.expectedImpact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecast Tab */}
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecasting</CardTitle>
              <CardDescription>AI-powered predictions for inventory planning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleForecast} 
                disabled={loading || !isAPIConfigured()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Forecast...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Forecast
                  </>
                )}
              </Button>

              {forecastResult && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium mb-2">Trend Analysis</h4>
                    <div className="flex items-center gap-4">
                      <TrendingUp className={`w-8 h-8 ${
                        forecastResult.trends.direction === 'increasing' ? 'text-green-500' :
                        forecastResult.trends.direction === 'decreasing' ? 'text-red-500' :
                        'text-yellow-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">
                          {forecastResult.trends.direction === 'increasing' ? 'Upward' :
                           forecastResult.trends.direction === 'decreasing' ? 'Downward' :
                           'Stable'} Trend
                        </p>
                        <p className="text-xs text-slate-600">
                          {Math.abs(forecastResult.trends.percentage)}% change over {forecastResult.trends.period}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">14-Day Forecast</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={forecastResult.forecast}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="predictedDemand" 
                          stroke="#8B5CF6" 
                          fill="#8B5CF6" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {forecastResult.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Package className="w-4 h-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Identify and mitigate supply chain risks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleRiskAssessment} 
                disabled={loading || !isAPIConfigured()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assessing Risks...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Assess Risks
                  </>
                )}
              </Button>

              {riskAssessment && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Overall Risk Score</h4>
                      <span className="text-2xl font-bold text-purple-600">
                        {riskAssessment.riskScore}/100
                      </span>
                    </div>
                    <Progress value={riskAssessment.riskScore} className="h-2" />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Critical Risks</h4>
                    <div className="space-y-3">
                      {riskAssessment.criticalRisks.map((risk: any, i: number) => (
                        <div key={i} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{risk.category}</span>
                            <Badge variant={
                              risk.impact === 'critical' ? 'destructive' :
                              risk.impact === 'high' ? 'destructive' :
                              risk.impact === 'medium' ? 'default' :
                              'secondary'
                            }>
                              {risk.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600">{risk.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <span>Probability: {risk.probability}%</span>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1">Mitigation Steps:</p>
                            <ul className="text-xs text-slate-600 space-y-0.5">
                              {risk.mitigationSteps.map((step: string, j: number) => (
                                <li key={j}>• {step}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Strategic Recommendations</h4>
                    <ul className="space-y-1">
                      {riskAssessment.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Ask questions about your supply chain</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-slate-50 rounded-lg">
                {chatHistory.length === 0 && (
                  <div className="text-center text-slate-500 mt-8">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm">Ask me anything about your supply chain!</p>
                    <div className="mt-4 space-y-2">
                      <p className="text-xs">Try asking:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserInput("What are my top performing suppliers?")}
                        >
                          Top suppliers?
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserInput("Are there any shipment delays?")}
                        >
                          Shipment delays?
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserInput("How can I reduce lead times?")}
                        >
                          Reduce lead times?
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-purple-100 ml-auto max-w-[80%]' 
                      : 'bg-white border max-w-[80%]'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
                
                {streamingText && (
                  <div className="p-3 bg-white border rounded-lg max-w-[80%]">
                    <p className="text-sm">{streamingText}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Ask about suppliers, shipments, inventory..."
                  disabled={!isAPIConfigured()}
                />
                <Button 
                  onClick={handleChat} 
                  disabled={loading || !userInput.trim() || !isAPIConfigured()}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {!isAPIConfigured() && (
                <Alert className="mt-4">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    Google AI API key not configured. Add VITE_GOOGLE_AI_API_KEY to your .env file to enable AI features.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}