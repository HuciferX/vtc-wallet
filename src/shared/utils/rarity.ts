/**
 * Vertcoin Rarity Engine — POWX-RARITY-SPEC v1.0
 *
 * Computes rarity for any vertoshi based on block height and unit index.
 * Returns tier, icon, color, overlays, and tags.
 */

export type RarityTier = 'mythic' | 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common';

export interface RarityOverlay {
  name: string;
  icon: string;
  color: string;
}

export interface RarityResult {
  tier: RarityTier;
  icon: string;
  color: string;
  glowColor: string;
  overlays: RarityOverlay[];
  tags: string[];
  label: string;
}

const DEFAULT_HALVING = 840000;
const DIFF_ADJUSTMENT = 2016;
const CYCLE_EPOCHS = 6;

/** Halving intervals per chain */
export const CHAIN_HALVINGS: Record<string, number> = {
  VTC: 840000,
  BTC: 210000,
  LTC: 840000,
  DOGE: 100000,
};

export const RARITY_COLORS: Record<RarityTier, { color: string; glow: string; bg: string }> = {
  mythic: { color: '#ff5252', glow: 'rgba(244,67,54,0.5)', bg: 'rgba(244,67,54,0.15)' },
  legendary: { color: '#ff9800', glow: 'rgba(255,152,0,0.45)', bg: 'rgba(255,152,0,0.12)' },
  epic: { color: '#ce93d8', glow: 'rgba(156,39,176,0.4)', bg: 'rgba(156,39,176,0.12)' },
  rare: { color: '#42a5f5', glow: 'rgba(33,150,243,0.3)', bg: 'rgba(33,150,243,0.1)' },
  uncommon: { color: '#66bb6a', glow: 'rgba(76,175,80,0.3)', bg: 'rgba(76,175,80,0.1)' },
  common: { color: '#9e9e9e', glow: 'transparent', bg: 'transparent' },
};

export const RARITY_ICONS: Record<RarityTier, string> = {
  mythic: '🔴',
  legendary: '🟠',
  epic: '🟣',
  rare: '🔵',
  uncommon: '🟢',
  common: '⚪',
};

export function computeRarity(blockHeight: number, unitIndex = 0, chainId = 'VTC'): RarityResult {
  const H = CHAIN_HALVINGS[chainId] || DEFAULT_HALVING;
  const D = DIFF_ADJUSTMENT;

  let tier: RarityTier = 'common';
  const overlays: RarityOverlay[] = [];
  const tags: string[] = [];

  // Canonical tier (highest priority wins)
  if (blockHeight === 0 && unitIndex === 0) {
    tier = 'mythic';
  } else if (unitIndex === 0) {
    const cycleBlocks = H * CYCLE_EPOCHS;
    if (blockHeight % cycleBlocks === 0 && blockHeight > 0) {
      tier = 'legendary';
    } else if (blockHeight % H === 0) {
      tier = 'epic';
    } else if (blockHeight % D === 0) {
      tier = 'rare';
    } else {
      tier = 'uncommon';
    }
  }

  // Golden Block: block immediately after halving
  if (blockHeight > 0 && blockHeight % H === 1) {
    overlays.push({
      name: 'Golden Block',
      icon: '🏆',
      color: '#ffd700',
    });
  }

  // Palindrome: block height reads same forward/backward
  const hStr = String(blockHeight);
  if (hStr.length > 1 && hStr === hStr.split('').reverse().join('')) {
    tags.push('PALINDROME');
  }

  // Black Sat: all digits same
  if (hStr.length > 1 && new Set(hStr).size === 1) {
    tags.push('BLACK_SAT');
  }

  const colors = RARITY_COLORS[tier];
  const icon = RARITY_ICONS[tier];

  return {
    tier,
    icon,
    color: colors.color,
    glowColor: colors.glow,
    overlays,
    tags,
    label: tier.charAt(0).toUpperCase() + tier.slice(1),
  };
}

/**
 * Estimate block height from sat number (for display purposes).
 * Vertcoin: 50 VTC per block for first 840K, then 25, then 12.5, etc.
 */
export function estimateBlockFromSat(satNumber: number, chainId = 'VTC'): number {
  const halving = CHAIN_HALVINGS[chainId] || DEFAULT_HALVING;
  const initialSubsidy = chainId === 'BTC' ? 50 * 1e8 : chainId === 'DOGE' ? 10000 * 1e8 : 50 * 1e8;
  let remaining = satNumber;
  let height = 0;
  let subsidy = initialSubsidy;

  for (let epoch = 0; epoch < 34; epoch++) {
    const epochSats = subsidy * halving;
    if (remaining < epochSats) {
      height = epoch * halving + Math.floor(remaining / subsidy);
      break;
    }
    remaining -= epochSats;
    subsidy = Math.floor(subsidy / 2);
    if (subsidy === 0) break;
  }

  return height;
}

/**
 * Check if a rarity result is "interesting" (not common).
 */
export function isRare(result: RarityResult): boolean {
  return result.tier !== 'common' || result.overlays.length > 0 || result.tags.length > 0;
}
