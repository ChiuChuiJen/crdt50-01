export interface MarketEvent {
  id: string;
  type: 'A' | 'B'; // A: Individual, B: Global
  description: string;
  impact: number; // -1.0 to 1.0 (negative to positive impact)
}

export const eventsA: MarketEvent[] = [
  { id: 'A01', type: 'A', description: '該幣技術升級成功，市場信心上升', impact: 0.05 },
  { id: 'A02', type: 'A', description: '發現智能合約漏洞，價格暴跌', impact: -0.15 },
  { id: 'A03', type: 'A', description: '大型交易所上架該幣', impact: 0.08 },
  { id: 'A04', type: 'A', description: '遭主要交易所下架', impact: -0.12 },
  { id: 'A05', type: 'A', description: '創辦人宣布離職', impact: -0.05 },
  { id: 'A06', type: 'A', description: '獲大型企業合作採用', impact: 0.07 },
  { id: 'A07', type: 'A', description: '遭駭客攻擊，資產被盜', impact: -0.20 },
  { id: 'A08', type: 'A', description: '成功完成區塊鏈硬分叉', impact: 0.04 },
  { id: 'A09', type: 'A', description: '社群內部分裂', impact: -0.06 },
  { id: 'A10', type: 'A', description: '發行量意外增加', impact: -0.08 },
  { id: 'A11', type: 'A', description: '被政府列入監管名單', impact: -0.10 },
  { id: 'A12', type: 'A', description: '獲政府合法認證', impact: 0.10 },
  { id: 'A13', type: 'A', description: '大型基金宣布持有', impact: 0.06 },
  { id: 'A14', type: 'A', description: '主要礦池停止支援', impact: -0.05 },
  { id: 'A15', type: 'A', description: '開發團隊解散', impact: -0.25 },
  { id: 'A16', type: 'A', description: '推出新應用場景', impact: 0.05 },
  { id: 'A17', type: 'A', description: '遭指控為詐騙項目', impact: -0.18 },
  { id: 'A18', type: 'A', description: '知名投資人背書', impact: 0.09 },
  { id: 'A19', type: 'A', description: '流動性枯竭', impact: -0.15 },
  { id: 'A20', type: 'A', description: '交易量暴增', impact: 0.08 },
  { id: 'A21', type: 'A', description: '推出跨鏈功能', impact: 0.06 },
  { id: 'A22', type: 'A', description: '遭跨鏈橋攻擊', impact: -0.12 },
  { id: 'A23', type: 'A', description: 'NFT市場整合成功', impact: 0.05 },
  { id: 'A24', type: 'A', description: 'NFT市場崩潰影響', impact: -0.07 },
  { id: 'A25', type: 'A', description: 'DeFi鎖倉量創新高', impact: 0.07 },
  { id: 'A26', type: 'A', description: 'DeFi資金撤離', impact: -0.08 },
  { id: 'A27', type: 'A', description: '新競爭幣崛起', impact: -0.04 },
  { id: 'A28', type: 'A', description: '被收購或合併', impact: 0.12 },
  { id: 'A29', type: 'A', description: '推出穩定幣支持', impact: 0.05 },
  { id: 'A30', type: 'A', description: '失去穩定幣支持', impact: -0.06 },
  { id: 'A31', type: 'A', description: '代言人爆出醜聞', impact: -0.05 },
  { id: 'A32', type: 'A', description: '獲明星代言', impact: 0.04 },
  { id: 'A33', type: 'A', description: '社群活動成功', impact: 0.03 },
  { id: 'A34', type: 'A', description: '社群反彈抵制', impact: -0.06 },
  { id: 'A35', type: 'A', description: '重大技術突破', impact: 0.15 },
  { id: 'A36', type: 'A', description: '重大技術失敗', impact: -0.15 },
  { id: 'A37', type: 'A', description: '被列入主流支付', impact: 0.10 },
  { id: 'A38', type: 'A', description: '被禁止支付用途', impact: -0.10 },
  { id: 'A39', type: 'A', description: '礦工罷工', impact: -0.05 },
  { id: 'A40', type: 'A', description: '算力創新高', impact: 0.04 },
  { id: 'A41', type: 'A', description: '跨國支付採用', impact: 0.08 },
  { id: 'A42', type: 'A', description: '支付合作終止', impact: -0.07 },
  { id: 'A43', type: 'A', description: '推出Layer2擴展', impact: 0.06 },
  { id: 'A44', type: 'A', description: 'Layer2故障', impact: -0.05 },
  { id: 'A45', type: 'A', description: '鎖倉機制推出', impact: 0.03 },
  { id: 'A46', type: 'A', description: '大量解鎖拋售', impact: -0.10 },
  { id: 'A47', type: 'A', description: '空投活動引發熱潮', impact: 0.07 },
  { id: 'A48', type: 'A', description: '空投結束拋售潮', impact: -0.08 },
  { id: 'A49', type: 'A', description: '市場謠言炒作', impact: 0.05 },
  { id: 'A50', type: 'A', description: '謠言澄清', impact: -0.03 },
];

