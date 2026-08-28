import React from 'react';
import Card from '../../components/Card';
import { Target, BarChart2, Zap, Award } from 'lucide-react';

const SkillAnalytics = ({ xp, stats, completedChallenges = [] }) => {
  const { totalGames, accuracy, codingCompleted, quizzesCompleted, logicScore, reactionTime } = stats;

  // 1. Doughnut chart configuration (Code vs Quiz)
  const totalCompleted = codingCompleted + quizzesCompleted || 1;
  const codingPct = Math.round((codingCompleted / totalCompleted) * 100);
  const quizPct = Math.round((quizzesCompleted / totalCompleted) * 100);

  const radius = 45;
  const circ = 2 * Math.PI * radius;
  const codingOffset = circ - (codingPct / 100) * circ;
  const quizOffset = circ - (quizPct / 100) * circ;

  // 2. Line Chart configuration (XP gained over 7 days)
  // Mocking values that culminate in the user's current XP
  const xpHistory = [
    { day: 'Mon', val: Math.round(xp * 0.4) },
    { day: 'Tue', val: Math.round(xp * 0.5) },
    { day: 'Wed', val: Math.round(xp * 0.65) },
    { day: 'Thu', val: Math.round(xp * 0.72) },
    { day: 'Fri', val: Math.round(xp * 0.8) },
    { day: 'Sat', val: Math.round(xp * 0.95) },
    { day: 'Sun', val: xp }
  ];

  const maxVal = Math.max(...xpHistory.map(h => h.val)) || 100;
  const minVal = Math.min(...xpHistory.map(h => h.val)) || 0;
  const chartHeight = 120;
  const chartWidth = 450;
  const padding = 20;

  // Map history to SVG points
  const points = xpHistory.map((h, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / (xpHistory.length - 1);
    const y = chartHeight - padding - ((h.val - minVal) / (maxVal - minVal || 1)) * (chartHeight - padding * 2);
    return { x, y, day: h.day, val: h.val };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
    : '';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Metrics Row */}
      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
              <Zap size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>XP Capacity</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{xp.toLocaleString()} XP</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
              <Target size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Solved Accuracy</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{accuracy}%</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)', display: 'flex' }}>
              <Award size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Arena Engagements</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{totalGames} Sessions</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Line Chart Card (Weekly Progression) */}
      <div style={{ gridColumn: 'span 8' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>XP Growth History (7 Days)</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', padding: '10px 0' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height={chartHeight} style={{ overflow: 'visible' }}>
              {/* Horizontal grid lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--glass-border)" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--glass-border)" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--glass-border)" strokeWidth={1} />

              {/* Area path */}
              {areaPath && <path d={areaPath} fill="var(--color-primary-glow)" opacity={0.5} />}
              
              {/* Line path */}
              {linePath && <path d={linePath} fill="transparent" stroke="var(--color-primary)" strokeWidth={3} strokeLinecap="round" />}

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r={4} fill="var(--bg-primary)" stroke="var(--color-primary)" strokeWidth={2} />
                  {/* Tooltip numbers */}
                  <text x={p.x} y={p.y - 8} textAnchor="middle" style={{ fontSize: '9px', fill: 'var(--text-secondary)', fontWeight: 700, fontFamily: 'var(--mono)' }}>
                    {p.val}
                  </text>
                  {/* Axis labels */}
                  <text x={p.x} y={chartHeight - 4} textAnchor="middle" style={{ fontSize: '10px', fill: 'var(--text-muted)', fontWeight: 600 }}>
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </Card>
      </div>

      {/* Doughnut Chart Card (Breakdown) */}
      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={16} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Breakdown Solves</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg height="110" width="110">
                {/* Background Ring */}
                <circle cx="55" cy="55" r={radius} fill="transparent" stroke="var(--glass-border)" strokeWidth="10" />
                
                {/* Coding Arc */}
                {codingCompleted > 0 && (
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    fill="transparent"
                    stroke="var(--color-primary)"
                    strokeWidth="10"
                    strokeDasharray={circ}
                    strokeDashoffset={codingOffset}
                    style={{ strokeLinecap: 'round', transform: 'rotate(-90deg)', transformOrigin: '55px 55px' }}
                  />
                )}
                
                {/* Quiz Arc (Offsetted) */}
                {quizzesCompleted > 0 && (
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    fill="transparent"
                    stroke="var(--color-secondary)"
                    strokeWidth="10"
                    strokeDasharray={circ}
                    strokeDashoffset={quizOffset}
                    style={{ strokeLinecap: 'round', transform: `rotate(${(codingPct * 360) / 100 - 90}deg)`, transformOrigin: '55px 55px' }}
                  />
                )}
              </svg>
              
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{codingCompleted + quizzesCompleted}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total</span>
              </div>
            </div>

            {/* Legend indicators */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', justifyContent: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Coding ({codingCompleted})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-secondary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Quizzes ({quizzesCompleted})</span>
              </div>
            </div>

          </div>
        </Card>
      </div>

    </div>
  );
};

export default SkillAnalytics;
