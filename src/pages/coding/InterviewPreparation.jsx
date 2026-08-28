import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { CheckSquare, Square, Plus, Trash2, Award, BookOpen } from 'lucide-react';

const InterviewPreparation = ({ topics, onUpdateTopic, onAddTopic, onDeleteTopic }) => {
  const [activeCategory, setActiveCategory] = useState('DSA');
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');

  const categories = ['DSA', 'OOP', 'DBMS', 'OS', 'Computer Networks', 'HR'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTopic({
      id: Date.now(),
      category: activeCategory,
      title: title.trim(),
      completed: false
    });

    setTitle('');
    setShowAddForm(false);
  };

  const handleToggle = (topic) => {
    onUpdateTopic({
      ...topic,
      completed: !topic.completed
    });
  };

  // Filter topics for the active category
  const filteredTopics = topics.filter(t => t.category === activeCategory);
  
  // Calculate completion percentage
  const total = filteredTopics.length;
  const completed = filteredTopics.filter(t => t.completed).length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }} className="prep-responsive-grid">
      
      {/* Left panel: Category switcher & global completion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Category list Card */}
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>CS Prep Categories</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map((cat) => {
              const catTopics = topics.filter(t => t.category === cat);
              const done = catTopics.filter(t => t.completed).length;
              const all = catTopics.length;
              const percent = all > 0 ? Math.round((done / all) * 100) : 0;

              return (
                <div
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setShowAddForm(false);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: activeCategory === cat ? 'var(--color-primary-glow)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    gap: '4px'
                  }}
                  className="hover-scale"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      fontSize: '0.85rem',
                      color: activeCategory === cat ? 'var(--color-primary)' : 'var(--text-secondary)'
                    }}>
                      {cat}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {done}/{all}
                    </span>
                  </div>
                  <ProgressBar value={percent} color={percent === 100 ? 'var(--color-success)' : 'var(--color-primary)'} height="4px" />
                </div>
              );
            })}
          </div>
        </Card>

      </div>

      {/* Right panel: checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Category progress banner */}
        <div style={{
          background: 'var(--glass-card-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>
              {activeCategory} Checklist
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Track critical concepts and questions. Complete all items to achieve master status.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Completed: {completionPercentage}%
            </span>
            <Button 
              variant="glass" 
              size="sm" 
              onClick={() => setShowAddForm(!showAddForm)}
              iconLeft={<Plus size={14} />}
              style={{ height: '28px', padding: '0 8px', fontSize: '0.75rem' }}
            >
              {showAddForm ? 'Cancel' : 'Add Item'}
            </Button>
          </div>
        </div>

        {/* Add item form overlay */}
        {showAddForm && (
          <Card
            header={<span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>➕ Add Topic to {activeCategory}</span>}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '220px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Topic Name / Question</label>
                <input
                  type="text"
                  placeholder="e.g. Normalization 1NF to BCNF, OOP vs Procedural Programming"
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

              <Button type="submit" variant="primary" size="sm" style={{ height: '36px' }}>
                Commit Item
              </Button>
            </form>
          </Card>
        )}

        {/* Checkbox item list */}
        <Card hoverable={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '200px' }}>
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  background: topic.completed ? 'rgba(16, 185, 129, 0.03)' : 'transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => handleToggle(topic)}
                className="hover-opacity"
              >
                {/* Checkbox icon */}
                <span style={{ color: topic.completed ? 'var(--color-success)' : 'var(--text-muted)', display: 'flex', marginRight: '12px' }}>
                  {topic.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                </span>

                {/* Title */}
                <span style={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: topic.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: topic.completed ? 'line-through' : 'none',
                  flex: 1
                }}>
                  {topic.title}
                </span>

                {/* Delete action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTopic(topic.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex'
                  }}
                  className="hover-scale"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}

            {filteredTopics.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', fontSize: '0.85rem', padding: '40px 0' }}>
                <BookOpen size={28} style={{ color: 'var(--color-primary-glow)', marginBottom: '8px' }} />
                <span>No topics logged in {activeCategory}. Click 'Add Item' to start building checklist.</span>
              </div>
            )}
          </div>
        </Card>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .prep-responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewPreparation;
