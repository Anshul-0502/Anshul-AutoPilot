import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, CupSoda, Moon, ShieldAlert, ArrowRight, Plus, Minus } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import healthApi from '../../services/api/healthApi';

const HealthWidget = ({ health = {} }) => {
  const navigate = useNavigate();

  const targetWater = health.waterGoal || 8;
  const [waterGlasses, setWaterGlasses] = useState(health.waterIntake || 0);

  useEffect(() => {
    setWaterGlasses(health.waterIntake || 0);
  }, [health.waterIntake]);

  const incrementWater = async (e) => {
    e.stopPropagation();
    try {
      const nextGlasses = waterGlasses + 1;
      if (nextGlasses > 12) return;
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.updateWaterIntake(nextGlasses, todayStr);
      if (res.success) {
        setWaterGlasses(nextGlasses);
      }
    } catch (err) {
      console.error('[HealthWidget incrementWater] Failed:', err.message);
    }
  };

  const decrementWater = async (e) => {
    e.stopPropagation();
    try {
      if (waterGlasses <= 0) return;
      const nextGlasses = waterGlasses - 1;
      const todayStr = new Date().toISOString().split('T')[0];
      const res = await healthApi.updateWaterIntake(nextGlasses, todayStr);
      if (res.success) {
        setWaterGlasses(nextGlasses);
      }
    } catch (err) {
      console.error('[HealthWidget decrementWater] Failed:', err.message);
    }
  };

  const sleepHours = health.sleepDuration || 0;
  const habitsCompleted = health.habitsCompleted || 0;
  const habitsTotal = health.habitsTotal || 0;

  return (
    <Card
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} style={{ color: 'var(--color-danger)' }} />
            <span>Health & Habits</span>
          </div>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => navigate('/health')}
            style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
          >
            Health Hub
          </Button>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
        {/* Sleep and Habits summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Moon size={18} style={{ color: 'var(--color-secondary)' }} />
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>SLEEP</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {sleepHours} Hrs
              </span>
            </div>
          </div>
          <div style={{
            background: 'var(--glass-btn-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CupSoda size={18} style={{ color: 'var(--color-success)' }} />
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>HABITS</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {habitsCompleted}/{habitsTotal} Done
              </span>
            </div>
          </div>
        </div>

        {/* Water Tracker (Interactive) */}
        <div style={{
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>WATER INTAKE</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                {waterGlasses} / {targetWater} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>glasses</span>
              </span>
            </div>
            
            {/* Plus/Minus Buttons */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={decrementWater}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-card-bg)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="glass-btn"
              >
                <Minus size={12} />
              </button>
              <button 
                onClick={incrementWater}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-card-bg)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="glass-btn"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          <ProgressBar 
            value={waterGlasses} 
            max={targetWater} 
            color="var(--color-secondary)" 
            showLabel={false}
            height="5px"
          />
        </div>

        {/* Health Tip */}
        <div style={{
          background: 'var(--glass-btn-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)'
        }}>
          <ShieldAlert size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <span>Hydrate regularly to maintain peak focus!</span>
        </div>

        <div style={{ flex: 1 }} />

        <div 
          onClick={() => navigate('/health')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            fontSize: '0.85rem', 
            color: 'var(--color-danger)', 
            cursor: 'pointer',
            fontWeight: 500,
            padding: '4px 0'
          }}
          className="hover-scale"
        >
          <span>Open health tracking</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Card>
  );
};

export default HealthWidget;
