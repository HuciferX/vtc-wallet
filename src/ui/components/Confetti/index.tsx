import { useEffect } from 'react';

import { getCurrentTheme } from '@/ui/theme/chainTheme';

/**
 * Confetti — fires chain-colored particles from a point.
 * Used on rarity reveal, successful transactions, etc.
 */
export function fireConfetti(count = 30, originX?: number, originY?: number) {
  const theme = getCurrentTheme();
  const colors = [theme.primary, theme.accent, '#ffffff', theme.primary + '80'];
  const x = originX ?? window.innerWidth / 2;
  const y = originY ?? window.innerHeight / 3;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.left = `${x + (Math.random() - 0.5) * 200}px`;
    particle.style.top = `${y}px`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.width = `${4 + Math.random() * 6}px`;
    particle.style.height = `${4 + Math.random() * 6}px`;
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    particle.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
    particle.style.animationDelay = `${Math.random() * 0.3}s`;
    document.body.appendChild(particle);

    // Cleanup after animation
    setTimeout(() => particle.remove(), 3500);
  }
}

/**
 * ConfettiBurst component — renders confetti on mount then cleans up
 */
export function ConfettiBurst({ count = 30 }: { count?: number }) {
  useEffect(() => {
    fireConfetti(count);
  }, [count]);
  return null;
}
