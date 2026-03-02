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

  cricPrice: number;
  cricPriceHistory: { time: number; price: number }[];
  cricDailyHistory: { time: number; price: number }[];
  cricDailyHigh: number;
  cricDailyLow: number;
  cricDailyOpen: number;
  cricChange24h: number;
  cricVolume24h: number;

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

export interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
}

export interface CricState {
  price: number;
  priceHistory: { time: number; price: number }[];
  dailyHistory: { time: number; price: number }[];
  dailyHigh: number;
  dailyLow: number;
  dailyOpen: number;
  change24h: number;
  isOpen: boolean;
  orderBook: {
    bids: OrderBookItem[];
    asks: OrderBookItem[];
  };
}

export interface ForexPair {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  dailyHigh: number;
  dailyLow: number;
  dailyOpen: number;
  priceHistory: { time: number; price: number }[];
  dailyHistory: { time: number; price: number }[];
}

interface MarketStore {
  currencies: CurrencyState[];
  crdt: CrdtState;
  cric: CricState;
  forexPairs: ForexPair[];
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
  getTopConstituents: () => { id: string; name: string; symbol: string; weight: number }[];
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

const generateOrderBook = (currentPrice: number): { bids: OrderBookItem[]; asks: OrderBookItem[] } => {
  const bids: OrderBookItem[] = [];
  const asks: OrderBookItem[] = [];
  
  // Generate 5 bids and 5 asks
  for (let i = 0; i < 5; i++) {
    const bidPrice = currentPrice * (1 - (i + 1) * 0.0005 - Math.random() * 0.0005);
    const askPrice = currentPrice * (1 + (i + 1) * 0.0005 + Math.random() * 0.0005);
    
    bids.push({
      price: bidPrice,
      amount: Math.floor(Math.random() * 50) + 10,
      total: 0 // Calculated later if needed, or just visual
    });
    
    asks.push({
      price: askPrice,
      amount: Math.floor(Math.random() * 50) + 10,
      total: 0
    });
  }
  return { bids, asks };
};

const initializeCric = (): CricState => {
  const now = Date.now();
  const initialPrice = 5000;
  // Start with empty history or just the current point to avoid pre-simulation
  return {
    price: initialPrice,
    priceHistory: [{ time: now, price: initialPrice }],
    dailyHistory: [{ time: now, price: initialPrice }], // Start fresh
    dailyHigh: initialPrice,
    dailyLow: initialPrice,
    dailyOpen: initialPrice,
    change24h: 0,
    isOpen: false,
    orderBook: generateOrderBook(initialPrice),
  };
};

const initializeForexPairs = (): ForexPair[] => {
  const now = Date.now();
  
  // CRDT/USD - Pegged ~1.0
  const crdtUsdPrice = 1.0;
  const crdtUsdHistory = [{ time: now, price: crdtUsdPrice }];
  const crdtUsdDaily = generateDailyHistory(crdtUsdPrice, 30).map(h => ({...h, price: 1.0 + (Math.random() * 0.004 - 0.002)}));

  // USD/CRND - ~30.0
  const usdCrndPrice = 30.0;
  const usdCrndHistory = [{ time: now, price: usdCrndPrice }];
  const usdCrndDaily = generateDailyHistory(usdCrndPrice, 30).map(h => ({...h, price: 30.0 + (Math.random() * 0.5 - 0.25)}));

  return [
    {
      id: 'crdt-usd',
      symbol: 'CRDT/USD',
      name: 'CRDT / US Dollar',
      price: crdtUsdPrice,
      change24h: 0,
      dailyHigh: crdtUsdPrice * 1.002,
      dailyLow: crdtUsdPrice * 0.998,
      dailyOpen: crdtUsdPrice,
      priceHistory: crdtUsdHistory,
      dailyHistory: crdtUsdDaily,
    },
    {
      id: 'usd-crnd',
      symbol: 'USD/CRND',
      name: 'US Dollar / CRND',
      price: usdCrndPrice,
      change24h: 0,
      dailyHigh: usdCrndPrice * 1.01,
      dailyLow: usdCrndPrice * 0.99,
      dailyOpen: usdCrndPrice,
      priceHistory: usdCrndHistory,
      dailyHistory: usdCrndDaily,
    }
  ];
};

const initializeCurrencies = (): CurrencyState[] => {
  const now = Date.now();
  return initialCurrencies.map(c => {
    const spotHistory = [{ time: now, price: c.price }];
    
    const futuresPrice = c.price * (1 + (Math.random() * 0.002 - 0.001));
    const futuresHistory = [{ time: now, price: futuresPrice }];

    // Initialize CRIC price same as spot initially
    const cricPrice = c.price;
    const cricHistory = [{ time: now, price: cricPrice }];

    const spotDaily = generateDailyHistory(c.price, 30);
    const futuresDaily = spotDaily.map(h => ({
      time: h.time,
      price: h.price * (1 + (Math.random() * 0.004 - 0.002)),
    }));
    const cricDaily = spotDaily.map(h => ({
      time: h.time,
      price: h.price, // CRIC daily history mirrors spot for simplicity initially
    }));

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

      cricPrice: cricPrice,
      cricPriceHistory: cricHistory,
      cricDailyHistory: cricDaily,
      cricDailyHigh: cricPrice * 1.05,
      cricDailyLow: cricPrice * 0.95,
      cricDailyOpen: cricPrice,
      cricChange24h: 0,
      cricVolume24h: (c.volume30d / 30) * 0.8, // Slightly less volume in day market?

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
    priceHistory: [{ time: now, price: 1.0 }],
    dailyHistory: generateDailyHistory(1.0, 30).map(h => ({...h, price: 1.0 + (Math.random() * 0.004 - 0.002)})),
    dailyHigh: 1.002,
    dailyLow: 0.998,
    dailyOpen: 1.0,
    change24h: 0,
  };
};

const calculateIndex = (currencies: CurrencyState[], marketFilter: 'general' | 'cric', baseIndex: number = 10000) => {
  // Use all currencies for both indices now
  const top50 = [...currencies].sort((a, b) => b.volume30d - a.volume30d).slice(0, 50);
  const totalWeight = top50.reduce((sum, c) => sum + c.volume30d, 0);
  
  if (totalWeight === 0) return baseIndex;

  let indexRatio = 0;
  top50.forEach(c => {
    const weight = c.volume30d / totalWeight;
    const initialCurrency = initialCurrencies.find(ic => ic.id === c.id);
    const initialPrice = initialCurrency ? initialCurrency.price : c.dailyOpen;
    
    // Use cricPrice for CRIC index, regular price for General index
    const currentPrice = marketFilter === 'cric' ? c.cricPrice : c.price;
    
    const ratio = currentPrice / initialPrice;
    indexRatio += ratio * weight;
  });
  
  return baseIndex * indexRatio;
};

export const useMarketStore = create<MarketStore>((set, get) => ({
  currencies: initializeCurrencies(),
  crdt: initializeCrdt(),
  cric: initializeCric(),
  forexPairs: initializeForexPairs(),
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
      
      // CRIC Logic (09:00 - 15:30)
      const hours = newDate.getHours();
      const minutes = newDate.getMinutes();
      const isCricOpen = (hours > 9 || (hours === 9 && minutes >= 0)) && (hours < 15 || (hours === 15 && minutes <= 30));

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

        // CRIC Price Logic
        let newCricPrice = c.cricPrice;
        if (isCricOpen) {
            const gap = newPrice - c.cricPrice;
            const move = gap * 0.8 + (c.cricPrice * (Math.random() * 0.002 - 0.001));
            newCricPrice = c.cricPrice + move;
        }
        const newCricHistory = [...c.cricPriceHistory, { time: newTime, price: newCricPrice }];
        if (newCricHistory.length > 144) newCricHistory.shift();

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

          cricPrice: newCricPrice,
          cricPriceHistory: newCricHistory,
          cricDailyHistory: isNewDay ? [...c.cricDailyHistory, { time: newTime, price: newCricPrice }].slice(-30) : c.cricDailyHistory,
          cricDailyOpen: isNewDay ? newCricPrice : c.cricDailyOpen,
          cricDailyHigh: isNewDay ? newCricPrice : (isCricOpen ? Math.max(c.cricDailyHigh, newCricPrice) : c.cricDailyHigh),
          cricDailyLow: isNewDay ? newCricPrice : (isCricOpen ? Math.min(c.cricDailyLow, newCricPrice) : c.cricDailyLow),
          cricChange24h: isNewDay ? 0 : ((newCricPrice - c.cricDailyOpen) / c.cricDailyOpen) * 100,
        };
      });

      // Simulate CRDT (Stablecoin logic: 0.995 - 1.005)
      let crdtVolatility = (Math.random() * 0.002 - 0.001); // +/- 0.1% max per tick
      let newCrdtPrice = state.crdt.price * (1 + crdtVolatility);
      
      if (newCrdtPrice > 1.005) newCrdtPrice = 1.005 - (Math.random() * 0.001);
      if (newCrdtPrice < 0.995) newCrdtPrice = 0.995 + (Math.random() * 0.001);
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

      // Simulate Forex Pairs
      const newForexPairs = state.forexPairs.map(pair => {
        let volatility = 0;
        if (pair.id === 'crdt-usd') {
          // CRDT/USD - Pegged ~1.0, very low volatility
          volatility = (Math.random() * 0.0002 - 0.0001);
        } else if (pair.id === 'usd-crnd') {
          // USD/CRND - ~30.0, moderate volatility
          volatility = (Math.random() * 0.001 - 0.0005);
        }

        let newPrice = pair.price * (1 + volatility);
        
        // Keep pegged/range bound
        if (pair.id === 'crdt-usd') {
           if (newPrice > 1.005) newPrice = 1.005;
           if (newPrice < 0.995) newPrice = 0.995;
        } else if (pair.id === 'usd-crnd') {
           // Maybe drift a bit but stay around 30
           if (newPrice > 32) newPrice = 32;
           if (newPrice < 28) newPrice = 28;
        }

        const newHistory = [...pair.priceHistory, { time: newTime, price: newPrice }];
        if (newHistory.length > 144) newHistory.shift();

        return {
          ...pair,
          price: newPrice,
          priceHistory: newHistory,
          dailyHistory: isNewDay ? [...pair.dailyHistory, { time: newTime, price: newPrice }].slice(-30) : pair.dailyHistory,
          dailyOpen: isNewDay ? newPrice : pair.dailyOpen,
          dailyHigh: isNewDay ? newPrice : Math.max(pair.dailyHigh, newPrice),
          dailyLow: isNewDay ? newPrice : Math.min(pair.dailyLow, newPrice),
          change24h: isNewDay ? 0 : ((newPrice - pair.dailyOpen) / pair.dailyOpen) * 100,
        };
      });

      // Calculate Indices
      const newIndex = calculateIndex(newCurrencies, 'general', 10000);
      const newIndexHistory = [...state.indexHistory, { time: newTime, price: newIndex }];
      if (newIndexHistory.length > 144) newIndexHistory.shift();
      const newDailyOpenIndex = isNewDay ? newIndex : state.dailyOpenIndex;
      const newIndexDailyHistory = isNewDay ? [...state.indexDailyHistory, { time: newTime, price: newIndex }].slice(-30) : state.indexDailyHistory;

      // CRIC Index Calculation
      const newCricIndexPrice = calculateIndex(newCurrencies, 'cric', 5000);
      const newCricIndexHistory = [...state.cric.priceHistory, { time: newTime, price: newCricIndexPrice }];
      if (newCricIndexHistory.length > 144) newCricIndexHistory.shift();
      
      let newOrderBook = state.cric.orderBook;
      if (isCricOpen) {
         newOrderBook = generateOrderBook(newCricIndexPrice);
      }

      const newCricIndex = {
        ...state.cric,
        price: newCricIndexPrice,
        priceHistory: newCricIndexHistory,
        dailyHistory: isNewDay ? [...state.cric.dailyHistory, { time: newTime, price: newCricIndexPrice }].slice(-30) : state.cric.dailyHistory,
        dailyOpen: isNewDay ? newCricIndexPrice : state.cric.dailyOpen,
        dailyHigh: isNewDay ? newCricIndexPrice : (isCricOpen ? Math.max(state.cric.dailyHigh, newCricIndexPrice) : state.cric.dailyHigh),
        dailyLow: isNewDay ? newCricIndexPrice : (isCricOpen ? Math.min(state.cric.dailyLow, newCricIndexPrice) : state.cric.dailyLow),
        change24h: isNewDay ? 0 : ((newCricIndexPrice - state.cric.dailyOpen) / state.cric.dailyOpen) * 100,
        isOpen: isCricOpen,
        orderBook: newOrderBook,
      };

      return {
        time: newTime,
        currencies: newCurrencies,
        crdt: newCrdt,
        cric: newCricIndex,
        forexPairs: newForexPairs,
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

        // CRIC gap open logic
        const overnightMove = (newPrice - c.price) / c.price;
        const cricGap = overnightMove * 0.5;
        const newCricPrice = c.cricPrice * (1 + cricGap);

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

          cricPrice: newCricPrice,
          cricDailyOpen: newCricPrice,
          cricDailyHigh: newCricPrice,
          cricDailyLow: newCricPrice,
          cricChange24h: 0,
          cricPriceHistory: [...c.cricPriceHistory, { time: newTime, price: newCricPrice }].slice(-144),
          cricDailyHistory: [...c.cricDailyHistory, { time: newTime, price: newCricPrice }].slice(-30),
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

      const newForexPairs = state.forexPairs.map(pair => {
        let volatility = 0;
        if (pair.id === 'crdt-usd') volatility = (Math.random() * 0.001 - 0.0005);
        if (pair.id === 'usd-crnd') volatility = (Math.random() * 0.005 - 0.0025);
        
        let newPrice = pair.price * (1 + volatility);
        
        if (pair.id === 'crdt-usd') {
           if (newPrice > 1.005) newPrice = 1.005;
           if (newPrice < 0.995) newPrice = 0.995;
        }

        return {
          ...pair,
          price: newPrice,
          dailyOpen: newPrice,
          dailyHigh: newPrice,
          dailyLow: newPrice,
          change24h: 0,
          priceHistory: [...pair.priceHistory, { time: newTime, price: newPrice }].slice(-144),
          dailyHistory: [...pair.dailyHistory, { time: newTime, price: newPrice }].slice(-30),
        };
      });

      const newIndex = calculateIndex(newCurrencies, 'general', 10000);
      const newIndexHistory = [...state.indexHistory, { time: newTime, price: newIndex }].slice(-144);
      const newIndexDailyHistory = [...state.indexDailyHistory, { time: newTime, price: newIndex }].slice(-30);

      const newCricIndexPrice = calculateIndex(newCurrencies, 'cric', 5000);
      const newCricIndex = {
        ...state.cric,
        price: newCricIndexPrice,
        dailyOpen: newCricIndexPrice,
        dailyHigh: newCricIndexPrice,
        dailyLow: newCricIndexPrice,
        change24h: 0,
        priceHistory: [...state.cric.priceHistory, { time: newTime, price: newCricIndexPrice }].slice(-144),
        dailyHistory: [...state.cric.dailyHistory, { time: newTime, price: newCricIndexPrice }].slice(-30),
        isOpen: false, // 00:00 is closed
        orderBook: generateOrderBook(newCricIndexPrice),
      };

      return {
        time: newTime,
        currencies: newCurrencies,
        crdt: newCrdt,
        cric: newCricIndex,
        forexPairs: newForexPairs,
        index: newIndex,
        dailyOpenIndex: newIndex,
        indexDailyHigh: newIndex,
        indexDailyLow: newIndex,
        indexChange24h: 0,
        indexHistory: newIndexHistory,
        indexDailyHistory: newIndexDailyHistory
      };
    });
  },

  getTopConstituents: () => {
    const state = get();
    // Use all currencies
    const top50 = [...state.currencies]
        .sort((a, b) => b.volume30d - a.volume30d)
        .slice(0, 50);
    const totalWeight = top50.reduce((sum, c) => sum + c.volume30d, 0);
    
    return top50.slice(0, 10).map(c => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      weight: (c.volume30d / totalWeight) * 100
    }));
  }
}));
