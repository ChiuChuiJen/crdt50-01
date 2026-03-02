import React, { useMemo, useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { X, TrendingUp, TrendingDown, Activity, Info, Clock, ArrowUp, ArrowDown, PieChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const CricModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { cric, language, getTopConstituents } = useMarketStore();
  const [chartType, setChartType] = useState<'intraday' | 'daily'>('intraday');

  const t = {
    title: language === 'zh' ? 'CR國內日盤 (CRIC Day)' : 'CR Domestic Day Index',
    chart: language === 'zh' ? '走勢圖' : 'Chart',
    intraday: language === 'zh' ? '時分 (24h)' : 'Intraday (24h)',
    daily: language === 'zh' ? '日線 (30d)' : 'Daily (30d)',
    price: language === 'zh' ? '指數' : 'Index',
    change: language === 'zh' ? '漲跌幅' : 'Change',
    high: language === 'zh' ? '最高' : 'High',
    low: language === 'zh' ? '最低' : 'Low',
    info: language === 'zh' ? '指數資訊' : 'Index Info',
    desc: language === 'zh' 
      ? 'CR國內日盤指數 (CRIC) 追蹤國內交易時段 (09:00 - 15:30) 的市場表現。此指數受現貨市場波動影響，反映國內資金在特定交易時段內的動向。' 
      : 'The CR Domestic Day Index (CRIC) tracks market performance during domestic trading hours (09:00 - 15:30). Influenced by spot market volatility, it reflects domestic capital movements during specific trading sessions.',
    closed: language === 'zh' ? '已收盤' : 'Closed',
    open: language === 'zh' ? '交易中' : 'Open',
    orderBook: language === 'zh' ? '買賣盤' : 'Order Book',
    bids: language === 'zh' ? '買入' : 'Bids',
    asks: language === 'zh' ? '賣出' : 'Asks',
    amount: language === 'zh' ? '數量' : 'Amount',
    weights: language === 'zh' ? '權值成分' : 'Constituents',
    weight: language === 'zh' ? '權重' : 'Weight',
  };

  const chartData = useMemo(() => {
    const data = chartType === 'intraday' ? cric.priceHistory : cric.dailyHistory;
    return data.map(h => {
      const d = new Date(h.time);
      return {
        time: chartType === 'intraday' 
          ? d.toLocaleTimeString(language === 'zh' ? 'zh-TW' : 'en-US', { hour: '2-digit', minute: '2-digit' })
          : `${d.getMonth() + 1}/${d.getDate()}`,
        price: h.price
      };
    });
  }, [cric.priceHistory, cric.dailyHistory, chartType, language]);

  const constituents = useMemo(() => getTopConstituents(), [getTopConstituents]);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const isPositive = cric.change24h >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
              CR
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                {t.title}
                {!cric.isOpen && (
                  <span className="text-xs font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full flex items-center gap-1">
                    <Clock size={12} /> {t.closed}
                  </span>
                )}
                {cric.isOpen && (
                  <span className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center gap-1">
                    <Clock size={12} /> {t.open}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-2xl font-mono font-semibold text-zinc-900 dark:text-zinc-100 ${!cric.isOpen ? 'opacity-70' : ''}`}>
                  {formatPrice(cric.price)}
                </span>
                <span className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded text-sm ${
                  isPositive ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30'
                } ${!cric.isOpen ? 'opacity-70' : ''}`}>
                  {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(cric.change24h).toFixed(2)}%
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
              <div className={`h-64 w-full ${!cric.isOpen && chartType === 'intraday' ? 'opacity-80' : ''}`}>
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

            <div className="grid grid-cols-2 gap-4">
              <StatCard label={t.high} value={formatPrice(cric.dailyHigh)} />
              <StatCard label={t.low} value={formatPrice(cric.dailyLow)} />
            </div>

            {/* Constituents Table */}
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <PieChart size={16} /> {t.weights} (Top 10)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase bg-zinc-100 dark:bg-zinc-900/50">
                    <tr>
                      <th className="px-4 py-2 rounded-l-lg">#</th>
                      <th className="px-4 py-2">Symbol</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2 text-right rounded-r-lg">{t.weight}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {constituents.map((c, idx) => (
                      <tr key={c.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-2 font-mono text-zinc-500">{idx + 1}</td>
                        <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-100">{c.symbol}</td>
                        <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">{c.name}</td>
                        <td className="px-4 py-2 text-right font-mono text-zinc-900 dark:text-zinc-100">{c.weight.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Book */}
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ArrowUp size={16} className="text-emerald-500" /> 
                <ArrowDown size={16} className="text-rose-500" /> 
                {t.orderBook}
              </h3>
              
              <div className="flex flex-col gap-1 font-mono text-xs">
                {/* Asks (Sell Orders) - Reversed to show lowest ask at bottom */}
                <div className="flex flex-col-reverse gap-0.5 mb-2">
                  {cric.orderBook?.asks.map((ask, i) => (
                    <div key={`ask-${i}`} className="grid grid-cols-3 gap-2 px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-rose-500/5 dark:bg-rose-500/10 pointer-events-none" style={{ width: `${Math.min(ask.amount, 100)}%`, right: 0, left: 'auto' }}></div>
                      <span className="text-rose-600 dark:text-rose-400 text-right">{formatPrice(ask.price)}</span>
                      <span className="text-zinc-500 text-right">{ask.amount}</span>
                      <span className="text-zinc-400 text-right">{(ask.price * ask.amount / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>

                <div className="text-center py-2 border-y border-zinc-200 dark:border-zinc-800 font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  {formatPrice(cric.price)}
                </div>

                {/* Bids (Buy Orders) */}
                <div className="flex flex-col gap-0.5 mt-2">
                  {cric.orderBook?.bids.map((bid, i) => (
                    <div key={`bid-${i}`} className="grid grid-cols-3 gap-2 px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 pointer-events-none" style={{ width: `${Math.min(bid.amount, 100)}%` }}></div>
                      <span className="text-emerald-600 dark:text-emerald-400 text-right">{formatPrice(bid.price)}</span>
                      <span className="text-zinc-500 text-right">{bid.amount}</span>
                      <span className="text-zinc-400 text-right">{(bid.price * bid.amount / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={16} /> {t.info}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">
                    {t.desc}
                  </div>
                </div>
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
