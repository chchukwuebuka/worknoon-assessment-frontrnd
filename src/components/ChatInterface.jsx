import React, { useState, useRef, useEffect } from 'react';
import { startConversation, sendMessage } from '../api';
import styles from './ChatInterface.module.css';

export default function ChatInterface() {
  const [phase, setPhase] = useState('identify'); // 'identify' | 'chatting'
  const [customerId, setCustomerId] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (phase === 'chatting' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, isLoading]);

  const handleStartConversation = async (e) => {
    e.preventDefault();
    if (!customerId.trim() || !input.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await startConversation(customerId.trim(), input.trim());
      setConversationId(data.id);
      setCustomerName(data.customer_name);
      setMessages(data.messages);
      setInput('');
      setPhase('chatting');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to start conversation. Please check your Customer ID.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    // Optimistic: show user message immediately
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMsg, created_at: new Date().toISOString() }]);
    setIsLoading(true);

    try {
      const data = await sendMessage(conversationId, userMsg);
      setMessages(data.messages);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an issue processing your message. Please try again.',
        created_at: new Date().toISOString(),
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setPhase('identify');
    setConversationId(null);
    setCustomerName('');
    setMessages([]);
    setInput('');
    setError(null);
  };

  // ─── Identify Phase ───
  if (phase === 'identify') {
    return (
      <div className={styles.identifyContainer}>
        <div className={styles.identifyCard}>
          <div className={styles.iconWrapper}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2>Start a Conversation</h2>
          <p className={styles.identifyDescription}>
            Enter your details and describe your issue to begin chatting with our AI support agent.
          </p>

          <form onSubmit={handleStartConversation}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="chatCustomerId">Customer ID or Name</label>
              <input
                id="chatCustomerId"
                className={styles.input}
                type="text"
                placeholder="e.g. CUST001 or John Doe"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="chatFirstMessage">What can we help you with?</label>
              <textarea
                id="chatFirstMessage"
                className={styles.textarea}
                placeholder="Describe your issue or question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                rows={3}
              />
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <button type="submit" className={styles.startButton} disabled={isLoading}>
              {isLoading ? (
                <span className={styles.loadingDots}>
                  <span>.</span><span>.</span><span>.</span>
                </span>
              ) : 'Start Chat'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Chat Phase ───
  return (
    <div className={styles.chatContainer}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderInfo}>
          <div className={styles.agentAvatar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
            </svg>
          </div>
          <div>
            <h3 className={styles.chatTitle}>Alex - Support Agent</h3>
            <span className={styles.chatSubtitle}>
              Chatting as <strong>{customerName}</strong>
            </span>
          </div>
        </div>
        <button className={styles.newChatButton} onClick={handleNewConversation} title="Start New Conversation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Messages Area */}
      <div className={styles.messagesArea}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage} ${msg.isError ? styles.errorMessage : ''}`}
          >
            {msg.role === 'assistant' && (
              <div className={styles.messageAvatar}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                </svg>
              </div>
            )}
            <div className={styles.messageContent}>
              <p>{msg.content}</p>
              <span className={styles.messageTime}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.messageBubble} ${styles.assistantMessage}`}>
            <div className={styles.messageAvatar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
              </svg>
            </div>
            <div className={styles.typingIndicator}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form className={styles.inputArea} onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          className={styles.chatInput}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className={styles.sendButton} disabled={isLoading || !input.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
