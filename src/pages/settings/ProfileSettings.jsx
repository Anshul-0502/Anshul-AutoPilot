import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { User, CheckCircle } from 'lucide-react';

const ProfileSettings = ({ profile = {}, onSave }) => {
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [username, setUsername] = useState(profile.username || '');
  const [email, setEmail] = useState(profile.email || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [college, setCollege] = useState(profile.college || '');
  const [skills, setSkills] = useState(profile.skills || '');
  const [careerGoal, setCareerGoal] = useState(profile.careerGoal || '');
  const [avatar, setAvatar] = useState(profile.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80');
  const [success, setSuccess] = useState(false);

  const avatarsList = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', // Developer Boy
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', // Developer Girl
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', // Tech Lead
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'  // QA Engineer
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        fullName,
        username,
        email,
        bio,
        college,
        skills,
        careerGoal,
        photo: avatar
      });
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Card 
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Personal Profile Settings</span>
        </div>
      }
      style={{ border: '1px solid var(--glass-border)' }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        
        {/* Avatar Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Choose Profile Avatar:</span>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img
              src={avatar}
              alt="Avatar Preview"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '2px solid var(--color-primary)',
                objectFit: 'cover'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              {avatarsList.map((av, idx) => (
                <img
                  key={idx}
                  src={av}
                  alt={`Preset ${idx + 1}`}
                  onClick={() => setAvatar(av)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: avatar === av ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    transition: 'all 0.2s ease',
                    opacity: avatar === av ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="flex-col-mobile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }} className="flex-col-mobile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>University / College</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              style={{
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
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Bio Summary</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            style={{
              padding: '8px 12px',
              background: 'var(--glass-input-bg)',
              border: '1px solid var(--glass-input-border)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              resize: 'none'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="flex-col-mobile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tech Stack & Skills</label>
            <input
              type="text"
              placeholder="e.g. React, C++, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              style={{
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
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Career Target / Role</label>
            <input
              type="text"
              placeholder="e.g. Quant Engineer, Full Stack Architect"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'var(--glass-input-bg)',
                border: '1px solid var(--glass-input-border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button type="submit" variant="primary">
            Save Profile
          </Button>

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <CheckCircle size={14} />
              <span>Profile details saved!</span>
            </div>
          )}
        </div>

      </form>
    </Card>
  );
};

export default ProfileSettings;
