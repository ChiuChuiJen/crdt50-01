import { create } from 'zustand';
import { Currency, initialCurrencies } from '../data/currencies';
import { eventsA, eventsB, getVolatilityMultiplier, MarketEvent } from '../data/events';

export interface CurrencyState extends Currency {
  priceHistory: { time: number; price: number }[];
  dailyHistory: { time: number; price: number }[];
  dailyHigh: number;
  dailyLow: number;
  dailyOpen: number;
  change24h: number;
  volume24h: number;
  
  futuresPrice: number;
  futuresPriceHistory: { time: number; price: number }[];
  futuresDailyHistory: { time: number; price: number }[];
  futuresDailyHigh: number;
  futuresDailyLow: number;
  futuresDailyOpen: number;
  futuresChange24h: number;
  futuresVolume24h: number;

  foreign: number; // 外資
  institutional: number; // 法人
  whale: number; // 大戶
  retail: number; // 散戶
}

export interface CrdtState {
  price: number;
  priceHistory: { time: number; price: number }[];
  dailyHistory: { time: number; price: number }[];
  dailyHigh: number;
  dailyLow: number;
  dailyOpen: number;
  change24h: number;
}

interface MarketStore {
  currencies: CurrencyState[];
  crdt: CrdtState;
  index: number;
  dailyOpenIndex: number;
  indexDailyHigh: number;
  indexDailyLow: number;
  indexHistory: { time: number; price: number }[];
  indexDailyHistory: { time: number; price: number }[];
  indexChange24h: number;
  time: number; // timestamp
  speed: number;
  isRunning: boolean;
  activeEvents: { event: MarketEvent; targetId?: string; time: number }[];
  language: 'zh' | 'en';
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  toggleLanguage: () => void;
  setSpeed: (speed: number) => void;
  toggleRunning: () => void;
  nextTick: () => void;
  nextDay: () => void;
}

const generateDailyHistory = (currentPrice: number, days: number) => {
  const history = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let p = currentPrice;
  for (let i = 0; i < days; i++) {
    history.unshift({ time: now.getTime() - i * 24 * 60 * 60 * 1000, price: p });
    p = p / (1 + (Math.random() * 0.1 - 0.05));
  }
  return history;
};

const initializeCurrencies = (): CurrencyState[] => {
  const now = Date.now();
  return initialCurrencies.map(c => {
    const spotHistory = Array.from({ length: 24 }, (_, i) => ({
      time: now - (24 - i) * 10 * 60 * 1000,
      price: c.price * (1 + (Math.random() * 0.02 - 0.01)),
    }));
    const futuresHistory = spotHistory.map(h => ({
      time: h.time,
      price: h.price * (1 + (Math.random() * 0.004 - 0.002)),
    }));
    const spotDaily = generateDailyHistory(c.price, 30);
    const futuresDaily = spotDaily.map(h => ({
      time: h.time,
      price: h.price * (1 + (Math.random() * 0.004 - 0.002)),
    }));
    const futuresPrice = c.price * (1 + (Math.random() * 0.002 - 0.001));

    return {
      ...c,
      priceHistory: spotHistory,
      dailyHistory: spotDaily,
      dailyHigh: c.price * 1.05,
      dailyLow: c.price * 0.95,
      dailyOpen: c.price,
      change24h: 0,
      volume24h: c.volume30d / 30,

      futuresPrice: futuresPrice,
      futuresPriceHistory: futuresHistory,
      futuresDailyHistory: futuresDaily,
      futuresDailyHigh: futuresPrice * 1.05,
      futuresDailyLow: futuresPrice * 0.95,
      futuresDailyOpen: futuresPrice,
      futuresChange24h: 0,
      futuresVolume24h: (c.volume30d / 30) * (1.5 + Math.random()),

      foreign: 20 + Math.random() * 30,
      institutional: 10 + Math.random() * 20,
      whale: 10 + Math.random() * 20,
      retail: 20 + Math.random() * 30,
    };
  });
};

