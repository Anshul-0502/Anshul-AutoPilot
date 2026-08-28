import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Trash2, Calendar, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

const ProjectTasks = ({ project, onUpdateProject }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [columnFilter, setColumnFilter] = useState('All');

  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const columns = [
    { id: 'todo', label: 'To Do', color: 'var(--text-muted)' },
    { id: 'in-progress', label: 'In Progress', color: 'var(--color-primary)' },
    { id: 'testing', label: 'Testing', color: 'var(--color-info)' },
    { id: 'done', label: 'Completed', color: 'var(--color-success)' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: desc.trim(),
      priority,
      deadline: deadline || project.deadline,
      status: 'todo',
      subtasks: []
    };

    onUpdateProject({
      ...project,
      tasks: [...(project.tasks || []), newTask]
    });

    setTitle('');
    setDesc('');
    setPriority('Medium');
    setDeadline('');
    setShowAddForm(false);
  };

  const handleDelete = (taskId) => {
    onUpdateProject({
      ...project,
      tasks: project.tasks.filter(t => t.id !== taskId)
    });
  };

  const handleMoveStatus = (task, direction) => {
    const statusSequence = ['todo', 'in-progress', 'testing', 'done'];
    const currentIndex = statusSequence.indexOf(task.status);
    let nextIndex = currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < statusSequence.length) {
      const nextStatus = statusSequence[nextIndex];
      onUpdateProject({
        ...project,
        tasks: project.tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t)
      });
    }
  };

  const getPriorityIcon = (pri) => {
    switch (pri?.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle size={12} style={{ color: 'var(--color-danger)' }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header and Toggle form */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Sprint Scrum Kanban Board
        </h4>

        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ height: '30px', padding: '0 10px', fontSize: '0.8rem' }}
        >
          {showAddForm ? 'Cancel' : 'Create Task'}
        </Button>
      </div>

      {/* Add Task Form overlay */}
      {showAddForm && (
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>➕ Register Sprint Task</span>}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design DB Schema, Write API testing scripts"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {priorities.map(p => (
                    <option key={p} value={p} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Task Description</label>
                <input
                  type="text"
                  placeholder="Brief explanation of scope..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Task Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Add Task
            </Button>
          </form>
        </Card>
      )}

      {/* Kanban columns Grid representation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }} className="kanban-responsive-scroll">
        {columns.map((col) => {
          const colTasks = (project.tasks || []).filter(t => t.status === col.id);

          return (
            <div 
              key={col.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minWidth: '220px',
                background: 'var(--glass-card-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '12px',
                minHeight: '400px'
              }}
            >
              {/* Column header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: col.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: col.color }} />
                  {col.label}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--glass-btn-bg)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task list container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        color: task.priority === 'Critical' || task.priority === 'High' ? 'var(--color-danger)' : 'var(--text-muted)',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        {getPriorityIcon(task.priority)}
                        {task.priority}
                      </span>

                      <button
                        onClick={() => handleDelete(task.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{task.title}</span>
                      {task.description && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{task.description}</p>
                      )}
                    </div>

                    {/* Footer buttons & deadline */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '8px', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Calendar size={10} /> {task.deadline}
                      </span>

                      {/* Direction controls */}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {col.id !== 'todo' && (
                          <button
                            onClick={() => handleMoveStatus(task, -1)}
                            style={{ padding: '2px 4px', border: '1px solid var(--glass-border)', background: 'var(--glass-btn-bg)', color: 'var(--text-secondary)', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}
                          >
                            <ArrowLeft size={10} />
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => handleMoveStatus(task, 1)}
                            style={{ padding: '2px 4px', border: '1px solid var(--glass-border)', background: 'var(--glass-btn-bg)', color: 'var(--text-secondary)', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}
                          >
                            <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', fontSize: '0.75rem', border: '1px dashed var(--glass-border)', borderRadius: '8px', padding: '16px 0', minHeight: '100px' }}>
                    Empty Column
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ProjectTasks;
