---
title: "网格交易机器人教程：自动低买高卖的 Python 实现"
description: "手把手教你构建加密货币网格交易机器人，包含完整的 Python 代码、策略参数优化和实盘部署指南"
date: "2026-06-03"
tags: "网格交易,机器人,Python,自动化"
---

# 网格交易机器人教程

## 网格交易简介

网格交易是加密货币领域最受欢迎的自动化策略之一。它在设定的价格区间内挂买卖单，无论市场涨跌都能获利。

## 核心原理

```
价格 ↑ 卖单成交 → 获利
价格 ↓ 买单成交 → 持仓增加
```

**关键参数：**
- 网格数量：10-50 个
- 价格区间：当前价 ± 10-30%
- 每格金额：总资金 / 网格数

## Python 实现

### 基础网格机器人

```python
import time
import ccxt

class GridBot:
    def __init__(self, exchange, symbol, upper, lower, grids, amount):
        self.exchange = exchange
        self.symbol = symbol
        self.upper = upper
        self.lower = lower
        self.grids = grids
        self.amount = amount
        self.grid_price = []
        self._init_grids()
    
    def _init_grids(self):
        step = (self.upper - self.lower) / self.grids
        for i in range(self.grids + 1):
            price = self.lower + step * i
            self.grid_price.append(round(price, 6))
    
    def place_orders(self):
        mid = len(self.grid_price) // 2
        # 挂买单（低于当前价）
        for price in self.grid_price[:mid]:
            self.exchange.create_limit_buy_order(
                self.symbol, self.amount, price
            )
        # 挂卖单（高于当前价）
        for price in self.grid_price[mid:]:
            self.exchange.create_limit_sell_order(
                self.symbol, self.amount, price
            )
    
    def check_and_place(self):
        # 检查成交情况并重新挂单
        orders = self.exchange.fetch_orders(self.symbol)
        for price in self.grid_price:
            buy_filled = price in [o['price'] for o in orders if o['side'] == 'buy']
            sell_filled = price in [o['price'] for o in orders if o['side'] == 'sell']
            if buy_filled and not sell_filled:
                # 补卖单
                self.exchange.create_limit_sell_order(
                    self.symbol, self.amount, price
                )
            elif sell_filled and not buy_filled:
                # 补买单
                self.exchange.create_limit_buy_order(
                    self.symbol, self.amount, price
                )
    
    def run(self, interval=60):
        self.place_orders()
        while True:
            self.check_and_place()
            time.sleep(interval)
```

### 参数优化建议

1. **震荡行情：** 网格数量多（30-50），区间窄（±10%）
2. **趋势行情：** 网格数量少（10-20），区间宽（±30%）
3. **稳定币对：** 网格间距极小，小单高频

## 实盘部署

### 推荐方案

1. **VPS：** $5-10/月（DigitalOcean、Vultr）
2. **交易所：** Binance、OKX（API 稳定）
3. **运行时间：** 24/7

### 安全注意事项

- API Key 仅开启交易权限，**不要开启提现**
- 设置 IP 白名单
- 初始只投入 10% 资金测试

## 收益预期

| 市场状态 | 月收益 | 最大回撤 |
|---------|--------|---------|
| 震荡市 | 5-15% | 3-5% |
| 趋势市 | -5%~5% | 10-20% |
| 单边暴跌 | -10~-20% | 20-30% |

> ⚠️ **重要提醒：** 网格交易不是万能的。单边行情中表现不佳，建议配合趋势指标使用。