const initializeCrdt = (): CrdtState => {
  const now = Date.now();
  return {
    price: 1.0,
    priceHistory: Array.from({ length: 24 }, (_, i) => ({
      time: now - (24 - i) * 10 * 60 * 1000,
      price: 1.0 + (Math.random() * 0.002 - 0.001), // Very stable
    })),
    dailyHistory: generateDailyHistory(1.0, 30).map(h => ({...h, price: 1.0 + (Math.random() * 0.004 - 0.002)})),
    dailyHigh: 1.002,
    dailyLow: 0.998,
    dailyOpen: 1.0,
    change24h: 0,
  };
};

const calculateIndex = (currencies: CurrencyState[], baseIndex: number = 10000) => {
  const top50 = [...currencies].sort((a, b) => b.volume30d - a.volume30d).slice(0, 50);
  const totalWeight = top50.reduce((sum, c) => sum + c.volume30d, 0);
  
  let indexRatio = 0;
  top50.forEach(c => {
    const weight = c.volume30d / totalWeight;
    const initialCurrency = initialCurrencies.find(ic => ic.id === c.id);
    const initialPrice = initialCurrency ? initialCurrency.price : c.dailyOpen;
    const ratio = c.price / initialPrice;
    indexRatio += ratio * weight;
  });
  
  return baseIndex * indexRatio;
};

