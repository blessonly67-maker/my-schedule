import React from 'react';
import GlassCard from './GlassCard';
import EditActionBar from './EditActionBar';
import { getStatus, loadStore, saveStore, fmtDate } from '../data/scheduleStore';

function isItemDone(item, nowMin, viewingToday, isPastDay) {
  if (item.isSpecial) return 'special';
  if (!viewingToday && !isPastDay) return 'upcoming';
  var a = item.start.split(':').map(Number), b = item.end.split(':').map(Number);
  var nm = nowMin, s = a[0]*60+a[1], e = b[0]*60+b[1];
  if (nm >= e) return 'done';
  if (nm >= s && nm < e) return 'active';
  return 'upcoming';
}

// Recalculate time slots after reorder
function recalcTimes(items) {
  if (items.length < 2) return items;
  var filtered = items.filter(function(i) { return !i.isSpecial; });
  if (filtered.length < 2) return items;
  var firstStart = filtered[0].start;
  var lastEnd = filtered[filtered.length - 1].end;
  var totalMin = toMin(lastEnd) - toMin(firstStart);
  if (totalMin <= 0) return items;
  var totalDur = filtered.reduce(function(sum, i) { return sum + durMin(i); }, 0);
  var scale = totalDur > 0 ? totalMin / totalDur : 1;
  var cursor = toMin(firstStart);
  filtered.forEach(function(item) {
    var d = Math.round(durMin(item) * scale);
    item.start = fromMin(cursor);
    item.end = fromMin(cursor + d);
    item.userModified = true;
    cursor += d;
  });
  return items;
}

function toMin(t) { var p = t.split(':'); return parseInt(p[0])*60 + parseInt(p[1]); }
function fromMin(m) { var h = Math.floor(m/60), min = m % 60; return String(h).padStart(2,'0') + ':' + String(min).padStart(2,'0'); }
function durMin(item) { return toMin(item.end) - toMin(item.start); }

function TimelineCard({ item, status, isEditing, isSelected, isDragging, onSelect, dragListeners }) {
  var isSpecial = !!item.isSpecial;
  var badge = '';
  var iconBg = '';
  var dotClass = '';
  if (isSpecial) { badge = '重要'; iconBg = 'special'; dotClass = 'special'; }
  else if (status === 'active') { badge = '进行中'; iconBg = 'active'; dotClass = 'active'; }
  else if (status === 'done') { badge = '已结束'; iconBg = 'done'; dotClass = 'done'; }
  else { badge = '待开始'; iconBg = 'upcoming'; }
  var timeStr = isSpecial ? '全天' : item.start + ' – ' + item.end;
  var dimStyle = status === 'done' ? { opacity: 0.5 } : {};
  var filterDone = status === 'done';

  return (
    <div
      className={'tl-item' + (isDragging ? ' dragging' : '') + (filterDone ? ' tl-done' : '')}
      style={dimStyle}
      onClick={function(e) { if (isEditing) { e.stopPropagation(); onSelect(); } }}
      {...dragListeners}
    >
      <div className={'tl-dot ' + dotClass} />
      <GlassCard className={'tl-card ' + iconBg + '-card' + (isEditing && !filterDone ? ' editing' : '') + (isDragging ? ' dragging' : '') + (isSelected ? ' selected' : '')}>
        {isEditing && !filterDone && <div className="tl-edit-handle">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <circle cx="2" cy="2" r="1.5" fill="#c7c7cc"/><circle cx="6" cy="2" r="1.5" fill="#c7c7cc"/>
            <circle cx="2" cy="7" r="1.5" fill="#c7c7cc"/><circle cx="6" cy="7" r="1.5" fill="#c7c7cc"/>
            <circle cx="2" cy="12" r="1.5" fill="#c7c7cc"/><circle cx="6" cy="12" r="1.5" fill="#c7c7cc"/>
          </svg>
        </div>}
        <div className={'tl-icon-bg ' + iconBg + '-bg'}>{item.icon}</div>
        <div className="tl-body">
          <div className="tl-time">{timeStr} · {item.duration || ''}</div>
          <div className="tl-title-row">
            <span className="tl-title">{item.title}</span>
            <span className={'badge badge-' + iconBg}>{badge}</span>
            {isEditing && !filterDone && <span className="tl-user-badge">已编辑</span>}
          </div>
          {item.note && <div className="tl-note">{item.note}</div>}
        </div>
      </GlassCard>
    </div>
  );
}

