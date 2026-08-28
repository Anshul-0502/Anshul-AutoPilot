import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Subjects from './study/Subjects';
import NotesManager from './study/NotesManager';
import NoteEditor from './study/NoteEditor';
import PDFLibrary from './study/PDFLibrary';
import ResourceManager from './study/ResourceManager';
import Bookmarks from './study/Bookmarks';
import CourseTracker from './study/CourseTracker';
import RevisionPlanner from './study/RevisionPlanner';
import StudySession from './study/StudySession';
import Favorites from './study/Favorites';
import StudyStatistics from './study/StudyStatistics';
import StudySearch from './study/StudySearch';
import studyApi from '../services/api/studyApi';
import { useAuth } from '../contexts/AuthContext';

import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  File, 
  Link as LinkIcon, 
  Award, 
  Clock, 
  Star, 
  Search, 
  LayoutDashboard 
} from 'lucide-react';

const initialMockSubjects = [
  { name: 'Computer Networks', description: 'Subnetting, OSI layers, routing, TCP/UDP sockets', color: 'purple', studyGoal: '4h/week', progress: 70, favorite: true },
  { name: 'Operating Systems', description: 'Processes, memory management, file systems, threads', color: 'blue', studyGoal: '3h/week', progress: 45, favorite: false },
  { name: 'Mathematics III', description: 'Linear algebra, numerical methods, probability', color: 'amber', studyGoal: '2h/week', progress: 85, favorite: false }
];

const initialMockNotes = [
  { title: 'OSI Model Summary Layer-wise', subject: 'Computer Networks', content: 'Overview of the 7 layers:\n- Physical: Raw bits over medium\n- Data Link: Frame delivery, MAC addressing\n- Network: IP addressing & routing packets\n- Transport: End-to-end TCP/UDP reliability\n- Session: Interprocess dialog management\n- Presentation: Data formats, encryption, compression\n- Application: Network service interfaces (HTTP, DNS)', tags: ['networks', 'osi', 'revision'], pinned: true, favorite: true },
  { title: 'Process Scheduling Algorithms', subject: 'Operating Systems', content: 'Short summary of major scheduling principles:\n1. First-Come First-Served (FCFS): Non-preemptive, simple, prone to convoy effect\n2. Process Scheduling SJF: Optimal average waiting time\n3. Round Robin (RR): Preemptive using time-slices', tags: ['os', 'scheduling', 'cpu'], pinned: false, favorite: false }
];

const initialMockPdfs = [
  { title: 'Computer Networks 5th Ed', subject: 'Computer Networks', currentPage: 84, totalPages: 450, lastOpened: 'Yesterday' },
  { title: 'Operating Systems Principles', subject: 'Operating Systems', currentPage: 12, totalPages: 320, lastOpened: '3 days ago' },
  { title: 'Intro to Algorithms (CLRS)', subject: 'Mathematics III', currentPage: 180, totalPages: 980, lastOpened: 'Today' }
];

const initialMockResources = [
  { title: 'GeeksforGeeks IP Subnetting Tutorial', url: 'https://www.geeksforgeeks.org/ip-subnetting-gq/', subject: 'Computer Networks', type: 'Website', favorite: true },
  { title: 'Vim Cheat Sheet Guide', url: 'https://vim.rtorr.com/', subject: 'Operating Systems', type: 'Documentation', favorite: false }
];

const initialMockCourses = [
  {
    title: 'Master React & Next.js 15',
    subject: 'Computer Networks',
    estimatedHours: '20 Hrs',
    modules: [
      { title: 'Module 1: Environment Setup', completed: true },
      { title: 'Module 2: Server Components & Actions', completed: true },
      { title: 'Module 3: Middleware API configuration', completed: false }
    ],
    progress: 67
  }
];

const initialMockRevisions = [
  { topic: 'Subnet Masks & IP routing', subject: 'Computer Networks', interval: 'Weekly', dueDate: '8/20/2026', status: 'upcoming' },
  { topic: 'Page Fault Replacement Algos', subject: 'Operating Systems', interval: 'Monthly', dueDate: '8/25/2026', status: 'upcoming' }
];

