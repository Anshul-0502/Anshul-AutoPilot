import React from 'react';
import { Timeline } from 'lucide-react';
import Card from '../../components/Card';

const TimelineView = ({ selectedDate, events }) => {
  // Filter events matching the selected date
  const dailyEvents = events
    .filter(evt => {
      const evtDate = new Date(evt.date);
      return evtDate.getDate() === selectedDate.getDate() &&
             evtDate.getMonth() === selectedDate.getMonth() &&
             evtDate.getFullYear() === selectedDate.getFullYear();
    })
    .sort((a, b) => {
      const getMinutes = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (hours === 12) hours = 0;
        if (modifier === 'PM') hours += 12;
        return hours * 60 + minutes;
      };
      return getMinutes(a.startTime) - getMinutes(b.startTime);
    });

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClockIcon size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Timeline Flow ({selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })})</span>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '16px', margin: '8px 0' }}>
        {/* The Timeline Line */}
        <div style={{
          position: 'absolute',
          left: '7px',
          top: '6px',
          bottom: '6px',
          width: '2px',
          background: 'var(--glass-border)'
        }} />

        {dailyEvents.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '24px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginLeft: '-16px'
          }}>
            No events scheduled for timeline display.
          </div>
        ) : (
          dailyEvents.map((evt, index) => {
            const catColor = getCategoryColor(evt.category);
            return (
              <div 
                key={evt.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  position: 'relative'
                }}
              >
                {/* Node Bullet */}
                <div style={{
                  position: 'absolute',
                  left: '-14px',
                  top: '5px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: catColor,
                  boxShadow: `0 0 8px ${catColor}`,
                  zIndex: 2
                }} />

                {/* Event Time */}
                <div style={{
                  width: '75px',
                  flexShrink: 0,
                  fontSize: '0.8rem',
                  fontFamily: 'var(--mono)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  paddingTop: '2px'
                }}>
                  {evt.startTime}
                </div>

                {/* Card representation */}
                <div style={{
                  flex: 1,
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{evt.title}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      background: 'var(--glass-card-bg)',
                      border: `1px solid ${catColor}`,
                      color: catColor,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {evt.category}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Runs until {evt.endTime} ({evt.duration} mins duration)
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

// Internal icon wrapper
const ClockIcon = ({ size = 18, style }) => (
  <Timeline size={size} style={style} />
);

export default TimelineView;
