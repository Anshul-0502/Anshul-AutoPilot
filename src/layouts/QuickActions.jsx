import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, Timer, Heart, PenTool, X } from 'lucide-react';
import Button from '../components/Button';

const QuickActions = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const actionItems = [
    {
      icon: <CheckSquare size={16} />,
      label: 'Add Task',
      color: 'var(--color-success)',
      onClick: () => handleAction('/tasks')
    },
    {
      icon: <Timer size={16} />,
      label: 'Start Timer',
      color: 'var(--color-secondary)',
      onClick: () => handleAction('/planner')
    },
    {
      icon: <Heart size={16} />,
      label: 'Log Health',
      color: 'var(--color-danger)',
      onClick: () => handleAction('/health')
    },
    {
      icon: <PenTool size={16} />,
      label: 'New Note',
      color: 'var(--color-accent)',
      onClick: () => handleAction('/study')
    }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
      <AnimatePresence>
        {isOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            {actionItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                transition={{ duration: 0.2, delay: (actionItems.length - 1 - index) * 0.05 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  background: 'var(--glass-card-bg)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--glass-shadow)',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  {item.label}
                </span>
                <Button
                  onClick={item.onClick}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    padding: 0,
                    background: 'var(--glass-card-bg)',
                    borderColor: 'var(--glass-border)',
                    boxShadow: 'var(--glass-shadow)',
                    color: item.color
                  }}
                  className="glass-btn"
                >
                  {item.icon}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          padding: 0,
          background: 'var(--color-primary)',
          borderColor: 'var(--color-primary)',
          color: '#ffffff',
          boxShadow: '0 4px 20px var(--color-primary-glow)',
          transform: isOpen ? 'rotate(135deg)' : 'rotate(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </Button>
    </div>
  );
};

export default QuickActions;
