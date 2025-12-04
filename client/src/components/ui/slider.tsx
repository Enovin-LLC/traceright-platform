import * as React from "react";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className = "", value, defaultValue, min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      (defaultValue && defaultValue[0]) || (value && value[0]) || min
    );
    
    const currentValue = value ? value[0] : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (!value) {
        setInternalValue(newValue);
      }
      onValueChange?.([ newValue]);
    };

    const percentage = ((currentValue - min) / (max - min)) * 100;

    return (
      <div className={`relative flex w-full touch-none items-center select-none ${className}`}>
        <div className="relative w-full h-4 flex items-center">
          <div className="absolute w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-purple-600 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            className="absolute w-full h-4 opacity-0 cursor-pointer"
            {...props}
          />
          <div
            className="absolute w-4 h-4 bg-white border-2 border-purple-600 rounded-full shadow-sm transition-shadow hover:ring-4 hover:ring-purple-600/20 focus-visible:ring-4 focus-visible:ring-purple-600/20"
            style={{ left: `calc(${percentage}% - 0.5rem)` }}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
