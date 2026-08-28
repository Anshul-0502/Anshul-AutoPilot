import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { HelpCircle, Clock, CheckCircle2, AlertTriangle, ArrowRight, Award } from 'lucide-react';

const quizData = {
  DSA: [
    {
      q: 'What is the worst-case time complexity of the standard Quicksort algorithm?',
      opts: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'],
      ans: 'O(N^2)'
    },
    {
      q: 'Which data structure operates on a Last-In, First-Out (LIFO) basis?',
      opts: ['Queue', 'Stack', 'Linked List', 'Hash Map'],
      ans: 'Stack'
    },
    {
      q: 'What is the height of a perfectly balanced binary search tree with N nodes?',
      opts: ['O(N)', 'O(N log N)', 'O(log N)', 'O(1)'],
      ans: 'O(log N)'
    }
  ],
  OS: [
    {
      q: 'What is a deadlocked state in operating systems?',
      opts: ['An infinite loop', 'A process crashing from memory overflow', 'Processes blocked waiting for resources held by each other', 'A process running in high priority mode'],
      ans: 'Processes blocked waiting for resources held by each other'
    },
    {
      q: 'Which scheduling algorithm is non-preemptive by definition?',
      opts: ['Round Robin', 'First-Come First-Served (FCFS)', 'Shortest Remaining Time First (SRTF)', 'Preemptive Priority'],
      ans: 'First-Come First-Served (FCFS)'
    }
  ],
  DBMS: [
    {
      q: 'What does the ACID abbreviation stand for in transactional databases?',
      opts: ['Access, Control, Index, Data', 'Atomicity, Consistency, Isolation, Durability', 'Algorithm, Cache, Iteration, Disk', 'Array, Collection, Item, Directory'],
      ans: 'Atomicity, Consistency, Isolation, Durability'
    },
    {
      q: 'Which SQL keyword is used to sort the result-set in descending order?',
      opts: ['SORT BY', 'ORDER BY', 'GROUP BY', 'ALIGN BY'],
      ans: 'ORDER BY'
    }
  ],
  Networking: [
    {
      q: 'Which TCP/IP model layer is responsible for routing data packets across networks?',
      opts: ['Application Layer', 'Transport Layer', 'Network/Internet Layer', 'Link/Physical Layer'],
      ans: 'Network/Internet Layer'
    }
  ]
};

