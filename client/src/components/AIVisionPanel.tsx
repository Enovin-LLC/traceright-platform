import { useState } from 'react';
import {
  Camera,
  X,
  Upload,
  Scan,
  AlertTriangle,
  CheckCircle2,
  Package,
  BarChart3,
  FileText,
  Zap,
  Eye,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { VisionAnalysisResult, MOCK_VISION_RESULTS } from '@/lib/ai-vision-prompts';

interface AIVisionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIVisionPanel({ isOpen, onClose }: AIVisionPanelProps) {
  const { gradientStyleValue, gradientClass } = useTheme();
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VisionAnalysisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        startAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    // Simulate AI analysis with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          // Use mock result
          setResult(MOCK_VISION_RESULTS[Math.random() > 0.5 ? 0 : 1]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'NONE': return 'text-green-600 bg-green-50 border-green-200';
      case 'MINOR': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'MODERATE': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'SEVERE': return 'text-red-600 bg-red-50 border-red-200';
      case 'CRITICAL': return 'text-red-900 bg-red-100 border-red-300';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
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
              <Camera className="w-6 h-6" />
              <div>
                <h2 className="text-xl">AI Vision Analysis</h2>
                <p className="text-sm text-white/90">Intelligent image analysis for supply chain</p>
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
          {/* Upload Section */}
          {!selectedImage && !result && (
            <Card className="p-8 border-2 border-dashed border-slate-300 text-center hover:border-violet-500 transition-colors">
              <div className="space-y-4">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{ background: gradientStyleValue }}
                >
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-slate-900 mb-2">Upload Image for Analysis</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Upload photos of shipments, labels, inventory, or warehouse scenes
                  </p>
                </div>
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    as="span"
                    style={{ background: gradientStyleValue }}
                    className="text-white cursor-pointer"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </label>
              </div>
            </Card>
          )}

          {/* Analyzing State */}
          {analyzing && (
            <Card className="p-6 border-slate-200 bg-gradient-to-br from-violet-50 to-purple-50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <Sparkles className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-sm text-violet-900 mb-1">AI Vision analyzing image...</div>
                    <div className="text-xs text-violet-700">
                      Scanning barcodes, detecting objects, checking compliance
                    </div>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-violet-700">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </Card>
          )}

          {/* Results */}
          {result && (
            <>
              {/* Summary Card */}
              <Card className="p-6 border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-start gap-3">
                  <Eye className="w-6 h-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-blue-900">Analysis Summary</h3>
                      <Badge variant="outline" className="text-xs">
                        {(result.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-800">{result.summary}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      Analyzed: {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Barcodes */}
              {result.barcodes.length > 0 && (
                <Card className="p-6 border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Scan className="w-5 h-5 text-violet-600" />
                    <h3 className="text-slate-900">Barcodes Detected</h3>
                    <Badge variant="outline">{result.barcodes.length}</Badge>
                  </div>
                  <div className="space-y-3">
                    {result.barcodes.map((barcode, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="text-sm text-slate-900 mb-1">{barcode.value}</div>
                          <div className="text-xs text-slate-600">{barcode.location}</div>
                        </div>
                        <Badge variant="outline">{barcode.type}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Text Recognition */}
              {result.textRecognition.length > 0 && (
                <Card className="p-6 border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-slate-900">Text Recognition</h3>
                    <Badge variant="outline">{result.textRecognition.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {result.textRecognition.map((text, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="text-xs text-slate-600 mb-1">{text.key}</div>
                          <div className="text-sm text-slate-900">{text.value}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={text.confidence * 100} className="w-20 h-1" />
                          <span className="text-xs text-slate-600">{(text.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Object Counting */}
              {result.objectCounting.length > 0 && (
                <Card className="p-6 border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-green-600" />
                    <h3 className="text-slate-900">Object Counting</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {result.objectCounting.map((obj, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg text-center">
                        <div className="text-2xl text-green-900 mb-1">{obj.count}</div>
                        <div className="text-xs text-green-700">{obj.object}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Damage Assessment */}
              <Card className={`p-6 border-2 ${getSeverityColor(result.damageAssessment.severity)}`}>
                <div className="flex items-start gap-3">
                  {result.damageAssessment.detected ? (
                    <AlertTriangle className="w-6 h-6 mt-1" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm">Damage Assessment</h3>
                      <Badge className={getSeverityColor(result.damageAssessment.severity)}>
                        {result.damageAssessment.severity}
                      </Badge>
                    </div>
                    {result.damageAssessment.detected && (
                      <>
                        <div className="text-sm mb-2">
                          <strong>Type:</strong> {result.damageAssessment.damageType}
                        </div>
                        <div className="text-sm mb-2">
                          <strong>Location:</strong> {result.damageAssessment.location}
                        </div>
                      </>
                    )}
                    <div className="text-sm">
                      <strong>Recommendation:</strong> {result.damageAssessment.recommendation}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Compliance Check */}
              <Card className="p-6 border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-slate-900">Compliance Check</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-700">Hazmat Detected</span>
                    {result.complianceCheck.hazmatDetected ? (
                      <Badge className="bg-orange-600 text-white">Yes</Badge>
                    ) : (
                      <Badge className="bg-green-600 text-white">No</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-700">Required Markings</span>
                    {result.complianceCheck.requiredMarkingsPresent ? (
                      <Badge className="bg-green-600 text-white">Present</Badge>
                    ) : (
                      <Badge className="bg-red-600 text-white">Missing</Badge>
                    )}
                  </div>
                  {result.complianceCheck.violations && result.complianceCheck.violations.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-sm text-red-900 mb-2">Violations Detected:</div>
                      <ul className="text-sm text-red-700 space-y-1">
                        {result.complianceCheck.violations.map((violation, index) => (
                          <li key={index}>• {violation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setSelectedImage(null);
                  }}
                >
                  Analyze Another
                </Button>
                <Button
                  className="flex-1 text-white"
                  style={{ background: gradientStyleValue }}
                >
                  Export Report
                </Button>
              </div>
            </>
          )}

          {/* Capabilities */}
          <Card className="p-6 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm text-violet-900 mb-3">AI Vision Capabilities</h4>
                <div className="space-y-2 text-xs text-violet-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Barcode & QR code scanning with type identification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>OCR text extraction (PO numbers, dates, addresses)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Automatic object counting (pallets, boxes, units)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Damage detection with severity assessment</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Compliance verification (hazmat, safety markings)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                    <span>Confidence scoring for all detections</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
