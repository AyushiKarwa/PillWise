import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface ClockTimePickerProps {
  value: string; // e.g. "09:00 AM" or "12:45 PM"
  onChange: (formattedTime: string) => void;
}

export const ClockTimePicker: React.FC<ClockTimePickerProps> = ({ value, onChange }) => {
  const parseTime = (str: string) => {
    if (!str) return { hour: 9, minute: 0, period: 'AM' };
    const clean = str.trim();
    if (clean.includes('AM') || clean.includes('PM')) {
      const parts = clean.split(' ');
      const [h, m] = (parts[0] || '09:00').split(':');
      let hNum = parseInt(h, 10) || 9;
      if (hNum > 12) hNum = 12;
      if (hNum < 1) hNum = 1;
      return {
        hour: hNum,
        minute: parseInt(m, 10) || 0,
        period: (parts[1] || 'AM').toUpperCase()
      };
    } else if (clean.includes(':')) {
      const [hStr, mStr] = clean.split(':');
      let hNum = parseInt(hStr, 10) || 9;
      const period = hNum >= 12 ? 'PM' : 'AM';
      if (hNum === 0) hNum = 12;
      else if (hNum > 12) hNum -= 12;
      return {
        hour: hNum,
        minute: parseInt(mStr, 10) || 0,
        period
      };
    }
    return { hour: 9, minute: 0, period: 'AM' };
  };

  const parsed = useMemo(() => parseTime(value), [value]);
  const [hour, setHour] = useState<number>(parsed.hour);
  const [minute, setMinute] = useState<number>(parsed.minute);
  const [period, setPeriod] = useState<string>(parsed.period);
  const [setMode, setSetMode] = useState<'hour' | 'minute'>('hour');

  useEffect(() => {
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [parsed]);

  const updateTime = useCallback((h: number, m: number, p: string) => {
    setHour(h);
    setMinute(m);
    setPeriod(p);
    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    onChange(`${hStr}:${mStr} ${p}`);
  }, [onChange]);

  // Handle native <input type="time"> change
  const handleNativeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // "14:30"
    if (!val) return;
    const [hStr, mStr] = val.split(':');
    let hNum = parseInt(hStr, 10) || 0;
    const mNum = parseInt(mStr, 10) || 0;
    const p = hNum >= 12 ? 'PM' : 'AM';
    if (hNum === 0) hNum = 12;
    else if (hNum > 12) hNum -= 12;
    updateTime(hNum, mNum, p);
  };

  // Convert current hour/minute/period to "HH:MM" 24h string for native picker
  const native24hValue = useMemo(() => {
    let h24 = hour;
    if (period === 'PM' && hour < 12) h24 = hour + 12;
    if (period === 'AM' && hour === 12) h24 = 0;
    return `${String(h24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }, [hour, minute, period]);

  const hourAngle = (hour % 12) * 30 + (minute / 60) * 30;
  const minuteAngle = minute * 6;

  const handleDialClick = (val: number) => {
    if (setMode === 'hour') {
      const newHour = val === 0 ? 12 : val;
      updateTime(newHour, minute, period);
      setSetMode('minute');
    } else {
      const newMin = (val % 12) * 5;
      updateTime(hour, newMin, period);
    }
  };

  const presets = [
    { label: 'Morning (08:00 AM)', time: '08:00 AM', icon: <Sunrise className="w-3.5 h-3.5 text-amber-500" /> },
    { label: 'Afternoon (01:00 PM)', time: '01:00 PM', icon: <Sun className="w-3.5 h-3.5 text-amber-600" /> },
    { label: 'Evening (07:00 PM)', time: '07:00 PM', icon: <Sunset className="w-3.5 h-3.5 text-orange-500" /> },
    { label: 'Night (10:00 PM)', time: '10:00 PM', icon: <Moon className="w-3.5 h-3.5 text-indigo-500" /> }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-4 space-y-3.5 shadow-2xs">
      {/* Time Header Display & Quick Native Input */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Set Time
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSetMode('hour')}
                className={`text-lg font-black px-1.5 py-0.5 rounded transition-colors ${
                  setMode === 'hour' ? 'text-emerald-700 bg-emerald-100/80 ring-1 ring-emerald-300' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {String(hour).padStart(2, '0')}
              </button>
              <span className="text-lg font-black text-slate-400">:</span>
              <button
                type="button"
                onClick={() => setSetMode('minute')}
                className={`text-lg font-black px-1.5 py-0.5 rounded transition-colors ${
                  setMode === 'minute' ? 'text-emerald-700 bg-emerald-100/80 ring-1 ring-emerald-300' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {String(minute).padStart(2, '0')}
              </button>

              <button
                type="button"
                onClick={() => updateTime(hour, minute, period === 'AM' ? 'PM' : 'AM')}
                className="ml-1.5 px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black shadow-2xs hover:bg-emerald-700 transition-colors"
              >
                {period}
              </button>
            </div>
          </div>
        </div>

        {/* Mode Selector & Quick Native Time Selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setSetMode('hour')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                setMode === 'hour' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hour
            </button>
            <button
              type="button"
              onClick={() => setSetMode('minute')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                setMode === 'minute' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Min
            </button>
          </div>

          <label className="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded-xl border border-slate-200/80 cursor-pointer flex items-center gap-1">
            <span>Exact:</span>
            <input
              type="time"
              value={native24hValue}
              onChange={handleNativeTimeChange}
              className="bg-transparent font-bold text-slate-800 cursor-pointer focus:outline-none text-xs"
            />
          </label>
        </div>
      </div>

      {/* Interactive Circular Analog Clock Face */}
      <div className="flex flex-col items-center justify-center py-1">
        <p className="text-[11px] font-semibold text-slate-500 mb-1.5 text-center">
          Tap numbers on dial to set <span className="font-bold text-emerald-700 uppercase">{setMode}</span>
          {setMode === 'hour' ? ' (1 - 12)' : ' (0 - 55 min)'}
        </p>

        <div className="relative w-48 h-48 bg-white rounded-full border-4 border-slate-200 shadow-inner flex items-center justify-center select-none">
          {/* Clock Center Pin */}
          <div className="absolute w-3.5 h-3.5 bg-emerald-600 rounded-full z-30 shadow-md border-2 border-white" />

          {/* Hour Hand */}
          <div
            className="absolute w-1.5 h-14 bg-slate-800 rounded-full origin-bottom z-20 shadow-xs"
            style={{
              bottom: '50%',
              transform: `rotate(${hourAngle}deg)`
            }}
          />

          {/* Minute Hand */}
          <div
            className="absolute w-1 h-18 bg-emerald-500 rounded-full origin-bottom z-20 shadow-xs"
            style={{
              bottom: '50%',
              transform: `rotate(${minuteAngle}deg)`
            }}
          />

          {/* 12 Circular Dial Number Buttons */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => {
            const angleDeg = (num % 12) * 30;
            const angleRad = (angleDeg - 90) * (Math.PI / 180);
            const radius = 72; // px from center
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            const isSelectedHour = setMode === 'hour' && hour === (num === 0 ? 12 : num);
            const isSelectedMin = setMode === 'minute' && Math.floor(minute / 5) === (num % 12);
            const isSelected = isSelectedHour || isSelectedMin;

            const displayLabel = setMode === 'hour' ? `${num}` : `${(num % 12) * 5}`;

            return (
              <button
                key={num}
                type="button"
                onClick={() => handleDialClick(num)}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
                className={`absolute w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center transition-transform cursor-pointer z-30 ${
                  isSelected
                    ? 'bg-emerald-600 text-white scale-110 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-emerald-100 hover:text-emerald-900'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 border-t border-slate-200/80">
        {presets.map((p) => (
          <button
            key={p.time}
            type="button"
            onClick={() => {
              const pTime = parseTime(p.time);
              updateTime(pTime.hour, pTime.minute, pTime.period);
            }}
            className={`p-1.5 rounded-xl border text-left text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}` === p.time
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {p.icon}
            <span className="truncate">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