const QuizArena = ({ onAwardXP, onAwardCoins, onCompleteDaily, onRecordActivity, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef(null);

  // Filter categories
  const categories = Object.keys(quizData).filter(cat => 
    !searchQuery || cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startQuiz = (cat) => {
    setSelectedCategory(cat);
    setCurrentIdx(0);
    setSelectedOption('');
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setTimeLeft(20);
  };

  // Start question timer
  useEffect(() => {
    if (!selectedCategory || quizFinished || isAnswered) return;

    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [selectedCategory, currentIdx, isAnswered, quizFinished]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(''); // No option selected
    onRecordActivity(false);
  };

  const handleOptionClick = (opt) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setSelectedOption(opt);
    setIsAnswered(true);

    const questions = quizData[selectedCategory];
    const isCorrect = opt === questions[currentIdx].ans;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      onRecordActivity(true);
    } else {
      onRecordActivity(false);
    }
  };

  const handleNext = () => {
    const questions = quizData[selectedCategory];
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption('');
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      // Award rewards based on score
      const finalXp = score * 30 + 30; // base + score multiplier
      const finalCoins = score * 5 + 5;
      onAwardXP(finalXp);
      onAwardCoins(finalCoins);
      
      // Check for daily completion
      if (selectedCategory === 'OS' || selectedCategory === 'DSA') {
        onCompleteDaily();
      }
    }
  };

  const exitQuiz = () => {
    setSelectedCategory(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Category Selection Screen */}
      {!selectedCategory && (
        <Card 
          header={<span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Select Quiz Category</span>}
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '8px'
          }}>
            {categories.map(cat => (
              <div
                key={cat}
                onClick={() => startQuiz(cat)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-btn-bg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                className="glass-card-hover"
              >
                <div style={{
                  alignSelf: 'center',
                  background: 'var(--color-primary-glow)',
                  color: 'var(--color-primary)',
                  padding: '10px',
                  borderRadius: '50%',
                  display: 'flex'
                }}>
                  <HelpCircle size={24} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{cat}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {quizData[cat].length} CS Revision Questions
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Interactive Quiz Question Card */}
      {selectedCategory && !quizFinished && (
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedCategory} Quiz (Question {currentIdx + 1}/{quizData[selectedCategory].length})
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: timeLeft <= 5 ? 'var(--color-danger)' : 'var(--text-secondary)', fontWeight: 700 }}>
                <Clock size={14} />
                <span>{timeLeft}s</span>
              </div>
            </div>
          }
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Question Text */}
            <div style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: '1.4',
              padding: '12px 0'
            }}>
              {quizData[selectedCategory][currentIdx].q}
            </div>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {quizData[selectedCategory][currentIdx].opts.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrectAns = opt === quizData[selectedCategory][currentIdx].ans;
                
                let optBorder = '1px solid var(--glass-border)';
                let optBg = 'var(--glass-btn-bg)';
                let optColor = 'var(--text-primary)';

                if (isAnswered) {
                  if (isCorrectAns) {
                    optBorder = '1px solid var(--color-success)';
                    optBg = 'rgba(16, 185, 129, 0.1)';
                    optColor = 'var(--color-success)';
                  } else if (isSelected) {
                    optBorder = '1px solid var(--color-danger)';
                    optBg = 'rgba(239, 68, 68, 0.1)';
                    optColor = 'var(--color-danger)';
                  }
                } else if (isSelected) {
                  optBorder = '1px solid var(--color-primary)';
                  optBg = 'var(--color-primary-glow)';
                  optColor = 'var(--color-primary)';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionClick(opt)}
                    disabled={isAnswered}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: optBorder,
                      background: optBg,
                      color: optColor,
                      fontSize: '0.85rem',
                      fontWeight: isSelected || (isAnswered && isCorrectAns) ? 700 : 500,
                      cursor: isAnswered ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                    className={!isAnswered ? "hover-scale" : ""}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            {isAnswered && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  iconRight={<ArrowRight size={14} />}
                  style={{ height: '36px', fontSize: '0.85rem' }}
                >
                  {currentIdx === quizData[selectedCategory].length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            )}

          </div>
        </Card>
      )}

      {/* Quiz Results Screen */}
      {selectedCategory && quizFinished && (
        <Card style={{ textAlign: 'center', padding: '30px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--color-accent)',
              padding: '16px',
              borderRadius: '50%',
              display: 'flex'
            }}>
              <Award size={48} />
            </div>

            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                {selectedCategory} Quiz Completed!
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Excellent revision workout. Here is your report scorecard:
              </p>
            </div>

            {/* Score Ratios */}
            <div style={{
              display: 'flex',
              gap: '24px',
              background: 'var(--glass-btn-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '16px 24px',
              margin: '10px 0'
            }}>
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
                  {score}/{quizData[selectedCategory].length}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Score</span>
              </div>
              <div style={{ width: '1px', background: 'var(--glass-border)' }} />
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>
                  {Math.round((score / quizData[selectedCategory].length) * 100)}%
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Accuracy</span>
              </div>
              <div style={{ width: '1px', background: 'var(--glass-border)' }} />
              <div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)', display: 'block' }}>
                  +{score * 30 + 30} XP
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>XP Awarded</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Button variant="primary" onClick={() => startQuiz(selectedCategory)} style={{ height: '36px', fontSize: '0.85rem' }}>
                Retry Quiz
              </Button>
              <Button variant="glass" onClick={exitQuiz} style={{ height: '36px', fontSize: '0.85rem' }}>
                Back to Selection
              </Button>
            </div>

          </div>
        </Card>
      )}

    </div>
  );
};

export default QuizArena;
