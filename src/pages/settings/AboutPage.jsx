import React from 'react';
import Card from '../../components/Card';
import { Info, Cpu, Award } from 'lucide-react';

const AboutPage = () => {
  const changelogs = [
    { version: 'v2.0.0 (Phase 11-12)', date: 'August 24, 2026', changes: ['Completed Health, Habits & Hydration tracking workspace.', 'Integrated guided Box Breathing breathing animation guides.', 'Implemented Pomodoro interval controllers and silent Focus modes.', 'Built settings configuration hubs with dynamic theme accents.', 'Added browser file backup JSON exports/FileReader imports.'] },
    { version: 'v1.9.0 (Phase 9-10)', date: 'August 22, 2026', changes: ['Created central Productivity Scoring systems.', 'Completed Skill Arena: daily check-ins, Leaderboards, memory matches, reaction speed tests.', 'Added custom inline SVG Line, Bar, Doughnut, and Heatmap components.', 'Built exportable Daily/Weekly/Monthly Performance reports.'] },
    { version: 'v1.0.0 (Phase 1-8)', date: 'August 20, 2026', changes: ['Core Planner and Scheduling systems.', 'Created Tasks board, DSA coding compilers, and Projects milestone tracks.', 'Implemented dark/light glassmorphic styling sheets.'] }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Product Description */}
      <div style={{ gridColumn: 'span 5' }} className="col-span-desktop-12">
        <Card 
          style={{
            border: '1px solid var(--glass-border)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(10,15,29,0.3) 100%)',
            textAlign: 'center',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--color-primary-glow)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid var(--glass-border-hover)'
          }}>
            <Cpu size={32} />
          </div>

          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Anshul AutoPilot</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Academic Productivity & Wellness Engine</span>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'var(--glass-border)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Build Version: <strong>v2.0.0</strong></span>
            <span>Developer Credit: <strong>Built for Anshul</strong></span>
            <span>Engine Stack: <strong>React, Vite, CSS Grid</strong></span>
            <span>License: <strong>MIT License (Academic)</strong></span>
          </div>
        </Card>
      </div>

      {/* Changelog panel */}
      <div style={{ gridColumn: 'span 7' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: 'var(--color-accent)' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Engine Changelog Matrix</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)', textAlign: 'left' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '6px' }}>
            {changelogs.map((log, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)' }}>{log.version}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{log.date}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {log.changes.map((change, cIdx) => (
                    <li key={cIdx} style={{ lineHeight: '1.4' }}>{change}</li>
                  ))}
                </ul>
                {idx < changelogs.length - 1 && <div style={{ height: '1px', background: 'var(--glass-border)', marginTop: '8px' }} />}
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
};

export default AboutPage;
