import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Droplet, Plus, Minus, RefreshCw } from 'lucide-react';

const WaterTracker = ({ intake = 0, goal = 8, onAddGlass, onUpdateGoal }) => {
  const percent = Math.min(100, Math.round((intake / goal) * 100));

  // SVG Water Glass filling height calculation
  // Glass starts at y=10 and ends at y=90 (total height 80)
  const glassTop = 10;
  const glassBottom = 90;
  const fillHeight = (intake / goal) * (glassBottom - glassTop);
  const fillY = glassBottom - fillHeight;

  return (
    <Card 
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={18} style={{ color: 'var(--color-secondary)' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Daily Hydration Log</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{percent}% Target Met</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', padding: '10px 0' }} className="flex-col-mobile align-center">
        
        {/* Animated filling SVG water glass */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '120px' }}>
          <svg width="100" height="120" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Water Fill (clipping to the glass shape) */}
            <defs>
              <clipPath id="glass-clip">
                <path d="M 28,10 L 35,90 L 65,90 L 72,10 Z" />
              </clipPath>
            </defs>
            
            {/* Clipped filling rectangle */}
            <rect
              x="10"
              y={fillY}
              width="80"
              height={fillHeight}
              fill="url(#water-grad)"
              clipPath="url(#glass-clip)"
              style={{ transition: 'y 0.5s ease-in-out, height 0.5s ease-in-out' }}
            />
            
            {/* Water gradient */}
            <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Glass Outline Container */}
            <path
              d="M 25,8 L 33,92 L 67,92 L 75,8"
              fill="transparent"
              stroke="var(--glass-border-hover)"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            
            {/* Glass inner highlights (shine lines) */}
            <path
              d="M 30,15 L 36,85"
              fill="transparent"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Hydration percentage badge */}
          <div style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border-hover)',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            boxShadow: 'var(--glass-shadow)'
          }}>
            {intake} / {goal}
          </div>
        </div>

        {/* Adjusting logs & Targets panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Log glass counts:</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="primary"
                onClick={() => onAddGlass(1)}
                disabled={intake >= goal}
                iconLeft={<Plus size={16} />}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                Drink 1 Glass
              </Button>
              
              <Button
                variant="glass"
                onClick={() => onAddGlass(-1)}
                disabled={intake <= 0}
                iconLeft={<Minus size={16} />}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                Remove Cup
              </Button>
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />

          {/* Goal adjustments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Daily Target Limit (Glasses):</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => onUpdateGoal && onUpdateGoal(goal - 1)}
                disabled={goal <= 4}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-btn-bg)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                -
              </button>
              
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                {goal} Cups
              </span>

              <button
                onClick={() => onUpdateGoal && onUpdateGoal(goal + 1)}
                disabled={goal >= 20}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-btn-bg)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </button>
            </div>
          </div>

          {percent === 100 && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid var(--color-success)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.75rem',
              color: 'var(--color-success)',
              fontWeight: 700
            }}>
              🎉 Target met! You are fully hydrated for today.
            </div>
          )}

        </div>

      </div>
    </Card>
  );
};

export default WaterTracker;
