import { useState } from 'react';
import { 
  Plus, 
  X, 
  Trash2, 
  Save, 
  LayoutGrid,
  Edit,
  GripVertical,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  WidgetConfig, 
  WIDGET_COMPONENTS, 
  WIDGET_CATALOG 
} from './WidgetLibrary';

interface DashboardBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onWidgetsChange: (widgets: WidgetConfig[]) => void;
}

export function DashboardBuilder({ 
  isOpen, 
  onClose, 
  widgets, 
  onWidgetsChange 
}: DashboardBuilderProps) {
  const { gradientStyleValue, gradientClass } = useTheme();
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);

  if (!isOpen) return null;

  const addWidget = (type: WidgetConfig['type']) => {
    const catalogItem = WIDGET_CATALOG.find(item => item.type === type);
    if (!catalogItem) return;

    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type,
      title: catalogItem.name,
      size: 'medium',
      x: 0,
      y: widgets.length,
      w: catalogItem.defaultSize.w,
      h: catalogItem.defaultSize.h,
    };

    onWidgetsChange([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    onWidgetsChange(widgets.filter(w => w.id !== id));
    if (selectedWidget === id) setSelectedWidget(null);
  };

  const updateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    onWidgetsChange(
      widgets.map(w => w.id === id ? { ...w, ...updates } : w)
    );
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    const index = widgets.findIndex(w => w.id === id);
    if (index === -1) return;

    const newWidgets = [...widgets];
    if (direction === 'up' && index > 0) {
      [newWidgets[index], newWidgets[index - 1]] = [newWidgets[index - 1], newWidgets[index]];
    } else if (direction === 'down' && index < widgets.length - 1) {
      [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
    }

    onWidgetsChange(newWidgets);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-[500px] h-full bg-white shadow-2xl pointer-events-auto overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 ${gradientClass} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-6 h-6" />
              <div>
                <h2 className="text-xl">Dashboard Builder</h2>
                <p className="text-sm text-white/90">Design your custom dashboard</p>
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
          {/* Widget Catalog */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-slate-600" />
              <Label className="text-slate-900">Add Widgets</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {WIDGET_CATALOG.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => addWidget(item.type)}
                    className="p-4 rounded-lg border-2 border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-lg text-white"
                        style={{ background: gradientStyleValue }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-900 mb-1">{item.name}</div>
                        <div className="text-xs text-slate-600">{item.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Start */}
          {widgets.length === 0 && (
            <Card className="p-4 border-slate-200 bg-gradient-to-br from-violet-50 to-purple-50">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-violet-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-violet-900 mb-2">Quick Start</div>
                  <div className="text-xs text-violet-700 mb-3">
                    Try adding some popular widgets to get started
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        addWidget('kpi');
                        addWidget('area-chart');
                        addWidget('activity-feed');
                      }}
                      className="text-xs"
                    >
                      Add Sample Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Current Widgets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-slate-900">
                Current Widgets ({widgets.length})
              </Label>
              {widgets.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('Remove all widgets?')) {
                      onWidgetsChange([]);
                    }
                  }}
                >
                  Clear All
                </Button>
              )}
            </div>

            {widgets.length === 0 ? (
              <Card className="p-8 border-slate-200 text-center">
                <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No widgets yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Add widgets from the catalog above
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {widgets.map((widget, index) => (
                  <Card 
                    key={widget.id}
                    className={`p-4 border-slate-200 transition-all ${
                      selectedWidget === widget.id 
                        ? 'ring-2 ring-violet-500 shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1 pt-1">
                        <button
                          onClick={() => moveWidget(widget.id, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <GripVertical className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => moveWidget(widget.id, 'down')}
                          disabled={index === widgets.length - 1}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <GripVertical className="w-4 h-4 text-slate-400 rotate-180" />
                        </button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm text-slate-900">
                              {widget.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {WIDGET_CATALOG.find(c => c.type === widget.type)?.name}
                            </div>
                          </div>
                        </div>

                        {editingWidget?.id === widget.id ? (
                          <div className="space-y-2 mt-3">
                            <Input
                              value={editingWidget.title}
                              onChange={(e) => setEditingWidget({
                                ...editingWidget,
                                title: e.target.value
                              })}
                              placeholder="Widget title"
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  updateWidget(widget.id, { title: editingWidget.title });
                                  setEditingWidget(null);
                                }}
                                style={{ background: gradientStyleValue }}
                                className="text-white"
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingWidget(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingWidget(widget)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeWidget(widget.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Save Info */}
          {widgets.length > 0 && (
            <Card className="p-4 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-start gap-3">
                <Save className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <div className="text-sm text-slate-900 mb-1">Auto-saved</div>
                  <div className="text-xs text-slate-600">
                    Your dashboard configuration is saved automatically. 
                    Close this panel to see your custom dashboard.
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="p-4 border-slate-200 bg-blue-50">
            <h4 className="text-sm text-blue-900 mb-2">💡 Quick Tips</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Click widgets above to add them to your dashboard</li>
              <li>• Use arrows to reorder widgets</li>
              <li>• Edit widget titles for customization</li>
              <li>• Widgets will stack in the order you add them</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
