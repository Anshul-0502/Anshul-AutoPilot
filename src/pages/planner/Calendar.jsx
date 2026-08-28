import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../components/Card';

const Calendar = ({ selectedDate, setSelectedDate, events }) => {
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Array of month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days of week header
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigate to previous month
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    const prev = new Date(currentYear, currentMonth - 1, 1);
    setSelectedDate(prev);
  };

  // Navigate to next month
  const handleNextMonth = (e) => {
    e.stopPropagation();
    const next = new Date(currentYear, currentMonth + 1, 1);
    setSelectedDate(next);
  };

  // Get number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get start day of the week for the month (0 = Sunday, etc.)
  const getStartDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDayOfMonth(currentYear, currentMonth);

  // Get previous month dates for padding
  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonthIndex);

  const cells = [];

  // Padding cells from previous month
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(prevMonthYear, prevMonthIndex, daysInPrevMonth - i)
    });
  }

  // Current month cells
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, i)
    });
  }

  // Next month cells for padding to make 6 rows (42 cells total)
  const remainingCells = 42 - cells.length;
  const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(nextMonthYear, nextMonthIndex, i)
    });
  }

  // Helper to check if a calendar date has events
  const dateHasEvents = (date) => {
    return events.some(evt => {
      const evtDate = new Date(evt.date);
      return evtDate.getDate() === date.getDate() &&
             evtDate.getMonth() === date.getMonth() &&
             evtDate.getFullYear() === date.getFullYear();
    });
  };

  // Helper to check if a date is today
  const isTodayDate = (date) => {
    const today = new Date();
    return today.getDate() === date.getDate() &&
           today.getMonth() === date.getMonth() &&
           today.getFullYear() === date.getFullYear();
  };

  // Helper to check if date is selected
  const isSelectedDate = (date) => {
    return selectedDate.getDate() === date.getDate() &&
           selectedDate.getMonth() === date.getMonth() &&
           selectedDate.getFullYear() === date.getFullYear();
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Calendar Picker
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={handlePrevMonth}
              style={{
                background: 'var(--glass-btn-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
              className="glass-btn"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: '95px', textAlign: 'center' }}>
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button 
              onClick={handleNextMonth}
              style={{
                background: 'var(--glass-btn-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
              className="glass-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Days of week row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--text-muted)'
        }}>
          {daysOfWeek.map((day, idx) => (
            <span key={idx}>{day}</span>
          ))}
        </div>

        {/* Date Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
          textAlign: 'center'
        }}>
          {cells.map((cell, idx) => {
            const active = isSelectedDate(cell.date);
            const today = isTodayDate(cell.date);
            const hasEvent = dateHasEvents(cell.date);

            const cellBg = active 
              ? 'var(--color-primary)' 
              : today
                ? 'var(--color-primary-glow)'
                : 'transparent';

            const cellColor = active
              ? '#ffffff'
              : cell.isCurrentMonth
                ? 'var(--text-primary)'
                : 'var(--text-muted)';

            const borderStyle = active
              ? 'none'
              : today
                ? '1px solid var(--color-primary)'
                : 'none';

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(cell.date)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '32px',
                  borderRadius: '6px',
                  background: cellBg,
                  color: cellColor,
                  fontSize: '0.85rem',
                  fontWeight: active || today || hasEvent ? '600' : '400',
                  border: borderStyle,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
                className="hover-scale"
              >
                <span>{cell.day}</span>
                {/* Event Dot */}
                {hasEvent && !active && (
                  <span style={{
                    position: 'absolute',
                    bottom: '3px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: today ? 'var(--color-primary)' : 'var(--color-secondary)'
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

export default Calendar;
