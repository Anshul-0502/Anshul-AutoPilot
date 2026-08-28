import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Database, Download, Upload, Check, AlertTriangle, CloudLightning, ArrowRight } from 'lucide-react';
import migrationApi from '../../services/api/migrationApi';

const BackupRestore = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState({ migrated: false, status: 'pending' });
  const [hasLegacyData, setHasLegacyData] = useState(false);

  const keysToBackup = [
    'autopilot-study-sessions',
    'autopilot-study-notes',
    'autopilot-study-pdfs',
    'autopilot-study-revisions',
    'anshul_autopilot_coding_data',
    'anshul_autopilot_projects_data',
    'anshul_autopilot_skill_data',
    'anshul_autopilot_health_data',
    'anshul_autopilot_settings_data',
    'anshul_autopilot_notifications'
  ];

  // Scan local storage for legacy data and check migration status
  const checkStatus = async () => {
    // Check if any legacy key exists in localStorage
    const found = keysToBackup.some(key => localStorage.getItem(key) !== null);
    setHasLegacyData(found);

    try {
      const res = await migrationApi.getMigrationStatus();
      if (res.success && res.data) {
        setMigrationStatus(res.data);
      }
    } catch (err) {
      console.warn('[BackupRestore] Could not fetch data migration status:', err.message);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  // Trigger migration
  const handleMigrate = async () => {
    setIsMigrating(true);
    setError('');
    setSuccess('');

    try {
      // 1. Compile LocalStorage payload
      const payload = {};
      keysToBackup.forEach(key => {
        const val = localStorage.getItem(key);
        if (val) {
          payload[key] = val;
        }
      });

      // 2. Transmit to backend
      const res = await migrationApi.importLegacyData(payload);
      if (res.success) {
        // 3. Clear LocalStorage legacy keys on client
        keysToBackup.forEach(key => {
          localStorage.removeItem(key);
        });

        setSuccess('Legacy LocalStorage data successfully migrated to database! 🎉');
        setHasLegacyData(false);
        setMigrationStatus({ migrated: true, status: 'completed' });
      } else {
        setError(res.message || 'Migration failed: backend rejected payload.');
      }
    } catch (err) {
      setError(err.message || 'Migration failed: network or controller error.');
    } finally {
      setIsMigrating(false);
    }
  };

  // Export JSON Database
  const handleExport = () => {
    try {
      const backupObj = {};
      keysToBackup.forEach(key => {
        const val = localStorage.getItem(key);
        if (val) {
          backupObj[key] = val;
        }
      });

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `anshul_autopilot_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      setSuccess('JSON backup file created and downloaded successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (e) {
      setError('Export failed: unable to read client local storage.');
      setTimeout(() => setError(''), 4000);
    }
  };

  // Import JSON Database
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // Basic validation: must be an object and have at least one key match
        if (typeof importedData !== 'object' || Array.isArray(importedData)) {
          throw new Error('Invalid file structure.');
        }

        const keys = Object.keys(importedData);
        const matches = keys.filter(k => keysToBackup.includes(k));
        
        if (matches.length === 0) {
          throw new Error('File does not contain valid AutoPilot backup database keys.');
        }

        // Apply to localStorage
        keys.forEach(k => {
          if (keysToBackup.includes(k)) {
            localStorage.setItem(k, importedData[k]);
          }
        });

        setSuccess('Database restored successfully! Reloading workspace...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } catch (err) {
        setError(err.message || 'Parse failed: invalid JSON backup file.');
        setTimeout(() => setError(''), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* MongoDB Migration Alert Banner Card */}
      {hasLegacyData && !migrationStatus.migrated && (
        <Card 
          style={{
            border: '1px solid var(--color-primary)',
            background: 'var(--color-primary-glow)',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }} className="flex-col-mobile">
            <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary)', display: 'flex' }}>
              <CloudLightning size={24} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: '200px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>Legacy LocalStorage Data Detected</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                We found local study history, tasks, or coding progress in this browser. Migrate them securely to your database account to access them anywhere!
              </span>
            </div>

            <Button
              variant="primary"
              onClick={handleMigrate}
              disabled={isMigrating}
              iconRight={<ArrowRight size={14} />}
              style={{
                height: '38px',
                fontSize: '0.8rem'
              }}
            >
              {isMigrating ? 'Migrating Data...' : 'Migrate Data to Cloud'}
            </Button>
          </div>
        </Card>
      )}

      {/* Migration Success Confirmation card */}
      {migrationStatus.migrated && (
        <Card 
          style={{
            border: '1px solid var(--color-success)',
            background: 'rgba(16, 185, 129, 0.05)',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex' }}>
              <Check size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>LocalStorage Migrated Successfully</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Your local logs are completely synchronized with MongoDB collections. Primary writes now save directly to your database profile.
              </span>
            </div>
          </div>
        </Card>
      )}

      <Card 
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Workspace Backup & Restore</span>
          </div>
        }
        style={{ border: '1px solid var(--glass-border)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Export all active study sessions, code scores, milestone lists, levels, and habits data into a single local JSON configuration file. Import it back anytime to restore your progress.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Export Button */}
            <Button
              variant="primary"
              onClick={handleExport}
              iconLeft={<Download size={14} />}
              style={{ height: '34px', fontSize: '0.8rem' }}
            >
              Export All Data
            </Button>

            {/* Import Button (Hidden Input) */}
            <label style={{ display: 'inline-block' }}>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 16px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-btn-bg)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxSizing: 'border-box'
              }} className="glass-btn-hover">
                <Upload size={14} />
                <span>Import Backup File</span>
              </div>
            </label>
          </div>

          {/* Feedback alerts */}
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <Check size={14} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 700 }}>
              <AlertTriangle size={14} />
              <span>{error}</span>
            </div>
          )}

        </div>
      </Card>
    </div>
  );
};

export default BackupRestore;
