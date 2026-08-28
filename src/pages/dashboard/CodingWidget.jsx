import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Flame, ArrowRight, CheckCircle } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';

const CodingWidget = ({ coding = {} }) => {
  const navigate = useNavigate();

  const solvedProblems = coding.solvedProblems || 0;
  // Default target milestone of 100 or double the solved problems
  const targetProblems = coding.totalProblems > solvedProblems ? coding.totalProblems : Math.max(100, solvedProblems + 10);
  const streak = coding.streak || 0;
  const recentSolutions = coding.recentSolutions || [];

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={18} style={{ color: 'var(--color-success)' }} />
            <span>Coding & DSA</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => navigate('/coding')}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            DSA Practice
          </Button>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* Coding Stats Panel */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Problems Solved</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
              {solvedProblems} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {targetProblems}</span>
            </span>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-accent)'
          }}>
            <Flame size={18} style={{ fill: 'currentColor' }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{streak} Day Streak</span>
          </div>
        </div>

        {/* Progress bar to next goal */}
        <ProgressBar
          value={solvedProblems}
          max={targetProblems}
          color="var(--color-success)"
          label="DSA Master Milestone"
          height="6px"
        />

        {/* Recent Submissions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Recent Solved
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentSolutions.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '10px 0' }}>
                No solved problems logged yet.
              </div>
            ) : (
              recentSolutions.map((sol, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--glass-btn-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', marginRight: '6px' }}>
                    <CheckCircle size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    <span style={{ 
                      color: 'var(--text-primary)', 
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {sol.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '0.7rem',
                      background: sol.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.1)' : sol.difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: sol.difficulty === 'Easy' ? 'var(--color-success)' : sol.difficulty === 'Hard' ? 'var(--color-danger)' : 'var(--color-accent)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      {sol.difficulty}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div 
          onClick={() => navigate('/coding')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            fontSize: '0.85rem', 
            color: 'var(--color-success)', 
            cursor: 'pointer',
            fontWeight: 500,
            padding: '4px 0'
          }}
          className="hover-scale"
        >
          <span>Open Coding Workspace</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Card>
  );
};

export default CodingWidget;
