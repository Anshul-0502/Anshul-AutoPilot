import React from 'react';
import { ListTodo } from 'lucide-react';
import Card from '../../components/Card';

const AgendaView = ({ events }) => {
  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group events by date string
  const groupEventsByDate = () => {
    const groups = {};
    sortedEvents.forEach(evt => {
      const dateStr = new Date(evt.date).toDateString();
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(evt);
    });
    return groups;
  };

  const grouped = groupEventsByDate();
  const dateKeys = Object.keys(grouped);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'study': return 'var(--color-primary)';
      case 'coding': return 'var(--color-success)';
      case 'project': return 'var(--color-secondary)';
      case 'break': return 'var(--color-accent)';
      case 'meeting': return 'var(--color-danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ListTodo size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Agenda Schedule List</span>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {dateKeys.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            Agenda list is empty. Add events to start tracking schedules.
          </div>
        ) : (
          dateKeys.map((dateStr, idx) => {
            const dateObj = new Date(dateStr);
            const isToday = new Date().toDateString() === dateStr;

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Date Header Group */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--glass-border)',
                  paddingBottom: '4px'
                }}>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 700, 
                    color: isToday ? 'var(--color-primary)' : 'var(--text-primary)' 
                  }}>
                    {dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                  {isToday && (
                    <span style={{
                      fontSize: '0.75rem',
                      background: 'var(--color-primary-glow)',
                      color: 'var(--color-primary)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      Today
                    </span>
                  )}
                </div>

                {/* Date Events List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {grouped[dateStr].map(evt => (
                    <div 
                      key={evt.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--glass-btn-bg)',
                        borderLeft: `3px solid ${getCategoryColor(evt.category)}`,
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{evt.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Category: {evt.category.charAt(0).toUpperCase() + evt.category.slice(1)}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {evt.startTime} - {evt.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default AgendaView;
