import { CSSProperties, useMemo } from 'react';

import { computeRarity, isRare, RARITY_COLORS, RarityResult, RarityTier } from '@/shared/utils/rarity';

import { Column } from '../Column';
import { Row } from '../Row';
import { Text } from '../Text';

/**
 * RarityBadge — displays a colored, glowing rarity badge for a vertoshi.
 *
 * Props:
 *   blockHeight: number — the block height to compute rarity for
 *   unitIndex?: number — offset within block (default 0)
 *   size?: 'sm' | 'md' | 'lg' — badge size
 *   showOverlays?: boolean — show Golden Block / Palindrome / Black Sat tags
 *   rarity?: RarityResult — pre-computed rarity (skip computation)
 */

interface RarityBadgeProps {
  blockHeight?: number;
  unitIndex?: number;
  size?: 'sm' | 'md' | 'lg';
  showOverlays?: boolean;
  rarity?: RarityResult;
  style?: CSSProperties;
}

const SIZE_MAP = {
  sm: { fontSize: 9, padding: '1px 6px', iconSize: 10, gap: 2 },
  md: { fontSize: 11, padding: '2px 8px', iconSize: 13, gap: 4 },
  lg: { fontSize: 13, padding: '4px 12px', iconSize: 16, gap: 6 },
};

export function RarityBadge({ blockHeight, unitIndex = 0, size = 'md', showOverlays = true, rarity, style }: RarityBadgeProps) {
  const result = useMemo(() => {
    if (rarity) return rarity;
    if (blockHeight === undefined) return null;
    return computeRarity(blockHeight, unitIndex);
  }, [blockHeight, unitIndex, rarity]);

  if (!result) return null;

  const colors = RARITY_COLORS[result.tier];
  const s = SIZE_MAP[size];

  const badgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: s.gap,
    padding: s.padding,
    borderRadius: 12,
    fontSize: s.fontSize,
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
    background: colors.bg,
    border: `1px solid ${result.color}40`,
    color: result.color,
    boxShadow: result.tier !== 'common' ? `0 0 8px ${result.glowColor}` : 'none',
    ...style,
  };

  // Animated glow for epic+
  if (['mythic', 'legendary', 'epic'].includes(result.tier)) {
    badgeStyle.animation = `rarity-glow-${result.tier} 2.5s ease-in-out infinite`;
  }

  return (
    <Row gap="xs" style={{ flexWrap: 'wrap' }}>
      <span style={badgeStyle}>
        <span style={{ fontSize: s.iconSize }}>{result.icon}</span>
        {result.label}
      </span>

      {showOverlays && result.overlays.map((o, i) => (
        <span key={`overlay-${i}`} style={{
          ...badgeStyle,
          background: 'rgba(255,215,0,0.1)',
          borderColor: 'rgba(255,215,0,0.3)',
          color: '#ffd700',
          boxShadow: '0 0 6px rgba(255,215,0,0.3)',
        }}>
          <span style={{ fontSize: s.iconSize }}>{o.icon}</span>
          {o.name}
        </span>
      ))}

      {showOverlays && result.tags.map((tag, i) => (
        <span key={`tag-${i}`} style={{
          ...badgeStyle,
          background: tag === 'BLACK_SAT' ? 'rgba(0,0,0,0.6)' : 'rgba(0,229,255,0.06)',
          borderColor: tag === 'BLACK_SAT' ? 'rgba(100,100,100,0.4)' : 'rgba(0,229,255,0.2)',
          color: tag === 'BLACK_SAT' ? '#888' : '#00e5ff',
          boxShadow: 'none',
        }}>
          {tag === 'PALINDROME' ? '🔄' : '⚫'} {tag.replace('_', ' ')}
        </span>
      ))}
    </Row>
  );
}

/**
 * RarityWarning — shows a warning when sending a rare vertoshi
 */
export function RarityWarning({ blockHeight, unitIndex = 0 }: { blockHeight: number; unitIndex?: number }) {
  const result = useMemo(() => computeRarity(blockHeight, unitIndex), [blockHeight, unitIndex]);

  if (!isRare(result)) return null;

  return (
    <Column style={{
      padding: '8px 12px',
      borderRadius: 10,
      border: `1px solid ${result.color}40`,
      background: RARITY_COLORS[result.tier].bg,
      marginTop: 8,
    }}>
      <Row gap="sm" itemsCenter>
        <span style={{ fontSize: 18 }}>{result.icon}</span>
        <Column>
          <Text
            text={`⚠️ This vertoshi is ${result.tier.toUpperCase()}!`}
            style={{ color: result.color, fontWeight: 800, fontSize: 12 }}
          />
          <Text
            text="Are you sure you want to send a rare vertoshi? This cannot be undone."
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}
          />
        </Column>
      </Row>
      <Row gap="xs" style={{ marginTop: 4 }}>
        <RarityBadge rarity={result} size="sm" />
      </Row>
    </Column>
  );
}

/**
 * Inject CSS keyframes for animated glow (call once at app init)
 */
export function injectRarityStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('rarity-glow-styles')) return;

  const style = document.createElement('style');
  style.id = 'rarity-glow-styles';
  style.textContent = `
    @keyframes rarity-glow-mythic {
      0%, 100% { box-shadow: 0 0 8px rgba(244,67,54,0.3); }
      50% { box-shadow: 0 0 20px rgba(244,67,54,0.6); }
    }
    @keyframes rarity-glow-legendary {
      0%, 100% { box-shadow: 0 0 8px rgba(255,152,0,0.25); }
      50% { box-shadow: 0 0 16px rgba(255,152,0,0.5); }
    }
    @keyframes rarity-glow-epic {
      0%, 100% { box-shadow: 0 0 6px rgba(156,39,176,0.2); }
      50% { box-shadow: 0 0 14px rgba(156,39,176,0.4); }
    }
  `;
  document.head.appendChild(style);
}