export default function Timeline({ schedule, now, viewingToday, isPastDay, currentDate, onScheduleChange }) {
  var nowMin = now.getHours() * 60 + now.getMinutes();
  var [doneExpanded, setDoneExpanded] = React.useState(false);
  var [editMode, setEditMode] = React.useState(false);
  var [selectedIdx, setSelectedIdx] = React.useState(null);
  var [dragIdx, setDragIdx] = React.useState(null);
  var [dragOverIdx, setDragOverIdx] = React.useState(null);
  var [items, setItems] = React.useState([]);
  var longPressTimer = React.useRef(null);
  var isPointerDown = React.useRef(false);

  // Update items when schedule changes
  React.useEffect(function() {
    setItems(schedule.map(function(item) { return Object.assign({}, item); }));
  }, [schedule]);

  var pendingItems = items.filter(function(item, i) {
    var status = isItemDone(item, nowMin, viewingToday, isPastDay);
    return status !== 'done';
  });
  var doneItems = items.filter(function(item, i) {
    var status = isItemDone(item, nowMin, viewingToday, isPastDay);
    return status === 'done';
  });

  // Stop editing on Escape
  React.useEffect(function() {
    if (!editMode) return;
    function onKey(e) { if (e.key === 'Escape') exitEdit(); }
    window.addEventListener('keydown', onKey);
    return function() { window.removeEventListener('keydown', onKey); };
  }, [editMode]);

  function enterEdit() { setEditMode(true); setSelectedIdx(null); }
  function exitEdit() {
    setEditMode(false);
    setSelectedIdx(null);
    setDragIdx(null);
    setDragOverIdx(null);
    // Save changes
    if (onScheduleChange) onScheduleChange(items);
  }

  function handleCardPointerDown(index) {
    var moved = false;
    var timerId = setTimeout(function() {
      if (!moved && !editMode) {
        enterEdit();
        setSelectedIdx(index);
      }
    }, 500);
    function onMove() { moved = true; }
    function onUp() {
      if (!moved && editMode && !isItemDone(items[index], nowMin, viewingToday, isPastDay)) {
        setSelectedIdx(index === selectedIdx ? null : index);
      }
      clearTimeout(timerId);
      cleanup();
    }
    function cleanup() {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    }
    document.addEventListener('pointermove', onMove, { once: true });
    document.addEventListener('pointerup', onUp, { once: true });
  }

  // Drag & Drop via pointer events
  var dragState = React.useRef(null);

  function startDrag(index, e) {
    if (!editMode || isItemDone(items[index], nowMin, viewingToday, isPastDay)) return;
    // For reordering, use the touch/pointer position
    var container = e.currentTarget.closest('.timeline-wrap');
    if (!container) return;
    var rect = container.getBoundingClientRect();
    dragState.current = { index: index, startY: e.clientY, containerTop: rect.top, itemHeights: [] };
    setDragIdx(index);
    var cardEls = container.querySelectorAll('.tl-item:not(.tl-done)');
    cardEls.forEach(function(el) {
      dragState.current.itemHeights.push(el.offsetHeight);
    });
  }

  function onPointerDown(index, e) {
    handleCardPointerDown(index);
    if (editMode) {
      startDrag(index, e);
    }
  }

  function onPointerMove(e) {
    if (dragIdx === null || !dragState.current) return;
    var offset = e.clientY - dragState.current.startY;
    // Calculate new position
    var items = dragState.current.itemHeights;
    var totalOffset = 0;
    var newIdx = dragIdx;
    for (var i = 0; i < items.length; i++) {
      if (i === dragIdx) continue;
      var adjustedIdx = i > dragIdx ? i - 1 : i;
      if (offset > totalOffset + items[i] / 2 && adjustedIdx >= newIdx) {
        newIdx = i;
      } else if (offset < -(totalOffset + items[i] / 2) && adjustedIdx <= newIdx) {
        newIdx = i;
      }
      totalOffset += items[i];
    }
    if (newIdx !== dragOverIdx) setDragOverIdx(newIdx);
    e.preventDefault();
  }

  function onPointerUp() {
    if (dragIdx !== null && dragOverIdx !== null && dragIdx !== dragOverIdx) {
      // Reorder
      var newItems = [].concat(items);
      var filtered = newItems.filter(function(_, i) { return !isItemDone(items[i], nowMin, viewingToday, isPastDay); });
      var [moved] = filtered.splice(dragIdx, 1);
      filtered.splice(dragOverIdx, 0, moved);
      // Merge back with done items
      var result = [];
      var fIdx = 0;
      for (var i = 0; i < newItems.length; i++) {
        if (isItemDone(items[i], nowMin, viewingToday, isPastDay)) {
          result.push(newItems[i]);
        } else {
          result.push(filtered[fIdx]);
          fIdx++;
        }
      }
      recalcTimes(result.filter(function(item) { return !item.isSpecial; }));
      setItems(result);
    }
    setDragIdx(null);
    setDragOverIdx(null);
    dragState.current = null;
  }

  // Delete a pending item
  function deleteItem(index) {
    if (index === null || index < 0) return;
    var newItems = [].concat(items);
    // Find the actual pending item at this visual index
    var pending = [];
    for (var i = 0; i < newItems.length; i++) {
      if (!isItemDone(newItems[i], nowMin, viewingToday, isPastDay)) pending.push(i);
    }
    if (index < pending.length) {
      newItems.splice(pending[index], 1);
      setItems(newItems);
      setSelectedIdx(null);
    }
  }

  // Add new task
  function addTask() {
    var newItems = [].concat(items);
    var last = newItems[newItems.length - 1];
    var lastEnd = last && !last.isSpecial ? last.end : '09:00';
    var startMin = toMin(lastEnd);
    var endMin = startMin + 30;
    newItems.push({
      icon: '📌', title: '新任务', start: fromMin(startMin),
      end: fromMin(endMin), duration: '30分钟', note: '',
      userModified: true
    });
    setItems(newItems);
    setSelectedIdx(null);
  }

  var lastEnd = schedule.filter(function(i) { return !i.isSpecial; }).length > 0
    ? schedule.filter(function(i) { return !i.isSpecial; })[schedule.filter(function(i) { return !i.isSpecial; }).length - 1].end
    : '全天';

  return (
    <div>
      <div className="section-title">时间线</div>
      <div className={'timeline-wrap' + (editMode ? ' editing' : '')}>
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>这天还没有安排</p>
          </div>
        ) : (
          <>
            {doneItems.length > 0 && (
              <div className={'done-stack' + (doneExpanded ? ' expanded' : '')} onClick={function(e) { e.stopPropagation(); setDoneExpanded(!doneExpanded); }}>
                <div className="stack-layer"></div>
                <div className="stack-layer"></div>
                <div className="stack-card glass-card">
                  <div className="stack-dot"></div>
                  <span className="stack-summary">{doneItems.map(function(i) { return i.icon + ' ' + i.title; }).join(' · ')}</span>
                  <span className="stack-count">{doneItems.length}项</span>
                  <span className={'stack-chevron' + (doneExpanded ? ' open' : '')}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3.5l2.5 3L8 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
                <div className="stack-detail">
                  {doneItems.map(function(item, i) {
                    return <div key={i} className="stack-item"><span className="stack-item-icon">{item.icon}</span><span>{item.title}</span><span className="stack-item-time">{item.start || '全天'}</span></div>;
                  })}
                </div>
              </div>
            )}
            {items.map(function(item, i) {
              var status = isItemDone(item, nowMin, viewingToday, isPastDay);
              if (status === 'done') return null;
              var visualIdx = pendingItems.indexOf(item);
              return (
                <TimelineCard
                  key={i}
                  item={item}
                  status={status}
                  isEditing={editMode}
                  isSelected={selectedIdx === visualIdx}
                  isDragging={dragIdx === visualIdx}
                  onSelect={function() { setSelectedIdx(visualIdx === selectedIdx ? null : visualIdx); }}
                  dragListeners={{
                    onPointerDown: function(e) { onPointerDown(visualIdx, e); },
                    onPointerMove: onPointerMove,
                    onPointerUp: onPointerUp,
                  }}
                />
              );
            })}
          </>
        )}
      </div>
      <div className="footer">
        预计 <strong>{lastEnd}</strong> 完成
      </div>
      {editMode && (
        <EditActionBar
          selectedIndex={selectedIdx}
          onAdd={addTask}
          onDelete={deleteItem}
          onDone={exitEdit}
        />
      )}
    </div>
  );
}
