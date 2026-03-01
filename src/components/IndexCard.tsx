import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export const IndexCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { index, indexChange24h, indexHistory, language } = useMarketStore();

  const t = {
    index: language === 'zh' ? 'CR加權指數' : 'CR Index',
  };

  const isPositive = indexChange24h >= 0;

  const chartData = indexHistory.map(h => ({ price: h.price }));

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1 group-hover:text-indigo-500 transition-colors">
            {t.index}
          </h2>
          <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {index.toFixed(2)}
          </div>
        </div>
        <div className={`flex items-center gap-1 font-medium px-2 py-1 rounded-md text-sm ${
          isPositive ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30'
        }`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(indexChange24h).toFixed(2)}%
        </div>
      </div>

      <div className="h-16 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis domain={['auto', 'auto']} hide />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? '#10b981' : '#f43f5e'} 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
