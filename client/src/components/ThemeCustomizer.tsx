import { X, Palette, Type, Sparkles, Sliders, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { useTheme, ColorPalette, GradientStyle, FontStyle, BackgroundType } from '@/contexts/ThemeContext';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const { 
    colorPalette, 
    setColorPalette, 
    gradientStyle, 
    setGradientStyle,
    fontStyle,
    setFontStyle,
    gradientControls,
    setGradientControls,
    updateGradientControl,
    backgroundSettings,
    updateBackgroundSetting,
    getPrimaryColors,
    gradientClass,
    gradientStyleValue
  } = useTheme();

  if (!isOpen) return null;

  const colorPalettes: { id: ColorPalette; name: string; colors: string[] }[] = [
    { id: 'purple', name: 'Purple Dream', colors: ['#8b5cf6', '#9333ea'] },
    { id: 'blue', name: 'Ocean Blue', colors: ['#3b82f6', '#06b6d4'] },
    { id: 'green', name: 'Forest Green', colors: ['#10b981', '#059669'] },
    { id: 'orange', name: 'Sunset Orange', colors: ['#f97316', '#dc2626'] },
  ];

  const gradientStyles: { id: GradientStyle; name: string; preview: string }[] = [
    { id: 'linear', name: 'Linear', preview: 'bg-gradient-to-r' },
    { id: 'radial', name: 'Radial', preview: 'bg-gradient-radial' },
    { id: 'conic', name: 'Conic', preview: 'bg-gradient-conic' },
    { id: 'diagonal', name: 'Diagonal', preview: 'bg-gradient-to-br' },
  ];

  const fontStyles: { id: FontStyle; name: string; class: string }[] = [
    { id: 'inter', name: 'Inter (Default)', class: '' },
    { id: 'system', name: 'System Sans', class: 'font-sans' },
    { id: 'mono', name: 'Monospace', class: 'font-mono' },
    { id: 'serif', name: 'Serif', class: 'font-serif' },
  ];

  const backgroundTypes: { id: BackgroundType; name: string; description: string }[] = [
    { id: 'none', name: 'None', description: 'Default white' },
    { id: 'solid', name: 'Solid Color', description: 'Single color' },
    { id: 'gradient', name: 'Gradient', description: 'Uses theme gradient' },
    { id: 'pattern', name: 'Pattern', description: 'Subtle pattern' },
  ];

  const patternTypes: { id: 'dots' | 'grid' | 'diagonal' | 'waves'; name: string }[] = [
    { id: 'dots', name: 'Dots' },
    { id: 'grid', name: 'Grid' },
    { id: 'diagonal', name: 'Diagonal Lines' },
    { id: 'waves', name: 'Waves' },
  ];

  const backgroundColors = [
    { name: 'Slate', value: '#f8fafc' },
    { name: 'Gray', value: '#f9fafb' },
    { name: 'Zinc', value: '#fafafa' },
    { name: 'White', value: '#ffffff' },
    { name: 'Sky', value: '#f0f9ff' },
    { name: 'Purple', value: '#faf5ff' },
    { name: 'Green', value: '#f0fdf4' },
    { name: 'Orange', value: '#fff7ed' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-96 h-full bg-white shadow-2xl pointer-events-auto overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 ${gradientClass} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h2 className="text-xl">Theme Studio</h2>
                <p className="text-sm text-white/90">Customize your experience</p>
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
        <div className="p-6 space-y-8">
          {/* Font Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-slate-600" />
              <Label className="text-slate-900">Font Family</Label>
            </div>
            <div className="space-y-2">
              {fontStyles.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setFontStyle(font.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    fontStyle === font.id
                      ? `border-${colorPalette === 'purple' ? 'violet' : colorPalette}-500 bg-${colorPalette === 'purple' ? 'violet' : colorPalette}-50`
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`text-slate-900 mb-1 ${font.class}`}>
                    {font.name}
                  </div>
                  <div className={`text-sm text-slate-600 ${font.class}`}>
                    The quick brown fox jumps
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-slate-600" />
              <Label className="text-slate-900">Color Palette</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {colorPalettes.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => setColorPalette(palette.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    colorPalette === palette.id
                      ? 'border-slate-900 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex gap-2 mb-2">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-md"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-slate-900">{palette.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Style */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-slate-600" />
              <Label className="text-slate-900">Gradient Style</Label>
            </div>
            <div className="space-y-3">
              {gradientStyles.map((gradient) => {
                const colors = getPrimaryColors();
                return (
                  <button
                    key={gradient.id}
                    onClick={() => setGradientStyle(gradient.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      gradientStyle === gradient.id
                        ? 'border-slate-900 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-16 h-16 rounded-lg ${gradient.preview} ${colors.from} ${colors.to}`}
                      />
                      <div className="flex-1 text-left">
                        <div className="text-slate-900">{gradient.name}</div>
                        <div className="text-sm text-slate-600">
                          {gradient.id === 'linear' && 'Left to right flow'}
                          {gradient.id === 'radial' && 'Center outward'}
                          {gradient.id === 'conic' && 'Circular sweep'}
                          {gradient.id === 'diagonal' && 'Corner to corner'}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gradient Equalizer */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-slate-600" />
              <Label className="text-slate-900">Gradient Equalizer</Label>
            </div>
            <Card className="p-5 border-slate-200 bg-slate-50 space-y-6">
              {/* Angle/Direction Control */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm text-slate-700">
                    {gradientStyle === 'radial' ? 'Position' : 
                     gradientStyle === 'conic' ? 'Rotation' : 'Angle'}
                  </Label>
                  <span className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded">
                    {gradientControls.angle}°
                  </span>
                </div>
                <Slider
                  value={[gradientControls.angle]}
                  onValueChange={(value) => updateGradientControl('angle', value[0])}
                  min={0}
                  max={360}
                  step={1}
                  className="w-full"
                />
                <div className="h-3 mt-2 rounded-full bg-slate-300" style={{
                  background: gradientStyleValue
                }} />
              </div>

              {/* Start Position */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm text-slate-700">Start Position</Label>
                  <span className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded">
                    {gradientControls.startPosition}%
                  </span>
                </div>
                <Slider
                  value={[gradientControls.startPosition]}
                  onValueChange={(value) => updateGradientControl('startPosition', value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="h-3 mt-2 rounded-full bg-slate-300" style={{
                  background: gradientStyleValue
                }} />
              </div>

              {/* End Position */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm text-slate-700">End Position</Label>
                  <span className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded">
                    {gradientControls.endPosition}%
                  </span>
                </div>
                <Slider
                  value={[gradientControls.endPosition]}
                  onValueChange={(value) => updateGradientControl('endPosition', value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="h-3 mt-2 rounded-full bg-slate-300" style={{
                  background: gradientStyleValue
                }} />
              </div>

              {/* Intensity */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm text-slate-700">Intensity</Label>
                  <span className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded">
                    {gradientControls.intensity}%
                  </span>
                </div>
                <Slider
                  value={[gradientControls.intensity]}
                  onValueChange={(value) => updateGradientControl('intensity', value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="h-3 mt-2 rounded-full bg-slate-300" style={{
                  background: gradientStyleValue
                }} />
              </div>

              {/* Spread */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm text-slate-700">
                    {gradientStyle === 'radial' ? 'Center Point' : 'Spread'}
                  </Label>
                  <span className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded">
                    {gradientControls.spread}%
                  </span>
                </div>
                <Slider
                  value={[gradientControls.spread]}
                  onValueChange={(value) => updateGradientControl('spread', value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="h-3 mt-2 rounded-full bg-slate-300" style={{
                  background: gradientStyleValue
                }} />
              </div>

              {/* Reset Gradient Controls */}
              <Button 
                variant="outline" 
                size="sm"
                className="w-full text-xs"
                onClick={() => setGradientControls({
                  angle: 90,
                  startPosition: 0,
                  endPosition: 100,
                  intensity: 100,
                  spread: 50,
                })}
              >
                Reset Equalizer
              </Button>
            </Card>
          </div>

          {/* Live Preview */}
          <div>
            <Label className="text-slate-900 mb-4 block">Live Preview</Label>
            <Card className="p-6 border-slate-200 space-y-4">
              <div 
                className="p-4 rounded-lg text-white"
                style={{ background: gradientStyleValue }}
              >
                <h3 className="text-xl mb-1">Sample Card</h3>
                <p className="text-sm text-white/90">
                  This shows how your theme will look
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-sm text-slate-600">Revenue</div>
                  <div className="text-xl text-slate-900">$2.4M</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <div className="text-sm text-slate-600">Orders</div>
                  <div className="text-xl text-slate-900">1,248</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Background Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-slate-600" />
              <Label className="text-slate-900">Page Background</Label>
            </div>
            
            {/* Background Type */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {backgroundTypes.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => updateBackgroundSetting('type', bg.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    backgroundSettings.type === bg.id
                      ? 'border-slate-900 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm text-slate-900 mb-1">{bg.name}</div>
                  <div className="text-xs text-slate-600">{bg.description}</div>
                </button>
              ))}
            </div>

            {/* Solid Color Picker */}
            {backgroundSettings.type === 'solid' && (
              <Card className="p-4 border-slate-200 bg-slate-50 space-y-3">
                <Label className="text-sm text-slate-700">Background Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateBackgroundSetting('solidColor', color.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        backgroundSettings.solidColor === color.value
                          ? 'border-slate-900 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      <div className="w-full h-8" />
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Pattern Settings */}
            {backgroundSettings.type === 'pattern' && (
              <Card className="p-4 border-slate-200 bg-slate-50 space-y-4">
                <div>
                  <Label className="text-sm text-slate-700 mb-2 block">Pattern Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {patternTypes.map((pattern) => (
                      <button
                        key={pattern.id}
                        onClick={() => updateBackgroundSetting('patternType', pattern.id)}
                        className={`p-2 rounded-lg border-2 text-sm transition-all ${
                          backgroundSettings.patternType === pattern.id
                            ? 'border-slate-900 bg-white'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {pattern.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm text-slate-700">Pattern Opacity</Label>
                    <span className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded">
                      {backgroundSettings.patternOpacity}%
                    </span>
                  </div>
                  <Slider
                    value={[backgroundSettings.patternOpacity]}
                    onValueChange={(value) => updateBackgroundSetting('patternOpacity', value[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm text-slate-700 mb-2 block">Base Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {backgroundColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateBackgroundSetting('solidColor', color.value)}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          backgroundSettings.solidColor === color.value
                            ? 'border-slate-900 shadow-md'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        <div className="w-full h-6" />
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Reset All Button */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setColorPalette('purple');
              setGradientStyle('linear');
              setFontStyle('inter');
              setGradientControls({
                angle: 90,
                startPosition: 0,
                endPosition: 100,
                intensity: 100,
                spread: 50,
              });
              updateBackgroundSetting('type', 'none');
              updateBackgroundSetting('solidColor', '#f8fafc');
              updateBackgroundSetting('patternType', 'dots');
              updateBackgroundSetting('patternOpacity', 10);
            }}
          >
            Reset All to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
