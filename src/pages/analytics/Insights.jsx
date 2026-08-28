import React from 'react';
import Card from '../../components/Card';
import { Lightbulb, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, Info } from 'lucide-react';

const Insights = ({ data }) => {
  const { study, coding, tasks, projects, skill, habits, goals } = data;

  // Rule-based conditional calculation
  const generateInsights = () => {
    const list = [];

    // Study insights
    if (study.totalHours >= 20) {
      list.push({
        id: 'study-high',
        type: 'success',
        title: 'Outstanding Study Focus!',
        text: `You logged ${study.totalHours} study hours this period. Your dedication to subjects like DSA and DBMS is showing excellent progress.`,
        icon: <CheckCircle2 size={18} />
      });
    } else {
      list.push({
        id: 'study-low',
        type: 'info',
        title: 'Study Hours Booster',
        text: `You logged ${study.totalHours} study hours. Try scheduling short 25-minute Pomodoro study blocks using the Smart Focus widget to boost duration.`,
        icon: <Info size={18} />
      });
    }

    // Coding insights
    if (coding.streak >= 4) {
      list.push({
        id: 'coding-streak',
        type: 'success',
        title: 'Coding Streaks Intact',
        text: `Your coding streak is at ${coding.streak} days. Consistent problem-solving in Python/JavaScript is reinforcing your DSA speed typing.`,
        icon: <TrendingUp size={18} />
      });
    }

    if (coding.accuracy < 80) {
      list.push({
        id: 'coding-acc',
        type: 'warning',
        title: 'Refining Solution Logic',
        text: `Your code compiler accuracy is at ${coding.accuracy}%. Try writing pseudo-code logic blocks first before typing solutions in Code Arena.`,
        icon: <AlertTriangle size={18} />
      });
    } else {
      list.push({
        id: 'coding-acc-high',
        type: 'success',
        title: 'Exceptional Solution Accuracy',
        text: `Your coding accuracy is at ${coding.accuracy}%. You are passing compilers with minimal syntax bugs!`,
        icon: <CheckCircle2 size={18} />
      });
    }

    // Tasks insights
    if (tasks.completionRate >= 80) {
      list.push({
        id: 'task-velocity',
        type: 'success',
        title: 'High Task Execution Velocity',
        text: `You completed ${tasks.completed} out of ${tasks.total} tasks (${tasks.completionRate}%). Your velocity makes Wednesday your most productive weekday.`,
        icon: <CheckCircle2 size={18} />
      });
    } else {
      list.push({
        id: 'task-slow',
        type: 'warning',
        title: 'Task Completions Delay',
        text: `Your task completion rate dropped to ${tasks.completionRate}%. Try splitting complex tasks into smaller sub-tasks with precise priority levels.`,
        icon: <AlertTriangle size={18} />
      });
    }

    if (tasks.overdue > 0) {
      list.push({
        id: 'task-overdue',
        type: 'danger',
        title: 'Overdue Task Alert',
        text: `You have ${tasks.overdue} task past its deadline limit. Action required: reschedule or mark it completed to clean your backlog.`,
        icon: <AlertCircle size={18} />
      });
    }

    // Health habits insights
    if (habits.sleepHours < 7) {
      list.push({
        id: 'sleep-deficit',
        type: 'danger',
        title: 'Sleep Deficit Notice',
        text: `Your sleep duration averaged ${habits.sleepHours} hours, which is below the target 8 hours. Try setting bed-time reminders to improve recovery.`,
        icon: <AlertCircle size={18} />
      });
    } else {
      list.push({
        id: 'sleep-healthy',
        type: 'success',
        title: 'Healthy Recovery Duration',
        text: `Your sleep is balanced at ${habits.sleepHours} hours. Healthy sleep increases focus duration by up to 20%!`,
        icon: <CheckCircle2 size={18} />
      });
    }

    if (habits.waterIntake < 8) {
      list.push({
        id: 'water-hydration',
        type: 'warning',
        title: 'Hydration Target Missed',
        text: `You logged ${habits.waterIntake} glasses of water. Remember to log 8 glasses daily to maintain energy and focus levels.`,
        icon: <AlertTriangle size={18} />
      });
    }

    return list;
  };

  const insights = generateInsights();

  const getStyleByType = (type) => {
    switch (type) {
      case 'success':
        return {
          border: '1px solid rgba(16, 185, 129, 0.25)',
          background: 'rgba(16, 185, 129, 0.05)',
          color: 'var(--color-success)'
        };
      case 'warning':
        return {
          border: '1px solid rgba(245, 158, 11, 0.25)',
          background: 'rgba(245, 158, 11, 0.05)',
          color: 'var(--color-accent)'
        };
      case 'danger':
        return {
          border: '1px solid rgba(239, 68, 68, 0.25)',
          background: 'rgba(239, 68, 68, 0.05)',
          color: 'var(--color-danger)'
        };
      default: // info
        return {
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-btn-bg)',
          color: 'var(--color-primary)'
        };
    }
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} style={{ color: 'var(--color-accent)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Personalized Smart Insights</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
        {insights.map(ins => {
          const typeStyle = getStyleByType(ins.type);
          return (
            <div
              key={ins.id}
              style={{
                display: 'flex',
                alignItems: 'start',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '10px',
                ...typeStyle
              }}
            >
              <span style={{ display: 'flex', marginTop: '2px' }}>{ins.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{ins.title}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{ins.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default Insights;
