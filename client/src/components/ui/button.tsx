import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none";
    
    const variantClasses = {
      default: cn(
        "bg-slate-900 text-slate-50 hover:bg-slate-800",
        "dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      ),
      destructive: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
      outline: cn(
        "border border-slate-200 text-slate-900 hover:bg-slate-100",
        "dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
      ),
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
      ghost: cn(
        "hover:bg-slate-100 text-slate-700",
        "dark:hover:bg-slate-800 dark:text-slate-300"
      ),
      link: "text-purple-600 underline-offset-4 hover:underline dark:text-purple-400",
    };

    const sizeClasses = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3",
      lg: "h-10 rounded-md px-6",
      icon: "size-9 rounded-md",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
