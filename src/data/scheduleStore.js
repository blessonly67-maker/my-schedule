// ── 数据逻辑：完全保持原版不变 ──
export const STORE_KEY = 'my_schedule_data';
export const NOTIFY_KEY = 'notifications_enabled';
export const NOTIFIED_KEY = 'notified_tasks';
export const CHORES_KEY = 'my_chores_data';

export function loadStore() { try { return JSON.parse(localStorage.getItem(STORE_KEY)||'{}'); } catch { return {}; } }
export function saveStore(d) { localStorage.setItem(STORE_KEY, JSON.stringify(d)); }
export function loadChores() { try { return JSON.parse(localStorage.getItem(CHORES_KEY)||'{}'); } catch { return {}; } }
export function saveChores(d) { localStorage.setItem(CHORES_KEY, JSON.stringify(d)); }

export function seedAll() {
  const store = loadStore();
  const today = fmtDate(new Date());
  const force = localStorage.getItem('_reseed') === '1';
  if (force || !store[today]) {
    store[today] = [
      { icon:"🌅",title:"起床 + 洗漱",start:"10:00",end:"10:30",duration:"30分钟",note:"不用急，慢慢来" },
      { icon:"👕",title:"洗衣服",start:"10:30",end:"11:00",duration:"30分钟",note:"把衣服丢进洗衣机" },
      { icon:"🗣️",title:"上午英语",start:"11:00",end:"11:30",duration:"30分钟",note:"早上脑子清醒，先学英语" },
      { icon:"🍜",title:"午饭 + 休息",start:"11:30",end:"12:30",duration:"1小时",note:"吃完休息再出发" },
      { icon:"🚶",title:"去图书馆",start:"12:30",end:"13:00",duration:"30分钟",note:"" },
      { icon:"📚",title:"图书馆学习",start:"13:00",end:"18:00",duration:"5小时",note:"中间自行安排休息，学到18点走" },
      { icon:"🚶",title:"回家",start:"18:00",end:"18:30",duration:"30分钟",note:"" },
      { icon:"🍽️",title:"晚饭 + 休息",start:"18:30",end:"19:30",duration:"1小时",note:"到家先吃饭" },
      { icon:"🗣️",title:"晚间英语",start:"19:30",end:"20:00",duration:"30分钟",note:"饭后消食学英语" },
      { icon:"🏋️",title:"健身",start:"21:00",end:"22:30",duration:"1.5小时",note:"" },
      { icon:"🚿",title:"洗澡",start:"22:30",end:"23:00",duration:"30分钟",note:"练完洗澡收尾" },
    ];
  }
  if (!store['2026-08-28']) {
    store['2026-08-28'] = [{ icon:"🎂",title:"爸爸的生日",start:"",end:"",duration:"全天",note:"记得给爸爸打电话/发消息祝生日快乐！🎁",isSpecial:true }];
  }
  const tomorrow = fmtDate(new Date(Date.now() + 86400000));
  if (force || !store[tomorrow]) {
    store[tomorrow] = [
      { icon:"🌅",title:"起床 + 洗漱",start:"10:00",end:"10:30",duration:"30分钟",note:"不用急，慢慢来" },
      { icon:"👕",title:"洗衣服",start:"10:30",end:"11:00",duration:"30分钟",note:"把衣服丢进洗衣机" },
      { icon:"🗣️",title:"上午英语",start:"11:00",end:"11:30",duration:"30分钟",note:"早上脑子清醒，先学英语" },
      { icon:"🍜",title:"午饭 + 休息",start:"11:30",end:"12:30",duration:"1小时",note:"吃完休息再出发" },
      { icon:"🚶",title:"去图书馆",start:"12:30",end:"13:00",duration:"30分钟",note:"" },
      { icon:"📚",title:"图书馆学习",start:"13:00",end:"18:00",duration:"5小时",note:"中间自行安排休息，学到18点走" },
      { icon:"🚶",title:"回家",start:"18:00",end:"18:30",duration:"30分钟",note:"" },
      { icon:"🍽️",title:"晚饭 + 休息",start:"18:30",end:"19:30",duration:"1小时",note:"到家先吃饭" },
      { icon:"🗣️",title:"晚间英语",start:"19:30",end:"20:00",duration:"30分钟",note:"饭后消食学英语" },
      { icon:"🏋️",title:"健身",start:"21:00",end:"22:30",duration:"1.5小时",note:"" },
      { icon:"🚿",title:"洗澡",start:"22:30",end:"23:00",duration:"30分钟",note:"练完洗澡收尾" },
    ];
  }
  if (force || !store['2026-07-31']) {
    store['2026-07-31'] = [
      { icon:"🌅",title:"起床 + 洗漱",start:"10:00",end:"10:30",duration:"30分钟",note:"周五啦，不用急" },
      { icon:"🛏️",title:"收拾房间",start:"10:30",end:"11:00",duration:"30分钟",note:"整理床铺，收拾杂物" },
      { icon:"🧹",title:"打扫家庭卫生",start:"11:00",end:"12:00",duration:"1小时",note:"早上起来打扫，干干净净迎周末" },
      { icon:"🗣️",title:"上午英语",start:"12:00",end:"12:30",duration:"30分钟",note:"打扫完学英语" },
      { icon:"🍜",title:"午饭 + 休息",start:"12:30",end:"13:30",duration:"1小时",note:"" },
      { icon:"🚶",title:"去图书馆",start:"13:30",end:"14:00",duration:"30分钟",note:"" },
      { icon:"📚",title:"图书馆学习",start:"14:00",end:"18:00",duration:"4小时",note:"中间自行安排休息，学到18点走" },
      { icon:"🚶",title:"回家",start:"18:00",end:"18:30",duration:"30分钟",note:"" },
      { icon:"🍽️",title:"晚饭 + 休息",start:"18:30",end:"19:30",duration:"1小时",note:"" },
      { icon:"🗣️",title:"晚间英语",start:"19:30",end:"20:00",duration:"30分钟",note:"" },
      { icon:"🏋️",title:"健身",start:"21:00",end:"22:30",duration:"1.5小时",note:"" },
      { icon:"🚿",title:"洗澡",start:"22:30",end:"23:00",duration:"30分钟",note:"" },
    ];
  }
  if (force) localStorage.removeItem('_reseed');
  saveStore(store);
}

