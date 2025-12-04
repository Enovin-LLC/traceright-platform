import * as React from "react";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = "", onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label className={`relative inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors ${props.checked ? 'bg-purple-600 dark:bg-purple-400' : 'bg-slate-200 dark:bg-slate-700'} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        <input
          type="checkbox"
          ref={ref}
          className="sr-only"
          onChange={handleChange}
          {...props}
        />
        <span
          className={`pointer-events-none block size-4 rounded-full bg-white ring-0 transition-transform ${props.checked ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'}`}
        />
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
