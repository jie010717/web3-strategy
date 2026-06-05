/**
 * 每日内容生成器 - Web3 交易策略
 * 
 * 自动生成 SEO 优化的文章，每天一篇
 * 由 GitHub Actions 调度，生成后自动部署
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const CONTENT_DIR = join(ROOT, 'src', 'content', 'posts');

const TOPICS = [
  {
    title: "永续合约资金费率套利策略",
    desc: "利用永续合约与现货之间的资金费率差异进行套利的完整操作指南",
    tags: "合约,套利,永续,资金费率"
  },
  {
    title: "链上巨鲸追踪：如何跟单聪明钱",
    desc: "通过链上数据分析工具追踪巨鲸地址的交易行为，建立跟单策略",
    tags: "巨鲸,链上分析,跟单,Nansen"
  },
  {
    title: "Uniswap V3 集中流动性做市策略详解",
    desc: "深入解析 Uniswap V3 集中流动性做市原理，分享提高资金利用率的实战技巧",
    tags: "Uniswap,做市,流动性,DEX"
  },
  {
    title: "加密货币期权交易入门：从保护到投机",
    desc: "加密货币期权的基础知识、常见策略组合以及实操平台推荐",
    tags: "期权,对冲,衍生品"
  },
  {
    title: "L2 跨链桥接与套利机会分析",
    desc: "Arbitrum、Optimism、Base 等 L2 之间的资产跨链和价差套利策略",
    tags: "L2,跨链,套利,Arbitrum"
  },
  {
    title: "Web3 安全交易指南：避免常见陷阱",
    desc: "涵盖授权钓鱼、假币合约、Rug Pull 识别等加密货币交易安全要点",
    tags: "安全,防诈骗,Rug Pull"
  },
  {
    title: "DeFi 协议治理代币投资策略",
    desc: "分析 DeFi 治理代币的价值捕获机制，挖掘被低估的项目",
    tags: "治理代币,DeFi,投资"
  },
  {
    title: "Chainlink 喂价数据与链上交易信号",
    desc: "利用 Chainlink 预言机数据构建链上交易信号系统",
    tags: "Chainlink,预言机,数据"
  },
  {
    title: "NFT 市场趋势分析与交易策略",
    desc: "2026 年 NFT 市场格局、蓝筹项目分析和交易技巧",
    tags: "NFT,市场分析,趋势"
  },
  {
    title: "币本位合约与 U 本位合约的选择策略",
    desc: "对比币本位和 U 本位合约的优劣，根据不同市场条件选择最优工具",
    tags: "合约,BTC,ETH,策略"
  },
  {
    title: "加密货币定投策略的进阶玩法",
    desc: "DCA 定投策略的优化版本，结合链上指标和波动率调整定投金额",
    tags: "定投,DCA,策略"
  },
  {
    title: "MEV 机器人最新策略：2026 版",
    desc: "更新版 MEV 策略，涵盖新的 Flashbots 功能和 L2 MEV 机会",
    tags: "MEV,机器人,Flashbots"
  }
];

function pickTopic() {
  const now = new Date();
  const dayIndex = Math.floor(now.getTime() / 86400000) % TOPICS.length;
  return TOPICS[dayIndex];
}

function hasTodayArticle(topic) {
  if (!existsSync(CONTENT_DIR)) return false;
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  return files.some(f => {
    const content = readFileSync(join(CONTENT_DIR, f), 'utf-8');
    return content.includes(topic.title);
  });
}

function generateArticle(topic) {
  const { title, desc, tags } = topic;
  const today = new Date().toISOString().split('T')[0];
  const slug = title
    .replace(/[：:]/g, '')
    .replace(/[—\-_]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 60);

  const content = `---
title: "${title}"
description: "${desc}"
date: "${today}"
tags: "${tags}"
---

# ${title}

## 核心要点

本文将从实战角度深入分析 ${title} 的核心策略和方法。

## 策略背景

随着加密货币市场的不断成熟，各种交易工具和策略也在快速演进。理解并掌握正确的交易策略，是在这个市场中长期生存的关键。

## 实战步骤

### 第一步：准备工作

1. 确保拥有支持 Web3 交互的钱包（如 MetaMask、Rabby）
2. 准备足够的 Gas 费用
3. 熟悉相关平台的操作界面

### 第二步：实施策略

> ⚠️ **风险提示：** 所有策略均需在小额资金验证后，再逐步增加仓位。

具体实施方案需要根据当前市场状况动态调整。建议先用模拟环境测试，再上主网。

### 第三步：监控优化

- 定期检查策略运行状态
- 关注市场变化及时调整参数
- 记录每笔交易数据用于复盘

## 关键指标

| 指标 | 说明 | 参考值 |
|------|------|--------|
| 胜率 | 盈利交易占比 | > 60% |
| 盈亏比 | 平均盈利/平均亏损 | > 1.5 |
| Sharpe Ratio | 风险调整收益 | > 1.0 |
| 最大回撤 | 账户最高点到最低点 | < 20% |

## 风险控制

任何交易策略都存在风险。请务必做好仓位管理，单笔交易不超过总资金的 2%，设置止损止盈。

---

*本文为 Web3 交易策略研究系列文章之一，仅供参考，不构成投资建议。*
`;

  return { slug, content };
}

function main() {
  console.log('📝 Web3 交易策略 - 每日内容生成器\n');
  
  const topic = pickTopic();
  console.log(`选题: ${topic.title}`);
  
  if (hasTodayArticle(topic)) {
    console.log('⏭️  今天已经生成过这篇文章，跳过');
    return;
  }

  const { slug, content } = generateArticle(topic);
  mkdirSync(CONTENT_DIR, { recursive: true });
  writeFileSync(join(CONTENT_DIR, `${slug}.md`), content, 'utf-8');
  console.log(`✅ 文章已生成: ${slug}.md`);

  // 构建站点
  console.log('\n🏗️  构建站点...');
  execSync('node build.mjs', { stdio: 'inherit', cwd: ROOT });

  console.log(`\n✅ 完成！文章 "${topic.title}" 已生成，等待部署`);
}

main();
