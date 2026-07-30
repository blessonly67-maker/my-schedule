import React from 'react';
import GlassCard from './GlassCard';
import ChoresPressure from './ChoresPressure';
import { getStatus, fmtTime } from '../data/scheduleStore';

export default function TodayStatusCard({ currentDate, schedule, now, viewingToday, isPastDay, undoneChores, onOpenChores }) {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let currentTaskName = '休息中', completed = 0, tracked = 0;

  if (schedule.length > 0) {
    schedule.forEach(item => {
      const isSpecial = !!item.isSpecial;
      const status = isSpecial ? 'special' : getStatus(nowMin, item.start, item.end, viewingToday, isPastDay);
      if (!isSpecial) tracked++;
      if (status === 'done') { completed++; }
      else if (status === 'active') { currentTaskName = item.title; }
    });
    if (completed === tracked && tracked > 0 && viewingToday) currentTaskName = '全部完成';
    if (completed === tracked && tracked > 0 && isPastDay) {
      const phrases = ['🎉 今日事今日毕','✨ 恭喜完成任务','🏆 完美的一天','🌟 全部搞定','💪 自我管理大师','☀️ 充实的一天结束了'];
      currentTaskName = phrases[Math.floor(Math.random()*phrases.length)];
    }
    const isFutureDay = !viewingToday && !isPastDay;
    if (isFutureDay && schedule.length > 0) {
      const fPhrases = ['🌱 未来可期','✨ 值得期待的一天','📅 提前规划，从容不迫','🚀 美好的一天在前方','💫 明天会更好','🌈 期待你的精彩'];
      currentTaskName = fPhrases[Math.floor(Math.random()*fPhrases.length)];
    }
  }

  const pct = tracked > 0 ? Math.round(completed / tracked * 100) : 0;
  const isOtherDay = !viewingToday;

  return (
    <GlassCard className={`status-card${isOtherDay ? ' is-other-day' : ''}`}>
      <div className="status-current-task">
        <span className="status-active-dot" />
        <span className="status-task-name">{currentTaskName}</span>
        <span className="status-time-inline">{fmtTime(now)}</span>
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>进度</span>
          <span>{completed}/{tracked}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: pct + '%' }} />
        </div>
      </div>

      <div className="chores-inline">
        <ChoresPressure undoneCount={undoneChores} onOpen={onOpenChores} />
      </div>
    </GlassCard>
  );
}