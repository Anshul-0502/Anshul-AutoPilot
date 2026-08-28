import React from 'react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { BookOpen, Star } from 'lucide-react';

const SubjectCard = ({ subject, notesCount, onClick }) => {
  const getSubjectColor = (colorName) => {
    switch (colorName?.toLowerCase()) {
      case 'purple': return 'var(--color-primary)';
      case 'green': return 'var(--color-success)';
      case 'blue': return 'var(--color-secondary)';
      case 'amber': return 'var(--color-accent)';
      case 'red': return 'var(--color-danger)';
      default: return 'var(--text-muted)';
    }
  };

  const activeColor = getSubjectColor(subject.color);

  return (
    <Card 
      onClick={onClick}
      hoverable={true}
      style={{
        borderLeft: `5px solid ${activeColor}`,
        cursor: 'pointer',
        padding: '16px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Row 1: Icon/Subject Name */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              color: activeColor, 
              background: 'var(--glass-btn-bg)', 
              padding: '6px', 
              borderRadius: '6px',
              display: 'flex'
            }}>
              <BookOpen size={16} />
            </span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
              {subject.name}
            </span>
          </div>
          {subject.favorite && (
            <Star size={14} style={{ color: 'var(--color-accent)', fill: 'var(--color-accent)' }} />
          )}
        </div>

        {/* Description */}
        {subject.description && (
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {subject.description}
          </p>
        )}

        {/* Notes count & stats */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{notesCount || 0} Written Notes</span>
          <span>•</span>
          <span>{subject.studyGoal || '2h'} Study Goal</span>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          value={subject.progress || 0}
          color={activeColor}
          showLabel={true}
          label="Syllabus Progress"
          height="5px"
        />
      </div>
    </Card>
  );
};

export default SubjectCard;
