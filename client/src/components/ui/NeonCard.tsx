import { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  color?: 'purple' | 'pink' | 'cyan' | 'green' | 'orange';
  className?: string;
}

export function NeonCard({ children, color = 'purple', className = '' }: NeonCardProps) {
  const colorMap = {
    purple: 'border-railway-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    pink: 'border-railway-pink hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]',
    cyan: 'border-railway-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    green: 'border-railway-green hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    orange: 'border-railway-orange hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]',
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border-2 ${colorMap[color]} rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  );
}
