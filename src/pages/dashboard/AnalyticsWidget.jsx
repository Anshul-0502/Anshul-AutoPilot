import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, ArrowRight, TrendingUp } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';

const AnalyticsWidget = ({ skills = {}, study = {}, coding = {}, tasks = {} }) => {
  const navigate = useNavigate();

  // Dynamic calculations
  const totalMinutes = (study.todayMinutes || 0) + (coding.minutesToday || 0);
  // Focus score based on reaching a daily target of 5 hours (300 minutes)
  const focusScore = Math.min(100, Math.round((totalMinutes / 300) * 100)) || 50;

  const totalTasks = (tasks.completed || 0) + (tasks.pending || 0);
  const taskCompletedRate = totalTasks > 0 ? Math.round((tasks.completed / totalTasks) * 100) : 0;

  const studyPct = totalMinutes > 0 ? Math.round((study.todayMinutes / totalMinutes) * 100) : 50;
  const codingPct = totalMinutes > 0 ? Math.round((coding.minutesToday / totalMinutes) * 100) : 50;

  const studyHours = (study.todayMinutes / 60).toFixed(1);
  const codingHours = (coding.minutesToday / 60).toFixed(1);

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Productivity Analytics</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => navigate('/analytics')}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            Full Report
          </Button>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* Productivity Score Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '10px'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>FOCUS SCORE</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{focusScore}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Lvl {skills.level || 1}</span>
            </div>
          </div>
          <div style={{
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '10px'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TASK COMPLETED</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{taskCompletedRate}%</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{tasks.completed || 0} done</span>
            </div>
          </div>
        </div>

        {/* Study vs Coding Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Category Distribution
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Study Sessions</span>
                <span style={{ fontWeight: 600 }}>{studyHours}h ({studyPct}%)</span>
              </div>
              <ProgressBar value={studyPct} showLabel={false} color="var(--color-primary)" height="5px" />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>DSA & Coding</span>
                <span style={{ fontWeight: 600 }}>{codingHours}h ({codingPct}%)</span>
              </div>
              <ProgressBar value={codingPct} showLabel={false} color="var(--color-success)" height="5px" />
            </div>
          </div>
        </div>

        {/* Trend Indicator */}
        <div style={{
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)'
        }}>
          <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
          <span>You logged {totalMinutes} focus minutes today!</span>
        </div>

        <div style={{ flex: 1 }} />

        <div 
          onClick={() => navigate('/analytics')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            fontSize: '0.85rem', 
            color: 'var(--color-primary)', 
            cursor: 'pointer',
            fontWeight: 500,
            padding: '4px 0'
          }}
          className="hover-scale"
        >
          <span>Open Detailed Analytics</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsWidget;
