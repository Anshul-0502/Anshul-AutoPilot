// CommandService.js - Centralized Command Understanding and Parsing System

export const INTENTS = {
  GREET: 'GREET',
  CHECK_LIVENESS: 'CHECK_LIVENESS',
  APPRECIATE: 'APPRECIATE',
  NAVIGATE: 'NAVIGATE',
  GET_INFORMATION: 'GET_INFORMATION',
  CREATE_TASK: 'CREATE_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  COMPLETE_TASK: 'COMPLETE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  CONFIRM_ACTION: 'CONFIRM_ACTION',
  CANCEL_ACTION: 'CANCEL_ACTION',
  START_TIMER: 'START_TIMER',
  STOP_TIMER: 'STOP_TIMER',
  UNKNOWN_COMMAND: 'UNKNOWN_COMMAND'
};

// Conversational Responses Map (Phase 2.16 - Personality replies addressing user as "Boss")
export const CONVERSATION_REPLIES = {
  [INTENTS.GREET]: [
    'Hello Boss! How can I help you?',
    'Hey Boss, what are we focusing on today?',
    'Greetings Boss! Ready to get to work?'
  ],
  [INTENTS.CHECK_LIVENESS]: [
    "Yes Boss, I'm ready.",
    'Always here Boss!',
    'Standing by, Boss.'
  ],
  [INTENTS.APPRECIATE]: [
    "You're welcome Boss.",
    'Always happy to help, Boss!',
    'My pleasure, Boss.'
  ],
  [INTENTS.UNKNOWN_COMMAND]: [
    "Sorry Boss, I didn't understand that command.",
    "I'm not sure how to do that yet, Boss.",
    "Sorry Boss, that command isn't in my cockpit registry."
  ]
};

/**
 * Parses user speech/text input into a structured intent + parameters object.
 * This NLP layer is designed to be easily decoupled and replaced with an external API
 * (e.g. Google Gemini or OpenAI) in the future (Phase 2.15).
 * @param {string} text - User raw input string
 * @returns {object} - Structured command representation
 */