// ─── 通知 ───
let notificationsEnabled = false, notifiedTasks = {}, notifyTimers = [];
export function loadNotified() { try { return JSON.parse(localStorage.getItem(NOTIFIED_KEY)||'{}'); } catch { return {}; } }

export function scheduleAllNotifications() {
  clearAllTimers();
  if (!notificationsEnabled) return;
  const store = loadStore(), today = fmtDate(new Date());
  const items = store[today] || [];
  items.forEach(item => {
    if (item.isSpecial || !item.start) return;
    const k = item.start + '|' + item.title;
    if (notifiedTasks[k]) return;
    const [h, m] = item.start.split(':').map(Number);
    const now = new Date(), target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    const delay = target - now;
    if (delay <= 0 || delay > 86400000) return;
    const tid = setTimeout(() => fireNotification(item), delay);
    notifyTimers.push(tid);
  });
}

function clearAllTimers() { notifyTimers.forEach(clearTimeout); notifyTimers = []; }

function fireNotification(item) {
  const k = item.start + '|' + item.title;
  if (notifiedTasks[k]) return;
  const n = new Notification(item.icon + ' ' + item.title + ' — 该开始了', {
    body: item.note || ('预计 ' + item.duration),
    tag: k, requireInteraction: true, silent: false,
  });
  n.onclick = () => { window.focus(); n.close(); };
  notifiedTasks[k] = true;
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notifiedTasks));
}

export function toggleNotifications(on) {
  if (on) {
    if (!('Notification' in window)) { return false; }
    if (Notification.permission === 'denied') { return false; }
    if (Notification.permission === 'granted') {
      notificationsEnabled = true; notifiedTasks = loadNotified();
      localStorage.setItem(NOTIFY_KEY, '1'); scheduleAllNotifications();
      new Notification('✅ 通知已开启', { body: '到点会自动提醒你', silent: false });
      return true;
    } else {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          notificationsEnabled = true; notifiedTasks = loadNotified();
          localStorage.setItem(NOTIFY_KEY, '1'); scheduleAllNotifications();
          new Notification('✅ 通知已开启', { body: '到点会自动提醒你', silent: false });
        }
      });
      return true;
    }
  } else {
    notificationsEnabled = false; clearAllTimers();
    localStorage.setItem(NOTIFY_KEY, '0');
    return false;
  }
}

export function getNotifyStatus() {
  return localStorage.getItem(NOTIFY_KEY)==='1' ? true : false;
}

// ─── 日期工具 ───
export function fmtDate(d) { return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
export function parseDate(s) { const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
export function isToday(d) { const t=new Date(); return d.getFullYear()===t.getFullYear()&&d.getMonth()===t.getMonth()&&d.getDate()===t.getDate(); }
export function fmtDisplayDate(d) {
  const today=new Date(), diff=Math.floor((d-new Date(today.getFullYear(),today.getMonth(),today.getDate()))/86400000);
  const wd=['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
  if(diff===0) return '今天 · '+(d.getMonth()+1)+'月'+d.getDate()+'日 '+wd;
  if(diff===1) return '明天 · '+(d.getMonth()+1)+'月'+d.getDate()+'日 '+wd;
  if(diff===-1) return '昨天 · '+(d.getMonth()+1)+'月'+d.getDate()+'日 '+wd;
  return (d.getMonth()+1)+'月'+d.getDate()+'日 '+wd;
}
export function timeToMinutes(t) { const [h,m]=t.split(':').map(Number); return h*60+m; }
export function getStatus(nm,s,e,vt,isPast) { if(!vt && !isPast) return 'upcoming'; const a=timeToMinutes(s),b=timeToMinutes(e); if(nm>=b) return 'done'; if(nm>=a&&nm<b) return 'active'; return 'upcoming'; }
export function fmtTime(d) { return d.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}); }
export function fmtTimeNoSec(d) { return d.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false}); }

// ─── 重置版本缓存（原版保留） ───
(function(){
  var VER = '15';
  var stored = localStorage.getItem('_app_version');
  if (stored !== VER) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(regs) {
        regs.forEach(function(r) { r.unregister(); });
      });
    }
    if ('caches' in window) {
      caches.keys().then(function(keys) {
        keys.forEach(function(k) { caches.delete(k); });
      });
    }
    localStorage.setItem('_reseed', '1');
    localStorage.setItem('_app_version', VER);
  }
})();
