import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';

const StudyWidget = ({ study = {} }) => {
  const navigate = useNavigate();

  const todayMinutes = study.todayMinutes || 0;
  const studyHoursToday = (todayMinutes / 60).toFixed(1);
  const subjects = study.subjects || [];
  const activeSubject = study.activeSubject || 'None';

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Study Tracker</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => navigate('/study')}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            Study Hub
          </Button>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* Main Stats Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Study Hours Today</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {studyHoursToday} Hrs
            </span>
          </div>
          <div style={{
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <BookOpen size={14} style={{ color: 'var(--color-primary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Streak: {study.streak || 0}d</span>
          </div>
        </div>

        {/* Subject Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {subjects.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '10px 0' }}>
              No subjects registered yet.
            </div>
          ) : (
            subjects.map((sub, i) => (
              <ProgressBar
                key={i}
                value={sub.progress}
                color={sub.color || 'var(--color-primary)'}
                label={sub.name}
                height="6px"
                style={{ gap: '2px' }}
              />
            ))
          )}
        </div>

        {/* Current Study Info */}
        <div style={{
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ minWidth: 0, flex: 1, paddingRight: '10px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>ACTIVE SUBJECT</span>
            <span style={{ 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block'
            }}>
              {activeSubject}
            </span>
          </div>
          <span style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-success)', 
            background: 'var(--color-primary-glow)', 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontWeight: 600,
            flexShrink: 0
          }}>
            Revisions: {study.upcomingRevisionsCount || 0}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <div 
          onClick={() => navigate('/study')}
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
          <span>Open Study Hub</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Card>
  );
};

export default StudyWidget;