export const useMarketStore = create<MarketStore>((set, get) => ({
  currencies: initializeCurrencies(),
  crdt: initializeCrdt(),
  index: 10000,
  dailyOpenIndex: 10000,
  indexDailyHigh: 10000,
  indexDailyLow: 10000,
  indexHistory: [{ time: Date.now(), price: 10000 }],
  indexDailyHistory: generateDailyHistory(10000, 30),
  indexChange24h: 0,
  time: Date.now(),
  speed: 1,
  isRunning: false,
  activeEvents: [],
  language: 'zh',
  theme: 'dark',

  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleLanguage: () => set(state => ({ language: state.language === 'zh' ? 'en' : 'zh' })),
  setSpeed: (speed) => set({ speed }),
  toggleRunning: () => set(state => ({ isRunning: !state.isRunning })),

  nextTick: () => {
    set(state => {
      const oldDate = new Date(state.time);
      const newTime = state.time + 10 * 60 * 1000;
      const newDate = new Date(newTime);
      const isNewDay = oldDate.getDate() !== newDate.getDate();
      
      const newEvents = [...state.activeEvents];
      if (Math.random() < 0.014) {
        const isGlobal = Math.random() > 0.5;
        if (isGlobal) {
          const event = eventsB[Math.floor(Math.random() * eventsB.length)];
          newEvents.unshift({ event, time: newTime });
        } else {
          const event = eventsA[Math.floor(Math.random() * eventsA.length)];
          const target = state.currencies[Math.floor(Math.random() * state.currencies.length)];
          newEvents.unshift({ event, targetId: target.id, time: newTime });
        }
        if (newEvents.length > 20) newEvents.pop();
      }

      const newCurrencies = state.currencies.map(c => {
        let volatility = getVolatilityMultiplier() / 144;
        
        const recentEvent = newEvents[0];
        if (recentEvent && recentEvent.time === newTime && (recentEvent.event.type === 'B' || recentEvent.targetId === c.id)) {
          // Use the event's impact directly, plus some random variation (80% to 120% of impact)
          const eventEffect = recentEvent.event.impact * (0.8 + Math.random() * 0.4);
          volatility += eventEffect;
        }

        const changeFromOpen = (c.price - c.dailyOpen) / c.dailyOpen;
        if (changeFromOpen > 0.15) volatility -= 0.02;
        if (changeFromOpen < -0.15) volatility += 0.02;

        let newPrice = c.price * (1 + volatility);
        if (newPrice < 0.00000001) newPrice = 0.00000001;

        const newHistory = [...c.priceHistory, { time: newTime, price: newPrice }];
        if (newHistory.length > 144) newHistory.shift();

        const basis = (newPrice - c.futuresPrice) / c.futuresPrice;
        const futuresVolatility = (basis * 0.1) + (0.003 * (Math.random() - 0.5)); 
        const newFuturesPrice = c.futuresPrice * (1 + futuresVolatility);
        const newFuturesHistory = [...c.futuresPriceHistory, { time: newTime, price: newFuturesPrice }];
        if (newFuturesHistory.length > 144) newFuturesHistory.shift();

        return {
          ...c,
          price: newPrice,
          priceHistory: newHistory,
          dailyHistory: isNewDay ? [...c.dailyHistory, { time: newTime, price: newPrice }].slice(-30) : c.dailyHistory,
          dailyOpen: isNewDay ? newPrice : c.dailyOpen,
          dailyHigh: isNewDay ? newPrice : Math.max(c.dailyHigh, newPrice),
          dailyLow: isNewDay ? newPrice : Math.min(c.dailyLow, newPrice),
          change24h: isNewDay ? 0 : ((newPrice - c.dailyOpen) / c.dailyOpen) * 100,

          futuresPrice: newFuturesPrice,
          futuresPriceHistory: newFuturesHistory,
          futuresDailyHistory: isNewDay ? [...c.futuresDailyHistory, { time: newTime, price: newFuturesPrice }].slice(-30) : c.futuresDailyHistory,
          futuresDailyOpen: isNewDay ? newFuturesPrice : c.futuresDailyOpen,
          futuresDailyHigh: isNewDay ? newFuturesPrice : Math.max(c.futuresDailyHigh, newFuturesPrice),
          futuresDailyLow: isNewDay ? newFuturesPrice : Math.min(c.futuresDailyLow, newFuturesPrice),
          futuresChange24h: isNewDay ? 0 : ((newFuturesPrice - c.futuresDailyOpen) / c.futuresDailyOpen) * 100,
        };
      });

      // Simulate CRDT (Stablecoin logic: 0.995 - 1.005)
      let crdtVolatility = (Math.random() * 0.002 - 0.001); // +/- 0.1% max per tick
      let newCrdtPrice = state.crdt.price * (1 + crdtVolatility);
      
      // Hard bounds for stablecoin
      if (newCrdtPrice > 1.005) newCrdtPrice = 1.005 - (Math.random() * 0.001);
      if (newCrdtPrice < 0.995) newCrdtPrice = 0.995 + (Math.random() * 0.001);
      // Soft peg to 1.0
      if (newCrdtPrice > 1.0) newCrdtPrice -= 0.0005;
      if (newCrdtPrice < 1.0) newCrdtPrice += 0.0005;

      const newCrdtHistory = [...state.crdt.priceHistory, { time: newTime, price: newCrdtPrice }];
      if (newCrdtHistory.length > 144) newCrdtHistory.shift();

      const newCrdt = {
        ...state.crdt,
        price: newCrdtPrice,
        priceHistory: newCrdtHistory,
        dailyHistory: isNewDay ? [...state.crdt.dailyHistory, { time: newTime, price: newCrdtPrice }].slice(-30) : state.crdt.dailyHistory,
        dailyOpen: isNewDay ? newCrdtPrice : state.crdt.dailyOpen,
        dailyHigh: isNewDay ? newCrdtPrice : Math.max(state.crdt.dailyHigh, newCrdtPrice),
        dailyLow: isNewDay ? newCrdtPrice : Math.min(state.crdt.dailyLow, newCrdtPrice),
        change24h: isNewDay ? 0 : ((newCrdtPrice - state.crdt.dailyOpen) / state.crdt.dailyOpen) * 100,
      };

      const newIndex = calculateIndex(newCurrencies, 10000);
      const newIndexHistory = [...state.indexHistory, { time: newTime, price: newIndex }];
      if (newIndexHistory.length > 144) newIndexHistory.shift();
      const newDailyOpenIndex = isNewDay ? newIndex : state.dailyOpenIndex;
      const newIndexDailyHistory = isNewDay ? [...state.indexDailyHistory, { time: newTime, price: newIndex }].slice(-30) : state.indexDailyHistory;

      return {
        time: newTime,
        currencies: newCurrencies,
        crdt: newCrdt,
        activeEvents: newEvents,
        index: newIndex,
        dailyOpenIndex: newDailyOpenIndex,
        indexDailyHigh: isNewDay ? newIndex : Math.max(state.indexDailyHigh, newIndex),
        indexDailyLow: isNewDay ? newIndex : Math.min(state.indexDailyLow, newIndex),
        indexHistory: newIndexHistory,
        indexDailyHistory: newIndexDailyHistory,
        indexChange24h: isNewDay ? 0 : ((newIndex - newDailyOpenIndex) / newDailyOpenIndex) * 100,
      };
    });
  },

  nextDay: () => {
    set(state => {
      const nextDate = new Date(state.time);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);
      const newTime = nextDate.getTime();
      
      const newCurrencies = state.currencies.map(c => {
        const dailyVol = getVolatilityMultiplier();
        let newPrice = c.price * (1 + dailyVol);
        if (newPrice < 0.00000001) newPrice = 0.00000001;
        
        const basis = (newPrice - c.futuresPrice) / c.futuresPrice;
        const futuresVolatility = (basis * 0.5) + (0.02 * (Math.random() - 0.5));
        const newFuturesPrice = c.futuresPrice * (1 + futuresVolatility);

        return {
          ...c,
          price: newPrice,
          dailyOpen: newPrice,
          dailyHigh: newPrice,
          dailyLow: newPrice,
          change24h: 0,
          priceHistory: [...c.priceHistory, { time: newTime, price: newPrice }].slice(-144),
          dailyHistory: [...c.dailyHistory, { time: newTime, price: newPrice }].slice(-30),

          futuresPrice: newFuturesPrice,
          futuresDailyOpen: newFuturesPrice,
          futuresDailyHigh: newFuturesPrice,
          futuresDailyLow: newFuturesPrice,
          futuresChange24h: 0,
          futuresPriceHistory: [...c.futuresPriceHistory, { time: newTime, price: newFuturesPrice }].slice(-144),
          futuresDailyHistory: [...c.futuresDailyHistory, { time: newTime, price: newFuturesPrice }].slice(-30),
        };
      });

      let newCrdtPrice = state.crdt.price * (1 + (Math.random() * 0.004 - 0.002));
      if (newCrdtPrice > 1.005) newCrdtPrice = 1.005;
      if (newCrdtPrice < 0.995) newCrdtPrice = 0.995;

      const newCrdt = {
        ...state.crdt,
        price: newCrdtPrice,
        dailyOpen: newCrdtPrice,
        dailyHigh: newCrdtPrice,
        dailyLow: newCrdtPrice,
        change24h: 0,
        priceHistory: [...state.crdt.priceHistory, { time: newTime, price: newCrdtPrice }].slice(-144),
        dailyHistory: [...state.crdt.dailyHistory, { time: newTime, price: newCrdtPrice }].slice(-30)
      };

      const newIndex = calculateIndex(newCurrencies, 10000);
      const newIndexHistory = [...state.indexHistory, { time: newTime, price: newIndex }].slice(-144);
      const newIndexDailyHistory = [...state.indexDailyHistory, { time: newTime, price: newIndex }].slice(-30);

      return {
        time: newTime,
        currencies: newCurrencies,
        crdt: newCrdt,
        index: newIndex,
        dailyOpenIndex: newIndex,
        indexDailyHigh: newIndex,
        indexDailyLow: newIndex,
        indexChange24h: 0,
        indexHistory: newIndexHistory,
        indexDailyHistory: newIndexDailyHistory
      };
    });
  }
}));
