import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 whitespace-nowrap";
    
    const variantClasses = {
      default: cn(
        "border-transparent bg-slate-900 text-slate-50",
        "dark:bg-slate-100 dark:text-slate-900"
      ),
      secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-100",
      destructive: "border-transparent bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
      outline: "text-gray-900 border-gray-300 hover:bg-gray-100 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
      success: cn(
        "border-transparent bg-green-100 text-green-900",
        "dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400"
      ),
      warning: cn(
        "border-transparent bg-amber-100 text-amber-900",
        "dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
      ),
    };

    return (
      <span
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
