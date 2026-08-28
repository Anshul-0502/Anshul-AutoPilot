import React, { useState, useContext } from 'react';
import TaskFilters from './tasks/TaskFilters';
import TaskSearch from './tasks/TaskSearch';
import TaskCard from './tasks/TaskCard';
import TaskForm from './tasks/TaskForm';
import KanbanBoard from './tasks/KanbanBoard';
import TaskStatistics from './tasks/TaskStatistics';
import Button from '../components/Button';
import { Plus, List, Kanban, ShieldAlert } from 'lucide-react';
import { TaskContext } from '../contexts/TaskContext';

const Tasks = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleCompleteTask
  } = useContext(TaskContext);

  // UI state controllers
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter controllers
  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'

  // CRUD actions
  const handleCreateOrUpdate = (taskData) => {
    if (taskData.id) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleToggleComplete = (id) => {
    toggleCompleteTask(id);
  };

  const handleDelete = (id) => {
    deleteTask(id);
  };

  const handleUpdate = (updatedTask) => {
    updateTask(updatedTask);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Priority sort mapping rules
  const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };

  // Filter & Search pipeline
  const filteredTasks = tasks
    .filter(task => {
      // Search match
      const titleMatch = task.title.toLowerCase().includes(searchVal.toLowerCase());
      const descMatch = task.description?.toLowerCase().includes(searchVal.toLowerCase()) || false;
      if (!titleMatch && !descMatch) return false;

      // Status match
      if (activeTab === 'active' && task.completed) return false;
      if (activeTab === 'completed' && !task.completed) return false;

      // Category match
      if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;

      // Priority match
      if (selectedPriority !== 'All' && task.priority !== selectedPriority) return false;

      return true;
    })
    .sort((a, b) => {
      // Sort critical items to the top, completed to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      const weightA = priorityWeight[a.priority.toLowerCase()] || 0;
      const weightB = priorityWeight[b.priority.toLowerCase()] || 0;
      return weightB - weightA;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Upper header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Tasks Cockpit
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Track details, priority labels, subtask lists, and progress metrics.
          </p>
        </div>

        {/* View Mode controls & Add task */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '2px',
            gap: '2px'
          }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <List size={14} />
              <span className="view-mode-text">List View</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'kanban' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'kanban' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <Kanban size={14} />
              <span className="view-mode-text">Kanban</span>
            </button>
          </div>

          <Button 
            variant="primary" 
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }} 
            iconLeft={<Plus size={16} />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Main split grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showForm ? '320px 1fr 340px' : '320px 1fr',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }} className="tasks-split-layout">
        
        {/* Column 1: Filters & Statistics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="tasks-sidebar">
          <TaskStatistics tasks={tasks} />
          <div style={{
            background: 'var(--glass-card-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: 'var(--glass-shadow)'
          }}>
            <TaskFilters 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory}
              selectedPriority={selectedPriority} 
              setSelectedPriority={setSelectedPriority}
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        {/* Column 2: Search bar + Cards representation list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="tasks-viewport">
          <TaskSearch searchVal={searchVal} setSearchVal={setSearchVal} />

          {viewMode === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onEditClick={handleEditClick}
                />
              ))}

              {filteredTasks.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  border: '1px dashed var(--glass-border)',
                  borderRadius: '12px'
                }}>
                  No tasks found matching your filter rules.
                </div>
              )}
            </div>
          ) : (
            <KanbanBoard 
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onEditClick={handleEditClick}
            />
          )}
        </div>

        {/* Column 3 (Optional overlay panel for edit/create) */}
        {showForm && (
          <div className="tasks-form-panel">
            <TaskForm 
              onSubmit={handleCreateOrUpdate}
              editTask={editingTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .tasks-split-layout {
            grid-template-columns: 1fr !important;
          }
          .tasks-sidebar {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 768px) {
          .tasks-sidebar {
            grid-template-columns: 1fr !important;
          }
          .view-mode-text {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Tasks;

