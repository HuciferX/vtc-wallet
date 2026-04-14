import { useCallback, useEffect, useState } from 'react';

import { Inscription } from '@/shared/types';
import { computeRarity } from '@/shared/utils/rarity';
import { Column, Row, Text } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { GlowCard } from '@/ui/components/GlowCard';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import { RarityBadge } from '@/ui/components/RarityBadge';
import { VirtualList } from '@/ui/components/VirtualList';
import { useExtensionIsInTab } from '@/ui/features/browser/tabs';
import { useI18n } from '@/ui/hooks/useI18n';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useChainType } from '@/ui/state/settings/hooks';
import { useWallet } from '@/ui/utils';

import { useNavigate } from '../../MainRoute';

export function InscriptionList() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const currentAccount = useCurrentAccount();
  const chainType = useChainType();
  const tools = useTools();
  const isInTab = useExtensionIsInTab();
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = window.innerWidth <= 768;
      setIsMobile(mobileCheck);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const fetchInscriptions = useCallback(
    async (fetchParams: { address: string }, page: number, pageSize: number) => {
      return wallet.getOrdinalsInscriptions(fetchParams.address, page, pageSize);
    },
    [wallet]
  );

  const renderInscription = useCallback(
    (inscription: Inscription, index: number) => (
      <InscriptionPreview
        key={inscription.inscriptionId || `inscription-${index}`}
        data={inscription}
        style={{ width: '100%' }}
        preset="medium"
        onClick={() => {
          navigate(
            'OrdinalsInscriptionScreen',
            {
              inscription
            },
            {
              inscriptionId: inscription.inscriptionId
            }
          );
        }}
      />
    ),
    [navigate]
  );

  const handleError = useCallback(
    (error: Error) => {
      tools.toastError(error.message);
    },
    [tools]
  );

  const itemsPerRow = isInTab && !isMobile ? 9 : 2;

  // Demo rare inscription — dismissable
  const [showDemo, setShowDemo] = useState(() => {
    return localStorage.getItem('universal-wallet-demo-dismissed') !== 'true';
  });

  const demoRares = [
    { height: 0, tier: 'mythic' as const, label: 'Genesis Vertoshi', desc: 'Block 0 · Sat #0' },
    { height: 840001, tier: 'uncommon' as const, label: 'Golden Block #1', desc: 'Block 840,001 · Post-halving' },
    { height: 22222, tier: 'uncommon' as const, label: 'Palindrome + Black Sat', desc: 'Block 22,222' },
  ];

  return (
    <Column>
      {showDemo && (
        <Column gap="sm" style={{ marginBottom: 12 }}>
          <Row justifyBetween itemsCenter>
            <Text text="✨ Demo Rares" style={{ color: 'var(--chain-primary)', fontWeight: 800, fontSize: 11, fontFamily: "'Orbitron', monospace", letterSpacing: '0.06em' }} />
            <div
              onClick={() => { setShowDemo(false); localStorage.setItem('universal-wallet-demo-dismissed', 'true'); }}
              style={{ fontSize: 9, color: 'rgba(232,234,246,0.4)', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(232,234,246,0.1)' }}>
              Dismiss demos
            </div>
          </Row>
          {demoRares.map((rare, i) => {
            const rarity = computeRarity(rare.height, 0);
            return (
              <GlowCard key={i} tier={rarity.tier} onClick={() => {
                window.open(`https://UniversalMarketplace.io/rare?block=${rare.height}&chain=vtc`, '_blank');
              }}>
                <Row gap="sm" itemsCenter>
                  <span style={{ fontSize: 28 }}>{rarity.icon}</span>
                  <Column>
                    <Text text={rare.label} style={{ fontWeight: 800, fontSize: 12, color: rarity.color }} />
                    <Text text={rare.desc} style={{ fontSize: 9, color: 'rgba(232,234,246,0.5)' }} />
                    <RarityBadge rarity={rarity} size="sm" />
                  </Column>
                </Row>
              </GlowCard>
            );
          })}
        </Column>
      )}

      <VirtualList<Inscription>
        fetchParams={{ address: currentAccount.address }}
        chainType={chainType}
        fetchData={fetchInscriptions}
        renderItem={renderInscription}
        onError={handleError}
        emptyText={showDemo ? '' : t('no_inscriptions_found')}
        itemsPerRow={itemsPerRow}
      />
    </Column>
  );
}
