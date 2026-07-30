import React from 'react';
import DateNav from './components/DateNav';
import NotifyToggle from './components/NotifyToggle';
import TodayStatusCard from './components/TodayStatusCard';
import Timeline from './components/Timeline';
import ChoresSheet from './components/ChoresSheet';
import {
  seedAll, loadStore, saveStore, loadChores, fmtDate, parseDate, isToday, fmtTime, startNotificationService, getNotifyStatus, scheduleTestNotification,
} from './data/scheduleStore';

export default function App() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [now, setNow] = React.useState(new Date());
  const [choresOpen, setChoresOpen] = React.useState(false);

  React.useEffect(() => { seedAll(); }, []);

  // Expose test notification to window for the test button
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__scheduleTestNotification = scheduleTestNotification;
    }
    function handleScheduleChange(updatedItems) {
    var store = loadStore();
    store[dateKey] = updatedItems;
    saveStore(store);
  }

  return () => { if (typeof window !== 'undefined') delete window.__scheduleTestNotification; };
  }, []);

  // Register Service Worker for background notifications
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/my-schedule/sw.js').then(reg => {
        console.log('SW registered:', reg.scope);
      }).catch(err => {
        console.warn('SW registration failed:', err);
      });
    }
  }, []);

  // Start the background notification checker (runs every 60s)
  React.useEffect(() => {
    if (getNotifyStatus() && Notification.permission === 'granted') {
      startNotificationService();
    }
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const viewingToday = isToday(currentDate);
  const isPastDay = !viewingToday && (
    currentDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())
  );

  const dateKey = fmtDate(currentDate);
  const store = loadStore();
  const schedule = store[dateKey] || [];

  const allChores = loadChores();
  const todayChores = allChores[dateKey] || [];
  const undoneChores = todayChores.filter(c => !c.done).length;

  const handleDayChange = (offset) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + offset);
    setCurrentDate(next);
  };

  const handleDatePick = (val) => {
    if (val) setCurrentDate(parseDate(val));
  };

  return (
    <div className="container">
<DateNav
        currentDate={currentDate}
        onDayChange={handleDayChange}
        onDatePick={handleDatePick}
        isToday={viewingToday}
      />

      <NotifyToggle />



      <TodayStatusCard
        currentDate={currentDate}
        schedule={schedule}
        now={now}
        viewingToday={viewingToday}
        isPastDay={isPastDay}
        undoneChores={undoneChores}
        onOpenChores={() => setChoresOpen(true)}
      />

      <Timeline
        schedule={schedule}
        now={now}
        viewingToday={viewingToday}
        isPastDay={isPastDay}
      />

      <ChoresSheet
        open={choresOpen}
        currentDate={currentDate}
        onClose={() => setChoresOpen(false)}
      />

      <div className="home-indicator-safe" />
    </div>
  );
}