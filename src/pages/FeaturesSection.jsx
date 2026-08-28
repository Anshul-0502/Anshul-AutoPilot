import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, CheckSquare, GraduationCap, Code2, FolderGit2, Gamepad2, BarChart3 } from 'lucide-react';
import Card from '../components/Card';

const featuresData = [
  {
    icon: <LayoutDashboard size={24} style={{ color: 'var(--color-primary)' }} />,
    title: 'Smart Dashboard',
    description: 'Get a comprehensive view of your entire day, upcoming milestones, daily goals, and productivity charts from one central window.'
  },
  {
    icon: <Calendar size={24} style={{ color: 'var(--color-secondary)' }} />,
    title: 'Smart Planner',
    description: 'Structure your calendar with time-blocking grids, daily targets, and custom reminders for classes or focus sessions.'
  },
  {
    icon: <CheckSquare size={24} style={{ color: 'var(--color-success)' }} />,
    title: 'Task Manager',
    description: 'Create and categorize task lists, mark urgency levels, set deadlines, and track your accomplishments on the go.'
  },
  {
    icon: <GraduationCap size={24} style={{ color: 'var(--color-accent)' }} />,
    title: 'Study Hub',
    description: 'Organize subjects, upload study materials, track courses, write notes, and manage your spaced-repetition schedules.'
  },
  {
    icon: <Code2 size={24} style={{ color: 'var(--color-primary)' }} />,
    title: 'Coding Workspace',
    description: 'Track your LeetCode, GfG, and custom DSA practice, log coding durations, and keep your practice streak active.'
  },
  {
    icon: <FolderGit2 size={24} style={{ color: 'var(--color-secondary)' }} />,
    title: 'Project Manager',
    description: 'Break down projects into milestones, link task backlogs, manage documentation, and monitor target deadlines.'
  },
  {
    icon: <Gamepad2 size={24} style={{ color: 'var(--color-accent)' }} />,
    title: 'Skill Arena',
    description: 'Participate in daily quizzes, brain teasers, and coding challenges to test your retention and earn XP rewards.'
  },
  {
    icon: <BarChart3 size={24} style={{ color: 'var(--color-info)' }} />,
    title: 'Productivity Analytics',
    description: 'Gain insights into your study and coding hours, focus levels, and completion rates with modern dashboard charts.'
  }
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const FeaturesSection = () => {
  return (
    <section id="features" className="landing-section">
      <div className="section-header">
        <span style={{
          color: 'var(--color-primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          display: 'block',
          marginBottom: '8px'
        }}>
          Core Modules
        </span>
        <h2>Unified Productivity Suite</h2>
        <p>Anshul AutoPilot brings all the workspace structures a modern developer or student needs under a single ecosystem.</p>
      </div>

      <motion.div 
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {featuresData.map((feat, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card 
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: 'var(--glass-btn-bg)',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--glass-border)'
                  }}>
                    {feat.icon}
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {feat.title}
                  </span>
                </div>
              }
              hoverable={true}
              style={{ height: '100%' }}
            >
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                {feat.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
