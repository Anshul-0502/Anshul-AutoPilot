import React from 'react';
import Card from '../../components/Card';

const WeeklyPlanner = ({ selectedDate, setSelectedDate, events }) => {
  // Find start of the week (Sunday)
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(selectedDate);

  // Generate weekday headers and matching dates
  const weekdays = [];
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(startOfWeek);
    nextDay.setDate(startOfWeek.getDate() + i);
    weekdays.push({
      name: weekdayNames[i],
      date: nextDay
    });
  }

  // Filter events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(evt => {
      const evtDate = new Date(evt.date);
      return evtDate.getDate() === date.getDate() &&
             evtDate.getMonth() === date.getMonth() &&
             evtDate.getFullYear() === date.getFullYear();
    });
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'study': return 'var(--color-primary)';
      case 'coding': return 'var(--color-success)';
      case 'project': return 'var(--color-secondary)';
      case 'break': return 'var(--color-accent)';
      case 'meeting': return 'var(--color-danger)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Weekly Grid View
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Week of {startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      }
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '12px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {weekdays.map((day, idx) => {
          const dayEvents = getEventsForDate(day.date);
          const active = isSameDay(day.date, selectedDate);
          
          return (
            <div 
              key={idx}
              onClick={() => setSelectedDate(day.date)}
              style={{
                background: active ? 'rgba(79, 70, 229, 0.04)' : 'var(--glass-btn-bg)',
                border: active ? '1.5px solid var(--color-primary)' : '1px solid var(--glass-border)',
                borderRadius: '10px',
                padding: '12px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                minHeight: '180px',
                transition: 'all 0.25s ease'
              }}
              className="hover-scale"
            >
              {/* Day Header */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  display: 'block'
                }}>
                  {day.name}
                </span>
                <span style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 700,
                  color: active ? 'var(--color-primary)' : 'var(--text-primary)',
                  display: 'block',
                  marginTop: '2px'
                }}>
                  {day.date.getDate()}
                </span>
              </div>

              {/* Event Tags inside Column */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px', 
                width: '100%',
                flex: 1,
                overflowY: 'auto'
              }}>
                {dayEvents.map(evt => (
                  <div 
                    key={evt.id}
                    style={{
                      background: 'var(--glass-card-bg)',
                      borderLeft: `3px solid ${getCategoryColor(evt.category)}`,
                      padding: '4px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      boxShadow: 'var(--glass-shadow)'
                    }}
                    title={evt.title}
                  >
                    {evt.startTime.split(' ')[0]} - {evt.title}
                  </div>
                ))}
                
                {dayEvents.length === 0 && (
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    marginTop: '20px',
                    fontStyle: 'italic'
                  }}>
                    Free
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        /* Responsive adjustments for weekly planner */
        @media (max-width: 900px) {
          .weekly-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </Card>
  );
};

export default WeeklyPlanner;
