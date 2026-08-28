import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Lock, CheckCircle, Circle, Play, ArrowRight, BookOpen, Compass, Award } from 'lucide-react';

const paths = {
  frontend: {
    title: 'Frontend Developer Path',
    desc: 'Master building responsive and interactive browser applications.',
    nodes: [
      { key: 'variables', title: 'Variables & Scopes', desc: 'Understand var, let, const scoping rules and hoisting.', q: 'Which declaration scope is block-level and cannot be redeclared?', opts: ['var', 'let', 'global', 'none'], ans: 'let' },
      { key: 'loops', title: 'Looping Iterations', desc: 'Master for, while, map, filter, and reduce operations.', q: 'Which array method returns a new array with all elements matching a condition?', opts: ['map', 'forEach', 'filter', 'reduce'], ans: 'filter' },
      { key: 'dom', title: 'DOM Manipulation', desc: 'Learn query selection and element event listeners.', q: 'Which method is used to register an event listener on a DOM element?', opts: ['addEventListener', 'attachEvent', 'bindEvent', 'onClick'], ans: 'addEventListener' },
      { key: 'react', title: 'React Hooks Basics', desc: 'Deep dive into useState, useEffect, and component lifecycle.', q: 'Which React hook is used to manage local state inside a function component?', opts: ['useEffect', 'useState', 'useContext', 'useRef'], ans: 'useState' }
    ]
  },
  backend: {
    title: 'Backend Developer Path',
    desc: 'Master systems execution, databases, and Object Oriented Polymorphism.',
    nodes: [
      { key: 'jvm', title: 'JVM Architecture', desc: 'Understand Stack vs Heap memory allocation and GC.', q: 'Where are objects instantiated in Java stored in memory?', opts: ['Stack', 'Heap', 'Method Area', 'Register'], ans: 'Heap' },
      { key: 'sql', title: 'SQL Joins & Queries', desc: 'Master inner, outer, left, and right queries.', q: 'Which join returns all rows from the left table and matched rows from the right table?', opts: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'FULL JOIN'], ans: 'LEFT JOIN' },
      { key: 'oop', title: 'OOP Polymorphism', desc: 'Understand method overloading vs overriding principles.', q: 'What is it called when two methods in the same class have the same name but different parameters?', opts: ['Overriding', 'Overloading', 'Inheritance', 'Encapsulation'], ans: 'Overloading' }
    ]
  }
};

