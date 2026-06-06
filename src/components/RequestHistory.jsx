import React, { useState } from 'react';
import { getRequestHistory } from '../api';
import styles from './RequestHistory.module.css';

export default function RequestHistory() {
  const [customerId, setCustomerId] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!customerId) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await getRequestHistory(customerId);
      setHistory(data);
    } catch (err) {
      setError('Customer not found or failed to fetch history.');
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.historyContainer}>
      <div className={styles.headerSection}>
        <div>
          <h2>Request History</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
            Look up past support requests for a customer.
          </p>
        </div>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Enter Customer ID or Name"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          <button type="submit" className={styles.button} disabled={isLoading} style={{ padding: '0.625rem 1rem', width: 'auto', marginTop: 0 }}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {!isLoading && hasSearched && history.length === 0 && !error && (
        <div className={styles.empty}>No past requests found for this customer.</div>
      )}

      <div className={styles.historyList}>
        {history.map((req) => {
          let parsedResponse = { decision: 'UNKNOWN', reason: req.ai_response };
          try {
            parsedResponse = JSON.parse(req.ai_response);
          } catch (e) {
            // keep default
          }
          
          const decisionClass = parsedResponse.decision.toLowerCase();

          return (
            <div key={req.id} className={`${styles.historyItem} ${styles[decisionClass] || ''}`}>
              <div className={styles.itemHeader}>
                <div className={styles.customerInfo}>
                  <span className={styles.customerName}>{req.customer?.name || 'Unknown'}</span>
                  <span className={styles.customerId}>{req.customer?.customer_id || 'Unknown ID'}</span>
                </div>
                <span className={styles.date}>{new Date(req.created_at).toLocaleString()}</span>
              </div>
              <div className={styles.requestText}>"{req.message}"</div>
              <div className={styles.responseSection}>
                <span className={`${styles.statusBadge} ${styles[decisionClass] || ''}`}>
                  {parsedResponse.decision}
                </span>
                <p className={styles.reasonText}>{parsedResponse.reason}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
