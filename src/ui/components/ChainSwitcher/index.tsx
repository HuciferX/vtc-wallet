import { useCallback, useState } from 'react';

import { applyChainTheme, CHAIN_THEMES, getCurrentChainId, ChainTheme } from '@/ui/theme/chainTheme';

import { Column } from '../Column';
import { Row } from '../Row';
import { Text } from '../Text';

/**
 * ChainSwitcher — premium animated chain selector.
 * Shows current chain icon + name. Tap to open dropdown with all chains.
 * On switch: color morphs across the entire wallet UI.
 */
export function ChainSwitcher({ onSwitch }: { onSwitch?: (chainId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState(getCurrentChainId());
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const current = CHAIN_THEMES[currentId] || CHAIN_THEMES.VTC;
  const chains = Object.values(CHAIN_THEMES);

  const handleSwitch = useCallback((chainId: string) => {
    if (chainId === currentId) {
      setIsOpen(false);
      return;
    }
    setAnimatingId(chainId);
    applyChainTheme(chainId);
    setCurrentId(chainId);
    setIsOpen(false);
    onSwitch?.(chainId);

    // Clear animation class after it plays
    setTimeout(() => setAnimatingId(null), 400);
  }, [currentId, onSwitch]);

  return (
    <div style={{ position: 'relative', zIndex: 100 }}>
      {/* Current chain button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          borderRadius: 20,
          border: `1px solid ${current.primary}40`,
          background: current.bg,
          cursor: 'pointer',
          transition: 'all 0.4s ease',
          boxShadow: `0 0 8px ${current.glow}`,
        }}
      >
        <span
          className={animatingId === currentId ? 'chain-icon-enter' : ''}
          style={{ fontSize: 18, transition: 'transform 0.3s ease' }}
        >
          {current.icon}
        </span>
        <Text
          text={current.name}
          style={{
            color: current.primary,
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: '0.05em',
            transition: 'color 0.4s ease',
          }}
        />
        <span style={{
          fontSize: 8,
          color: current.primary,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}>
          ▼
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(12,12,40,0.98)',
          backdropFilter: 'blur(16px)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {chains.map((chain, i) => (
            <div
              key={chain.id}
              className="stagger-item"
              onClick={() => handleSwitch(chain.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                cursor: 'pointer',
                background: chain.id === currentId ? chain.bg : 'transparent',
                borderLeft: chain.id === currentId ? `3px solid ${chain.primary}` : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = chain.bg;
              }}
              onMouseLeave={(e) => {
                if (chain.id !== currentId) {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: 20 }}>{chain.icon}</span>
              <Column>
                <Text
                  text={chain.name}
                  style={{
                    color: chain.id === currentId ? chain.primary : 'rgba(255,255,255,0.8)',
                    fontWeight: chain.id === currentId ? 800 : 500,
                    fontSize: 12,
                  }}
                />
                <Text
                  text={chain.unit}
                  style={{
                    color: chain.primary,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    opacity: 0.7,
                  }}
                />
              </Column>
              {chain.id === currentId && (
                <div style={{
                  marginLeft: 'auto',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: chain.primary,
                  boxShadow: `0 0 8px ${chain.glowStrong}`,
                }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
