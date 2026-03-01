import React, { useState, useEffect } from 'react';
import { useMarketStore } from '../store/marketStore';
import { Bell } from 'lucide-react';

export const NewsTicker: React.FC = () => {
  const { activeEvents, language } = useMarketStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeEvents.length]);

  useEffect(() => {
    if (currentIndex >= activeEvents.length && activeEvents.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeEvents.length, currentIndex]);

  const t = {
    news: language === 'zh' ? '最新公告' : 'Latest News',
    noNews: language === 'zh' ? '目前無重大事件' : 'No major events currently',
  };

  return (
    <div className="bg-indigo-50 dark:bg-indigo-950/30 border-y border-indigo-100 dark:border-indigo-900/50 py-2 px-4 flex items-center gap-3 overflow-hidden">
      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold whitespace-nowrap">
        <Bell size={16} />
        <span className="text-sm uppercase tracking-wider">{t.news}</span>
      </div>
      <div className="h-4 w-px bg-indigo-200 dark:bg-indigo-800 shrink-0"></div>
      
      <div className="flex-1 overflow-hidden relative h-6">
        {activeEvents.length > 0 ? (
          <div 
            className="flex flex-col transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${currentIndex * 1.5}rem)` }}
          >
            {activeEvents.map((e, i) => (
              <div key={i} className="h-6 flex items-center gap-2 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                  {new Date(e.time).toLocaleTimeString(language === 'zh' ? 'zh-TW' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={e.event.type === 'B' ? 'text-rose-600 dark:text-rose-400 font-medium' : 'text-emerald-600 dark:text-emerald-400 font-medium'}>
                  {e.targetId ? `[${e.targetId}] ` : '[Global] '}
                </span>
                {e.event.description}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-6 flex items-center">
            <span className="text-sm text-zinc-500 dark:text-zinc-400 italic">
              {t.noNews}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
