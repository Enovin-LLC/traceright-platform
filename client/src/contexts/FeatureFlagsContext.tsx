import React, { createContext, useContext } from 'react';
import { trpc } from '@/lib/trpc';

const FeatureFlagsContext = createContext<any>(null);

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  return (
    <FeatureFlagsContext.Provider value={{}}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeature(key: string): boolean {
  const { data: isEnabled } = trpc.featureFlags.isEnabled.useQuery({ key }, {
    enabled: !!key,
  });
  return isEnabled ?? false;
}
