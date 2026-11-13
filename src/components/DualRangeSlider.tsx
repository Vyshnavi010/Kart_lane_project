import { formatINR } from '../utils/formatters.ts';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onChange: (nextMin: number, nextMax: number) => void;
}

export function DualRangeSlider({
  min,
  max,
  step = 500,
  minValue,
  maxValue,
  onChange,
}: DualRangeSliderProps) {
  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  // Ensure min handle stays accessible when pushed all the way against max
  const isMinNearMax = minValue >= max - step * 4;

  const handleMinChange = (value: number) => {
    const clamped = Math.min(value, maxValue);
    onChange(clamped, maxValue);
  };

  const handleMaxChange = (value: number) => {
    const clamped = Math.max(value, minValue);
    onChange(minValue, clamped);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <span className="block text-[11px] font-medium text-slate-500">
            Minimum
          </span>
          <span className="block text-sm font-semibold text-slate-900 tabular-nums mt-0.5">
            {formatINR(minValue)}
          </span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <span className="block text-[11px] font-medium text-slate-500">
            Maximum
          </span>
          <span className="block text-sm font-semibold text-slate-900 tabular-nums mt-0.5">
            {formatINR(maxValue)}
          </span>
        </div>
      </div>

      <div className="relative h-7 flex items-center select-none">
        {/* Base Rail */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full relative">
          {/* Active Range Fill */}
          <div
            className="absolute top-0 bottom-0 bg-slate-900 rounded-full"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />
        </div>

        {/* Min Handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          aria-label="Minimum price"
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className={`range-thumb-input absolute inset-x-0 w-full h-7 m-0 ${
            isMinNearMax ? 'z-30' : 'z-20'
          }`}
        />

        {/* Max Handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          aria-label="Maximum price"
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="range-thumb-input absolute inset-x-0 w-full h-7 m-0 z-20"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 tabular-nums">
        <span>{formatINR(min)}</span>
        <span>{formatINR(max)}</span>
      </div>
    </div>
  );
}
