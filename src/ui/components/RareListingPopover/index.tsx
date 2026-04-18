import { useCallback, useEffect, useState } from 'react';

import { CHAINS_MAP, ChainType } from '@/shared/constant';
import { Inscription } from '@/shared/types';
import { computeRarity, isRare, RarityResult } from '@/shared/utils/rarity';
import { Column, Row, Text } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { RarityBadge } from '@/ui/components/RarityBadge';
import { useChainType } from '@/ui/state/settings/hooks';

/**
 * RareListingPopover — shown when the user views a rare inscription.
 * Prompts them to list it for sale on the Universal Marketplace.
 *
 * Flow:
 *   1. Detects rarity from inscription's block height
 *   2. Shows popup: "This is a [TIER] ordinal! List it for sale?"
 *   3. User sets price → creates a sell order via the marketplace API
 *   4. Listing appears on the Universal Marketplace
 */

interface RareListingPopoverProps {
  visible: boolean;
  inscription: Inscription;
  blockHeight?: number;
  onClose: () => void;
  onListed?: (listingId: string) => void;
}

const MARKETPLACE_API = '/api/ideas/vtc-ord/marketplace';

export function RareListingPopover({
  visible,
  inscription,
  blockHeight,
  onClose,
  onListed,
}: RareListingPopoverProps) {
  const chainType = useChainType();
  const chain = CHAINS_MAP[chainType];
  const tools = useTools();

  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Compute rarity
  const chainId = chain?.unit || 'VTC';
  const height = blockHeight || 0;
  const rarity = computeRarity(height, 0, chainId);
  const rare = isRare(rarity);

  // Check if user already dismissed this inscription's listing prompt
  useEffect(() => {
    const key = `rare-listing-dismissed-${inscription?.inscriptionId}`;
    if (localStorage.getItem(key) === 'true') {
      setDismissed(true);
    }
  }, [inscription?.inscriptionId]);

  const handleDismiss = useCallback(() => {
    const key = `rare-listing-dismissed-${inscription?.inscriptionId}`;
    localStorage.setItem(key, 'true');
    setDismissed(true);
    onClose();
  }, [inscription?.inscriptionId, onClose]);

  const handleList = useCallback(async () => {
    if (!price || parseFloat(price) <= 0) {
      tools.toastError('Enter a valid price');
      return;
    }

    setSubmitting(true);
    try {
      // Create sell order on the Universal Marketplace
      const body = {
        inscription_id: inscription.inscriptionId,
        price: parseFloat(price),
        rarity_tier: rarity.tier,
        block_height: height,
        chain: chainId,
        receive_address: inscription.address || '',
        title: inscription.inscriptionId
          ? `${rarity.tier.charAt(0).toUpperCase() + rarity.tier.slice(1)} Ordinal #${inscription.inscriptionNumber || '?'}`
          : `${rarity.tier} inscription`,
      };

      const resp = await fetch(`${chain.ordinalsUrl || 'http://127.0.0.1:3080'}/api/marketplace/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      // Also try the bridge marketplace endpoint as fallback
      let data;
      if (resp.ok) {
        data = await resp.json();
      } else {
        const fallback = await fetch(`${MARKETPLACE_API}/list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        });
        data = await fallback.json();
      }

      if (data?.ok) {
        tools.toastSuccess(`Listed for ${price} ${chainId}! 🎉`);
        if (onListed && data.listing_id) {
          onListed(data.listing_id);
        }
        handleDismiss();
      } else {
        tools.toastError(data?.error || 'Failed to create listing');
      }
    } catch (err: any) {
      tools.toastError(`Listing error: ${err.message || 'unknown'}`);
    } finally {
      setSubmitting(false);
    }
  }, [price, inscription, rarity, height, chainId, chain, tools, onListed, handleDismiss]);

  if (!visible || !rare || dismissed) return null;

  // Suggested price based on rarity tier
  const suggestedPrices: Record<string, string> = {
    mythic: '1000',
    legendary: '500',
    epic: '100',
    rare: '25',
    uncommon: '5',
  };
  const suggested = suggestedPrices[rarity.tier] || '10';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        style={{
          maxWidth: 380,
          width: '100%',
          background: 'var(--bg-card, #0c0c28)',
          border: `2px solid ${rarity.color}60`,
          borderRadius: 16,
          padding: 20,
          boxShadow: `0 0 40px ${rarity.glowColor}, 0 8px 32px rgba(0,0,0,0.6)`,
        }}>
        {/* Header */}
        <Row justifyBetween itemsCenter style={{ marginBottom: 14 }}>
          <Text
            text="💎 RARE ORDINAL DETECTED"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 12,
              fontWeight: 900,
              color: rarity.color,
              letterSpacing: '0.06em',
            }}
          />
          <div
            onClick={onClose}
            style={{
              cursor: 'pointer',
              color: 'rgba(232,234,246,0.4)',
              fontSize: 16,
              padding: '0 4px',
            }}>
            ✕
          </div>
        </Row>

        {/* Rarity display */}
        <Column gap="sm" style={{ alignItems: 'center', padding: '12px 0' }}>
          <span style={{ fontSize: 48 }}>{rarity.icon}</span>
          <Text
            text={`This is a ${rarity.tier.toUpperCase()} ordinal!`}
            style={{ fontWeight: 900, fontSize: 16, color: rarity.color, textAlign: 'center' }}
          />
          <RarityBadge rarity={rarity} size="lg" />
          {height > 0 && (
            <Text
              text={`Block ${height.toLocaleString()}`}
              style={{ fontSize: 10, color: 'rgba(232,234,246,0.5)' }}
            />
          )}
          {inscription.inscriptionNumber && (
            <Text
              text={`Inscription #${inscription.inscriptionNumber}`}
              style={{ fontSize: 10, color: 'rgba(232,234,246,0.4)' }}
            />
          )}
        </Column>

        {/* Listing form */}
        <Column gap="sm" style={{ marginTop: 12, borderTop: '1px solid rgba(232,234,246,0.08)', paddingTop: 14 }}>
          <Text
            text="List it for sale on the Universal Marketplace?"
            style={{ fontSize: 12, color: 'rgba(232,234,246,0.7)', textAlign: 'center', fontWeight: 700 }}
          />

          <Column gap="xs">
            <Text
              text={`Price (${chainId})`}
              style={{ fontSize: 9, color: 'rgba(232,234,246,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={`Suggested: ${suggested} ${chainId}`}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: `1px solid ${rarity.color}40`,
                background: 'rgba(0,0,0,0.3)',
                color: 'var(--text, #e8eaf6)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                fontWeight: 700,
                outline: 'none',
                textAlign: 'center',
              }}
            />
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 4 }}>
              {['5', '25', '50', '100', '500'].map((v) => (
                <button
                  key={v}
                  onClick={() => setPrice(v)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 6,
                    border: `1px solid ${price === v ? rarity.color : 'rgba(232,234,246,0.1)'}`,
                    background: price === v ? `${rarity.color}20` : 'none',
                    color: price === v ? rarity.color : 'rgba(232,234,246,0.4)',
                    fontSize: 9,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                  {v}
                </button>
              ))}
            </div>
          </Column>

          {/* Actions — listing disabled until admin enables inscribing */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              disabled={true}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 12,
                border: 'none',
                background: 'rgba(232,234,246,0.1)',
                color: 'rgba(232,234,246,0.4)',
                fontFamily: "'Orbitron', monospace",
                fontSize: 11,
                fontWeight: 900,
                cursor: 'not-allowed',
                letterSpacing: '0.06em',
              }}>
              💰 LISTING COMING SOON
            </button>
          </div>
          <Text
            text="Marketplace listing will be enabled by the operator. Your rare ordinal is safe in your wallet."
            style={{ fontSize: 9, color: 'rgba(232,234,246,0.4)', textAlign: 'center', marginTop: 4 }}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              onClick={handleDismiss}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 8,
                border: '1px solid rgba(232,234,246,0.1)',
                background: 'none',
                color: 'rgba(232,234,246,0.4)',
                fontSize: 9,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              Not now — don't ask again for this one
            </button>
          </div>

          <Text
            text="🔐 Non-custodial PSBT. You sign the sale. No intermediary."
            style={{ fontSize: 8, color: 'rgba(232,234,246,0.3)', textAlign: 'center', marginTop: 4 }}
          />
        </Column>
      </div>
    </div>
  );
}
