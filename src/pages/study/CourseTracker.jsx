import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { Plus, Trash2, CheckSquare, Square, ChevronDown, ChevronUp, Clock, BookOpen } from 'lucide-react';

const CourseTracker = ({ subjects, courses, onAddCourse, onDeleteCourse, onUpdateCourse }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0] ? subjects[0].name : 'General');
  const [estimatedHours, setEstimatedHours] = useState('10');
  const [modulesText, setModulesText] = useState('Intro\nCore Concepts\nPractice Projects\nReview & Test');
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse modules from text input (line by line)
    const modules = modulesText
      .split('\n')
      .map(m => m.trim())
      .filter(m => m.length > 0)
      .map((m, idx) => ({
        id: idx + 1,
        title: m,
        completed: false
      }));

    onAddCourse({
      id: Date.now(),
      title: title.trim(),
      subject,
      estimatedHours: `${estimatedHours} Hrs`,
      modules,
      progress: 0
    });

    setTitle('');
    setModulesText('Intro\nCore Concepts\nPractice Projects\nReview & Test');
    setShowAddForm(false);
  };

  const handleToggleModule = (course, moduleId) => {
    const updatedModules = course.modules.map(mod => {
      if (mod.id === moduleId) {
        return { ...mod, completed: !mod.completed };
      }
      return mod;
    });

    const completedCount = updatedModules.filter(m => m.completed).length;
    const progress = updatedModules.length > 0 
      ? Math.round((completedCount / updatedModules.length) * 100)
      : 0;

    onUpdateCourse({
      ...course,
      modules: updatedModules,
      progress
    });
  };

  const toggleExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          Course & Syllabus Trackers
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
        >
          {showAddForm ? 'Cancel' : 'Register New Course'}
        </Button>
      </div>

      {showAddForm && (
        <Card
          header={
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              🎓 Add Learning Course Syllabus
            </span>
          }
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master React 19 & Next.js"
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Related Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {subjects.map((subj, idx) => (
                    <option key={idx} value={subj.name} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      {subj.name}
                    </option>
                  ))}
                  {subjects.length === 0 && (
                    <option value="General" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>General</option>
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Estimated Completion Time (Hours)</label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                style={{
                  width: '120px',
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
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Course Modules / Lessons (One per line)
              </label>
              <textarea
                placeholder="Module 1: Setup..."
                value={modulesText}
                onChange={(e) => setModulesText(e.target.value)}
                rows={5}
                style={{
                  padding: '10px 12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  resize: 'vertical',
                  lineHeight: '1.4'
                }}
              />
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Create Course Track
            </Button>
          </form>
        </Card>
      )}

      {/* Course Cards */}
      {courses.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '36px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No learning courses setup yet. Use the button to log a new course curriculum.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {courses.map((course) => {
            const isExpanded = expandedCourseId === course.id;
            return (
              <div 
                key={course.id}
                style={{
                  background: 'var(--glass-card-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                {/* Header card view */}
                <div 
                  onClick={() => toggleExpand(course.id)}
                  style={{
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                  className="glass-card-hover"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        color: 'var(--color-primary)', 
                        background: 'var(--glass-btn-bg)', 
                        padding: '6px', 
                        borderRadius: '6px',
                        display: 'flex'
                      }}>
                        <BookOpen size={16} />
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {course.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '34px' }}>
                      <span>Subject: {course.subject}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={12} />
                        {course.estimatedHours}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '150px' }}>
                    {/* Course Progress */}
                    <div style={{ flex: 1 }}>
                      <ProgressBar
                        value={course.progress || 0}
                        color="var(--color-primary)"
                        showLabel={true}
                        label="Course Completion"
                        height="5px"
                      />
                    </div>

                    {/* Expand/Delete icons */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCourse(course.id);
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
                        <Trash2 size={14} />
                      </button>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Checklist details */}
                {isExpanded && (
                  <div style={{
                    padding: '16px',
                    background: 'var(--glass-btn-bg)',
                    borderTop: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Syllabus Checklist ({course.modules.filter(m => m.completed).length}/{course.modules.length} Completed)
                    </span>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '8px'
                    }}>
                      {course.modules.map((mod) => (
                        <div 
                          key={mod.id}
                          onClick={() => handleToggleModule(course, mod.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: 'var(--glass-card-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: mod.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: mod.completed ? 'line-through' : 'none'
                          }}
                          className="hover-scale"
                        >
                          <span style={{ display: 'flex', color: mod.completed ? 'var(--color-success)' : 'var(--text-muted)' }}>
                            {mod.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                          </span>
                          <span>{mod.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseTracker;
