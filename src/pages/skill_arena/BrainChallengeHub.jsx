import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Gamepad2, ArrowRight, Zap, RefreshCw, Check, X } from 'lucide-react';

const BrainChallengeHub = ({ onAwardXP, onAwardCoins, onCompleteDaily, onRecordActivity, searchQuery }) => {
  const [selectedGame, setSelectedGame] = useState(null);

  // Reaction Speed Test state
  const [reactionState, setReactionState] = useState('idle'); // idle -> waiting -> ready -> success -> too-early
  const [reactionTime, setReactionTime] = useState(null);
  const reactionTimerRef = useRef(null);
  const greenTimeRef = useRef(null);

  // Math Sprint state
  const [mathFinished, setMathFinished] = useState(false);
  const [mathScore, setMathScore] = useState(0);
  const [mathTimeLeft, setMathTimeLeft] = useState(15);
  const [mathQuestion, setMathQuestion] = useState({ q: '', ans: true });
  const mathTimerRef = useRef(null);

  const startReactionTest = () => {
    setReactionState('waiting');
    setReactionTime(null);
    const delay = Math.floor(Math.random() * 2500) + 1500; // 1.5s to 4s
    reactionTimerRef.current = setTimeout(() => {
      setReactionState('ready');
      greenTimeRef.current = Date.now();
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionState === 'waiting') {
      clearTimeout(reactionTimerRef.current);
      setReactionState('too-early');
      onRecordActivity(false);
    } else if (reactionState === 'ready') {
      const clickTime = Date.now();
      const speed = clickTime - greenTimeRef.current;
      setReactionTime(speed);
      setReactionState('success');
      onAwardXP(80);
      onAwardCoins(15);
      onCompleteDaily();
      onRecordActivity(true);
    }
  };

  const cancelReaction = () => {
    clearTimeout(reactionTimerRef.current);
    setReactionState('idle');
    setReactionTime(null);
  };

  // Math Sprint functions
  const generateMathQuestion = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer, displayVal, isCorrect;

    if (op === '+') {
      a = Math.floor(Math.random() * 20) + 5;
      b = Math.floor(Math.random() * 20) + 5;
      answer = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 30) + 10;
      b = Math.floor(Math.random() * 20) + 5;
      answer = a - b;
    } else {
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      answer = a * b;
    }

    isCorrect = Math.random() > 0.5;
    if (isCorrect) {
      displayVal = answer;
    } else {
      const offset = Math.floor(Math.random() * 6) - 3;
      displayVal = answer + (offset === 0 ? 2 : offset);
    }

    setMathQuestion({
      q: `${a} ${op} ${b} = ${displayVal}`,
      ans: isCorrect
    });
  };

  const startMathSprint = () => {
    setMathFinished(false);
    setMathScore(0);
    setMathTimeLeft(15);
    generateMathQuestion();

    if (mathTimerRef.current) clearInterval(mathTimerRef.current);
    mathTimerRef.current = setInterval(() => {
      setMathTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(mathTimerRef.current);
          finishMathSprint();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitMathAnswer = (val) => {
    if (mathFinished) return;
    if (val === mathQuestion.ans) {
      setMathScore(prev => prev + 1);
      onRecordActivity(true);
    } else {
      onRecordActivity(false);
    }
    generateMathQuestion();
  };

  const finishMathSprint = () => {
    setMathFinished(true);
    // Award XP based on correct answers
    const xpReward = mathScore * 15 + 20;
    const coinReward = mathScore * 3 + 5;
    onAwardXP(xpReward);
    onAwardCoins(coinReward);
    onCompleteDaily();
  };

  const exitMathSprint = () => {
    clearInterval(mathTimerRef.current);
    setSelectedGame(null);
  };

  useEffect(() => {
    return () => {
      clearTimeout(reactionTimerRef.current);
      clearInterval(mathTimerRef.current);
    };
  }, []);

  const games = [
    { id: 'reaction', title: 'Reaction Speed Test', desc: 'Click the screen as soon as it turns green to measure your reflexes.', icon: <Zap size={24} /> },
    { id: 'math', title: 'Visual Math Sprint', desc: 'Solve rapid math equations under a strict 15-second countdown.', icon: <Gamepad2 size={24} /> }
  ].filter(g => !searchQuery || g.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Game Selector */}
      {!selectedGame && (
        <Card 
          header={<span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Select Cognitive Game</span>}
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {games.map(game => (
              <div
                key={game.id}
                onClick={() => {
                  setSelectedGame(game.id);
                  if (game.id === 'reaction') setReactionState('idle');
                  if (game.id === 'math') startMathSprint();
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

      {/* Reaction Test Screen */}
      {selectedGame === 'reaction' && (
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>⚡ Reaction Speed Test</span>
              <button onClick={cancelReaction} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
                Reset Test
              </button>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            
            {/* Click board */}
            {reactionState === 'idle' ? (
              <div
                onClick={startReactionTest}
                style={{
                  width: '100%',
                  height: '220px',
                  background: 'var(--glass-card-bg)',
                  border: '2px dashed var(--glass-border)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  textAlign: 'center',
                  gap: '8px'
                }}
                className="hover-scale"
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Click to Start Test</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Test your speed in milliseconds!</span>
              </div>
            ) : (
              <div
                onClick={handleReactionClick}
                style={{
                  width: '100%',
                  height: '220px',
                  borderRadius: '12px',
                  background: 
                    reactionState === 'waiting' ? '#ef4444' : 
                    reactionState === 'ready' ? '#10b981' : 
                    reactionState === 'too-early' ? '#fb923c' : 'var(--color-primary-glow)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: reactionState === 'success' ? 'default' : 'pointer',
                  textAlign: 'center',
                  gap: '8px',
                  color: '#fff',
                  transition: 'background-color 0.1s ease',
                  userSelect: 'none'
                }}
              >
                {reactionState === 'waiting' && (
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>WAIT FOR GREEN...</span>
                )}
                {reactionState === 'ready' && (
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, animation: 'bounce 0.5s infinite' }}>CLICK NOW!!!</span>
                )}
                {reactionState === 'too-early' && (
                  <>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>TOO EARLY!</span>
                    <span style={{ fontSize: '0.85rem' }}>Click to trigger test restart.</span>
                  </>
                )}
                {reactionState === 'success' && (
                  <div style={{ color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)' }}>Test Complete!</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--mono)', lineHeight: 1.1 }}>{reactionTime} ms</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {reactionTime < 280 ? 'Incredible speed reflexes!' : 'Good reaction, keep training!'}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                      Awarded +80 XP & +15 Coins!
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Back button */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {reactionState === 'success' && (
                <Button variant="primary" onClick={startReactionTest} iconLeft={<RefreshCw size={14} />} style={{ height: '36px', fontSize: '0.85rem' }}>
                  Retest Speed
                </Button>
              )}
              <Button variant="glass" onClick={() => setSelectedGame(null)} style={{ height: '36px', fontSize: '0.85rem' }}>
                Back to Selection
              </Button>
            </div>

          </div>
        </Card>
      )}

      {/* Math Sprint Screen */}
      {selectedGame === 'math' && (
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>⚡ Visual Math Sprint</span>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', fontWeight: 700, color: mathTimeLeft <= 4 ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
                <span>Timer: {mathTimeLeft}s</span>
                <span>Score: {mathScore}</span>
              </div>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            
            {!mathFinished ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%' }}>
                
                {/* Equation Board */}
                <div style={{
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '12px',
                  padding: '24px',
                  width: '100%',
                  maxWidth: '350px',
                  textAlign: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--mono)',
                  letterSpacing: '1px'
                }}>
                  {mathQuestion.q}
                </div>

                {/* Yes / No buttons */}
                <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '300px' }}>
                  <button
                    onClick={() => submitMathAnswer(true)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid var(--color-success)',
                      color: 'var(--color-success)',
                      borderRadius: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    className="hover-scale"
                  >
                    <Check size={20} /> True
                  </button>

                  <button
                    onClick={() => submitMathAnswer(false)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid var(--color-danger)',
                      color: 'var(--color-danger)',
                      borderRadius: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    className="hover-scale"
                  >
                    <X size={20} /> False
                  </button>
                </div>

              </div>
            ) : (
              /* Math Finish Panel */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
                <div style={{
                  background: 'var(--color-primary-glow)',
                  color: 'var(--color-primary)',
                  padding: '14px',
                  borderRadius: '50%'
                }}>
                  <Gamepad2 size={40} />
                </div>
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>Sprint Completed!</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>You solved equations at speed pace.</span>
                </div>

                <div style={{
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  display: 'flex',
                  gap: '20px'
                }}>
                  <div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{mathScore}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Equations</span>
                  </div>
                  <div style={{ width: '1px', background: 'var(--glass-border)' }} />
                  <div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)', display: 'block' }}>+{mathScore * 15 + 20} XP</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Awarded XP</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <Button variant="primary" onClick={startMathSprint} style={{ height: '36px', fontSize: '0.85rem' }}>
                    Restart Sprint
                  </Button>
                  <Button variant="glass" onClick={exitMathSprint} style={{ height: '36px', fontSize: '0.85rem' }}>
                    Exit Game
                  </Button>
                </div>
              </div>
            )}

            {!mathFinished && (
              <Button variant="glass" onClick={exitMathSprint} style={{ height: '36px', fontSize: '0.85rem', marginTop: '10px' }}>
                Exit Sprint
              </Button>
            )}

          </div>
        </Card>
      )}

    </div>
  );
};

export default BrainChallengeHub;
