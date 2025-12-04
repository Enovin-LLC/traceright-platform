import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
  TrendingUp,
  DollarSign,
  Package,
  Zap,
  Eye,
  Sparkles,
  Camera,
  Settings
} from 'lucide-react';

interface Metric3DProps {
  label: string;
  value: number;
  max: number;
  color: string;
  glowColor: string;
}

function Metric3D({ label, value, max, color, glowColor }: Metric3DProps) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="absolute" style={{
      transform: 'rotate3d(1, 0, 0, 60deg)',
      transformStyle: 'preserve-3d'
    }}>
      <svg width="200" height="200" className="transform -rotate-90">
        <defs>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
        />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={`url(#gradient-${label})`}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter={`url(#glow-${label})`}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="text-xs opacity-80 mb-1">{label}</div>
        <div className="text-sm">({percentage.toFixed(0)}%)</div>
      </div>
    </div>
  );
}

export function Dashboard3D() {
  const { gradientStyleValue, gradientClass, fontClass } = useTheme();
  const [rotation, setRotation] = useState(0);
  const [overallStatus, setOverallStatus] = useState(78);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Metrics positions in 3D space
  const metrics = [
    { 
      label: 'Resource Utilization',
      value: 65,
      max: 100,
      color: '#06b6d4',
      glowColor: '#22d3ee',
      angle: 0
    },
    { 
      label: 'Budget Adherence',
      value: 88,
      max: 100,
      color: '#c084fc',
      glowColor: '#e9d5ff',
      angle: 90
    },
    { 
      label: 'Project Completion',
      value: 82,
      max: 100,
      color: '#fb923c',
      glowColor: '#fdba74',
      angle: 180
    },
    { 
      label: 'Looker Studio',
      value: 65,
      max: 100,
      color: '#06b6d4',
      glowColor: '#22d3ee',
      angle: 270
    }
  ];

  return (
    <div className={`p-8 space-y-6 ${fontClass}`}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: gradientStyleValue }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-slate-900">TraceRight 2.0</h1>
            <p className="text-slate-600">Next-Generation 3D Analytics Dashboard</p>
          </div>
        </div>
      </div>

      {/* 3D Visualization Card */}
      <Card className="relative overflow-hidden border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12" style={{ minHeight: '600px' }}>
        {/* Starfield Background */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* 3D Container */}
        <div 
          className="relative mx-auto"
          style={{
            width: '500px',
            height: '500px',
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Central Glass Panel */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `rotateY(${rotation}deg) rotateX(20deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.05s linear'
            }}
          >
            {/* Glass effect panel */}
            <div 
              className="relative rounded-3xl backdrop-blur-xl border border-white/20 overflow-hidden"
              style={{
                width: '400px',
                height: '400px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))',
                boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.3), inset 0 0 60px rgba(139, 92, 246, 0.1)',
              }}
            >
              {/* Center Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Outer glow ring */}
                  <div 
                    className="absolute inset-0 rounded-full blur-2xl opacity-60"
                    style={{
                      width: '280px',
                      height: '280px',
                      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                  
                  {/* Main status circle */}
                  <div className="relative w-64 h-64 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
                      boxShadow: 'inset 0 0 40px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <div className="text-center">
                      <div className="text-7xl text-white mb-2" style={{
                        textShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4)'
                      }}>
                        {overallStatus}%
                      </div>
                      <div className="text-sm text-white/80 tracking-wider">Overall Status</div>
                    </div>
                  </div>

                  {/* Metric rings - positioned around center */}
                  {metrics.map((metric, index) => {
                    const angle = metric.angle + rotation * 0.5;
                    const radians = (angle * Math.PI) / 180;
                    const radius = 180;
                    const x = Math.cos(radians) * radius;
                    const y = Math.sin(radians) * radius;

                    return (
                      <div
                        key={index}
                        className="absolute"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                          transition: 'transform 0.05s linear'
                        }}
                      >
                        <Metric3D {...metric} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metric Labels */}
              {metrics.map((metric, index) => {
                const angle = metric.angle + rotation * 0.5;
                const radians = (angle * Math.PI) / 180;
                const radius = 180;
                const labelRadius = radius + 50;
                const x = Math.cos(radians) * labelRadius;
                const y = Math.sin(radians) * labelRadius;

                return (
                  <div
                    key={`label-${index}`}
                    className="absolute text-white text-xs text-center whitespace-nowrap"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                      transition: 'transform 0.05s linear'
                    }}
                  >
                    <div className="mb-1">{metric.label}</div>
                    <div className="text-lg" style={{ color: metric.color }}>
                      ({metric.value}%)
                    </div>
                  </div>
                );
              })}

              {/* Corner sparkles */}
              <div className="absolute bottom-4 right-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-white/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-center gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  background: metric.color,
                  boxShadow: `0 0 10px ${metric.glowColor}`
                }}
              />
              <span className="text-xs text-white/80">{metric.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { 
            icon: Camera, 
            label: 'AI Vision', 
            value: '2.4K scans',
            color: 'from-blue-500 to-cyan-500',
            glow: 'shadow-blue-500/50'
          },
          { 
            icon: Sparkles, 
            label: 'AI Analysis', 
            value: '847 insights',
            color: 'from-violet-500 to-purple-500',
            glow: 'shadow-violet-500/50'
          },
          { 
            icon: Package, 
            label: '3D Tracking', 
            value: '12.3K items',
            color: 'from-green-500 to-emerald-500',
            glow: 'shadow-green-500/50'
          },
          { 
            icon: TrendingUp, 
            label: 'Performance', 
            value: '+24.5%',
            color: 'from-orange-500 to-red-500',
            glow: 'shadow-orange-500/50'
          }
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={index} 
              className={`relative p-6 border-slate-200 overflow-hidden group hover:scale-105 transition-transform cursor-pointer`}
              style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative">
                <div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-lg ${feature.glow}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-slate-400 mb-1">{feature.label}</div>
                <div className="text-2xl text-white">{feature.value}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* System Status */}
      <Card className="p-6 border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
            <div>
              <div className="text-sm text-green-900">All Systems Operational</div>
              <div className="text-xs text-green-700">AI Vision, Analytics, and Tracking active</div>
            </div>
          </div>
          <Badge className="bg-green-600 text-white">
            <Zap className="w-3 h-3 mr-1" />
            99.9% Uptime
          </Badge>
        </div>
      </Card>
    </div>
  );
}
