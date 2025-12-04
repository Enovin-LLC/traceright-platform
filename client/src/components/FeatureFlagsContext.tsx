import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Crowdfunding Tier System
export type CrowdfundingTier = 'free' | 'starter' | 'professional' | 'enterprise' | 'ultimate';

export interface TierConfig {
  name: string;
  price: number;
  features: (keyof FeatureFlags)[];
}

// Feature Flag Configuration - COMPREHENSIVE FOR CROWDFUNDING
export interface FeatureFlags {
  // ========================================
  // CORE LOGISTICS MODULE
  // ========================================
  logistics: boolean;
  suppliers: boolean;
  purchaseOrders: boolean;
  inboundReceipts: boolean;
  warehouseOps: boolean;
  outboundShipments: boolean;
  
  // ========================================
  // PRODUCTION MODULE
  // ========================================
  rawMaterials: boolean;
  recipes: boolean;
  batches: boolean;
  qualityControl: boolean;
  productionScheduling: boolean;
  
  // ========================================
  // INTELLIGENCE MODULE
  // ========================================
  traceability: boolean;
  aiReporting: boolean;
  aiForecast: boolean;
  materialsIntel: boolean;
  mlIntelligence: boolean;
  predictiveAnalytics: boolean;
  aiVision: boolean;
  
  // ========================================
  // SYSTEM MODULE
  // ========================================
  administration: boolean;
  governance: boolean;
  about: boolean;
  settings: boolean;
  
  // ========================================
  // SHOWCASES (Now Permanent Features!)
  // ========================================
  showcaseVisualization: boolean;
  showcaseSheets: boolean;
  showcaseAdvancedCharts: boolean;
  showcaseDataEntry: boolean;
  
  // ========================================
  // DASHBOARD VARIANTS
  // ========================================
  dashboardStandard: boolean;
  dashboardV2: boolean;
  dashboard3D: boolean;
  dashboardDark: boolean;  // Renamed from Cyberpunk
  dashboardBuilder: boolean;
  dashboardMobile: boolean;
  
  // ========================================
  // THEME OPTIONS
  // ========================================
  themeCustomizer: boolean;
  themePresets: boolean;
  themeDark: boolean;
  themeLight: boolean;
  themeAuto: boolean;
  
  // ========================================
  // PANEL FEATURES
  // ========================================
  aiAnalysis: boolean;
  collaboration: boolean;
  dataCleaningTools: boolean;
  pivotTables: boolean;
  templateLibrary: boolean;
  widgetLibrary: boolean;
  
  // ========================================
  // WIDGET TYPES
  // ========================================
  widgetKPI: boolean;
  widgetSalesChart: boolean;
  widgetRevenueChart: boolean;
  widgetInventory: boolean;
  widgetOrders: boolean;
  widgetProducts: boolean;
  widgetPerformance: boolean;
  widgetCustomChart: boolean;
  widgetMap: boolean;
  widgetTimeline: boolean;
  
  // ========================================
  // CHART TYPES
  // ========================================
  chartBar: boolean;
  chartLine: boolean;
  chartPie: boolean;
  chartArea: boolean;
  chartRadar: boolean;
  chartScatter: boolean;
  chartTreemap: boolean;
  chartSankey: boolean;
  chartFunnel: boolean;
  chartGauge: boolean;
  chartWaterfall: boolean;
  chartBullet: boolean;
  chartHeatmap: boolean;
  chartBubble: boolean;
  chartCandlestick: boolean;
  
  // ========================================
  // GOOGLE SHEETS FEATURES
  // ========================================
  sheetsIntegration: boolean;
  sheetsDataEntry: boolean;
  sheetsRealTime: boolean;
  sheetsAI: boolean;
  sheetsCharts: boolean;
  sheetsPivot: boolean;
  sheetsCollaboration: boolean;
  
  // ========================================
  // DATA FEATURES
  // ========================================
  dataImport: boolean;
  dataExport: boolean;
  dataBackup: boolean;
  dataSync: boolean;
  fakeDataGenerator: boolean;
  
  // ========================================
  // NEW INNOVATIVE FEATURES 🚀
  // ========================================
  
  // Command Palette
  commandPalette: boolean;
  quickActions: boolean;
  
  // Notifications
  notificationCenter: boolean;
  realTimeNotifications: boolean;
  emailNotifications: boolean;
  
  // Activity & Timeline
  activityFeed: boolean;
  activityTimeline: boolean;
  auditLog: boolean;
  
