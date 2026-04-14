import { useEffect, useState } from 'react';

import { Card, Column, Content, Footer, Header, Layout, Row, Text } from '@/ui/components';
import { NavTabBar } from '@/ui/components/NavTabBar';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useChain } from '@/ui/state/settings/hooks';
import { colors } from '@/ui/theme/colors';

import { useNavigate } from '../MainRoute';

const CHAINS = [
  { key: 'vtc', name: 'Vertcoin', icon: '⛏️', color: '#4caf50' },
  { key: 'btc', name: 'Bitcoin', icon: '₿', color: '#f7931a' },
  { key: 'ltc', name: 'Litecoin', icon: '⚡', color: '#c0c0d0' },
  { key: 'doge', name: 'Dogecoin', icon: '🐕', color: '#c2a633' }
];

export default function SwapTabScreen() {
  const currentAccount = useCurrentAccount();
  const chain = useChain();
  const navigate = useNavigate();

  const [fromChain, setFromChain] = useState('btc');
  const [toChain, setToChain] = useState('vtc');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState<number | null>(null);
  const [status, setStatus] = useState('');

  // Fetch approximate exchange rate
  useEffect(() => {
    fetchRate();
  }, [fromChain, toChain]);

  const fetchRate = async () => {
    try {
      const ids: Record<string, string> = {
        vtc: 'vertcoin',
        btc: 'bitcoin',
        ltc: 'litecoin',
        doge: 'dogecoin'
      };
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids[fromChain]},${ids[toChain]}&vs_currency=usd`
      );
      const data = await res.json();
      const fromPrice = data[ids[fromChain]]?.usd || 1;
      const toPrice = data[ids[toChain]]?.usd || 1;
      setRate(fromPrice / toPrice);
    } catch (e) {
      setRate(null);
    }
  };

  const swapChains = () => {
    const tmp = fromChain;
    setFromChain(toChain);
    setToChain(tmp);
  };

  const estimateReceive = () => {
    if (!rate || !amount) return '—';
    return (parseFloat(amount) * rate).toFixed(6);
  };

  const initiateSwap = () => {
    // Open the marketplace swap page with pre-filled parameters
    const url = `/universal-marketplace.html#swap&from=${fromChain}&to=${toChain}&amount=${amount}`;
    window.open(url, '_blank');
    setStatus('Opening marketplace swap...');
  };

  const fromInfo = CHAINS.find((c) => c.key === fromChain) || CHAINS[0];
  const toInfo = CHAINS.find((c) => c.key === toChain) || CHAINS[1];

  return (
    <Layout>
      <Header />
      <Content>
        <Column gap="md">
          {/* Title */}
          <Row justifyCenter>
            <Text
              text="⚡ Atomic Swap"
              preset="bold"
              size="lg"
              style={{
                background: 'linear-gradient(90deg, #00e5ff, #b47aff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            />
          </Row>

          <Text
            text="Cross-chain HTLC swaps — trustless, no intermediary"
            preset="sub"
            textCenter
            size="xs"
          />

          {/* From */}
          <Card preset="style1">
            <Column gap="sm">
              <Text text="FROM" preset="sub" size="xxs" color="textDim" />
              <Row justifyBetween itemsCenter>
                <Row
                  itemsCenter
                  gap="sm"
                  onClick={() => {
                    const idx = CHAINS.findIndex((c) => c.key === fromChain);
                    const next = CHAINS[(idx + 1) % CHAINS.length];
                    if (next.key === toChain) {
                      const nextNext = CHAINS[(idx + 2) % CHAINS.length];
                      setFromChain(nextNext.key);
                    } else {
                      setFromChain(next.key);
                    }
                  }}
                  style={{ cursor: 'pointer' }}>
                  <Text text={fromInfo.icon} size="xxl" />
                  <Column gap="zero">
                    <Text text={fromInfo.name} preset="bold" />
                    <Text text={fromInfo.key.toUpperCase()} preset="sub" size="xxs" />
                  </Column>
                  <Text text="▾" color="textDim" />
                </Row>
                <input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: 120,
                    textAlign: 'right',
                    background: 'transparent',
                    border: 'none',
                    color: colors.white,
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    outline: 'none'
                  }}
                />
              </Row>
            </Column>
          </Card>

          {/* Swap button */}
          <Row justifyCenter>
            <div
              onClick={swapChains}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                border: `1px solid ${colors.border}`,
                background: colors.bg4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 16,
                marginTop: -8,
                marginBottom: -8,
                zIndex: 1
              }}>
              ↕
            </div>
          </Row>

          {/* To */}
          <Card preset="style1">
            <Column gap="sm">
              <Text text="TO" preset="sub" size="xxs" color="textDim" />
              <Row justifyBetween itemsCenter>
                <Row
                  itemsCenter
                  gap="sm"
                  onClick={() => {
                    const idx = CHAINS.findIndex((c) => c.key === toChain);
                    const next = CHAINS[(idx + 1) % CHAINS.length];
                    if (next.key === fromChain) {
                      const nextNext = CHAINS[(idx + 2) % CHAINS.length];
                      setToChain(nextNext.key);
                    } else {
                      setToChain(next.key);
                    }
                  }}
                  style={{ cursor: 'pointer' }}>
                  <Text text={toInfo.icon} size="xxl" />
                  <Column gap="zero">
                    <Text text={toInfo.name} preset="bold" />
                    <Text text={toInfo.key.toUpperCase()} preset="sub" size="xxs" />
                  </Column>
                  <Text text="▾" color="textDim" />
                </Row>
                <Text
                  text={estimateReceive()}
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: toInfo.color
                  }}
                />
              </Row>
            </Column>
          </Card>

          {/* Rate */}
          {rate && (
            <Card
              preset="style1"
              style={{
                background: 'rgba(180, 122, 255, 0.04)',
                borderColor: 'rgba(180, 122, 255, 0.15)'
              }}>
              <Row justifyBetween>
                <Text text="Rate" preset="sub" size="xs" />
                <Text
                  text={`1 ${fromInfo.key.toUpperCase()} ≈ ${rate.toFixed(4)} ${toInfo.key.toUpperCase()}`}
                  size="xs"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
                />
              </Row>
              <Row justifyBetween style={{ marginTop: 4 }}>
                <Text text="Method" preset="sub" size="xs" />
                <Text text="HTLC Atomic Swap" size="xs" color="gold" />
              </Row>
              <Row justifyBetween style={{ marginTop: 4 }}>
                <Text text="Fee" preset="sub" size="xs" />
                <Text text="Network fee only" size="xs" color="green" />
              </Row>
            </Card>
          )}

          {/* Swap Button */}
          <div
            onClick={() => {
              if (!amount || parseFloat(amount) <= 0) {
                setStatus('Enter an amount');
                return;
              }
              initiateSwap();
            }}
            style={{
              padding: '14px 0',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #00e5ff, #b47aff)',
              textAlign: 'center',
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: 13,
              letterSpacing: '0.06em',
              fontFamily: "'Orbitron', monospace",
              color: '#fff'
            }}>
            ⚡ SWAP {fromInfo.key.toUpperCase()} → {toInfo.key.toUpperCase()}
          </div>

          {status && (
            <Text text={status} textCenter size="xs" color="textDim" style={{ marginTop: 4 }} />
          )}

          {/* Info */}
          <Card preset="style1" style={{ opacity: 0.6 }}>
            <Text
              text="Atomic swaps use Hash Time-Locked Contracts (HTLC) to enable trustless cross-chain trading. No centralized exchange needed. Your keys, your coins."
              size="xxs"
              color="textDim"
            />
          </Card>
        </Column>
      </Content>
      <Footer>
        <NavTabBar tab="swap" />
      </Footer>
    </Layout>
  );
}
