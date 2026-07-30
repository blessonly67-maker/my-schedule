import React from 'react';
import { loadChores, saveChores, fmtDate } from '../data/scheduleStore';

export default function ChoresSheet({ open, currentDate, onClose }) {
  const dateKey = fmtDate(currentDate);
  const [chores, setChores] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      const all = loadChores();
      setChores(all[dateKey] || []);
    }
  }, [open, dateKey]);

  const persist = (newList) => {
    setChores(newList);
    const all = loadChores();
    all[dateKey] = newList;
    saveChores(all);
  };

  const toggleChore = (idx) => {
    const next = [...chores];
    next[idx] = { ...next[idx], done: !next[idx].done };
    persist(next);
  };

  const addChore = (text) => {
    if (!text.trim()) return;
    persist([...chores, { text: text.trim(), done: false }]);
  };

  const undone = chores.filter(c => !c.done);
  const doneArr = chores.filter(c => c.done);

  return (
    <div className={`chores-overlay${open ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="chores-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="chores-sheet-header">
          <h3>📋 今日琐事</h3>
          <button className="chores-close" onClick={onClose}>✕</button>
        </div>

        {/* Undone chores */}
        {undone.map((c, i) => (
          <div key={`u-${i}`} className="chore-row" onClick={() => toggleChore(chores.indexOf(c))}>
            <div className="chore-check">✓</div>
            <span className="chore-text">{c.text}</span>
          </div>
        ))}

        {/* Done chores */}
        {doneArr.map((c, i) => (
          <div key={`d-${i}`} className="chore-row done" onClick={() => toggleChore(chores.indexOf(c))}>
            <div className="chore-check">✓</div>
            <span className="chore-text">{c.text}</span>
          </div>
        ))}

        {/* Add input */}
        <div className="chore-add">
          <div className="chore-check" style={{ visibility: 'hidden' }}>+</div>
          <input
            type="text"
            placeholder="+ 添加琐事"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addChore(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
