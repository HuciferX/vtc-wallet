/**
 * Chain Theme System — dynamic CSS custom properties per chain
 *
 * All UI components reference --chain-* variables.
 * On chain switch, we update :root and everything transitions smoothly.
 */

export interface ChainTheme {
  id: string;
  name: string;
  icon: string;
  primary: string;
  accent: string;
  glow: string;
  glowStrong: string;
  bg: string;
  gradient: string;
  coinType: number;
  halving: number;
  unit: string;
}

export const CHAIN_THEMES: Record<string, ChainTheme> = {
  VTC: {
    id: 'VTC',
    name: 'Vertcoin',
    icon: '⛏️',
    primary: '#4caf50',
    accent: '#66bb6a',
    glow: 'rgba(76,175,80,0.35)',
    glowStrong: 'rgba(76,175,80,0.6)',
    bg: 'rgba(76,175,80,0.04)',
    gradient: 'linear-gradient(135deg, #1b5e20, #4caf50)',
    coinType: 28,
    halving: 840000,
    unit: 'VTC',
  },
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    primary: '#f7931a',
    accent: '#ffb74d',
    glow: 'rgba(247,147,26,0.35)',
    glowStrong: 'rgba(247,147,26,0.6)',
    bg: 'rgba(247,147,26,0.04)',
    gradient: 'linear-gradient(135deg, #e65100, #f7931a)',
    coinType: 0,
    halving: 210000,
    unit: 'BTC',
  },
  LTC: {
    id: 'LTC',
    name: 'Litecoin',
    icon: '⚡',
    primary: '#345d9d',
    accent: '#5c8bc4',
    glow: 'rgba(52,93,157,0.35)',
    glowStrong: 'rgba(52,93,157,0.6)',
    bg: 'rgba(52,93,157,0.04)',
    gradient: 'linear-gradient(135deg, #1a3a6b, #345d9d)',
    coinType: 2,
    halving: 840000,
    unit: 'LTC',
  },
  DOGE: {
    id: 'DOGE',
    name: 'Dogecoin',
    icon: '🐕',
    primary: '#c2a633',
    accent: '#d4af37',
    glow: 'rgba(194,166,51,0.35)',
    glowStrong: 'rgba(194,166,51,0.6)',
    bg: 'rgba(194,166,51,0.04)',
    gradient: 'linear-gradient(135deg, #8a7322, #c2a633)',
    coinType: 3,
    halving: 100000,
    unit: 'DOGE',
  },
};

let currentChainId = 'VTC';

/**
 * Apply a chain theme to the document root.
 * All --chain-* CSS custom properties transition smoothly.
 */
export function applyChainTheme(chainId: string) {
  const theme = CHAIN_THEMES[chainId] || CHAIN_THEMES.VTC;
  currentChainId = chainId;

  const root = document.documentElement;
  root.style.setProperty('--chain-primary', theme.primary);
  root.style.setProperty('--chain-accent', theme.accent);
  root.style.setProperty('--chain-glow', theme.glow);
  root.style.setProperty('--chain-glow-strong', theme.glowStrong);
  root.style.setProperty('--chain-bg', theme.bg);
  root.style.setProperty('--chain-gradient', theme.gradient);
  root.style.setProperty('--chain-icon', `"${theme.icon}"`);

  // Store preference
  try { localStorage.setItem('vtc-wallet-chain', chainId); } catch (_e) { /* storage unavailable */ }
}

export function getCurrentTheme(): ChainTheme {
  return CHAIN_THEMES[currentChainId] || CHAIN_THEMES.VTC;
}

export function getCurrentChainId(): string {
  return currentChainId;
}

/**
 * Initialize theme from storage or default to VTC
 */
export function initChainTheme() {
  let saved = 'VTC';
  try { saved = localStorage.getItem('vtc-wallet-chain') || 'VTC'; } catch (_e) { /* storage unavailable */ }
  applyChainTheme(saved);
}
