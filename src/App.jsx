import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import RequestHistory from './components/RequestHistory';
import styles from './App.module.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Support Assistant</h1>
        <p className={styles.subtitle}>Fast, intelligent support resolution powered by AI</p>
      </header>

      <nav className={styles.nav}>
        <button 
          className={`${styles.navButton} ${activeTab === 'chat' ? styles.navButtonActive : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat with AI
        </button>
        <button 
          className={`${styles.navButton} ${activeTab === 'history' ? styles.navButtonActive : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Request History
        </button>
      </nav>

      <main className={styles.mainContent}>
        {activeTab === 'chat' ? <ChatInterface /> : <RequestHistory />}
      </main>
    </div>
  );
}

export default App;
