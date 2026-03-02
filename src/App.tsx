import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NewsTicker } from './components/NewsTicker';
import { MarketTable } from './components/MarketTable';
import { CurrencyModal } from './components/CurrencyModal';
import { IndexModal } from './components/IndexModal';
import { IndexCard } from './components/IndexCard';
import { CrdtCard } from './components/CrdtCard';
import { CrdtModal } from './components/CrdtModal';
import { CricCard } from './components/CricCard';
import { CricModal } from './components/CricModal';
import { useMarketStore } from './store/marketStore';

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [isIndexModalOpen, setIsIndexModalOpen] = useState(false);
  const [isCrdtModalOpen, setIsCrdtModalOpen] = useState(false);
  const [isCricModalOpen, setIsCricModalOpen] = useState(false);
  const [marketType, setMarketType] = useState<'spot' | 'futures' | 'forex'>('spot');
  const [spotSubType, setSpotSubType] = useState<'general' | 'cric'>('general');
  const { theme, language } = useMarketStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const t = {
    spot: language === 'zh' ? '現貨市場' : 'Spot Market',
    futures: language === 'zh' ? '合約市場' : 'Futures Market',
    forex: language === 'zh' ? '匯率市場' : 'Exchange Market',
    general: language === 'zh' ? '一般市場' : 'General Market',
    cric: language === 'zh' ? 'CR日盤市場' : 'CR Day Market',
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200`}>
      <Header />
      <NewsTicker />
      
      <main className="flex-1 overflow-hidden flex flex-col md:flex-row p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-72 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
          <IndexCard onClick={() => setIsIndexModalOpen(true)} />
          <CricCard onClick={() => setIsCricModalOpen(true)} />
          <CrdtCard onClick={() => setIsCrdtModalOpen(true)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Tabs */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 w-fit">
              <button
                onClick={() => setMarketType('spot')}
                className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                  marketType === 'spot'
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {t.spot}
              </button>
              <button
                onClick={() => setMarketType('futures')}
                className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                  marketType === 'futures'
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {t.futures}
              </button>
              <button
                onClick={() => setMarketType('forex')}
                className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                  marketType === 'forex'
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {t.forex}
              </button>
            </div>

            {marketType === 'spot' && (
              <div className="flex items-center gap-2 px-2">
                <button
                  onClick={() => setSpotSubType('general')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    spotSubType === 'general'
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  {t.general}
                </button>
                <button
                  onClick={() => setSpotSubType('cric')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    spotSubType === 'cric'
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  {t.cric}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
            <MarketTable onSelect={setSelectedCurrency} marketType={marketType} spotSubType={spotSubType} />
          </div>
        </div>
      </main>

      {selectedCurrency && (
        <CurrencyModal 
          id={selectedCurrency} 
          marketType={marketType}
          onClose={() => setSelectedCurrency(null)} 
        />
      )}

      {isIndexModalOpen && (
        <IndexModal onClose={() => setIsIndexModalOpen(false)} />
      )}

      {isCrdtModalOpen && (
        <CrdtModal onClose={() => setIsCrdtModalOpen(false)} />
      )}

      {isCricModalOpen && (
        <CricModal onClose={() => setIsCricModalOpen(false)} />
      )}
    </div>
  );
}
