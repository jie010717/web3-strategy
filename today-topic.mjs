const TOPICS = [
  { title: "永续合约资金费率套利策略" },
  { title: "链上巨鲸追踪：如何跟单聪明钱" },
  { title: "Uniswap V3 集中流动性做市策略详解" },
  { title: "加密货币期权交易入门：从保护到投机" },
  { title: "L2 跨链桥接与套利机会分析" },
  { title: "Web3 安全交易指南：避免常见陷阱" },
  { title: "DeFi 协议治理代币投资策略" },
  { title: "Chainlink 喂价数据与链上交易信号" },
  { title: "NFT 市场趋势分析与交易策略" },
  { title: "币本位合约与 U 本位合约的选择策略" },
  { title: "加密货币定投策略的进阶玩法" },
  { title: "MEV 机器人最新策略：2026 版" }
];

const now = new Date();
const dayIndex = Math.floor(now.getTime() / 86400000) % TOPICS.length;
console.log(`Today is ${now.toISOString().split('T')[0]}`);
console.log(`Day index: ${dayIndex}`);
console.log(`Today's topic: ${TOPICS[dayIndex].title}`);

// Also check if article exists
const fs = await import('fs');
const files = fs.readdirSync('./src/content/posts').filter(f => f.endsWith('.md'));
const existingTitles = files.map(f => {
  const c = fs.readFileSync('./src/content/posts/' + f, 'utf-8');
  const m = c.match(/title: "(.+)"/);
  return m ? m[1] : null;
}).filter(Boolean);

console.log(`\nExisting articles (${existingTitles.length}):`);
existingTitles.forEach(t => console.log(`  - ${t}`));

if (existingTitles.includes(TOPICS[dayIndex].title)) {
  console.log(`\n⚠️ Today's article already exists, will be skipped`);
} else {
  console.log(`\n✅ Today's article is new, ready to generate`);
}
