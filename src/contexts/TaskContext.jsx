import React, { createContext, useState, useEffect } from 'react';
import taskApi from '../services/api/taskApi';
import { useAuth } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load tasks on authentication status changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!isAuthenticated) {
        setTasks([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await taskApi.getTasks();
        if (res.success && res.data?.tasks) {
          setTasks(res.data.tasks);
        }
      } catch (err) {
        console.warn('[Task Context Load Warning] Failed to load tasks from backend. Falling back to local storage cache.', err.message);
        const saved = localStorage.getItem('anshul_autopilot_tasks_data');
        if (saved) {
          try {
            setTasks(JSON.parse(saved));
          } catch (e) {
            console.error('Failed to parse cached tasks', e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [isAuthenticated]);

  // Keep a local storage cache of tasks for fallback reads
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      localStorage.setItem('anshul_autopilot_tasks_data_cache', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = async (taskData) => {
    setIsLoading(true);
    try {
      const res = await taskApi.createTask(taskData);
      if (res.success && res.data?.task) {
        const savedTask = res.data.task;
        setTasks((prev) => [savedTask, ...prev]);
        return savedTask;
      }
    } catch (err) {
      console.error('[Task Sync Error] Failed to create task:', err.message);
      setError('Failed to create task on the server.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (updatedTask) => {
    setIsLoading(true);
    const targetId = updatedTask.id || updatedTask._id;
    try {
      const res = await taskApi.updateTask(targetId, updatedTask);
      if (res.success && res.data?.task) {
        const savedTask = res.data.task;
        setTasks((prev) => prev.map((t) => ((t.id === targetId || t._id === targetId) ? savedTask : t)));
      }
    } catch (err) {
      console.error('[Task Sync Error] Failed to update task:', err.message);
      setError('Failed to update task on the server.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setIsLoading(true);
    try {
      const res = await taskApi.deleteTask(id);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));
      }
    } catch (err) {
      console.error('[Task Sync Error] Failed to delete task:', err.message);
      setError('Failed to delete task on the server.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCompleteTask = async (id) => {
    setIsLoading(true);
    try {
      const res = await taskApi.toggleTaskComplete(id);
      if (res.success && res.data?.task) {
        const savedTask = res.data.task;
        setTasks((prev) =>
          prev.map((t) => ((t.id === id || t._id === id) ? savedTask : t))
        );
      }
    } catch (err) {
      console.error('[Task Sync Error] Failed to toggle task completion:', err.message);
      setError('Failed to update task completion on the server.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        isLoading,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleCompleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
