import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { X, Copy, Check, Clock, AlertCircle } from 'lucide-react';

const ProblemDetails = ({ problem, onClose, onUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [revisionRequired, setRevisionRequired] = useState(problem.revisionRequired || false);

  const handleCopy = () => {
    navigator.clipboard.writeText(problem.solutionCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevisionToggle = () => {
    const updatedStatus = !revisionRequired;
    setRevisionRequired(updatedStatus);
    onUpdate({
      ...problem,
      revisionRequired: updatedStatus
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(6, 11, 24, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }} className="animate-slide-up">
        
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  {problem.platform}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                  {problem.name}
                </span>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                className="hover-scale"
              >
                <X size={16} />
              </button>
            </div>
          }
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Meta row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', background: 'var(--glass-btn-bg)', border: '1px solid var(--glass-border)', padding: '8px 12px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>Topic: <strong>{problem.topic}</strong></span>
                <span>•</span>
                <span>Time Taken: <strong>{problem.timeTaken}</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="modalRev"
                  checked={revisionRequired}
                  onChange={handleRevisionToggle}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                />
                <label htmlFor="modalRev" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                  Review Spacing Required
                </label>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Complexity Analysis
              </span>
              <div style={{ 
                background: 'var(--glass-btn-bg)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '6px', 
                padding: '8px 12px', 
                fontFamily: 'var(--mono)', 
                fontSize: '0.8rem',
                color: 'var(--color-primary)',
                fontWeight: 600
              }}>
                {problem.complexityAnalysis}
              </div>
            </div>

            {/* Solution code block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Solution Code
                </span>
                <Button 
                  variant="glass" 
                  size="sm" 
                  onClick={handleCopy}
                  iconLeft={copied ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
                  style={{ height: '26px', padding: '0 8px', fontSize: '0.75rem' }}
                >
                  {copied ? 'Copied' : 'Copy Code'}
                </Button>
              </div>

              <pre style={{
                margin: 0,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '12px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--mono)',
                fontSize: '0.8rem',
                overflowX: 'auto',
                maxHeight: '260px',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5
              }}>
                <code>{problem.solutionCode}</code>
              </pre>
            </div>

            <Button variant="outline" size="sm" onClick={onClose} style={{ alignSelf: 'flex-end', marginTop: '4px' }}>
              Close Workspace
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default ProblemDetails;
