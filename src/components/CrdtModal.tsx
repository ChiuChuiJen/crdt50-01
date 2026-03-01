import React, { useMemo, useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { X, TrendingUp, TrendingDown, Activity, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { crdtInfo } from '../data/crdt';

export const CrdtModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { crdt, language } = useMarketStore();
  const [chartType, setChartType] = useState<'intraday' | 'daily'>('intraday');

  const t = {
    title: language === 'zh' ? 'CR Dollar Token' : 'CR Dollar Token',
    chart: language === 'zh' ? '走勢圖' : 'Chart',
    intraday: language === 'zh' ? '時分 (24h)' : 'Intraday (24h)',
    daily: language === 'zh' ? '日線 (30d)' : 'Daily (30d)',
    price: language === 'zh' ? '價格' : 'Price',
    change: language === 'zh' ? '漲跌幅' : 'Change',
    high: language === 'zh' ? '最高' : 'High',
    low: language === 'zh' ? '最低' : 'Low',
    info: language === 'zh' ? '貨幣基本資訊' : 'Basic Info',
    type: language === 'zh' ? '貨幣類型' : 'Type',
    anchor: language === 'zh' ? '錨定資產' : 'Anchor',
    ratio: language === 'zh' ? '掛勾比例' : 'Ratio',
    range: language === 'zh' ? '價格波動區間' : 'Price Range',
    issuer: language === 'zh' ? '發行機構' : 'Issuer',
    blockchain: language === 'zh' ? '區塊鏈' : 'Blockchain',
    consensus: language === 'zh' ? '共識機制' : 'Consensus',
    desc: language === 'zh' ? '貨幣介紹' : 'Description',
  };

  const chartData = useMemo(() => {
    const data = chartType === 'intraday' ? crdt.priceHistory : crdt.dailyHistory;
    return data.map(h => {
      const d = new Date(h.time);
      return {
        time: chartType === 'intraday' 
          ? d.toLocaleTimeString(language === 'zh' ? 'zh-TW' : 'en-US', { hour: '2-digit', minute: '2-digit' })
          : `${d.getMonth() + 1}/${d.getDate()}`,
        price: h.price
      };
    });
  }, [crdt.priceHistory, crdt.dailyHistory, chartType, language]);

  const formatPrice = (price: number) => {
    return price.toFixed(4);
  };

  const isPositive = crdt.change24h >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
              CR
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                {t.title} <span className="text-zinc-400 dark:text-zinc-500 font-normal text-lg">CRDT</span>
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(crdt.price)}
                </span>
                <span className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded text-sm ${
                  isPositive ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30'
                }`}>
                  {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(crdt.change24h).toFixed(2)}%
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
                      domain={[0.99, 1.01]}
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
              <StatCard label={t.high} value={formatPrice(crdt.dailyHigh)} />
              <StatCard label={t.low} value={formatPrice(crdt.dailyLow)} />
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
                    {crdtInfo.description}
                  </div>
                </div>
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                  <InfoRow label={t.type} value={crdtInfo.type} />
                  <InfoRow label={t.anchor} value={crdtInfo.anchor} />
                  <InfoRow label={t.ratio} value={crdtInfo.ratio} />
                  <InfoRow label={t.range} value={crdtInfo.range} />
                  <InfoRow label={t.issuer} value={crdtInfo.issuer} />
                  <InfoRow label={t.blockchain} value={crdtInfo.blockchain} />
                  <InfoRow label={t.consensus} value={crdtInfo.consensus} />
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

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{label}</span>
    <span className="text-sm text-zinc-900 dark:text-zinc-100 text-right">{value}</span>
  </div>
);
