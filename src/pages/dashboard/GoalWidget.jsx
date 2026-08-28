import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Circle } from 'lucide-react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import goalApi from '../../services/api/goalApi';
import { useAuth } from '../../contexts/AuthContext';

const defaultDashboardGoals = [
  { title: 'Solve 3 Leetcode questions', targetValue: 3, metric: 'custom', period: 'daily', category: 'coding' },
  { title: 'Study Computer Networks for 2 hours', targetValue: 2, metric: 'custom', period: 'daily', category: 'study' },
  { title: 'Drink 8 glasses of water', targetValue: 8, metric: 'custom', period: 'daily', category: 'health' },
  { title: 'Complete weekly project milestone', targetValue: 1, metric: 'custom', period: 'daily', category: 'project' }
];

const GoalWidget = () => {
  const { isAuthenticated } = useAuth();
  const [goals, setGoals] = useState([]);
  const [progressPct, setProgressPct] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGoalsSummary = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await goalApi.getGoalSummary();
      if (res.success && res.data) {
        if (res.data.goals.length === 0) {
          // Seed starter dashboard goals sequentially
          for (const dg of defaultDashboardGoals) {
            await goalApi.createGoal(dg);
          }
          const reloadRes = await goalApi.getGoalSummary();
          if (reloadRes.success) {
            setGoals(reloadRes.data.goals);
            setProgressPct(reloadRes.data.overallCompletionRate);
          }
        } else {
          setGoals(res.data.goals);
          setProgressPct(res.data.overallCompletionRate);
        }
      }
    } catch (err) {
      console.error('[Dashboard Goals Load Error] Failed to fetch goals summary:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsSummary();
  }, [isAuthenticated]);

  const toggleGoal = async (goal) => {
    // Only manual (custom) goals can be directly updated
    if (goal.metric !== 'custom') return;

    try {
      const nextValue = goal.completed ? 0 : goal.targetValue;
      const res = await goalApi.updateManualProgress(goal.id, nextValue);
      if (res.success) {
        // Refresh summary to update progress bars globally
        const reloadRes = await goalApi.getGoalSummary();
        if (reloadRes.success) {
          setGoals(reloadRes.data.goals);
          setProgressPct(reloadRes.data.overallCompletionRate);
        }
      }
    } catch (err) {
      console.error('[Dashboard Goals Toggle Error] Failed to update manual progress:', err.message);
    }
  };

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Daily Goals</span>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* Progress Bar */}
        <ProgressBar 
          value={progressPct} 
          color="var(--color-primary)" 
          label={`${completedCount} of ${goals.length} completed`} 
          height="6px"
        />

        {/* Goals List */}
        {isLoading && goals.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Loading goals...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {goals.map((goal) => {
              const isManual = goal.metric === 'custom';
              return (
                <div 
                  key={goal.id} 
                  onClick={() => toggleGoal(goal)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--glass-btn-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '0.85rem',
                    cursor: isManual ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    opacity: isManual ? 1 : 0.85
                  }}
                  className={isManual ? "hover-scale" : ""}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: goal.completed ? 'var(--color-success)' : 'var(--text-muted)', display: 'flex' }}>
                      {goal.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </span>
                    <span style={{ 
                      color: goal.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: goal.completed ? 'line-through' : 'none',
                      userSelect: 'none'
                    }}>
                      {goal.title}
                    </span>
                  </div>
                  
                  {/* For automatic or non-binary goals show a progress label */}
                  {goal.targetValue > 1 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {goal.currentValue || 0}/{goal.targetValue}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default GoalWidget;