  // Analytics
  analyticsAdvanced: boolean;
  analyticsRealTime: boolean;
  analyticsCustomReports: boolean;
  
  // Data Export Center
  exportCenter: boolean;
  exportScheduled: boolean;
  exportMultiFormat: boolean;
  
  // Integration Hub
  integrationHub: boolean;
  apiPlayground: boolean;
  webhooks: boolean;
  
  // Performance
  performanceMonitor: boolean;
  performanceDashboard: boolean;
  performanceAlerts: boolean;
  
  // Onboarding
  onboardingTour: boolean;
  onboardingTooltips: boolean;
  onboardingVideos: boolean;
  
  // Collaboration Pro
  collaborationRealTime: boolean;
  collaborationChat: boolean;
  collaborationVideo: boolean;
  
  // Mobile
  mobileApp: boolean;
  mobileSimulator: boolean;
  mobilePush: boolean;
  
  // Advanced AI
  aiAssistant: boolean;
  aiChat: boolean;
  aiAutomate: boolean;
  aiCommandCenter: boolean;
  
  // Experimental
  voiceCommands: boolean;
  arPreview: boolean;
  vrDashboard: boolean;
  
  // Promo/Demo Access
  promoPages: boolean;
}

// Crowdfunding Tiers Configuration
export const CROWDFUNDING_TIERS: Record<CrowdfundingTier, TierConfig> = {
  free: {
    name: 'Free Tier',
    price: 0,
    features: [
      'dashboardStandard',
      'logistics',
      'suppliers',
      'themeCustomizer',
      'themeLight',
      'themeDark',
      'chartBar',
      'chartLine',
      'chartPie',
      'widgetKPI',
      'about',
    ],
  },
  starter: {
    name: 'Starter',
    price: 29,
    features: [
      // All Free +
      'purchaseOrders',
      'inboundReceipts',
      'warehouseOps',
      'rawMaterials',
      'recipes',
      'batches',
      'dashboardV2',
      'dataImport',
      'dataExport',
      'showcaseVisualization',
      'chartArea',
      'chartRadar',
      'widgetSalesChart',
      'widgetInventory',
      'notificationCenter',
      'commandPalette',
    ],
  },
  professional: {
    name: 'Professional',
    price: 99,
    features: [
      // All Starter +
      'outboundShipments',
      'traceability',
      'aiReporting',
      'administration',
      'governance',
      'dashboard3D',
      'dashboardBuilder',
      'showcaseSheets',
      'showcaseAdvancedCharts',
      'sheetsIntegration',
      'sheetsDataEntry',
      'sheetsCharts',
      'aiAnalysis',
      'collaboration',
      'dataCleaningTools',
      'pivotTables',
      'templateLibrary',
      'widgetLibrary',
      'chartScatter',
      'chartTreemap',
      'chartSankey',
      'chartFunnel',
      'activityFeed',
      'analyticsAdvanced',
      'exportCenter',
      'onboardingTour',
      'fakeDataGenerator',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    features: [
      // All Professional +
      'aiForecast',
      'materialsIntel',
      'mlIntelligence',
      'predictiveAnalytics',
      'aiVision',
      'dashboardDark',
      'dashboardMobile',
      'showcaseDataEntry',
      'sheetsRealTime',
      'sheetsAI',
      'sheetsPivot',
      'sheetsCollaboration',
      'qualityControl',
      'productionScheduling',
      'widgetPerformance',
      'widgetCustomChart',
      'widgetMap',
      'widgetTimeline',
      'chartGauge',
      'chartWaterfall',
      'chartBullet',
      'chartHeatmap',
      'chartBubble',
      'realTimeNotifications',
      'emailNotifications',
      'activityTimeline',
      'auditLog',
      'analyticsRealTime',
      'analyticsCustomReports',
      'exportScheduled',
      'exportMultiFormat',
      'integrationHub',
      'apiPlayground',
      'webhooks',
      'performanceMonitor',
      'performanceDashboard',
      'onboardingTooltips',
      'onboardingVideos',
      'collaborationRealTime',
      'collaborationChat',
      'dataBackup',
      'dataSync',
    ],
  },
  ultimate: {
    name: 'Ultimate',
    price: 599,
    features: [
      // ALL FEATURES ENABLED
      'collaborationVideo',
      'mobileApp',
      'mobileSimulator',
      'mobilePush',
      'aiAssistant',
      'aiChat',
      'aiAutomate',
      'performanceAlerts',
      'voiceCommands',
      'arPreview',
      'vrDashboard',
      'chartCandlestick',
      'themePresets',
      'themeAuto',
      'settings',
      'quickActions',
    ],
  },
};

// Default configuration - Free tier by default
const defaultFeatureFlags: FeatureFlags = {
  // Core Logistics
  logistics: true,
  suppliers: true,
  purchaseOrders: true,
  inboundReceipts: true,
  warehouseOps: true,
  outboundShipments: true,
  
  // Production
  rawMaterials: true,
  recipes: true,
  batches: true,
  qualityControl: true,
  productionScheduling: true,
  
  // Intelligence
  traceability: true,
  aiReporting: true,
  aiForecast: true,
  materialsIntel: true,
  mlIntelligence: true,
  predictiveAnalytics: true,
  aiVision: true,
  
  // System
  administration: true,
  governance: true,
  about: true,
  settings: true,
  
  // Showcases (Permanent Features)
  showcaseVisualization: true,
  showcaseSheets: true,
  showcaseAdvancedCharts: true,
  showcaseDataEntry: true,
  
  // Dashboards
  dashboardStandard: true,
  dashboardV2: false,
  dashboard3D: true,
  dashboardDark: false,
  dashboardBuilder: true,
  dashboardMobile: false,
  
  // Themes
  themeCustomizer: true,
  themePresets: false,
  themeDark: true,
  themeLight: true,
  themeAuto: false,
  
  // Panels
  aiAnalysis: true,
  collaboration: true,
  dataCleaningTools: true,
  pivotTables: true,
  templateLibrary: true,
  widgetLibrary: true,
  
  // Widgets
  widgetKPI: true,
  widgetSalesChart: false,
  widgetRevenueChart: false,
  widgetInventory: false,
  widgetOrders: false,
  widgetProducts: false,
  widgetPerformance: false,
  widgetCustomChart: false,
  widgetMap: false,
  widgetTimeline: false,
  
  // Charts
  chartBar: true,
  chartLine: true,
  chartPie: true,
  chartArea: false,
  chartRadar: false,
  chartScatter: false,
  chartTreemap: false,
  chartSankey: false,
  chartFunnel: false,
  chartGauge: false,
  chartWaterfall: false,
  chartBullet: false,
  chartHeatmap: false,
  chartBubble: false,
  chartCandlestick: false,
  
  // Google Sheets
  sheetsIntegration: false,
  sheetsDataEntry: false,
  sheetsRealTime: false,
  sheetsAI: false,
  sheetsCharts: false,
  sheetsPivot: false,
  sheetsCollaboration: false,
  
  // Data
  dataImport: false,
  dataExport: false,
  dataBackup: false,
  dataSync: false,
  fakeDataGenerator: false,
  
  // NEW INNOVATIVE FEATURES
  commandPalette: true,
  quickActions: false,
  notificationCenter: true,
  realTimeNotifications: false,
  emailNotifications: false,
  activityFeed: false,
  activityTimeline: false,
  auditLog: false,
  analyticsAdvanced: false,
  analyticsRealTime: false,
  analyticsCustomReports: false,
  exportCenter: false,
  exportScheduled: false,
  exportMultiFormat: false,
  integrationHub: false,
  apiPlayground: false,
  webhooks: false,
  performanceMonitor: false,
  performanceDashboard: false,
  performanceAlerts: false,
  onboardingTour: false,
  onboardingTooltips: false,
  onboardingVideos: false,
  collaborationRealTime: false,
  collaborationChat: false,
  collaborationVideo: false,
  mobileApp: false,
  mobileSimulator: false,
  mobilePush: false,
  aiAssistant: false,
  aiChat: false,
  aiAutomate: false,
  aiCommandCenter: true,
  voiceCommands: false,
  arPreview: false,
  vrDashboard: false,
  
  // Promo/Demo Access
  promoPages: false,
};

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  currentTier: CrowdfundingTier;
  isEnabled: (feature: keyof FeatureFlags) => boolean;
  toggleFeature: (feature: keyof FeatureFlags) => void;
  enableFeature: (feature: keyof FeatureFlags) => void;
  disableFeature: (feature: keyof FeatureFlags) => void;
  resetFlags: () => void;
  enableAll: () => void;
  disableAll: () => void;
  exportConfig: () => string;
  importConfig: (config: string) => void;
  setTier: (tier: CrowdfundingTier) => void;
  enableTier: (tier: CrowdfundingTier) => void;
  getEnabledCount: () => number;
  getTotalCount: () => number;
  getFeaturesByCategory: () => Record<string, (keyof FeatureFlags)[]>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [currentTier, setCurrentTier] = useState<CrowdfundingTier>(() => {
    const stored = localStorage.getItem('traceright_tier');
    return (stored as CrowdfundingTier) || 'free';
  });

  const [wasReset, setWasReset] = useState(false);
  
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    // Check version to handle updates to default flags
    const storedVersion = localStorage.getItem('traceright_flags_version');
    const currentVersion = '2.1'; // Increment when defaults change - Force traceability enabled
    
    // If version mismatch or no version, use new defaults and clear old storage
    if (storedVersion !== currentVersion) {
      localStorage.removeItem('traceright_feature_flags');
      localStorage.setItem('traceright_flags_version', currentVersion);
      console.log('✅ Feature flags reset to new defaults (v' + currentVersion + ')');
      console.log('✅ All Production and Intelligence features are now enabled!');
      setWasReset(true);
      return defaultFeatureFlags;
    }
    
    // Load from localStorage if available and version matches
    const stored = localStorage.getItem('traceright_feature_flags');
    if (stored) {
      try {
        return { ...defaultFeatureFlags, ...JSON.parse(stored) };
      } catch (e) {
        console.error('Failed to parse stored feature flags:', e);
        return defaultFeatureFlags;
      }
    }
    return defaultFeatureFlags;
  });

  // Show notification when flags were reset
  useEffect(() => {
    if (wasReset) {
      // Display a clear message in console
      console.log('%c✅ FEATURE FLAGS UPDATED!', 'color: #22c55e; font-size: 16px; font-weight: bold;');
      console.log('%c📦 Production features enabled: Raw Materials, Recipes, Batches', 'color: #3b82f6; font-size: 14px;');
      console.log('%c🧠 Intelligence features enabled: Traceability, AI Reporting, AI Forecasting, Materials Intel, ML Intel', 'color: #8b5cf6; font-size: 14px;');
      console.log('%c👉 Check the Production and Intelligence sections in the sidebar!', 'color: #f59e0b; font-size: 14px; font-weight: bold;');
    }
  }, [wasReset]);
  
  // Save to localStorage whenever flags change
  useEffect(() => {
    localStorage.setItem('traceright_feature_flags', JSON.stringify(flags));
  }, [flags]);

  // Save tier to localStorage
  useEffect(() => {
    localStorage.setItem('traceright_tier', currentTier);
  }, [currentTier]);

  const isEnabled = (feature: keyof FeatureFlags): boolean => {
    return flags[feature];
  };

  const toggleFeature = (feature: keyof FeatureFlags) => {
    setFlags((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const enableFeature = (feature: keyof FeatureFlags) => {
    setFlags((prev) => ({
      ...prev,
      [feature]: true,
    }));
  };

  const disableFeature = (feature: keyof FeatureFlags) => {
    setFlags((prev) => ({
      ...prev,
      [feature]: false,
    }));
  };

  const resetFlags = () => {
    setFlags(defaultFeatureFlags);
  };

  const enableAll = () => {
    const allEnabled = Object.keys(defaultFeatureFlags).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as FeatureFlags
    );
    setFlags(allEnabled);
  };

  const disableAll = () => {
    const allDisabled = Object.keys(defaultFeatureFlags).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as FeatureFlags
    );
    setFlags(allDisabled);
  };

  const exportConfig = (): string => {
    return JSON.stringify(flags, null, 2);
  };

  const importConfig = (config: string) => {
    try {
      const imported = JSON.parse(config);
      setFlags({ ...defaultFeatureFlags, ...imported });
    } catch (e) {
      console.error('Failed to import config:', e);
    }
  };

  const setTier = (tier: CrowdfundingTier) => {
    setCurrentTier(tier);
  };

  const enableTier = (tier: CrowdfundingTier) => {
    setCurrentTier(tier);
    
    // Enable all features for this tier and below
    const newFlags = { ...defaultFeatureFlags };
    
    const tierOrder: CrowdfundingTier[] = ['free', 'starter', 'professional', 'enterprise', 'ultimate'];
    const tierIndex = tierOrder.indexOf(tier);
    
    // Enable features from all tiers up to and including current tier
    for (let i = 0; i <= tierIndex; i++) {
      const currentTierConfig = CROWDFUNDING_TIERS[tierOrder[i]];
      currentTierConfig.features.forEach(feature => {
        newFlags[feature] = true;
      });
    }
    
    setFlags(newFlags);
  };

  const getEnabledCount = (): number => {
    return Object.values(flags).filter(Boolean).length;
  };

  const getTotalCount = (): number => {
    return Object.keys(flags).length;
  };

  const getFeaturesByCategory = (): Record<string, (keyof FeatureFlags)[]> => {
    const categories: Record<string, (keyof FeatureFlags)[]> = {
      'Core Logistics': [],
      'Production': [],
      'Intelligence': [],
      'System': [],
      'Showcases': [],
      'Dashboards': [],
      'Themes': [],
      'Panels': [],
      'Widgets': [],
      'Charts': [],
      'Google Sheets': [],
      'Data': [],
      'Command & Actions': [],
      'Notifications': [],
      'Activity': [],
      'Analytics': [],
      'Export': [],
      'Integration': [],
      'Performance': [],
      'Onboarding': [],
      'Collaboration': [],
      'Mobile': [],
      'AI': [],
      'Experimental': [],
    };

    Object.keys(flags).forEach((key) => {
      const feature = key as keyof FeatureFlags;
      if (feature.startsWith('logistics') || feature.includes('suppliers') || feature.includes('purchase') || feature.includes('inbound') || feature.includes('warehouse') || feature.includes('outbound')) {
        categories['Core Logistics'].push(feature);
      } else if (feature.includes('raw') || feature.includes('recipe') || feature.includes('batch') || feature.includes('quality') || feature.includes('scheduling')) {
        categories['Production'].push(feature);
      } else if (feature.includes('trace') || feature.includes('intel') || feature.includes('ml') || feature.includes('predictive')) {
        categories['Intelligence'].push(feature);
      } else if (feature.includes('administration') || feature.includes('governance') || feature.includes('about') || feature.includes('settings')) {
        categories['System'].push(feature);
      } else if (feature.includes('showcase')) {
        categories['Showcases'].push(feature);
      } else if (feature.includes('dashboard')) {
        categories['Dashboards'].push(feature);
      } else if (feature.includes('theme')) {
        categories['Themes'].push(feature);
      } else if (feature === 'aiAnalysis' || feature === 'collaboration' || feature.includes('cleaning') || feature.includes('pivot') || feature.includes('template') || feature.includes('widgetLibrary')) {
        categories['Panels'].push(feature);
      } else if (feature.includes('widget')) {
        categories['Widgets'].push(feature);
      } else if (feature.includes('chart')) {
        categories['Charts'].push(feature);
      } else if (feature.includes('sheets')) {
        categories['Google Sheets'].push(feature);
      } else if (feature.includes('data') && !feature.includes('fake')) {
        categories['Data'].push(feature);
      } else if (feature.includes('command') || feature.includes('quickActions')) {
        categories['Command & Actions'].push(feature);
      } else if (feature.includes('notification')) {
        categories['Notifications'].push(feature);
      } else if (feature.includes('activity') || feature.includes('audit')) {
        categories['Activity'].push(feature);
      } else if (feature.includes('analytics')) {
        categories['Analytics'].push(feature);
      } else if (feature.includes('export')) {
        categories['Export'].push(feature);
      } else if (feature.includes('integration') || feature.includes('api') || feature.includes('webhook')) {
        categories['Integration'].push(feature);
      } else if (feature.includes('performance')) {
        categories['Performance'].push(feature);
      } else if (feature.includes('onboarding')) {
        categories['Onboarding'].push(feature);
      } else if (feature.includes('collaboration')) {
        categories['Collaboration'].push(feature);
      } else if (feature.includes('mobile')) {
        categories['Mobile'].push(feature);
      } else if (feature.includes('ai')) {
        categories['AI'].push(feature);
      } else if (feature.includes('voice') || feature.includes('ar') || feature.includes('vr')) {
        categories['Experimental'].push(feature);
      }
    });

    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    return categories;
  };

  return (
    <FeatureFlagsContext.Provider
      value={{
        flags,
        currentTier,
        isEnabled,
        toggleFeature,
        enableFeature,
        disableFeature,
        resetFlags,
        enableAll,
        disableAll,
        exportConfig,
        importConfig,
        setTier,
        enableTier,
        getEnabledCount,
        getTotalCount,
        getFeaturesByCategory,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
}

// Convenience hook to check if a feature is enabled
export function useFeature(feature: keyof FeatureFlags): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(feature);
}