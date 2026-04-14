# 🌐 Universal Wallet

The universal ordinals wallet for Vertcoin, Litecoin, Bitcoin, and Dogecoin — with rarity badges that glow.

![Version](https://img.shields.io/badge/version-0.2.0-green) ![Chains](https://img.shields.io/badge/chains-VTC%20%7C%20BTC%20%7C%20LTC%20%7C%20DOGE-blue) ![Tests](https://img.shields.io/badge/tests-184%2F184-brightgreen)

---

## 🚀 Install in 60 Seconds

### Step 1: Download

👉 **[Download universal-wallet-v0.4.0-chrome.zip](https://github.com/HuciferX/vtc-wallet/releases/download/v0.4.0/universal-wallet-v0.4.0-chrome.zip)** (5.8 MB)

Works on **Chrome, Brave, Edge** — Windows, Mac, and Linux.

### Step 2: Unzip

- **Windows:** Right-click the zip → "Extract All" → pick a folder you'll remember (like Desktop)
- **Mac:** Double-click the zip → a folder appears in Downloads
- **Linux:** `unzip universal-wallet-v0.4.0-chrome.zip -d ~/vtc-wallet`

### Step 3: Load into your browser

**Chrome:**
1. Type `chrome://extensions` in the address bar, hit Enter
2. Flip the **Developer mode** switch ON (top right corner)
3. Click **"Load unpacked"**
4. Pick the folder you unzipped to
5. Done! You'll see ⛏️ in your toolbar

**Brave:**
1. Type `brave://extensions` in the address bar, hit Enter
2. Flip **Developer mode** ON
3. Click **"Load unpacked"** → pick the unzipped folder

**Edge:**
1. Type `edge://extensions` in the address bar, hit Enter
2. Flip **Developer mode** ON (left side)
3. Click **"Load unpacked"** → pick the unzipped folder

### Step 4: Pin it

Click the puzzle piece icon (🧩) in your toolbar → find "Universal Wallet" → click the pin 📌

### Step 5: Create your wallet

1. Click the ⛏️ icon
2. Click **Create New Wallet**
3. Pick a password
4. **Write down your 12-word recovery phrase** (this is your backup — lose it and your coins are gone forever)
5. You're in! 🎉

---

## 🔄 Switch Chains

Tap the chain name at the top to switch between:

| Chain | Color | Unit |
|-------|-------|------|
| ⛏️ Vertcoin | Green | VTC |
| ₿ Bitcoin | Orange | BTC |
| ⚡ Litecoin | Blue | LTC |
| 🐕 Dogecoin | Gold | DOGE |

The whole wallet changes color when you switch. It's pretty.

---

## 💎 Rarity

This wallet shows you which of your sats are rare. Rarer sats glow brighter:

| Rarity | Glow | How rare |
|--------|------|----------|
| 🔴 Mythic | Red heartbeat pulse | Once ever (genesis) |
| 🟠 Legendary | Orange fire shimmer | Every 6 halvings |
| 🟣 Epic | Purple aurora sweep | Every halving |
| 🔵 Rare | Blue steady glow | Every difficulty adjustment |
| 🟢 Uncommon | Green border | Every block |
| ⚪ Common | None | Everything else |

Special badges: 🏆 **Golden Block** (block after halving) · 🔄 **Palindrome** · ⚫ **Black Sat**

When you find a rare one, you get a full-screen reveal with confetti. 🎊

---

## 🔌 For Developers (dApp Connect)

Websites can connect to the wallet:

```javascript
// Check if wallet is installed
if (window.vertcoin) {
  // Connect
  const accounts = await window.vertcoin.requestAccounts();
  console.log('Connected:', accounts[0]); // vtc1q...

  // Get balance
  const balance = await window.vertcoin.getBalance();

  // Sign a PSBT (for marketplace trading)
  const signed = await window.vertcoin.signPsbt(psbtHex);

  // Get inscriptions WITH rarity data
  const inscriptions = await window.vertcoin.getInscriptions();

  // Switch chain
  await window.vertcoin.switchChain('BITCOIN_MAINNET');

  // Listen for changes
  window.vertcoin.on('accountsChanged', (accounts) => { ... });
  window.vertcoin.on('chainChanged', (chain) => { ... });
}
```

Also available as `window.unisat` for backward compatibility with existing tools.

---

## 🛠️ Build from Source

```bash
git clone https://github.com/HuciferX/vtc-wallet.git
cd vtc-wallet
git checkout vertcoin-port
yarn install
yarn build:chrome:mv3:dev
# Load dist/chrome/ as unpacked extension
```

Requires Node.js 18+ and Yarn.

---

## 📝 Credits

- Forked from [UniSat Wallet](https://github.com/unisat-wallet/extension) (MIT license)
- Rarity spec: POWX-RARITY-SPEC v1.0
- Vertcoin port + premium UI: [HuciferX](https://github.com/HuciferX)
