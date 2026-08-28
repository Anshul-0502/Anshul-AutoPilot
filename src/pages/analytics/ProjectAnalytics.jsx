import React from 'react';
import Card from '../../components/Card';
import { LineChart, BarChart } from './Charts';
import { Briefcase, Milestone, Bug, Clock, CheckCircle } from 'lucide-react';

const ProjectAnalytics = ({ data, filter }) => {
  const { active, completed, devHours, milestones, bugsFixed, avgProgress } = data;

  // Project progress mapping
  const projectProgressData = [
    { label: 'AutoPilot', value: avgProgress },
    { label: 'Study Hub', value: 80 },
    { label: 'Landing Web', value: 100 }
  ];

  // Dev hours timeline values
  const getDevHoursData = () => {
    if (filter === 'Daily') {
      return [
        { label: '8 AM', value: 0 },
        { label: '12 PM', value: 1.5 },
        { label: '4 PM', value: 0.5 },
        { label: '8 PM', value: 3.0 },
        { label: '10 PM', value: 2.0 }
      ];
    }
    if (filter === 'Monthly') {
      return [
        { label: 'Week 1', value: 10 },
        { label: 'Week 2', value: 12 },
        { label: 'Week 3', value: 8 },
        { label: 'Week 4', value: devHours }
      ];
    }
    if (filter === 'Yearly') {
      return [
        { label: 'Q1', value: 80 },
        { label: 'Q2', value: 110 },
        { label: 'Q3', value: 95 },
        { label: 'Q4', value: devHours }
      ];
    }
    // Default: Weekly
    return [
      { label: 'Mon', value: 4 },
      { label: 'Tue', value: 6 },
      { label: 'Wed', value: 8 },
      { label: 'Thu', value: 3 },
      { label: 'Fri', value: 5 },
      { label: 'Sat', value: 2 },
      { label: 'Sun', value: Math.round((devHours * 0.2) * 10) / 10 || 5.0 }
    ];
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Metrics Row */}
      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
              <Briefcase size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Projects</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{active} Active</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
              <CheckCircle size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed Projects</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{completed} Completed</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)', display: 'flex' }}>
              <Clock size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Development Hours</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{devHours} hrs</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 6' }} className="col-span-desktop-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-accent)', display: 'flex' }}>
              <Milestone size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Milestones Completed</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{milestones} Milestones</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 6' }} className="col-span-desktop-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
              <Bug size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Bugs Fixed</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{bugsFixed} Resolved</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Dev hours timeline */}
      <div style={{ gridColumn: 'span 8' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Development Hours Growth ({filter})</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <LineChart data={getDevHoursData()} height={150} color="var(--color-primary)" />
          </div>
        </Card>
      </div>

      {/* Project Progress bars */}
      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Progress Checklist</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <BarChart data={projectProgressData} height={150} color="var(--color-secondary)" />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default ProjectAnalytics;
