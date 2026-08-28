import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProjectDashboard from './projects/ProjectDashboard';
import CreateProject from './projects/CreateProject';
import ProjectDetails from './projects/ProjectDetails';
import ProjectTasks from './projects/ProjectTasks';
import Milestones from './projects/Milestones';
import Timeline from './projects/Timeline';
import Documentation from './projects/Documentation';
import Resources from './projects/Resources';
import BugTracker from './projects/BugTracker';
import DeploymentTracker from './projects/DeploymentTracker';
import VersionHistory from './projects/VersionHistory';
import ProjectAnalytics from './projects/ProjectAnalytics';
import ProjectSearch from './projects/ProjectSearch';
import projectApi from '../services/api/projectApi';
import { useAuth } from '../contexts/AuthContext';

import { 
  ChevronLeft, 
  Trash2,
  FolderOpen, 
  CheckSquare, 
  Calendar, 
  Map, 
  FileText, 
  Link, 
  ShieldAlert, 
  Server, 
  Tag, 
  BarChart2, 
  Search 
} from 'lucide-react';
import Button from '../components/Button';

const Projects = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveSubTab(location.state.tab);
    }
  }, [location]);

  // Prepopulated dummy projects for initial seed
  const initialProjects = [
    {
      name: 'Anshul AutoPilot OS',
      description: 'A modular, dashboard productivity operating system that integrates calendar planners, DSA timers, and note wikis.',
      category: 'Web Development',
      techStack: ['React', 'Vite', 'CSS3', 'Lucide-react', 'Local Storage'],
      startDate: '2026-08-01',
      deadline: '2026-09-15',
      priority: 'High',
      status: 'In Progress',
      version: 'v1.0.0',
      progress: 80,
      tasks: [
        { id: 11, title: 'Refactor Core Layout Layouts', description: 'Introduce Sidebar drawer toggle rules.', priority: 'High', deadline: '2026-08-10', status: 'done', subtasks: [] },
        { id: 12, title: 'Implement Phase 7 DSA modules', description: 'Log timer sessions and codes.', priority: 'Critical', deadline: '2026-08-20', status: 'done', subtasks: [] },
        { id: 13, title: 'Draft Phase 8 project workspace', description: 'Create bug tickets and Scrum grids.', priority: 'High', deadline: '2026-08-30', status: 'in-progress', subtasks: [] }
      ],
      milestones: [
        { id: 1, title: 'Planning & Layout Architecture', dueDate: '2026-08-05', status: 'completed', progress: 100 },
        { id: 2, title: 'Task and Study Hub Modules', dueDate: '2026-08-18', status: 'completed', progress: 100 },
        { id: 3, title: 'Project Management Workspace', dueDate: '2026-08-30', status: 'pending', progress: 60 }
      ],
      docs: [
        { id: 1, type: 'README', content: '# Anshul AutoPilot OS\n\nModular design blueprint workspace.' },
        { id: 2, type: 'Playbook', content: '## Sprint Playbook rules\n\nFollow Phase 8 definitions.' }
      ],
      resources: [
        { id: 1, name: 'Vite Compiler Specs', type: 'GitHub link', url: 'https://github.com/vitejs/vite' }
      ],
      bugs: [
        { id: 1, title: 'Active session timing lost on layout toggle', description: 'Keep timer state in parent component.', severity: 'Major', module: 'Core', status: 'In Progress', date: '2026-08-22' }
      ],
      deployments: [
        { id: 1, env: 'Development', platform: 'Vercel', url: 'https://dev-autopilot.vercel.app', version: 'v1.0.0-beta', date: '2026-08-15' }
      ],
      releases: [
        { id: 1, version: 'v1.0.0-beta', date: '2026-08-15', releaseNotes: 'Setup staging environments.' }
      ]
    }
  ];

  // Load from backend Mongoose
  useEffect(() => {
    const fetchProjects = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);

      try {
        const res = await projectApi.getProjects();
        if (res.success && res.data?.projects) {
          setProjects(res.data.projects);

          // One-time seeding if empty
          const alreadySeeded = localStorage.getItem('anshul_autopilot_projects_seeded');
          if (res.data.projects.length === 0 && !alreadySeeded) {
            console.log('[Projects] Seeding initial projects...');
            const seedPromises = initialProjects.map(p => projectApi.createProject(p));
            await Promise.all(seedPromises);
            localStorage.setItem('anshul_autopilot_projects_seeded', 'true');
            
            const reFetchRes = await projectApi.getProjects();
            if (reFetchRes.success && reFetchRes.data?.projects) {
              setProjects(reFetchRes.data.projects);
            }
          }
        }
      } catch (err) {
        console.error('[Projects Load Error] Failed to load projects:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated]);

  // Keep a local storage cache for legacy reads
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('anshul_autopilot_projects_data_cache', JSON.stringify(projects));
    }
  }, [projects]);

  // CRUD handlers
  const handleCreateProject = async (newProj) => {
    try {
      const res = await projectApi.createProject(newProj);
      if (res.success && res.data?.project) {
        setProjects(prev => [...prev, res.data.project]);
      }
    } catch (err) {
      console.error('[Projects Sync Error] Failed to create project:', err.message);
    }
    setShowCreateModal(false);
  };

  const handleUpdateProject = async (updatedProj) => {
    const targetId = updatedProj.id || updatedProj._id;
    try {
      const res = await projectApi.updateProject(targetId, updatedProj);
      if (res.success && res.data?.project) {
        const savedProject = res.data.project;
        setProjects(prev => prev.map(p => ((p.id === targetId || p._id === targetId) ? savedProject : p)));
        setSelectedProject(savedProject);
      }
    } catch (err) {
      console.error('[Projects Sync Error] Failed to update project:', err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project? All associated tasks, bugs, and documentation will be lost permanently.")) {
      try {
        const res = await projectApi.deleteProject(id);
        if (res.success) {
          setProjects(prev => prev.filter(p => p.id !== id && p._id !== id));
          setSelectedProject(null);
        }
      } catch (err) {
        console.error('[Projects Sync Error] Failed to delete project:', err.message);
      }
    }
  };

  const handleSelectProject = (proj) => {
    setSelectedProject(proj);
    setActiveSubTab('overview');
  };

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: <FolderOpen size={13} /> },
    { id: 'tasks', label: 'Scrum Board', icon: <CheckSquare size={13} /> },
    { id: 'milestones', label: 'Milestones', icon: <Calendar size={13} /> },
    { id: 'timeline', label: 'Roadmap', icon: <Map size={13} /> },
    { id: 'docs', label: 'Documentation', icon: <FileText size={13} /> },
    { id: 'resources', label: 'Design Assets', icon: <Link size={13} /> },
    { id: 'bugs', label: 'Bug Tracker', icon: <ShieldAlert size={13} /> },
    { id: 'deployments', label: 'Pipelines', icon: <Server size={13} /> },
    { id: 'releases', label: 'Changelog', icon: <Tag size={13} /> },
    { id: 'analytics', label: 'Velocity', icon: <BarChart2 size={13} /> },
    { id: 'search', label: 'Search', icon: <Search size={13} /> }
  ];

  const currentProjectId = selectedProject ? (selectedProject.id || selectedProject._id) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      {/* Title Header */}
      {!selectedProject && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Project Manager
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Track details, priority labels, timelines, scrum boards, bug registers, and release history notes.
          </p>
        </div>
      )}

      {/* Selected Project Navigation Header */}
      {selectedProject && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button 
              variant="glass" 
              size="sm" 
              onClick={() => setSelectedProject(null)}
              iconLeft={<ChevronLeft size={16} />}
              style={{ padding: '6px 12px' }}
            >
              Back
            </Button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                📁 {selectedProject.name}
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Stack tools: {selectedProject.techStack?.join(', ') || 'No tech stack logged'}
              </span>
            </div>
          </div>

          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDeleteProject(currentProjectId)}
            iconLeft={<Trash2 size={14} />}
            style={{ padding: '6px 12px' }}
          >
            Delete Project
          </Button>
        </div>
      )}

      {/* Main View rendering */}
      {isLoading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 0',
          color: 'var(--text-secondary)'
        }}>
          Loading projects...
        </div>
      ) : (
        <>
          {!selectedProject ? (
            <ProjectDashboard 
              projects={projects}
              onSelectProject={handleSelectProject}
              onCreateTrigger={() => setShowCreateModal(true)}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Sub Tab selector */}
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
                {subTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: activeSubTab === tab.id ? 'var(--color-primary)' : 'transparent',
                      color: activeSubTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
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

              {/* Sub tab details render box */}
              <div style={{ width: '100%' }}>
                {activeSubTab === 'overview' && (
                  <ProjectDetails 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                    onUpdateProject={handleUpdateProject} 
                  />
                )}

                {activeSubTab === 'tasks' && (
                  <ProjectTasks 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                    onUpdateProject={handleUpdateProject} 
                  />
                )}

                {activeSubTab === 'milestones' && (
                  <Milestones 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                    onUpdateProject={handleUpdateProject} 
                  />
                )}

                {activeSubTab === 'timeline' && (
                  <Timeline 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                  />
                )}

                {activeSubTab === 'docs' && (
                  <Documentation 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                    onUpdateProject={handleUpdateProject} 
                  />
                )}

                {activeSubTab === 'resources' && (
                  <Resources 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                    onUpdateProject={handleUpdateProject} 
                  />
                )}

                {activeSubTab === 'bugs' && (
                  <BugTracker 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                    onUpdateProject={handleUpdateProject} 
                  />
                )}

                {activeSubTab === 'deployments' && (
                  <DeploymentTracker 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                    onUpdateProject={handleUpdateProject} 
                  />
                )}

                {activeSubTab === 'releases' && (
                  <VersionHistory 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                    onUpdateProject={handleUpdateProject} 
                  />
                )}

                {activeSubTab === 'analytics' && (
                  <ProjectAnalytics 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                  />
                )}

                {activeSubTab === 'search' && (
                  <ProjectSearch 
                    key={currentProjectId + activeSubTab}
                    project={selectedProject} 
                    onNavigateTab={(tab) => setActiveSubTab(tab)}
                  />
                )}
              </div>

            </div>
          )}
        </>
      )}

      {/* Creation Modal Form */}
      {showCreateModal && (
        <CreateProject 
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

    </div>
  );
};

export default Projects;
