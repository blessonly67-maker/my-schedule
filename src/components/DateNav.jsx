import React from 'react';
import { fmtDisplayDate, fmtDate } from '../data/scheduleStore';

export default function DateNav({ currentDate, onDayChange, onDatePick, isToday: isTodayFlag }) {
  return (
    <div className="date-nav">
      <button className="nav-btn" onClick={() => onDayChange(-1)}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2.5L4 6l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="picker-wrapper">
        <div
          className={`date-display${isTodayFlag ? ' is-today' : ''}`}
          onClick={(e) => e.currentTarget.nextElementSibling.showPicker()}
        >
          {fmtDisplayDate(currentDate)}
        </div>
        <input
          type="date"
          className="date-picker-input"
          value={fmtDate(currentDate)}
          onChange={(e) => { if (e.target.value) onDatePick(e.target.value); }}
        />
      </div>
      <button className="nav-btn" onClick={() => onDayChange(1)}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}
