import React from 'react';

export const NotificationCenter: React.FC = () => {
  return (
    <div
      role="region"
      aria-label="Notification Center"
      aria-live="polite"
      aria-atomic="false"
      style={{
        maxWidth: '400px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e5e7eb',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Notifications</span>
      </div>
      <ul
        style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '400px', overflowY: 'auto' }}
        aria-label="Notification list"
      >
        <li style={{ padding: '16px', textAlign: 'center', color: '#9ca3af' }}>
          No notifications
        </li>
      </ul>
    </div>
  );
};
