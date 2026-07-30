import React from 'react';
import { getNotifyStatus, toggleNotifications } from '../data/scheduleStore';

export default function NotifyToggle({ onStatusChange }) {
  const [enabled, setEnabled] = React.useState(getNotifyStatus());
  const [statusText, setStatusText] = React.useState(getNotifyStatus() ? '已开启' : '已关闭');

  React.useEffect(() => {
    if (getNotifyStatus() && Notification.permission === 'granted') {
      const { loadNotified } = require ? {} : {};
      window.__notifiedTasks = window.__notifiedTasks || {};
      scheduleAllNotifications();
    }
  }, []);

  const handleToggle = (checked) => {
    const result = toggleNotifications(checked);
    setEnabled(result);
    setStatusText(result ? '已开启' : '已关闭');
    if (onStatusChange) onStatusChange(result);
  };

  return (
    <div className="notify-toggle">
      <span className="notify-label">🔔 到点提醒</span>
      <label className="switch" htmlFor="notifySwitch">
        <input
          type="checkbox"
          id="notifySwitch"
          checked={enabled}
          onChange={(e) => handleToggle(e.target.checked)}
        />
        <span className="switch-track">
          <span className="switch-thumb" />
        </span>
      </label>
      <span className="notify-status">{statusText}</span>
    </div>
  );
}
