import { ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function NeonButton({ children, onClick, variant = 'primary', className = '' }: NeonButtonProps) {
  const gradients = {
    primary: 'bg-gradient-to-r from-railway-purple to-railway-pink hover:from-railway-purple/80 hover:to-railway-pink/80',
    secondary: 'bg-gradient-to-r from-railway-cyan to-railway-green hover:from-railway-cyan/80 hover:to-railway-green/80',
  };

  return (
    <button
      onClick={onClick}
      className={`${gradients[variant]} px-6 py-3 rounded-lg font-semibold text-white relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
    </button>
  );
}
