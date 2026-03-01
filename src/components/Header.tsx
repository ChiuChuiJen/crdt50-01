import React, { useEffect } from 'react';
import { useMarketStore } from '../store/marketStore';
import { Play, Pause, FastForward, SkipForward, Moon, Sun, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    time, speed, isRunning, theme, language,
    toggleTheme, toggleLanguage, setSpeed, toggleRunning, nextDay, nextTick
  } = useMarketStore();

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        nextTick();
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isRunning, speed, nextTick]);

  const date = new Date(time);
  const timeString = date.toLocaleTimeString(language === 'zh' ? 'zh-TW' : 'en-US', { 
    hour: '2-digit', minute: '2-digit' 
  });
  const dateString = date.toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US');

  const t = {
    start: language === 'zh' ? '開始模擬' : 'Start',
    pause: language === 'zh' ? '暫停' : 'Pause',
    speed: language === 'zh' ? '速度倍率' : 'Speed',
    nextDay: language === 'zh' ? '下一日' : 'Next Day',
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="flex items-center gap-6 mb-4 md:mb-0">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
          CR Exchange
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button 
            onClick={toggleRunning}
            className={`p-2 rounded-md flex items-center gap-1 transition-colors ${isRunning ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'}`}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            <span className="text-sm font-medium hidden sm:inline">{isRunning ? t.pause : t.start}</span>
          </button>
          
          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-600 mx-1"></div>
          
          {[1, 5, 10].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${speed === s ? 'bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'}`}
            >
              {s}x
            </button>
          ))}
          
          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-600 mx-1"></div>
          
          <button 
            onClick={nextDay}
            className="p-2 rounded-md flex items-center gap-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <SkipForward size={16} />
            <span className="text-sm font-medium hidden sm:inline">{t.nextDay}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-sm font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <span>{dateString}</span>
          <span>{timeString}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors">
            <Globe size={18} />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
