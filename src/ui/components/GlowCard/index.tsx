import { CSSProperties, ReactNode } from 'react';

import { RarityTier } from '@/shared/utils/rarity';

/**
 * GlowCard — wraps content with rarity-tier glow + float animation.
 * Mythic: red heartbeat + inset glow
 * Legendary: orange pulse + fire shimmer border
 * Epic: purple aurora sweep
 * Rare: steady blue glow
 * Uncommon: subtle green border
 * Common: no glow
 */
export function GlowCard({
  tier = 'common',
  children,
  float = true,
  onClick,
  style,
}: {
  tier?: RarityTier;
  children: ReactNode;
  float?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const tierClasses: Record<string, string> = {
    mythic: 'glow-card glow-mythic shimmer-legendary',
    legendary: 'glow-card glow-legendary shimmer-legendary',
    epic: 'glow-card glow-epic aurora-epic',
    rare: 'glow-card glow-rare',
    uncommon: 'glow-card glow-uncommon',
    common: 'glow-card',
  };

  const floatClass = float && tier !== 'common' ? ' card-float' : float ? ' card-float-subtle' : '';
  const className = (tierClasses[tier] || 'glow-card') + floatClass;

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        background: 'rgba(12,12,40,0.85)',
        padding: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