const initialMockSessions = [
  { subject: 'Computer Networks', type: 'Reading', durationSeconds: 5400, durationText: '1.5h', date: '8/13/2026' },
  { subject: 'Operating Systems', type: 'Practice', durationSeconds: 7200, durationText: '2.0h', date: '8/14/2026' }
];

const StudyHub = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location]);

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [activeNote, setActiveNote] = useState(null);

  // Mapped States
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE SEEDING & SYNCS ---
  useEffect(() => {
    const fetchStudyData = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);

      try {
        const [subRes, noteRes, pdfRes, resRes, courseRes, revRes, sessRes] = await Promise.all([
          studyApi.getSubjects(),
          studyApi.getNotes(),
          studyApi.getPdfs(),
          studyApi.getResources(),
          studyApi.getCourses(),
          studyApi.getRevisions(),
          studyApi.getSessions()
        ]);

        if (subRes.success) setSubjects(subRes.data.subjects);
        if (noteRes.success) setNotes(noteRes.data.notes);
        if (pdfRes.success) setPdfs(pdfRes.data.pdfs);
        if (resRes.success) setResources(resRes.data.resources);
        if (courseRes.success) setCourses(courseRes.data.courses);
        if (revRes.success) setRevisions(revRes.data.revisions);
        if (sessRes.success) setSessions(sessRes.data.sessions);

        // One-time seeding if subjects is empty
        const alreadySeeded = localStorage.getItem('anshul_autopilot_study_seeded');
        if (subRes.success && subRes.data.subjects.length === 0 && !alreadySeeded) {
          console.log('[Study Hub] Seeding initial study items...');
          
          // Seed subjects first
          const seedSubPromises = initialMockSubjects.map(s => studyApi.createSubject(s));
          await Promise.all(seedSubPromises);
          
          // Seed rest in parallel
          const seedNotePromises = initialMockNotes.map(n => studyApi.createNote(n));
          const seedPdfPromises = initialMockPdfs.map(p => studyApi.createPdf(p));
          const seedResPromises = initialMockResources.map(r => studyApi.createResource(r));
          const seedCoursePromises = initialMockCourses.map(c => studyApi.createCourse(c));
          const seedRevPromises = initialMockRevisions.map(rev => studyApi.createRevision(rev));
          const seedSessPromises = initialMockSessions.map(sess => studyApi.createSession(sess));

          await Promise.all([
            ...seedNotePromises,
            ...seedPdfPromises,
            ...seedResPromises,
            ...seedCoursePromises,
            ...seedRevPromises,
            ...seedSessPromises
          ]);

          localStorage.setItem('anshul_autopilot_study_seeded', 'true');

          // Re-fetch all
          const [sR, nR, pR, rR, cR, vR, sS] = await Promise.all([
            studyApi.getSubjects(),
            studyApi.getNotes(),
            studyApi.getPdfs(),
            studyApi.getResources(),
            studyApi.getCourses(),
            studyApi.getRevisions(),
            studyApi.getSessions()
          ]);

          if (sR.success) setSubjects(sR.data.subjects);
          if (nR.success) setNotes(nR.data.notes);
          if (pR.success) setPdfs(pR.data.pdfs);
          if (rR.success) setResources(rR.data.resources);
          if (cR.success) setCourses(cR.data.courses);
          if (vR.success) setRevisions(vR.data.revisions);
          if (sS.success) setSessions(sS.data.sessions);
        }
      } catch (err) {
        console.error('[Study Hub Load Error] Failed to load study data:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyData();
  }, [isAuthenticated]);

  // Keep a local storage cache of datasets for fallback reads
  useEffect(() => {
    if (subjects.length > 0) localStorage.setItem('autopilot-study-subjects-cache', JSON.stringify(subjects));
    if (notes.length > 0) localStorage.setItem('autopilot-study-notes-cache', JSON.stringify(notes));
    if (pdfs.length > 0) localStorage.setItem('autopilot-study-pdfs-cache', JSON.stringify(pdfs));
    if (resources.length > 0) localStorage.setItem('autopilot-study-resources-cache', JSON.stringify(resources));
    if (courses.length > 0) localStorage.setItem('autopilot-study-courses-cache', JSON.stringify(courses));
    if (revisions.length > 0) localStorage.setItem('autopilot-study-revisions-cache', JSON.stringify(revisions));
    if (sessions.length > 0) localStorage.setItem('autopilot-study-sessions-cache', JSON.stringify(sessions));
  }, [subjects, notes, pdfs, resources, courses, revisions, sessions]);

  // --- REUSABLE DISPATCH ACTIONS ---
  
  const handleAddSubject = async (newSub) => {
    try {
      const res = await studyApi.createSubject(newSub);
      if (res.success && res.data?.subject) {
        setSubjects(prev => [...prev, res.data.subject]);
      }
    } catch (err) {
      console.error('[Subject Add Error] Failed to create subject:', err.message);
    }
  };

  const handleAddNote = async (newNote) => {
    const targetId = newNote.id || newNote._id;
    try {
      if (targetId) {
        const res = await studyApi.updateNote(targetId, newNote);
        if (res.success && res.data?.note) {
          setNotes(prev => prev.map(n => ((n.id === targetId || n._id === targetId) ? res.data.note : n)));
        }
      } else {
        const res = await studyApi.createNote(newNote);
        if (res.success && res.data?.note) {
          setNotes(prev => [res.data.note, ...prev]);
        }
      }
    } catch (err) {
      console.error('[Note Sync Error] Failed to save note:', err.message);
    }
    setIsEditingNote(false);
    setActiveNote(null);
  };

  const handleEditNoteClick = (note) => {
    setActiveNote(note);
    setIsEditingNote(true);
  };

  const handleDeleteNote = async (id) => {
    try {
      const res = await studyApi.deleteNote(id);
      if (res.success) {
        setNotes(prev => prev.filter(n => n.id !== id && n._id !== id));
      }
    } catch (err) {
      console.error('[Note Sync Error] Failed to delete note:', err.message);
    }
  };

  const handleAddResource = async (newRes) => {
    try {
      const res = await studyApi.createResource(newRes);
      if (res.success && res.data?.resource) {
        setResources(prev => [res.data.resource, ...prev]);
      }
    } catch (err) {
      console.error('[Resource Sync Error] Failed to create resource:', err.message);
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      const res = await studyApi.deleteResource(id);
      if (res.success) {
        setResources(prev => prev.filter(r => r.id !== id && r._id !== id));
      }
    } catch (err) {
      console.error('[Resource Sync Error] Failed to delete resource:', err.message);
    }
  };

  const handleToggleFavoriteResource = async (id) => {
    const resItem = resources.find(r => r.id === id || r._id === id);
    if (!resItem) return;
    const targetId = resItem.id || resItem._id;
    try {
      const res = await studyApi.updateResource(targetId, { favorite: !resItem.favorite });
      if (res.success && res.data?.resource) {
        setResources(prev => prev.map(r => ((r.id === targetId || r._id === targetId) ? res.data.resource : r)));
      }
    } catch (err) {
      console.error('[Resource Sync Error] Failed to toggle favorite:', err.message);
    }
  };

  const handleAddCourse = async (newCourse) => {
    try {
      const res = await studyApi.createCourse(newCourse);
      if (res.success && res.data?.course) {
        setCourses(prev => [...prev, res.data.course]);
      }
    } catch (err) {
      console.error('[Course Sync Error] Failed to create course:', err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      const res = await studyApi.deleteCourse(id);
      if (res.success) {
        setCourses(prev => prev.filter(c => c.id !== id && c._id !== id));
      }
    } catch (err) {
      console.error('[Course Sync Error] Failed to delete course:', err.message);
    }
  };

  const handleUpdateCourse = async (updatedCourse) => {
    const targetId = updatedCourse.id || updatedCourse._id;
    try {
      const res = await studyApi.updateCourse(targetId, updatedCourse);
      if (res.success && res.data?.course) {
        setCourses(prev => prev.map(c => ((c.id === targetId || c._id === targetId) ? res.data.course : c)));
      }
    } catch (err) {
      console.error('[Course Sync Error] Failed to update course:', err.message);
    }
  };

  const handleAddRevision = async (newRev) => {
    try {
      const res = await studyApi.createRevision(newRev);
      if (res.success && res.data?.revision) {
        setRevisions(prev => [res.data.revision, ...prev]);
      }
    } catch (err) {
      console.error('[Revision Sync Error] Failed to create revision:', err.message);
    }
  };

  const handleCompleteRevision = async (id) => {
    try {
      const res = await studyApi.updateRevision(id, { status: 'completed' });
      if (res.success && res.data?.revision) {
        setRevisions(prev => prev.map(r => ((r.id === id || r._id === id) ? res.data.revision : r)));
      }
    } catch (err) {
      console.error('[Revision Sync Error] Failed to complete revision:', err.message);
    }
  };

  const handleDeleteRevision = async (id) => {
    try {
      const res = await studyApi.deleteRevision(id);
      if (res.success) {
        setRevisions(prev => prev.filter(r => r.id !== id && r._id !== id));
      }
    } catch (err) {
      console.error('[Revision Sync Error] Failed to delete revision:', err.message);
    }
  };

  const handleSaveSession = async (newSession) => {
    try {
      const res = await studyApi.createSession(newSession);
      if (res.success && res.data?.session) {
        setSessions(prev => [...prev, res.data.session]);
      }

      // Increment progress slightly on session log
      const timeInMins = Math.round(newSession.durationSeconds / 60);
      if (timeInMins > 0) {
        const matchingSub = subjects.find(subj => subj.name.toLowerCase() === newSession.subject.toLowerCase());
        if (matchingSub) {
          const targetId = matchingSub.id || matchingSub._id;
          const increment = Math.min(100 - matchingSub.progress, Math.max(2, Math.round(timeInMins / 30)));
          const updatedProgress = matchingSub.progress + increment;
          const subRes = await studyApi.updateSubject(targetId, { progress: updatedProgress });
          if (subRes.success && subRes.data?.subject) {
            setSubjects(prev => prev.map(s => ((s.id === targetId || s._id === targetId) ? subRes.data.subject : s)));
          }
        }
      }
    } catch (err) {
      console.error('[Session Sync Error] Failed to log study session:', err.message);
    }
  };

  const handleUpdatePdfs = async (updatedPdfs) => {
    if (updatedPdfs.length > pdfs.length) {
      const newPdf = updatedPdfs[0];
      try {
        const res = await studyApi.createPdf(newPdf);
        if (res.success && res.data?.pdf) {
          setPdfs(prev => [res.data.pdf, ...prev]);
        }
      } catch (err) {
        console.error('[PDF Sync Error] Failed to register PDF:', err.message);
      }
    } else {
      const modifiedPdf = updatedPdfs.find(newP => {
        const oldP = pdfs.find(p => (p.id === newP.id || p._id === newP.id));
        return oldP && (oldP.currentPage !== newP.currentPage || oldP.title !== newP.title);
      });

      if (modifiedPdf) {
        const targetId = modifiedPdf.id || modifiedPdf._id;
        try {
          const res = await studyApi.updatePdf(targetId, modifiedPdf);
          if (res.success && res.data?.pdf) {
            setPdfs(prev => prev.map(p => ((p.id === targetId || p._id === targetId) ? res.data.pdf : p)));
          }
        } catch (err) {
          console.error('[PDF Sync Error] Failed to update PDF progress:', err.message);
        }
      }
    }
  };

  const handleNavigateToTab = (tab) => {
    setActiveTab(tab);
    setIsEditingNote(false);
  };

  // Sidebar Tabs Config
  const tabs = [
    { id: 'dashboard', label: 'Dashboard & Stats', icon: <LayoutDashboard size={16} /> },
    { id: 'subjects', label: 'Subject Modules', icon: <GraduationCap size={16} /> },
    { id: 'notes', label: 'Study Notes', icon: <FileText size={16} /> },
    { id: 'pdfs', label: 'PDF Shelf', icon: <File size={16} /> },
    { id: 'resources', label: 'Web Bookmarks', icon: <LinkIcon size={16} /> },
    { id: 'courses', label: 'Course Trackers', icon: <Award size={16} /> },
    { id: 'revisions', label: 'Spacing Planner', icon: <Clock size={16} /> },
    { id: 'favorites', label: 'Favorites Shelf', icon: <Star size={16} /> },
    { id: 'search', label: 'Universal Search', icon: <Search size={16} /> }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      minHeight: 'calc(100vh - 80px)',
      gap: '24px',
      padding: '24px',
      maxWidth: '1440px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      
      {/* Sidebar Navigation */}
      <div 
        className="glass-card"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          height: 'fit-content'
        }}
      >
        <div style={{ padding: '8px 12px 16px 12px', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 Study Hub
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LEARNING MANAGEMENT SYSTEM</span>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleNavigateToTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === tab.id ? 'var(--color-primary-glow)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              className="hover-scale"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Display */}
      <div 
        className="glass-card animate-slide-up"
        style={{
          padding: '24px',
          boxSizing: 'border-box',
          height: '100%',
          overflowY: 'auto'
        }}
      >
        {isLoading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 0',
            color: 'var(--text-secondary)'
          }}>
            Loading study hub datasets...
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <StudySession 
                  subjects={subjects} 
                  sessions={sessions} 
                  onSaveSession={handleSaveSession} 
                />
                <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: 0 }} />
                <StudyStatistics 
                  subjects={subjects} 
                  notes={notes} 
                  pdfs={pdfs} 
                  resources={resources} 
                  courses={courses} 
                  sessions={sessions} 
                />
              </div>
            )}

            {activeTab === 'subjects' && (
              <Subjects 
                subjects={subjects} 
                notes={notes} 
                onAddSubject={handleAddSubject}
                onSelectSubject={(name) => {
                  setActiveTab('notes');
                }}
              />
            )}

            {activeTab === 'notes' && (
              isEditingNote ? (
                <NoteEditor 
                  activeNote={activeNote}
                  subjects={subjects}
                  onSave={handleAddNote}
                  onCancel={() => {
                    setIsEditingNote(false);
                    setActiveNote(null);
                  }}
                />
              ) : (
                <NotesManager 
                  notes={notes}
                  onEdit={handleEditNoteClick}
                  onDelete={handleDeleteNote}
                  onAddClick={() => {
                    setActiveNote(null);
                    setIsEditingNote(true);
                  }}
                />
              )
            )}

            {activeTab === 'pdfs' && (
              <PDFLibrary 
                subjects={subjects} 
                pdfs={pdfs}
                onUpdatePdfs={handleUpdatePdfs}
              />
            )}

            {activeTab === 'resources' && (
              <ResourceManager 
                subjects={subjects}
                resources={resources}
                onAddResource={handleAddResource}
                onDeleteResource={handleDeleteResource}
                onToggleFavorite={handleToggleFavoriteResource}
              />
            )}

            {activeTab === 'courses' && (
              <CourseTracker 
                subjects={subjects}
                courses={courses}
                onAddCourse={handleAddCourse}
                onDeleteCourse={handleDeleteCourse}
                onUpdateCourse={handleUpdateCourse}
              />
            )}

            {activeTab === 'revisions' && (
              <RevisionPlanner 
                subjects={subjects}
                revisions={revisions}
                onAddRevision={handleAddRevision}
                onCompleteRevision={handleCompleteRevision}
                onDeleteRevision={handleDeleteRevision}
              />
            )}

            {activeTab === 'favorites' && (
              <Favorites 
                notes={notes}
                pdfs={pdfs}
                resources={resources}
                courses={courses}
                onNavigate={handleNavigateToTab}
              />
            )}

            {activeTab === 'search' && (
              <StudySearch 
                subjects={subjects}
                notes={notes}
                pdfs={pdfs}
                resources={resources}
                courses={courses}
                onNavigate={handleNavigateToTab}
              />
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default StudyHub;
