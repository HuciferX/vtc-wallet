# Vertcoin Wallet — Installation Guide

Install the Vertcoin Wallet browser extension on Windows, Mac, or Linux. Works with Chrome, Brave, Edge, and any Chromium-based browser.

## Download

Download the latest release from GitHub:
- **[vtc-wallet-v0.2.0-chrome.zip](https://github.com/HuciferX/vtc-wallet/releases/tag/v0.2.0)** — Chrome, Brave, Edge (all Chromium)

## Windows

### Chrome
1. Download `vtc-wallet-v0.2.0-chrome.zip`
2. Extract the zip to a folder (e.g., `C:\Users\YourName\vtc-wallet`)
3. Open Chrome and go to `chrome://extensions/`
4. Toggle **Developer mode** ON (top right corner)
5. Click **Load unpacked**
6. Select the extracted folder
7. The Vertcoin Wallet icon appears in your toolbar
8. Click the puzzle piece icon (🧩) → pin Vertcoin Wallet

### Brave
1. Download `vtc-wallet-v0.2.0-chrome.zip` (same file works for Brave)
2. Extract to a folder
3. Open Brave and go to `brave://extensions/`
4. Toggle **Developer mode** ON
5. Click **Load unpacked** → select the extracted folder

### Edge
1. Download `vtc-wallet-v0.2.0-chrome.zip` (same file works for Edge)
2. Extract to a folder
3. Open Edge and go to `edge://extensions/`
4. Toggle **Developer mode** ON (left sidebar)
5. Click **Load unpacked** → select the extracted folder

## macOS

### Chrome
1. Download `vtc-wallet-v0.2.0-chrome.zip`
2. Double-click the zip to extract (creates a folder in Downloads)
3. Open Chrome → `chrome://extensions/`
4. Toggle **Developer mode** ON (top right)
5. Click **Load unpacked**
6. Navigate to the extracted folder and click **Select**
7. Pin the extension: click puzzle piece icon → pin Vertcoin Wallet

### Brave
Same as Chrome but use `brave://extensions/`

### Arc / Other Chromium Browsers
Same process — go to the browser's extensions page, enable Developer mode, Load unpacked.

## Linux

### Chrome
```bash
# Download and extract
wget https://github.com/HuciferX/vtc-wallet/releases/download/v0.2.0/vtc-wallet-v0.2.0-chrome.zip
unzip vtc-wallet-v0.2.0-chrome.zip -d ~/vtc-wallet
```
1. Open Chrome → `chrome://extensions/`
2. Toggle **Developer mode** ON
3. Click **Load unpacked** → select `~/vtc-wallet`

### Brave (Linux)
```bash
unzip vtc-wallet-v0.2.0-chrome.zip -d ~/vtc-wallet
```
1. Open Brave → `brave://extensions/` → Developer mode → Load unpacked → `~/vtc-wallet`

### Build from Source (any OS)
```bash
git clone https://github.com/HuciferX/vtc-wallet.git
cd vtc-wallet
git checkout vertcoin-port
yarn install
yarn build:chrome:mv3:dev
# Extension at dist/chrome/ — load unpacked in your browser
```

## First Launch

1. Click the Vertcoin Wallet icon in your toolbar
2. Click **Create New Wallet**
3. Set a password (encrypts your keys locally)
4. **Save your recovery phrase** — write it down, store it safely
5. Your wallet is ready — you'll see a VTC address starting with `vtc1q...`

## Chain Switching

The wallet supports 4 chains. To switch:
1. Click the chain indicator (shows current chain icon + name)
2. Select VTC, BTC, LTC, or DOGE from the dropdown
3. The entire UI morphs to the new chain's color
4. Your address and balance update for the selected chain

## Connecting to Websites

When you visit a marketplace or dApp that supports Vertcoin Wallet:
1. The site calls `window.vertcoin.requestAccounts()`
2. A popup appears: "Connect to [site]?"
3. Click **Connect** to share your address
4. The site can now request transaction signatures

## Troubleshooting

**Extension doesn't load:**
- Make sure Developer mode is ON
- Make sure you selected the folder containing `manifest.json` (not a parent folder)
- Try refreshing the extensions page

**Wallet shows no balance:**
- Send VTC to your wallet address first
- Make sure the ord-vertcoin server is running at localhost:3080 (or the configured endpoint)

**"Could not establish connection" error:**
- The extension's background service worker may need a restart
- Go to `chrome://extensions/` → click the refresh icon on Vertcoin Wallet

## Uninstall

1. Go to `chrome://extensions/`
2. Find Vertcoin Wallet
3. Click **Remove**
4. Your keys are deleted from the browser — make sure you have your recovery phrase backed up
