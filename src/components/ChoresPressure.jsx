import React from 'react';

function getPressureInfo(undoneCount) {
  if (undoneCount === 0) {
    return { level: 'clear', bar: null, label: '✨ 今日轻松', sub: '暂无生活琐事', color: '#34c759' };
  }
  let ratio = Math.min(undoneCount / 10, 1);
  let color, level;
  if (ratio >= 0.7) {
    color = '#ff3b30';
    level = 'high';
  } else if (ratio >= 0.35) {
    color = '#ff9500';
    level = 'medium';
  } else {
    color = '#007aff';
    level = 'low';
  }
  const fills = Math.round(ratio * 10);
  const bar = '█'.repeat(fills) + '░'.repeat(10 - fills);
  let label;
  if (ratio >= 0.7) label = '压力有点大';
  else if (ratio >= 0.35) label = '还在处理中';
  else label = '比较轻松';
  return { level, bar, label, sub: `还有 ${undoneCount} 件小事`, color };
}

export default function ChoresPressure({ undoneCount, onOpen }) {
  const info = getPressureInfo(undoneCount);

  return (
    <div className="chores-pressure" onClick={onOpen}>
      <div className="chores-pressure-header">
        <span>📝 生活琐事</span>
        <span className="pressure-label" style={{ color: info.color }}>{info.label}</span>
      </div>
      {info.bar !== null && (
        <div className="pressure-bar-wrap">
          <span className="pressure-bar" style={{ color: info.color }}>{info.bar}</span>
        </div>
      )}
      <div className="pressure-sub" style={{ color: info.color }}>{info.sub}</div>
    </div>
  );
}
