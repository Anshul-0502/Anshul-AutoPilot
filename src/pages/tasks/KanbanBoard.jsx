import React from 'react';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onToggleComplete, onDelete, onUpdate, onEditClick }) => {
  const columns = [
    { id: 'todo', label: 'To Do', color: 'var(--color-primary)' },
    { id: 'in-progress', label: 'In Progress', color: 'var(--color-secondary)' },
    { id: 'review', label: 'In Review', color: 'var(--color-accent)' },
    { id: 'done', label: 'Done', color: 'var(--color-success)' }
  ];

  // Helper to map task completion/custom state to Kanban status
  const getTaskStatus = (task) => {
    if (task.completed) return 'done';
    return task.status || 'todo';
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, statusId) => {
    e.preventDefault();
    const taskId = Number(e.dataTransfer.getData('text/plain'));
    if (!taskId) return;

    const matchedTask = tasks.find(t => t.id === taskId);
    if (matchedTask) {
      onUpdate({
        ...matchedTask,
        status: statusId,
        completed: statusId === 'done'
      });
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      width: '100%',
      boxSizing: 'border-box'
    }} className="kanban-grid">
      {columns.map((col) => {
        const colTasks = tasks.filter(t => getTaskStatus(t) === col.id);

        return (
          <div 
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            style={{
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minHeight: '400px'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `2px solid ${col.color}`,
              paddingBottom: '8px',
              marginBottom: '4px'
            }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {col.label}
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--mono)',
                background: 'var(--glass-border)',
                padding: '2px 8px',
                borderRadius: '9999px',
                color: 'var(--text-secondary)',
                fontWeight: 600
              }}>
                {colTasks.length}
              </span>
            </div>

            {/* Task list inside Column */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              flex: 1,
              overflowY: 'auto'
            }}>
              {colTasks.map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  style={{ cursor: 'grab' }}
                >
                  <TaskCard 
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onEditClick={onEditClick}
                  />
                </div>
              ))}

              {colTasks.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '30px 10px',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  border: '1px dashed var(--glass-border)',
                  borderRadius: '8px',
                  marginTop: '10px'
                }}>
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        @media (max-width: 1024px) {
          .kanban-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .kanban-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default KanbanBoard;
