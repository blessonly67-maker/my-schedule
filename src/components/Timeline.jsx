import React from 'react';
import GlassCard from './GlassCard';
import { getStatus } from '../data/scheduleStore';

function TimelineItem({ item, status }) {
  const isSpecial = !!item.isSpecial;
  let badge = '', iconBg = '';
  if (isSpecial) { badge = '重要'; iconBg = 'special'; }
  else if (status === 'active') { badge = '进行中'; iconBg = 'active'; }
  else if (status === 'done') { badge = '已结束'; iconBg = 'done'; }
  else { badge = '待开始'; iconBg = 'upcoming'; }

  const timeStr = isSpecial ? '全天' : `${item.start} – ${item.end}`;
  const dimStyle = status === 'done' ? { opacity: 0.5 } : {};

  return (
    <div className={`tl-item ${status === 'done' ? 'tl-done' : ''}`} style={dimStyle}>
      <div className={`tl-dot ${iconBg}`} />
      <GlassCard className={`tl-card ${iconBg}-card`}>
        <div className={`tl-icon-bg ${iconBg}-bg`}>{item.icon}</div>
        <div className="tl-body">
          <div className="tl-time">{timeStr} · {item.duration || ''}</div>
          <div className="tl-title-row">
            <span className="tl-title">{item.title}</span>
            <span className={`badge badge-${iconBg}`}>{badge}</span>
          </div>
          {item.note && <div className="tl-note">{item.note}</div>}
        </div>
      </GlassCard>
    </div>
  );
}

export default function Timeline({ schedule, now, viewingToday, isPastDay }) {
  const [doneExpanded, setDoneExpanded] = React.useState(false);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const doneItems = [];
  const pendingItems = [];

  schedule.forEach(item => {
    const isSpecial = !!item.isSpecial;
    const status = isSpecial ? 'special' : (() => {
      if (!viewingToday && !isPastDay) return 'upcoming';
      const a = item.start.split(':').map(Number), b = item.end.split(':').map(Number);
      const nm = nowMin, s = a[0]*60+a[1], e = b[0]*60+b[1];
      if (nm >= e) return 'done';
      if (nm >= s && nm < e) return 'active';
      return 'upcoming';
    })();
    if (status === 'done') {
      doneItems.push({ ...item, status, isSpecial });
    } else {
      pendingItems.push({ ...item, status, isSpecial });
    }
  });

  const lastEnd = schedule.filter(i => !i.isSpecial).length > 0
    ? schedule.filter(i => !i.isSpecial)[schedule.filter(i => !i.isSpecial).length - 1].end
    : '全天';

  return (
    <div>
      <div className="section-title">时间线</div>
      <div className="timeline-wrap">
        {schedule.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>这天还没有安排</p>
          </div>
        ) : (
          <>
            {/* Completed — iOS stacked cards */}
            {doneItems.length > 0 && (
              <div
                className={`done-stack${doneExpanded ? ' expanded' : ''}`}
                onClick={(e) => { e.stopPropagation(); setDoneExpanded(!doneExpanded); }}
              >
                <div className="stack-bg"></div>
                <div className="stack-bg"></div>
                <div className="stack-card glass-card">
                  <div className="stack-dot"></div>
                  <span className="stack-summary">{doneItems.map(i => i.icon + ' ' + i.title).join(' · ')}</span>
                  <span className="stack-count">{doneItems.length}项</span>
                  <span className={`stack-chevron${doneExpanded ? ' open' : ''}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M3 3.5l2.5 3L8 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                <div className="stack-detail">
                  {doneItems.map((item, i) => (
                    <div key={i} className="stack-item">
                      <span className="stack-item-icon">{item.icon}</span>
                      <span>{item.title}</span>
                      <span className="stack-item-time">{item.start || '全天'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending items in order */}
            {pendingItems.map((item, i) => (
              <TimelineItem key={`pending-${i}`} item={item} status={item.status} />
            ))}
          </>
        )}
      </div>

      <div className="footer">
        预计 <strong>{lastEnd}</strong> 完成
      </div>
    </div>
  );
}