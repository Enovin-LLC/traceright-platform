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
  StopCircle,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  Shield,
  Zap,
  Users,
  Clock,
  Package
} from 'lucide-react';
import { 
  analyzeSupplyChain,
  assessRisk,
  generateInsights,
  streamInsights,
  chatWithAI,
  isConfigured
} from '../lib/genkit-browser';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { aiCommandCenterData } from '../lib/ai-command-center-data';

export function AICommandCenter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [activeTab, setActiveTab] = useState('analyze');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [userInput, setUserInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  
  // Use real generated data
  const data = aiCommandCenterData;

  // Supply chain data for AI analysis
  const supplyChainData = {
    suppliers: data.suppliers.slice(0, 10), // Use first 10 suppliers for analysis
    shipments: data.shipments.slice(0, 20), // Use recent shipments
    timeframe: 'monthly' as const,
    focusAreas: ['efficiency', 'sustainability', 'risk management'],
  };

  // Handle supply chain analysis
  const handleAnalyze = async () => {
    if (!isConfigured()) {
      setError('Google AI API key not configured. Please check your .env file.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSupplyChain(supplyChainData);
      setAnalysisData(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Failed to analyze supply chain');
    } finally {
      setLoading(false);
    }
  };

  // Handle risk assessment
  const handleRiskAssessment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use real shipment data
      const activeShipment = data.shipments.find(s => s.status === 'in_transit') || data.shipments[0];
      const riskFactor = data.riskFactors[0]; // Use highest severity risk
      
      const result = await assessRisk({
        shipmentId: activeShipment.id,
        currentLocation: `${activeShipment.progress}% complete - ${activeShipment.route}`,
        weatherData: {
          conditions: riskFactor.category === 'Weather' ? 'Stormy' : 'Clear',
          severity: riskFactor.severity === 'high' ? 8 : riskFactor.severity === 'medium' ? 5 : 3,
        },
        politicalClimate: riskFactor.category === 'Geopolitical' ? 'Unstable' : 'Stable',
      });
      setRiskData(result);
    } catch (error) {
      console.error('Risk assessment failed:', error);
      setError('Failed to assess risk');
    } finally {
      setLoading(false);
    }
  };

  // Handle chat
  const handleChat = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: 'user', content: userInput };
    setChatHistory([...chatHistory, newMessage]);
    setUserInput('');

    setLoading(true);
    try {
      const response = await chatWithAI(userInput, {
        previousMessages: chatHistory.slice(-5),
        systemPrompt: 'You are TraceRight AI Assistant, an expert in supply chain management. Be helpful, concise, and professional.'
      });

      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response.response 
      }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setError('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const results = await generateInsights(
        `Search for "${searchQuery}" in supply chain context. Find relevant suppliers, products, or regulations.`
      );
      // Handle search results
      console.log('Search results:', results);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle streaming demo
  const handleStream = async () => {
    setLoading(true);
    setStreamingText('');
    setError(null);
    
    try {
      const stream = streamInsights('Analyze real-time supply chain trends and provide continuous insights');
      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
        setStreamingText(fullText);
      }
    } catch (error) {
      console.error('Streaming failed:', error);
      setError('Failed to stream insights');
    } finally {
      setLoading(false);
    }
  };

  // Performance metrics chart data - use last 7 days
  const performanceData = data.performanceHistory.slice(-7).map(day => ({
    name: new Date(day.date).toLocaleDateString('en', { weekday: 'short' }),
    efficiency: day.efficiency,
    risk: 100 - day.onTimeDelivery,
    satisfaction: day.customerSatisfaction * 20, // Scale to percentage
    revenue: day.revenue / 1000, // Scale to K
  }));

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            AI Command Center
          </h2>
          <p className="text-muted-foreground mt-1">
            Powered by Gemini 1.5 Pro with advanced Genkit configuration
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            Max Performance Mode
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {loading ? 'Processing...' : 'Ready'}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analyze">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="predict">
            <TrendingUp className="w-4 h-4 mr-2" />
            Predict
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search className="w-4 h-4 mr-2" />
            Search
          </TabsTrigger>
          <TabsTrigger value="chat">
            <Sparkles className="w-4 h-4 mr-2" />
            Assistant
          </TabsTrigger>
          <TabsTrigger value="monitor">
            <Shield className="w-4 h-4 mr-2" />
            Monitor
          </TabsTrigger>
        </TabsList>

        {/* Analysis Tab */}
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Analysis</CardTitle>
              <CardDescription>
                Deep analysis using advanced AI flows with structured I/O
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Analyze Current Supply Chain
              </Button>

              {analysisData && (
                <div className="space-y-3">
                  <Alert>
                    <AlertDescription>{analysisData.summary}</AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">
                          {(analysisData.metrics?.efficiency * 100).toFixed(0)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">
                          {(analysisData.metrics?.riskScore * 100).toFixed(0)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Risk Level</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold">
                          {(analysisData.metrics?.sustainabilityIndex * 100).toFixed(0)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Sustainability</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {/* Always show summary metrics */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Active Shipments</p>
                        <p className="text-2xl font-bold">{data.summary.activeShipments}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total Suppliers</p>
                        <p className="text-2xl font-bold">{data.summary.totalSuppliers}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Avg Lead Time</p>
                        <p className="text-2xl font-bold">{data.summary.avgLeadTime} days</p>
                      </div>
                      <Clock className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total Value</p>
                        <p className="text-2xl font-bold">${(data.summary.totalValue / 1000000).toFixed(1)}M</p>
                      </div>
                      <Package className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>7-Day Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="efficiency" 
                        stackId="1"
                        stroke="#8b5cf6" 
                        fill="#8b5cf6" 
                        fillOpacity={0.6}
                        name="Efficiency %"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="satisfaction" 
                        stackId="1"
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.6}
                        name="Satisfaction"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prediction Tab */}
        <TabsContent value="predict" className="space-y-4">
          {/* Current Risks */}
          <div className="grid grid-cols-2 gap-4">
            {data.riskFactors.map((risk, index) => (
              <Card key={risk.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{risk.category}</h3>
                    <Badge variant={
                      risk.severity === 'high' ? 'destructive' : 
                      risk.severity === 'medium' ? 'secondary' : 
                      'outline'
                    }>
                      {risk.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Probability: {(risk.probability * 100).toFixed(0)}%</span>
                    <span className="text-orange-500">{risk.affectedShipments} shipments affected</span>
                  </div>
                  <Progress value={risk.probability * 100} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Risk Assessment</CardTitle>
              <CardDescription>
                Real-time risk analysis with mitigation strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleRiskAssessment}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mr-2" />
                )}
                Assess Current Risks
              </Button>

              {riskData && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Risk Level:</span>
                    <Badge 
                      variant={
                        riskData.riskLevel === 'high' ? 'destructive' : 
                        riskData.riskLevel === 'medium' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {riskData.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Risk Factors:</p>
                    <div className="flex flex-wrap gap-2">
                      {riskData.factors?.map((factor: string, i: number) => (
                        <Badge key={i} variant="outline">{factor}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Mitigation Strategies:</p>
                    <ul className="text-sm space-y-1">
                      {riskData.mitigationStrategies?.map((strategy: string, i: number) => (
                        <li key={i}>• {strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Semantic Search</CardTitle>
              <CardDescription>
                AI-powered search with embedding-based similarity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search suppliers, products, or regulations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>
                Conversational AI with context awareness
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]' 
                        : 'bg-gray-100 dark:bg-gray-800 mr-auto max-w-[80%]'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is thinking...
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your supply chain..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                />
                <Button onClick={handleChat} disabled={loading}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitor Tab */}
        <TabsContent value="monitor" className="space-y-4">
          {/* Real-time Alerts */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2">Real-Time Alerts</h3>
            {data.alerts.map(alert => (
              <Alert key={alert.id} variant={alert.severity === 'high' ? 'destructive' : 'default'}>
                <AlertTriangle className="h-4 w-4" />
                <div>
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </Alert>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Streaming Analysis</CardTitle>
              <CardDescription>
                Stream continuous insights from supply chain data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleStream} disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  Start Streaming Analysis
                </Button>
                <Button 
                  onClick={() => setLoading(false)} 
                  variant="outline"
                  disabled={!loading}
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>

              {streamingText && (
                <Card>
                  <CardContent className="pt-4">
                    <pre className="text-sm whitespace-pre-wrap">
                      {streamingText}
                    </pre>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">Demand Forecast</h4>
                    <div className="space-y-1 text-sm">
                      <p>Next Week: <span className="font-bold">{data.predictions.demandForecast.nextWeek.toLocaleString()} units</span></p>
                      <p>Next Month: <span className="font-bold">{data.predictions.demandForecast.nextMonth.toLocaleString()} units</span></p>
                      <p>Trend: <Badge variant="outline">{data.predictions.demandForecast.trend}</Badge></p>
                      <Progress value={data.predictions.demandForecast.confidence * 100} className="mt-2" />
                      <p className="text-xs text-muted-foreground">Confidence: {(data.predictions.demandForecast.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">Cost Optimization</h4>
                    <div className="space-y-1 text-sm">
                      <p>Potential Savings: <span className="font-bold text-green-600">${data.predictions.costOptimization.potentialSavings.toLocaleString()}</span></p>
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Recommendations:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {data.predictions.costOptimization.recommendations.slice(0, 3).map((rec, i) => (
                            <li key={i}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Supply Chain Health */}
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2">Supply Chain Health</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span>Overall Health</span>
                    <span className="font-bold">{(data.predictions.supplyChainHealth.overall * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={data.predictions.supplyChainHealth.overall * 100} className="mb-3" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Bottlenecks:</p>
                    {data.predictions.supplyChainHealth.bottlenecks.map((bottleneck, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{bottleneck.location}</span>
                        <Badge variant={bottleneck.severity > 0.6 ? 'destructive' : 'secondary'}>
                          {(bottleneck.severity * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}