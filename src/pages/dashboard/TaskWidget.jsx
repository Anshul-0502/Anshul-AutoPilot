import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight, ClipboardList } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { TaskContext } from '../../contexts/TaskContext';

const TaskWidget = () => {
  const navigate = useNavigate();
  const { tasks, toggleCompleteTask } = useContext(TaskContext);

  // Compute live statistics dynamically
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const highPriorityCount = tasks.filter(t => !t.completed && (t.priority === 'High' || t.priority === 'Critical')).length;

  const taskStats = [
    { label: 'Pending', count: pendingCount, color: 'var(--color-primary)', icon: <Clock size={16} /> },
    { label: 'Completed', count: completedCount, color: 'var(--color-success)', icon: <CheckCircle2 size={16} /> },
    { label: 'High Priority', count: highPriorityCount, color: 'var(--color-accent)', icon: <AlertTriangle size={16} /> },
  ];

  // Get the most recent 3 tasks to display
  const recentTasks = tasks.slice(0, 3);

  return (
    <Card 
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Today's Tasks</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => navigate('/tasks')}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            Manage
          </Button>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {taskStats.map((stat, i) => (
            <div 
              key={i} 
              style={{
                background: 'var(--glass-btn-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                {stat.count}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Task List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Recent List
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentTasks.map((task) => (
              <div 
                key={task.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--glass-btn-bg)',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => toggleCompleteTask(task.id)}
                    style={{ 
                      accentColor: 'var(--color-primary)', 
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }} 
                  />
                  <span style={{ 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {task.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {task.priority === 'High' && !task.completed && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: 'var(--color-primary-glow)', 
                      color: 'var(--color-primary)', 
                      padding: '1px 6px', 
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      High
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {task.deadline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />
        
        <div 
          onClick={() => navigate('/tasks')}
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
          <span>View all tasks</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Card>
  );
};

export default TaskWidget;
