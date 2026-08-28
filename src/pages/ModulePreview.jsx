import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, CheckSquare, BookOpen, Code, FolderKanban, Award, BarChart4, HeartPulse, Settings } from 'lucide-react';
import Card from '../components/Card';

const modulesData = [
  {
    icon: <LayoutDashboard size={20} />,
    title: 'Dashboard',
    path: '/dashboard',
    desc: 'Daily summary and widgets board.'
  },
  {
    icon: <Calendar size={20} />,
    title: 'Planner',
    path: '/planner',
    desc: 'Calendars, timeblocks & agendas.'
  },
  {
    icon: <CheckSquare size={20} />,
    title: 'Tasks',
    path: '/tasks',
    desc: 'Category task boards & items.'
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Study Hub',
    path: '/study',
    desc: 'Courses, documents & flashcards.'
  },
  {
    icon: <Code size={20} />,
    title: 'Coding',
    path: '/coding',
    desc: 'DSA problem lists & stopwatch.'
  },
  {
    icon: <FolderKanban size={20} />,
    title: 'Projects',
    path: '/projects',
    desc: 'Milestones & backlog pipelines.'
  },
  {
    icon: <Award size={20} />,
    title: 'Skill Arena',
    path: '/games',
    desc: 'Quizzes & daily coding challenges.'
  },
  {
    icon: <BarChart4 size={20} />,
    title: 'Analytics',
    path: '/analytics',
    desc: 'Study graphs & focus efficiency.'
  },
  {
    icon: <HeartPulse size={20} />,
    title: 'Health',
    path: '/health',
    desc: 'Sleep logs, water logs & habits.'
  },
  {
    icon: <Settings size={20} />,
    title: 'Settings',
    path: '/settings',
    desc: 'Profiles, themes & system preferences.'
  }
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

const ModulePreview = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-section" style={{ borderTop: '1px solid var(--glass-border)', background: 'rgba(99, 102, 241, 0.01)' }}>
      <div className="section-header">
        <span style={{
          color: 'var(--color-secondary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          display: 'block',
          marginBottom: '8px'
        }}>
          Direct Access
        </span>
        <h2>Module Quick Launcher</h2>
        <p>Launch any active module directly from here or enter the general dashboard layout.</p>
      </div>

      <motion.div 
        className="module-preview-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {modulesData.map((mod, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card
              hoverable={true}
              onClick={() => navigate(mod.path)}
              style={{
                textAlign: 'center',
                padding: '24px 16px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                color: 'var(--color-primary)',
                background: 'var(--glass-btn-bg)',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--glass-border)'
              }}>
                {mod.icon}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{mod.title}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{mod.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ModulePreview;
