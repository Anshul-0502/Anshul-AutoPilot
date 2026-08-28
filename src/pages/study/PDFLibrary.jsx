import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { FileText, Plus, BookOpen } from 'lucide-react';

const PDFLibrary = ({ subjects, pdfs: propsPdfs, onUpdatePdfs }) => {
  const [localPdfs, setLocalPdfs] = useState([
    { id: 1, title: 'Computer Networks 5th Ed', subject: 'Computer Networks', currentPage: 84, totalPages: 450, lastOpened: 'Yesterday' },
    { id: 2, title: 'Operating Systems Principles', subject: 'Operating Systems', currentPage: 12, totalPages: 320, lastOpened: '3 days ago' },
    { id: 3, title: 'Intro to Algorithms (CLRS)', subject: 'Mathematics III', currentPage: 180, totalPages: 980, lastOpened: 'Today' }
  ]);

  const pdfs = propsPdfs || localPdfs;
  const setPdfs = onUpdatePdfs || setLocalPdfs;

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0] ? subjects[0].name : 'General');
  const [totalPages, setTotalPages] = useState(300);

  const incrementPage = (id) => {
    setPdfs(pdfs.map(p => {
      if (p.id === id && p.currentPage < p.totalPages) {
        return { ...p, currentPage: p.currentPage + 1, lastOpened: 'Today' };
      }
      return p;
    }));
  };

  const decrementPage = (id) => {
    setPdfs(pdfs.map(p => {
      if (p.id === id && p.currentPage > 0) {
        return { ...p, currentPage: p.currentPage - 1, lastOpened: 'Today' };
      }
      return p;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPdf = {
      id: Date.now(),
      title: title.trim(),
      subject,
      currentPage: 0,
      totalPages: Number(totalPages) || 100,
      lastOpened: 'Just added'
    };

    setPdfs([newPdf, ...pdfs]);
    setTitle('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          PDF Shelf
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
        >
          {showAddForm ? 'Cancel' : 'Add PDF Book'}
        </Button>
      </div>

      {showAddForm && (
        <Card
          header={
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              📄 Register PDF textbook
            </span>
          }
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Book Title</label>
              <input
                type="text"
                placeholder="e.g. Modern Operating Systems"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Subject</label>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Pages</label>
                <input
                  type="number"
                  value={totalPages}
                  onChange={(e) => setTotalPages(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Register Book
            </Button>
          </form>
        </Card>
      )}

      {/* Book list */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {pdfs.map((pdf) => {
          const progress = Math.round((pdf.currentPage / pdf.totalPages) * 100);
          return (
            <Card key={pdf.id}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Book Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', overflow: 'hidden' }}>
                  <span style={{ 
                    color: 'var(--color-primary)', 
                    background: 'var(--glass-btn-bg)', 
                    padding: '6px', 
                    borderRadius: '6px',
                    display: 'flex'
                  }}>
                    <FileText size={16} />
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      color: 'var(--text-primary)', 
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {pdf.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {pdf.subject}
                    </span>
                  </div>
                </div>

                {/* Progress details & increments */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'var(--glass-btn-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '6px',
                  padding: '8px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PAGES READ</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                      {pdf.currentPage} / {pdf.totalPages}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      onClick={() => decrementPage(pdf.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'var(--glass-card-bg)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                      className="glass-btn"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => incrementPage(pdf.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'var(--glass-card-bg)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                      className="glass-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <ProgressBar value={progress} color="var(--color-primary)" showLabel={true} label="Reading progress" height="5px" />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  Opened: {pdf.lastOpened}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PDFLibrary;
