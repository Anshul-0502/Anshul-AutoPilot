import React from 'react';
import Card from '../../components/Card';
import { Flame, Trophy, Sparkles, BookOpen } from 'lucide-react';

const XPSystem = ({ xp, streak, levelInfo }) => {
  const { level, name, minXp, maxXp } = levelInfo;
  
  // Calculate level progress percentage
  const levelRange = maxXp - minXp;
  const currentLevelProgress = xp - minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelProgress / levelRange) * 100)));
  const xpNeeded = maxXp - xp;

  // SVG Circular progress properties
  const radius = 60;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Motivational messages per level
  const getMotivation = (lvl) => {
    switch (lvl) {
      case 1: return "Welcome to the Arena! Solve a coding problem or take a quiz to earn your first XP points.";
      case 2: return "Initiated! Keep learning every day to build code consistency.";
      case 3: return "Good progress! You are beginning to understand intermediate algorithms.";
      case 4: return "You are doing great! Let's solve some coding problems or quick rapid-fire quizzes.";
      case 5: return "Incredible logic capabilities. You are ranking up rapidly!";
      default: return "Master Developer status! Keep pushing limits and maintain your coding streaks.";
    }
  };

  return (
    <Card 
      hoverable={false}
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, rgba(10, 15, 29, 0.25) 100%)',
        border: '1px solid var(--glass-border)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
        flexWrap: 'wrap'
      }} className="flex-col-mobile align-center">
        
        {/* SVG Progress Circle */}
        <div style={{
          position: 'relative',
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <svg
            height={radius * 2}
            width={radius * 2}
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background Circle */}
            <circle
              stroke="var(--glass-border)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Active Progress Circle */}
            <circle
              stroke="var(--color-primary)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, strokeLinecap: 'round', transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          
          {/* Inner Content */}
          <div style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Level</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{level}</span>
          </div>
        </div>

        {/* Level & XP stats details */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--text-primary)'
            }}>
              {name}
            </span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              background: 'var(--color-primary-glow)',
              color: 'var(--color-primary)',
              padding: '2px 8px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Rank {level}
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            {getMotivation(level)}
          </p>

          <div style={{ height: '8px' }} />

          {/* Progress Bar details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              <span>{xp} XP Total</span>
              <span>{xpNeeded > 0 ? `${xpNeeded} XP to Level ${level + 1}` : 'Maximum Level Reached'}</span>
            </div>
            
            {/* Linear background tracker */}
            <div style={{
              width: '100%',
              height: '8px',
              background: 'var(--glass-border)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                borderRadius: '4px',
                transition: 'width 0.4s ease-in-out'
              }} />
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--glass-border)' }} className="hide-mobile" />

        {/* Streak & Consistency panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '10px 20px',
          background: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.15)',
          borderRadius: '12px',
          minWidth: '150px'
        }} className="full-width-mobile">
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--color-accent)',
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <Flame size={24} />
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
              {streak} Days
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Learning Streak
            </span>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default XPSystem;