export const parseCommand = (text) => {
  const cleanText = text.trim().toLowerCase();

  // 1. Confirmation handlers
  if (cleanText === 'yes' || cleanText === 'confirm' || cleanText === 'yeah' || cleanText === 'do it' || cleanText === 'sure') {
    return { intent: INTENTS.CONFIRM_ACTION, text };
  }
  if (cleanText === 'no' || cleanText === 'cancel' || cleanText === 'nah' || cleanText === 'stop') {
    return { intent: INTENTS.CANCEL_ACTION, text };
  }

  // 2. Basic Conversation (Phase 2.4 / 2.16)
  if (/\b(hello|hi|hey|greetings)\b/.test(cleanText) && !cleanText.includes('open') && !cleanText.includes('add') && !cleanText.includes('delete') && !cleanText.includes('complete')) {
    return { intent: INTENTS.GREET, text };
  }
  if (cleanText.includes('are you there') || cleanText.includes('you ready') || cleanText.includes('you online')) {
    return { intent: INTENTS.CHECK_LIVENESS, text };
  }
  if (cleanText.includes('thank you') || cleanText.includes('thanks') || cleanText.includes('great job')) {
    return { intent: INTENTS.APPRECIATE, text };
  }

  // 3. Navigation Parser (Phase 2.6)
  if (cleanText.includes('dashboard')) {
    return { intent: INTENTS.NAVIGATE, target: 'dashboard', text };
  }
  if (cleanText.includes('dsa') && (cleanText.includes('open') || cleanText.includes('take me') || cleanText.includes('go to'))) {
    return { intent: INTENTS.NAVIGATE, target: 'coding', subTab: 'dsa', text };
  }
  if (cleanText.includes('coding') || cleanText.includes('workspace') || cleanText.includes('compiler')) {
    return { intent: INTENTS.NAVIGATE, target: 'coding', text };
  }
  if (cleanText.includes('study') || cleanText.includes('hub') || cleanText.includes('subject')) {
    return { intent: INTENTS.NAVIGATE, target: 'study', text };
  }
  if (cleanText.includes('note') && (cleanText.includes('open') || cleanText.includes('go to'))) {
    return { intent: INTENTS.NAVIGATE, target: 'study', subTab: 'notes', text };
  }
  if (cleanText.includes('project')) {
    return { intent: INTENTS.NAVIGATE, target: 'projects', text };
  }
  if (cleanText.includes('game') || cleanText.includes('arena') || cleanText.includes('skill arena')) {
    return { intent: INTENTS.NAVIGATE, target: 'games', text };
  }
  if (cleanText.includes('analytics') || cleanText.includes('statistics') || cleanText.includes('report')) {
    return { intent: INTENTS.NAVIGATE, target: 'analytics', text };
  }
  if (cleanText.includes('health') || cleanText.includes('focus') || cleanText.includes('habit')) {
    return { intent: INTENTS.NAVIGATE, target: 'health', text };
  }
  if (cleanText.includes('setting')) {
    return { intent: INTENTS.NAVIGATE, target: 'settings', text };
  }

  // 4. Information Requests Parser (Phase 2.7)
  if (cleanText.includes('dsa') && (cleanText.includes('solve') || cleanText.includes('completed')) && (cleanText.includes('today') || cleanText.includes('how many'))) {
    return { intent: INTENTS.GET_INFORMATION, target: 'dsa_solved_today', text };
  }
  if (cleanText.includes('how many') && cleanText.includes('task') && (cleanText.includes('pending') || cleanText.includes('todo') || cleanText.includes('left'))) {
    return { intent: INTENTS.GET_INFORMATION, target: 'pending_tasks', text };
  }
  if (cleanText.includes('task') && (cleanText.includes('today') || cleanText.includes('what are'))) {
    return { intent: INTENTS.GET_INFORMATION, target: 'tasks_list_today', text };
  }
  if (cleanText.includes('streak') || cleanText.includes('consistency')) {
    return { intent: INTENTS.GET_INFORMATION, target: 'current_streak', text };
  }
  if (cleanText.includes('progress') && cleanText.includes('today')) {
    return { intent: INTENTS.GET_INFORMATION, target: 'progress_today', text };
  }

  // 5. Timer Control Parser (Phase 2.10)
  if (cleanText.includes('start') && (cleanText.includes('timer') || cleanText.includes('session') || cleanText.includes('clock'))) {
    const minutesMatch = cleanText.match(/\b(\d+)\b/);
    const durationMinutes = minutesMatch ? parseInt(minutesMatch[0]) : 25;

    let mode = 'Coding Session';
    if (cleanText.includes('dsa')) mode = 'DSA Session';
    else if (cleanText.includes('interview')) mode = 'Interview Practice';
    else if (cleanText.includes('revision')) mode = 'Revision Session';

    return {
      intent: INTENTS.START_TIMER,
      params: { durationMinutes, mode },
      text
    };
  }
  if ((cleanText.includes('stop') || cleanText.includes('pause') || cleanText.includes('end')) && (cleanText.includes('timer') || cleanText.includes('session'))) {
    return { intent: INTENTS.STOP_TIMER, text };
  }

  // 6. High Impact Action: Delete Task (Phase 2.13 - Requires Confirmation)
  if (cleanText.startsWith('delete task') || cleanText.startsWith('delete my task') || cleanText.startsWith('remove task') || cleanText.includes('delete') && cleanText.includes('task')) {
    let rawTitle = cleanText
      .replace(/^delete task called\s+/i, '')
      .replace(/^delete task\s+/i, '')
      .replace(/^delete my task called\s+/i, '')
      .replace(/^delete my task\s+/i, '')
      .replace(/^delete my\s+/i, '')
      .replace(/^delete\s+/i, '')
      .replace(/^remove task called\s+/i, '')
      .replace(/^remove task\s+/i, '')
      .replace(/^remove\s+/i, '')
      .replace(/\s+task$/i, '')
      .trim();

    rawTitle = rawTitle.replace(/^:\s*/, '').trim();
    const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
    
    return {
      intent: INTENTS.DELETE_TASK,
      params: { title },
      text
    };
  }

  // 7. Tasks Management Parser (Phase 2.9)
  if (cleanText.startsWith('add a task') || cleanText.startsWith('add task') || cleanText.startsWith('create task') || cleanText.startsWith('create a task')) {
    let rawTitle = cleanText
      .replace(/^add a task called\s+/i, '')
      .replace(/^add a task\s+/i, '')
      .replace(/^add task\s+/i, '')
      .replace(/^create a task\s+/i, '')
      .replace(/^create task\s+/i, '');

    let deadline = 'Today';
    const tomorrowRegex = /\b(by tomorrow|for tomorrow|deadline tomorrow)\b/i;
    if (tomorrowRegex.test(rawTitle)) {
      rawTitle = rawTitle.replace(tomorrowRegex, '').trim();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      deadline = tomorrow.toISOString().split('T')[0];
    } else {
      const today = new Date();
      deadline = today.toISOString().split('T')[0];
    }

    rawTitle = rawTitle.replace(/^:\s*/, '').trim();
    const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

    return {
      intent: INTENTS.CREATE_TASK,
      params: {
        title,
        deadline,
        priority: 'High',
        category: 'Study'
      },
      text
    };
  }

  if (cleanText.startsWith('complete task') || cleanText.startsWith('complete') || (cleanText.includes('mark') && cleanText.includes('complete'))) {
    let rawTitle = cleanText
      .replace(/^complete task\s+/i, '')
      .replace(/^complete\s+/i, '')
      .replace(/^mark\s+/i, '')
      .replace(/\s+as completed?$/i, '');

    rawTitle = rawTitle.replace(/^:\s*/, '').trim();
    const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

    return {
      intent: INTENTS.COMPLETE_TASK,
      params: { title },
      text
    };
  }

  return { intent: INTENTS.UNKNOWN_COMMAND, text };
};

/**
 * Parses user input into a sequence of multiple commands (Phase 2.11).
 * Splits strings on keywords 'and then', 'then', or 'and'.
 * @param {string} text - User input string
 * @returns {Array<object>} - Ordered array of parsed command representations
 */
export const parseMultiCommand = (text) => {
  // Regex to split by transition words like "and then", "then", or "and" (with word boundaries)
  // Ensure we don't split titles like "DBMS and SQL Normalization" by requiring command boundaries or checking context
  const parts = text.split(/\s+(?:and\s+then|then|and)\s+/i);
  
  if (parts.length <= 1) {
    return [parseCommand(text)];
  }

  const commands = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed) {
      commands.push(parseCommand(trimmed));
    }
  }
  return commands;
};

/**
 * Gets a random conversation reply from CONVERSATION_REPLIES based on intent
 * @param {string} intent - Intent code
 * @returns {string} - Random friendly response string
 */
export const getRandomReply = (intent) => {
  const replies = CONVERSATION_REPLIES[intent] || CONVERSATION_REPLIES[INTENTS.UNKNOWN_COMMAND];
  const idx = Math.floor(Math.random() * replies.length);
  return replies[idx];
};
