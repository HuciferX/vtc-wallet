import { CSSProperties, useEffect, useState } from 'react';

import { RARITY_COLORS, RARITY_ICONS, RarityResult } from '@/shared/utils/rarity';
import { getCurrentTheme } from '@/ui/theme/chainTheme';

import { Column } from '../Column';
import { fireConfetti } from '../Confetti';
import { RarityBadge } from '../RarityBadge';
import { Row } from '../Row';
import { Text } from '../Text';

/**
 * RarityReveal — dramatic full-screen overlay when a rare is found.
 *
 * 1. Screen dims
 * 2. Card flies up from bottom with glow burst
 * 3. Tier text types out with glow trail
 * 4. Overlays flash in
 * 5. Confetti in chain color
 * 6. "RARE FOUND!" banner
 * 7. Auto-dismiss after 3s or tap to close
 */
export function RarityReveal({
  rarity,
  blockHeight,
  onClose,
}: {
  rarity: RarityResult;
  blockHeight: number;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState(0); // 0=enter, 1=reveal, 2=confetti, 3=done
  const [typedText, setTypedText] = useState('');
  const theme = getCurrentTheme();
  const colors = RARITY_COLORS[rarity.tier];

  useEffect(() => {
    // Phase 0: enter (card flies up)
    setTimeout(() => setPhase(1), 100);

    // Phase 1: type out tier name
    const tierText = rarity.tier.toUpperCase();
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= tierText.length) {
        setTypedText(tierText.slice(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
        setPhase(2);
      }
    }, 80);

    // Phase 2: confetti
    setTimeout(() => {
      fireConfetti(50);
      setPhase(3);
    }, 1200);

    // Auto-close after 4s
    const autoClose = setTimeout(onClose, 4000);
    return () => {
      clearTimeout(autoClose);
      clearInterval(typeInterval);
    };
  }, []);

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
  };

  const cardStyle: CSSProperties = {
    background: 'rgba(12,12,40,0.95)',
    borderRadius: 20,
    padding: '32px 28px',
    textAlign: 'center',
    maxWidth: 300,
    border: `2px solid ${rarity.color}`,
    boxShadow: `0 0 40px ${colors.glow}`,
  };

  // Apply reveal animation class
  const cardClass = phase >= 1 ? 'reveal-card' : '';

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div className={cardClass} style={cardStyle} onClick={(e) => e.stopPropagation()}>
        {/* Big rarity icon */}
        <div style={{
          fontSize: 64,
          marginBottom: 12,
          filter: `drop-shadow(0 0 20px ${colors.glow})`,
        }}>
          {rarity.icon}
        </div>

        {/* Typed tier text */}
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 28,
          fontWeight: 900,
          color: rarity.color,
          letterSpacing: '0.15em',
          textShadow: `0 0 20px ${colors.glow}`,
          minHeight: 40,
        }}>
          {typedText}
          <span style={{ opacity: phase < 2 ? 1 : 0, animation: 'breathe 1s infinite' }}>|</span>
        </div>

        {/* Block info */}
        <Text
          text={`Block ${blockHeight.toLocaleString()}`}
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 8 }}
        />

        {/* Full rarity badge with overlays */}
        <Row justifyCenter mt="md">
          <RarityBadge rarity={rarity} size="lg" />
        </Row>

        {/* "RARE FOUND" banner */}
        {phase >= 2 && (
          <div style={{
            marginTop: 16,
            padding: '8px 20px',
            borderRadius: 20,
            background: `${rarity.color}20`,
            border: `1px solid ${rarity.color}40`,
            animation: 'slide-in-up 0.3s ease-out',
          }}>
            <Text
              text="✨ RARE FOUND! ✨"
              style={{
                color: rarity.color,
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: '0.1em',
              }}
            />
          </div>
        )}

        {/* Chain indicator */}
        <Text
          text={`${theme.icon} ${theme.name}`}
          style={{
            color: theme.primary,
            fontSize: 10,
            marginTop: 12,
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
}
