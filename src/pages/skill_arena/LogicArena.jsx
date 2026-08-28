import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { HelpCircle, Shuffle, RefreshCw, CheckCircle, ArrowRight, Zap, Target } from 'lucide-react';

const LogicArena = ({ onAwardXP, onAwardCoins, onCompleteDaily, onRecordActivity, searchQuery }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  // memory match states
  const [cards, setCards] = useState([]);
  const [flippedIndex, setFlippedIndex] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchDone, setMatchDone] = useState(false);

  // binary puzzle states
  const [binaryTarget, setBinaryTarget] = useState(0);
  const [binaryLevel, setBinaryLevel] = useState(1);
  const [activeBits, setActiveBits] = useState([0, 0, 0, 0]); // 8, 4, 2, 1
  const [binaryCorrectCount, setBinaryCorrectCount] = useState(0);
  const [binaryFinished, setBinaryFinished] = useState(false);
  const [binaryMessage, setBinaryMessage] = useState('');

  // Memory match configuration
  const basePairs = [
    { value: '[]', matchId: 1, text: 'Array syntax' },
    { value: 'Array', matchId: 1, text: 'Array syntax' },
    { value: '{}', matchId: 2, text: 'Object block' },
    { value: 'Object', matchId: 2, text: 'Object block' },
    { value: '&&', matchId: 3, text: 'Logical AND' },
    { value: 'AND', matchId: 3, text: 'Logical AND' },
    { value: '||', matchId: 4, text: 'Logical OR' },
    { value: 'OR', matchId: 4, text: 'Logical OR' },
    { value: '()', matchId: 5, text: 'Function invoke' },
    { value: 'Call', matchId: 5, text: 'Function invoke' },
    { value: '=>', matchId: 6, text: 'Arrow function' },
    { value: 'Lambda', matchId: 6, text: 'Arrow function' }
  ];

  const initMemoryMatch = () => {
    const shuffled = [...basePairs]
      .map(card => ({ ...card, id: Math.random() }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndex([]);
    setMatchedIds([]);
    setMoves(0);
    setMatchDone(false);
  };

  const handleCardClick = (index) => {
    if (flippedIndex.length >= 2 || matchedIds.includes(cards[index].matchId) || flippedIndex.includes(index)) return;

    const nextFlipped = [...flippedIndex, index];
    setFlippedIndex(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const first = cards[nextFlipped[0]];
      const second = cards[nextFlipped[1]];

      if (first.matchId === second.matchId) {
        setMatchedIds(prev => {
          const nextMatches = [...prev, first.matchId];
          if (nextMatches.length === 6) {
            setMatchDone(true);
            onAwardXP(90);
            onAwardCoins(15);
            onCompleteDaily();
            onRecordActivity(true);
          }
          return nextMatches;
        });
        setFlippedIndex([]);
      } else {
        setTimeout(() => {
          setFlippedIndex([]);
        }, 1000);
      }
    }
  };

  // Binary Puzzle Configuration
  const initBinaryPuzzle = () => {
    setBinaryTarget(Math.floor(Math.random() * 15) + 1); // 1 to 15
    setBinaryLevel(1);
    setActiveBits([0, 0, 0, 0]);
    setBinaryCorrectCount(0);
    setBinaryFinished(false);
    setBinaryMessage('');
  };

  const nextBinaryLevel = () => {
    setBinaryTarget(Math.floor(Math.random() * 15) + 1);
    setActiveBits([0, 0, 0, 0]);
    setBinaryMessage('');
  };

  const toggleBit = (idx) => {
    if (binaryFinished) return;
    setActiveBits(prev => {
      const nextBits = [...prev];
      nextBits[idx] = nextBits[idx] === 1 ? 0 : 1;
      return nextBits;
    });
  };

  const verifyBinary = () => {
    // calculate sum
    const placeValues = [8, 4, 2, 1];
    const sum = activeBits.reduce((acc, bit, idx) => acc + bit * placeValues[idx], 0);

    if (sum === binaryTarget) {
      setBinaryCorrectCount(prev => prev + 1);
      setBinaryMessage('✓ Correct sum! Well calculated.');
      
      setTimeout(() => {
        if (binaryLevel < 3) {
          setBinaryLevel(prev => prev + 1);
          nextBinaryLevel();
        } else {
          setBinaryFinished(true);
          onAwardXP(95);
          onAwardCoins(20);
          onCompleteDaily();
          onRecordActivity(true);
        }
      }, 1500);
    } else {
      setBinaryMessage(`❌ Incorrect. Your sum is ${sum}. Adjust bits to sum up to ${binaryTarget}.`);
      onRecordActivity(false);
    }
  };

  const exitGame = () => {
    setSelectedGame(null);
  };

  // Filter games based on search queries
  const games = [
    { id: 'memory', title: 'Card Symbol Match', desc: 'Match programming operators like loops, logic arrays, and brackets.', icon: <Shuffle size={24} /> },
    { id: 'binary', title: 'Binary Sum Nibble', desc: 'Sum binary place values (8, 4, 2, 1) to match decimal numbers.', icon: <Target size={24} /> }
  ].filter(g => !searchQuery || g.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Game Selector view */}
      {!selectedGame && (
        <Card 
          header={<span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Select Logic Challenge</span>}
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {games.map(game => (
              <div
                key={game.id}
                onClick={() => {
                  setSelectedGame(game.id);
                  if (game.id === 'memory') initMemoryMatch();
                  if (game.id === 'binary') initBinaryPuzzle();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-btn-bg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                className="glass-card-hover"
              >
                <div style={{
                  background: 'var(--color-primary-glow)',
                  color: 'var(--color-primary)',
                  padding: '10px',
                  borderRadius: '10px',
                  display: 'flex'
                }}>
                  {game.icon}
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', display: 'block' }}>
                    {game.title}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {game.desc}
                  </span>
                </div>
                <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Memory Match Game Screen */}
      {selectedGame === 'memory' && (
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>🧩 Card Symbol Match</span>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <span>Moves: {moves}</span>
                <span>Matches: {matchedIds.length}/6</span>
              </div>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            
            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              maxWidth: '400px',
              width: '100%'
            }}>
              {cards.map((card, idx) => {
                const isFlipped = flippedIndex.includes(idx) || matchedIds.includes(card.matchId);
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    style={{
                      height: '75px',
                      borderRadius: '8px',
                      border: isFlipped ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                      background: isFlipped ? 'var(--color-primary-glow)' : 'var(--glass-card-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: isFlipped ? 'var(--color-primary)' : 'transparent',
                      cursor: isFlipped ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      boxShadow: 'var(--glass-shadow)',
                      userSelect: 'none'
                    }}
                    className={!isFlipped ? "hover-scale" : ""}
                  >
                    {isFlipped ? card.value : '?'}
                  </div>
                );
              })}
            </div>

            {/* Actions / Success display */}
            {matchDone && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid var(--color-success)',
                borderRadius: '8px',
                padding: '12px 20px',
                color: 'var(--color-success)',
                textAlign: 'center'
              }}>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>🎉 Memory Match Completed!</span>
                <span style={{ fontSize: '0.75rem' }}>Finished in {moves} moves. Awarded +90 XP & +15 Coins!</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="glass" onClick={initMemoryMatch} iconLeft={<RefreshCw size={14} />} style={{ height: '36px', fontSize: '0.85rem' }}>
                Restart Game
              </Button>
              <Button variant="glass" onClick={exitGame} style={{ height: '36px', fontSize: '0.85rem' }}>
                Exit Game
              </Button>
            </div>

          </div>
        </Card>
      )}

      {/* Binary Sum Puzzle Screen */}
      {selectedGame === 'binary' && (
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>💻 Binary Sum Nibble</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Level {binaryLevel}/3</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            
            {/* Target Panel */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              padding: '16px',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target Sum (Decimal)</span>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{binaryTarget}</span>
            </div>

            {/* Binary Switch grid (8 4 2 1 values) */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', width: '100%' }}>
              {[8, 4, 2, 1].map((place, idx) => {
                const bitVal = activeBits[idx];
                return (
                  <div
                    key={place}
                    onClick={() => toggleBit(idx)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '10px',
                      border: bitVal === 1 ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                      background: bitVal === 1 ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                      cursor: 'pointer',
                      width: '60px',
                      transition: 'all 0.2s ease',
                      userSelect: 'none'
                    }}
                    className="hover-scale"
                  >
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{place}s</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: bitVal === 1 ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                      {bitVal}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Verification Message */}
            {binaryMessage && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: binaryMessage.startsWith('✓') ? 'var(--color-success)' : 'var(--color-danger)',
                background: binaryMessage.startsWith('✓') ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                border: binaryMessage.startsWith('✓') ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(239, 68, 68, 0.15)',
                textAlign: 'center'
              }}>
                {binaryMessage}
              </div>
            )}

            {/* Success Overlay */}
            {binaryFinished && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid var(--color-success)',
                borderRadius: '8px',
                padding: '12px 20px',
                color: 'var(--color-success)',
                textAlign: 'center'
              }}>
                <span style={{ fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>🎉 Binary Sum Arena Completed!</span>
                <span style={{ fontSize: '0.75rem' }}>Successfully matched all binary targets. Awarded +95 XP & +20 Coins!</span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="primary"
                onClick={verifyBinary}
                disabled={binaryFinished}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                Verify bits
              </Button>
              <Button variant="glass" onClick={exitGame} style={{ height: '36px', fontSize: '0.85rem' }}>
                Exit Game
              </Button>
            </div>

          </div>
        </Card>
      )}

    </div>
  );
};

export default LogicArena;
