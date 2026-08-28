import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Moon, Clock, Award, CheckCircle } from 'lucide-react';
import { LineChart } from '../analytics/Charts';

const SleepTracker = ({ sleepTime = '23:00', wakeTime = '07:00', quality = 80, history = [], onLogSleep }) => {
  const [sTime, setSTime] = useState(sleepTime);
  const [wTime, setWTime] = useState(wakeTime);
  const [sQuality, setSQuality] = useState(quality);
  const [loggedToday, setLoggedToday] = useState(false);

  // Compute duration overnight
  const calculateDuration = () => {
    try {
      const [shour, smin] = sTime.split(':').map(Number);
      const [whour, wmin] = wTime.split(':').map(Number);
      let diff = (whour + wmin/60) - (shour + smin/60);
      if (diff < 0) diff += 24; // overnight
      return Math.round(diff * 10) / 10;
    } catch (e) {
      return 8.0;
    }
  };

  const duration = calculateDuration();

  const handleLog = (e) => {
    e.preventDefault();
    if (onLogSleep) {
      onLogSleep(sTime, wTime, sQuality, duration);
    }
    setLoggedToday(true);
    setTimeout(() => setLoggedToday(false), 3000);
  };

  // Convert history array to line chart data format
  const chartData = history.map(h => ({
    label: h.day,
    value: h.hours
  }));

  const getQualityLabel = (val) => {
    if (val < 50) return { label: 'Poor Rest', color: 'var(--color-danger)' };
    if (val < 75) return { label: 'Good Rest', color: 'var(--color-accent)' };
    return { label: 'Excellent Rest', color: 'var(--color-success)' };
  };
  const qualityLabel = getQualityLabel(sQuality);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '20px' }}>
      
      {/* Logger Panel */}
      <div style={{ gridColumn: 'span 5' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Moon size={18} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Log Sleep Record</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <form onSubmit={handleLog} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Bed Time</label>
                <input
                  type="time"
                  value={sTime}
                  onChange={(e) => setSTime(e.target.value)}
                  style={{
                    padding: '8px',
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Wake Up Time</label>
                <input
                  type="time"
                  value={wTime}
                  onChange={(e) => setWTime(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                  required
                />
              </div>
            </div>

            {/* Quality rating slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <label style={{ color: 'var(--text-secondary)' }}>Rest Quality</label>
                <span style={{ color: qualityLabel.color }}>{sQuality}% ({qualityLabel.label})</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={sQuality}
                onChange={(e) => setSQuality(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--color-primary)'
                }}
              />
            </div>

            {/* Auto calculated duration */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Computed Hours:</span>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontSize: '0.95rem' }}>
                {duration} hrs
              </span>
            </div>

            <Button type="submit" variant="primary" style={{ width: '100%' }}>
              Log Tonight's Sleep
            </Button>

            {loggedToday && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: 'var(--color-success)',
                fontWeight: 700,
                alignSelf: 'center'
              }}>
                <CheckCircle size={14} />
                <span>Sleep logs synced successfully!</span>
              </div>
            )}

          </form>
        </Card>
      </div>

      {/* History Line Chart */}
      <div style={{ gridColumn: 'span 7' }} className="col-span-desktop-12">
        <Card 
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--color-secondary)' }} />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Weekly Sleep Duration Trend (Target 8 hrs)</span>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)', height: '100%' }}
        >
          <div style={{ padding: '10px 0', height: '180px' }}>
            <LineChart data={chartData} height={160} color="var(--color-primary)" />
          </div>
        </Card>
      </div>

    </div>
  );
};

export default SleepTracker;
