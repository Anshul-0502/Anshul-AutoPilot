import React from 'react';
import { Filter, Star, ClipboardList, CheckCircle } from 'lucide-react';

const TaskFilters = ({ selectedCategory, setSelectedCategory, selectedPriority, setSelectedPriority, activeTab, setActiveTab }) => {
  const categories = ['All', 'Study', 'Coding', 'Projects', 'College', 'Personal', 'Others'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const tabs = [
    { value: 'all', label: 'All Tasks', icon: <ClipboardList size={14} /> },
    { value: 'active', label: 'Active', icon: <Star size={14} style={{ color: 'var(--color-accent)' }} /> },
    { value: 'completed', label: 'Completed', icon: <CheckCircle size={14} style={{ color: 'var(--color-success)' }} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Task Status Tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--glass-btn-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        padding: '2px',
        alignSelf: 'flex-start',
        gap: '2px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === tab.value ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.value ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={12} />
          Filter by Category
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: active ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  background: active ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                  color: active ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="hover-scale"
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={12} />
          Filter by Priority
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {priorities.map((prio) => {
            const active = selectedPriority === prio;
            return (
              <button
                key={prio}
                onClick={() => setSelectedPriority(prio)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: active ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  background: active ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                  color: active ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="hover-scale"
              >
                {prio}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
