import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Trash2, AlertOctagon, Check, RotateCcw } from 'lucide-react';

const DataManagement = () => {
  const [confirmKey, setConfirmKey] = useState(null); // stores key of button in 'confirm' state
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-reset confirmation state after 3 seconds of idle
  useEffect(() => {
    let timer;
    if (confirmKey) {
      timer = setTimeout(() => {
        setConfirmKey(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [confirmKey]);

  const handleResetAction = (actionType) => {
    if (confirmKey !== actionType) {
      setConfirmKey(actionType);
      return;
    }

    // Double confirmed! Execute purge
    executePurge(actionType);
    setConfirmKey(null);
  };

  const executePurge = (type) => {
    switch (type) {
      case 'study':
        localStorage.removeItem('autopilot-study-sessions');
        localStorage.removeItem('autopilot-study-notes');
        localStorage.removeItem('autopilot-study-pdfs');
        localStorage.removeItem('autopilot-study-revisions');
        showFeedback('Study Hub notes and sessions cleared.');
        break;
      case 'coding':
        localStorage.removeItem('anshul_autopilot_coding_data');
        showFeedback('Coding Workspace stats reset.');
        break;
      case 'projects':
        localStorage.removeItem('anshul_autopilot_projects_data');
        showFeedback('Active Projects and bug logs deleted.');
        break;
      case 'skills':
        localStorage.removeItem('anshul_autopilot_skill_data');
        showFeedback('Skill Arena level progress reset to Level 1.');
        break;
      case 'health':
        localStorage.removeItem('anshul_autopilot_health_data');
        showFeedback('Health and habits trackers reset.');
        break;
      case 'all':
        localStorage.clear();
        showFeedback('Entire workspace reset successfully! Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        break;
      default:
        break;
    }
  };

  const showFeedback = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const dataActions = [
    { key: 'study', label: 'Purge Study Hub Data', desc: 'Deletes all study history logs, created notes, revisions lists, and book PDFs.' },
    { key: 'coding', label: 'Reset Coding stats', desc: 'Resets solved problems counts, active streaks, language distributions, and accuracies.' },
    { key: 'projects', label: 'Delete projects database', desc: 'Removes all projects, tasks timelines, milestones, and bug sheets.' },
    { key: 'skills', label: 'Reset Skill Arena progress', desc: 'Purges XP logs and rank levels. Returns rank to Level 1 (Novice).' },
    { key: 'health', label: 'Reset health trackers', desc: 'Clears daily water goals, sleep history records, and routine streaks.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Module Clears Card */}
      <Card 
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={18} style={{ color: 'var(--color-danger)' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Purge Workspace Modules</span>
          </div>
        }
        style={{ border: '1px solid var(--glass-border)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', marginTop: '6px' }}>
          
          {dataActions.map(action => {
            const isConfirming = confirmKey === action.key;
            return (
              <div
                key={action.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: '200px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{action.label}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{action.desc}</span>
                </div>

                <Button
                  variant={isConfirming ? 'primary' : 'glass'}
                  onClick={() => handleResetAction(action.key)}
                  style={{
                    height: '32px',
                    fontSize: '0.75rem',
                    background: isConfirming ? 'var(--color-danger)' : 'transparent',
                    color: isConfirming ? '#ffffff' : 'var(--color-danger)',
                    border: '1px solid var(--color-danger)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isConfirming ? 'Are you sure? Click again!' : 'Purge Data'}
                </Button>
              </div>
            );
          })}

        </div>
      </Card>

      {/* Dangerous Full Clear Card */}
      <Card 
        style={{
          border: '1.5px solid var(--color-danger)',
          background: 'rgba(239, 68, 68, 0.03)',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }} className="flex-col-mobile">
          <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', display: 'flex' }}>
            <AlertOctagon size={24} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: '200px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>Reset Entire Workspace (Factory Purge)</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Destructive Action: Deletes all notes, resolved bugs, levels, water intakes, and timers configurations. This returns the app back to initial install settings.
            </span>
          </div>

          <Button
            variant={confirmKey === 'all' ? 'primary' : 'glass'}
            onClick={() => handleResetAction('all')}
            style={{
              height: '38px',
              fontSize: '0.8rem',
              background: confirmKey === 'all' ? 'var(--color-danger)' : 'transparent',
              color: confirmKey === 'all' ? '#ffffff' : 'var(--color-danger)',
              border: '1px solid var(--color-danger)'
            }}
          >
            {confirmKey === 'all' ? 'FACTORY RESET? Click again!' : 'Reset All System Data'}
          </Button>
        </div>
      </Card>

      {/* Feedback Alert */}
      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid var(--color-success)',
          color: 'var(--color-success)',
          fontSize: '0.8rem',
          fontWeight: 700,
          alignSelf: 'center'
        }}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

    </div>
  );
};

export default DataManagement;
