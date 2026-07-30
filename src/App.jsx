import React from 'react';
import DateNav from './components/DateNav';
import NotifyToggle from './components/NotifyToggle';
import TodayStatusCard from './components/TodayStatusCard';
import Timeline from './components/Timeline';
import ChoresSheet from './components/ChoresSheet';
import {
  seedAll, loadStore, loadChores, fmtDate, parseDate, isToday, fmtTime,
} from './data/scheduleStore';

export default function App() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [now, setNow] = React.useState(new Date());
  const [choresOpen, setChoresOpen] = React.useState(false);

  React.useEffect(() => { seedAll(); }, []);

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
      <div className="bg-gradient" />

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