const MissionArena = ({ progress = {}, onCompleteNode, searchQuery }) => {
  const [activePathKey, setActivePathKey] = useState('frontend');
  const [selectedNode, setSelectedNode] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validationSuccess, setValidationSuccess] = useState(false);

  const activePath = paths[activePathKey];
  const pathProgress = progress[activePathKey] || [];

  // Determine if a node is completed, active, or locked
  const getNodeStatus = (node, idx, nodes) => {
    if (pathProgress.includes(node.key)) return 'completed';
    if (idx === 0 || pathProgress.includes(nodes[idx - 1].key)) return 'active';
    return 'locked';
  };

  const handleStartNode = (node) => {
    setSelectedNode(node);
    setUserAnswer('');
    setShowValidation(true);
    setValidationError('');
    setValidationSuccess(false);
  };

  const verifyAnswer = () => {
    if (userAnswer === selectedNode.ans) {
      setValidationSuccess(true);
      setValidationError('');
      setTimeout(() => {
        onCompleteNode(activePathKey, selectedNode.key, 150); // Award 150 XP
        setShowValidation(false);
        setSelectedNode(null);
      }, 1500);
    } else {
      setValidationError('❌ Incorrect answer. Review the concept and try again.');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }} className="flex-col-mobile">
      
      {/* Paths Selector */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
          Learning Journeys
        </h3>
        
        {Object.entries(paths).map(([key, path]) => {
          const isActive = key === activePathKey;
          const completedCount = path.nodes.filter(n => (progress[key] || []).includes(n.key)).length;
          const totalCount = path.nodes.length;
          const pct = Math.round((completedCount / totalCount) * 100);

          return (
            <div
              key={key}
              onClick={() => {
                setActivePathKey(key);
                setSelectedNode(null);
                setShowValidation(false);
              }}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                background: isActive ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{path.title}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                <span>Progress</span>
                <span>{completedCount}/{totalCount} ({pct}%)</span>
              </div>
              <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-primary)' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pathway Roadmap Map */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {!showValidation ? (
          <Card 
            header={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{activePath.title} Road</span>
              </div>
            }
            style={{ border: '1px solid var(--glass-border)' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              
              {/* Nodes Timeline list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '24px' }}>
                
                {/* Vertical Connector Line */}
                <div style={{
                  position: 'absolute',
                  left: '7px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  background: 'var(--glass-border)',
                  zIndex: 0
                }} />

                {activePath.nodes
                  .filter(node => !searchQuery || node.title.toLowerCase().includes(searchQuery.toLowerCase()) || node.desc.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((node, idx) => {
                    const status = getNodeStatus(node, idx, activePath.nodes);
                    const isCompleted = status === 'completed';
                    const isActive = status === 'active';
                    const isLocked = status === 'locked';

                    return (
                      <div
                        key={node.key}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'start',
                          gap: '16px',
                          zIndex: 1,
                          opacity: isLocked ? 0.6 : 1
                        }}
                      >
                        {/* Node timeline dot */}
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--glass-border)',
                          border: '2px solid var(--bg-secondary)',
                          position: 'absolute',
                          left: '-24px',
                          top: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--glass-shadow)',
                          animation: isActive ? 'pulse 2s infinite' : 'none'
                        }} />

                        {/* Node Card */}
                        <div style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                          background: isActive ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '10px'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {node.title}
                              {isCompleted && <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{node.desc}</span>
                          </div>

                          <div>
                            {isCompleted ? (
                              <span style={{ fontSize: '0.65rem', color: 'var(--color-success)', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                Unlocked
                              </span>
                            ) : isActive ? (
                              <button
                                onClick={() => handleStartNode(node)}
                                style={{
                                  padding: '4px 10px',
                                  background: 'var(--color-primary)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                className="hover-scale"
                              >
                                Test <Play size={10} fill="#fff" />
                              </button>
                            ) : (
                              <Lock size={14} style={{ color: 'var(--text-muted)' }} />
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
              </div>

            </div>
          </Card>
        ) : (
          /* Mini Concept Question Validation Box */
          <Card
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  🔓 Unlock Concept: {selectedNode.title}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-accent)' }}>+150 XP Challenge</span>
              </div>
            }
            style={{ border: '1px solid var(--glass-border)' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{
                background: 'var(--glass-btn-bg)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                fontWeight: 600,
                textAlign: 'left'
              }}>
                {selectedNode.q}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedNode.opts.map(opt => {
                  const isChecked = userAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (!validationSuccess) setUserAnswer(opt);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: isChecked ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                        background: isChecked ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                        color: isChecked ? 'var(--color-primary)' : 'var(--text-primary)',
                        fontWeight: isChecked ? 700 : 500,
                        fontSize: '0.8rem',
                        cursor: validationSuccess ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Logs / Validation Alerts */}
              {validationError && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 700, textAlign: 'left' }}>
                  {validationError}
                </div>
              )}

              {validationSuccess && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid var(--color-success)',
                  borderRadius: '8px',
                  padding: '10px',
                  color: 'var(--color-success)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textAlign: 'left'
                }}>
                  🎉 Correct Answer! Module unlocked. +150 XP added to level Cockpit.
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button
                  variant="primary"
                  onClick={verifyAnswer}
                  disabled={!userAnswer || validationSuccess}
                  style={{ height: '36px', fontSize: '0.85rem' }}
                >
                  Confirm Answer
                </Button>
                <Button
                  variant="glass"
                  onClick={() => {
                    setShowValidation(false);
                    setSelectedNode(null);
                  }}
                  disabled={validationSuccess}
                  style={{ height: '36px', fontSize: '0.85rem' }}
                >
                  Cancel
                </Button>
              </div>

            </div>
          </Card>
        )}

      </div>

    </div>
  );
};

export default MissionArena;
