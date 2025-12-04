import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PlayCircle,
  PauseCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Target,
  Brain,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Award,
  Truck,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  backgroundColor: string;
  textColor: string;
}

export function PlatformStorySlideshow({ onClose }: { onClose?: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const slides: Slide[] = [
    {
      id: 1,
      title: 'Welcome to Universal Trace Cloud',
      subtitle: 'The Future of Supply Chain Management',
      backgroundColor: 'from-purple-600 to-violet-600',
      textColor: 'text-white',
      content: (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles className="w-32 h-32 mx-auto mb-6 text-yellow-300" />
          </motion.div>
          <p className="text-3xl text-purple-100">
            From Chaos to Command: A new approach to managing complex supply chains
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-5xl mb-2">$500B</p>
              <p className="text-lg text-purple-200">Annual losses to inefficiency</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-5xl mb-2">73%</p>
              <p className="text-lg text-purple-200">Lack real-time visibility</p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-5xl mb-2">$4M</p>
              <p className="text-lg text-purple-200">Average crisis cost</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'The Problem: Supply Chains Are Broken',
      subtitle: 'Traditional platforms create chaos, not command',
      backgroundColor: 'from-red-600 to-orange-600',
      textColor: 'text-white',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-white/10 backdrop-blur-sm rounded-xl text-center"
            >
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-red-200" />
              <h3 className="text-2xl mb-3">Reactive, Not Proactive</h3>
              <p className="text-lg text-red-100">
                Firefighting crises instead of preventing them
              </p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-8 bg-white/10 backdrop-blur-sm rounded-xl text-center"
            >
              <Shield className="w-16 h-16 mx-auto mb-4 text-orange-200" />
              <h3 className="text-2xl mb-3">Guesswork, Not Truth</h3>
              <p className="text-lg text-orange-100">
                "He said, she said" costs millions in disputes
              </p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-8 bg-white/10 backdrop-blur-sm rounded-xl text-center"
            >
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-200" />
              <h3 className="text-2xl mb-3">Alerts, Not Actions</h3>
              <p className="text-lg text-yellow-100">
                500 alerts with zero solutions
              </p>
            </motion.div>
          </div>
          <div className="text-center p-8 bg-white/20 backdrop-blur rounded-2xl max-w-4xl mx-auto">
            <p className="text-3xl">
              Companies are drowning in data but starving for command
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'The Command Methodology™',
      subtitle: '5 Core Pillars That Transform Supply Chains',
      backgroundColor: 'from-purple-600 to-pink-600',
      textColor: 'text-white',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { num: 1, name: 'Chaos → Command', icon: Target, color: 'from-red-500 to-orange-500' },
            { num: 2, name: 'AI + Human', icon: Brain, color: 'from-purple-500 to-pink-500' },
            { num: 3, name: 'Grounded Truth', icon: Shield, color: 'from-blue-500 to-cyan-500' },
            { num: 4, name: 'Autonomous Action', icon: Zap, color: 'from-orange-500 to-yellow-500' },
            { num: 5, name: 'Constant Evolution', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
          ].map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.num}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.2, type: 'spring' }}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-xl text-center"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${pillar.color} flex items-center justify-center text-xl font-bold mx-auto mb-3`}>
                  {pillar.num}
                </div>
                <h3 className="text-lg">{pillar.name}</h3>
              </motion.div>
            );
          })}
        </div>
      ),
    },
    {
      id: 4,
      title: 'Real-Time Visibility Across Your Supply Chain',
      subtitle: 'Track every shipment, every product, every step',
      backgroundColor: 'from-blue-600 to-cyan-600',
      textColor: 'text-white',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Active Shipments', value: '3,284', icon: Truck, color: 'bg-blue-500' },
              { label: 'Products Tracked', value: '45,291', icon: Package, color: 'bg-cyan-500' },
              { label: 'On-Time Delivery', value: '94.2%', icon: Award, color: 'bg-green-500' },
              { label: 'Quality Score', value: '98.1%', icon: Target, color: 'bg-purple-500' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.15 }}
                  className="p-6 bg-white/10 backdrop-blur-sm rounded-xl text-center"
                >
                  <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-4xl mb-2">{stat.value}</p>
                  <p className="text-lg text-blue-100">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center p-8 bg-white/20 backdrop-blur rounded-2xl max-w-4xl mx-auto">
            <p className="text-3xl">
              Complete transparency from raw materials to customer delivery
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'AI-Powered Intelligence',
      subtitle: 'Agentic AI that learns, predicts, and acts',
      backgroundColor: 'from-violet-600 to-purple-600',
      textColor: 'text-white',
      content: (
        <div className="space-y-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl mb-6"
            >
              <Brain className="w-20 h-20 mx-auto mb-6 text-violet-200" />
              <h3 className="text-3xl mb-4 text-center">The ACE Framework</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-6xl mb-3">🎯</div>
                  <h4 className="text-2xl mb-2">Align</h4>
                  <p className="text-lg text-violet-100">Understand your goals and constraints</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-3">🔨</div>
                  <h4 className="text-2xl mb-2">Construct</h4>
                  <p className="text-lg text-violet-100">Build actionable solutions</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-3">📊</div>
                  <h4 className="text-2xl mb-2">Evaluate</h4>
                  <p className="text-lg text-violet-100">Learn and improve continuously</p>
                </div>
              </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                <Badge className="mb-3 bg-violet-500">🔬 Beta Q2 2026</Badge>
                <h4 className="text-xl mb-2">RAG-Powered Analysis</h4>
                <p className="text-violet-100">Retrieval-Augmented Generation for grounded truth</p>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                <Badge className="mb-3 bg-purple-500">🚀 Roadmap 2026-2027</Badge>
                <h4 className="text-xl mb-2">Autonomous Execution</h4>
                <p className="text-purple-100">AI that doesn't just alert—it acts</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: '3-Click Crisis Resolution',
      subtitle: 'Turn a $2M problem into a solved case in minutes',
      backgroundColor: 'from-green-600 to-emerald-600',
      textColor: 'text-white',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-3xl mb-6 text-red-200">❌ Before TraceRight</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/20 backdrop-blur-sm rounded-lg border-2 border-red-300">
                  <p className="text-xl">⏱️ 72 hours of phone calls</p>
                </div>
                <div className="p-4 bg-red-500/20 backdrop-blur-sm rounded-lg border-2 border-red-300">
                  <p className="text-xl">👥 15 stakeholders involved</p>
                </div>
                <div className="p-4 bg-red-500/20 backdrop-blur-sm rounded-lg border-2 border-red-300">
                  <p className="text-xl">💸 $2M at risk</p>
                </div>
                <div className="p-4 bg-red-500/20 backdrop-blur-sm rounded-lg border-2 border-red-300">
                  <p className="text-xl">🤷 No clear action plan</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl mb-6 text-green-200">✅ With TraceRight</h3>
              <div className="space-y-4">
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-green-500/20 backdrop-blur-sm rounded-lg border-2 border-green-300"
                >
                  <p className="text-xl">⚡ 2 minutes to resolution</p>
                </motion.div>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 bg-green-500/20 backdrop-blur-sm rounded-lg border-2 border-green-300"
                >
                  <p className="text-xl">🖱️ 3 clicks total</p>
                </motion.div>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 bg-green-500/20 backdrop-blur-sm rounded-lg border-2 border-green-300"
                >
                  <p className="text-xl">💰 $50K penalty recovered</p>
                </motion.div>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="p-4 bg-green-500/20 backdrop-blur-sm rounded-lg border-2 border-green-300"
                >
                  <p className="text-xl">✅ Production maintained</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Market Opportunity',
      subtitle: '$150B market growing at 11% annually',
      backgroundColor: 'from-yellow-600 to-orange-600',
      textColor: 'text-white',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl text-center"
            >
              <DollarSign className="w-20 h-20 mx-auto mb-4 text-yellow-200" />
              <p className="text-6xl mb-3">$150B</p>
              <p className="text-xl text-yellow-100">Total Addressable Market</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl text-center"
            >
              <BarChart3 className="w-20 h-20 mx-auto mb-4 text-orange-200" />
              <p className="text-6xl mb-3">8</p>
              <p className="text-xl text-orange-100">Industries Supported</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl text-center"
            >
              <Users className="w-20 h-20 mx-auto mb-4 text-red-200" />
              <p className="text-6xl mb-3">50+</p>
              <p className="text-xl text-red-100">Platform Integrations</p>
            </motion.div>
          </div>
          <div className="max-w-4xl mx-auto p-8 bg-white/20 backdrop-blur rounded-2xl">
            <h3 className="text-3xl mb-6 text-center">Target Industries</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              {['Food & Beverage', 'Pharmaceuticals', 'Automotive', 'Electronics', 
                'Fashion', 'Aerospace', 'Chemicals', 'Retail'].map((industry, i) => (
                <motion.div
                  key={industry}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="p-4 bg-white/10 rounded-lg"
                >
                  <p className="text-lg">{industry}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'Ready to Transform Your Supply Chain?',
      subtitle: 'Join the future of command-driven operations',
      backgroundColor: 'from-purple-600 to-violet-600',
      textColor: 'text-white',
      content: (
        <div className="text-center space-y-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Award className="w-32 h-32 mx-auto mb-6 text-yellow-300" />
          </motion.div>
          <h3 className="text-5xl mb-8">From Chaos to Command</h3>
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl cursor-pointer shadow-2xl"
            >
              <PlayCircle className="w-16 h-16 mx-auto mb-4 text-gray-900" />
              <h4 className="text-3xl text-gray-900 mb-2">Experience the Demo</h4>
              <p className="text-xl text-gray-800">See 3-click crisis resolution in action</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl cursor-pointer shadow-2xl"
            >
              <Users className="w-16 h-16 mx-auto mb-4 text-white" />
              <h4 className="text-3xl mb-2">Book Strategy Call</h4>
              <p className="text-xl text-blue-5">Talk to our team about your needs</p>
            </motion.div>
          </div>
          <p className="text-2xl text-purple-200 max-w-3xl mx-auto">
            Built with the Command Methodology™ - Where AI serves you, not the other way around
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentSlide < slides.length - 1) {
          setDirection('right');
          setCurrentSlide((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 8000); // 8 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, slides.length]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection('right');
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection('left');
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];

  const slideVariants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Slide Content */}
      <div className="h-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.backgroundColor} ${currentSlideData.textColor}`}
          >
            <div className="h-full flex flex-col items-center justify-center p-12">
              {/* Title */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <h1 className="text-7xl mb-4">{currentSlideData.title}</h1>
                <p className="text-3xl opacity-90">{currentSlideData.subtitle}</p>
              </motion.div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-center w-full max-w-7xl">
                {currentSlideData.content}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6 z-10">
        {/* Previous Button */}
        <Button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          size="lg"
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Play/Pause Button */}
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          size="lg"
          className="bg-white/20 border-white/40 text-white hover:bg-white/30 backdrop-blur-sm px-8"
        >
          {isPlaying ? (
            <>
              <PauseCircle className="w-6 h-6 mr-2" />
              Pause
            </>
          ) : (
            <>
              <PlayCircle className="w-6 h-6 mr-2" />
              Play
            </>
          )}
        </Button>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          size="lg"
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-24 left-0 right-0 flex items-center justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 'right' : 'left');
              setCurrentSlide(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Close Button */}
      {onClose && (
        <Button
          onClick={onClose}
          size="icon"
          variant="ghost"
          className="absolute top-8 right-8 text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </Button>
      )}

      {/* Slide Counter */}
      <div className="absolute top-8 left-8 text-white text-xl">
        <Badge variant="secondary" className="bg-white/20 text-white text-lg px-4 py-2">
          {currentSlide + 1} / {slides.length}
        </Badge>
      </div>
    </div>
  );
}