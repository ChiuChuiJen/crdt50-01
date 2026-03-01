import React, { useMemo, useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { X, TrendingUp, TrendingDown, Info, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const CurrencyModal: React.FC<{ id: string; marketType: 'spot' | 'futures'; onClose: () => void }> = ({ id, marketType, onClose }) => {
  const { currencies, language } = useMarketStore();
  const [chartType, setChartType] = useState<'intraday' | 'daily'>('intraday');
  const currency = currencies.find(c => c.id === id);

  if (!currency) return null;

  const t = {
    info: language === 'zh' ? '貨幣基本資訊' : 'Basic Info',
    chart: language === 'zh' ? '走勢圖' : 'Chart',
    intraday: language === 'zh' ? '時分 (24h)' : 'Intraday (24h)',
    daily: language === 'zh' ? '日線 (30d)' : 'Daily (30d)',
    distribution: language === 'zh' ? '籌碼分布' : 'Distribution',
    price: language === 'zh' ? '價格' : 'Price',
    change: language === 'zh' ? '漲跌幅' : 'Change',
    high: language === 'zh' ? '最高' : 'High',
    low: language === 'zh' ? '最低' : 'Low',
    volume: language === 'zh' ? '成交量' : 'Volume',
    marketCap: language === 'zh' ? '市值' : 'Market Cap',
    supply: language === 'zh' ? '發行量' : 'Supply',
    desc: language === 'zh' ? '貨幣介紹' : 'Description',
    foreign: language === 'zh' ? '外資' : 'Foreign',
    inst: language === 'zh' ? '法人' : 'Institutional',
    whale: language === 'zh' ? '大戶' : 'Whale',
    retail: language === 'zh' ? '散戶' : 'Retail',
  };

  const chartData = useMemo(() => {
    let data;
    if (marketType === 'spot') {
      data = chartType === 'intraday' ? currency.priceHistory : currency.dailyHistory;
    } else {
      data = chartType === 'intraday' ? currency.futuresPriceHistory : currency.futuresDailyHistory;
    }
    
    return data.map(h => {
      const d = new Date(h.time);
      return {
        time: chartType === 'intraday' 
          ? d.toLocaleTimeString(language === 'zh' ? 'zh-TW' : 'en-US', { hour: '2-digit', minute: '2-digit' })
          : `${d.getMonth() + 1}/${d.getDate()}`,
        price: h.price
      };
    });
  }, [currency, chartType, marketType, language]);

  const formatPrice = (price: number) => {
    if (price < 0.001) return price.toFixed(8);
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const isPositive = marketType === 'spot' ? currency.change24h >= 0 : currency.futuresChange24h >= 0;
  const currentPrice = marketType === 'spot' ? currency.price : currency.futuresPrice;
  const currentChange = marketType === 'spot' ? currency.change24h : currency.futuresChange24h;
  const currentHigh = marketType === 'spot' ? currency.dailyHigh : currency.futuresDailyHigh;
  const currentLow = marketType === 'spot' ? currency.dailyLow : currency.futuresDailyLow;
  const currentVolume = marketType === 'spot' ? currency.volume24h : currency.futuresVolume24h;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
              {currency.symbol.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                {currency.name} <span className="text-zinc-400 dark:text-zinc-500 font-normal text-lg">{currency.symbol}/CRDT {marketType === 'futures' ? '(Futures)' : ''}</span>
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(currentPrice)}
                </span>
                <span className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded text-sm ${
                  isPositive ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30'
                }`}>
                  {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(currentChange).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity size={16} /> {t.chart}
                </h3>
                <div className="flex bg-zinc-200 dark:bg-zinc-800 p-1 rounded-lg">
                  <button
                    onClick={() => setChartType('intraday')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      chartType === 'intraday' 
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    {t.intraday}
                  </button>
                  <button
                    onClick={() => setChartType('daily')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      chartType === 'daily' 
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    {t.daily}
                  </button>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#71717a' }}
                      minTickGap={30}
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#71717a' }}
                      tickFormatter={(val) => formatPrice(val)}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#f4f4f5' }}
                      itemStyle={{ color: '#818cf8' }}
                      labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={isPositive ? '#10b981' : '#f43f5e'} 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label={t.high} value={formatPrice(currentHigh)} />
              <StatCard label={t.low} value={formatPrice(currentLow)} />
              <StatCard label={t.volume} value={formatNumber(currentVolume)} />
              <StatCard label={t.marketCap} value={formatNumber(currency.marketCap)} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={16} /> {t.info}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{t.desc}</div>
                  <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">
                    {currency.description}
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{t.supply}</span>
                    <span className="text-sm font-mono text-zinc-900 dark:text-zinc-100">{formatNumber(currency.supply)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <PieChart size={16} /> {t.distribution}
              </h3>
              <div className="space-y-3">
                <DistributionBar label={t.foreign} value={currency.foreign} color="bg-indigo-500" />
                <DistributionBar label={t.inst} value={currency.institutional} color="bg-emerald-500" />
                <DistributionBar label={t.whale} value={currency.whale} color="bg-amber-500" />
                <DistributionBar label={t.retail} value={currency.retail} color="bg-rose-500" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-center">
    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</div>
    <div className="text-lg font-mono font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
  </div>
);

const DistributionBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <span className="font-mono text-zinc-900 dark:text-zinc-100">{value.toFixed(1)}%</span>
    </div>
    <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
    </div>
  </div>
);
