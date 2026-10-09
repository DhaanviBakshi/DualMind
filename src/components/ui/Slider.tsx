"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (val: number) => void;
  showValueBadge?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, min = 0, max = 100, step = 1, onValueChange, showValueBadge = true, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      if (onValueChange) onValueChange(val);
      if (props.onChange) props.onChange(e);
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className="relative w-full flex items-center gap-3">
        <div className="relative w-full flex items-center select-none touch-none">
          <input
            type="range"
            ref={ref}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className={cn(
              "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-ring",
              className
            )}
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`,
            }}
            {...props}
          />
        </div>
        {showValueBadge && (
          <span className="min-w-[44px] text-right text-xs font-mono font-medium text-foreground px-2 py-0.5 rounded bg-muted">
            {value}%
          </span>
        )}
      </div>
    );
  }
);
Slider.displayName = "Slider";
