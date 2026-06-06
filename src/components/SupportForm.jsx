import React, { useState } from 'react';
import { submitSupportRequest } from '../api';
import styles from './SupportForm.module.css';

export default function SupportForm() {
  const [customerId, setCustomerId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await submitSupportRequest(customerId, message);
      setResponse(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'approved') return styles.statusApproved;
    if (status === 'denied') return styles.statusDenied;
    return styles.statusEscalated;
  };

  return (
    <div className={styles.formContainer}>
      <h2>Submit Support Request</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        Please provide your Customer ID or Name to help us locate your recent orders.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="customerId">Customer ID or Name</label>
          <input
            id="customerId"
            className={styles.input}
            type="text"
            placeholder="e.g. CUST001 or John Doe"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="message">How can we help you?</label>
          <textarea
            id="message"
            className={styles.textarea}
            placeholder="Describe your issue or request..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Submit Request'}
        </button>
      </form>

      {error && (
        <div className={`${styles.responseCard} ${styles.error}`}>
          <div className={styles.responseHeader}>
            <h3 style={{ margin: 0 }}>Error</h3>
            <span className={`${styles.status} ${styles.statusDenied}`}>Failed</span>
          </div>
          <p className={styles.reason}>{error}</p>
        </div>
      )}

      {response && (
        <div className={`${styles.responseCard} ${styles[response.status.toLowerCase()]}`}>
          <div className={styles.responseHeader}>
            <h3 style={{ margin: 0 }}>AI Decision</h3>
            <span className={`${styles.status} ${getStatusClass(response.status)}`}>
              {response.status}
            </span>
          </div>
          <p className={styles.reason}>{response.response}</p>
        </div>
      )}
    </div>
  );
}
