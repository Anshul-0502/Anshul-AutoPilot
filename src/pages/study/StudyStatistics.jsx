import React from 'react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Flame, Clock, BookOpen, FileText, CheckCircle, Award } from 'lucide-react';

const StudyStatistics = ({ subjects, notes, pdfs, resources, courses, sessions }) => {
  // 1. Calculate stats
  const totalStudySeconds = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const totalHours = (totalStudySeconds / 3600).toFixed(1);
  
  const notesCount = notes.length;
  const pdfsCount = pdfs.length;
  const resourcesCount = resources.length;
  
  // Calculate average course completion
  const courseCount = courses.length;
  const avgCourseCompletion = courseCount > 0 
    ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courseCount)
    : 0;

  // 2. Aggregate subject study hours
  const subjectHoursData = subjects.map(subj => {
    const subjSessions = sessions.filter(s => s.subject.toLowerCase() === subj.name.toLowerCase());
    const seconds = subjSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
    const hrs = parseFloat((seconds / 3600).toFixed(2));
    
    let chartColor = 'var(--color-primary)';
    if (subj.color === 'green') chartColor = 'var(--color-success)';
    if (subj.color === 'blue') chartColor = 'var(--color-secondary)';
    if (subj.color === 'amber') chartColor = 'var(--color-accent)';
    if (subj.color === 'red') chartColor = 'var(--color-danger)';

    return {
      name: subj.name,
      hours: hrs,
      color: chartColor
    };
  }).filter(d => d.hours > 0);

  // Fallback data if no sessions logged yet
  const chartData = subjectHoursData.length > 0 ? subjectHoursData : [
    { name: 'Computer Networks', hours: 2.5, color: 'var(--color-primary)' },
    { name: 'Operating Systems', hours: 1.2, color: 'var(--color-secondary)' },
    { name: 'Mathematics III', hours: 3.0, color: 'var(--color-accent)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {/* Streak */}
        <Card hoverable={true} style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              background: 'var(--color-primary-glow)', 
              color: 'var(--color-accent)', 
              padding: '10px', 
              borderRadius: '8px',
              display: 'flex'
            }}>
              <Flame size={20} style={{ fill: 'currentColor' }} />
            </span>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Study Streak</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>5 Days</span>
            </div>
          </div>
        </Card>

        {/* Total Time */}
        <Card hoverable={true} style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              background: 'var(--color-primary-glow)', 
              color: 'var(--color-primary)', 
              padding: '10px', 
              borderRadius: '8px',
              display: 'flex'
            }}>
              <Clock size={20} />
            </span>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Study Hours</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalHours} Hrs</span>
            </div>
          </div>
        </Card>

        {/* Notes & Resources count */}
        <Card hoverable={true} style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              background: 'var(--color-primary-glow)', 
              color: 'var(--color-secondary)', 
              padding: '10px', 
              borderRadius: '8px',
              display: 'flex'
            }}>
              <FileText size={20} />
            </span>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Study Materials</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {notesCount} Notes / {resourcesCount} Links
              </span>
            </div>
          </div>
        </Card>

        {/* Courses & PDFs */}
        <Card hoverable={true} style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              background: 'var(--color-primary-glow)', 
              color: 'var(--color-success)', 
              padding: '10px', 
              borderRadius: '8px',
              display: 'flex'
            }}>
              <BookOpen size={20} />
            </span>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Books / Courses</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {pdfsCount} PDFs / {courseCount} Courses
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Recharts chart card */}
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Subject-wise Study Time (Hours)</span>
              {subjectHoursData.length === 0 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--glass-btn-bg)', padding: '2px 8px', borderRadius: '4px' }}>Showing Sample Data</span>}
            </div>
          }
          hoverable={false}
        >
          <div style={{ width: '100%', height: '240px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem'
                  }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]} barSize={35}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spacing & Quality metrics */}
        <Card
          header={<span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Syllabus & Material Progress</span>}
          hoverable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'center' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Average Course Completion</span>
                <span style={{ fontWeight: 600 }}>{avgCourseCompletion}%</span>
              </div>
              <ProgressBar value={avgCourseCompletion} color="var(--color-primary)" height="6px" />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>PDF Reading Progress</span>
                <span style={{ fontWeight: 600 }}>
                  {pdfs.length > 0 ? Math.round(pdfs.reduce((acc, p) => acc + (p.currentPage/p.totalPages), 0) / pdfs.length * 100) : 0}%
                </span>
              </div>
              <ProgressBar 
                value={pdfs.length > 0 ? Math.round(pdfs.reduce((acc, p) => acc + (p.currentPage/p.totalPages), 0) / pdfs.length * 100) : 0} 
                color="var(--color-success)" 
                height="6px" 
              />
            </div>

            {/* Achievement / Goal card */}
            <div style={{
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '4px'
            }}>
              <Award size={20} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>Daily Study Goal Achieved</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Keep up the good work. You are on track to master Networks this week.</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudyStatistics;
