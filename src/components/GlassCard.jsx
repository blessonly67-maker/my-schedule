import React from 'react';

export default function GlassCard({ className = '', children, style, onClick }) {
  return (
    <div className={`glass-card ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
