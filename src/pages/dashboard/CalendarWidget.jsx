import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../components/Card';

const CalendarWidget = ({ calendar = {} }) => {
  const navigate = useNavigate();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  const currentMonthName = today.toLocaleString('default', { month: 'long' });

  // Generate calendar dates dynamically for the current month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon ...
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const calendarCells = [];
  const eventDays = new Set(calendar.eventDays || []);

  // 1. Previous month padding
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthTotalDays - i,
      isCurrentMonth: false,
      hasEvent: false
    });
  }

  // 2. Current month days
  for (let i = 1; i <= totalDays; i++) {
    const isToday = i === today.getDate();
    calendarCells.push({
      day: i,
      isCurrentMonth: true,
      isToday,
      hasEvent: eventDays.has(i)
    });
  }

  // 3. Next month padding to fill out a grid of 42 cells (6 rows)
  const remaining = 42 - calendarCells.length;
  for (let i = 1; i <= remaining; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      hasEvent: false
    });
  }

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarRange size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Calendar</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ChevronLeft size={16} style={{ color: 'var(--text-muted)', cursor: 'default' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', padding: '0 4px', minWidth: '80px', textAlign: 'center' }}>
              {currentMonthName} {currentYear}
            </span>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)', cursor: 'default' }} />
          </div>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div 
        onClick={() => navigate('/planner')}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', cursor: 'pointer' }}
      >
        {/* Days of week row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          marginBottom: '4px'
        }}>
          {daysOfWeek.map((day, idx) => (
            <span key={idx}>{day}</span>
          ))}
        </div>

        {/* Grid cells */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          textAlign: 'center'
        }}>
          {calendarCells.map((cell, idx) => {
            const cellBg = cell.isToday 
              ? 'var(--color-primary)' 
              : 'transparent';
            const cellColor = cell.isToday
              ? '#ffffff'
              : cell.isCurrentMonth
                ? 'var(--text-primary)'
                : 'var(--text-muted)';
            const borderStyle = cell.isToday
              ? 'none'
              : cell.hasEvent
                ? '1px solid var(--color-primary)'
                : 'none';

            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '26px',
                  borderRadius: '6px',
                  background: cellBg,
                  color: cellColor,
                  fontSize: '0.8rem',
                  fontWeight: cell.isToday || cell.hasEvent ? '600' : '400',
                  border: borderStyle,
                  position: 'relative'
                }}
              >
                <span>{cell.day}</span>
                {/* Event Dot */}
                {cell.hasEvent && !cell.isToday && (
                  <span style={{
                    position: 'absolute',
                    bottom: '2px',
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default CalendarWidget;
