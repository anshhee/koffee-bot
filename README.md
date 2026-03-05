# ☕ KOFFEE

**KOFFEE** is a risk-aware Telegram bot for analyzing Solana tokens.  
It evaluates token safety by inspecting on-chain mint data, supply metrics, and market liquidity, while maintaining a history of user analyses.

Built with a modular backend architecture using **Node.js**, **Solana Web3**, and **MongoDB**.

---

## ✨ Features

- 🔍 **Token Risk Analysis**
  - Detects active mint authority
  - Analyzes token supply
  - Evaluates liquidity levels

- 📊 **Analysis History**
  - Stores user token analyses in MongoDB
  - Retrieve recent analyses with `/history`

- ⚡ **Real-Time On-Chain Data**
  - Fetches token mint information directly from Solana Devnet

- 🤖 **Telegram Interface**
  - Simple commands for token inspection
  - Interactive responses for fast analysis

---

## 🧠 Example Commands
```bash
/analyze <token_address>
/history
```
## 🚀 Features

### ✅ Implemented
- Telegram bot interface (Telegraf)
- Solana Devnet wallet generation
- Secure public key storage (MongoDB)
- SOL balance retrieval (Devnet)
- Inline keyboard UI
- Environment-based configuration
- Modular architecture

### 🛠 Planned / In Progress
- Token risk analysis engine
- Liquidity & mint authority checks
- Trade simulation (Devnet)
- Devnet airdrop automation
- Rate limiting & logging middleware
- Transaction history tracking
- Risk scoring algorithm
- Portfolio tracking

## 🧱 Tech Stack

### Core Backend
- Node.js (ES Modules)
- Telegraf (Telegram Bot Framework)
- dotenv (Environment configuration)

### Blockchain Layer
- @solana/web3.js (Solana SDK)
- Solana Devnet
- bs58 (Key encoding)

### Database
- MongoDB Atlas (M0 Free Tier)
- Mongoose ODM

### Future Integrations
- Jupiter Aggregator API (Swap simulation)
- Solana SPL Token program interaction
- WebSocket RPC subscriptions
- Redis (Caching & rate limiting)
- Winston or Pino (Structured logging)
- Zod (Input validation)
- Docker (Containerization)
- GitHub Actions (CI/CD)

## 📈 Roadmap

- [x] Wallet generation
- [x] Balance retrieval
- [ ] Risk engine v1
- [ ] Devnet swap simulation
- [ ] Transaction logging
- [ ] RPC failover support
- [ ] Rate limiting middleware
- [ ] Docker deployment
- [ ] Production hardening

## 🏗 Architecture
```bash
src/
├── bot/
│ └── commands/
│ ├── analyze.js
│ └── history.js
│
├── services/
│ ├── riskEngine.js
│ ├── tokenAnalyzer.js
│ ├── liquidityAnalyzer.js
│ └── analysisService.js
│
├── models/
│ └── Analysis.js
│
└── config/
```

## ⚙️ Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/koffee.git
cd koffee
```
###2️⃣ Install Dependencies
```bash
npm install
```
###3️⃣ Create Environment File

Create a .env file in the project root:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
MONGO_URI=your_mongodb_connection_string_here
```
###4️⃣ Run the Development Server
```bash
npm run dev
```
```bash
☕ Initializing KOFFEE project...
MongoDB connection established successfully
🤖 KOFFEE Telegram bot is up and running!
```
🤖 Live Demo (Devnet)

You can interact with KOFFEE here:

👉 https://t.me/Koffee_dev_Bot

⚠️ This bot operates on Solana Devnet only.
No real funds are used.

```bash

---

Just replace:

- `YOUR_USERNAME`
- `YOUR_BOT_USERNAME`

Commit and push.

This will render cleanly with:
- Proper bullets
- Proper code blocks
- No formatting issues

If you want next, we can add professional badges at the top of the README to make it look even stronger ☕🔥
```
