import React, { useState } from 'react';
import { Calendar, AlertCircle, Edit2, Trash2, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import Card from '../../components/Card';
import SubtaskList from './SubtaskList';

const TaskCard = ({ task, onToggleComplete, onDelete, onUpdate, onEditClick }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);

  const getPriorityStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return { color: 'var(--color-danger)', bg: 'rgba(239, 68, 68, 0.1)', text: 'Critical' };
      case 'high':
        return { color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)', text: 'High' };
      case 'medium':
        return { color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.1)', text: 'Medium' };
      default:
        return { color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)', text: 'Low' };
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'study': return 'var(--color-primary)';
      case 'coding': return 'var(--color-success)';
      case 'projects': return 'var(--color-secondary)';
      case 'personal': return 'var(--color-accent)';
      default: return 'var(--text-muted)';
    }
  };

  const pStyle = getPriorityStyle(task.priority);
  const catColor = getCategoryColor(task.category);

  // Calculate completed subtasks
  const subtasksCount = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasksCount = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;

  const handleSubtasksChange = (updatedSubtasks) => {
    onUpdate({
      ...task,
      subtasks: updatedSubtasks
    });
  };

  return (
    <Card 
      hoverable={true}
      style={{
        padding: '14px',
        borderLeft: `4px solid ${pStyle.color}`,
        background: task.completed ? 'rgba(10, 15, 29, 0.2)' : 'var(--glass-card-bg)',
        opacity: task.completed ? 0.75 : 1,
        transition: 'all 0.25s ease'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Row 1: Checkbox + Title + Edit/Delete */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', overflow: 'hidden' }}>
            <span 
              onClick={() => onToggleComplete(task.id)}
              style={{ color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', marginTop: '3px' }}
            >
              {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
              <span style={{ 
                fontSize: '0.95rem',
                fontWeight: 600,
                color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: task.completed ? 'line-through' : 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {task.title}
              </span>
              {task.description && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {task.description}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <button 
              onClick={() => onEditClick(task)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              className="hover-scale"
            >
              <Edit2 size={12} />
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              className="hover-scale"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Row 2: Badges (Priority, Category, Deadline) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '0.75rem' }}>
          {/* Priority */}
          <span style={{ 
            color: pStyle.color, 
            background: pStyle.bg, 
            padding: '2px 8px', 
            borderRadius: '4px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <AlertCircle size={10} />
            {pStyle.text}
          </span>

          {/* Category */}
          <span style={{ 
            color: catColor, 
            background: 'var(--glass-btn-bg)', 
            border: `1px solid ${catColor}33`,
            padding: '1px 8px', 
            borderRadius: '4px',
            fontWeight: 500
          }}>
            {task.category}
          </span>

          {/* Deadline */}
          {task.deadline && (
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} />
              {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Row 3: Subtask count & toggle */}
        {subtasksCount > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <span 
              onClick={() => setShowSubtasks(!showSubtasks)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', userSelect: 'none' }}
            >
              {showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span>Subtasks ({completedSubtasksCount}/{subtasksCount})</span>
            </span>

            {/* Simple progress metric */}
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
              {Math.round((completedSubtasksCount / subtasksCount) * 100)}% done
            </span>
          </div>
        )}

        {/* Subtask list panel expanded */}
        {showSubtasks && subtasksCount > 0 && (
          <div style={{ marginTop: '4px' }}>
            <SubtaskList 
              subtasks={task.subtasks} 
              onChange={handleSubtasksChange} 
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
