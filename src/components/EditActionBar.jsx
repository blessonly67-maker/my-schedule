import React from 'react';

export default function EditActionBar({ selectedIndex, onAdd, onDelete, onDone, onAddBefore, onAddAfter }) {
  return (
    <div className="edit-bar-overlay" onClick={onDone}>
      <div className="edit-bar glass-card" onClick={function(e) { e.stopPropagation(); }}>
        <div className="edit-bar-handle" />
        <div className="edit-bar-title">编辑时间线</div>
        <div className="edit-bar-actions">
          <button className="edit-bar-btn" onClick={onAdd} title="添加任务">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="4" y="10" width="14" height="2" rx="1" fill="currentColor"/>
              <rect x="10" y="4" width="2" height="14" rx="1" fill="currentColor"/>
            </svg>
            <span>添加</span>
          </button>
          <button className="edit-bar-btn" onClick={function() { if (selectedIndex !== null) onDelete(selectedIndex); }} title="删除任务" disabled={selectedIndex === null}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="5" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="4" y="5" width="14" height="2" rx="1" fill="currentColor"/>
              <rect x="8.5" y="2" width="5" height="3" rx="1" fill="currentColor"/>
            </svg>
            <span>删除</span>
          </button>
          <button className="edit-bar-btn edit-bar-done" onClick={onDone}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M5 11l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>完成</span>
          </button>
        </div>
        <div className="edit-bar-hint">长按拖动调整顺序</div>
      </div>
    </div>
  );
}
