import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic, Send, X, Sparkles, Trash2, Volume2, Radio, Loader, ArrowLeftRight, Activity } from 'lucide-react';
import { AIAssistantContext } from '../contexts/AIAssistantContext';
import Button from './Button';

// Micro-animated waveform for active voice input / output
const SpeechWaveform = ({ color = 'var(--color-primary)' }) => {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '24px', padding: '0 8px' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          style={{
            width: '3px',
            backgroundColor: color,
            borderRadius: '2px'
          }}
          animate={{
            height: ['4px', '20px', '4px']
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

const AIAssistantPanel = () => {
  const {
    isOpen,
    setIsOpen,
    status,
    messages,
    sendMessage,
    clearMessages,
    startListening,
    stopListening
  } = useContext(AIAssistantContext);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleMic = () => {
    if (status === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  };

  // Helper colors and text based on status
  const getStatusDetails = () => {
    switch (status) {
      case 'listening':
        return { label: 'Listening...', color: 'var(--color-danger)', icon: <Radio size={12} className="animate-pulse" /> };
      case 'processing':
        return { label: 'Processing...', color: 'var(--color-accent)', icon: <Loader size={12} className="animate-spin" /> };
      case 'speaking':
        return { label: 'Speaking...', color: 'var(--color-success)', icon: <Volume2 size={12} /> };
      case 'navigating':
        return { label: 'Navigating...', color: 'var(--color-secondary)', icon: <ArrowLeftRight size={12} className="animate-pulse" /> };
      case 'executing':
        return { label: 'Executing...', color: 'var(--color-primary)', icon: <Activity size={12} className="animate-pulse" /> };
      case 'error':
        return { label: 'System Error', color: 'var(--color-danger)', icon: <X size={12} /> };
      case 'success':
        return { label: 'Success', color: 'var(--color-success)', icon: <Sparkles size={12} /> };
      default:
        return { label: 'Ready Anshul', color: 'var(--color-success)', icon: <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)' }} /> };
    }
  };

  const statusInfo = getStatusDetails();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay (Mobile-only blur click-away support) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 990,
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(2px)',
              pointerEvents: 'auto'
            }}
            className="md:hidden"
          />

          {/* Assistant Side Panel Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0.95 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: '100%',
              maxWidth: '400px',
              zIndex: 998,
              boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box'
            }}
            className="glass-panel"
          >
            {/* Panel Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid var(--glass-border)',
                background: 'var(--glass-navbar-bg)'
              }}
            >
              {/* Avatar and Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Glowing Avatar Frame */}
                <div
                  style={{
                    position: 'relative',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-glow)',
                    border: `1.5px solid ${status === 'listening' ? 'var(--color-danger)' : 'var(--color-primary)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: status === 'listening' ? '0 0 12px var(--color-danger)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Bot size={20} style={{ color: status === 'listening' ? 'var(--color-danger)' : 'var(--color-primary)' }} />
                  {/* Status Ring Ripples for Speaking */}
                  {status === 'speaking' && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: -4,
                        borderRadius: '50%',
                        border: '1.5px solid var(--color-primary)',
                        opacity: 0
                      }}
                      animate={{ scale: [1, 1.25, 1], opacity: [0, 0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Meta details */}
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Anshul AI</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {statusInfo.icon}
                    <span>{statusInfo.label}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons (Clear and Close) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  variant="ghost"
                  onClick={clearMessages}
                  style={{ padding: '6px', borderRadius: '50%', height: '32px', width: '32px' }}
                  title="Clear history"
                >
                  <Trash2 size={15} style={{ color: 'var(--text-muted)' }} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  style={{ padding: '6px', borderRadius: '50%', height: '32px', width: '32px' }}
                  title="Close Assistant"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Conversation Messages View */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: 'rgba(var(--bg-primary), 0.1)'
              }}
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      width: '100%'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '80%',
                        gap: '4px'
                      }}
                    >
                      {/* Message Bubble */}
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          background: isUser ? 'var(--color-primary)' : 'var(--glass-card-bg)',
                          border: isUser ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                          color: isUser ? '#ffffff' : 'var(--text-primary)',
                          boxShadow: 'var(--glass-shadow)',
                          fontSize: '0.85rem',
                          lineHeight: '1.45',
                          textAlign: 'left',
                          wordBreak: 'break-word'
                        }}
                      >
                        {msg.text}
                      </div>
                      
                      {/* Timestamp */}
                      <span
                        style={{
                          fontSize: '0.65rem',
                          color: 'var(--text-muted)',
                          alignSelf: isUser ? 'flex-end' : 'flex-start',
                          padding: '0 4px'
                        }}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Processing typing indicator dots */}
              {status === 'processing' && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '16px 16px 16px 2px',
                      background: 'var(--glass-card-bg)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                      height: '34px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)' }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Visual audio status waves */}
            {status === 'listening' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '8px',
                  background: 'rgba(239, 68, 68, 0.05)',
                  borderTop: '1px solid var(--glass-border)',
                  fontSize: '0.75rem',
                  color: 'var(--color-danger)',
                  fontWeight: 600
                }}
              >
                <span>Boss, I'm listening...</span>
                <SpeechWaveform color="var(--color-danger)" />
              </div>
            )}
            {status === 'speaking' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '8px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  borderTop: '1px solid var(--glass-border)',
                  fontSize: '0.75rem',
                  color: 'var(--color-success)',
                  fontWeight: 600
                }}
              >
                <span>Speaking responses...</span>
                <SpeechWaveform color="var(--color-success)" />
              </div>
            )}

            {/* Bottom Actions Control Footer */}
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid var(--glass-border)',
                background: 'var(--glass-navbar-bg)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              {/* Mic action button */}
              <Button
                variant={status === 'listening' ? 'danger' : 'glass'}
                onClick={toggleMic}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  flexShrink: 0,
                  background: status === 'listening' ? 'var(--color-danger)' : 'var(--glass-btn-bg)',
                  borderColor: status === 'listening' ? 'var(--color-danger)' : 'var(--glass-btn-border)',
                  boxShadow: status === 'listening' ? '0 0 10px rgba(239, 68, 68, 0.4)' : 'none'
                }}
                className="hover-scale"
                title={status === 'listening' ? 'Stop listening' : 'Start speaking voice commands'}
              >
                <Mic size={18} style={{ color: status === 'listening' ? '#ffffff' : 'var(--text-primary)' }} />
              </Button>

              {/* Text area inputs */}
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={status === 'listening' ? 'Listening voice inputs...' : 'Type commands (e.g. Open DSA)...'}
                  disabled={status === 'listening'}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '20px',
                    padding: '0 16px',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    border: '1px solid var(--glass-border)'
                  }}
                  className="glass-input"
                />
              </div>

              {/* Send button */}
              <Button
                variant="primary"
                onClick={handleSend}
                disabled={!inputText.trim() || status === 'listening'}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  flexShrink: 0
                }}
                className="hover-scale"
                title="Send command text"
              >
                <Send size={16} />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIAssistantPanel;
