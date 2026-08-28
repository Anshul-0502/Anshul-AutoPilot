import React from 'react';
import Card from '../../components/Card';
import { LineChart, DoughnutChart } from './Charts';
import { BookOpen, Award, Copy, CheckCircle, Flame } from 'lucide-react';

const StudyAnalytics = ({ data, filter }) => {
  const { totalHours, notesCreated, pdfsCompleted, revisionRate, subjectHours = {} } = data;

  // Prepare Doughnut Chart Data from subject allocation hours
  const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)', 'var(--color-success)', 'var(--color-info)'];
  const doughnutData = Object.entries(subjectHours).map(([subject, hours], idx) => ({
    label: subject,
    value: hours,
    color: colors[idx % colors.length]
  }));

  // Prepare Line Chart Data based on time filters
  const getStudyTimeData = () => {
    if (filter === 'Daily') {
      return [
        { label: '8 AM', value: 0.5 },
        { label: '12 PM', value: 1.2 },
        { label: '4 PM', value: 0.8 },
        { label: '8 PM', value: 2.0 },
        { label: '10 PM', value: 1.5 }
      ];
    }
    if (filter === 'Monthly') {
      return [
        { label: 'Week 1', value: 8 },
        { label: 'Week 2', value: 6 },
        { label: 'Week 3', value: 11 },
        { label: 'Week 4', value: totalHours }
      ];
    }
    if (filter === 'Yearly') {
      return [
        { label: 'Q1', value: 45 },
        { label: 'Q2', value: 38 },
        { label: 'Q3', value: 52 },
        { label: 'Q4', value: totalHours }
      ];
    }
    // Default: Weekly
    return [
      { label: 'Mon', value: 2.5 },
      { label: 'Tue', value: 3.0 },
      { label: 'Wed', value: 4.5 },
      { label: 'Thu', value: 1.5 },
      { label: 'Fri', value: 3.5 },
      { label: 'Sat', value: 2.0 },
      { label: 'Sun', value: Math.round((totalHours * 0.2) * 10) / 10 || 3.0 }
    ];
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Metrics Row */}
      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
              <BookOpen size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Study Hours</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{totalHours} hrs</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)', display: 'flex' }}>
              <Copy size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Notes Created</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{notesCreated} Notes</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
              <CheckCircle size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Revision Rate</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{revisionRate}%</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ gridColumn: 'span 3' }} className="col-span-desktop-6 col-span-mobile-12">
        <Card style={{ padding: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', display: 'flex' }}>
              <Flame size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PDFs Finished</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'var(--mono)' }}>{pdfsCompleted} Books</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Line Chart (Hours Study) */}
      <div style={{ gridColumn: 'span 8' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Focus Time Growth ({filter})</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <LineChart data={getStudyTimeData()} height={150} color="var(--color-primary)" />
          </div>
        </Card>
      </div>

      {/* Doughnut Chart (Subject Distribution) */}
      <div style={{ gridColumn: 'span 4' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Subject Allocation</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ padding: '10px 0' }}>
            <DoughnutChart data={doughnutData} size={110} />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default StudyAnalytics;
