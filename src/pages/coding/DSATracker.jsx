import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProblemDetails from './ProblemDetails';
import { Plus, Search, Trash2, Edit, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';

const DSATracker = ({ languages, problems, onAddProblem, onDeleteProblem, onUpdateProblem }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('LeetCode');
  const [difficulty, setDifficulty] = useState('Easy');
  const [topic, setTopic] = useState('Arrays');
  const [status, setStatus] = useState('Solved');
  const [timeTaken, setTimeTaken] = useState('20 mins');
  const [revisionRequired, setRevisionRequired] = useState(false);
  const [solutionCode, setSolutionCode] = useState('');
  const [complexityAnalysis, setComplexityAnalysis] = useState('Time: O(N) | Space: O(1)');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [activeProblemDetails, setActiveProblemDetails] = useState(null);

  const platforms = ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'Codeforces', 'CodeChef', 'Manual'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const topics = ['Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs', 'DP', 'Recursion', 'Hashing', 'Sorting', 'Searching', 'Greedy', 'Bit Manipulation'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddProblem({
      id: Date.now(),
      name: name.trim(),
      platform,
      difficulty,
      topic,
      status,
      timeTaken,
      revisionRequired,
      solutionCode: solutionCode.trim() || '// Write solution code here...',
      complexityAnalysis: complexityAnalysis.trim() || 'Time: O(N) | Space: O(1)',
      dateLogged: new Date().toLocaleDateString()
    });

    setName('');
    setSolutionCode('');
    setComplexityAnalysis('Time: O(N) | Space: O(1)');
    setRevisionRequired(false);
    setShowAddForm(false);
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'var(--color-success)';
      case 'medium': return 'var(--color-accent)';
      case 'hard': return 'var(--color-danger)';
      default: return 'var(--text-muted)';
    }
  };

  const getPlatformIcon = (plat) => {
    // Return placeholder styling or small text
    return plat.substring(0, 2);
  };

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header and Toggle Add */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700 }}>
          DSA Problem logs
        </h3>
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          iconLeft={<Plus size={14} />}
          style={{ padding: '2px 8px', fontSize: '0.8rem', height: '28px' }}
        >
          {showAddForm ? 'Cancel' : 'Register Solved Problem'}
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card
          header={
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              🧩 Register Solved Problem
            </span>
          }
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Problem Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Two Sum, Valid Parentheses"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {platforms.map(p => (
                    <option key={p} value={p} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {difficulties.map(d => (
                    <option key={d} value={d} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{d}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Topic / Tag</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{
                    padding: '8px',
                    background: 'var(--glass-input-bg)',
                    border: '1px solid var(--glass-input-border)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {topics.map(t => (
                    <option key={t} value={t} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Time Taken</label>
                <input
                  type="text"
                  placeholder="e.g. 20 mins"
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Complexity Analysis</label>
                <input
                  type="text"
                  value={complexityAnalysis}
                  onChange={(e) => setComplexityAnalysis(e.target.value)}
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

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '100%', paddingLeft: '8px', paddingTop: '16px' }}>
                <input
                  type="checkbox"
                  id="rev"
                  checked={revisionRequired}
                  onChange={(e) => setRevisionRequired(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                />
                <label htmlFor="rev" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                  Needs Revision / Recall Later
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Your Solution Code (Java/Python/JS)</label>
              <textarea
                placeholder="public int[] twoSum(int[] nums, int target) { ... }"
                value={solutionCode}
                onChange={(e) => setSolutionCode(e.target.value)}
                rows={5}
                style={{
                  padding: '10px 12px',
                  background: 'var(--glass-input-bg)',
                  border: '1px solid var(--glass-input-border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--mono)',
                  resize: 'vertical'
                }}
              />
            </div>

            <Button type="submit" variant="primary" size="sm" style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              Register Log
            </Button>
          </form>
        </Card>
      )}

      {/* Filter and Search Panel */}
      <div style={{
        display: 'flex',
        gap: '12px',
        background: 'var(--glass-card-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        padding: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px', background: 'var(--glass-input-bg)', border: '1px solid var(--glass-input-border)', borderRadius: '6px', padding: '6px 10px' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search problems or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        {/* Difficulty Filter */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Easy', 'Medium', 'Hard'].map(d => (
            <span
              key={d}
              onClick={() => setDifficultyFilter(d)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '20px',
                cursor: 'pointer',
                background: difficultyFilter === d ? 'var(--color-primary)' : 'var(--glass-btn-bg)',
                color: difficultyFilter === d ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--glass-border)'
              }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Problems Display List */}
      {filteredProblems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '36px',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          border: '1px dashed var(--glass-border)',
          borderRadius: '8px'
        }}>
          No problems solved matching the search criteria. Click 'Register Solved Problem' to add one.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {filteredProblems.map((prob) => {
            const diffColor = getDifficultyColor(prob.difficulty);
            return (
              <Card 
                key={prob.id}
                hoverable={true}
                onClick={() => setActiveProblemDetails(prob)}
                style={{ cursor: 'pointer', padding: '16px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  
                  {/* Row 1: Platform & Difficulty */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: 'var(--glass-btn-bg)', 
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-secondary)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>
                      {prob.platform}
                    </span>

                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: diffColor, 
                      fontWeight: 700,
                      background: 'var(--glass-btn-bg)',
                      border: `1px solid ${diffColor}`,
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {prob.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {prob.name}
                  </span>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', background: 'var(--glass-btn-bg-hover)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
                      #{prob.topic}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      ⏱ {prob.timeTaken}
                    </span>
                  </div>

                  {/* Footer Actions */}
                  <div style={{ display: 'flex', borderTop: '1px solid var(--glass-border)', paddingTop: '10px', marginTop: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} style={{ color: 'var(--color-success)' }} />
                      Solved
                    </span>

                    {prob.revisionRequired && (
                      <span style={{ 
                        fontSize: '0.65rem', 
                        color: 'var(--color-accent)', 
                        background: 'rgba(245, 158, 11, 0.1)', 
                        padding: '1px 6px', 
                        borderRadius: '4px',
                        fontWeight: 600,
                        marginLeft: '8px'
                      }}>
                        Needs Spaced Review
                      </span>
                    )}

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProblem(prob.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                        marginLeft: 'auto',
                        display: 'flex'
                      }}
                      className="hover-scale"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pop up detail Modal */}
      {activeProblemDetails && (
        <ProblemDetails 
          problem={activeProblemDetails}
          onClose={() => setActiveProblemDetails(null)}
          onUpdate={onUpdateProblem}
        />
      )}
    </div>
  );
};

export default DSATracker;
