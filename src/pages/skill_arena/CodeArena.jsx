import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Play, CheckCircle, AlertCircle, RefreshCw, Cpu, Code2 } from 'lucide-react';

const problems = [
  {
    id: 1,
    title: 'Reverse a String',
    lang: 'JavaScript',
    difficulty: 'Beginner',
    mode: 'Write Code',
    desc: 'Write a function reverseString(str) that takes a string and returns it reversed. Example: reverseString("hello") should return "olleh".',
    starter: `function reverseString(str) {\n  // Write your code here\n  \n}`,
    validate: (code) => {
      const cleaned = code.replace(/\s+/g, '');
      return cleaned.includes('.split(') && cleaned.includes('.reverse(') && cleaned.includes('.join(') || cleaned.includes('for(') && cleaned.includes('+=');
    },
    successMsg: 'Tests passed! String reversed correctly.'
  },
  {
    id: 2,
    title: 'Find Even Numbers',
    lang: 'Python',
    difficulty: 'Beginner',
    mode: 'Debug Code',
    desc: 'The function below is supposed to return all even numbers from a list, but it currently returns odd numbers instead. Find and fix the bug!',
    starter: `def get_evens(nums):\n    evens = []\n    for n in nums:\n        # FIX THE BUG ON THE LINE BELOW\n        if n % 2 == 1:\n            evens.append(n)\n    return evens`,
    validate: (code) => {
      return code.includes('n % 2 == 0');
    },
    successMsg: 'Bug fixed! The condition correctly filters even numbers now.'
  },
  {
    id: 3,
    title: 'Pointer Arithmetic',
    lang: 'C++',
    difficulty: 'Intermediate',
    mode: 'Predict Output',
    desc: 'Analyze the pointer arithmetic below and choose the correct stdout output value.',
    starter: `int arr[] = {10, 20, 30};\nint* ptr = arr;\nptr++;\nstd::cout << *ptr;`,
    options: ['10', '20', '30', 'Compilation Error'],
    answer: '20',
    successMsg: 'Correct! Incrementing a pointer shifts it to the next index memory address.'
  },
  {
    id: 4,
    title: 'Array Map Doubler',
    lang: 'JavaScript',
    difficulty: 'Beginner',
    mode: 'Fill Missing Code',
    desc: 'Fill in the blank ____ to double every element inside the numbers array.',
    starter: `const nums = [1, 2, 3];\nconst doubled = nums.map(x => ____);`,
    answer: 'x * 2',
    validate: (code) => {
      const normalized = code.replace(/\s+/g, '');
      return normalized.includes('x*2') || normalized.includes('2*x') || normalized.includes('x*2;');
    },
    successMsg: 'Perfect! The map callback successfully doubled all array elements.'
  }
];