export const eventsB: MarketEvent[] = [
  { id: 'B01', type: 'B', description: '全球加密貨幣牛市啟動', impact: 0.20 },
  { id: 'B02', type: 'B', description: '全球加密貨幣熊市', impact: -0.20 },
  { id: 'B03', type: 'B', description: '大型交易所破產', impact: -0.25 },
  { id: 'B04', type: 'B', description: '全球監管加強', impact: -0.10 },
  { id: 'B05', type: 'B', description: '全球監管放寬', impact: 0.10 },
  { id: 'B06', type: 'B', description: '央行推出數位貨幣', impact: -0.05 },
  { id: 'B07', type: 'B', description: '金融危機資金流入加密市場', impact: 0.15 },
  { id: 'B08', type: 'B', description: '金融危機資金撤離', impact: -0.15 },
  { id: 'B09', type: 'B', description: '大型穩定幣崩盤', impact: -0.30 },
  { id: 'B10', type: 'B', description: '穩定幣市場信心恢復', impact: 0.10 },
  { id: 'B11', type: 'B', description: '比特幣創歷史新高', impact: 0.15 },
  { id: 'B12', type: 'B', description: '主流幣暴跌', impact: -0.15 },
  { id: 'B13', type: 'B', description: '礦工大規模停機', impact: -0.08 },
  { id: 'B14', type: 'B', description: '算力創新高', impact: 0.05 },
  { id: 'B15', type: 'B', description: 'DeFi市場爆發', impact: 0.12 },
  { id: 'B16', type: 'B', description: 'DeFi市場崩潰', impact: -0.12 },
  { id: 'B17', type: 'B', description: 'NFT市場狂潮', impact: 0.10 },
  { id: 'B18', type: 'B', description: 'NFT市場泡沫破裂', impact: -0.10 },
  { id: 'B19', type: 'B', description: 'AI幣概念熱潮', impact: 0.15 },
  { id: 'B20', type: 'B', description: 'AI幣概念退燒', impact: -0.08 },
  { id: 'B21', type: 'B', description: '戰爭引發避險需求', impact: 0.10 },
  { id: 'B22', type: 'B', description: '戰爭導致市場恐慌', impact: -0.12 },
  { id: 'B23', type: 'B', description: '全球支付採用增加', impact: 0.08 },
  { id: 'B24', type: 'B', description: '支付禁令', impact: -0.10 },
  { id: 'B25', type: 'B', description: '大型銀行進入市場', impact: 0.12 },
  { id: 'B26', type: 'B', description: '銀行退出市場', impact: -0.08 },
  { id: 'B27', type: 'B', description: '能源價格暴漲影響挖礦', impact: -0.06 },
  { id: 'B28', type: 'B', description: '能源價格下降利多挖礦', impact: 0.05 },
  { id: 'B29', type: 'B', description: '重大漏洞影響多鏈', impact: -0.15 },
  { id: 'B30', type: 'B', description: '安全技術突破', impact: 0.08 },
  { id: 'B31', type: 'B', description: '交易所手續費戰', impact: 0.03 },
  { id: 'B32', type: 'B', description: '交易所提高手續費', impact: -0.03 },
  { id: 'B33', type: 'B', description: '流動性挖礦熱潮', impact: 0.08 },
  { id: 'B34', type: 'B', description: '流動性危機', impact: -0.10 },
  { id: 'B35', type: 'B', description: '跨鏈技術普及', impact: 0.06 },
  { id: 'B36', type: 'B', description: '跨鏈安全事件', impact: -0.12 },
  { id: 'B37', type: 'B', description: '大型投資基金進場', impact: 0.10 },
  { id: 'B38', type: 'B', description: '基金撤資', impact: -0.08 },
  { id: 'B39', type: 'B', description: '市場恐慌指數上升', impact: -0.10 },
  { id: 'B40', type: 'B', description: '市場貪婪情緒高漲', impact: 0.10 },
  { id: 'B41', type: 'B', description: '新興市場採用', impact: 0.05 },
  { id: 'B42', type: 'B', description: '主要國家禁用', impact: -0.15 },
  { id: 'B43', type: 'B', description: '全球支付整合', impact: 0.07 },
  { id: 'B44', type: 'B', description: '支付系統崩潰', impact: -0.12 },
  { id: 'B45', type: 'B', description: '虛擬金融法案通過', impact: 0.08 },
  { id: 'B46', type: 'B', description: '虛擬金融法案否決', impact: -0.08 },
  { id: 'B47', type: 'B', description: '黑天鵝事件', impact: -0.30 },
  { id: 'B48', type: 'B', description: '市場全面反彈', impact: 0.15 },
  { id: 'B49', type: 'B', description: '交易量創新高', impact: 0.10 },
  { id: 'B50', type: 'B', description: '市場低迷盤整', impact: -0.05 },
];

export const getVolatilityMultiplier = (): number => {
  const rand = Math.random() * 100;
  if (rand < 32) return (Math.random() * 0.4 + 0.1) / 100; // 0.1% ~ 0.5%
  if (rand < 56) return (Math.random() * 0.5 + 0.5) / 100; // 0.5% ~ 1%
  if (rand < 74) return (Math.random() * 2 + 1) / 100; // 1% ~ 3%
  if (rand < 86) return (Math.random() * 4 + 3) / 100; // 3% ~ 7%
  if (rand < 93) return (Math.random() * 5 + 7) / 100; // 7% ~ 12%
  if (rand < 97) return (Math.random() * 8 + 12) / 100; // 12% ~ 20%
  if (rand < 99) return (Math.random() * 15 + 20) / 100; // 20% ~ 35%
  if (rand < 99.8) return (Math.random() * 25 + 35) / 100; // 35% ~ 60%
  if (rand < 99.95) return (Math.random() * 30 + 60) / 100; // 60% ~ 90%
  return (Math.random() * 390 - 90) / 100; // -90% ~ +300%
};
