import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SpeechRecognitionManager,
  SpeechSynthesisManager,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported
} from '../services/SpeechService';
import { parseCommand, parseMultiCommand, getRandomReply, INTENTS } from '../services/CommandService';
import { TaskContext } from './TaskContext';
import { useAuth } from './AuthContext';
import aiApi from '../services/api/aiApi';
import userApi from '../services/api/userApi';
import dashboardApi from '../services/api/dashboardApi';
import taskApi from '../services/api/taskApi';

export const AIAssistantContext = createContext();

export const AIAssistantProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'speaking' | 'success' | 'error' | 'navigating' | 'executing'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello Boss! I am Anshul AI. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [preferences, setPreferences] = useState(null);

  const [pendingAction, setPendingAction] = useState(null);
  const pendingActionRef = useRef(null);

  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const statusRef = useRef(status);

  const navigate = useNavigate();
  const { tasks, addTask, deleteTask, toggleCompleteTask } = useContext(TaskContext);

  // Keep statusRef updated to avoid stale closures in event listeners
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Load chat history and preferences from database on mount or login
  useEffect(() => {
    const fetchChatLogsAndPrefs = async () => {
      if (!isAuthenticated) return;
      try {
        const [chatRes, prefRes] = await Promise.all([
          aiApi.getChatHistory(),
          userApi.getPreferences()
        ]);
        if (chatRes.success && chatRes.data && chatRes.data.length > 0) {
          setMessages(chatRes.data);
        }
        if (prefRes.success && prefRes.data?.preferences) {
          setPreferences(prefRes.data.preferences);
        }
      } catch (err) {
        console.warn('[AIAssistantContext Load Warning] Could not load chat logs/preferences from backend.', err.message);
      }
    };
    fetchChatLogsAndPrefs();
  }, [isAuthenticated]);

  // Refresh preferences on drawer open to fetch updated accent, sound alerts, or voice speaker preferences
  useEffect(() => {
    const refreshPreferences = async () => {
      if (isOpen && isAuthenticated) {
        try {
          const res = await userApi.getPreferences();
          if (res.success && res.data?.preferences) {
            setPreferences(res.data.preferences);
          }
        } catch (err) {
          console.warn('[AIAssistantContext Refresh Warning] Could not refresh preferences.', err.message);
        }
      }
    };
    refreshPreferences();
  }, [isOpen, isAuthenticated]);

  // Ref to hold addMessage and prevent stale closures
  const addMessageRef = useRef(null);
  useEffect(() => {
    addMessageRef.current = async (sender, text) => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage = {
        id: Date.now(),
        sender,
        text,
        timestamp
      };
      setMessages((prev) => [...prev, newMessage]);

      // Persist message to database
      if (isAuthenticated) {
        try {
          await aiApi.saveChatMessage(sender, text, timestamp);
        } catch (err) {
          console.error('[AIAssistantContext] Failed to persist message:', err.message);
        }
      }
    };
  });

  // Speak response utility
  const speakResponse = (text) => {
    const isVoiceEnabled = preferences?.notifications?.voiceEnabled !== false;
    if (!isVoiceEnabled) return;

    if (synthesisRef.current) {
      if (statusRef.current === 'listening' && recognitionRef.current) {
        recognitionRef.current.stop();
      }
      synthesisRef.current.speak(text, preferences?.notifications?.preferredVoice || 'Default');
    }
  };

  // Add message with optional speech trigger
  const addMessage = (sender, text, shouldSpeak = false) => {
    addMessageRef.current(sender, text);
    if (shouldSpeak && sender === 'assistant') {
      speakResponse(text);
    }
  };

  // Helper to execute high-impact actions post confirmation
  const executeHighImpactAction = (action) => {
    if (action.type === 'delete_task') {
      deleteTask(action.targetId);
      navigate('/tasks');
      return `Deleted task: "${action.label}", Boss.`;
    }
    return 'Action executed successfully, Boss.';
  };

  // Centralized command execution block - Now async database query powered
  const executeCommand = async (command) => {
    let replyText = '';

    switch (command.intent) {
      case INTENTS.CONFIRM_ACTION:
        if (pendingActionRef.current) {
          const act = pendingActionRef.current;
          pendingActionRef.current = null;
          setPendingAction(null);
          setStatus('executing');
          replyText = executeHighImpactAction(act);
        } else {
          replyText = 'There are no pending actions to confirm, Boss.';
        }
        break;

      case INTENTS.CANCEL_ACTION:
        if (pendingActionRef.current) {
          pendingActionRef.current = null;
          setPendingAction(null);
          replyText = 'Action cancelled, Boss.';
        } else {
          replyText = 'No actions are currently pending, Boss.';
        }
        break;

      case INTENTS.GREET:
      case INTENTS.CHECK_LIVENESS:
      case INTENTS.APPRECIATE:
        replyText = getRandomReply(command.intent);
        break;
        
      case INTENTS.NAVIGATE:
        setStatus('navigating');
        const targetLabel = command.target.charAt(0).toUpperCase() + command.target.slice(1);
        replyText = `Opening ${targetLabel}, Boss.`;
        
        if (command.target === 'coding' && command.subTab) {
          navigate('/coding', { state: { tab: command.subTab } });
        } else if (command.target === 'study' && command.subTab) {
          navigate('/study', { state: { tab: command.subTab } });
        } else {
          navigate(`/${command.target}`);
        }
        break;
        
      case INTENTS.GET_INFORMATION:
        setStatus('executing');
        try {
          const summaryRes = await dashboardApi.getDashboardSummary();
          if (summaryRes.success && summaryRes.data) {
            const summary = summaryRes.data;
            if (command.target === 'dsa_solved_today') {
              const todayStr = new Date().toISOString().split('T')[0];
              const solvedToday = summary.coding?.recentSolutions?.filter(s => s.time === todayStr).length || 0;
              replyText = `Boss, you solved ${solvedToday} DSA problems today.`;
            } else if (command.target === 'pending_tasks') {
              replyText = `Boss, you have ${summary.tasks?.pending || 0} pending tasks.`;
            } else if (command.target === 'tasks_list_today') {
              const tasksRes = await taskApi.getTasks();
              if (tasksRes.success && tasksRes.data?.tasks) {
                const todayStr = new Date().toISOString().split('T')[0];
                const pendingToday = tasksRes.data.tasks.filter(t => !t.completed && t.deadline === todayStr);
                if (pendingToday.length === 0) {
                  replyText = 'Boss, you have no pending tasks today!';
                } else {
                  const list = pendingToday.slice(0, 3).map(t => t.title).join(', ');
                  replyText = `Today's pending tasks include: ${list}.`;
                }
              } else {
                replyText = 'Failed to fetch tasks list, Boss.';
              }
            } else if (command.target === 'current_streak') {
              replyText = `Your current consistency streak is ${summary.coding?.streak || 0} days, Boss.`;
            } else {
              replyText = 'Let me check that information for you, Boss.';
            }
          } else {
            replyText = 'Could not load summary reports from backend, Boss.';
          }
        } catch (e) {
          replyText = 'Could not retrieve data from backend, Boss.';
        }
        break;
        
      case INTENTS.START_TIMER:
        setStatus('executing');
        replyText = `Starting a ${command.params.durationMinutes}-minute ${command.params.mode}, Boss.`;
        
        // Sync active session status locally
        const codingCached = localStorage.getItem('anshul_autopilot_coding_data');
        let codingData = {};
        if (codingCached) {
          try {
            codingData = JSON.parse(codingCached);
          } catch (e) {}
        }
        codingData.activeSession = {
          mode: command.params.mode,
          startTime: Date.now(),
          totalSeconds: command.params.durationMinutes * 60,
          isActive: true
        };
        localStorage.setItem('anshul_autopilot_coding_data', JSON.stringify(codingData));
        
        navigate('/coding', { state: { tab: 'timer' } });
        break;
        
      case INTENTS.STOP_TIMER:
        setStatus('executing');
        replyText = 'Stopping the timer, Boss.';
        
        const codingCachedStop = localStorage.getItem('anshul_autopilot_coding_data');
        let codingDataStop = {};
        if (codingCachedStop) {
          try {
            codingDataStop = JSON.parse(codingCachedStop);
          } catch (e) {}
        }
        codingDataStop.activeSession = null;
        localStorage.setItem('anshul_autopilot_coding_data', JSON.stringify(codingDataStop));
        
        navigate('/coding', { state: { tab: 'timer' } });
        break;
        
      case INTENTS.CREATE_TASK:
        setStatus('executing');
        const createdTask = await addTask({
          title: command.params.title,
          deadline: command.params.deadline,
          priority: command.params.priority,
          category: command.params.category,
          description: 'Task created via voice command by Anshul AI.'
        });
        replyText = `Creating task: "${createdTask.title}" due ${createdTask.deadline}, Boss.`;
        navigate('/tasks');
        break;
        
      case INTENTS.COMPLETE_TASK:
        setStatus('executing');
        const matchedTask = tasks.find((t) =>
          t.title.toLowerCase().includes(command.params.title.toLowerCase())
        );
        if (matchedTask) {
          const targetId = matchedTask.id || matchedTask._id;
          if (matchedTask.completed) {
            replyText = `Task: "${matchedTask.title}" is already completed, Boss.`;
          } else {
            await toggleCompleteTask(targetId);
            replyText = `Completing task: "${matchedTask.title}", Boss.`;
          }
          navigate('/tasks');
        } else {
          replyText = `I couldn't find a task matching "${command.params.title}", Boss.`;
        }
        break;

      case INTENTS.DELETE_TASK:
        const taskToDelete = tasks.find((t) =>
          t.title.toLowerCase().includes(command.params.title.toLowerCase())
        );
        if (taskToDelete) {
          const targetId = taskToDelete.id || taskToDelete._id;
          const act = { type: 'delete_task', targetId, label: taskToDelete.title };
          pendingActionRef.current = act;
          setPendingAction(act);
          replyText = `Boss, this will delete the task "${taskToDelete.title}" permanently. Should I continue?`;
        } else {
          replyText = `I couldn't find a task matching "${command.params.title}" to delete, Boss.`;
        }
        break;
        
      case INTENTS.UNKNOWN_COMMAND:
      default:
        replyText = getRandomReply(INTENTS.UNKNOWN_COMMAND);
        break;
    }

    // Small visual delay simulation for execution state feedback
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(replyText);
      }, 500);
    });
  };

  // Centralized command processing pipeline
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user text bubble
    addMessage('user', text);
    setStatus('processing');

    // 1. If currently awaiting confirmation, intercept input
    if (pendingActionRef.current) {
      const command = parseCommand(text);
      const replyText = await executeCommand(command);
      setStatus('speaking');
      addMessage('assistant', replyText, true);
      return;
    }

    // 2. Parse multi-step commands split by conjunction boundaries
    const commands = parseMultiCommand(text);

    // 3. Sequentially execute parsed commands
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];

      // Insert delay between multiple actions
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2200));
      }

      setStatus('processing');
      const replyText = await executeCommand(command);
      
      setStatus('speaking');
      addMessage('assistant', replyText, true);

      // If a command halts sequence with confirmation locks (e.g. Delete Task), break sequence loop
      if (pendingActionRef.current) {
        break;
      }
    }
  };

  const clearMessages = async () => {
    if (synthesisRef.current) {
      synthesisRef.current.stop();
    }
    pendingActionRef.current = null;
    setPendingAction(null);

    // Clear from database
    if (isAuthenticated) {
      try {
        await aiApi.clearChatHistory();
      } catch (err) {
        console.error('[AIAssistantContext] Failed to clear chat history:', err.message);
      }
    }

    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: 'Conversation cleared, Boss. What next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setStatus('idle');
  };

  // Initialize Speech Managers on Mount
  useEffect(() => {
    // 1. Initialize Speech Recognition
    recognitionRef.current = new SpeechRecognitionManager({
      onResult: (text) => {
        sendMessage(text);
      },
      onStatusChange: (recognitionStatus) => {
        if (recognitionStatus === 'listening') {
          if (synthesisRef.current) {
            synthesisRef.current.stop();
          }
          setStatus('listening');
        } else if (recognitionStatus === 'idle') {
          setStatus((curr) => (curr === 'listening' ? 'idle' : curr));
        }
      },
      onError: (error) => {
        console.error('Recognition error event:', error);
        if (error === 'no-speech') {
          setStatus('idle');
          return;
        }
        
        setStatus('error');
        addMessage('assistant', "Sorry Boss, I couldn't understand that.", true);
        
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      }
    });

    // 2. Initialize Speech Synthesis
    synthesisRef.current = new SpeechSynthesisManager({
      onStart: () => {
        setStatus('speaking');
      },
      onEnd: () => {
        setStatus((curr) => (curr === 'speaking' ? 'idle' : curr));
      },
      onError: (err) => {
        console.error('Synthesis error event:', err);
        setStatus('idle');
      }
    });

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.stop();
    }
  };

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        setIsOpen,
        status,
        setStatus,
        messages,
        sendMessage,
        clearMessages,
        startListening,
        stopListening,
        stopSpeaking,
        pendingAction,
        isSupported: isSpeechRecognitionSupported() && isSpeechSynthesisSupported()
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
};

export default AIAssistantContext;