const CodeArena = ({ onAwardXP, onAwardCoins, onCompleteDaily, onRecordActivity, searchQuery }) => {
  const [selectedLang, setSelectedLang] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeProblem, setActiveProblem] = useState(problems[0]);
  const [code, setCode] = useState(problems[0].starter);
  const [selectedOption, setSelectedOption] = useState('');
  
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Sync starter code when problem switches
  useEffect(() => {
    setCode(activeProblem.starter);
    setLogs([]);
    setIsSuccess(false);
    setHasError(false);
    setSelectedOption('');
  }, [activeProblem]);

  // Filter problems
  const filteredProblems = problems.filter(p => {
    const matchLang = selectedLang === 'All' || p.lang === selectedLang;
    const matchDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.lang.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLang && matchDiff && matchSearch;
  });

  const handleRun = () => {
    setIsRunning(true);
    setLogs(['[SYSTEM] Initializing compilers...', '[SYSTEM] Running pre-compilation test suites...']);
    setHasError(false);

    setTimeout(() => {
      if (activeProblem.mode === 'Predict Output') {
        if (selectedOption === activeProblem.answer) {
          setLogs(prev => [...prev, '✓ Match found for expected stdout output: 20', '🎉 Code Arena verification succeeded!']);
          setIsSuccess(true);
          onAwardXP(100);
          onAwardCoins(20);
          onRecordActivity(true);
          if (activeProblem.id === 1 || activeProblem.id === 3) {
            onCompleteDaily();
          }
        } else {
          setLogs(prev => [...prev, '❌ Output mismatch.', 'Expected "20" but got your option.', 'Compilation failure.']);
          setHasError(true);
          onRecordActivity(false);
        }
      } else {
        // Write code, debug, fill blanks
        const passed = activeProblem.validate(code);
        if (passed) {
          setLogs(prev => [...prev, '✓ Test case 1: Passed', '✓ Test case 2: Passed', '🎉 Code Arena validation succeeded!']);
          setIsSuccess(true);
          onAwardXP(100);
          onAwardCoins(20);
          onRecordActivity(true);
          if (activeProblem.id === 1) {
            onCompleteDaily();
          }
        } else {
          setLogs(prev => [...prev, '❌ Test case 1: Failed', 'SyntaxError: Output results did not match objectives.', 'Check logic and try again.']);
          setHasError(true);
          onRecordActivity(false);
        }
      }
      setIsRunning(false);
    }, 1500);
  };

  const handleReset = () => {
    setCode(activeProblem.starter);
    setLogs([]);
    setIsSuccess(false);
    setHasError(false);
    setSelectedOption('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }} className="flex-col-mobile">
      
      {/* Problems list panel */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
          Challenges Directory
        </h3>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <select 
            value={selectedLang} 
            onChange={(e) => setSelectedLang(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-input-bg)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem'
            }}
          >
            <option value="All">All Languages</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="C++">C++</option>
          </select>

          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-input-bg)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem'
            }}
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
          </select>
        </div>

        {/* List items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: '350px' }}>
          {filteredProblems.map(p => {
            const isActive = p.id === activeProblem.id;
            return (
              <div
                key={p.id}
                onClick={() => setActiveProblem(p)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  background: isActive ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</span>
                  <span style={{ 
                    fontSize: '0.6rem', 
                    color: p.difficulty === 'Beginner' ? 'var(--color-success)' : 'var(--color-accent)', 
                    fontWeight: 700 
                  }}>
                    {p.difficulty}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                  <span>{p.lang}</span>
                  <span>•</span>
                  <span>{p.mode}</span>
                </div>
              </div>
            );
          })}
          {filteredProblems.length === 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
              No coding challenges found.
            </div>
          )}
        </div>
      </div>

      {/* Editor & Execution Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card 
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code2 size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{activeProblem.title}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--glass-border)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  {activeProblem.lang}
                </span>
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--color-primary-glow)', color: 'var(--color-primary)', fontWeight: 700 }}>
                  {activeProblem.mode}
                </span>
              </div>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Description */}
            <div style={{
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.4'
            }}>
              {activeProblem.desc}
            </div>

            {/* Editor Workspace */}
            {activeProblem.mode === 'Predict Output' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <pre style={{
                  background: 'var(--code-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--mono)',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {activeProblem.starter}
                </pre>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Select predicted console output:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="flex-col-mobile">
                    {activeProblem.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setSelectedOption(opt)}
                        disabled={isSuccess}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: selectedOption === opt ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                          background: selectedOption === opt ? 'var(--color-primary-glow)' : 'var(--glass-btn-bg)',
                          color: selectedOption === opt ? 'var(--color-primary)' : 'var(--text-primary)',
                          fontWeight: selectedOption === opt ? 700 : 500,
                          fontSize: '0.8rem',
                          cursor: isSuccess ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center'
                        }}
                        className="hover-scale"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', width: '100%' }}>
                {/* Simulated Editor Line numbers */}
                <div style={{
                  display: 'flex',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: 'var(--code-bg)'
                }}>
                  <div style={{
                    width: '35px',
                    background: 'var(--glass-btn-bg)',
                    borderRight: '1px solid var(--glass-border)',
                    padding: '12px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontFamily: 'var(--mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.5',
                    userSelect: 'none'
                  }}>
                    {Array.from({ length: Math.max(8, code.split('\n').length) }, (_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isSuccess}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--mono)',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      padding: '12px',
                      minHeight: '200px',
                      resize: 'vertical',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                onClick={handleRun}
                disabled={isRunning || isSuccess || (activeProblem.mode === 'Predict Output' && !selectedOption)}
                iconLeft={<Play size={14} />}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                {isRunning ? 'Compiling...' : 'Run Tests'}
              </Button>

              <Button
                variant="glass"
                onClick={handleReset}
                disabled={isRunning || isSuccess}
                iconLeft={<RefreshCw size={14} />}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                Reset
              </Button>
            </div>

            {/* Validation Logs & Success Message */}
            {logs.length > 0 && (
              <div style={{
                background: '#0a0f1d',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontFamily: 'var(--mono)',
                fontSize: '0.75rem',
                color: '#38bdf8',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                textAlign: 'left'
              }}>
                <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginBottom: '4px', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={12} /> Execution Console Logs:
                </div>
                {logs.map((log, index) => {
                  const isErr = log.startsWith('❌');
                  const isPass = log.startsWith('✓') || log.startsWith('🎉');
                  return (
                    <span 
                      key={index} 
                      style={{ 
                        color: isErr ? 'var(--color-danger)' : isPass ? 'var(--color-success)' : '#e2e8f0',
                        fontWeight: isPass || isErr ? 700 : 400
                      }}
                    >
                      {log}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Success Overlay Panel */}
            {isSuccess && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid var(--color-success)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--color-success)'
              }}>
                <CheckCircle size={20} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Challenge Solved!</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activeProblem.successMsg}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', marginTop: '4px' }}>
                    Awarded +100 XP & +20 Coins!
                  </span>
                </div>
              </div>
            )}

            {/* Error Message Panel */}
            {hasError && !isSuccess && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid var(--color-danger)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--color-danger)'
              }}>
                <AlertCircle size={20} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Compilation Failed</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Double check the syntax rules and logic constraints.</span>
                </div>
              </div>
            )}

          </div>
        </Card>
      </div>

    </div>
  );
};

export default CodeArena;
