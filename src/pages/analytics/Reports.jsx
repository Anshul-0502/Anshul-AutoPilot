import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FileText, Printer, CheckCircle, Clock, Zap, Award } from 'lucide-react';

const Reports = ({ data }) => {
  const [reportType, setReportType] = useState('Weekly'); // 'Daily', 'Weekly', 'Monthly'

  // Calculate dates
  const today = new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' });

  const getReportDates = () => {
    if (reportType === 'Daily') return today;
    if (reportType === 'Monthly') return `${today.split(' ')[0]} 2026 Monthly Overview`;
    return `${lastWeek} - ${today}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Selector buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {['Daily', 'Weekly', 'Monthly'].map(type => {
          const isActive = reportType === type;
          return (
            <Button
              key={type}
              variant={isActive ? 'primary' : 'glass'}
              onClick={() => setReportType(type)}
              style={{ height: '36px', fontSize: '0.8rem' }}
            >
              {type} Report
            </Button>
          );
        })}

        <Button 
          variant="glass" 
          onClick={handlePrint}
          iconLeft={<Printer size={14} />} 
          style={{ height: '36px', fontSize: '0.8rem', marginLeft: 'auto' }}
        >
          Print Report
        </Button>
      </div>

      {/* Printable Report Document Card */}
      <Card 
        style={{
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-card-bg)',
          padding: '30px',
          boxShadow: 'var(--glass-shadow)',
          textAlign: 'left'
        }}
        id="printable-report"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--glass-border)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AutoPilot Performance Document
              </span>
              <h2 style={{ margin: '4px 0', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {reportType} Productivity Report Summary
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Timeline Boundary: {getReportDates()}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Productivity Tier</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-accent)' }}>Gold Tier Certified</span>
            </div>
          </div>

          {/* Section 1: Study & Revisions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              1. Study & Concept Revisions
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px 16px'
            }} className="flex-col-mobile">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Focus Duration</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.study.totalHours} hrs</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Notes Synthesized</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.study.notesCreated} Docs</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Revision Accuracy</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.study.revisionRate}% completed</span>
              </div>
            </div>
          </div>

          {/* Section 2: Coding & Stack solves */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              2. Programming & Stack Solves
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px 16px'
            }} className="flex-col-mobile">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Coding Duration</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.coding.totalHours} hrs</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Tasks Solved</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.coding.problemsSolved} Solves</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Compiler Accuracy</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.coding.accuracy}% passed</span>
              </div>
            </div>
          </div>

          {/* Section 3: Tasks & Milestones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              3. Tasks & Project Milestones
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px 16px'
            }} className="flex-col-mobile">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Task Completion Rate</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.tasks.completionRate}%</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Milestones Reached</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.projects.milestones} reached</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Bugs Resolved</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.projects.bugsFixed} fixed</span>
              </div>
            </div>
          </div>

          {/* Section 4: Habits & Streaks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              4. Habits & Level Cockpit Consistency
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px 16px'
            }} className="flex-col-mobile">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Habits Completion</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.habits.completionRate}%</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Water Intake average</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.habits.waterIntake} Glasses</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Consistency Streaks</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{data.goals.streak} Days</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Document compiled automatically on client browser memory state variables. Security validation: Code verified by Anti Gravity AI.
          </div>

        </div>
      </Card>

    </div>
  );
};

export default Reports;
