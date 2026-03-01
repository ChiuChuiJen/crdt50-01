import React, { useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { ArrowUpRight, ArrowDownRight, Search, Filter } from 'lucide-react';

export const MarketTable: React.FC<{ onSelect: (id: string) => void, marketType: 'spot' | 'futures' }> = ({ onSelect, marketType }) => {
  const { currencies, language } = useMarketStore();
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'volume30d',
    direction: 'desc',
  });

  const t = {
    search: language === 'zh' ? '搜尋貨幣...' : 'Search currency...',
    pair: language === 'zh' ? '交易對' : 'Pair',
    price: language === 'zh' ? '最新價格' : 'Last Price',
    change: language === 'zh' ? '24h 漲跌' : '24h Change',
    high: language === 'zh' ? '24h 最高' : '24h High',
    low: language === 'zh' ? '24h 最低' : '24h Low',
    volume: language === 'zh' ? '24h 成交量' : '24h Volume',
    marketCap: language === 'zh' ? '市值' : 'Market Cap',
  };

  const sortedCurrencies = [...currencies]
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof typeof a];
      let bValue: any = b[sortConfig.key as keyof typeof b];

      if (marketType === 'futures') {
        if (sortConfig.key === 'price') { aValue = a.futuresPrice; bValue = b.futuresPrice; }
        if (sortConfig.key === 'change24h') { aValue = a.futuresChange24h; bValue = b.futuresChange24h; }
        if (sortConfig.key === 'dailyHigh') { aValue = a.futuresDailyHigh; bValue = b.futuresDailyHigh; }
        if (sortConfig.key === 'dailyLow') { aValue = a.futuresDailyLow; bValue = b.futuresDailyLow; }
        if (sortConfig.key === 'volume24h') { aValue = a.futuresVolume24h; bValue = b.futuresVolume24h; }
      }
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const formatPrice = (price: number) => {
    if (price < 0.001) return price.toFixed(8);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-zinc-950">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 w-64 transition-all"
          />
        </div>
        <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
          <Filter size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-900/90 backdrop-blur-sm z-10 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="p-4 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" onClick={() => handleSort('symbol')}>{t.pair}</th>
              <th className="p-4 text-right cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" onClick={() => handleSort('price')}>{t.price}</th>
              <th className="p-4 text-right cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" onClick={() => handleSort('change24h')}>{t.change}</th>
              <th className="p-4 text-right hidden md:table-cell cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" onClick={() => handleSort('dailyHigh')}>{t.high}</th>
              <th className="p-4 text-right hidden md:table-cell cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" onClick={() => handleSort('dailyLow')}>{t.low}</th>
              <th className="p-4 text-right hidden lg:table-cell cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" onClick={() => handleSort('volume24h')}>{t.volume}</th>
              <th className="p-4 text-right hidden xl:table-cell cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100" onClick={() => handleSort('marketCap')}>{t.marketCap}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {sortedCurrencies.map(c => {
              const price = marketType === 'spot' ? c.price : c.futuresPrice;
              const change24h = marketType === 'spot' ? c.change24h : c.futuresChange24h;
              const dailyHigh = marketType === 'spot' ? c.dailyHigh : c.futuresDailyHigh;
              const dailyLow = marketType === 'spot' ? c.dailyLow : c.futuresDailyLow;
              const volume24h = marketType === 'spot' ? c.volume24h : c.futuresVolume24h;

              return (
              <tr 
                key={c.id} 
                onClick={() => onSelect(c.id)}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {c.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {c.symbol}/CRDT
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{c.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right font-mono font-medium text-zinc-900 dark:text-zinc-100">
                  {formatPrice(price)}
                </td>
                <td className="p-4 text-right">
                  <div className={`inline-flex items-center gap-1 font-medium px-2 py-1 rounded-md text-sm ${
                    change24h >= 0 
                      ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' 
                      : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30'
                  }`}>
                    {change24h >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(change24h).toFixed(2)}%
                  </div>
                </td>
                <td className="p-4 text-right hidden md:table-cell font-mono text-sm text-zinc-600 dark:text-zinc-400">
                  {formatPrice(dailyHigh)}
                </td>
                <td className="p-4 text-right hidden md:table-cell font-mono text-sm text-zinc-600 dark:text-zinc-400">
                  {formatPrice(dailyLow)}
                </td>
                <td className="p-4 text-right hidden lg:table-cell font-mono text-sm text-zinc-600 dark:text-zinc-400">
                  {formatNumber(volume24h)}
                </td>
                <td className="p-4 text-right hidden xl:table-cell font-mono text-sm text-zinc-600 dark:text-zinc-400">
                  {formatNumber(c.marketCap)}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};
