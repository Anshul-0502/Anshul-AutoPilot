import React from 'react';
import Card from '../../components/Card';
import { BarChart } from './Charts';
import { Zap, Clock, CheckCircle2, ShieldAlert, Award, TrendingUp } from 'lucide-react';

const ProductivityAnalytics = ({ data, filter }) => {
  const completedTasks = data.tasks.completed;
  const pendingTasks = data.tasks.pending;
  const studyHours = data.study.totalHours;
  const codingHours = data.coding.totalHours;
  const habitRate = data.habits.completionRate;

  // Calculate composite Productivity Score
  const taskFactor = data.tasks.total > 0 ? (completedTasks / data.tasks.total) * 40 : 35;
  const focusFactor = Math.min(30, ((studyHours + codingHours) / 8) * 30); // target 8 hours for max weight
  const habitFactor = (habitRate / 100) * 30;
  const productivityScore = Math.min(100, Math.max(10, Math.round(taskFactor + focusFactor + habitFactor))) || 74;

  const getTier = (score) => {
    if (score < 40) return { name: 'Bronze Standard', color: '#b45309', desc: 'Focus on setting small daily tasks and starting short study blocks.' };
    if (score < 60) return { name: 'Silver Standard', color: '#94a3b8', desc: 'Making progress! Keep a daily study streak to build consistent focus.' };
    if (score < 80) return { name: 'Gold Standard', color: '#eab308', desc: 'Excellent performance! You are matching target objectives regularly.' };
    if (score < 95) return { name: 'Platinum Standard', color: '#2563eb', desc: 'High capability metrics! Coding and task completion rates are peak.' };
    return { name: 'Diamond Standard', color: '#c084fc', desc: 'Master developer output! Maintain work-life balance habits.' };
  };

  const tier = getTier(productivityScore);

  // Mock bar chart data representing productivity trends based on the filter
  const getTrendData = () => {
    if (filter === 'Daily') {
      return [
        { label: '8 AM', value: 30 },
        { label: '11 AM', value: 85 },
        { label: '2 PM', value: 45 },
        { label: '5 PM', value: 60 },
        { label: '8 PM', value: 95 }
      ];
    }
    if (filter === 'Monthly') {
      return [
        { label: 'Week 1', value: 72 },
        { label: 'Week 2', value: 68 },
        { label: 'Week 3', value: 80 },
        { label: 'Week 4', value: productivityScore }
      ];
    }
    if (filter === 'Yearly') {
      return [
        { label: 'Q1', value: 60 },
        { label: 'Q2', value: 75 },
        { label: 'Q3', value: 85 },
        { label: 'Q4', value: productivityScore }
      ];
    }
    // Default: Weekly
    return [
      { label: 'Mon', value: 70 },
      { label: 'Tue', value: 82 },
      { label: 'Wed', value: 90 },
      { label: 'Thu', value: 65 },
      { label: 'Fri', value: 75 },
      { label: 'Sat', value: 50 },
      { label: 'Sun', value: productivityScore }
    ];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Upper score banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '20px'
      }}>
        
        {/* Productivity Score Card */}
        <div style={{ gridColumn: 'span 5' }} className="col-span-desktop-12">
          <Card 
            hoverable={false}
            style={{
              padding: '24px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(10, 15, 29, 0.2) 100%)',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Productivity Rating
            </span>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="transparent" stroke="var(--glass-border)" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="transparent"
                  stroke={tier.color}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 - (productivityScore / 100) * (2 * Math.PI * 50)}
                  style={{ strokeLinecap: 'round', transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{productivityScore}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>Score</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: tier.color, display: 'block' }}>
                {tier.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {tier.desc}
              </span>
            </div>
          </Card>
        </div>

        {/* Metrics Cockpit grid */}
        <div style={{ gridColumn: 'span 7' }} className="col-span-desktop-12">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            height: '100%'
          }} className="flex-col-mobile">
            
            <div style={{
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '10px', borderRadius: '50%', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', display: 'flex' }}>
                <Clock size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Focus Time</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                  {Math.round((studyHours + codingHours) * 10) / 10} hrs
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Study: {studyHours}h | Code: {codingHours}h</span>
              </div>
            </div>

            <div style={{
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
                <CheckCircle2 size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Task Completion</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                  {data.tasks.completionRate}%
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{completedTasks} of {data.tasks.total} Tasks Completed</span>
              </div>
            </div>

            <div style={{
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', display: 'flex' }}>
                <ShieldAlert size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overdue / Backlog</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                  {data.tasks.overdue} Tasks
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Needs quick action resolution</span>
              </div>
            </div>

            <div style={{
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ padding: '10px', borderRadius: '50%', background: 'var(--color-primary-glow)', color: 'var(--color-secondary)', display: 'flex' }}>
                <Award size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Skill Arena level</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                  Lvl {data.skill.level}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{data.skill.xp.toLocaleString()} total XP collected</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Historical charts panel */}
      <Card
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {filter} Productivity score Trend
            </span>
          </div>
        }
        style={{ border: '1px solid var(--glass-border)' }}
      >
        <div style={{ padding: '10px 0' }}>
          <BarChart data={getTrendData()} height={150} color={tier.color} />
        </div>
      </Card>

    </div>
  );
};

export default ProductivityAnalytics;
