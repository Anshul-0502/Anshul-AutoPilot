import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CodingDashboard from './coding/CodingDashboard';
import LanguageManager from './coding/LanguageManager';
import DSATracker from './coding/DSATracker';
import CodingTimer from './coding/CodingTimer';
import CodingNotes from './coding/CodingNotes';
import SnippetManager from './coding/SnippetManager';
import CodingResources from './coding/CodingResources';
import CodingGoals from './coding/CodingGoals';
import InterviewPreparation from './coding/InterviewPreparation';
import CodingStatistics from './coding/CodingStatistics';
import CodingSearch from './coding/CodingSearch';
import codingApi from '../services/api/codingApi';
import { useAuth } from '../contexts/AuthContext';

import { 
  LayoutDashboard, 
  Terminal, 
  Award, 
  Timer, 
  Code, 
  FileText, 
  BookOpen, 
  Target, 
  Briefcase, 
  BarChart2, 
  Search 
} from 'lucide-react';

const CodingWorkspace = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location]);

  // Unified coding states
  const [languages, setLanguages] = useState([]);
  const [problems, setProblems] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [notes, setNotes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [resources, setResources] = useState([]);
  const [interviewTopics, setInterviewTopics] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [timerLogs, setTimerLogs] = useState([]);
  const [stats, setStats] = useState({
    solvedCount: 0,
    codingHours: 0,
    currentStreak: 5
  });
  const [isLoading, setIsLoading] = useState(false);

  // Prepopulated premium dummy data if no DB entries exist
  const initialLanguages = [
    { name: 'Java', progress: 85, status: 'active' },
    { name: 'Python', progress: 75, status: 'active' },
    { name: 'C++', progress: 90, status: 'active' },
    { name: 'JavaScript', progress: 80, status: 'active' },
    { name: 'SQL', progress: 65, status: 'active' }
  ];

  const initialProblems = [
    {
      name: 'Two Sum',
      platform: 'LeetCode',
      difficulty: 'Easy',
      topic: 'Arrays',
      status: 'Solved',
      timeTaken: '15 mins',
      revisionRequired: false,
      solutionCode: 'public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement)) {\n            return new int[] { map.get(complement), i };\n        }\n        map.put(nums[i], i);\n    }\n    return new int[] {};\n}',
      complexityAnalysis: 'Time: O(N) | Space: O(N)',
      dateLogged: '2026-08-01'
    },
    {
      name: 'Reverse Linked List',
      platform: 'LeetCode',
      difficulty: 'Easy',
      topic: 'Linked List',
      status: 'Solved',
      timeTaken: '10 mins',
      revisionRequired: true,
      solutionCode: 'public ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n    while (curr != null) {\n        ListNode nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}',
      complexityAnalysis: 'Time: O(N) | Space: O(1)',
      dateLogged: '2026-08-03'
    },
    {
      name: 'Longest Substring Without Repeating Characters',
      platform: 'LeetCode',
      difficulty: 'Medium',
      topic: 'Strings',
      status: 'Solved',
      timeTaken: '30 mins',
      revisionRequired: false,
      solutionCode: 'public int lengthOfLongestSubstring(String s) {\n    int n = s.length(), ans = 0;\n    Map<Character, Integer> map = new HashMap<>();\n    for (int j = 0, i = 0; j < n; j++) {\n        if (map.containsKey(s.charAt(j))) {\n            i = Math.max(map.get(s.charAt(j)), i);\n        }\n        ans = Math.max(ans, j - i + 1);\n        map.put(s.charAt(j), j + 1);\n    }\n    return ans;\n}',
      complexityAnalysis: 'Time: O(N) | Space: O(min(M, N))',
      dateLogged: '2026-08-05'
    }
  ];

  const initialSnippets = [
    {
      title: 'Fast I/O Template in C++',
      lang: 'C++',
      description: 'Accelerates standard streams input/output operations for competitive programming.',
      code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Write solution code here\n    return 0;\n}',
      tags: ['competitive-programming', 'templates', 'fast-io'],
      favorite: true
    },
    {
      title: 'Fetch JSON API call in React useEffect',
      lang: 'React',
      description: 'Standard pattern to fetch API responses inside standard React functional components with cleanup.',
      code: 'useEffect(() => {\n  let active = true;\n  const fetchData = async () => {\n    const res = await fetch(url);\n    const data = await res.json();\n    if (active) setData(data);\n  };\n  fetchData();\n  return () => { active = false; };\n}, [url]);',
      tags: ['fetching', 'hooks', 'react'],
      favorite: false
    }
  ];

  const initialNotes = [
    {
      title: 'Space Complexity levels reference',
      content: 'O(1) - Constant space: no additional memory relative to inputs.\nO(log N) - Logarithmic space: recursive call stacks of trees.\nO(N) - Linear space: dynamic arrays or hash maps storing inputs.\nO(N^2) - Quadratic space: dynamic programming matrices.',
      lang: 'General',
      tags: ['theory', 'space-complexity', 'revision'],
      codeSnippet: 'int[] temp = new int[n]; // O(N) memory allocation',
      favorite: true,
      date: '2026-08-01'
    },
    {
      title: 'DBMS Normalization Summary Rules',
      content: '1NF: Atomic values, no repeating groups.\n2NF: In 1NF and no partial dependencies (all non-key attributes fully functionally dependent on primary key).\n3NF: In 2NF and no transitive dependencies.\nBCNF: Every determinant is a candidate key.',
      lang: 'SQL',
      tags: ['dbms', 'theory', 'normalization'],
      codeSnippet: '-- BCNF violates transitive relation constraints\nCREATE TABLE Students (\n    Student_ID INT PRIMARY KEY,\n    Advisor_ID INT,\n    Subject VARCHAR(50)\n);',
      favorite: false,
      date: '2026-08-04'
    }
  ];

  const initialGoals = [
    { title: 'Solve 10 Medium Trees Problems', targetCount: 10, currentCount: 3, period: 'Weekly', completed: false, progress: 30 },
    { title: 'Complete SQL Subqueries Prep', targetCount: 1, currentCount: 1, period: 'Daily', completed: true, progress: 100 }
  ];

  const initialResources = [
    { name: 'LeetCode Problem Sets', type: 'Documentation', url: 'https://leetcode.com/problemset', lang: 'General', notes: 'Daily practice arena' },
    { name: 'Java Streams API Guide', type: 'Tutorial', url: 'https://docs.oracle.com/en/java', lang: 'Java', notes: 'Stream mapping operations rules' },
    { name: 'C++ STL Reference Cheatsheet', type: 'Cheat Sheet', url: 'https://cppreference.com', lang: 'C++', notes: 'Standard vector and queue methods' }
  ];

  const initialInterviewTopics = [
    { category: 'DSA', title: 'Binary Search implementations', completed: true },
    { category: 'DSA', title: 'Tree traversal order depth (Pre, In, Post, Level)', completed: false },
    { category: 'OOP', title: 'Differences: Abstraction vs Encapsulation', completed: true },
    { category: 'OOP', title: 'Polymorphism (Overloading vs Overriding)', completed: false },
    { category: 'DBMS', title: 'ACID properties definitions', completed: true },
    { category: 'DBMS', title: 'Joins types: Left, Right, Inner, Full Outer', completed: false },
    { category: 'OS', title: 'Process vs Thread comparisons', completed: false },
    { category: 'OS', title: 'Deadlock avoidance (Banker\'s Algorithm)', completed: false },
    { category: 'Computer Networks', title: 'OSI Model 7 layers details', completed: true },
    { category: 'Computer Networks', title: 'Differences: TCP vs UDP protocols', completed: false },
    { category: 'HR', title: 'Tell me about yourself pitch', completed: false }
  ];

  // Fetch and seed data on mount/auth status changes
  useEffect(() => {
    const fetchCodingData = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);

      try {
        const [langRes, probRes, snipRes, noteRes, goalRes, resRes, topicRes, sessRes] = await Promise.all([
          codingApi.getLanguages(),
          codingApi.getProblems(),
          codingApi.getSnippets(),
          codingApi.getNotes(),
          codingApi.getGoals(),
          codingApi.getResources(),
          codingApi.getInterviewTopics(),
          codingApi.getSessions()
        ]);

        if (langRes.success) setLanguages(langRes.data.languages);
        if (probRes.success) setProblems(probRes.data.problems);
        if (snipRes.success) setSnippets(snipRes.data.snippets);
        if (noteRes.success) setNotes(noteRes.data.notes);
        if (goalRes.success) setGoals(goalRes.data.goals);
        if (resRes.success) setResources(resRes.data.resources);
        if (topicRes.success) setInterviewTopics(topicRes.data.interviewTopics);
        if (sessRes.success) setTimerLogs(sessRes.data.timerLogs);

        // Seeding trigger
        const alreadySeeded = localStorage.getItem('anshul_autopilot_coding_seeded');
        if (langRes.success && langRes.data.languages.length === 0 && !alreadySeeded) {
          console.log('[Coding Workspace] Seeding initial coding items...');
          
          const seedLangPromises = initialLanguages.map(l => codingApi.createLanguage(l));
          const seedProbPromises = initialProblems.map(p => codingApi.createProblem(p));
          const seedSnipPromises = initialSnippets.map(s => codingApi.createSnippet(s));
          const seedNotePromises = initialNotes.map(n => codingApi.createNote(n));
          const seedGoalPromises = initialGoals.map(g => codingApi.createGoal(g));
          const seedResPromises = initialResources.map(r => codingApi.createResource(r));
          const seedTopicPromises = initialInterviewTopics.map(t => codingApi.createInterviewTopic(t));

          await Promise.all([
            ...seedLangPromises,
            ...seedProbPromises,
            ...seedSnipPromises,
            ...seedNotePromises,
            ...seedGoalPromises,
            ...seedResPromises,
            ...seedTopicPromises
          ]);

          localStorage.setItem('anshul_autopilot_coding_seeded', 'true');

          // Re-fetch
          const [lR, pR, sR, nR, gR, rR, tR, seR] = await Promise.all([
            codingApi.getLanguages(),
            codingApi.getProblems(),
            codingApi.getSnippets(),
            codingApi.getNotes(),
            codingApi.getGoals(),
            codingApi.getResources(),
            codingApi.getInterviewTopics(),
            codingApi.getSessions()
          ]);

          if (lR.success) setLanguages(lR.data.languages);
          if (pR.success) setProblems(pR.data.problems);
          if (sR.success) setSnippets(sR.data.snippets);
          if (nR.success) setNotes(nR.data.notes);
          if (gR.success) setGoals(gR.data.goals);
          if (rR.success) setResources(rR.data.resources);
          if (tR.success) setInterviewTopics(tR.data.interviewTopics);
          if (seR.success) setTimerLogs(seR.data.timerLogs);
        }
      } catch (err) {
        console.error('[Coding Workspace Load Error] Failed to load coding data:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCodingData();
  }, [isAuthenticated]);

  // Keep a local storage cache for legacy reads fallback
  useEffect(() => {
    if (languages.length > 0 || problems.length > 0) {
      const dataToSave = {
        languages,
        problems,
        snippets,
        notes,
        goals,
        resources,
        interviewTopics,
        activeSession,
        timerLogs,
        stats: {
          solvedCount: problems.length,
          codingHours: stats.codingHours,
          currentStreak: stats.currentStreak
        }
      };
      localStorage.setItem('anshul_autopilot_coding_data_cache', JSON.stringify(dataToSave));
    }
  }, [languages, problems, snippets, notes, goals, resources, interviewTopics, activeSession, timerLogs, stats]);

  // Sync summary statistics dynamically
  useEffect(() => {
    const solved = problems.filter(p => p.status === 'Solved' || p.status === 'solved').length;
    const hours = timerLogs.reduce((acc, curr) => acc + (curr.durationMinutes / 60), 0);
    
    const syncSummary = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await codingApi.getCodingSummary();
        if (res.success && res.data) {
          setStats({
            solvedCount: res.data.solvedProblems,
            codingHours: parseFloat(hours.toFixed(1)),
            currentStreak: res.data.currentStreak
          });
        }
      } catch (err) {
        console.error('[Stats Sync Error] Failed to fetch summary:', err.message);
        setStats(prev => ({
          ...prev,
          solvedCount: solved,
          codingHours: parseFloat(hours.toFixed(1))
        }));
      }
    };
    syncSummary();
  }, [problems, timerLogs, isAuthenticated]);

  // CRUD actions handlers
  // Languages
  const handleAddLanguage = async (lang) => {
    try {
      const res = await codingApi.createLanguage(lang);
      if (res.success && res.data?.language) {
        setLanguages(prev => [...prev, res.data.language]);
      }
    } catch (err) {
      console.error('[Language Sync Error] Failed to create language:', err.message);
    }
  };
  const handleRemoveLanguage = async (id) => {
    try {
      const res = await codingApi.deleteLanguage(id);
      if (res.success) {
        setLanguages(prev => prev.filter(l => l.id !== id && l._id !== id));
      }
    } catch (err) {
      console.error('[Language Sync Error] Failed to delete language:', err.message);
    }
  };
  const handleUpdateLanguage = async (updated) => {
    const targetId = updated.id || updated._id;
    try {
      const res = await codingApi.updateLanguage(targetId, updated);
      if (res.success && res.data?.language) {
        setLanguages(prev => prev.map(l => ((l.id === targetId || l._id === targetId) ? res.data.language : l)));
      }
    } catch (err) {
      console.error('[Language Sync Error] Failed to update language:', err.message);
    }
  };

  // Problems
  const handleAddProblem = async (prob) => {
    try {
      const res = await codingApi.createProblem(prob);
      if (res.success && res.data?.problem) {
        setProblems(prev => [res.data.problem, ...prev]);
      }
    } catch (err) {
      console.error('[Problem Sync Error] Failed to create problem:', err.message);
    }
  };
  const handleDeleteProblem = async (id) => {
    try {
      const res = await codingApi.deleteProblem(id);
      if (res.success) {
        setProblems(prev => prev.filter(p => p.id !== id && p._id !== id));
      }
    } catch (err) {
      console.error('[Problem Sync Error] Failed to delete problem:', err.message);
    }
  };
  const handleUpdateProblem = async (updated) => {
    const targetId = updated.id || updated._id;
    try {
      const res = await codingApi.updateProblem(targetId, updated);
      if (res.success && res.data?.problem) {
        setProblems(prev => prev.map(p => ((p.id === targetId || p._id === targetId) ? res.data.problem : p)));
      }
    } catch (err) {
      console.error('[Problem Sync Error] Failed to update problem:', err.message);
    }
  };

  // Snippets
  const handleAddSnippet = async (snip) => {
    try {
      const res = await codingApi.createSnippet(snip);
      if (res.success && res.data?.snippet) {
        setSnippets(prev => [res.data.snippet, ...prev]);
      }
    } catch (err) {
      console.error('[Snippet Sync Error] Failed to create snippet:', err.message);
    }
  };
  const handleDeleteSnippet = async (id) => {
    try {
      const res = await codingApi.deleteSnippet(id);
      if (res.success) {
        setSnippets(prev => prev.filter(s => s.id !== id && s._id !== id));
      }
    } catch (err) {
      console.error('[Snippet Sync Error] Failed to delete snippet:', err.message);
    }
  };
  const handleUpdateSnippet = async (updated) => {
    const targetId = updated.id || updated._id;
    try {
      const res = await codingApi.updateSnippet(targetId, updated);
      if (res.success && res.data?.snippet) {
        setSnippets(prev => prev.map(s => ((s.id === targetId || s._id === targetId) ? res.data.snippet : s)));
      }
    } catch (err) {
      console.error('[Snippet Sync Error] Failed to update snippet:', err.message);
    }
  };

  // Notes
  const handleAddNote = async (note) => {
    try {
      const res = await codingApi.createNote(note);
      if (res.success && res.data?.note) {
        setNotes(prev => [res.data.note, ...prev]);
      }
    } catch (err) {
      console.error('[Note Sync Error] Failed to create note:', err.message);
    }
  };
  const handleDeleteNote = async (id) => {
    try {
      const res = await codingApi.deleteNote(id);
      if (res.success) {
        setNotes(prev => prev.filter(n => n.id !== id && n._id !== id));
      }
    } catch (err) {
      console.error('[Note Sync Error] Failed to delete note:', err.message);
    }
  };
  const handleUpdateNote = async (updated) => {
    const targetId = updated.id || updated._id;
    try {
      const res = await codingApi.updateNote(targetId, updated);
      if (res.success && res.data?.note) {
        setNotes(prev => prev.map(n => ((n.id === targetId || n._id === targetId) ? res.data.note : n)));
      }
    } catch (err) {
      console.error('[Note Sync Error] Failed to update note:', err.message);
    }
  };

  // Goals
  const handleAddGoal = async (goal) => {
    try {
      const res = await codingApi.createGoal(goal);
      if (res.success && res.data?.goal) {
        setGoals(prev => [res.data.goal, ...prev]);
      }
    } catch (err) {
      console.error('[Goal Sync Error] Failed to create goal:', err.message);
    }
  };
  const handleDeleteGoal = async (id) => {
    try {
      const res = await codingApi.deleteGoal(id);
      if (res.success) {
        setGoals(prev => prev.filter(g => g.id !== id && g._id !== id));
      }
    } catch (err) {
      console.error('[Goal Sync Error] Failed to delete goal:', err.message);
    }
  };
  const handleUpdateGoal = async (updated) => {
    const targetId = updated.id || updated._id;
    try {
      const res = await codingApi.updateGoal(targetId, updated);
      if (res.success && res.data?.goal) {
        setGoals(prev => prev.map(g => ((g.id === targetId || g._id === targetId) ? res.data.goal : g)));
      }
    } catch (err) {
      console.error('[Goal Sync Error] Failed to update goal:', err.message);
    }
  };

  // Resources
  const handleAddResource = async (resource) => {
    try {
      const res = await codingApi.createResource(resource);
      if (res.success && res.data?.resource) {
        setResources(prev => [res.data.resource, ...prev]);
      }
    } catch (err) {
      console.error('[Resource Sync Error] Failed to create resource:', err.message);
    }
  };
  const handleDeleteResource = async (id) => {
    try {
      const res = await codingApi.deleteResource(id);
      if (res.success) {
        setResources(prev => prev.filter(r => r.id !== id && r._id !== id));
      }
    } catch (err) {
      console.error('[Resource Sync Error] Failed to delete resource:', err.message);
    }
  };

  // Interview Topics
  const handleAddTopic = async (topic) => {
    try {
      const res = await codingApi.createInterviewTopic(topic);
      if (res.success && res.data?.interviewTopic) {
        setInterviewTopics(prev => [...prev, res.data.interviewTopic]);
      }
    } catch (err) {
      console.error('[Interview Sync Error] Failed to create topic:', err.message);
    }
  };
  const handleDeleteTopic = async (id) => {
    try {
      const res = await codingApi.deleteInterviewTopic(id);
      if (res.success) {
        setInterviewTopics(prev => prev.filter(t => t.id !== id && t._id !== id));
      }
    } catch (err) {
      console.error('[Interview Sync Error] Failed to delete topic:', err.message);
    }
  };
  const handleUpdateTopic = async (updated) => {
    const targetId = updated.id || updated._id;
    try {
      const res = await codingApi.updateInterviewTopic(targetId, updated);
      if (res.success && res.data?.interviewTopic) {
        setInterviewTopics(prev => prev.map(t => ((t.id === targetId || t._id === targetId) ? res.data.interviewTopic : t)));
      }
    } catch (err) {
      console.error('[Interview Sync Error] Failed to update topic:', err.message);
    }
  };

  // Session Logging
  const handleStartSession = (session) => {
    setActiveSession(session);
  };

  const handleEndSession = async (log) => {
    setActiveSession(null);
    if (log) {
      try {
        const res = await codingApi.createSession(log);
        if (res.success && res.data?.session) {
          setTimerLogs(prev => [res.data.session, ...prev]);
        }
      } catch (err) {
        console.error('[Session Logging Error] Failed to log coding session:', err.message);
      }
    }
  };

  // Switch helper
  const navigateToTab = (tabId) => setActiveTab(tabId);

  // Tab definitions
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
    { id: 'languages', label: 'Stack Manager', icon: <Terminal size={14} /> },
    { id: 'dsa', label: 'DSA Problem Tracker', icon: <Award size={14} /> },
    { id: 'timer', label: 'Focus Timer', icon: <Timer size={14} /> },
    { id: 'snippets', label: 'Code Snippets', icon: <Code size={14} /> },
    { id: 'notes', label: 'Coding Notes', icon: <FileText size={14} /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen size={14} /> },
    { id: 'goals', label: 'Coding Goals', icon: <Target size={14} /> },
    { id: 'interview', label: 'Interview Prep', icon: <Briefcase size={14} /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart2 size={14} /> },
    { id: 'search', label: 'Universal Search', icon: <Search size={14} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Top Banner Navigation Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Coding Workspace
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Manage your programming languages, track DSA coding problems, log focus times, and practice mock prep checklist.
        </p>
      </div>

      {/* Responsive Tab Bar Navigation links */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '6px',
        background: 'var(--glass-btn-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '8px',
        padding: '4px',
        maxWidth: '100%',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }} className="no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Tab Render viewport */}
      <div style={{ width: '100%' }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 0',
            color: 'var(--text-secondary)'
          }}>
            Loading coding workspace...
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <CodingDashboard 
                key={JSON.stringify(goals) + JSON.stringify(stats)}
                stats={stats} 
                goals={goals} 
                activeSession={activeSession} 
                onNavigate={navigateToTab} 
              />
            )}

            {activeTab === 'languages' && (
              <LanguageManager 
                key={JSON.stringify(languages)}
                languages={languages} 
                onAddLanguage={handleAddLanguage} 
                onRemoveLanguage={handleRemoveLanguage} 
                onUpdateLanguage={handleUpdateLanguage} 
              />
            )}

            {activeTab === 'dsa' && (
              <DSATracker 
                key={JSON.stringify(languages) + JSON.stringify(problems)}
                languages={languages}
                problems={problems}
                onAddProblem={handleAddProblem}
                onDeleteProblem={handleDeleteProblem}
                onUpdateProblem={handleUpdateProblem}
              />
            )}

            {activeTab === 'timer' && (
              <CodingTimer 
                activeSession={activeSession}
                onStartSession={handleStartSession}
                onEndSession={handleEndSession}
              />
            )}

            {activeTab === 'snippets' && (
              <SnippetManager 
                key={JSON.stringify(snippets)}
                snippets={snippets}
                onAddSnippet={handleAddSnippet}
                onDeleteSnippet={handleDeleteSnippet}
                onUpdateSnippet={handleUpdateSnippet}
              />
            )}

            {activeTab === 'notes' && (
              <CodingNotes 
                key={JSON.stringify(notes)}
                notes={notes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onUpdateNote={handleUpdateNote}
              />
            )}

            {activeTab === 'resources' && (
              <CodingResources 
                key={JSON.stringify(resources)}
                resources={resources}
                onAddResource={handleAddResource}
                onDeleteResource={handleDeleteResource}
              />
            )}

            {activeTab === 'goals' && (
              <CodingGoals 
                key={JSON.stringify(goals)}
                goals={goals}
                onAddGoal={handleAddGoal}
                onDeleteGoal={handleDeleteGoal}
                onUpdateGoal={handleUpdateGoal}
              />
            )}

            {activeTab === 'interview' && (
              <InterviewPreparation 
                key={JSON.stringify(interviewTopics)}
                topics={interviewTopics}
                onAddTopic={handleAddTopic}
                onDeleteTopic={handleDeleteTopic}
                onUpdateTopic={handleUpdateTopic}
              />
            )}

            {activeTab === 'stats' && (
              <CodingStatistics 
                key={JSON.stringify(stats) + JSON.stringify(problems)}
                stats={stats}
                languages={languages}
                problems={problems}
                timerLogs={timerLogs}
              />
            )}

            {activeTab === 'search' && (
              <CodingSearch 
                problems={problems}
                snippets={snippets}
                notes={notes}
                languages={languages}
                onNavigate={navigateToTab}
              />
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default CodingWorkspace;
