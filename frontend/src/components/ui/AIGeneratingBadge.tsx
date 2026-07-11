import React from 'react';

interface AIGeneratingBadgeProps {
  className?: string;
  label?: string;
}

export const AIGeneratingBadge: React.FC<AIGeneratingBadgeProps> = ({
  className = '',
  label = 'AI Generating...'
}) => {
  return (
    <div
      role="status"
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '9999px',
        background: 'rgba(0, 66, 153, 0.6)',
        border: '1px solid rgba(0, 163, 255, 0.5)',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.05em',
        userSelect: 'none',
        color: '#ffffff',
      }}
      className={className}
    >
      <span style={{
        position: 'relative',
        display: 'inline-flex',
        width: '8px',
        height: '8px',
        flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: '#00f2fe',
          opacity: 0.75,
          animation: 'nh-ping 1s cubic-bezier(0,0,0.2,1) infinite',
        }} />
        <span style={{
          position: 'relative',
          borderRadius: '50%',
          width: '8px',
          height: '8px',
          background: '#00f2fe',
        }} />
      </span>
      <span style={{ color: '#ffffff', fontWeight: 700 }}>
        {label}
      </span>
    </div>
  );
};
