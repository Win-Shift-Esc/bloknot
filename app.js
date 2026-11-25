(() => {
  "use strict";
  // Темы таймера. t — активные темы (меняется на месте при смене настроек), ALLCATS — все, включая архив.
  const DEFAULT_CATS = [
      { id: "phys", name: "Олимпиадная физика", short: "Физика", color: "#ff6a3d", goal: 10 },
      { id: "tyf", name: "ТЮФ", short: "ТЮФ", color: "#9b7bff", goal: 0 },
      { id: "hw", name: "Домашка и школа", short: "Школа", color: "#4f8dff", goal: 0 },
      { id: "philo", name: "Логика и философия", short: "Логика", color: "#2ec4a6", goal: 2.5 },
      { id: "ger", name: "Немецкий", short: "Немецкий", color: "#b7dd4a", goal: 3.5 },
      { id: "eng", name: "Английский", short: "Английский", color: "#ff6fae", goal: 1.5 },
      { id: "read", name: "Чтение", short: "Чтение", color: "#e3b341", goal: 3.5 },
      { id: "prog", name: "Программирование", short: "Код", color: "#6cc644", goal: 0, archived: !0 },
      { id: "other", name: "Другое", short: "Другое", color: "#8a8fa3", goal: 0 },
    ],
    CAT_COLORS = ["#ff6a3d", "#e3b341", "#b7dd4a", "#6cc644", "#2ec4a6", "#4f8dff", "#9b7bff", "#ff6fae", "#ff5c5c", "#8a8fa3"],
    t = DEFAULT_CATS.filter((c) => !c.archived).map((c) => Object.assign({}, c)),
    ALLCATS = DEFAULT_CATS.map((c) => Object.assign({}, c)),
    a = { id: "games", name: "Игры", short: "Игры", color: "#ff5c5c" },
    e = { id: "break", name: "Перерыв", short: "Перерыв", color: "#2ec4a6" },
    UNKNOWN_CAT = { id: "?", name: "Удалённая тема", short: "Удалено", color: "#6b6b73" },
    s = (s) =>
      "games" === s ? a : "break" === s ? e : ALLCATS.find((t) => t.id === s) || Object.assign({}, UNKNOWN_CAT, { id: s }),
    n = [
      "Алгебра",
      "Геометрия",
      "Физика",
      "Русский язык",
      "Литература",
      "Английский",
      "История",
      "Обществознание",
      "Химия",
      "Биология",
      "Информатика",
      "География",
    ],
    o = [
      { id: "solved", name: "Решил сам", short: "сам", cls: "ok" },
      { id: "hint", name: "С подсказкой", short: "с подсказкой", cls: "warn" },
      { id: "failed", name: "Не решил", short: "не решил", cls: "bad" },
      {
        id: "read",
        name: "Разобрал решение",
        short: "разобрал",
        cls: "info",
      },
    ],
    i = [
      { id: "olymp", name: "Олимпиада", color: "#e0532a" },
      { id: "test", name: "Контрольная", color: "#2f6fd6" },
      { id: "tyf", name: "ТЮФ", color: "#7c4dcc" },
      { id: "other", name: "Другое", color: "#8a8fa3" },
    ],
    l = (t) => i.find((a) => a.id === t) || i[3],
    PLAN_HABITS = [
      { id: "hw", name: "Домашка", t: [1, 1, 1, 1, 1, 0, 1] },
      { id: "kruzhok", name: "Урок «Кружка»", t: [1, 1, 1, 1, 1, 3, 3] },
      { id: "philo", name: "Логика и философия", t: [1, 0, 0, 0, 1, 0, 1] },
      { id: "ger", name: "Немецкий", t: [1, 1, 1, 1, 1, 1, 1] },
      { id: "eng", name: "Английский", t: [0, 0, 0, 0, 0, 1, 1] },
      { id: "read", name: "Чтение 30 мин", t: [1, 1, 1, 1, 1, 1, 1] },
      { id: "gym", name: "Зал", t: [0, 1, 0, 1, 0, 0, 0] },
      { id: "report", name: "Отчёт и взвешивание", t: [0, 0, 0, 0, 0, 0, 1] },
      { id: "sleep", name: "Лёг спать до 23:00", t: [1, 1, 1, 1, 1, 1, 1] },
    ],
    DEFAULT_MIN = [
      { id: "m1", name: "Домашка на завтра" },
      { id: "m2", name: "1 урок «Кружка» или 30 мин физики" },
      { id: "m3", name: "10 минут немецкого" },
      { id: "m4", name: "Лечь до 23:00" },
    ],
    // Шаблон дня: start "ЧЧ:ММ", dur в минутах, cat — тема таймера (null — отдых без таймера, "debt" — окно долгов),
    // mode: "res" — по результату (быстрее можно), "time" — по времени. fixed — встреча: время не сдвигается.
    SB = (id, start, dur, title, cat, mode, fixed) => ({ id, start, dur, title, cat: cat || null, mode: mode || "time", fixed: !!fixed }),
    WD_EVENING = (d, extra) =>
      [
        SB(d + "a", "17:00", 30, "Обед и отдых"),
        SB(d + "b", "17:30", 90, "Домашка", "hw", "res"),
        SB(d + "c", "19:00", 60, "Кружок · 1 урок", "phys", "res"),
      ].concat(extra),
    DEFAULT_SCHED = {
      d0: WD_EVENING("mo", [
        SB("mod", "20:00", 15, "Перерыв"),
        SB("moe", "20:15", 45, "Логика и философия", "philo"),
        SB("mof", "21:00", 35, "Немецкий · порция", "ger", "res"),
        SB("mog", "21:35", 25, "Свободно"),
        SB("moh", "22:00", 30, "Чтение", "read"),
        SB("moi", "22:30", 30, "Подготовка ко сну"),
      ]),
      d1: WD_EVENING("tu", [
        SB("tud", "20:00", 90, "Зал"),
        SB("tue", "21:30", 35, "Немецкий · порция", "ger", "res"),
        SB("tuf", "22:05", 30, "Чтение", "read"),
        SB("tug", "22:35", 25, "Подготовка ко сну"),
      ]),
      d2: WD_EVENING("we", [
        SB("wed", "20:00", 15, "Перерыв"),
        SB("wee", "20:15", 60, "Окно долгов и проектов", "debt"),
        SB("wef", "21:15", 35, "Немецкий · порция", "ger", "res"),
        SB("weg", "21:50", 10, "Свободно"),
        SB("weh", "22:00", 30, "Чтение", "read"),
        SB("wei", "22:30", 30, "Подготовка ко сну"),
      ]),
      d3: WD_EVENING("th", [
        SB("thd", "20:00", 90, "Зал"),
        SB("the", "21:30", 35, "Немецкий · порция", "ger", "res"),
        SB("thf", "22:05", 30, "Чтение", "read"),
        SB("thg", "22:35", 25, "Подготовка ко сну"),
      ]),
      d4: WD_EVENING("fr", [
        SB("frd", "20:00", 15, "Перерыв"),
        SB("fre", "20:15", 45, "Логика и философия", "philo"),
        SB("frf", "21:00", 35, "Немецкий · порция", "ger", "res"),
        SB("frg", "21:35", 25, "Свободно"),
        SB("frh", "22:00", 30, "Чтение", "read"),
        SB("fri", "22:30", 30, "Подготовка ко сну"),
      ]),
      d5: [
        SB("saa", "09:00", 60, "Завтрак и отдых"),
        SB("sab", "10:00", 60, "Кружок · урок 1", "phys", "res"),
        SB("sac", "11:15", 60, "Кружок · урок 2", "phys", "res"),
        SB("sad", "12:30", 60, "Обед"),
        SB("sae", "13:30", 60, "Кружок · урок 3", "phys", "res"),
        SB("saf", "15:00", 60, "Окно долгов", "debt"),
        SB("sag", "16:00", 90, "ТЮФ · встреча команды", "tyf", "time", 1),
        SB("sah", "17:30", 45, "Английский", "eng"),
        SB("sai", "18:15", 20, "Немецкий · разговор", "ger", "res"),
        SB("saj", "19:00", 120, "Игры и отдых"),
        SB("sak", "22:00", 30, "Чтение", "read"),
      ],
      d6: [
        SB("sua", "09:00", 60, "Завтрак, взвешивание"),
        SB("sub", "10:00", 60, "Кружок · урок 1", "phys", "res"),
        SB("suc", "11:15", 60, "Кружок · урок 2", "phys", "res"),
        SB("sud", "12:30", 60, "Обед"),
        SB("sue", "13:30", 60, "Кружок · урок 3", "phys", "res"),
        SB("suf", "14:45", 60, "Логика и философия", "philo"),
        SB("sug", "16:00", 45, "Английский", "eng"),
        SB("suh", "16:45", 15, "Немецкий · карточки", "ger", "res"),
        SB("sui", "17:00", 20, "Отчёт для Claude", "other", "res"),
        SB("suj", "18:00", 60, "Игры"),
        SB("suk", "20:00", 60, "Домашка на понедельник", "hw", "res"),
        SB("sul", "22:00", 30, "Чтение", "read"),
      ],
    },
    DEFAULT_TIMES = { wake: ["07:00", "07:00", "07:00", "07:00", "07:00", "09:00", "09:00"], sleep: "23:00" },
    r = {
      habits: PLAN_HABITS,
      gameLimit: [0, 0, 0, 0, 0, 120, 60],
      timetable: [[], [], [], [], [], [], []],
      weekGoals: {},
      cats: DEFAULT_CATS,
      sched: DEFAULT_SCHED,
      minimum: DEFAULT_MIN,
      times: DEFAULT_TIMES,
      reward: { on: !0, min: 30, pct: 80 },
      projects: [],
      planV: 1,
    },
    c = [
      {
        title: "Справедливость. Как поступать правильно?",
        author: "Майкл Сэндел",
        why: "обзор главных позиций политической философии, читается легко",
      },
      { title: "О свободе", author: "Джон Стюарт Милль", why: "классика либерализма, короткая" },
      {
        title: "Почему не социализм?",
        author: "Джеральд Коэн",
        why: "сильный левый аргумент, чтобы знать, с чем спорить",
      },
      {
        title: "Проблемы философии",
        author: "Бертран Рассел",
        why: "короткое введение от одного из основателей аналитической философии",
      },
      {
        title: "История западной философии",
        author: "Бертран Рассел",
        why: "история философии глазами аналитика",
      },
    ],
    d = [
      { title: "Уроки «Кружка»", unit: "уроков" },
      { title: "Конспект по физике: прочитано", unit: "заметок", total: 168 },
      { title: "Задачи ТЮФ", unit: "задач" },
    ],
    u = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
    p = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
    b = [
      ["today", "Сегодня"],
      ["hw", "Дневник"],
      ["timer", "Таймер"],
      ["books", "Книги"],
      ["more", "Ещё"],
    ],
    MORE_VIEWS = ["more", "week", "goals", "words", "notes"],
    m = b.map((t) => t[0]).concat(["week", "goals", "words", "notes"]),
    h = ["days", "hw", "notes", "books", "events", "goals", "problems", "weeks", "cards"],
    g = "Блокнот",
    f = "bloknot-v1",
    v = "bloknot-theme",
    $ = "bloknot-notify",
    y = "bloknot-installed",
    w = {
      today:
        '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
      hw: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="16" rx="2"/><path d="M3.5 9.5h17M8 2.5v4M16 2.5v4M7.5 13.5h3M13.5 13.5h3M7.5 17h3"/></svg>',
      timer:
        '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.5 2M9.5 2.5h5M12 2.5V6"/></svg>',
      goals:
        '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></svg>',
      week: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16M7 17v-5M12 17V7M17 17v-8"/></svg>',
      notes:
        '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/></svg>',
      books:
        '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5V5a1.5 1.5 0 0 1 1.5-1.5H11v16H5.5A1.5 1.5 0 0 0 4 21M20 19.5V5a1.5 1.5 0 0 0-1.5-1.5H13v16h5.5A1.5 1.5 0 0 1 20 21"/></svg>',
      more: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/></svg>',
      words:
        '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="6" width="13" height="14" rx="2"/><path d="M7.5 3.5h11a2 2 0 0 1 2 2v12"/><path d="M7 11h6M7 15h4"/></svg>',
      play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/></svg>',
      focus:
        '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"/></svg>',
      bell: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/></svg>',
      gear: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
      check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
      flag: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4h11l-2 4 2 4H5"/></svg>',
      pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l-1 6 4 4H6l4-4zM12 13v8"/></svg>',
      google:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>',
    },
    k = (t) => document.getElementById(t),
    x = (t) => String(t).padStart(2, "0"),
    j = (t = new Date()) => `${t.getFullYear()}-${x(t.getMonth() + 1)}-${x(t.getDate())}`,
    M = (t) => {
      const [a, e, s] = String(t).split("-").map(Number);
      return new Date(a, (e || 1) - 1, s || 1);
    },
    D = (t, a) => {
      const e = new Date(t);
      return (e.setDate(e.getDate() + a), e);
    },
    E = (t) => (t.getDay() + 6) % 7,
    O = (t) =>
      String(null == t ? "" : t).replace(
        /[&<>"']/g,
        (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t],
      ),
    F = (t, a) => new Intl.DateTimeFormat("ru-RU", a).format(t),
    A = (t) => {
      if ((t = Math.round(t)) < 60) return t + " мин";
      const a = Math.floor(t / 60),
        e = t % 60;
      return e ? `${a} ч ${e} мин` : `${a} ч`;
    },
    S = (t) => ((t = Math.round(t)), `${Math.floor(t / 60)}:${x(t % 60)}`),
    L = (t) => {
      t = Math.max(0, Math.floor(t));
      const a = Math.floor(t / 3600),
        e = Math.floor((t % 3600) / 60),
        s = t % 60;
      return a ? `${a}:${x(e)}:${x(s)}` : `${x(e)}:${x(s)}`;
    },
    I = (t) => String(Math.round(10 * t) / 10).replace(".", ","),
    T = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    N = (t) => (null == t ? null : JSON.parse(JSON.stringify(t))),
    B = (t, a, e) => {
      const s = parseInt(t, 10);
      return isNaN(s) ? a : Math.max(a, Math.min(e, s));
    },
    q = (t) =>
      String(t || "")
        .trim()
        .toLowerCase();
  function C(t, a, e, s) {
    const n = Math.abs(t) % 100,
      o = n % 10;
    return n > 10 && n < 20 ? s : o > 1 && o < 5 ? e : 1 === o ? a : s;
  }
  const P = (t) => Math.round((M(t) - M(j())) / 864e5);
  function G(t) {
    return 0 === t
      ? "сегодня"
      : 1 === t
        ? "завтра"
        : t < 0
          ? `${-t} ${C(-t, "день", "дня", "дней")} назад`
          : `через ${t} ${C(t, "день", "дня", "дней")}`;
  }
  function R(t) {
    try {
      return localStorage.getItem(t);
    } catch (t) {
      return null;
    }
  }
  function V(t, a) {
    try {
      null == a ? localStorage.removeItem(t) : localStorage.setItem(t, a);
    } catch (t) {}
  }
  const z = () =>
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      ("MacIntel" === navigator.platform && navigator.maxTouchPoints > 1),
    H = () => {
      try {
        return window.matchMedia("(display-mode: standalone)").matches || !0 === navigator.standalone;
      } catch (t) {
        return !1;
      }
    },
    W = window.matchMedia ? window.matchMedia("(max-width: 699px)") : null,
    _ = () => !(!W || !W.matches),
    U = { profile: null };
  h.forEach((t) => {
    U[t] = {};
  });
  let J = "loading",
    Y = null;
  const K = { profile: !1 };
  h.forEach((t) => {
    K[t] = !1;
  });
  const X = () => (6 === E(new Date()) ? 1 : 0),
    Q = location.hash.slice(1);
  let Z = m.includes(Q) ? Q : "today";
  const tt = {
    weekOffset: 0,
    diaryOffset: X(),
    expandedDays: {},
    goalsView: "events",
    notesView: "books" === Q ? "books" : "notes",
    noteId: null,
    noteSearch: "",
    confirm: null,
    settingsOpen: !1,
    settingsDraft: null,
    importPending: null,
    ttOpen: !1,
    ttDraft: null,
    timerMode: "sw",
    pomoMin: 25,
    timerCat: "phys",
    offerBreak: !1,
    bookForm: !1,
    goalForm: null,
    goalEdit: null,
    probResult: "solved",
    probFilter: "all",
    gradeScope: "quarter",
    showPastEvents: !1,
    overdueOpen: !1,
    authError: "",
    authBusy: !1,
    hwView: "sched" === Q ? "sched" : "diary",
    schedDay: E(new Date()),
    schedOpen: !1,
    schedDraft: null,
    schedWeek: 0,
    projOpen: !1,
    projDraft: null,
    catsOpen: !1,
    catsDraft: null,
    focus: !1,
    moveFor: null,
    early: null,
    review: null,
    wordsDeck: "de",
    bulkOpen: !1,
    debtPick: !1,
    reportOpen: !1,
    pushBusy: !1,
  };
  let at = null,
    et = j(),
    st = null,
    nt = null,
    ot = "",
    it = null,
    lt = [],
    rt = !1,
    ct = null;
  function dt(t) {
    const a = (t) => (Array.isArray(t) ? t.map((t) => ("string" == typeof t ? t : "")) : []);
    return Array.isArray(t)
      ? [0, 1, 2, 3, 4, 5, 6].map((e) => a(t[e]))
      : t && "object" == typeof t
        ? [0, 1, 2, 3, 4, 5, 6].map((e) => a(t["d" + e]))
        : [[], [], [], [], [], [], []];
  }
  function ut(t) {
    return t && "object" == typeof t
      ? (t.settings &&
          "object" == typeof t.settings &&
          (t.settings.timetable = (function (t) {
            const a = {};
            return (
              dt(t).forEach((t, e) => {
                a["d" + e] = t;
              }),
              a
            );
          })(t.settings.timetable)),
        t)
      : t;
  }
  let pt = { src: void 0, val: r };
  const SESSION_DAY = j(D(new Date(), 1));
  function normCats(list) {
    const out = [];
    (Array.isArray(list) && list.length ? list : DEFAULT_CATS).forEach((c) => {
      if (!c || !c.id || out.some((o) => o.id === c.id)) return;
      const name = String(c.name || "Без названия");
      out.push({
        id: String(c.id),
        name,
        short: String(c.short || (name.length > 11 ? name.split(" ")[0] : name)),
        color: /^#[0-9a-f]{6}$/i.test(c.color || "") ? c.color : "#8a8fa3",
        goal: Math.max(0, Math.min(80, parseFloat(c.goal) || 0)),
        archived: !!c.archived,
      });
    });
    return out;
  }
  // Дела расписания: и в шаблоне дня недели, и в плане на одну дату (days/<дата>.plan).
  function normBlocks(src) {
    return (Array.isArray(src) ? src : [])
      .filter((b) => b && /^\d{1,2}:\d{2}$/.test(b.start || ""))
      .map((b) => ({
        id: String(b.id || T()),
        start: b.start,
        dur: Math.max(5, Math.min(600, parseInt(b.dur, 10) || 30)),
        title: String(b.title || "Дело"),
        cat: b.cat || null,
        mode: "res" === b.mode ? "res" : "time",
        fixed: !!b.fixed,
      }))
      .sort((x, y) => hm(x.start) - hm(y.start));
  }
  function normSched(sc) {
    const o = {};
    for (let d = 0; d < 7; d++)
      o["d" + d] = normBlocks(sc && "object" == typeof sc && Array.isArray(sc["d" + d]) ? sc["d" + d] : DEFAULT_SCHED["d" + d]);
    return o;
  }
  // Проекты: разовые дела со сроком и шагами (ТЮФ, доклад, подготовка к олимпиаде). Это не привычки.
  function normProjects(list) {
    return (Array.isArray(list) ? list : [])
      .filter((p0) => p0 && p0.id)
      .map((p0) => ({
        id: String(p0.id),
        title: String(p0.title || "Проект"),
        cat: p0.cat || null,
        due: /^\d{4}-\d{2}-\d{2}$/.test(p0.due || "") ? p0.due : "",
        steps: (Array.isArray(p0.steps) ? p0.steps : [])
          .filter((x0) => x0 && String(x0.t || "").trim())
          .map((x0) => ({ id: String(x0.id || T()), t: String(x0.t).trim(), done: !!x0.done })),
        done: !!p0.done,
        created: p0.created || 0,
        doneAt: p0.doneAt || 0,
      }));
  }
  function hm(s) {
    const [h, mm] = String(s || "0:0").split(":").map(Number);
    return (h || 0) * 60 + (mm || 0);
  }
  const mh = (n) => `${x(Math.floor((((n % 1440) + 1440) % 1440) / 60))}:${x(((n % 60) + 60) % 60)}`;
  function bt() {
    const pr = U.profile;
    if (pt.src === pr) return pt.val;
    const a = pr && pr.settings;
    let e = Object.assign({}, r);
    a &&
      Array.isArray(a.habits) &&
      Array.isArray(a.gameLimit) &&
      (e = Object.assign({}, r, a, {
        timetable: dt(a.timetable),
        weekGoals: a.weekGoals && "object" == typeof a.weekGoals ? a.weekGoals : {},
      }));
    e.cats = normCats(e.cats);
    e.sched = normSched(e.sched);
    e.minimum = (Array.isArray(e.minimum) && e.minimum.length ? e.minimum : DEFAULT_MIN).map((m, i) => ({
      id: String(m.id || "m" + i),
      name: String(m.name || "Дело"),
    }));
    const tm = e.times && "object" == typeof e.times ? e.times : {};
    e.times = {
      wake: [0, 1, 2, 3, 4, 5, 6].map((d) => (Array.isArray(tm.wake) && tm.wake[d]) || DEFAULT_TIMES.wake[d]),
      sleep: tm.sleep || DEFAULT_TIMES.sleep,
    };
    e.reward = Object.assign({}, r.reward, e.reward || {});
    e.projects = normProjects(e.projects);
    e.planStart = e.planStart || SESSION_DAY;
    // темы: t — активные, ALLCATS — все (меняем массивы на месте, на них ссылается весь код)
    t.length = 0;
    e.cats.filter((c) => !c.archived).forEach((c) => t.push(c));
    ALLCATS.length = 0;
    e.cats.forEach((c) => ALLCATS.push(c));
    DEFAULT_CATS.forEach((c) => {
      ALLCATS.some((o) => o.id === c.id) || ALLCATS.push(Object.assign({}, c, { archived: !0 }));
    });
    return ((pt = { src: pr, val: e }), e);
  }
  function migrateSettings(o) {
    o = N(o) || {};
    const n = Object.assign({}, N(r), o);
    if (1 !== o.planV) {
      const ids = new Set(PLAN_HABITS.map((h) => h.id)),
        old = Array.isArray(o.habits) ? o.habits : [];
      n.habits = N(PLAN_HABITS).concat(old.filter((h) => h && h.id && !ids.has(h.id)));
      n.cats = Array.isArray(o.cats) && o.cats.length ? o.cats : N(DEFAULT_CATS);
      n.weekGoals = {};
    }
    ["sched", "minimum", "times", "reward"].forEach((k) => {
      (o[k] && "object" == typeof o[k]) || (n[k] = N(r[k]));
    });
    n.planV = 1;
    n.planStart = o.planStart || j(D(new Date(), 1));
    return n;
  }
  // v2 (25.11.2026): ТЮФ — не привычка, а проекты со сроком. Привычку «ТЮФ» и цель 2,5 ч в неделю убираем,
  // еженедельный час ТЮФ в среду становится окном долгов и проектов, встреча команды закреплена по времени.
  function migrateV2(n) {
    n.habits = (Array.isArray(n.habits) ? n.habits : N(PLAN_HABITS)).filter((h0) => h0 && "tyf" !== h0.id);
    n.cats = (Array.isArray(n.cats) && n.cats.length ? n.cats : N(DEFAULT_CATS)).map((c0) =>
      c0 && "tyf" === c0.id ? Object.assign({}, c0, { goal: 0 }) : c0,
    );
    const sc = n.sched && "object" == typeof n.sched ? n.sched : N(DEFAULT_SCHED);
    Object.keys(sc).forEach((k0) => {
      Array.isArray(sc[k0]) &&
        (sc[k0] = sc[k0].map((b0) =>
          !b0 || "tyf" !== b0.cat
            ? b0
            : /встреч/i.test(b0.title || "")
              ? Object.assign({}, b0, { fixed: !0 })
              : Object.assign({}, b0, { title: "Окно долгов и проектов", cat: "debt", mode: "time" }),
        ));
    });
    n.sched = sc;
    n.projects = normProjects(n.projects);
    const sp = SPRINT_2611.project;
    j() <= sp.due &&
      !n.projects.some((p0) => p0.id === sp.id) &&
      n.projects.push({
        id: sp.id,
        title: sp.title,
        cat: "tyf",
        due: sp.due,
        steps: sp.steps.map((t0, i0) => ({ id: sp.id + "-" + i0, t: t0, done: !1 })),
        done: !1,
        created: Date.now(),
        doneAt: 0,
      });
    n.planV = 2;
    return n;
  }
  // Разовый рывок по ТЮФ к пятнице 27.11.2026: проект и планы трёх дней (ставятся один раз, при обновлении до v2).
  // Шаблоны дней не меняются: это планы «только на этот день».
  const SPRINT_2611 = {
    project: {
      id: "tyf-2611",
      title: "ТЮФ: «Очки-обскура» и «Тише едешь»",
      due: "2026-11-27",
      steps: [
        "Послушать презентации команды и записать замечания",
        "Прочитать статьи по «Тише едешь»",
        "Прочитать статьи по «Очкам-обскуре»",
        "Отредактировать презентацию",
      ],
    },
    // 25.11 подготовка к контрольной 26.11 уже внутри домашки — отдельный блок не ставим
    noPrep: { "2026-11-25": "2026-11-26" },
    days: {
      "2026-11-25": () =>
        normBlocks([
          SB("wea", "17:00", 60, "Обед и отдых"),
          SB("web", "18:00", 60, "Домашка + история к контрольной", "hw", "res"),
          SB("tyf25", "19:00", 120, "ТЮФ · презентации команды", "tyf", "time", 1),
          SB("wed", "21:00", 15, "Перерыв"),
          SB("wec", "21:15", 45, "Кружок · 1 урок", "phys", "res"),
          SB("wef", "22:00", 15, "Немецкий · короткая порция", "ger", "res"),
          SB("weh", "22:15", 30, "Чтение", "read"),
          SB("wei", "22:45", 15, "Подготовка ко сну"),
        ]),
      "2026-11-26": (tpl) => swapIn(tpl, [["phys", "tyf26a", "ТЮФ · статьи по темам"]]),
      "2026-11-27": (tpl) =>
        swapIn(tpl, [
          ["phys", "tyf27a", "ТЮФ · статьи по темам"],
          ["philo", "tyf27b", "ТЮФ · правка презентации"],
        ]),
    },
  };
  // Копия шаблона дня, где дела темы cat заменены на дела проекта (по времени, тема ТЮФ)
  function swapIn(tpl, swaps) {
    const out = N(tpl || []);
    swaps.forEach(([cat, id, title]) => {
      const b0 = out.find((x0) => x0 && x0.cat === cat);
      if (b0) Object.assign(b0, { id, title, cat: "tyf", mode: "time", fixed: !1 });
      else {
        const hw0 = out.find((x0) => x0 && "hw" === x0.cat);
        out.push(SB(id, mh(hw0 ? hm(hw0.start) + hw0.dur : 1140), 60, title, "tyf"));
      }
    });
    return normBlocks(out);
  }
  function applySprint2611() {
    const today = j(),
      st2 = bt();
    Object.keys(SPRINT_2611.days).forEach((key) => {
      if (key < today || (U.days[key] && Array.isArray(U.days[key].plan))) return;
      const plan = SPRINT_2611.days[key](st2.sched["d" + E(M(key))]),
        prepFor = SPRINT_2611.noPrep[key];
      Tt(
        key,
        (d) => {
          d.plan = plan;
          prepFor &&
            Object.entries(U.events).forEach(([id, ev]) => {
              ev && ev.date === prepFor && ("test" === ev.type || "olymp" === ev.type) && ((d.noPrep = d.noPrep || {}), (d.noPrep[id] = !0));
            });
        },
        !1,
      );
    });
  }
  let migratedOnce = !1;
  function maybeMigrate() {
    if (migratedOnce || !vt() || !U.profile) return;
    const st0 = U.profile.settings,
      v0 = st0 && st0.planStart ? st0.planV || 0 : 0;
    if (v0 >= 2) return;
    migratedOnce = !0;
    Lt({ settings: migrateV2(v0 >= 1 ? N(st0) : migrateSettings(st0 || {})) }, !1);
    applySprint2611();
    setTimeout(
      () =>
        Ea(
          v0 >= 1
            ? "Блокнот обновлён: ТЮФ теперь проект со сроком, а дни можно менять по отдельности"
            : "Блокнот обновлён: расписание, привычки и темы по учебному плану",
        ),
      400,
    );
  }
  const mt = () => (U.profile && U.profile.onboard) || {};
  function ht() {
    const t = U.profile && U.profile.timer;
    return t && t.startedAt ? t : null;
  }
  function gt() {
    const wd = E(new Date());
    let lim = bt().gameLimit[wd] || 0;
    if (5 === wd) {
      const ri = rewardInfo(0);
      ri && ri.earned && (lim += ri.bonus);
    }
    return lim;
  }
  function ft(t) {
    return { date: t, habits: {}, gamesMin: 0, sessions: [], note: "" };
  }
  function vt() {
    return "local" === J || ("cloud" === J && K.profile && h.every((t) => K[t]));
  }
  function $t() {
    document.documentElement.setAttribute("data-theme", "dark");
    const s = document.querySelector('meta[name="theme-color"]');
    s && s.setAttribute("content", "#111113");
  }
  const yt = {},
    wt = {};
  let kt = null;
  function xt(t, a) {
    return "profile" === t ? U.profile : (U[t] || {})[a];
  }
  function jt(t, a, e) {
    const s = t + "/" + a;
    if ((wt[s] && (clearTimeout(wt[s]), delete wt[s]), delete yt[s], "cloud" !== J))
      (clearTimeout(kt),
        (kt = setTimeout(() => {
          try {
            localStorage.setItem(f, JSON.stringify(U));
          } catch (t) {
            Ea("Не удалось сохранить на устройстве: память браузера заполнена.");
          }
        }, 250)));
    else
      try {
        const s = (function (t, a) {
          const { fsM: e, db: s } = st;
          return "profile" === t ? e.doc(s, "users", nt) : e.doc(s, "users", nt, t, a);
        })(t, a);
        (null === e ? st.fsM.deleteDoc(s) : st.fsM.setDoc(s, N(e))).catch(Ot);
      } catch (t) {
        Ot(t);
      }
  }
  function Mt(t, a, e = 700) {
    const s = t + "/" + a,
      n = xt(t, a);
    (n && (yt[s] = n),
      clearTimeout(wt[s]),
      (wt[s] = setTimeout(() => {
        delete wt[s];
        const e = xt(t, a);
        var n;
        if (e)
          return "hw" !== t ||
            "number" != typeof e.slot ||
            ((n = e).text || "").trim() ||
            (n.grade || "").trim() ||
            n.done
            ? void jt(t, a, e)
            : (delete U.hw[a], jt("hw", a, null), void va());
      }, e)));
  }
  function Dt() {
    Object.keys(wt).forEach((t) => {
      (clearTimeout(wt[t]), delete wt[t]);
      const a = t.indexOf("/"),
        e = t.slice(0, a),
        s = t.slice(a + 1),
        n = xt(e, s);
      n && jt(e, s, n);
    });
  }
  let Et = 0;
  function Ot(t) {
    if ((console.error(t), Date.now() - Et < 4e3)) return;
    Et = Date.now();
    const a = t && t.code;
    Ea(
      "permission-denied" === a
        ? "Нет доступа к базе. Проверь правила Firestore."
        : "resource-exhausted" === a
          ? "Достигнут дневной лимит Firebase. Завтра заработает снова."
          : "invalid-argument" === a
            ? "Не сохранилось: ошибка в данных. " + ((t && t.message) || "")
            : "Не сохранилось. Проверь интернет и повтори.",
    );
  }
  function Ft() {
    try {
      const t = localStorage.getItem(f);
      return t ? JSON.parse(t) : null;
    } catch (t) {
      return null;
    }
  }
  function At(t, a, e, s = !0) {
    ((U[t][a] = e), jt(t, a, e), s && $a());
  }
  function St(t, a, e = !0) {
    (delete U[t][a], jt(t, a, null), e && $a());
  }
  function Lt(t, a = !0) {
    const e = N(U.profile) || { settings: N(r), timer: null };
    ((e.settings && Array.isArray(e.settings.habits)) || (e.settings = N(r)),
      (e.settings.weekGoals && "object" == typeof e.settings.weekGoals) || (e.settings.weekGoals = N(r.weekGoals)),
      Object.assign(e, t),
      ut(e),
      (U.profile = e),
      jt("profile", "profile", e),
      a && $a());
  }
  const It = (t) => Lt({ onboard: Object.assign({}, mt(), { [t]: !0 }) });
  function Tt(t, a, e = !0) {
    const s = N(U.days[t]) || ft(t);
    ((s.date = t),
      (s.habits = s.habits || {}),
      (s.sessions = s.sessions || []),
      (s.gamesMin = s.gamesMin || 0),
      a(s),
      At("days", t, s, e));
  }
  function Nt(t, a, e, xx) {
    ht()
      ? Ea("Таймер уже идёт. Сначала останови его.")
      : ((tt.offerBreak = !1),
        (tt.early = null),
        (tt.moveFor = null),
        (tt.debtPick = !1),
        Lt({
          timer: Object.assign(
            { cat: t, mode: a, targetMin: "pomo" === a ? e : null, startedAt: Date.now(), pausedAt: null, pausedMs: 0 },
            xx || {},
          ),
        }),
        "games" === t && 0 === gt() && Ea("По плану сегодня без игр. Время всё равно запишется."));
  }
  function Bt(t, quiet) {
    const a = ht();
    if (!a) return;
    const e = Math.round(tel(a));
    if ((Lt({ timer: null }, !1), (tt.focus = !1), "break" === a.cat)) return (t && Ea("Перерыв закончен. За работу!"), void $a());
    if (t)
      if (e < 60) quiet || Ea("Меньше минуты, не сохранил.");
      else {
        const key = j(new Date(a.startedAt));
        Tt(
          key,
          (d) => {
            if ("games" === a.cat) d.gamesMin = (d.gamesMin || 0) + Math.round(e / 60);
            else {
              const se = { id: T(), cat: a.cat, start: a.startedAt, sec: e };
              a.blk && (se.blk = a.blk);
              d.sessions.push(se);
            }
            if (a.todo && a.todoDate === key) {
              const x0 = (d.todo || []).find((x) => x.id === a.todo);
              x0 && e / 60 >= 0.8 * (x0.min || 0) && (x0.done = !0);
            }
          },
          !1,
        );
        if (a.todo && a.todoDate !== key)
          Tt(
            a.todoDate,
            (d) => {
              const x0 = (d.todo || []).find((x) => x.id === a.todo);
              x0 && e / 60 >= 0.8 * (x0.min || 0) && (x0.done = !0);
            },
            !1,
          );
        if (a.blk && a.blkDate && !quiet) {
          const it = planItems(a.blkDate).list.find((x) => x.id === a.blk);
          it &&
            "time" === it.mode &&
            "done" !== it.status &&
            blkLogged(a.blkDate, a.blk) >= 0.9 * it.base &&
            Tt(
              a.blkDate,
              (d) => {
                (d.blocks = d.blocks || {}), (d.blocks[a.blk] = Object.assign({}, d.blocks[a.blk], { st: "done", at: Date.now() })), bumpHabitIn(d, it.cat, a.blkDate);
              },
              !1,
            );
        }
        quiet || Ea("games" === a.cat ? `Игры: +${A(e / 60)}` : `Сохранено: ${s(a.cat).short}, ${A(e / 60)}`);
        quiet || "pomo" !== a.mode || "games" === a.cat || a.blk || (tt.offerBreak = !0);
      }
    $a();
  }
  function qt(t) {
    return bt().timetable[E(t)] || [];
  }
  function Ct(t) {
    const a = qt(M(t)),
      e = {},
      s = [];
    Object.entries(U.hw).forEach(([n, o]) => {
      o &&
        o.date === t &&
        ("number" == typeof o.slot && o.slot < a.length && n === t + "_" + o.slot ? (e[o.slot] = o) : s.push([n, o]));
    });
    const n = a.map((a, s) => {
      const n = e[s];
      return { id: t + "_" + s, slot: s, subject: (n && n.subject) || a, doc: n || null };
    });
    return (
      s
        .sort((t, a) => (t[1].created || 0) - (a[1].created || 0))
        .forEach(([t, a]) => n.push({ id: t, slot: null, subject: a.subject || "", doc: a, extra: !0 })),
      n
    );
  }
  const Pt = (t) => Object.values(U.events).filter((a) => a && a.date === t);
  function Gt(t, a) {
    const e = t.dataset.id;
    let s = N(U.hw[e]);
    if (!s) {
      const a = t.dataset.slot;
      s = {
        date: t.dataset.date,
        slot: "" === a ? null : Number(a),
        subject: t.dataset.subj || "",
        text: "",
        done: !1,
        grade: "",
        created: Date.now(),
      };
    }
    if (((s[a] = t.value), (s.updated = Date.now()), (U.hw[e] = s), (ha = !0), "text" === a)) {
      ga(t);
      const a = t.closest("tr") && t.closest("tr").querySelector("button.check");
      a && (a.disabled = !t.value.trim());
    }
    Mt("hw", e);
  }
  function Rt(t, a, e, s) {
    (At("books", T(), { title: t, author: a, pages: e, page: 0, status: s, created: Date.now() }),
      Ea("plan" === s ? "Добавил в планы" : "Книга добавлена"));
  }
  function Vt(t, a) {
    const e = N(U.books[t]);
    e && (a(e), At("books", t, e));
  }
  function zt(t, a) {
    const e = N(U.problems[t]);
    e && (a(e), At("problems", t, e));
  }
  function Ht() {
    const t = { app: "bloknot", version: "2.0", exported: new Date().toISOString(), profile: U.profile };
    return (
      h.forEach((a) => {
        t[a] = U[a];
      }),
      t
    );
  }
  const Wt = (t) =>
      "string" == typeof t && t.length > 0 && t.length < 200 && !t.includes("/") && "." !== t && ".." !== t,
    _t = new Set(["days", "hw", "events", "problems"]),
    Ut = (t, a) =>
      a &&
      "object" == typeof a &&
      !Array.isArray(a) &&
      (!_t.has(t) || /^\d{4}-\d{2}-\d{2}$/.test(String(a.date || "")));
  function Jt(t) {
    return ((t && t.sessions) || []).reduce((t, a) => t + (a.sec || 0) / 60, 0);
  }
  function Yt(t) {
    const a = {};
    return (
      ((t && t.sessions) || []).forEach((t) => {
        a[t.cat] = (a[t.cat] || 0) + (t.sec || 0) / 60;
      }),
      a
    );
  }
  function Kt(t, a) {
    if (t && t.bad) {
      const mn = bt().minimum;
      return mn.length ? mn.filter((m) => t.min && t.min[m.id]).length / mn.length : null;
    }
    const k0 = j(a),
      s = bt().habits.filter((h0) => hT(h0, k0) > 0),
      n = s.reduce((acc, h0) => acc + hT(h0, k0), 0);
    return n ? s.reduce((acc, h0) => acc + Math.min((t && t.habits && t.habits[h0.id]) || 0, hT(h0, k0)), 0) / n : null;
  }
  function Xt() {
    let t = 0,
      a = new Date();
    1 !== Kt(U.days[j(a)], a) && (a = D(a, -1));
    for (let e = 0; e < 400; e++) {
      const e = Kt(U.days[j(a)], a);
      if (null !== e) {
        if (e < 1) break;
        (t++, (a = D(a, -1)));
      } else a = D(a, -1);
    }
    return t;
  }
  function Qt(t) {
    const a = new Date(),
      e = D(a, -E(a) + 7 * t);
    return [0, 1, 2, 3, 4, 5, 6].map((t) => D(e, t));
  }
  function Zt(t) {
    const a = t[0],
      e = t[t.length - 1];
    return a.getMonth() === e.getMonth()
      ? `${a.getDate()}–${F(e, { day: "numeric", month: "long" })}`
      : `${F(a, { day: "numeric", month: "short" })} – ${F(e, { day: "numeric", month: "short" })}`;
  }
  const ta = (t) => (0 === t ? "эта неделя" : 1 === t ? "следующая" : -1 === t ? "прошлая" : "");
  function aa() {
    return H() || "1" === R(y) ? "installed" : ct ? "prompt" : z() ? "ios" : "manual";
  }
  const ea = {
    installed: "Блокнот уже установлен на этом устройстве.",
    prompt: "Можно установить блокнот как приложение: он будет открываться с иконки, без адресной строки.",
    ios: "На iPhone: открой сайт в Safari, нажми «Поделиться» и выбери «На экран „Домой“».",
    manual: "Открой меню браузера и выбери «Установить приложение» или «Добавить на главный экран».",
  };
  function sa(t) {
    const a = (t && t.code) || "",
      e = (t && t.message) || "";
    return "permission-denied" === a
      ? "Нет доступа к базе. Проверь, что правила из файла firestore.rules вставлены в Firestore и опубликованы (шаг 4 инструкции)."
      : "not-found" === a || /does not exist|not exist/i.test(e)
        ? "База Firestore ещё не создана. Создай её в Firebase (шаг 4 инструкции)."
        : "failed-precondition" === a
          ? "Firestore не готов: проверь, что база создана. Подробности: " + e
          : "unavailable" === a
            ? "Нет связи с Firebase. Проверь интернет."
            : "Ошибка Firebase: " + (e || a || "неизвестная");
  }
  function na(t) {
    try {
      return t();
    } catch (t) {
      return (
        console.error(t),
        `<section class="card"><h2>Что-то пошло не так</h2><p class="hint">${O(t && t.message)}</p>\n      <div class="btn-row"><button class="btn primary" data-a="reload">Обновить</button><button class="btn" data-a="export-file">Скачать резервную копию</button></div></section>`
      );
    }
  }
  function oa(t, a, it) {
    const e = s(t.cat),
      n =
        "break" === t.cat
          ? "отдохни, не открывай игры"
          : "pomo" === t.mode
            ? `помидор ${t.targetMin} мин`
            : "games" === t.cat
              ? `лимит на сегодня ${A(gt())}`
              : "секундомер",
      o = "timer-cancel" === tt.confirm,
      key = t.blkDate || j(),
      pz = t.pausedAt ? '<span class="pill warn">пауза</span>' : "",
      title = it ? `<div class="now-title" style="margin:2px 0 4px">${O(it.title)}</div><div class="now-sub mono">${mh(it.s)} – ${mh(it.s + it.dur)}</div>` : "",
      stopBtns =
        it && "res" === it.mode
          ? `<button class="btn primary" data-a="blk-done" data-key="${key}" data-id="${O(it.id)}">Готово</button><button class="btn" data-a="timer-stop">Стоп, не закончил</button>`
          : '<button class="btn primary" data-a="timer-stop">Стоп и сохранить</button>';
    return `<section class="card timer-run ${a ? "big" : ""}" style="--c:${e.color}">\n    <div class="card-h"><span class="cat-tag" style="--c:${e.color}"><i></i>${O(e.name)}</span><span class="muted small">${pz} ${O(n)}</span></div>${title}\n    <div class="clock mono js-elapsed">00:00</div>\n    <div class="tprog"><div class="js-tprog"></div></div>\n    <div class="btn-row">${"break" === t.cat ? '<button class="btn primary" data-a="timer-stop">Закончить перерыв</button>' : `${stopBtns}<button class="btn" data-a="timer-pause">${t.pausedAt ? "Продолжить" : "Пауза"}</button>${"games" === t.cat ? "" : `<button class="btn" data-a="focus-open">${w.focus}Фокус</button>`}<button class="btn ghost ${o ? "danger" : ""}" data-a="timer-cancel">${o ? "Точно не сохранять?" : "Отменить"}</button>`}</div>\n  </section>`;
  }
  function ia(t) {
    const a = (function () {
      const t = [];
      return (
        bt().timetable.forEach((a) =>
          a.forEach((a) => {
            const e = (a || "").trim();
            e && !t.some((t) => q(t) === q(e)) && t.push(e);
          }),
        ),
        t
      );
    })();
    return `<form class="hw-quick" data-form="hwq" data-p="${t}">\n    <select id="${t}-subj" data-keep aria-label="Предмет">${(a.length ? a : n).map((t) => `<option value="${O(t)}">${O(t)}</option>`).join("")}<option value="">Другое (на завтра)</option></select>\n    <input id="${t}-text" data-keep placeholder="Что задали" aria-label="Что задали" autocomplete="off">\n    <button class="btn primary" type="submit">Записать</button>\n  </form>`;
  }
  function la(t, a) {
    return `<li class="hw-item ${!a.done && a.date < j() ? "overdue" : ""}">\n    <button class="check ${a.done ? "on" : ""}" data-a="hw-toggle" data-id="${O(t)}" aria-pressed="${!!a.done}" aria-label="Отметить сделанным">${w.check}</button>\n    <div class="hw-body"><div class="hw-meta"><span class="subj">${O(a.subject || "Без предмета")}</span><span class="due">${O(
      (function (t) {
        const a = j(),
          e = j(D(new Date(), 1));
        if (t === a) return "на сегодня";
        if (t === e) return "на завтра";
        const s = F(M(t), { weekday: "short", day: "numeric", month: "short" });
        return t < a ? "просрочено · " + s : "к " + s;
      })(a.date),
    )}${"number" == typeof a.slot ? `, ${a.slot + 1}-й урок` : ""}</span></div><div class="hw-text">${O(a.text)}</div></div></li>`;
  }
  function ra(a, e) {
    const s = {};
    t.forEach((c) => {
      s[c.id] = c.goal || 0;
    });
    const n = t.filter((t) => (s[t.id] || 0) > 0);
    if (!n.length)
      return `<section class="card"><div class="card-h"><h2>${e}</h2><button class="link" data-a="cats-open">Задать</button></div><p class="hint top0">Поставь цель в часах на неделю, например физика 10 ч, и здесь будет видно, сколько осталось.</p></section>`;
    const o = {};
    return (
      a.forEach((t) => {
        const a = Yt(U.days[j(t)]);
        Object.keys(a).forEach((t) => {
          o[t] = (o[t] || 0) + a[t];
        });
      }),
      `<section class="card"><div class="card-h"><h2>${e}</h2><button class="link" data-a="cats-open">Изменить</button></div><ul class="wgoals">${n
        .map((t) => {
          const a = 60 * s[t.id],
            e = o[t.id] || 0,
            n = Math.min(100, (e / a) * 100),
            i = e >= a;
          return `<li><div class="wg-top"><span class="cat-tag" style="--c:${t.color}"><i></i>${O(t.name)}</span><span class="wg-val mono ${i ? "good-t" : ""}">${i ? "✓ " : ""}${A(e)} из ${I(s[t.id])} ч</span></div><div class="wg-bar"><div style="width:${n.toFixed(1)}%;background:${i ? "var(--good)" : t.color}"></div></div></li>`;
        })
        .join("")}</ul></section>`
    );
  }
  function ca() {
    const t = tt.noteSearch.trim().toLowerCase(),
      a = Object.entries(U.notes)
        .filter(
          ([, a]) => a && (!t || (a.title || "").toLowerCase().includes(t) || (a.body || "").toLowerCase().includes(t)),
        )
        .sort((t, a) => (a[1].pinned ? 1 : 0) - (t[1].pinned ? 1 : 0) || (a[1].updated || 0) - (t[1].updated || 0));
    return a.length
      ? `<div class="notes">${a
          .map(([t, a]) => {
            const e = (a.body || "").split("\n").find((t) => t.trim()) || "";
            return `<button class="card note-card ${a.pinned ? "pinned" : ""}" data-a="note-open" data-id="${O(t)}"><span class="nc-title">${a.pinned ? w.pin : ""}${O(a.title || "Без названия")}</span><span class="nc-prev muted">${O(e.slice(0, 160))}</span><span class="nc-date mono muted">${O(F(new Date(a.updated || a.created || 0), { day: "numeric", month: "short" }))}</span></button>`;
          })
          .join("")}</div>`
      : `<p class="empty">${t ? "Ничего не нашлось." : "Заметок пока нет. Здесь можно записывать мысли о прочитанном, идеи для ТЮФ и планы."}</p>`;
  }
  function pushRow() {
    const ps = pushState(),
      ready = (() => {
        try {
          return "undefined" != typeof PUSH_SERVER_READY && !!PUSH_SERVER_READY;
        } catch (e0) {
          return !1;
        }
      })(),
      msg = {
        "ios-install": "На iPhone напоминания работают, только если блокнот добавлен на экран «Домой»: Safari → «Поделиться» → «На экран „Домой“». Потом открой блокнот с иконки и вернись сюда.",
        unsupported: "Этот браузер не умеет получать напоминания.",
        local: "Напоминания работают только с синхронизацией через аккаунт.",
        nokey: "Сервер напоминаний ещё не настроен.",
        denied: "Уведомления запрещены. Разреши их: Настройки телефона → Уведомления → Блокнот.",
      }[ps];
    if (msg) return `<p class="hint top0">${O(msg)}</p>`;
    return "on" === ps
      ? `<div class="set-row"><span>${w.bell} Включены на этом устройстве<br><span class="muted small">${
          ready ? "Придут: начало дел по расписанию, в 22:30 — если минимум не сделан, в воскресенье — отчёт." : "Подписка сохранена. Напоминания начнут приходить, когда подключим сервер рассылки — это сделаем вместе."
        }</span></span><button class="btn small" data-a="push-off">Выключить</button></div>`
      : `<div class="set-row"><span>Напоминания о делах по расписанию, даже когда блокнот закрыт</span><button class="btn small primary" data-a="push-on" ${tt.pushBusy ? "disabled" : ""}>Включить</button></div>`;
  }
  function da() {
    const a = tt.settingsDraft,
      e = aa(),
      n = "1" === R($),
      o =
        "cloud" === J
          ? `<div class="set-row"><span>Ты вошёл как <b>${O(ot || "пользователь")}</b></span><button class="btn small" data-a="auth-signout">Выйти</button></div>`
          : '<p class="hint top0">Синхронизация не подключена: данные хранятся только на этом устройстве. Чтобы подключить, впиши настройки Firebase в файл config.js.</p>',
      i = tt.importPending,
      rw = a.reward || { on: !0, min: 30, pct: 80 };
    return `<div class="modal-back" data-a="settings-close-bg"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="set-h">
    <div class="modal-h"><h2 id="set-h" class="display">Настройки</h2><button class="icon-btn" data-a="settings-close" aria-label="Закрыть">×</button></div>
    <h3 class="first">Аккаунт</h3>${o}
    <h3>Приложение</h3>
    <div class="set-row"><span>${O(ea[e])}</span>${"prompt" === e ? '<button class="btn small primary" data-a="install">Установить</button>' : ""}</div>
    <div class="set-row"><span>Уведомления, пока блокнот открыт: начало дела, конец помидора, лимит игр</span><button class="btn small ${n ? "primary" : ""}" data-a="notify-toggle" aria-pressed="${n}">${n ? "Включено" : "Включить"}</button></div>
    <h3>Напоминания на телефон</h3>${pushRow()}
    <h3>Расписание и темы</h3>
    <div class="btn-row" style="margin-top:0"><button class="btn small" data-a="tt-open">Уроки</button><button class="btn small" data-a="go-sched">Расписание дня</button><button class="btn small" data-a="cats-open">Темы таймера и цели</button></div>
    <h3>Привычки</h3>
    <p class="hint top0">Цифра — сколько раз в этот день нужно сделать. 0 — в этот день не нужно.</p>
    <div class="scroll-x"><table class="set-table"><thead><tr><th>Название</th>${u.map((t) => `<th>${t}</th>`).join("")}<th></th></tr></thead><tbody>
    ${a.habits.map((t, e) => `<tr><td class="name"><input id="sh-n-${e}" data-input="set-h-name" data-i="${e}" value="${O(t.name)}" aria-label="Название привычки" autocomplete="off"></td>${t.t.map((a, s) => `<td><input id="sh-t-${e}-${s}" class="num mono" type="number" min="0" max="9" inputmode="numeric" data-input="set-h-t" data-i="${e}" data-d="${s}" value="${a}" aria-label="${O(t.name)}, ${u[s]}"></td>`).join("")}<td class="ord"><button class="x" data-a="set-h-up" data-i="${e}" aria-label="Выше" ${0 === e ? "disabled" : ""}>↑</button><button class="x" data-a="set-h-down" data-i="${e}" aria-label="Ниже" ${e === a.habits.length - 1 ? "disabled" : ""}>↓</button><button class="x" data-a="set-h-del" data-i="${e}" aria-label="Удалить привычку">×</button></td></tr>`).join("")}
    </tbody></table></div>
    <div><button class="btn small" data-a="set-h-add">+ Привычка</button></div>
    <h3>Минимум плохого дня</h3>
    <p class="hint top0">Что нужно сделать даже в самый тяжёлый день, чтобы серия не прервалась.</p>
    <div class="min-list">${a.minimum.map((m0, i0) => `<div class="min-row"><input id="sm-${i0}" data-input="set-min" data-i="${i0}" value="${O(m0.name)}" aria-label="Пункт минимума" autocomplete="off"><button class="x" data-a="set-min-del" data-i="${i0}" aria-label="Убрать">×</button></div>`).join("")}</div>
    <div><button class="btn small" data-a="set-min-add">+ Пункт</button></div>
    <h3>Лимит игр, минут в день</h3>
    <div class="scroll-x"><table class="set-table"><thead><tr>${u.map((t) => `<th>${t}</th>`).join("")}</tr></thead><tbody><tr>${a.gameLimit.map((t, a) => `<td><input id="sg-${a}" class="num wide-num mono" type="number" min="0" max="1440" step="15" inputmode="numeric" data-input="set-g" data-d="${a}" value="${t}" aria-label="Лимит игр, ${u[a]}"></td>`).join("")}</tr></tbody></table></div>
    <div class="set-row"><span>Награда за будни: если привычки выполнены хотя бы на <input id="rw-pct" class="num mono inl" type="number" min="50" max="100" step="5" data-input="rw-pct" value="${rw.pct}" aria-label="Процент">%, в субботу +<input id="rw-min" class="num mono inl" type="number" min="0" max="240" step="15" data-input="rw-min" value="${rw.min}" aria-label="Минут"> мин к играм</span><button class="btn small ${rw.on ? "primary" : ""}" data-a="rw-toggle" aria-pressed="${!!rw.on}">${rw.on ? "Включено" : "Выключено"}</button></div>
    <h3>Резервная копия</h3>
    <p class="hint top0">Сохраняет все данные в файл. Его можно восстановить на любом устройстве.</p>
    <div class="btn-row" style="margin-top:0"><button class="btn small" data-a="export-file">Скачать копию</button><label class="btn small file-btn">Восстановить из файла<input type="file" accept="application/json,.json" data-change="import-file" aria-label="Файл резервной копии"></label></div>
    ${i ? `<div class="notice">В файле записей: ${i.count}. Восстановить? Записи с теми же датами и номерами заменятся, остальные останутся как есть.<div class="btn-row"><button class="btn small primary" data-a="import-go">Восстановить</button><button class="btn small" data-a="import-cancel">Отмена</button></div></div>` : ""}
    <p class="hint">Блокнот, версия 3.0</p>
    <div class="modal-f"><button class="btn ghost" data-a="settings-close">Отмена</button><button class="btn primary" data-a="settings-save">Сохранить</button></div>
  </div></div>`;
  }
  function ua() {
    const t = tt.ttDraft;
    return `<div class="modal-back" data-a="tt-close-bg"><div class="modal wide-modal" role="dialog" aria-modal="true" aria-labelledby="tt-h">\n    <div class="modal-h"><h2 id="tt-h" class="display">Расписание уроков</h2><button class="icon-btn" data-a="tt-close" aria-label="Закрыть">×</button></div>\n    <p class="hint top0">Впиши уроки по порядку. Если между уроками окно, оставь строку пустой. Enter переводит на следующий урок.</p>\n    <div class="tt-grid">${t.map((a, e) => `<div class="tt-day"><h4>${p[e]}</h4>\n      ${a.map((t, a) => `<div class="tt-row"><span class="mono">${a + 1}</span><input id="tt-${e}-${a}" data-input="tt" data-d="${e}" data-i="${a}" value="${O(t)}" list="subjects" placeholder="окно" aria-label="${p[e]}, ${a + 1}-й урок" autocomplete="off"><button class="x" data-a="tt-del" data-d="${e}" data-i="${a}" aria-label="Убрать урок">×</button></div>`).join("")}\n      <div><button class="btn small" data-a="tt-add" data-d="${e}">+ урок</button>${e > 0 && !a.length && t[e - 1].length ? ` <button class="btn small ghost" data-a="tt-copy" data-d="${e}">как вчера</button>` : ""}</div>\n    </div>`).join("")}</div>\n    <div class="modal-f"><button class="btn ghost" data-a="tt-close">Отмена</button><button class="btn primary" data-a="tt-save">Сохранить</button></div>\n  </div></div>`;
  }
  // ===================== Расписание дня, долги, награда, слова, отчёт =====================
  const HABIT_OF = { hw: "hw", phys: "kruzhok", tyf: "tyf", philo: "philo", ger: "ger", eng: "eng", read: "read" };
  const nowMin = () => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  };
  // Сколько секунд идёт таймер (с учётом паузы)
  function tel(tm, now = Date.now()) {
    if (!tm || !tm.startedAt) return 0;
    const paused = (tm.pausedMs || 0) + (tm.pausedAt ? now - tm.pausedAt : 0);
    return Math.max(0, (now - tm.startedAt - paused) / 1e3);
  }
  const isCatId = (c) => !!c && "debt" !== c;
  // Привычка → тема таймера (обратно к HABIT_OF)
  const CAT_OF_HABIT = { hw: "hw", kruzhok: "phys", tyf: "tyf", philo: "philo", ger: "ger", eng: "eng", read: "read" };
  // Сколько раз нужна привычка в этот день. Если день изменён «только на этот день», привычка темы,
  // которой нет в плане дня, не требуется: её место занял план (например, рывок по проекту).
  function hT(h0, key) {
    const base = h0.t[E(M(key))] || 0,
      day = U.days[key],
      cat = CAT_OF_HABIT[h0.id];
    if (!base || !cat || !day || !Array.isArray(day.plan)) return base;
    return Math.min(base, day.plan.filter((b) => b && b.cat === cat).length);
  }
  // План дня: шаблон (или план «только на этот день») + подготовка к завтрашним контрольным + продления.
  // Отдых (без темы) — «буфер», он сжимается. Встреча (fixed) стоит на своём времени, остальное обходит её.
  function planItems(key) {
    const dt0 = M(key),
      wd = E(dt0),
      st = bt(),
      day = U.days[key] || {},
      bl = day.blocks || {},
      own = Array.isArray(day.plan),
      raw = (own ? normBlocks(day.plan) : st.sched["d" + wd] || []).map((b) =>
        Object.assign({}, b, { kind: "block", s0: hm(b.start), base: b.dur, ext: (bl[b.id] && bl[b.id].ext) || 0 }),
      );
    const tomorrow = j(D(dt0, 1));
    Object.entries(U.events)
      .filter(([id, ev]) => ev && ev.date === tomorrow && ("test" === ev.type || "olymp" === ev.type) && !(day.noPrep && day.noPrep[id]))
      .forEach(([id, ev]) => {
        let idx = raw.findIndex((b) => "hw" === b.cat),
          at;
        if (idx >= 0) ((at = raw[idx].s0 + raw[idx].base), idx++);
        else
          ((idx = raw.findIndex((b) => isCatId(b.cat))),
            idx < 0 && (idx = raw.length),
            (at = idx < raw.length ? raw[idx].s0 : hm(st.times.sleep) - 60));
        const dur = "olymp" === ev.type ? 60 : 45,
          pid = "prep_" + id;
        raw.splice(idx, 0, {
          id: pid,
          kind: "prep",
          s0: at,
          base: dur,
          dur,
          title: "Подготовка: " + ev.title,
          cat: "olymp" === ev.type ? (ALLCATS.some((c) => "phys" === c.id) ? "phys" : "other") : "hw",
          mode: "res",
          evId: id,
          ext: (bl[pid] && bl[pid].ext) || 0,
        });
      });
    const fixedL = raw.filter((b) => b.fixed).map((b) => ({ s: b.s0, e: b.s0 + b.base + b.ext }));
    let cur = 0;
    const list = [];
    raw.forEach((b) => {
      const st2 = (bl[b.id] && bl[b.id].st) || "";
      if (b.fixed) return void list.push(Object.assign({}, b, { s: b.s0, dur: b.base + b.ext, status: st2 }));
      let s0 = Math.max(b.s0, cur),
        dur = b.base + b.ext;
      if (!b.cat) {
        let end = b.s0 + b.base;
        fixedL.forEach((f) => {
          f.s <= s0 && s0 < f.e && (s0 = f.e);
        });
        fixedL.forEach((f) => {
          f.s > s0 && f.s < end && (end = f.s);
        });
        dur = Math.max(0, end - s0);
      } else
        for (let g = 0; g < 9; g++) {
          const f = fixedL.find((f0) => f0.s < s0 + dur && s0 < f0.e);
          if (!f) break;
          // успевает до встречи хотя бы 15 минут — укорачиваем, иначе переносим после встречи
          f.s > s0 && f.s - s0 >= 15 ? (dur = f.s - s0) : (s0 = f.e);
        }
      list.push(Object.assign({}, b, { s: s0, dur, status: st2 }));
      cur = s0 + dur;
    });
    list.sort((x0, y0) => x0.s - y0.s);
    const cnt = {};
    list.forEach((b) => {
      if (!isCatId(b.cat) || b.status) return;
      const hid = HABIT_OF[b.cat];
      if (!hid || !st.habits.some((h) => h.id === hid)) return;
      cnt[b.cat] = (cnt[b.cat] || 0) + 1;
      ((day.habits && day.habits[hid]) || 0) >= cnt[b.cat] && ((b.status = "done"), (b.byHabit = !0));
    });
    const sleep = hm(st.times.sleep),
      lastCat = list.filter((b) => isCatId(b.cat) && b.dur > 0).pop(),
      over = lastCat ? Math.max(0, lastCat.s + lastCat.dur - sleep) : 0;
    return { list, over, sleep, wake: hm(st.times.wake[wd]), wd, bad: !!day.bad, own };
  }
  function blkLogged(key, id) {
    const d = U.days[key];
    return ((d && d.sessions) || []).filter((x) => x.blk === id).reduce((a, x) => a + (x.sec || 0) / 60, 0);
  }
  function bumpHabitIn(d, cat, key) {
    const hid = HABIT_OF[cat],
      hb = bt().habits.find((h) => h.id === hid);
    if (!hb) return;
    const tgt = hT(hb, key);
    tgt && ((d.habits = d.habits || {}), (d.habits[hid] = Math.min(tgt, (d.habits[hid] || 0) + 1)));
  }
  // План и факт по темам за неделю (только с начала работы по плану и только прошедшие блоки)
  function weekBalance(off = 0) {
    const st = bt(),
      today = j(),
      nm = nowMin(),
      planned = {},
      fact = {};
    Qt(off).forEach((d) => {
      const key = j(d);
      if (key < st.planStart || key > today) return;
      const day = U.days[key] || {};
      ((day.sessions || [])).forEach((x) => {
        x.cat && "games" !== x.cat && "break" !== x.cat && (fact[x.cat] = (fact[x.cat] || 0) + (x.sec || 0) / 60);
      });
      planItems(key).list.forEach((it) => {
        if (!isCatId(it.cat) || it.base <= 0) return;
        const done = "done" === it.status,
          past = key < today || it.s + it.dur <= nm;
        if (!past && !done) return;
        planned[it.cat] = (planned[it.cat] || 0) + it.base;
        done && (fact[it.cat] = (fact[it.cat] || 0) + Math.max(0, it.base - blkLogged(key, it.id)));
      });
    });
    const rows = [];
    let debt = 0,
      reserve = 0;
    ALLCATS.forEach((c) => {
      const p0 = planned[c.id] || 0,
        f = fact[c.id] || 0;
      if (!p0 && !f) return;
      const dl = Math.round(p0 - f);
      rows.push({ cat: c, planned: p0, fact: f, debt: Math.max(0, dl), reserve: Math.max(0, -dl) });
      dl > 0 ? (debt += dl) : (reserve += -dl);
    });
    return { rows, debt, reserve };
  }
  const debtsNow = () => weekBalance(0).rows.filter((r) => r.debt >= 5).sort((a, b) => b.debt - a.debt);
  // Награда: если в будни выполнено ≥ pct% привычек (или минимума в плохие дни), в субботу +min к лимиту игр
  function rewardInfo(off = 0) {
    const st = bt();
    if (!st.reward || !st.reward.on) return null;
    let sum = 0,
      n = 0;
    Qt(off)
      .slice(0, 5)
      .forEach((d) => {
        const k = j(d);
        if (k < st.planStart || k > j()) return;
        const v = Kt(U.days[k], d);
        null !== v && ((sum += v), n++);
      });
    const pct = n ? Math.round((sum / n) * 100) : 0;
    return { pct, n, earned: n > 0 && pct >= st.reward.pct, need: st.reward.pct, bonus: st.reward.min || 0 };
  }
  function rewardHint() {
    const ri = rewardInfo(0);
    if (!ri) return "";
    const wd = E(new Date());
    return 5 === wd
      ? ri.earned
        ? `<p class="hint good-t">+${A(ri.bonus)} к играм сегодня — награда за будни (${ri.pct}%).</p>`
        : `<p class="hint">Награды нет: будни выполнены на ${ri.pct}%, нужно ${ri.need}%.</p>`
      : wd < 5
        ? `<p class="hint">Будни выполнены на ${ri.pct}%. От ${ri.need}% в субботу +${A(ri.bonus)} к играм.</p>`
        : "";
  }
  // ---------- Карточки «Сейчас», «Дальше», плохой день, долги ----------
  function blockRow(it, key, opts = {}) {
    const c = it.cat && "debt" !== it.cat ? s(it.cat) : null,
      col = "debt" === it.cat ? "var(--warn)" : c ? c.color : "var(--muted)",
      plain = !it.cat,
      cls = [plain ? "plain" : "", "done" === it.status ? "done" : "", opts.cur ? "cur" : "", opts.off ? "off" : ""].join(" "),
      badge =
        "prep" === it.kind
          ? '<span class="badge acc">из события</span>'
          : it.ext
            ? `<span class="badge">+${it.ext} мин</span>`
            : "moved" === it.status
              ? '<span class="badge">перенесено</span>'
              : it.fixed
                ? '<span class="badge">встреча</span>'
                : "",
      sub = opts.sub || "",
      play =
        opts.play && isCatId(it.cat) && "done" !== it.status
          ? `<button class="blk-play" data-a="blk-start" data-key="${key}" data-id="${O(it.id)}" aria-label="Засечь: ${O(it.title)}">${w.play}</button>`
          : "";
    return `<div class="tl-row"><div class="tl-t mono">${mh(it.s)}</div><div class="blk ${cls}" style="--c:${col}"><div class="bt">${O(it.title)}${
      !plain && it.dur ? ` <span class="bdur">· ${A(it.dur)}</span>` : ""
    }${badge ? " " + badge : ""}</div>${sub ? `<div class="bs">${sub}</div>` : ""}${play}</div></div>`;
  }
  function nextItems(P0, nm) {
    return P0.list.filter((it) => it.dur > 0 && it.s >= nm && (isCatId(it.cat) || "debt" === it.cat) && "done" !== it.status);
  }
  function nowArea() {
    const tm = ht(),
      key = j(),
      nm = nowMin(),
      P0 = planItems(key),
      day = U.days[key] || {};
    if (tm) {
      const it = tm.blk && tm.blkDate === key ? P0.list.find((x) => x.id === tm.blk) : null;
      return it && nm >= it.s + it.dur ? overCard(tm, it, key) : oa(tm, !1, it);
    }
    if (tt.moveFor && tt.moveFor.key === key) return moveCard();
    if (tt.early && tt.early.key === key && tt.early.until > nm) return earlyCard(P0, nm);
    if (day.bad) return "";
    const cur = P0.list.find((x) => x.dur > 0 && x.s <= nm && nm < x.s + x.dur),
      nx = nextItems(P0, nm)[0],
      quick = `<button class="link" data-a="tab" data-v="timer">Таймер без расписания →</button>`;
    if (cur && "debt" === cur.cat) return debtWindowCard(cur);
    if (cur && isCatId(cur.cat) && "done" !== cur.status) {
      const c = s(cur.cat),
        left = cur.s + cur.dur - nm,
        pr = Math.min(100, ((nm - cur.s) / cur.dur) * 100);
      return `<section class="card now" style="--c:${c.color}">
    <div class="now-tag"><i></i>Сейчас по расписанию</div>
    <div class="now-time mono">${mh(cur.s)} – ${mh(cur.s + cur.dur)}</div>
    <div class="now-title">${O(cur.title)}</div>
    <div class="now-sub">Осталось ${A(left)}${"res" === cur.mode ? " · засчитается, когда сделаешь" : ""}</div>
    <div class="pbar"><div style="width:${pr.toFixed(1)}%"></div></div>
    <div class="btn-row"><button class="btn primary" data-a="blk-start" data-key="${key}" data-id="${O(cur.id)}">${w.play}Начать</button><button class="btn" data-a="blk-done" data-key="${key}" data-id="${O(cur.id)}">Уже сделал</button>${
      "prep" === cur.kind ? `<button class="btn ghost" data-a="no-prep" data-id="${O(cur.evId)}">Убрать</button>` : ""
    }</div></section>`;
    }
    let msg;
    cur && !cur.cat
      ? (msg = `Сейчас: <b>${O(cur.title)}</b> до ${mh(cur.s + cur.dur)}.`)
      : cur && "done" === cur.status
        ? (msg = `<b>${O(cur.title)}</b> — сделано.`)
        : nm < P0.wake
          ? (msg = "Ещё рано. Выспись.")
          : (msg = nx ? "Сейчас свободное время по расписанию." : "На сегодня всё по расписанию. Лечь до " + O(bt().times.sleep) + ".");
    return `<section class="card now calm"><div class="now-sub" style="margin:0">${msg}${
      nx ? ` Дальше — <b>${O(nx.title)}</b> в ${mh(nx.s)}.` : ""
    }</div>${
      nx && isCatId(nx.cat) ? `<div class="btn-row"><button class="btn" data-a="blk-start" data-key="${key}" data-id="${O(nx.id)}">${w.play}Начать раньше</button>${quick}</div>` : `<div class="btn-row">${quick}</div>`
    }</section>`;
  }
  function overCard(tm, it, key) {
    const c = s(it.cat);
    return `<section class="card now warn-c" style="--c:var(--warn)">
    <div class="now-tag"><i></i>Время вышло</div>
    <div class="now-time mono">${mh(it.s)} – ${mh(it.s + it.dur)} · сверх плана <span class="js-elapsed">00:00</span></div>
    <div class="now-title">${O(it.title)}</div>
    <div class="now-sub">${"res" === it.mode ? "Ещё не закончил?" : "Время блока закончилось."}</div>
    <div class="pbar"><div style="width:100%"></div></div>
    <div class="btn-row"><button class="btn primary" data-a="blk-ext" data-key="${key}" data-id="${O(it.id)}">+15 минут</button><button class="btn" data-a="blk-move" data-key="${key}" data-id="${O(it.id)}">Перенести остаток</button><button class="btn ghost" data-a="blk-done" data-key="${key}" data-id="${O(it.id)}">Готово</button></div>
    <p class="hint">+15 минут сдвинут остальное, отдых сожмётся первым. <span style="color:${c.color}">${O(c.short)}</span>: время записывается.</p></section>`;
  }
  function moveCard() {
    const mv = tt.moveFor,
      c = s(mv.cat);
    return `<section class="card"><div class="card-h"><h2>Куда перенести остаток?</h2><span class="mono muted small">≈ ${A(mv.rem)}</span></div>
    <p class="hint top0" style="margin-bottom:10px">${O(mv.title)} · <span style="color:${c.color}">${O(c.short)}</span></p>
    <div class="opt-list"><button class="opt" data-a="move-tomorrow">Завтра — в список дел<span>появится на главной</span></button><button class="opt" data-a="move-keep">Оставить в долге недели<span>закрою в любой день или в окно долгов в субботу</span></button></div></section>`;
  }
  function earlyCard(P0, nm) {
    const e0 = tt.early,
      freed = e0.until - nm,
      nx = nextItems(P0, nm).find((x) => isCatId(x.cat)),
      dts = debtsNow();
    let opts = "";
    dts.length &&
      (opts += `<button class="opt" data-a="debt-start" data-cat="${O(dts[0].cat.id)}" data-min="${Math.min(freed, dts[0].debt)}">Закрыть долг: ${O(dts[0].cat.short)} −${A(Math.min(freed, dts[0].debt))}<span>рекомендую</span></button>`);
    nx &&
      (opts += `<button class="opt" data-a="blk-start" data-key="${j()}" data-id="${O(nx.id)}" data-early="1">Начать «${O(nx.title)}» сейчас<span>по плану в ${mh(nx.s)}</span></button>`);
    opts += `<button class="opt" data-a="early-free">Свободное время до ${mh(e0.until)}<span>отдых, но не игры: лимит не меняется</span></button>`;
    return `<section class="card now" style="--c:var(--good)"><div class="now-tag"><i></i>Готово раньше</div>
    <div class="now-title">${O(e0.title)}</div><div class="now-sub">Быстрее плана на ${A(freed)}. Засчитано целиком — считается результат, а не минуты.</div></section>
    <section class="card"><div class="card-h"><h2>Освободилось ${A(freed)}</h2></div><div class="opt-list">${opts}</div></section>`;
  }
  function debtWindowCard(cur) {
    const dts = debtsNow(),
      po = projOpts();
    return `<section class="card now" style="--c:var(--warn)"><div class="now-tag"><i></i>Окно долгов и проектов · до ${mh(cur.s + cur.dur)}</div>
    ${
      dts.length
        ? `<div class="now-sub" style="margin-bottom:8px">Выбери, что закрыть:</div><div class="opt-list">${dts
            .map((r) => `<button class="opt" data-a="debt-start" data-cat="${O(r.cat.id)}" data-min="${r.debt}"><i class="dot" style="background:${r.cat.color}"></i>${O(r.cat.name)} · ${A(r.debt)}</button>`)
            .join("")}${po}</div>`
        : po
          ? `<div class="now-sub" style="margin-bottom:8px">Долгов нет. Можно продвинуть проект:</div><div class="opt-list">${po}</div>`
          : '<div class="now-sub">Долгов и проектов нет — это свободное время. Отдыхай.</div>'
    }</section>`;
  }
  function nextArea() {
    const key = j(),
      nm = nowMin(),
      P0 = planItems(key),
      day = U.days[key] || {};
    if (day.bad) return "";
    const tm = ht(),
      list = nextItems(P0, nm).filter((it) => !(tm && tm.blk === it.id)).slice(0, 5);
    if (!list.length && !P0.over) return "";
    return `<section class="card"><div class="card-h"><h2>Дальше сегодня</h2><button class="link" data-a="go-sched">Всё расписание →</button></div>
    <div class="tl">${list.map((it) => blockRow(it, key, { play: !0 })).join("")}</div>${
      P0.over ? `<p class="hint bad-t">До сна не влезает ${A(P0.over)} — что-то перенеси или сократи.</p>` : ""
    }<div class="btn-row"><button class="btn small" data-a="sched-edit-day" data-key="${key}">Изменить сегодня</button>${
      P0.own ? '<span class="muted small">план только на сегодня</span>' : ""
    }</div></section>`;
  }
  // ---------- Проекты на главной ----------
  function projDueText(p0) {
    if (!p0.due) return "без срока";
    const dl = P(p0.due),
      dd = M(p0.due);
    return dl < 0
      ? `срок был ${O(F(dd, { day: "numeric", month: "long" }))}`
      : 0 === dl
        ? "срок сегодня"
        : 1 === dl
          ? "срок завтра"
          : `срок ${O(F(dd, { weekday: "short", day: "numeric", month: "long" }))} · ${G(dl)}`;
  }
  function projectsArea() {
    const tm = ht();
    return bt()
      .projects.filter((p0) => !p0.done)
      .map((p0) => {
        const c = p0.cat ? s(p0.cat) : null,
          n0 = p0.steps.length,
          k0 = p0.steps.filter((x0) => x0.done).length,
          hot = p0.due && P(p0.due) <= 1;
        return `<section class="card proj" style="--c:${c ? c.color : "var(--accent)"}"><div class="card-h"><h2>${O(p0.title)}</h2><span class="mono muted small">${k0}/${n0}</span></div>
    <p class="hint top0 ${hot ? "bad-t" : ""}">Проект · ${projDueText(p0)}</p>
    ${n0 ? `<div class="pbar"><div style="width:${((k0 / n0) * 100).toFixed(1)}%"></div></div>` : ""}
    <ul class="habits proj-steps">${p0.steps
      .map(
        (x0) =>
          `<li><button class="habit ${x0.done ? "done" : ""}" data-a="proj-step" data-id="${O(p0.id)}" data-v="${O(x0.id)}" aria-pressed="${x0.done}"><span class="box">${w.check}</span><span class="hname">${O(x0.t)}</span></button></li>`,
      )
      .join("")}</ul>
    <div class="btn-row">${c && !tm ? `<button class="btn small" data-a="proj-timer" data-id="${O(p0.id)}">${w.play}Засечь: ${O(c.short)}</button>` : ""}${
      n0 && k0 === n0 ? `<button class="btn small primary" data-a="proj-finish" data-id="${O(p0.id)}">Проект готов</button>` : ""
    }<button class="link" data-a="proj-edit" data-id="${O(p0.id)}">Изменить</button></div></section>`;
      })
      .join("");
  }
  function projOpts() {
    return bt()
      .projects.filter((p0) => !p0.done && p0.cat && p0.steps.some((x0) => !x0.done))
      .map((p0) => {
        const nx = p0.steps.find((x0) => !x0.done);
        return `<button class="opt" data-a="proj-timer" data-id="${O(p0.id)}"><i class="dot" style="background:${s(p0.cat).color}"></i>Проект: ${O(p0.title)}<span>дальше: ${O(nx.t)} · ${projDueText(p0)}</span></button>`;
      })
      .join("");
  }
  function badArea(o) {
    const key = j();
    if (!o.bad)
      return ht() ? "" : `<button class="btn dashed wide" data-a="bad-on">Плохой день — оставить только минимум</button>`;
    const mn = bt().minimum,
      done = mn.filter((m) => o.min && o.min[m.id]).length,
      cnt = Qt(0).filter((d) => {
        const dd = U.days[j(d)];
        return dd && dd.bad;
      }).length,
      postponed = planItems(key)
        .list.filter((it) => isCatId(it.cat) && "done" !== it.status)
        .map((it) => it.title.split(" · ")[0]);
    return `<section class="banner"><b>Плохой день.</b> Сегодня считается только минимум. Сделаешь его — серия не прервётся.
    <div class="banner-f"><span class="hint top0">Плохих дней на этой неделе: ${cnt}</span><button class="link" data-a="bad-off">Вернуть обычный день</button></div></section>
    <section class="card"><div class="card-h"><h2>Минимум на сегодня</h2><span class="mono muted small">${done}/${mn.length}</span></div>
    <ul class="habits">${mn
      .map((m) => {
        const on = !(!o.min || !o.min[m.id]);
        return `<li><button class="habit ${on ? "done" : ""}" data-a="min-tap" data-id="${O(m.id)}" aria-pressed="${on}"><span class="box">${w.check}</span><span class="hname">${O(m.name)}</span></button></li>`;
      })
      .join("")}</ul></section>
    <section class="card"><div class="card-h"><h2>Что случилось?</h2><span class="muted small">попадёт в отчёт</span></div>
    <textarea id="bad-note" rows="2" data-input="bad-note" data-key="${key}" placeholder="Например: устал после контрольной, болит голова">${O(o.badNote || "")}</textarea>
    ${postponed.length ? `<p class="hint">Отложено и уйдёт в долг недели: ${O([...new Set(postponed)].join(", "))}.</p>` : ""}</section>`;
  }
  function todoArea(o) {
    const key = j(),
      todo = (o.todo || []).filter((x) => !x.done),
      dts = o.bad ? [] : debtsNow();
    if (!todo.length && !dts.length) return "";
    let h = `<section class="card"><div class="card-h"><h2>${todo.length ? "Перенесено на сегодня" : "Долг недели"}</h2>${
      dts.length ? `<span class="small bad-t">долг ${A(dts.reduce((a, r) => a + r.debt, 0))}</span>` : ""
    }</div>`;
    todo.length &&
      (h += `<ul class="todo">${todo
        .map((x) => {
          const c = s(x.cat);
          return `<li><i class="dot" style="background:${c.color}"></i><span class="grow">${O(x.title)} · ${A(x.min)}<span class="muted small"> из ${O(F(M(x.from), { weekday: "short" }))}</span></span><button class="btn small" data-a="todo-start" data-id="${O(x.id)}">${w.play}</button><button class="x" data-a="todo-done" data-id="${O(x.id)}" aria-label="Сделано">✓</button></li>`;
        })
        .join("")}</ul>`);
    dts.length &&
      (h += tt.debtPick
        ? `<div class="opt-list" style="margin-top:8px">${dts
            .map((r) => `<button class="opt" data-a="debt-start" data-cat="${O(r.cat.id)}" data-min="${r.debt}"><i class="dot" style="background:${r.cat.color}"></i>${O(r.cat.name)} · ${A(r.debt)}</button>`)
            .join("")}</div>`
        : `<p class="hint top0">${dts.map((r) => `${O(r.cat.short)} ${A(r.debt)}`).join(" · ")}</p><div class="btn-row"><button class="btn primary small" data-a="debt-pick">Закрыть долг сейчас</button><button class="link" data-a="go-view" data-v="week">План и факт →</button></div>`);
    return h + "</section>";
  }
  // ---------- Слова ----------
  const SRS = [0, 1, 2, 4, 7, 14, 30, 60, 120];
  const DECKS = [
    ["de", "Немецкий"],
    ["en", "Английский"],
  ];
  const cardsOf = (deck) => Object.entries(U.cards).filter(([, c]) => c && c.deck === deck);
  const dueOf = (deck) => cardsOf(deck).filter(([, c]) => (c.due || "") <= j());
  function wordsDueArea() {
    const n = DECKS.reduce((a, [d]) => a + dueOf(d).length, 0);
    return n
      ? `<section class="card row-card"><div><b>Слова на повторение: ${n}</b><div class="muted small">${DECKS.map(([d, nm]) => {
          const k = dueOf(d).length;
          return k ? `${nm} ${k}` : "";
        })
          .filter(Boolean)
          .join(" · ")}</div></div><button class="btn primary small" data-a="review-start" data-v="${dueOf("de").length ? "de" : "en"}">Повторить</button></section>`
      : "";
  }
  function cardGrade(id, g) {
    const c = N(U.cards[id]);
    if (!c) return;
    const today = j();
    0 === g
      ? ((c.box = 0), (c.due = today), (c.lapses = (c.lapses || 0) + 1))
      : ((c.box = Math.min(SRS.length - 1, (c.box || 0) + (2 === g ? 2 : 1))), (c.due = j(D(new Date(), SRS[c.box]))));
    c.last = Date.now();
    At("cards", id, c, !1);
  }
  function addCards(deck, pairs) {
    let n = 0;
    pairs.forEach(([f, b, ex]) => {
      (f = (f || "").trim()),
        (b = (b || "").trim()),
        f &&
          b &&
          (At("cards", T(), { deck, front: f, back: b, ex: (ex || "").trim(), box: 0, due: j(), created: Date.now(), last: 0 }, !1), n++);
    });
    return n;
  }
  function parseBulk(txt) {
    return String(txt || "")
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const m0 = l.split(/\s+[—–-]\s+|\t|\s*=\s*/);
        return m0.length >= 2 ? [m0[0], m0[1], m0.slice(2).join(" — ")] : null;
      })
      .filter(Boolean);
  }
  // ---------- Отчёт для Claude ----------
  function weekReport(off = 0) {
    const days = Qt(off),
      st = bt(),
      today = j(),
      past = days.filter((d) => j(d) <= today),
      by = {};
    let work = 0,
      games = 0,
      lim = 0,
      hsum = 0,
      hn = 0;
    const bads = [];
    past.forEach((d) => {
      const k = j(d),
        dd = U.days[k],
        yc = Yt(dd);
      Object.keys(yc).forEach((c) => {
        (by[c] = (by[c] || 0) + yc[c]), (work += yc[c]);
      });
      (games += (dd && dd.gamesMin) || 0), (lim += st.gameLimit[E(d)] || 0);
      const v = Kt(dd, d);
      null !== v && ((hsum += v), hn++);
      dd && dd.bad && bads.push(`${F(d, { weekday: "short" })}${dd.badNote ? ": " + dd.badNote : ""}`);
    });
    const goalSum = t.reduce((a, c) => a + (c.goal || 0), 0),
      lines = [];
    lines.push(`Отчёт за неделю ${Zt(days)}`);
    lines.push(`Работа: ${S(work)} ч${goalSum ? ` из ${I(goalSum)} ч по целям (${Math.round((work / 60 / goalSum) * 100)}%)` : ""}`);
    const catLines = ALLCATS.filter((c) => by[c.id] > 0 || (!c.archived && c.goal > 0)).map(
      (c) => `${c.short} ${S(by[c.id] || 0)}${c.goal ? "/" + I(c.goal) : ""}`,
    );
    catLines.length && lines.push(" " + catLines.join(" · "));
    lines.push(`Привычки: ${hn ? Math.round((hsum / hn) * 100) : 0}% · серия ${Xt()} дн.`);
    lines.push(`Плохих дней: ${bads.length}${bads.length ? " (" + bads.join("; ") + ")" : ""}`);
    lines.push(`Игры: ${S(games)} при лимите ${S(lim)}`);
    const wb = 0 === off ? weekBalance(0) : null;
    wb &&
      (wb.debt || wb.reserve) &&
      lines.push(
        `Долг по расписанию: ${wb.debt ? A(wb.debt) : "нет"}${
          wb.rows.filter((r) => r.debt >= 5).length ? " (" + wb.rows.filter((r) => r.debt >= 5).map((r) => `${r.cat.short} ${A(r.debt)}`).join(", ") + ")" : ""
        }`,
      );
    const prj = st.projects.filter((p0) => !p0.done || p0.doneAt >= days[0].getTime());
    prj.length &&
      lines.push(
        "Проекты: " +
          prj
            .map(
              (p0) =>
                `${p0.title} — ${
                  p0.done
                    ? "готов"
                    : `${p0.steps.filter((x0) => x0.done).length}/${p0.steps.length} шагов${p0.due ? ", срок " + F(M(p0.due), { day: "numeric", month: "short" }) : ""}`
                }`,
            )
            .join("; "),
      );
    const ownDays = days.filter((d) => U.days[j(d)] && Array.isArray(U.days[j(d)].plan)).map((d) => F(d, { weekday: "short", day: "numeric" }));
    ownDays.length && lines.push(`Дни с отдельным планом: ${ownDays.join(", ")}`);
    const k0 = j(days[0]),
      k6 = j(days[6]),
      hws = Object.values(U.hw).filter((x) => x && x.date >= k0 && x.date <= k6),
      overdue = Object.values(U.hw).filter((x) => x && (x.text || "").trim() && !x.done && x.date < today).length,
      grades = hws.filter((x) => (x.grade || "").trim()).map((x) => `${x.subject} ${x.grade}`);
    lines.push(`Домашка: не отмечено ${overdue}${grades.length ? " · оценки: " + grades.join(", ") : ""}`);
    const rev = Object.values(U.cards).filter((c) => c && c.last && c.last >= days[0].getTime()).length;
    rev && lines.push(`Слова: повторено карточек ${rev}`);
    const ri = rewardInfo(off);
    ri && lines.push(`Награда за будни: ${ri.earned ? "получена" : "нет"} (${ri.pct}%)`);
    const evs = Object.values(U.events)
      .filter((e0) => e0 && e0.date > today && e0.date <= j(D(new Date(), 14)))
      .sort((a0, b0) => a0.date.localeCompare(b0.date))
      .map((e0) => `${e0.title} (${F(M(e0.date), { day: "numeric", month: "short" })})`);
    evs.length && lines.push(`Впереди: ${evs.join(", ")}`);
    const wr = U.weeks[k0];
    wr && (wr.good || "").trim() && lines.push(`Получилось: ${wr.good.trim()}`);
    wr && (wr.improve || "").trim() && lines.push(`Улучшить: ${wr.improve.trim()}`);
    lines.push("Вес: ");
    return lines.join("\n");
  }
  // ---------- Значок с числом дел на иконке ----------
  let lastBadge = -1;
  function updateBadge() {
    try {
      if (!vt() || !navigator.setAppBadge) return;
      const now = new Date(),
        wd = E(now),
        d0 = U.days[j(now)] || {};
      let left;
      if (d0.bad) left = bt().minimum.filter((m) => !(d0.min && d0.min[m.id])).length;
      else
        left = bt().habits.reduce((a, h) => a + Math.max(0, hT(h, j(now)) - ((d0.habits && d0.habits[h.id]) || 0)), 0);
      if (left === lastBadge) return;
      lastBadge = left;
      left > 0 ? navigator.setAppBadge(left).catch(() => {}) : navigator.clearAppBadge && navigator.clearAppBadge().catch(() => {});
    } catch (e0) {}
  }
  // ---------- Напоминания (Web Push) ----------
  function pushKey() {
    try {
      return "undefined" != typeof PUSH_PUBLIC_KEY ? PUSH_PUBLIC_KEY : "";
    } catch (e0) {
      return "";
    }
  }
  function b64u(str) {
    const pad = "=".repeat((4 - (str.length % 4)) % 4),
      b = atob((str + pad).replace(/-/g, "+").replace(/_/g, "/")),
      out = new Uint8Array(b.length);
    for (let i0 = 0; i0 < b.length; i0++) out[i0] = b.charCodeAt(i0);
    return out;
  }
  function pushState() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window))
      return z() && !H() ? "ios-install" : "unsupported";
    if ("cloud" !== J) return "local";
    if (!pushKey()) return "nokey";
    const p0 = U.profile && U.profile.push;
    return "denied" === Notification.permission ? "denied" : p0 && p0.on && p0.sub ? "on" : "off";
  }
  async function pushOn() {
    if (tt.pushBusy) return;
    tt.pushBusy = !0;
    $a();
    try {
      const perm = await Notification.requestPermission();
      if ("granted" !== perm) return void Ea("Уведомления запрещены. Разреши их в настройках телефона.");
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      sub || (sub = await reg.pushManager.subscribe({ userVisibleOnly: !0, applicationServerKey: b64u(pushKey()) }));
      Lt({ push: { on: !0, sub: JSON.parse(JSON.stringify(sub)), tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Moscow", lead: 0, updated: Date.now() } }, !1);
      V($, "1");
      Ea("Напоминания включены");
    } catch (e0) {
      console.error(e0), Ea("Не получилось включить напоминания: " + ((e0 && e0.message) || "ошибка"));
    } finally {
      (tt.pushBusy = !1), $a();
    }
  }
  async function pushOff() {
    try {
      const reg = await navigator.serviceWorker.ready,
        sub = await reg.pushManager.getSubscription();
      sub && (await sub.unsubscribe());
    } catch (e0) {}
    Lt({ push: { on: !1, sub: null, updated: Date.now() } });
    Ea("Напоминания выключены");
  }
  // ---------- Фокус-режим ----------
  function focusOverlay() {
    const tm = ht();
    if (!tm || !tt.focus) return "";
    const c = s(tm.cat),
      key = j(),
      P0 = planItems(key),
      it = tm.blk ? P0.list.find((x) => x.id === tm.blk) : null,
      nx = nextItems(P0, nowMin()).find((x) => x.id !== tm.blk),
      R0 = 120,
      C0 = 2 * Math.PI * R0;
    return `<div class="focus" role="dialog" aria-modal="true" aria-label="Фокус-режим" style="--c:${c.color}">
    <div class="focus-top"><span class="cat-tag" style="--c:${c.color}"><i></i>${O(it ? it.title : c.name)}</span><span class="muted small">${
      "pomo" === tm.mode ? `помидор ${tm.targetMin} мин` : "секундомер"
    }${tm.pausedAt ? " · пауза" : ""}</span></div>
    <div class="focus-ring"><svg viewBox="0 0 270 270"><circle cx="135" cy="135" r="${R0}" class="fr-bg"/><circle cx="135" cy="135" r="${R0}" class="fr-fg js-ring" stroke-dasharray="${C0.toFixed(1)}" stroke-dashoffset="${C0.toFixed(1)}" data-c="${C0.toFixed(1)}"/></svg>
    <div class="focus-in"><div class="mono focus-clock js-elapsed">00:00</div><div class="muted small">${"pomo" === tm.mode ? "осталось" : "идёт"}</div></div></div>
    <div class="focus-hint"><b>Телефон — экраном вниз</b><span class="muted small">Ничего не открывай, пока идёт таймер.</span></div>
    <div class="card focus-stats"><div><span class="muted">Сегодня поработал</span><b class="mono">${S(Jt(U.days[key]))}</b></div>${
      nx ? `<div><span class="muted">Дальше по расписанию</span><b>${mh(nx.s)} ${O(nx.title.split(" · ")[0])}</b></div>` : ""
    }</div>
    <div class="btn-row focus-btns"><button class="btn primary" data-a="${it && "res" === it.mode ? "blk-done" : "timer-stop"}" data-key="${key}" data-id="${O((it && it.id) || "")}">${
      it && "res" === it.mode ? "Готово" : "Стоп и сохранить"
    }</button><button class="btn" data-a="timer-pause">${tm.pausedAt ? "Продолжить" : "Пауза"}</button><button class="btn ghost" data-a="focus-close">Свернуть</button></div></div>`;
  }
  const backLink = () => '<button class="link back" data-a="tab" data-v="more">← Ещё</button>';
  // ===================== Новые экраны и окна =====================
  const DAY_ACC = ["понедельник", "вторник", "среду", "четверг", "пятницу", "субботу", "воскресенье"],
    DAY_GEN = ["понедельника", "вторника", "среды", "четверга", "пятницы", "субботы", "воскресенья"];
  function hwSubnav() {
    return `<div class="subnav" role="group" aria-label="Раздел">${[
      ["diary", "Домашка"],
      ["sched", "Расписание дня"],
    ]
      .map(([k0, n0]) => `<button class="${tt.hwView === k0 ? "on" : ""}" data-a="hw-view" data-v="${k0}" aria-pressed="${tt.hwView === k0}">${n0}</button>`)
      .join("")}</div>`;
  }
  function schedView() {
    const wd = tt.schedDay,
      wk = tt.schedWeek || 0,
      days0 = Qt(wk),
      d0 = days0[wd],
      key = j(d0),
      isToday = key === j(),
      P0 = planItems(key),
      st2 = bt(),
      nm = nowMin(),
      lessons = (st2.timetable[wd] || []).filter((x0) => (x0 || "").trim()),
      busy = P0.list.filter((it) => isCatId(it.cat)).reduce((a0, it) => a0 + it.dur, 0);
    let rows = `<div class="tl-row"><div class="tl-t mono">${mh(P0.wake)}</div><div class="blk plain"><div class="bt">Подъём</div></div></div>`;
    lessons.length &&
      (rows += `<div class="tl-row"><div class="tl-t"></div><div class="blk" style="--c:${s("hw").color}"><div class="bt">Школа · ${lessons.length} ${C(lessons.length, "урок", "урока", "уроков")}</div><div class="lessons">${lessons
        .map((l0) => `<span>${O(l0)}</span>`)
        .join("")}</div></div></div>`);
    P0.list.forEach((it) => {
      if (it.dur <= 0) return;
      const cur = isToday && it.s <= nm && nm < it.s + it.dur;
      rows += blockRow(it, key, {
        play: isToday && !P0.bad,
        cur,
        off: P0.bad && isCatId(it.cat) && "done" !== it.status,
        sub: "prep" === it.kind ? "появилось само: событие завтра" : "res" === it.mode && isCatId(it.cat) ? "по результату" : "",
      });
    });
    rows += `<div class="tl-row"><div class="tl-t mono">${mh(P0.sleep)}</div><div class="blk plain"><div class="bt">Сон</div></div></div>`;
    const dayName = isToday ? "сегодня" : O(F(d0, { day: "numeric", month: "long" })),
      rk = "reset:" + key;
    return `<section class="pagehead"><h1 class="display">Расписание</h1><p class="muted">Нажми ▶ у дела, и запустится таймер нужной темы.</p></section>${hwSubnav()}
    <div class="weeknav sched-wk"><button class="btn" data-a="sched-wk" data-v="-1" aria-label="Неделя раньше" ${wk <= 0 ? "disabled" : ""}>‹</button><div class="range">${O(Zt(days0))}${
      ta(wk) ? ` <span class="muted small">· ${ta(wk)}</span>` : ""
    }</div><button class="btn" data-a="sched-wk" data-v="1" aria-label="Неделя позже" ${wk >= 8 ? "disabled" : ""}>›</button></div>
    <div class="seg day-seg" role="group" aria-label="День недели">${u
      .map((n0, i0) => {
        const own0 = U.days[j(days0[i0])] && Array.isArray(U.days[j(days0[i0])].plan);
        return `<button class="${i0 === wd ? "on" : ""} ${0 === wk && i0 === E(new Date()) ? "tday" : ""} ${own0 ? "own" : ""}" data-a="sched-day" data-v="${i0}" aria-pressed="${i0 === wd}">${n0}</button>`;
      })
      .join("")}</div>
    <section class="card"><div class="card-h"><h2>${p[wd]}, ${O(F(d0, { day: "numeric", month: "long" }))}</h2><span class="muted small">дел на ${A(busy)}</span></div>
    ${
      P0.own
        ? `<p class="hint top0 own-note">Этот день изменён отдельно, шаблон ${DAY_GEN[wd]} не тронут. <button class="link" data-a="sched-reset-day" data-key="${key}">${tt.confirm === rk ? "Нажми ещё раз — вернуть шаблон" : "Вернуть как в шаблоне"}</button></p>`
        : ""
    }
    ${P0.bad ? '<p class="hint top0" style="margin-bottom:8px">Плохой день: дела отложены, считается минимум.</p>' : ""}
    <div class="tl">${rows}</div>${P0.over ? `<p class="hint bad-t">До сна не влезает ${A(P0.over)}.</p>` : ""}</section>
    <div class="btn-row" style="margin-top:0"><button class="btn primary" data-a="sched-edit-day" data-key="${key}">Изменить только ${dayName}</button><button class="btn" data-a="sched-edit" data-v="${wd}">Шаблон: ${DAY_ACC[wd]}</button><button class="btn" data-a="tt-open">Уроки</button></div>
    <p class="hint"><b>Изменить только ${dayName}</b> — один день: созвон, рывок перед дедлайном, поездка. Шаблон и другие недели не меняются. <b>Шаблон</b> — то, что повторяется каждую неделю.</p>
    <p class="hint">Отдых и «свободно» — запас: если что-то затянулось, они сжимаются первыми. «Встреча» стоит на своём времени, остальное её обходит. Накануне контрольной или олимпиады блок подготовки появляется сам.</p>`;
  }
  function schedModal() {
    const dr = tt.schedDraft,
      catOpts = (cur) =>
        `<option value="" ${cur ? "" : "selected"}>Отдых, без таймера</option>${ALLCATS.filter((c0) => !c0.archived || c0.id === cur)
          .map((c0) => `<option value="${O(c0.id)}" ${c0.id === cur ? "selected" : ""}>${O(c0.name)}</option>`)
          .join("")}<option value="debt" ${"debt" === cur ? "selected" : ""}>Окно долгов</option>`;
    const one = !!dr.key,
      dd0 = one ? M(dr.key) : null;
    return `<div class="modal-back" data-a="sched-close-bg"><div class="modal wide-modal" role="dialog" aria-modal="true" aria-labelledby="sc-h">
    <div class="modal-h"><h2 id="sc-h" class="display">${
      one ? `Только ${O(dr.key === j() ? "сегодня" : F(dd0, { day: "numeric", month: "long" }))}` : `Шаблон: ${O(p[dr.d].toLowerCase())}`
    }</h2><button class="icon-btn" data-a="sched-close" aria-label="Закрыть">×</button></div>
    ${
      one
        ? `<p class="hint top0">Меняется только ${O(F(dd0, { weekday: "long", day: "numeric", month: "long" }))}. Шаблон ${DAY_GEN[dr.d]} и другие недели остаются как были.</p>`
        : `<div class="sc-times"><label>Подъём<input id="sd-wake" class="mono" type="text" inputmode="numeric" maxlength="5" placeholder="07:00" data-input="sd-wake" value="${O(dr.wake)}"></label><label>Сон<input id="sd-sleep" class="mono" type="text" inputmode="numeric" maxlength="5" placeholder="23:00" data-input="sd-sleep" value="${O(dr.sleep)}"></label></div>
    <p class="hint">Шаблон повторяется каждую неделю. Время сна общее для всех дней.</p>`
    }
    <p class="hint">«По результату» — дело засчитывается, когда сделано, даже если быстрее. «По времени» — нужно отсидеть минуты. «Встреча» — время закреплено: если что-то затянется, встреча не сдвинется, остальное переедет после неё.</p>
    <div class="sc-list">${dr.blocks
      .map(
        (b0, i0) => `<div class="sc-row">
      <input id="sb-start-${i0}" class="mono" type="text" inputmode="numeric" maxlength="5" placeholder="17:30" data-input="sb-start" data-i="${i0}" value="${O(b0.start)}" aria-label="Начало, ЧЧ:ММ">
      <label class="sc-dur"><input id="sb-dur-${i0}" class="mono" type="number" min="5" max="600" step="5" inputmode="numeric" data-input="sb-dur" data-i="${i0}" value="${b0.dur}" aria-label="Минут"><span>мин</span></label>
      <input id="sb-title-${i0}" class="sc-title" data-input="sb-title" data-i="${i0}" value="${O(b0.title)}" aria-label="Что делать" autocomplete="off">
      <select id="sb-cat-${i0}" data-input="sb-cat" data-i="${i0}" aria-label="Тема">${catOpts(b0.cat)}</select>
      <select id="sb-mode-${i0}" data-input="sb-mode" data-i="${i0}" aria-label="Как засчитывать" ${b0.cat && "debt" !== b0.cat ? "" : "disabled"}><option value="time" ${"res" !== b0.mode ? "selected" : ""}>по времени</option><option value="res" ${"res" === b0.mode ? "selected" : ""}>по результату</option></select>
      <button class="pin-t ${b0.fixed ? "on" : ""}" data-a="sb-pin" data-i="${i0}" aria-pressed="${!!b0.fixed}" title="Встреча: время не сдвигается">${w.pin}<span>встреча</span></button>
      <button class="x" data-a="sb-del" data-i="${i0}" aria-label="Удалить">×</button></div>`,
      )
      .join("")}</div>
    <div><button class="btn small" data-a="sb-add">+ Дело</button></div>
    ${
      one
        ? ""
        : `<h3>Скопировать на другие дни</h3>
    <div class="chips">${u
      .map((n0, i0) =>
        i0 === dr.d ? "" : `<button class="chip ${dr.copyTo.includes(i0) ? "on" : ""}" data-a="sd-copy" data-v="${i0}" aria-pressed="${dr.copyTo.includes(i0)}">${n0}</button>`,
      )
      .join("")}</div>`
    }
    <div class="modal-f"><button class="btn ghost" data-a="sched-close">Отмена</button><button class="btn primary" data-a="sched-save">Сохранить</button></div>
  </div></div>`;
  }
  function projModal() {
    const dr = tt.projDraft;
    return `<div class="modal-back" data-a="proj-close-bg"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="pj-h">
    <div class="modal-h"><h2 id="pj-h" class="display">${dr.id ? "Проект" : "Новый проект"}</h2><button class="icon-btn" data-a="proj-close" aria-label="Закрыть">×</button></div>
    <p class="hint top0">Проект — разовое дело со сроком: не привычка, а то, что надо один раз сделать (ТЮФ, доклад, подготовка к олимпиаде). Шаги отмечаются на главной. Время под проект ставь в расписание через «Изменить только этот день».</p>
    <label class="pj-l">Название<input id="pj-title" data-input="pj-title" value="${O(dr.title)}" placeholder="Например: ТЮФ — презентация к пятнице" autocomplete="off"></label>
    <div class="sc-times"><label>Срок<input id="pj-due" type="date" data-input="pj-due" value="${O(dr.due)}"></label><label>Тема таймера<select id="pj-cat" data-input="pj-cat"><option value="" ${dr.cat ? "" : "selected"}>без таймера</option>${ALLCATS.filter((c0) => !c0.archived || c0.id === dr.cat)
      .map((c0) => `<option value="${O(c0.id)}" ${c0.id === dr.cat ? "selected" : ""}>${O(c0.name)}</option>`)
      .join("")}</select></label></div>
    <label class="pj-l">Шаги — по одному на строку<textarea id="pj-steps" rows="6" data-input="pj-steps" placeholder="Прочитать статьи&#10;Отредактировать презентацию">${O(dr.stepsText)}</textarea></label>
    <div class="modal-f">${
      dr.id ? `<button class="btn ghost" data-a="proj-del">${tt.confirm === "pdel:" + dr.id ? "Точно удалить?" : "Удалить"}</button>` : ""
    }<button class="btn ghost" data-a="proj-close">Отмена</button><button class="btn primary" data-a="proj-save">Сохранить</button></div>
  </div></div>`;
  }
  function catsModal() {
    const dr = tt.catsDraft;
    return `<div class="modal-back" data-a="cats-close-bg"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="ct-h">
    <div class="modal-h"><h2 id="ct-h" class="display">Темы таймера</h2><button class="icon-btn" data-a="cats-close" aria-label="Закрыть">×</button></div>
    <p class="hint top0">Цвет — нажми на кружок. Цель — часов в неделю (0 — без цели). Если переименовать тему или убрать в архив, старые записи времени не пропадут.</p>
    <div class="cat-list">${dr
      .map(
        (c0, i0) => `<div class="cat-row ${c0.archived ? "arch" : ""}">
      <button class="cat-sw" style="background:${c0.color}" data-a="cat-color" data-i="${i0}" aria-label="Сменить цвет"></button>
      <input id="ct-n-${i0}" data-input="cat-name" data-i="${i0}" value="${O(c0.name)}" aria-label="Название темы" autocomplete="off">
      <label class="cat-goal"><input id="ct-g-${i0}" class="mono" type="text" inputmode="decimal" maxlength="4" data-input="cat-goal" data-i="${i0}" value="${c0.goal ? O(String(c0.goal).replace(".", ",")) : ""}" placeholder="0" aria-label="Цель, часов в неделю"><span>ч</span></label>
      <span class="ord"><button class="x" data-a="cat-up" data-i="${i0}" aria-label="Выше" ${0 === i0 ? "disabled" : ""}>↑</button><button class="x small-x" data-a="cat-arch" data-i="${i0}">${c0.archived ? "вернуть" : "архив"}</button></span>
    </div>`,
      )
      .join("")}</div>
    <div><button class="btn small" data-a="cat-add">+ Своя тема</button></div>
    <div class="modal-f"><button class="btn ghost" data-a="cats-close">Отмена</button><button class="btn primary" data-a="cats-save">Сохранить</button></div>
  </div></div>`;
  }
  function weekExtras() {
    const off = tt.weekOffset;
    let h0 = "";
    if (0 === off) {
      const wb = weekBalance(0);
      wb.rows.length &&
        (h0 += `<section class="card"><div class="card-h"><h2>План и факт</h2><span class="small">${wb.debt ? `<span class="bad-t">долг ${A(wb.debt)}</span>` : "долгов нет"}${
          wb.reserve ? ` · <span class="good-t">запас ${A(wb.reserve)}</span>` : ""
        }</span></div><p class="hint top0" style="margin-bottom:8px">Сделано / положено по расписанию к этому моменту.</p><ul class="bal">${wb.rows
          .map((r0) => {
            const pr = r0.planned ? Math.min(100, (r0.fact / r0.planned) * 100) : 100;
            return `<li><div class="bal-top"><span class="cat-tag" style="--c:${r0.cat.color}"><i></i>${O(r0.cat.name)}</span><span class="mono small"><b>${S(r0.fact)}</b><span class="muted"> / ${S(r0.planned)}</span> · ${
              r0.debt >= 5 ? `<span class="bad-t">долг ${A(r0.debt)}</span>` : r0.reserve >= 5 ? `<span class="good-t">запас ${A(r0.reserve)}</span>` : '<span class="muted">по плану</span>'
            }</span></div><div class="wg-bar"><div style="width:${pr.toFixed(1)}%;background:${r0.cat.color}"></div></div></li>`;
          })
          .join("")}</ul>${
          wb.debt >= 5
            ? '<div class="btn-row"><button class="btn primary small" data-a="debt-pick-week">Закрыть долг сейчас</button></div><p class="hint">Долг можно закрыть в любой день — кнопкой или свободным временем. В субботу есть запасное окно.</p>'
            : ""
        }${
          tt.debtPick
            ? `<div class="opt-list" style="margin-top:8px">${wb.rows
                .filter((r0) => r0.debt >= 5)
                .map((r0) => `<button class="opt" data-a="debt-start" data-cat="${O(r0.cat.id)}" data-min="${r0.debt}"><i class="dot" style="background:${r0.cat.color}"></i>${O(r0.cat.name)} · ${A(r0.debt)}</button>`)
                .join("")}</div>`
            : ""
        }</section>`);
    }
    const ri = rewardInfo(off);
    ri &&
      (h0 += `<section class="card"><div class="card-h"><h2>Награда за будни</h2><span class="small ${ri.earned ? "good-t" : "muted"}">${ri.earned ? `+${A(ri.bonus)} к играм в субботу` : `нужно ${ri.need}%`}</span></div><div class="wg-bar"><div style="width:${Math.min(100, ri.pct)}%;background:${
        ri.earned ? "var(--good)" : "var(--accent)"
      }"></div></div><p class="hint">Привычки в будни выполнены на ${ri.pct}%. В плохие дни считается минимум.</p></section>`);
    h0 += `<section class="card"><div class="card-h"><h2>Отчёт для Claude</h2><button class="link" data-a="report-toggle">${tt.reportOpen ? "Скрыть текст" : "Показать текст"}</button></div>
    ${tt.reportOpen ? `<pre class="report">${O(weekReport(off))}</pre>` : ""}
    <div class="btn-row"><button class="btn primary wide" data-a="report-copy">Скопировать отчёт</button></div>
    <p class="hint">В воскресенье скопируй и вставь в чат «Саморазвитие». Вес допиши в конце.</p></section>`;
    return h0;
  }
  function wordsView() {
    const dk = tt.wordsDeck,
      all = cardsOf(dk),
      due = dueOf(dk),
      rv = tt.review;
    let h0 = `<section class="pagehead">${backLink()}<h1 class="display">Слова</h1><p class="muted">Карточки с повторением по дням: что помнишь — показывается реже.</p></section>
    <div class="subnav" role="group" aria-label="Язык">${DECKS.map(
      ([k0, n0]) => `<button class="${dk === k0 ? "on" : ""}" data-a="deck" data-v="${k0}" aria-pressed="${dk === k0}">${n0} · ${dueOf(k0).length}</button>`,
    ).join("")}</div>`;
    if (rv && rv.deck === dk) {
      const id = rv.queue[rv.idx],
        c0 = id && U.cards[id];
      if (!c0)
        h0 += `<section class="card review-card"><div class="rv-done">Готово! Повторено: ${rv.done}.</div><div class="btn-row" style="justify-content:center"><button class="btn primary" data-a="review-end">Закончить</button></div></section>`;
      else
        h0 += `<section class="card review-card"><div class="rv-count mono muted small">${rv.idx + 1} / ${rv.queue.length}</div><div class="rv-front">${O(c0.front)}</div>${
          rv.show
            ? `<div class="rv-back">${O(c0.back)}</div>${c0.ex ? `<div class="rv-ex muted">${O(c0.ex)}</div>` : ""}<div class="btn-row rv-btns"><button class="btn danger" data-a="review-grade" data-v="0">Не помню</button><button class="btn primary" data-a="review-grade" data-v="1">Помню</button><button class="btn" data-a="review-grade" data-v="2">Легко</button></div>`
            : '<div class="btn-row" style="justify-content:center"><button class="btn primary wide" data-a="review-show">Показать перевод</button></div>'
        }<div style="text-align:center"><button class="link" data-a="review-end">Закончить</button></div></section>`;
    } else
      h0 += `<section class="card row-card"><div><b>${due.length ? `На сегодня: ${due.length}` : "На сегодня всё повторено"}</b><div class="muted small">Всего карточек: ${all.length}</div></div>${
        due.length ? `<button class="btn primary" data-a="review-start" data-v="${dk}">Повторить</button>` : ""
      }</section>`;
    h0 += `<section class="card"><div class="card-h"><h2>Новая карточка</h2><button class="link" data-a="bulk-toggle">${tt.bulkOpen ? "По одной" : "Много сразу"}</button></div>${
      tt.bulkOpen
        ? `<p class="hint top0" style="margin-bottom:8px">По одной паре на строку: <span class="mono">der Tag — день</span>. Можно вставить сразу 20 слов от учителя.</p><textarea id="bulk-text" data-keep rows="6" placeholder="der Tag — день&#10;die Nacht — ночь"></textarea><div class="btn-row"><button class="btn primary" data-a="bulk-add">Добавить все</button></div>`
        : `<form class="card-form" data-form="card"><input id="cf-front" data-keep placeholder="${"de" === dk ? "der Tag, die Tage" : "to procrastinate"}" aria-label="Слово" autocomplete="off"><input id="cf-back" data-keep placeholder="Перевод" aria-label="Перевод" autocomplete="off"><input id="cf-ex" data-keep placeholder="Пример (можно пусто)" aria-label="Пример" autocomplete="off"><button class="btn primary" type="submit">Добавить</button></form>`
    }</section>`;
    const list = all.sort((a0, b0) => (b0[1].created || 0) - (a0[1].created || 0)).slice(0, 60);
    list.length &&
      (h0 += `<section class="card"><div class="card-h"><h2>Карточки</h2><span class="mono muted small">${all.length}</span></div><ul class="cards-list">${list
        .map(([id, c0]) => {
          const cf = tt.confirm === "card:" + id;
          return `<li><span class="cl-f">${O(c0.front)}</span><span class="cl-b muted">${O(c0.back)}</span><span class="cl-box mono muted small" title="Ступень повторения">${"·".repeat(Math.min(8, c0.box || 0)) || "new"}</span><button class="x ${cf ? "confirm" : ""}" data-a="card-del" data-id="${O(id)}" aria-label="Удалить">${cf ? "?" : "×"}</button></li>`;
        })
        .join("")}</ul></section>`);
    return h0;
  }
  function moreView() {
    const up = Object.values(U.events).filter((e0) => e0 && e0.date >= j()).length,
      dueT = DECKS.reduce((a0, [d0]) => a0 + dueOf(d0).length, 0),
      wb = weekBalance(0),
      items = [
        ["tab", "week", w.week, "Неделя и отчёт", wb.debt >= 5 ? `долг ${A(wb.debt)} · отчёт для Claude` : "план и факт, отчёт для Claude"],
        ["tab", "goals", w.goals, "Цели и события", up ? `впереди: ${up}` : "олимпиады, контрольные, задачи"],
        ["tab", "words", w.words, "Слова", dueT ? `на сегодня: ${dueT}` : `карточек: ${Object.keys(U.cards).length}`],
        ["tab", "notes", w.notes, "Заметки", `заметок: ${Object.values(U.notes).filter(Boolean).length}`],
        ["go-sched", "", w.hw, "Расписание дня", "шаблоны дней, отдельные дни, время сна"],
        [
          "proj-new",
          "",
          w.flag,
          "Новый проект",
          (bt().projects.filter((p0) => !p0.done).length ? `активных: ${bt().projects.filter((p0) => !p0.done).length} · ` : "") + "разовое дело со сроком и шагами",
        ],
        ["cats-open", "", w.timer, "Темы таймера", `${t.length} тем, цели на неделю`],
        ["settings-open", "", w.gear, "Настройки", "привычки, минимум, игры, напоминания"],
      ];
    return `<section class="pagehead"><h1 class="display">Ещё</h1></section><div class="more-list">${items
      .map(([a0, v0, ic, n0, d0]) => `<button class="card more-item" data-a="${a0}" ${v0 ? `data-v="${v0}"` : ""}>${ic}<span><b>${O(n0)}</b><span class="muted small">${O(d0)}</span></span><span class="muted">›</span></button>`)
      .join("")}</div>`;
  }
  const pa = {
      today: function () {
        const a = new Date(),
          e = j(a),
          s = E(a),
          n = bt(),
          o = U.days[e] || ft(e),
          i = n.habits.filter((t) => hT(t, e) > 0),
          bad = !!o.bad,
          r = bad ? n.minimum.length : i.reduce((t, a) => t + hT(a, e), 0),
          c = bad
            ? n.minimum.filter((m) => o.min && o.min[m.id]).length
            : i.reduce((t, a) => t + Math.min((o.habits && o.habits[a.id]) || 0, hT(a, e)), 0),
          d = r ? c / r : 0,
          u = gt(),
          p = o.gamesMin || 0,
          b = 2 * Math.PI * 26;
        return `<section class="dayhead">\n      <div><div class="eyebrow">${O(
          F(a, { weekday: "long" }),
        )}</div>\n      <h1 class="display">${O(
          F(a, { day: "numeric", month: "long" }),
        )}</h1>\n      <div class="dayline"><span>Работа <b class="mono">${A(Jt(o))}</b></span><span>${bad ? "Минимум" : "Привычки"} <b class="mono">${c}/${r}</b></span><span>Игры <b class="mono ${p > u ? "bad-t" : ""}">${A(p)}</b></span></div></div>\n      <svg class="ring" viewBox="0 0 64 64" role="img" aria-label="Привычки выполнены на ${Math.round(100 * d)}%"><circle class="ring-bg" cx="32" cy="32" r="26"/><circle class="ring-fg" cx="32" cy="32" r="26" stroke-dasharray="${b.toFixed(2)}" stroke-dashoffset="${(b * (1 - d)).toFixed(2)}"/><text x="32" y="36.5" text-anchor="middle" class="ring-t">${Math.round(100 * d)}%</text></svg>\n    </section>\n    ${(function () {
          const t = j(),
            a = Object.values(U.events)
              .filter((a) => a && a.date >= t)
              .sort((t, a) => t.date.localeCompare(a.date))
              .slice(0, 4);
          return a.length
            ? `<div class="evstrip" aria-label="Ближайшие события">${a.map((t) => `<button class="evchip" style="--c:${l(t.type).color}" data-a="tab" data-v="goals" data-sub="events"><b>${O(G(P(t.date)))}</b><span>${O(t.title)}</span></button>`).join("")}</div>`
            : "";
        })()}\n    ${nowArea()}\n    ${nextArea()}\n    ${projectsArea()}\n    ${badArea(o)}\n    ${(function (t, a, e) {
          if (bad) return "";
          if (!t.length)
            return '<section class="card"><div class="card-h"><h2>Привычки</h2><button class="link" data-a="settings-open">Изменить</button></div><p class="hint">На сегодня привычек нет. Добавить их можно в настройках.</p></section>';
          const s = t
              .map((t) => {
                const s = hT(t, e),
                  n = Math.min((a.habits && a.habits[t.id]) || 0, s),
                  o = n >= s,
                  i =
                    s > 1
                      ? `<span class="dots" aria-hidden="true">${Array.from({ length: s }, (t, a) => `<i class="${a < n ? "on" : ""}"></i>`).join("")}</span>`
                      : "";
                return `<li><button class="habit ${o ? "done" : ""} ${n > 0 && !o ? "part" : ""}" data-a="habit-tap" data-id="${O(t.id)}" aria-pressed="${o}">\n      <span class="box">${w.check}</span><span class="hname">${O(t.name)}</span>${i}<span class="hcount mono">${n}/${s}</span></button></li>`;
              })
              .join(""),
            n = Xt();
          return `<section class="card"><div class="card-h"><h2>Привычки на сегодня</h2><button class="link" data-a="settings-open">Изменить</button></div><ul class="habits">${s}</ul>${n >= 2 ? `<p class="hint">Все привычки ${n} ${C(n, "день", "дня", "дней")} подряд.</p>` : ""}</section>`;
        })(i, o, e)}\n    ${todoArea(o)}${wordsDueArea()}\n    ${(function () {
          const t = mt();
          if (t.hidden) return "";
          const a = [
              [bt().timetable.some((t) => t.length), "Перенеси расписание уроков", "tt-open", "Заполнить"],
              [!!t.settings, "Проверь привычки, лимит игр и цели на неделю", "settings-open", "Открыть"],
              [Object.keys(U.events).length > 0, "Добавь даты олимпиад и контрольных", "go-events", "Добавить"],
              [
                Object.values(U.days).some((t) => t && (t.sessions || []).length),
                "Включи таймер, когда садишься заниматься",
                "go-timer",
                "К таймеру",
              ],
              ["installed" === aa() || !!t.install, "Установи блокнот на телефон", "install-help", "Как?"],
            ],
            e = a.filter((t) => t[0]).length;
          return e === a.length
            ? ""
            : `<section class="card"><div class="card-h"><h2>Первые шаги · ${e} из ${a.length}</h2><button class="link" data-a="onboard-hide">Скрыть</button></div>\n    <ul class="onb">${a.map(([t, a, e, s]) => `<li class="${t ? "done" : ""}"><span class="dot">${w.check}</span><span class="onb-t">${O(a)}</span>${t ? "" : `<button class="btn small" data-a="${e}">${s}</button>`}${t || "install-help" !== e ? "" : '<button class="btn small ghost" data-a="onboard-install">Готово</button>'}</li>`).join("")}</ul></section>`;
        })()}\n    ${(function (t, a) {
          const e = ht(),
            s = e && "games" === e.cat;
          let n, o;
          0 === a
            ? 0 === t
              ? ((n = "день без игр"), (o = "ok"))
              : ((n = "сегодня не по плану"), (o = "bad"))
            : t <= 0.75 * a
              ? ((n = "в норме"), (o = "ok"))
              : t <= a
                ? ((n = "почти лимит"), (o = "warn"))
                : ((n = `больше на ${A(t - a)}`), (o = "bad"));
          const i = a ? Math.min(100, (t / a) * 100) : t ? 100 : 0,
            l = (function () {
              const t = Object.keys(U.days);
              if (!t.length) return 0;
              const a = t.reduce((t, a) => (t < a ? t : a)),
                e = bt();
              let s = 0,
                n = new Date();
              for (let t = 0; t < 400; t++) {
                const t = j(n);
                if (t < a) break;
                if (((U.days[t] && U.days[t].gamesMin) || 0) > (e.gameLimit[E(n)] || 0)) break;
                (s++, (n = D(n, -1)));
              }
              return s;
            })();
          return `<section class="card"><div class="card-h"><h2>Игры сегодня</h2><span class="pill ${o}">${O(n)}</span></div>\n    <div class="g-row"><span class="mono g-big">${A(t)}</span><span class="muted">${a ? `лимит ${A(a)}` : "по плану сегодня не играешь"}</span></div>\n    <div class="gbar ${o}"><div style="width:${i}%"></div></div>\n    ${rewardHint()}${l >= 2 ? `<p class="hint">В лимите ${l} ${C(l, "день", "дня", "дней")} подряд. Не сбивай серию.</p>` : ""}\n    <div class="btn-row"><button class="btn" data-a="games-add" data-v="-30">−30 мин</button><button class="btn" data-a="games-add" data-v="30">+30 мин</button>${s ? "" : '<button class="btn ghost" data-a="timer-start" data-cat="games">Включить таймер игр</button>'}</div>\n  </section>`;
        })(p, u)}\n    ${(function () {
          const t = new Date(),
            a = j(t),
            e = D(t, 1),
            s = j(e),
            n = j(D(t, -7)),
            o = Object.entries(U.hw).filter(([, t]) => t && (t.text || "").trim() && !t.done),
            i = (t, a) =>
              t[1].date.localeCompare(a[1].date) ||
              (null == t[1].slot ? 99 : t[1].slot) - (null == a[1].slot ? 99 : a[1].slot),
            l = o.filter(([, t]) => t.date === a || t.date === s).sort(i),
            r = o.filter(([, t]) => t.date < a && t.date >= n).sort(i),
            c = bt().timetable.some((t) => t.length),
            d = qt(e).filter((t) => (t || "").trim());
          let u =
            '<section class="card"><div class="card-h"><h2>Домашка на сегодня и завтра</h2><button class="link" data-a="tab" data-v="hw">Дневник →</button></div>';
          return (
            c &&
              (u += `<div class="tomorrow">${d.length ? `Завтра <b>${d.length} ${C(d.length, "урок", "урока", "уроков")}</b>: ${O(d.join(", "))}` : "Завтра уроков нет"}</div>`),
            (u += l.length
              ? `<ul class="hw-list">${l.map(([t, a]) => la(t, a)).join("")}</ul>`
              : '<p class="hint">Ничего не горит. Записывай задание сразу, как его задали.</p>'),
            r.length &&
              ((u += `<div class="group" style="margin-top:10px"><button class="group-h toggle bad-t" data-a="overdue-toggle" aria-expanded="${tt.overdueOpen}">Не отмечено за неделю: ${r.length} ${tt.overdueOpen ? "▾" : "▸"}</button>`),
              tt.overdueOpen &&
                (u += `<ul class="hw-list">${r.map(([t, a]) => la(t, a)).join("")}</ul><div><button class="btn small" data-a="overdue-done">Отметить все прошлые сделанными</button></div>`),
              (u += "</div>")),
            u +
              ia("q") +
              '<p class="hint">Задание само встанет на ближайший урок этого предмета по расписанию.</p></section>'
          );
        })()}\n    ${(function (a) {
          const e = Yt(a),
            s = t.filter((t) => e[t.id] > 0).map((t) => [t, e[t.id]]);
          if (!s.length)
            return '<section class="card"><div class="card-h"><h2>Время работы сегодня</h2></div><p class="hint top0">Пока ноль. Включи таймер, и здесь будет видно, сколько ты реально поработал.</p></section>';
          const n = s.reduce((t, a) => t + a[1], 0),
            o = Math.max(...s.map((t) => t[1]));
          return `<section class="card"><div class="card-h"><h2>Время работы сегодня</h2><span class="mono strong">${A(n)}</span></div>\n    <ul class="bars">${s.map(([t, a]) => `<li><span>${O(t.short)}</span><span class="b-track"><span style="width:${(a / o) * 100}%;background:${t.color}"></span></span><span class="b-val mono">${A(a)}</span></li>`).join("")}</ul></section>`;
        })(
          o,
        )}\n    <section class="card"><div class="card-h"><h2>Заметка дня</h2></div><textarea id="day-note" data-input="day-note" data-key="${e}" rows="3" placeholder="Что получилось, что нет, что завтра сделать по-другому" aria-label="Заметка дня">${O(o.note || "")}</textarea></section>`;
      },
      hw: function () {
        if ("sched" === tt.hwView) return schedView();
        const t = X(),
          a = Qt(tt.diaryOffset),
          e = j(),
          s = bt().timetable.some((t) => t.length),
          n = a.filter((t, a) => {
            const e = j(t);
            return a < 6 || qt(t).length || Ct(e).length || Pt(e).length;
          });
        let o = 0;
        n.forEach((t) => {
          const a = j(t);
          a < e ||
            Ct(a).forEach((t) => {
              t.doc && (t.doc.text || "").trim() && !t.doc.done && o++;
            });
        });
        const i = "cloud" === J && j(a[6]) < j(D(new Date(), -120)),
          r = o ? `Осталось сделать: ${o}` : j(a[6]) < e ? "Неделя прошла" : "Всё сделано",
          c = ta(tt.diaryOffset);
        return `<section class="pagehead row"><div><h1 class="display">Дневник</h1><p class="muted">${O(r)}</p></div><button class="btn" data-a="tt-open">Расписание уроков</button></section>\n    ${hwSubnav()}\n    ${s ? "" : '<div class="notice">Сначала перенеси расписание уроков. Тогда у каждого дня появятся уроки, а домашку можно будет вписывать прямо напротив предмета.<div class="btn-row"><button class="btn primary" data-a="tt-open">Заполнить расписание</button></div></div>'}\n    <section class="card"><div class="card-h"><h2>Записать домашку</h2></div>${ia("d")}<p class="hint">Задание встанет на ближайший урок этого предмета. Можно и вписывать прямо в клетку дня.</p></section>\n    <div class="weeknav"><button class="btn" data-a="diary-prev" aria-label="Прошлая неделя">‹</button><div class="range">${O(Zt(a))}${c ? ` <span class="muted small">· ${c}</span>` : ""}</div><button class="btn" data-a="diary-next" aria-label="Следующая неделя">›</button></div>\n    ${tt.diaryOffset !== t ? '<div style="text-align:center"><button class="link" data-a="diary-now">К текущей неделе</button></div>' : ""}\n    ${i ? '<div class="notice">Домашка старше четырёх месяцев не загружается, поэтому здесь видно только расписание.</div>' : ""}\n    <div class="ddays">${n
          .map((a) =>
            (function (t, a) {
              const e = j(t),
                s = j(),
                n = Ct(e),
                o = Pt(e),
                i = n.filter((t) => t.doc && (t.doc.text || "").trim()),
                r = i.filter((t) => !t.doc.done).length,
                c = e < s,
                d = _() && tt.diaryOffset === a && c && !tt.expandedDays[e];
              let u = "";
              e === s
                ? (u = '<span class="pill acc">сегодня</span>')
                : r &&
                  (u = c
                    ? `<span class="pill mut">не отмечено: ${r}</span>`
                    : `<span class="pill">осталось: ${r}</span>`);
              const b = `<header class="dday-h"><span class="dday-wd">${p[E(t)]}</span><span class="dday-d mono">${O(F(t, { day: "numeric", month: "long" }))}</span>${u}</header>`,
                m = o.length
                  ? `<div class="dday-ev">${o
                      .map((t) => {
                        const a = l(t.type),
                          e = q(t.title).startsWith(q(a.name)) ? t.title : `${a.name}: ${t.title}`;
                        return `<span class="evtag" style="--c:${a.color}">${O(e)}</span>`;
                      })
                      .join("")}</div>`
                  : "";
              if (d) {
                const t = n.filter((t) => !t.extra).length;
                return `<article class="dday collapsed">${b}${m}<button class="dday-more" data-a="day-expand" data-date="${e}">${t} ${C(t, "урок", "урока", "уроков")} · заданий: ${i.length} · <b>показать</b></button></article>`;
              }
              return `<article class="dday ${e === s ? "today" : ""}">${b}${m}\n    ${
                n.length
                  ? `<table class="ltable"><thead><tr><th class="c-n">№</th><th class="c-s">Предмет</th><th class="c-t">Задание</th><th class="c-c"><span class="sr">Сделано</span></th><th class="c-g">Оц.</th></tr></thead><tbody>${n
                      .map((t) =>
                        (function (t, a) {
                          const e = a.doc || {},
                            s = e.text || "",
                            n = e.grade || "",
                            o = !!e.done,
                            i = O(a.subject),
                            l = `data-id="${O(a.id)}" data-date="${t}" data-slot="${null == a.slot ? "" : a.slot}" data-subj="${i}"`,
                            r = a.subject || "предмет";
                          let c;
                          c = a.extra
                            ? `<td class="c-s"><input class="l-subj-in" id="hws-${O(a.id)}" data-input="hw-subj" ${l} size="${Math.max(7, (a.subject || "").length + 1)}" value="${i}" placeholder="Предмет" list="subjects" aria-label="Предмет" autocomplete="off"></td>`
                            : a.subject
                              ? `<td class="c-s">${O(a.subject)}</td>`
                              : '<td class="c-s gap">окно</td>';
                          const d = tt.confirm === "hwd:" + a.id,
                            u =
                              !a.extra || s || d
                                ? d
                                  ? `<button class="x confirm" data-a="hw-del" data-id="${O(a.id)}" aria-label="Точно удалить">?</button>`
                                  : `<button class="check ${o ? "on" : ""}" data-a="hw-toggle" data-id="${O(a.id)}" aria-pressed="${o}" aria-label="Сделано: ${O(r)}" ${s.trim() ? "" : "disabled"}>${w.check}</button>`
                                : `<button class="x" data-a="hw-del" data-id="${O(a.id)}" aria-label="Убрать строку">×</button>`;
                          return `<tr class="${o ? "done" : ""}">\n    <td class="c-n">${null == a.slot ? "·" : a.slot + 1}</td>\n    ${c}\n    <td class="c-t"><textarea class="l-text" rows="1" id="hwt-${O(a.id)}" data-input="hw-text" ${l} placeholder="${a.extra ? "Задание" : ""}" aria-label="Задание: ${O(r)}">${O(s)}</textarea></td>\n    <td class="c-c">${u}</td>\n    <td class="c-g"><input class="l-grade" id="hwg-${O(a.id)}" data-input="hw-grade" ${l} value="${O(n)}" maxlength="5" inputmode="numeric" aria-label="Оценка: ${O(r)}" autocomplete="off"></td>\n  </tr>`;
                        })(e, t),
                      )
                      .join("")}</tbody></table>`
                  : '<p class="dday-empty">Уроков нет</p>'
              }\n    <div class="dday-f"><button class="link" data-a="hw-extra" data-date="${e}">+ задание</button>${_() && c && tt.expandedDays[e] ? `<button class="link" data-a="day-collapse" data-date="${e}">свернуть</button>` : ""}</div>\n  </article>`;
            })(a, t),
          )
          .join("")}</div>\n    ${(function () {
          const [t, a, e] = (function (t = new Date()) {
              const a = t.getFullYear(),
                e = t.getMonth();
              return 8 === e || 9 === e
                ? [new Date(a, 8, 1), new Date(a, 9, 31), "1-я четверть"]
                : e >= 10
                  ? [new Date(a, 10, 1), new Date(a, 11, 31), "2-я четверть"]
                  : e <= 2
                    ? [new Date(a, 0, 1), new Date(a, 2, 31), "3-я четверть"]
                    : [new Date(a, 3, 1), new Date(a, 7, 31), "4-я четверть"];
            })(),
            s = "quarter" === tt.gradeScope ? [j(t), j(a)] : null,
            n = (function (t) {
              const a = {},
                e = {};
              return (
                Object.values(U.hw)
                  .filter((a) => a && a.grade && (!t || (a.date >= t[0] && a.date <= t[1])))
                  .sort((t, a) => t.date.localeCompare(a.date))
                  .forEach((t) => {
                    const s = String(t.grade).match(/[1-5]/g);
                    if (!s) return;
                    const n = (t.subject || "").trim() || "Без предмета",
                      o = q(n);
                    ((e[o] = e[o] || n), (a[o] = a[o] || []).push(...s.map(Number)));
                  }),
                Object.keys(a)
                  .map((t) => [e[t], a[t].reduce((t, a) => t + a, 0) / a[t].length, a[t]])
                  .sort((t, a) => t[1] - a[1])
              );
            })(s),
            o = "cloud" === J ? "4 месяца" : "Всё время",
            i = s
              ? `${e}: ${F(t, { day: "numeric", month: "long" })} – ${F(a, { day: "numeric", month: "long" })}`
              : "cloud" === J
                ? "Все оценки за последние 4 месяца"
                : "Все оценки";
          return `<section class="card"><div class="card-h"><h2>Средний балл</h2><div class="seg small" role="group" aria-label="Период"><button class="${s ? "on" : ""}" data-a="grade-scope" data-v="quarter" aria-pressed="${!!s}">Четверть</button><button class="${s ? "" : "on"}" data-a="grade-scope" data-v="all" aria-pressed="${!s}">${o}</button></div></div>\n    <p class="hint top0" style="margin-bottom:6px">${O(i)}. Сначала предметы, где балл ниже всего.</p>\n    ${n.length ? `<ul class="grades">${n.map(([t, a, e]) => `<li><div class="g-top"><span class="g-s">${O(t)}</span><span class="g-a ${((t) => (t >= 4.5 ? "g-hi" : t >= 3.5 ? "g-mid" : "g-lo"))(a)}">${a.toFixed(2).replace(".", ",")}</span></div><div class="g-list" aria-label="Оценки">${e.slice(-18).join(" ")}</div></li>`).join("")}</ul>` : '<p class="hint top0">Вписывай оценки в колонку «Оц.», и здесь появится средний балл по каждому предмету.</p>'}\n  </section>`;
        })()}`;
      },
      timer: function () {
        const e = ht(),
          n = j(),
          o = U.days[n] || ft(n);
        let i = `<section class="pagehead row"><div><h1 class="display">Таймер</h1><p class="muted">Сегодня поработал: <b class="mono">${A(Jt(o))}</b></p></div><button class="btn" data-a="cats-open">Темы</button></section>`;
        if (e) i += oa(e, !0);
        else {
          tt.offerBreak &&
            (i +=
              '<div class="notice">Помидор сохранён. Сделай перерыв 5 минут: встань, попей воды, не открывай игры и ленту.<div class="btn-row"><button class="btn primary small" data-a="break-start">Перерыв 5 минут</button><button class="btn small" data-a="break-skip">Пропустить</button></div></div>');
          const e = "games" === tt.timerCat;
          i += `<section class="card timer-setup">\n      <div class="seg" role="group" aria-label="Режим">\n        <button class="${"sw" === tt.timerMode ? "on" : ""}" data-a="timer-mode" data-v="sw" aria-pressed="${"sw" === tt.timerMode}">Секундомер</button>\n        <button class="${"pomo" === tt.timerMode ? "on" : ""}" data-a="timer-mode" data-v="pomo" aria-pressed="${"pomo" === tt.timerMode}">Помидор</button>\n      </div>\n      ${"pomo" !== tt.timerMode || e ? "" : `<div class="chips">${[15, 25, 45, 50, 90].map((t) => `<button class="chip ${tt.pomoMin === t ? "on" : ""}" data-a="timer-pomo" data-v="${t}">${t} мин</button>`).join("")}</div>`}\n      <div class="lbl">Чем занимаешься</div>\n      <div class="chips">${t
            .concat([a])
            .map(
              (t) =>
                `<button class="chip ${tt.timerCat === t.id ? "on" : ""}" style="--c:${t.color}" data-a="timer-cat" data-v="${t.id}"><i></i>${O(t.short)}</button>`,
            )
            .join(
              "",
            )}</div>\n      <div class="clock mono idle">${"pomo" !== tt.timerMode || e ? "00:00" : x(tt.pomoMin) + ":00"}</div>\n      <button class="btn primary wide" data-a="timer-go">Старт</button>\n    </section>`;
        }
        ((i += ra(Qt(0), "Цели на эту неделю")),
          (i += `<section class="card"><div class="card-h"><h2>Забыл включить таймер?</h2></div>\n    <form class="manual" data-form="manual">\n      <select id="man-cat" data-keep aria-label="Чем занимался">${t
            .concat([a])
            .map((t) => `<option value="${t.id}">${O(t.name)}</option>`)
            .join(
              "",
            )}</select>\n      <input id="man-min" data-keep type="number" min="1" max="600" inputmode="numeric" placeholder="Минут" aria-label="Сколько минут">\n      <button class="btn" type="submit">Добавить</button>\n    </form></section>`));
        const l = (o.sessions || []).slice().sort((t, a) => a.start - t.start);
        return (
          (i += `<section class="card"><div class="card-h"><h2>Сессии сегодня</h2><span class="mono muted">${l.length}</span></div>\n    ${
            l.length
              ? `<ul class="sessions">${l
                  .map((t) => {
                    const a = s(t.cat),
                      e = new Date(t.start),
                      o = tt.confirm === "ses:" + t.id;
                    return `<li><span class="s-time mono">${x(e.getHours())}:${x(e.getMinutes())}</span><span class="cat-tag" style="--c:${a.color}"><i></i>${O(a.short)}</span><span class="mono">${A(t.sec / 60)}</span><button class="x ${o ? "confirm" : ""}" data-a="ses-del" data-key="${n}" data-id="${O(t.id)}" aria-label="Удалить сессию">${o ? "Удалить?" : "×"}</button></li>`;
                  })
                  .join("")}</ul>`
              : '<p class="hint top0">Сессий пока нет.</p>'
          }\n  </section>`),
          i
        );
      },
      goals: function () {
        const t = tt.goalsView,
          a =
            "progress" === t
              ? (function () {
                  const t = Object.entries(U.goals)
                      .filter(([, t]) => t)
                      .sort((t, a) => (t[1].created || 0) - (a[1].created || 0)),
                    a = new Set(t.map(([, t]) => q(t.title))),
                    e = d.map((t, a) => Object.assign({ i: a }, t)).filter((t) => !a.has(q(t.title))),
                    s = tt.goalForm;
                  return `${s ? `<section class="card"><div class="card-h"><h2>Новая цель</h2></div><form class="goal-form" data-form="goal" data-n="${s.n}">\n      <label>Название<input id="gf-title-${s.n}" data-keep value="${O(s.title || "")}" placeholder="Например: уроки «Кружка»" autocomplete="off"></label>\n      <label>Уже сделано<input id="gf-cur-${s.n}" data-keep type="number" min="0" inputmode="numeric" placeholder="0"></label>\n      <label>Всего<input id="gf-total-${s.n}" data-keep type="number" min="0" inputmode="numeric" value="${s.total || ""}" placeholder="—"></label>\n      <label>Чего<input id="gf-unit-${s.n}" data-keep value="${O(s.unit || "")}" placeholder="уроков" autocomplete="off"></label>\n      <div class="btn-row"><button class="btn primary" type="submit">Добавить</button><button class="btn ghost" type="button" data-a="goal-form-close">Отмена</button></div>\n    </form></section>` : '<button class="btn wide" data-a="goal-form-open">+ Новая цель</button>'}\n    ${
                    t.length
                      ? `<div class="goals">${t
                          .map(([t, a]) =>
                            (function (t, a) {
                              const e = a.current || 0,
                                s = a.total || 0,
                                n = a.unit || "";
                              if (tt.goalEdit === t)
                                return `<article class="card goal"><form class="goal-form" data-form="goal-edit" data-id="${O(t)}">\n      <label>Название<input id="ge-title-${O(t)}" data-keep value="${O(a.title)}" autocomplete="off"></label>\n      <label>Сейчас<input id="ge-cur-${O(t)}" data-keep type="number" min="0" inputmode="numeric" value="${e}"></label>\n      <label>Всего<input id="ge-total-${O(t)}" data-keep type="number" min="0" inputmode="numeric" value="${s || ""}" placeholder="—"></label>\n      <label>Чего<input id="ge-unit-${O(t)}" data-keep value="${O(n)}" autocomplete="off"></label>\n      <div class="btn-row"><button class="btn primary" type="submit">Сохранить</button><button class="btn ghost" type="button" data-a="goal-edit-close">Отмена</button></div>\n    </form></article>`;
                              const o = s > 0 && e >= s,
                                i = s > 0 ? Math.min(100, (e / s) * 100) : 0,
                                l = (function (t) {
                                  const a = t.log || {},
                                    e = Math.floor((Date.now() - (t.created || Date.now())) / 864e5) + 1,
                                    s = Math.max(1, Math.min(14, e));
                                  let n = 0;
                                  for (let t = 0; t < s; t++) n += Math.max(0, a[j(D(new Date(), -t))] || 0);
                                  return n / s;
                                })(a);
                              let r;
                              r = o
                                ? "Готово! Отличная работа."
                                : s > 0 && l > 0
                                  ? `Темп ≈ ${I(l)} в день. Закончишь примерно ${F(
                                      D(new Date(), Math.ceil((s - e) / l)),
                                      { day: "numeric", month: "long" },
                                    )}`
                                  : l > 0
                                    ? `Темп ≈ ${I(l)} в день`
                                    : "Темп появится, когда начнёшь отмечать";
                              const c = tt.confirm === "goal:" + t;
                              return `<article class="card goal ${o ? "complete" : ""}">\n    <div class="goal-top"><div class="goal-title">${O(a.title)}</div><div class="goal-num">${e}${s > 0 ? `<small> / ${s}</small>` : ""}${n ? `<small> ${O(n)}</small>` : ""}</div></div>\n    ${s > 0 ? `<div class="goal-bar"><div style="width:${i.toFixed(1)}%"></div></div>` : ""}\n    <div class="goal-row"><span class="goal-pace">${O(r)}</span>\n      <div class="btn-row" style="margin-top:0"><button class="btn small" data-a="goal-step" data-id="${O(t)}" data-v="-1" aria-label="Минус один">−1</button><button class="btn primary plus" data-a="goal-step" data-id="${O(t)}" data-v="1" aria-label="Плюс один">+1</button><button class="btn small ghost" data-a="goal-edit" data-id="${O(t)}">Изменить</button><button class="x ${c ? "confirm" : ""}" data-a="goal-del" data-id="${O(t)}" aria-label="Удалить цель">${c ? "Удалить?" : "×"}</button></div></div>\n  </article>`;
                            })(t, a),
                          )
                          .join("")}</div>`
                      : '<p class="empty">Здесь видно большие дела: сколько уроков «Кружка» пройдено, сколько заметок конспекта прочитано, сколько задач ТЮФ решено. По темпу видно, когда закончишь.</p>'
                  }\n    ${e.length && !s ? `<section class="card"><div class="card-h"><h2>Быстро добавить</h2></div><div class="chips">${e.map((t) => `<button class="chip" data-a="goal-sugg" data-v="${t.i}">+ ${O(t.title)}</button>`).join("")}</div></section>` : ""}`;
                })()
              : "problems" === t
                ? (function () {
                    const t = Object.entries(U.problems)
                        .filter(([, t]) => t)
                        .sort((t, a) => (a[1].created || 0) - (t[1].created || 0)),
                      a = j(Qt(0)[0]),
                      e = t.filter(([, t]) => t.date >= a),
                      s = (t) => e.filter(([, a]) => a.result === t).length,
                      n = j(D(new Date(), -30)),
                      i = {};
                    t.filter(([, t]) => t.date >= n).forEach(([, t]) => {
                      const a = (t.topic || "").trim() || "Без темы",
                        e = q(a);
                      ((i[e] = i[e] || { name: a, total: 0, ok: 0 }),
                        i[e].total++,
                        ("solved" !== t.result && "hint" !== t.result) || i[e].ok++);
                    });
                    const l = Object.values(i)
                        .sort((t, a) => a.total - t.total)
                        .slice(0, 8),
                      r = Math.max(1, ...l.map((t) => t.total)),
                      c = t.filter(([, t]) => t.revisit),
                      d = t.filter(([, t]) => "failed" === t.result),
                      u = tt.probFilter,
                      p = ("revisit" === u ? c : "failed" === u ? d : t).slice(0, 80),
                      b = tt.probResult;
                    return `<section class="card"><div class="card-h"><h2>Записать задачу</h2></div>\n    <form class="pr-form" data-form="problem">\n      <input id="pr-src" data-keep placeholder="Источник и номер: Савченко 2.1.15" aria-label="Источник и номер" autocomplete="off">\n      <input id="pr-topic" data-keep list="topics" placeholder="Тема" aria-label="Тема" autocomplete="off">\n      <input id="pr-min" data-keep type="number" min="0" max="600" inputmode="numeric" placeholder="Минут" aria-label="Сколько минут">\n      <div class="full seg" role="group" aria-label="Результат">${o.map((t) => `<button type="button" class="${b === t.id ? "on" : ""}" data-a="pr-result" data-v="${t.id}" aria-pressed="${b === t.id}">${t.name}</button>`).join("")}</div>\n      <div class="full pr-foot"><label class="chk"><input id="pr-rev" data-keep type="checkbox"> Вернуться к ней позже</label><button class="btn primary" type="submit">Записать</button></div>\n    </form></section>\n    <section class="card"><div class="card-h"><h2>Эта неделя</h2><span class="muted small">в журнале всего ${t.length}</span></div>\n      <div class="pr-tiles"><div class="pr-tile"><b class="good-t">${s("solved")}</b><span>сам</span></div><div class="pr-tile"><b style="color:var(--warn)">${s("hint")}</b><span>с подсказкой</span></div><div class="pr-tile"><b class="bad-t">${s("failed")}</b><span>не решил</span></div><div class="pr-tile"><b style="color:var(--info)">${s("read")}</b><span>разобрал</span></div></div>\n      ${
                      l.length
                        ? `<p class="lbl" style="margin:16px 0 8px">Темы за месяц: решено из попыток</p><ul class="bars">${l
                            .map((t) => {
                              const a = (t.ok / t.total) * 100;
                              return `<li><span>${O(t.name)}</span><span class="b-track"><span style="width:${((t.total / r) * 100).toFixed(1)}%;background:linear-gradient(90deg, var(--good) ${a.toFixed(1)}%, color-mix(in srgb, var(--bad) 35%, var(--card)) ${a.toFixed(1)}%)"></span></span><span class="b-val mono">${t.ok}/${t.total}</span></li>`;
                            })
                            .join("")}</ul>`
                        : ""
                    }\n    </section>\n    <section class="card"><div class="card-h"><h2>Журнал</h2></div><div class="seg small pr-filter" role="group" aria-label="Фильтр">${[
                      ["all", `Все · ${t.length}`],
                      ["revisit", `Вернуться · ${c.length}`],
                      ["failed", `Не решил · ${d.length}`],
                    ]
                      .map(
                        ([t, a]) =>
                          `<button class="${u === t ? "on" : ""}" data-a="pr-filter" data-v="${t}" aria-pressed="${u === t}">${a}</button>`,
                      )
                      .join("")}</div>\n      ${
                      p.length
                        ? `<ul class="pr-list">${p
                            .map(([t, a]) =>
                              (function (t, a) {
                                const e = ((t) => o.find((a) => a.id === t) || o[0])(a.result),
                                  s = tt.confirm === "pr:" + t;
                                return `<li><span class="pr-date">${O(
                                  F(M(a.date), { day: "2-digit", month: "2-digit" }),
                                )}</span><div><div class="pr-src">${O(a.source || "Без названия")}</div><div class="pr-topic">${O(a.topic || "без темы")}${a.minutes ? ` · ${A(a.minutes)}` : ""}</div></div><button class="res ${e.cls}" data-a="pr-cycle" data-id="${O(t)}" title="Нажми, чтобы сменить результат" style="border:0;cursor:pointer">${O(e.short)}</button><button class="flag ${a.revisit ? "on" : ""}" data-a="pr-flag" data-id="${O(t)}" aria-pressed="${!!a.revisit}" aria-label="Вернуться позже">${w.flag}</button><button class="x ${s ? "confirm" : ""}" data-a="pr-del" data-id="${O(t)}" aria-label="Удалить задачу">${s ? "?" : "×"}</button></li>`;
                              })(t, a),
                            )
                            .join("")}</ul>`
                        : `<p class="hint top0">${"all" === u ? "Записывай каждую задачу, решённую и нерешённую. Так видно, какие темы проседают и к чему стоит вернуться перед олимпиадой." : "Здесь пока пусто."}</p>`
                    }\n    </section>`;
                  })()
                : (function () {
                    const t = j(),
                      a = Object.entries(U.events)
                        .filter(([, t]) => t && t.date)
                        .sort((t, a) => t[1].date.localeCompare(a[1].date)),
                      e = a.filter(([, a]) => a.date >= t),
                      s = a.filter(([, a]) => a.date < t).reverse(),
                      n = ([t, a], e) => {
                        const s = P(a.date),
                          n = l(a.type),
                          o = tt.confirm === "ev:" + t,
                          i = M(a.date),
                          r = e
                            ? '<b class="word">прошло</b>'
                            : 0 === s
                              ? '<b class="word">сегодня</b>'
                              : 1 === s
                                ? '<b class="word">завтра</b>'
                                : `<b>${s}</b><span>${C(s, "день", "дня", "дней")}</span>`,
                          c = { weekday: "short", day: "numeric", month: "long" };
                        return (
                          i.getFullYear() !== new Date().getFullYear() && (c.year = "numeric"),
                          `<article class="card evcard ${e ? "past" : ""}" style="--c:${n.color}"><div class="ev-count">${r}</div><div><div class="ev-title">${O(a.title)}</div><div class="ev-meta">${O(n.name)} · ${O(F(i, c))}</div></div><button class="x ${o ? "confirm" : ""}" data-a="ev-del" data-id="${O(t)}" aria-label="Удалить событие">${o ? "Удалить?" : "×"}</button></article>`
                        );
                      };
                    return `<section class="card"><div class="card-h"><h2>Добавить событие</h2></div>\n    <form class="ev-form" data-form="event">\n      <input id="ev-title" data-keep placeholder="Например: региональный этап ВсОШ" aria-label="Что будет" autocomplete="off">\n      <input id="ev-date" data-keep type="date" value="${j(D(new Date(), 7))}" aria-label="Дата">\n      <select id="ev-type" data-keep aria-label="Тип">${i.map((t) => `<option value="${t.id}">${t.name}</option>`).join("")}</select>\n      <button class="btn primary" type="submit">Добавить</button>\n    </form></section>\n    ${e.length ? `<div class="evlist">${e.map((t) => n(t, !1)).join("")}</div>` : '<p class="empty">Добавь даты олимпиад (этапы ВсОШ, МОШ, «Физтех», «Росатом»), контрольных и дедлайнов ТЮФ. Здесь будет обратный отсчёт, а ближайшие события появятся на главной.</p>'}\n    ${s.length ? `<section class="group"><button class="group-h toggle" data-a="past-toggle" aria-expanded="${tt.showPastEvents}">Прошедшие <span class="mono muted">${s.length}</span> ${tt.showPastEvents ? "▾" : "▸"}</button>${tt.showPastEvents ? `<div class="evlist">${s.map((t) => n(t, !0)).join("")}</div>` : ""}</section>` : ""}`;
                  })();
        return `<section class="pagehead">${backLink()}<h1 class="display">Цели</h1></section>\n    <div class="subnav" role="group" aria-label="Раздел">${[
          ["events", "События"],
          ["progress", "Прогресс"],
          ["problems", "Задачи"],
        ]
          .map(
            ([a, e]) =>
              `<button class="${t === a ? "on" : ""}" data-a="goals-view" data-v="${a}" aria-pressed="${t === a}">${e}</button>`,
          )
          .join("")}</div>\n    ${a}`;
      },
      week: function () {
        const a = Qt(tt.weekOffset),
          e = j(),
          s = bt();
        let n = 0,
          o = 0,
          i = 0,
          l = 0,
          r = 0,
          c = 0;
        const d = {};
        a.forEach((t) => {
          const a = j(t),
            u = U.days[a],
            p = Yt(u);
          if (
            (Object.keys(p).forEach((t) => {
              ((d[t] = (d[t] || 0) + p[t]), (n += p[t]));
            }),
            a <= e)
          ) {
            (c++, (o += (u && u.gamesMin) || 0), (i += s.gameLimit[E(t)] || 0));
            const a = Kt(u, t);
            null !== a && ((l += a), r++);
          }
        });
        const p = c ? n / c : 0,
          b = t.filter((t) => d[t.id] > 0).sort((t, a) => d[a.id] - d[t.id]),
          m = ta(tt.weekOffset);
        return `<section class="pagehead">${backLink()}<h1 class="display">Неделя</h1></section>\n    <div class="weeknav"><button class="btn" data-a="week-prev" aria-label="Прошлая неделя">‹</button><div class="range">${O(Zt(a))}${m ? ` <span class="muted small">· ${m}</span>` : ""}</div><button class="btn" data-a="week-next" aria-label="Следующая неделя" ${tt.weekOffset >= 0 ? "disabled" : ""}>›</button></div>\n    <div class="tiles">\n      <div class="tile"><span class="t-l">Работа за неделю</span><span class="t-v mono">${S(n)}<small> ч</small></span></div>\n      <div class="tile"><span class="t-l">В среднем за день</span><span class="t-v mono">${S(p)}<small> ч</small></span></div>\n      <div class="tile"><span class="t-l">Привычки выполнены</span><span class="t-v mono">${r ? Math.round((l / r) * 100) : 0}<small>%</small></span></div>\n      <div class="tile ${o > i ? "bad" : ""}"><span class="t-l">Игры / лимит</span><span class="t-v mono">${S(o)}<small> / ${S(i)}</small></span></div>\n      <div class="tile"><span class="t-l">Дней подряд все привычки</span><span class="t-v mono">${Xt()}</span></div>\n    </div>\n    ${weekExtras()}\n    ${ra(a, 0 === tt.weekOffset ? "Цели на эту неделю" : "Цели на неделю")}\n    <section class="card"><div class="card-h"><h2>Сколько работал по дням</h2></div>${(function (
          a,
        ) {
          const e = j(),
            s = a.map((t) => {
              const a = j(t),
                e = U.days[a];
              return { d: t, k: a, cats: Yt(e), total: Jt(e) };
            }),
            n = Math.max(60, ...s.map((t) => t.total)) / 60,
            o = n <= 4 ? 1 : n <= 8 ? 2 : n <= 16 ? 4 : 6,
            i = Math.ceil(n / o) * o,
            l = 60 * i,
            r = (t) => 24 + 184 * (1 - t / l);
          let c = '<svg class="chart" viewBox="0 0 700 250" role="img" aria-label="Время работы по дням недели">';
          for (let t = 0; t <= i; t += o) {
            const a = r(60 * t).toFixed(1);
            c += `<line class="${0 === t ? "gl0" : "gl"}" x1="46" x2="692" y1="${a}" y2="${a}"/><text x="38" y="${(+a + 4).toFixed(1)}" text-anchor="end">${t} ч</text>`;
          }
          const d = 646 / 7,
            p = Math.min(46, 0.58 * d);
          return (
            s.forEach((a, s) => {
              const n = 46 + d * s + d / 2;
              let o = 0;
              (t.forEach((t) => {
                const e = a.cats[t.id] || 0;
                if (e <= 0) return;
                const s = r(o + e),
                  i = r(o);
                ((c += `<rect x="${(n - p / 2).toFixed(1)}" y="${s.toFixed(1)}" width="${p.toFixed(1)}" height="${Math.max(0, i - s).toFixed(1)}" fill="${t.color}"><title>${O(t.name)}: ${A(e)}</title></rect>`),
                  (o += e));
              }),
                a.total > 0 &&
                  (c += `<text class="tot" x="${n.toFixed(1)}" y="${(r(a.total) - 7).toFixed(1)}" text-anchor="middle">${S(a.total)}</text>`));
              const i = a.k === e ? "today" : "";
              c += `<text class="${i}" x="${n.toFixed(1)}" y="226" text-anchor="middle">${u[s]}</text><text class="${i}" x="${n.toFixed(1)}" y="242" text-anchor="middle">${a.d.getDate()}</text>`;
            }),
            c + "</svg>"
          );
        })(
          a,
        )}\n      ${b.length ? `<ul class="legend">${b.map((t) => `<li><i style="background:${t.color}"></i><span class="nm">${O(t.name)}</span><span class="mono">${A(d[t.id])}</span></li>`).join("")}</ul>` : '<p class="hint">За эту неделю таймер ещё не запускался.</p>'}\n    </section>\n    ${(function (
          t,
        ) {
          const a = Qt(t)[0],
            e = D(a, -105),
            s = j();
          let n = "",
            o = 0,
            i = 0,
            l = null,
            r = 0,
            c = -1;
          for (let t = 0; t < 16; t++) {
            const a = D(e, 7 * t);
            a.getMonth() !== c &&
              ((c = a.getMonth()),
              t < 15 &&
                (n += `<text x="${24 + 16 * t}" y="10">${O(F(a, { month: "short" }).replace(".", ""))}</text>`));
            for (let e = 0; e < 7; e++) {
              const c = D(a, e),
                d = j(c);
              if (d > s) continue;
              const u = Jt(U.days[d]);
              ((o += u),
                u > 0 && r++,
                u > i && ((i = u), (l = d)),
                (n += `<rect x="${24 + 16 * t}" y="${16 + 16 * e}" width="13" height="13" rx="3" class="l${u <= 0 ? 0 : u < 30 ? 1 : u < 60 ? 2 : u < 120 ? 3 : u < 180 ? 4 : 5}${d === s ? " tdy" : ""}"><title>${O(
                  F(c, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  }),
                )}: ${u ? A(u) : "нет работы"}</title></rect>`));
            }
          }
          return (
            ["пн", "ср", "пт"].forEach((t, a) => {
              n += `<text x="0" y="${16 + 2 * a * 16 + 10}">${t}</text>`;
            }),
            `<section class="card"><div class="card-h"><h2>Последние 16 недель</h2></div>\n    <svg class="heat" viewBox="0 0 280 128" role="img" aria-label="Сколько работал каждый день за 16 недель">${n}</svg>\n    <div class="heat-foot"><span>Всего ${A(o)} · дней с работой: ${r}${
              l ? ` · лучший день ${O(((d = l), F(M(d), { day: "numeric", month: "short" })))}: ${A(i)}` : ""
            }</span>\n    <span class="heat-legend">меньше <svg class="heat" viewBox="0 0 84 12" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map((t) => `<rect x="${14 * t}" y="0" width="12" height="12" rx="3" class="l${t}"/>`).join("")}</svg> больше</span></div></section>`
          );
          var d;
        })(
          tt.weekOffset,
        )}\n    <section class="card"><div class="card-h"><h2>Привычки по дням</h2></div><div class="scroll-x"><table class="hgrid">\n      <thead><tr><th></th>${a.map((t, a) => `<th class="${j(t) === e ? "today" : ""}">${u[a]}<br><span class="mono">${t.getDate()}</span></th>`).join("")}</tr></thead>\n      <tbody>${s.habits
          .map(
            (t) =>
              `<tr><th scope="row">${O(t.name)}</th>${a
                .map((a) => {
                  const s = j(a),
                    n = hT(t, s);
                  if (!n) return '<td><span class="c na" title="не по плану">·</span></td>';
                  if (s > e) return '<td><span class="c fut"></span></td>';
                  const o = Math.min((U.days[s] && U.days[s].habits && U.days[s].habits[t.id]) || 0, n);
                  return `<td><span class="c ${o >= n ? "full" : o > 0 ? "part" : "miss"}" title="${o}/${n}"></span></td>`;
                })
                .join("")}</tr>`,
          )
          .join("")}\n      <tr><th scope="row">Игры, мин</th>${a
          .map((t) => {
            const a = j(t);
            if (a > e) return "<td></td>";
            const n = (U.days[a] && U.days[a].gamesMin) || 0;
            return `<td class="mono ${n > (s.gameLimit[E(t)] || 0) ? "bad-t" : "muted"}">${n}</td>`;
          })
          .join("")}</tr></tbody></table></div></section>\n    ${(function (t) {
          const a = U.weeks[t] || {};
          return `<section class="card"><div class="card-h"><h2>Итоги недели</h2></div><div class="review">\n    <label for="wr-good-${t}">Что получилось<textarea id="wr-good-${t}" rows="3" data-input="week-good" data-key="${t}" placeholder="Например: пять будних дней без игр, решил 12 задач">${O(a.good || "")}</textarea></label>\n    <label for="wr-imp-${t}">Что улучшить на следующей неделе<textarea id="wr-imp-${t}" rows="3" data-input="week-improve" data-key="${t}" placeholder="Например: ложиться до 23:00, не пропускать ТЮФ">${O(a.improve || "")}</textarea></label>\n  </div></section>`;
        })(j(a[0]))}`;
      },
      books: function () {
        return `<section class="pagehead"><h1 class="display">Книги</h1></section>` + (function () {
                const t = Object.entries(U.books).filter(([, t]) => t),
                  a = (a) =>
                    t
                      .filter((t) => (t[1].status || "plan") === a)
                      .sort((t, a) => (a[1].created || 0) - (t[1].created || 0)),
                  e = new Set(t.map((t) => q(t[1].title))),
                  s = c.map((t, a) => Object.assign({ i: a }, t)).filter((t) => !e.has(q(t.title)));
                let n = `<p class="muted" style="padding:0 2px">Читаю: ${a("reading").length} · В планах: ${a("plan").length} · Прочитано: ${a("done").length}</p>`;
                return (
                  (n += tt.bookForm
                    ? '<section class="card"><form class="book-form" data-form="book">\n        <input id="bk-title" data-keep placeholder="Название" aria-label="Название" autocomplete="off">\n        <input id="bk-author" data-keep placeholder="Автор" aria-label="Автор" autocomplete="off">\n        <input id="bk-pages" data-keep type="number" min="0" inputmode="numeric" placeholder="Страниц" aria-label="Страниц в книге">\n        <select id="bk-status" data-keep aria-label="Статус"><option value="reading">Читаю</option><option value="plan">В планах</option></select>\n        <div class="btn-row"><button class="btn primary" type="submit">Добавить</button><button class="btn ghost" type="button" data-a="book-form">Отмена</button></div>\n      </form></section>'
                    : '<button class="btn wide" data-a="book-form">+ Добавить книгу</button>'),
                  [
                    ["reading", "Читаю сейчас"],
                    ["plan", "В планах"],
                    ["done", "Прочитано"],
                  ].forEach(([t, e]) => {
                    const s = a(t);
                    s.length &&
                      (n += `<section class="group"><h2 class="group-h">${e} <span class="mono muted">${s.length}</span></h2><div class="books">${s
                        .map(([t, a]) =>
                          (function (t, a) {
                            const e = a.pages || 0,
                              s = a.page || 0,
                              n = e ? Math.min(100, (s / e) * 100) : 0,
                              o = tt.confirm === "book:" + t;
                            let i = "";
                            return (
                              "plan" !== a.status && e
                                ? (i = `<label class="b-page" for="bp-${O(t)}">стр. <input id="bp-${O(t)}" class="mono" type="number" min="0" max="${e}" value="${s}" inputmode="numeric" data-change="book-page" data-id="${O(t)}"> из ${e}</label>`)
                                : "reading" === a.status &&
                                  (i = `<label class="b-page" for="bpt-${O(t)}">страниц в книге <input id="bpt-${O(t)}" class="mono" type="number" min="0" inputmode="numeric" placeholder="?" data-change="book-pages" data-id="${O(t)}"></label>`),
                              `<article class="card book">\n    <div class="b-top"><div><div class="b-title">${O(a.title)}</div><div class="muted small">${O(a.author || "")}</div></div><button class="x ${o ? "confirm" : ""}" data-a="book-del" data-id="${O(t)}" aria-label="Удалить книгу">${o ? "Удалить?" : "×"}</button></div>\n    ${"reading" === a.status && e ? `<div class="b-prog"><div style="width:${n}%"></div></div>` : ""}\n    <div class="b-row">${i || "<span></span>"}<div class="seg small" role="group" aria-label="Статус">${[
                                ["plan", "В планах"],
                                ["reading", "Читаю"],
                                ["done", "Прочитал"],
                              ]
                                .map(
                                  ([e, s]) =>
                                    `<button class="${a.status === e ? "on" : ""}" data-a="book-status" data-id="${O(t)}" data-v="${e}" aria-pressed="${a.status === e}">${s}</button>`,
                                )
                                .join("")}</div></div>\n  </article>`
                            );
                          })(t, a),
                        )
                        .join("")}</div></section>`);
                  }),
                  s.length &&
                    (n += `<section class="group"><h2 class="group-h">С чего начать</h2><div class="card"><ul class="sugg">${s.map((t) => `<li><div><div class="b-title">${O(t.title)}</div><div class="muted small">${O(t.author)}: ${O(t.why)}</div></div><button class="btn small" data-a="book-sugg" data-v="${t.i}">В планы</button></li>`).join("")}</ul></div></section>`),
                  n
                );
              })();
      },
      more: moreView,
      words: wordsView,
      notes: function () {
        const t = tt.noteId && U.notes[tt.noteId];
        if (t) {
          const a = tt.confirm === "note:" + tt.noteId;
          return `<section class="note-ed">\n      <div class="ne-bar"><button class="btn ghost" data-a="note-back">← Все заметки</button><span class="muted small grow">изменено ${O(
            F(new Date(t.updated || t.created || Date.now()), {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
          )}</span><button class="btn ghost small" data-a="note-pin">${t.pinned ? "Открепить" : "Закрепить"}</button><button class="btn ghost small ${a ? "danger" : ""}" data-a="note-del">${a ? "Точно удалить?" : "Удалить"}</button></div>\n      <input id="note-title" class="ne-title display" data-input="note-title" value="${O(t.title)}" placeholder="Название" aria-label="Название заметки" autocomplete="off">\n      <textarea id="note-body" class="ne-body" data-input="note-body" placeholder="Мысли, планы, выписки из книг, идеи для ТЮФ" aria-label="Текст заметки">${O(t.body)}</textarea>\n    </section>`;
        }
        return `<section class="pagehead">${backLink()}<h1 class="display">Заметки</h1></section>\n    ${`<div class="btn-row" style="margin-top:0;align-items:center"><input id="note-search" class="search" style="flex:1" data-input="note-search" value="${O(tt.noteSearch)}" placeholder="Поиск по заметкам" aria-label="Поиск по заметкам" autocomplete="off"><button class="btn primary" data-a="note-new">+ Новая</button></div>\n    <div id="note-results">${ca()}</div>`
        }`;
      },
    },
    ba = k("root");
  let ma = !1,
    ha = !1;
  function ga(t) {
    ((t.style.height = "auto"), (t.style.height = t.scrollHeight + "px"));
  }
  function fa() {
    const t = document.activeElement;
    return !(
      !t ||
      !ba.contains(t) ||
      ("TEXTAREA" !== t.tagName &&
        ("INPUT" !== t.tagName || ["checkbox", "radio", "button", "submit", "file"].includes(t.type)))
    );
  }
  function va() {
    fa()
      ? (ha = !0)
      : ma ||
        ((ma = !0),
        requestAnimationFrame(() => {
          ((ma = !1), $a());
        }));
  }
  function $a() {
    ha = !1;
    maybeMigrate();
    bt();
    const t = document.activeElement,
      a = t && t.id && ba.contains(t) ? t.id : null;
    let e = null,
      n = null;
    try {
      a && "number" == typeof t.selectionStart && ((e = t.selectionStart), (n = t.selectionEnd));
    } catch (t) {}
    const o = {};
    ba.querySelectorAll("[data-keep]").forEach((t) => {
      t.id && (o[t.id] = "checkbox" === t.type ? t.checked : t.value);
    });
    const i = (ba.querySelector(".modal") || {}).scrollTop || 0,
      [l, r] =
        "local" === J
          ? ["warn", "Только на этом устройстве"]
          : "fberror" === J || "cfgerror" === J
            ? ["bad", "Нет синхронизации"]
            : "signin" === J
              ? ["", "Нужно войти"]
              : "cloud" !== J || (!vt() && !Y)
                ? ["", "Загрузка…"]
                : Y
                  ? ["bad", "Ошибка синхронизации"]
                  : navigator.onLine
                    ? ["ok", "Синхронизировано"]
                    : ["warn", "Офлайн, сохранится позже"],
      c = ht(),
      d = vt(),
      u = ("cloud" === J && d) || "local" === J;
    let p = `<header class="top"><div class="brand"><span class="logo">Блокнот</span><span class="sync ${l ? "s-" + l : ""}"><i></i>${O(r)}</span></div>${u ? `<button class="icon-btn" data-a="settings-open" aria-label="Настройки">${w.gear}</button>` : ""}</header>`;
    if ("signin" === J)
      p += (function () {
        const t = z() && H();
        return `<div class="auth"><div class="card auth-card">\n    <span class="logo">Блокнот</span>\n    <p class="muted">Войди, и домашка, привычки, таймер и заметки будут одинаковыми на телефоне и компьютере.</p>\n    <button class="btn wide google" data-a="auth-google" ${tt.authBusy ? "disabled" : ""}>${w.google}Войти через Google</button>\n    ${t ? '<p class="hint top0">В установленном приложении на iPhone вход через Google иногда не открывается. Если так, войди по почте.</p>' : ""}\n    <div class="or">или по почте</div>\n    <form class="auth-form" data-form="auth">\n      <input id="au-email" data-keep type="email" autocomplete="email" placeholder="Почта" aria-label="Почта">\n      <input id="au-pass" data-keep type="password" autocomplete="current-password" placeholder="Пароль, от 6 символов" aria-label="Пароль">\n      <div class="btn-row"><button class="btn primary" type="submit" ${tt.authBusy ? "disabled" : ""}>Войти</button><button class="btn" type="button" data-a="auth-signup" ${tt.authBusy ? "disabled" : ""}>Создать аккаунт</button></div>\n      <div><button class="link" type="button" data-a="auth-reset">Забыл пароль</button></div>\n    </form>\n    ${tt.authError ? `<p class="auth-err" role="alert">${O(tt.authError)}</p>` : ""}\n  </div></div>`;
      })();
    else if ("fberror" === J)
      p +=
        '<div class="auth"><div class="card auth-card"><span class="logo">Блокнот</span>\n    <p>Не получилось загрузить Firebase. Проверь интернет и обнови страницу.</p>\n    <p class="muted small">Если ошибка повторяется, проверь, что в config.js вставлены настройки из Firebase целиком.</p>\n    <div class="btn-row"><button class="btn primary" data-a="reload">Обновить</button></div></div></div>';
    else if ("cfgerror" === J)
      p += `<div class="auth"><div class="card auth-card"><span class="logo">Блокнот</span>\n    <p>В файле <b>config.js</b> ошибка, поэтому синхронизация не включилась.</p>\n    <p class="muted small">${O(Ra)}</p>\n    <p class="small">Открой config.js на GitHub, нажми карандаш и вставь блок из Firebase заново: от строки <b>const firebaseConfig = {</b> до <b>};</b>, старый блок сотри целиком.</p>\n    <div class="btn-row"><button class="btn primary" data-a="reload">Обновить</button></div></div></div>`;
    else if ("cloud" === J && Y && !d)
      p += `<div class="auth"><div class="card auth-card"><span class="logo">Блокнот</span>\n    <p>${O(sa(Y))}</p>\n    <div class="btn-row"><button class="btn primary" data-a="retry-sync">Повторить</button><button class="btn" data-a="auth-signout">Выйти</button></div></div></div>`;
    else if (d) {
      if (
        ((p += `<nav class="tabs" aria-label="Разделы">${b.map(([t, a]) => { const on = (MORE_VIEWS.includes(Z) ? "more" : Z) === t; return `<button class="tab ${on ? "on" : ""}" data-a="tab" data-v="${t}" ${on ? 'aria-current="page"' : ""}>${w[t]}<span>${a}</span></button>`; }).join("")}</nav>`),
        (p += `<main class="view">${"cloud" === J && Y ? `<div class="notice bad" role="alert">${O(sa(Y))}<div class="btn-row"><button class="btn small" data-a="retry-sync">Повторить</button></div></div>` : ""}${"local" !== J || "today" !== Z ? "" : '<div class="notice">Синхронизация пока не подключена, поэтому данные хранятся только на этом устройстве. Чтобы блокнот был одинаковым на телефоне и компьютере, впиши настройки Firebase в файл <b>config.js</b>.</div>'}${na(pa[Z])}</main>`),
        c && "timer" !== Z && "today" !== Z && !tt.focus)
      ) {
        const t = s(c.cat);
        p += `<button class="float-timer" style="--c:${t.color}" data-a="tab" data-v="timer"><i></i>${O(t.short)} <b class="mono js-elapsed">00:00</b></button>`;
      }
      (tt.settingsOpen && tt.settingsDraft && (p += na(da)),
        tt.ttOpen && tt.ttDraft && (p += na(ua)),
        tt.catsOpen && tt.catsDraft && (p += na(catsModal)),
        tt.schedOpen && tt.schedDraft && (p += na(schedModal)),
        tt.projOpen && tt.projDraft && (p += na(projModal)),
        tt.focus && c && (p += na(focusOverlay)));
    } else p += '<p class="loading">Загружаю твои данные…</p>';
    (ba.classList.toggle("wide", "hw" === Z && d),
      (ba.innerHTML = p),
      Object.keys(o).forEach((t) => {
        const a = k(t);
        a && ("checkbox" === a.type ? (a.checked = o[t]) : (a.value = o[t]));
      }),
      ba.querySelectorAll("textarea.l-text").forEach(ga));
    const m = ba.querySelector(".modal");
    if ((m && i && (m.scrollTop = i), a)) {
      const t = k(a);
      if (t) {
        try {
          t.focus({ preventScroll: !0 });
        } catch (a) {
          t.focus();
        }
        try {
          null != e && t.setSelectionRange(e, n);
        } catch (t) {}
      }
    }
    Ma();
    updateBadge();
    document.body.classList.toggle("focus-on", !!(tt.focus && c));
  }
  let ya = null,
    wa = null,
    ka = null;
  function xa() {
    try {
      if (!ya || "running" !== ya.state) return;
      const t = ya.currentTime;
      [0, 0.28, 0.56].forEach((a) => {
        const e = ya.createOscillator(),
          s = ya.createGain();
        ((e.type = "sine"),
          (e.frequency.value = 880),
          s.gain.setValueAtTime(1e-4, t + a),
          s.gain.exponentialRampToValueAtTime(0.22, t + a + 0.02),
          s.gain.exponentialRampToValueAtTime(1e-4, t + a + 0.22),
          e.connect(s),
          s.connect(ya.destination),
          e.start(t + a),
          e.stop(t + a + 0.24));
      });
    } catch (t) {}
  }
  function ja(t, a) {
    try {
      if ("1" !== R($) || !("Notification" in window) || "granted" !== Notification.permission || !document.hidden)
        return;
      const e = { body: a, icon: "icon-192.png", tag: "bloknot" };
      navigator.serviceWorker && navigator.serviceWorker.getRegistration
        ? navigator.serviceWorker
            .getRegistration()
            .then((a) => {
              a ? a.showNotification(t, e) : new Notification(t, e);
            })
            .catch(() => {})
        : new Notification(t, e);
    } catch (t) {}
  }
  function Ma() {
    const t = ht();
    if (!t) return void (document.title !== g && (document.title = g));
    const a = tel(t);
    let e,
      n = !1;
    if ("pomo" === t.mode) {
      const s = 60 * t.targetMin - a;
      s >= 0 ? (e = L(s)) : ((e = "+" + L(-s)), (n = !0));
    } else e = L(a);
    ba.querySelectorAll(".js-elapsed").forEach((t) => {
      ((t.textContent = e), t.classList.toggle("over", n));
    });
    const o = "pomo" === t.mode ? Math.min(1, a / (60 * t.targetMin)) : (a % 3600) / 3600;
    ba.querySelectorAll(".js-ring").forEach((r0) => {
      const c0 = parseFloat(r0.dataset.c) || 0,
        it = t.blk ? planItems(t.blkDate || j()).list.find((x) => x.id === t.blk) : null,
        pr = "pomo" === t.mode ? Math.min(1, a / (60 * t.targetMin)) : it ? Math.min(1, a / (60 * it.dur)) : (a % 3600) / 3600;
      r0.setAttribute("stroke-dashoffset", (c0 * (1 - pr)).toFixed(1));
    });
    if (
      (ba.querySelectorAll(".js-tprog").forEach((t) => {
        t.style.width = (100 * o).toFixed(2) + "%";
      }),
      (document.title = `${e} · ${s(t.cat).short}`),
      "pomo" === t.mode &&
        n &&
        wa !== t.startedAt &&
        ((wa = t.startedAt),
        xa(),
        "break" === t.cat
          ? (Ea("Перерыв закончился. Пора за работу!"), ja("Перерыв закончился", "Пора за работу"))
          : (Ea("Помидор готов! Нажми «Стоп и сохранить» и отдохни 5 минут."),
            ja("Помидор готов", "Сохрани время и отдохни 5 минут"))),
      "games" === t.cat)
    ) {
      const e = gt(),
        s = ((U.days[j()] && U.days[j()].gamesMin) || 0) + a / 60;
      e > 0 &&
        s >= e &&
        ka !== t.startedAt &&
        ((ka = t.startedAt),
        xa(),
        Ea("Лимит игр на сегодня закончился."),
        ja("Лимит игр закончился", "На сегодня всё"));
    }
  }
  let lastTickMin = -1;
  setInterval(() => {
    Ma();
    const t = j();
    t !== et && ((et = t), (tt.diaryOffset = X()), (tt.early = null), (tt.moveFor = null), va());
    const nm = nowMin();
    if (nm !== lastTickMin && vt()) {
      const first = lastTickMin < 0;
      lastTickMin = nm;
      if (!first) {
        const d0 = U.days[t] || {};
        d0.bad ||
          planItems(t)
            .list.filter((it) => it.s === nm && isCatId(it.cat) && "done" !== it.status && it.dur > 0)
            .forEach((it) => {
              Ea(`Пора: ${it.title}`);
              ja(`Пора: ${it.title}`, `${mh(it.s)}–${mh(it.s + it.dur)} · открой, чтобы засечь время`);
            });
        ("today" === Z || "hw" === Z) && va();
      }
    }
  }, 1e3);
  let Da = null;
  function Ea(t) {
    const a = k("toast");
    a &&
      ((a.textContent = t),
      a.classList.add("show"),
      clearTimeout(Da),
      (Da = setTimeout(() => a.classList.remove("show"), 3e3)));
  }
  function Oa(t) {
    return (
      clearTimeout(at),
      tt.confirm === t
        ? ((tt.confirm = null), !0)
        : ((tt.confirm = t),
          (at = setTimeout(() => {
            ((tt.confirm = null), $a());
          }, 3500)),
          $a(),
          !1)
    );
  }
  function Fa(t) {
    if (m.includes(t)) {
      ((Z = t), (tt.confirm = null), $a(), window.scrollTo(0, 0));
      try {
        location.hash.slice(1) !== t && history.replaceState(null, "", "#" + t);
      } catch (t) {}
    }
  }
  async function Aa() {
    if (!ct) return void Ea(ea[aa()]);
    const t = ct;
    ct = null;
    try {
      t.prompt();
      const a = await t.userChoice;
      a && "accepted" === a.outcome && V(y, "1");
    } catch (t) {}
    $a();
  }
  const Sa = {
    "auth/invalid-email": "Неверный формат почты.",
    "auth/missing-password": "Введи пароль.",
    "auth/weak-password": "Пароль должен быть не короче 6 символов.",
    "auth/invalid-credential": "Неверная почта или пароль.",
    "auth/invalid-login-credentials": "Неверная почта или пароль.",
    "auth/wrong-password": "Неверная почта или пароль.",
    "auth/user-not-found": "Такого аккаунта нет. Нажми «Создать аккаунт».",
    "auth/email-already-in-use": "Аккаунт с этой почтой уже есть. Нажми «Войти».",
    "auth/too-many-requests": "Слишком много попыток. Подожди пару минут.",
    "auth/unauthorized-domain":
      "Этот адрес сайта не добавлен в Firebase: Authentication → Settings → Authorized domains.",
    "auth/operation-not-allowed": "Этот способ входа не включён в Firebase: Authentication → Sign-in method.",
    "auth/network-request-failed": "Нет связи с интернетом.",
    "auth/popup-blocked": "Браузер заблокировал окно входа. Разреши всплывающие окна или войди по почте.",
  };
  function La(t) {
    const a = t && t.code;
    ((tt.authBusy = !1),
      "auth/popup-closed-by-user" !== a && "auth/cancelled-popup-request" !== a
        ? ((tt.authError = Sa[a] || "Не получилось войти: " + ((t && t.message) || "ошибка")), $a())
        : $a());
  }
  async function Ia(t) {
    const a = ((k("au-email") || {}).value || "").trim(),
      e = (k("au-pass") || {}).value || "";
    if (!a) return ((tt.authError = "Введи почту."), void $a());
    const { authM: s, auth: n } = st;
    ((tt.authError = ""), (tt.authBusy = !0), $a());
    try {
      t ? await s.createUserWithEmailAndPassword(n, a, e) : await s.signInWithEmailAndPassword(n, a, e);
    } catch (t) {
      La(t);
    }
  }
  const Ta = new Set([
    "tab",
    "reload",
    "week-prev",
    "week-next",
    "diary-prev",
    "diary-next",
    "diary-now",
    "day-expand",
    "day-collapse",
    "timer-mode",
    "timer-pomo",
    "timer-cat",
    "break-skip",
    "book-form",
    "settings-close",
    "settings-close-bg",
    "tt-close",
    "tt-close-bg",
    "tt-add",
    "tt-del",
    "tt-copy",
    "note-open",
    "note-back",
    "notes-view",
    "goals-view",
    "go-events",
    "go-timer",
    "overdue-toggle",
    "grade-scope",
    "past-toggle",
    "goal-form-open",
    "goal-form-close",
    "goal-sugg",
    "goal-edit",
    "goal-edit-close",
    "pr-result",
    "pr-filter",
    "theme",
    "notify-toggle",
    "install",
    "install-help",
    "export-file",
    "import-cancel",
    "set-h-up",
    "set-h-down",
    "set-h-add",
    "set-h-del",
    "auth-google",
    "auth-signup",
    "auth-reset",
    "auth-signout",
    "retry-sync",
    "hw-view",
    "sched-day",
    "go-view",
    "deck",
    "focus-close",
    "cats-close",
    "cats-close-bg",
    "sched-close",
    "sched-close-bg",
  ]);
  function Na(t, a) {
    const e = t.dataset.key,
      s = N(U.weeks[e]) || { start: e, good: "", improve: "" };
    ((s[a] = t.value), (s.start = e), (U.weeks[e] = s), Mt("weeks", e));
  }
  // ---------- Действия с блоками расписания ----------
  function blkStart(key, id) {
    if (ht()) return void Ea("Таймер уже идёт. Сначала останови его.");
    const it = planItems(key).list.find((x0) => x0.id === id);
    if (!it || !isCatId(it.cat)) return;
    const nm = nowMin(),
      left = key === j() && nm >= it.s && nm < it.s + it.dur ? it.s + it.dur - nm : it.dur;
    Nt(it.cat, "pomo", Math.max(5, Math.round(left)), { blk: id, blkDate: key });
  }
  function blkDone(key, id) {
    const tm = ht(),
      it = planItems(key).list.find((x0) => x0.id === id);
    tm && tm.blk === id && Bt(!0, !0);
    Tt(
      key,
      (d) => {
        (d.blocks = d.blocks || {}), (d.blocks[id] = Object.assign({}, d.blocks[id], { st: "done", at: Date.now() })), it && !it.byHabit && "done" !== it.status && bumpHabitIn(d, it.cat, key);
      },
      !1,
    );
    tt.focus = !1;
    if (it && "res" === it.mode && key === j()) {
      const freed = it.s + it.dur - nowMin();
      freed >= 5 && (tt.early = { key, id, until: it.s + it.dur, title: it.title });
    }
    Ea(it ? `Сделано: ${it.title}` : "Сделано");
    $a();
  }
  function blkExt(key, id) {
    Tt(key, (d) => {
      (d.blocks = d.blocks || {}), (d.blocks[id] = Object.assign({}, d.blocks[id], { ext: ((d.blocks[id] && d.blocks[id].ext) || 0) + 15 }));
    }, !1);
    const tm = ht();
    tm && tm.blk === id && "pomo" === tm.mode && Lt({ timer: Object.assign({}, tm, { targetMin: (tm.targetMin || 0) + 15 }) }, !1);
    Ea("+15 минут. Остальное сдвинулось");
    $a();
  }
  function blkMove(key, id) {
    const it = planItems(key).list.find((x0) => x0.id === id),
      tm = ht();
    tm && tm.blk === id && Bt(!0, !0);
    if (!it) return void $a();
    Tt(key, (d) => {
      (d.blocks = d.blocks || {}), (d.blocks[id] = Object.assign({}, d.blocks[id], { st: "moved", at: Date.now() }));
    }, !1);
    const lg = blkLogged(key, id),
      rem = "res" === it.mode ? Math.max(15, Math.round(it.base + (it.ext || 0) - lg)) : Math.max(5, Math.round(it.base - lg));
    tt.focus = !1;
    tt.moveFor = { key, id, cat: it.cat, rem, title: it.title };
    $a();
  }
  function schedSave() {
    const dr = tt.schedDraft,
      st2 = bt(),
      fixT = (v0) => {
        const m0 = String(v0 || "").trim().match(/^(\d{1,2})[:.\s]?(\d{2})$/);
        if (!m0) return "";
        const h0 = +m0[1],
          mi = +m0[2];
        return h0 < 24 && mi < 60 ? `${x(h0)}:${x(mi)}` : "";
      },
      okT = (v0) => !!fixT(v0),
      clean = dr.blocks
        .filter((b0) => okT(b0.start))
        .map((b0) => ({
          id: b0.id || T(),
          start: fixT(b0.start),
          dur: Math.max(5, Math.min(600, parseInt(b0.dur, 10) || 30)),
          title: (b0.title || "").trim() || "Дело",
          cat: b0.cat || null,
          mode: b0.cat && "debt" !== b0.cat && "res" === b0.mode ? "res" : "time",
          fixed: !!b0.fixed,
        }))
        .sort((x0, y0) => hm(x0.start) - hm(y0.start)),
      sched = N(st2.sched),
      times = N(st2.times),
      bad1 = dr.blocks.filter((b0) => !okT(b0.start)).length;
    bad1 && setTimeout(() => Ea(`Не понял время у ${bad1} ${C(bad1, "дела", "дел", "дел")} — пиши как 17:30`), 300);
    if (dr.key) {
      // План только на эту дату: шаблон не трогаем
      tt.schedOpen = !1;
      Tt(dr.key, (d) => {
        d.plan = clean;
      });
      Ea(`Сохранено только на ${dr.key === j() ? "сегодня" : F(M(dr.key), { day: "numeric", month: "long" })}`);
      return;
    }
    sched["d" + dr.d] = clean;
    dr.copyTo.forEach((d0) => {
      sched["d" + d0] = clean.map((b0) => Object.assign({}, b0, { id: T() }));
      okT(dr.wake) && (times.wake[d0] = fixT(dr.wake));
    });
    okT(dr.wake) && (times.wake[dr.d] = fixT(dr.wake));
    okT(dr.sleep) && (times.sleep = fixT(dr.sleep));
    tt.schedOpen = !1;
    Lt({ settings: Object.assign({}, N(st2), { sched, times }) });
    Ea(dr.copyTo.length ? `Сохранено и скопировано: ${dr.copyTo.length} ${C(dr.copyTo.length, "день", "дня", "дней")}` : "Расписание сохранено");
  }
  function projUpdate(fn, quiet) {
    const st2 = bt();
    Lt({ settings: Object.assign({}, N(st2), { projects: fn(N(st2.projects)) }) }, !quiet);
  }
  function projSave() {
    const dr = tt.projDraft,
      title = (dr.title || "").trim();
    if (!title) return void Ea("Напиши, как называется проект");
    const old = dr.id ? bt().projects.find((x0) => x0.id === dr.id) : null,
      steps = String(dr.stepsText || "")
        .split(/\n+/)
        .map((l0) => l0.replace(/^\s*(?:[-–—•*]|\d+[.)])\s*/, "").trim())
        .filter(Boolean)
        .map((t0) => {
          const o0 = old && old.steps.find((x0) => x0.t === t0);
          return { id: o0 ? o0.id : T(), t: t0, done: !!(o0 && o0.done) };
        }),
      p0 = {
        id: dr.id || "p" + T(),
        title,
        cat: dr.cat || null,
        due: /^\d{4}-\d{2}-\d{2}$/.test(dr.due || "") ? dr.due : "",
        steps,
        done: !!(old && old.done),
        created: (old && old.created) || Date.now(),
        doneAt: (old && old.doneAt) || 0,
      };
    tt.projOpen = !1;
    projUpdate((ps) => {
      const ix = ps.findIndex((x0) => x0.id === p0.id);
      return ix >= 0 ? ((ps[ix] = p0), ps) : ps.concat([p0]);
    });
    Ea(dr.id ? "Проект сохранён" : "Проект добавлен на главную");
  }
  function catsSave() {
    const cats = tt.catsDraft.map((c0) => {
      const name = (c0.name || "").trim() || "Без названия",
        def = DEFAULT_CATS.find((d0) => d0.id === c0.id),
        g0 = parseFloat(String(null == c0.goal ? "" : c0.goal).replace(",", ".")) || 0;
      return {
        id: c0.id,
        name,
        short: def && def.name === name ? def.short : name.length > 11 ? name.split(" ")[0] : name,
        color: c0.color,
        goal: Math.min(80, Math.max(0, Math.round(2 * g0) / 2)),
        archived: !!c0.archived,
      };
    });
    if (!cats.some((c0) => !c0.archived)) return void Ea("Нужна хотя бы одна активная тема");
    tt.catsOpen = !1;
    Lt({ settings: Object.assign({}, N(bt()), { cats }) });
    t.some((c0) => c0.id === tt.timerCat) || (tt.timerCat = t[0].id);
    Ea("Темы сохранены");
  }
  async function copyText(txt) {
    try {
      await navigator.clipboard.writeText(txt);
      Ea("Отчёт скопирован — вставь в чат «Саморазвитие»");
    } catch (e0) {
      const ta0 = document.createElement("textarea");
      (ta0.value = txt), document.body.appendChild(ta0), ta0.select();
      try {
        document.execCommand("copy"), Ea("Отчёт скопирован — вставь в чат «Саморазвитие»");
      } catch (e1) {
        (tt.reportOpen = !0), $a(), Ea("Не получилось скопировать: выдели текст отчёта вручную");
      }
      ta0.remove();
    }
  }
  (document.addEventListener("click", (a) => {
    !(function () {
      try {
        if (!ya) {
          const t = window.AudioContext || window.webkitAudioContext;
          t && (ya = new t());
        }
        ya && "suspended" === ya.state && ya.resume().catch(() => {});
      } catch (t) {}
    })();
    const e = a.target.closest("[data-a]");
    if (!e || !ba.contains(e) || e.disabled) return;
    const s = e.dataset.a,
      n = e.dataset.v,
      i = e.dataset.id;
    if (!/-close-bg$/.test(s) || a.target === e)
      if (Ta.has(s) || vt())
        switch (s) {
          case "tab":
            (e.dataset.sub &&
              ("goals" === n && (tt.goalsView = e.dataset.sub), "notes" === n && (tt.notesView = e.dataset.sub)),
              Fa(n));
            break;
          case "reload":
            location.reload();
            break;
          case "go-events":
            ((tt.goalsView = "events"), Fa("goals"));
            break;
          case "go-timer":
            Fa("timer");
            break;
          case "auth-google":
            !(async function () {
              const { authM: t, auth: a } = st,
                e = new t.GoogleAuthProvider();
              ((tt.authError = ""), (tt.authBusy = !0), $a());
              try {
                await t.signInWithPopup(a, e);
              } catch (s) {
                if (s && "auth/operation-not-supported-in-this-environment" === s.code)
                  try {
                    await t.signInWithRedirect(a, e);
                  } catch (t) {
                    La(t);
                  }
                else La(s);
              }
            })();
            break;
          case "auth-signup":
            Ia(!0);
            break;
          case "auth-reset":
            !(async function () {
              const t = ((k("au-email") || {}).value || "").trim();
              if (!t) return ((tt.authError = "Впиши почту, и я пришлю письмо для сброса пароля."), void $a());
              try {
                (await st.authM.sendPasswordResetEmail(st.auth, t),
                  (tt.authError = ""),
                  $a(),
                  Ea("Письмо для сброса пароля отправлено"));
              } catch (t) {
                La(t);
              }
            })();
            break;
          case "auth-signout":
            ((tt.settingsOpen = !1), st && st.authM.signOut(st.auth));
            break;
          case "retry-sync":
            it && Ga(it);
            break;
          case "install":
            Aa();
            break;
          case "install-help":
            ct ? Aa() : Ea(ea[aa()]);
            break;
          case "onboard-install":
            It("install");
            break;
          case "onboard-hide":
            (It("hidden"), Ea("Первые шаги скрыты"));
            break;
          case "habit-tap":
            !(function (t) {
              const a = bt().habits.find((a) => a.id === t);
              if (!a) return;
              const e = hT(a, j()) || 1;
              Tt(j(), (a) => {
                const s = a.habits[t] || 0;
                a.habits[t] = s >= e ? 0 : s + 1;
              });
            })(i);
            break;
          case "games-add":
            Tt(j(), (t) => {
              t.gamesMin = Math.max(0, (t.gamesMin || 0) + Number(n));
            });
            break;
          case "timer-start":
            Nt(e.dataset.cat, "sw", null);
            break;
          case "timer-go":
            Nt(tt.timerCat, "games" === tt.timerCat ? "sw" : tt.timerMode, tt.pomoMin);
            break;
          case "timer-stop":
            Bt(!0);
            break;
          case "timer-cancel":
            Oa("timer-cancel") && (Bt(!1), Ea("Таймер отменён"));
            break;
          case "timer-mode":
            ((tt.timerMode = n), $a());
            break;
          case "timer-pomo":
            ((tt.pomoMin = Number(n)), $a());
            break;
          case "timer-cat":
            ((tt.timerCat = n), $a());
            break;
          case "break-start":
            Nt("break", "pomo", 5);
            break;
          case "break-skip":
            ((tt.offerBreak = !1), $a());
            break;
          case "ses-del":
            Oa("ses:" + i) &&
              Tt(e.dataset.key, (t) => {
                t.sessions = t.sessions.filter((t) => t.id !== i);
              });
            break;
          case "hw-toggle":
            !(function (t) {
              const a = N(U.hw[t]);
              a && ((a.done = !a.done), (a.doneAt = a.done ? Date.now() : null), At("hw", t, a));
            })(i);
            break;
          case "hw-extra":
            !(function (t) {
              const a = t + "_x" + T();
              At("hw", a, { date: t, slot: null, subject: "", text: "", done: !1, grade: "", created: Date.now() });
              const e = k("hws-" + a);
              e && e.focus();
            })(e.dataset.date);
            break;
          case "hw-del": {
            const t = U.hw[i];
            t && ((t.text || "").trim() || (t.grade || "").trim()) ? Oa("hwd:" + i) && St("hw", i) : St("hw", i);
            break;
          }
          case "overdue-toggle":
            ((tt.overdueOpen = !tt.overdueOpen), $a());
            break;
          case "overdue-done":
            !(function () {
              const t = j();
              let a = 0;
              (Object.entries(U.hw).forEach(([e, s]) => {
                if (s.date < t && !s.done && (s.text || "").trim()) {
                  const t = N(s);
                  ((t.done = !0), (t.doneAt = Date.now()), At("hw", e, t, !1), a++);
                }
              }),
                (tt.overdueOpen = !1),
                $a(),
                Ea(a ? `Отмечено сделанными: ${a}` : "Нечего отмечать"));
            })();
            break;
          case "day-expand":
            ((tt.expandedDays[e.dataset.date] = !0), $a());
            break;
          case "day-collapse":
            (delete tt.expandedDays[e.dataset.date], $a());
            break;
          case "diary-prev":
            (tt.diaryOffset--, $a());
            break;
          case "diary-next":
            (tt.diaryOffset++, $a());
            break;
          case "diary-now":
            ((tt.diaryOffset = X()), $a());
            break;
          case "grade-scope":
            ((tt.gradeScope = n), $a());
            break;
          case "week-prev":
            (tt.weekOffset--, $a());
            break;
          case "week-next":
            ((tt.weekOffset = Math.min(0, tt.weekOffset + 1)), $a());
            break;
          case "goals-view":
            ((tt.goalsView = n), (tt.confirm = null), $a());
            break;
          case "notes-view":
            ((tt.notesView = n), (tt.noteId = null), $a());
            break;
          case "ev-del":
            Oa("ev:" + i) && St("events", i);
            break;
          case "past-toggle":
            ((tt.showPastEvents = !tt.showPastEvents), $a());
            break;
          case "goal-form-open":
            ((tt.goalForm = { n: Date.now() }), $a());
            {
              const t = k("gf-title-" + tt.goalForm.n);
              t && t.focus();
            }
            break;
          case "goal-form-close":
            ((tt.goalForm = null), $a());
            break;
          case "goal-sugg": {
            const t = d[Number(n)];
            if (t) {
              ((tt.goalForm = Object.assign({ n: Date.now() }, t)), $a());
              const a = k(t.total ? "gf-cur-" + tt.goalForm.n : "gf-total-" + tt.goalForm.n);
              a && a.focus();
            }
            break;
          }
          case "goal-step":
            !(function (t, a) {
              const e = N(U.goals[t]);
              if (!e) return;
              const s = e.total > 0 ? e.total : 1 / 0,
                n = e.current || 0,
                o = Math.max(0, Math.min(s, n + a));
              if (o === n) return void (a > 0 && e.total > 0 && Ea("Цель уже выполнена"));
              ((e.current = o), (e.log = e.log || {}));
              const i = j();
              ((e.log[i] = (e.log[i] || 0) + (o - n)),
                At("goals", t, e),
                e.total > 0 && o >= e.total && n < e.total && Ea(`Цель «${e.title}» выполнена!`));
            })(i, Number(n));
            break;
          case "goal-edit":
            ((tt.goalEdit = i), $a());
            break;
          case "goal-edit-close":
            ((tt.goalEdit = null), $a());
            break;
          case "goal-del":
            Oa("goal:" + i) && St("goals", i);
            break;
          case "pr-result":
            ((tt.probResult = n), $a());
            break;
          case "pr-filter":
            ((tt.probFilter = n), $a());
            break;
          case "pr-flag":
            zt(i, (t) => {
              t.revisit = !t.revisit;
            });
            break;
          case "pr-cycle":
            zt(i, (t) => {
              const a = o.findIndex((a) => a.id === t.result);
              t.result = o[(a + 1) % o.length].id;
            });
            break;
          case "pr-del":
            Oa("pr:" + i) && St("problems", i);
            break;
          case "book-form":
            ((tt.bookForm = !tt.bookForm), $a());
            {
              const t = k("bk-title");
              t && t.focus();
            }
            break;
          case "book-sugg": {
            const t = c[Number(n)];
            t && Rt(t.title, t.author, 0, "plan");
            break;
          }
          case "book-status":
            Vt(i, (t) => {
              ((t.status = n), "done" === n && ((t.finished = Date.now()), t.pages && (t.page = t.pages)));
            });
            break;
          case "book-del":
            Oa("book:" + i) && St("books", i);
            break;
          case "note-new":
            !(function () {
              const t = T();
              (At("notes", t, { title: "", body: "", pinned: !1, created: Date.now(), updated: Date.now() }, !1),
                (tt.noteId = t),
                $a());
              const a = k("note-title");
              a && a.focus();
            })();
            break;
          case "note-open":
            ((tt.noteId = i), $a(), window.scrollTo(0, 0));
            break;
          case "note-back":
            !(function () {
              const t = tt.noteId,
                a = U.notes[t];
              ((tt.noteId = null), !a || (a.title || "").trim() || (a.body || "").trim() ? $a() : St("notes", t));
            })();
            break;
          case "note-pin": {
            const t = N(U.notes[tt.noteId]);
            t && ((t.pinned = !t.pinned), At("notes", tt.noteId, t));
            break;
          }
          case "note-del":
            if (Oa("note:" + tt.noteId)) {
              const t = tt.noteId;
              ((tt.noteId = null), St("notes", t));
            }
            break;
          case "settings-open":
            ((tt.settingsDraft = N(bt())), (tt.importPending = null), (tt.settingsOpen = !0), $a());
            break;
          case "settings-close":
          case "settings-close-bg":
            ((tt.settingsOpen = !1), (tt.importPending = null), $a());
            break;
          case "settings-save":
            !(function () {
              const a = tt.settingsDraft,
                e = a.habits.map((t) => ({
                  id: t.id || T(),
                  name: (t.name || "").trim() || "Без названия",
                  t: [0, 1, 2, 3, 4, 5, 6].map((a) => B(t.t[a], 0, 9)),
                })),
                s = [0, 1, 2, 3, 4, 5, 6].map((t) => B(a.gameLimit[t], 0, 1440)),
                mn = a.minimum.map((m0, i0) => ({ id: m0.id || "m" + i0, name: (m0.name || "").trim() })).filter((m0) => m0.name),
                rw = { on: !!a.reward.on, min: B(a.reward.min, 0, 240), pct: B(a.reward.pct, 50, 100) };
              ((tt.settingsOpen = !1),
                Lt({
                  settings: Object.assign({}, N(bt()), { habits: e, gameLimit: s, minimum: mn.length ? mn : N(DEFAULT_MIN), reward: rw }),
                  onboard: Object.assign({}, mt(), { settings: !0 }),
                }),
                Ea("Настройки сохранены"));
            })();
            break;
          case "set-h-add":
            (tt.settingsDraft.habits.push({ id: T(), name: "Новая привычка", t: [1, 1, 1, 1, 1, 1, 1] }), $a());
            {
              const t = k("sh-n-" + (tt.settingsDraft.habits.length - 1));
              t && (t.focus(), t.select());
            }
            break;
          case "set-h-del":
            (tt.settingsDraft.habits.splice(Number(e.dataset.i), 1), $a());
            break;
          case "set-h-up":
          case "set-h-down": {
            const t = Number(e.dataset.i),
              a = "set-h-up" === s ? t - 1 : t + 1,
              n = tt.settingsDraft.habits;
            if (a >= 0 && a < n.length) {
              const e = n[t];
              ((n[t] = n[a]), (n[a] = e), $a());
            }
            break;
          }
          case "theme":
            (V(v, "auto" === n ? null : n), $t(), $a());
            break;
          case "notify-toggle":
            !(async function () {
              if ("1" === R($)) return (V($, null), void $a());
              if ("Notification" in window) {
                try {
                  "granted" === (await Notification.requestPermission())
                    ? (V($, "1"), Ea("Уведомления включены"))
                    : Ea("Уведомления запрещены в настройках браузера");
                } catch (t) {
                  Ea("Не получилось включить уведомления");
                }
                $a();
              } else Ea("Этот браузер не умеет показывать уведомления");
            })();
            break;
          case "export-file":
            !(async function () {
              let t = Ht();
              if ("cloud" === J && st && nt) {
                Ea("Готовлю полную копию…");
                try {
                  const { fsM: a, db: e } = st;
                  for (const s of h) {
                    const n = await a.getDocs(a.collection(e, "users", nt, s)),
                      o = {};
                    (n.docs.forEach((t) => {
                      o[t.id] = t.data();
                    }),
                      (t[s] = o));
                  }
                } catch (a) {
                  (console.error(a),
                    (t = Ht()),
                    Ea("Не всё удалось загрузить из облака, сохраняю то, что есть на устройстве"));
                }
              }
              try {
                const a = new Blob([JSON.stringify(t, null, 1)], { type: "application/json" }),
                  e = URL.createObjectURL(a),
                  s = document.createElement("a");
                ((s.href = e),
                  (s.download = `bloknot-${j()}.json`),
                  document.body.appendChild(s),
                  s.click(),
                  s.remove(),
                  setTimeout(() => URL.revokeObjectURL(e), 4e3),
                  Ea("Резервная копия сохранена в загрузки"));
              } catch (t) {
                Ea("Не получилось сохранить файл");
              }
            })();
            break;
          case "import-go":
            !(function () {
              const t = tt.importPending && tt.importPending.data;
              if (((tt.importPending = null), !t)) return;
              let a = 0;
              if (t.profile && "object" == typeof t.profile) {
                const e = ut(N(t.profile));
                ((e.timer = null), (U.profile = e), jt("profile", "profile", e), a++);
              }
              (h.forEach((e) => {
                const s = t[e];
                s &&
                  "object" == typeof s &&
                  Object.entries(s).forEach(([t, s]) => {
                    Wt(t) && Ut(e, s) && ((U[e][t] = s), jt(e, t, s), a++);
                  });
              }),
                (tt.settingsOpen = !1),
                $a(),
                Ea(`Восстановлено записей: ${a}`));
            })();
            break;
          case "import-cancel":
            ((tt.importPending = null), $a());
            break;
          case "hw-view":
            ((tt.hwView = n), $a());
            break;
          case "go-sched":
            ((tt.settingsOpen = !1), (tt.hwView = "sched"), (tt.schedDay = E(new Date())), (tt.schedWeek = 0), Fa("hw"));
            break;
          case "go-view":
            Fa(n);
            break;
          case "sched-day":
            ((tt.schedDay = Number(n)), $a());
            break;
          case "sched-edit": {
            const d0 = Number(n),
              st2 = bt();
            ((tt.schedDraft = { d: d0, blocks: N(st2.sched["d" + d0]), wake: st2.times.wake[d0], sleep: st2.times.sleep, copyTo: [] }),
              (tt.schedOpen = !0),
              $a());
            break;
          }
          case "sched-close":
          case "sched-close-bg":
            ((tt.schedOpen = !1), $a());
            break;
          case "sb-add": {
            const bl = tt.schedDraft.blocks,
              last = bl[bl.length - 1];
            (bl.push({ id: T(), start: last ? mh(hm(last.start) + (parseInt(last.dur, 10) || 30)) : "17:00", dur: 30, title: "Новое дело", cat: null, mode: "time" }), $a());
            const el0 = k("sb-title-" + (bl.length - 1));
            el0 && (el0.focus(), el0.select());
            break;
          }
          case "sb-del":
            (tt.schedDraft.blocks.splice(Number(e.dataset.i), 1), $a());
            break;
          case "sd-copy": {
            const d0 = Number(n),
              arr = tt.schedDraft.copyTo,
              ix = arr.indexOf(d0);
            (ix >= 0 ? arr.splice(ix, 1) : arr.push(d0), $a());
            break;
          }
          case "sched-save":
            schedSave();
            break;
          case "sched-edit-day": {
            const key = e.dataset.key,
              dd0 = U.days[key],
              st2 = bt(),
              d0 = E(M(key));
            ((tt.schedDraft = {
              key,
              d: d0,
              blocks: N(dd0 && Array.isArray(dd0.plan) ? normBlocks(dd0.plan) : st2.sched["d" + d0]),
              wake: st2.times.wake[d0],
              sleep: st2.times.sleep,
              copyTo: [],
            }),
              (tt.settingsOpen = !1),
              (tt.schedOpen = !0),
              $a());
            break;
          }
          case "sched-reset-day": {
            const key = e.dataset.key;
            Oa("reset:" + key) &&
              (Tt(key, (d) => {
                delete d.plan;
              }),
              Ea("Вернул как в шаблоне"));
            break;
          }
          case "sched-wk":
            ((tt.schedWeek = Math.max(0, Math.min(8, (tt.schedWeek || 0) + Number(n)))), $a());
            break;
          case "sb-pin": {
            const b0 = tt.schedDraft && tt.schedDraft.blocks[Number(e.dataset.i)];
            b0 && ((b0.fixed = !b0.fixed), $a());
            break;
          }
          case "proj-new":
            ((tt.projDraft = { id: null, title: "", due: j(D(new Date(), 7)), cat: "", stepsText: "" }),
              (tt.settingsOpen = !1),
              (tt.projOpen = !0),
              $a());
            {
              const el0 = k("pj-title");
              el0 && el0.focus();
            }
            break;
          case "proj-edit": {
            const p0 = bt().projects.find((x0) => x0.id === i);
            p0 &&
              ((tt.projDraft = { id: p0.id, title: p0.title, due: p0.due, cat: p0.cat || "", stepsText: p0.steps.map((x0) => x0.t).join("\n") }),
              (tt.projOpen = !0),
              $a());
            break;
          }
          case "proj-close":
          case "proj-close-bg":
            ((tt.projOpen = !1), $a());
            break;
          case "proj-save":
            projSave();
            break;
          case "proj-del": {
            const id0 = tt.projDraft && tt.projDraft.id;
            id0 &&
              Oa("pdel:" + id0) &&
              ((tt.projOpen = !1), projUpdate((ps) => ps.filter((x0) => x0.id !== id0)), Ea("Проект удалён"));
            break;
          }
          case "proj-step":
            projUpdate((ps) => {
              const p0 = ps.find((x0) => x0.id === i),
                s0 = p0 && p0.steps.find((x1) => x1.id === n);
              return (s0 && (s0.done = !s0.done), ps);
            });
            break;
          case "proj-finish":
            (projUpdate((ps) => {
              const p0 = ps.find((x0) => x0.id === i);
              return (p0 && ((p0.done = !0), (p0.doneAt = Date.now())), ps);
            }),
              Ea("Проект закрыт"));
            break;
          case "proj-timer": {
            const p0 = bt().projects.find((x0) => x0.id === i);
            p0 && p0.cat && Nt(p0.cat, "sw");
            break;
          }
          case "cats-open":
            ((tt.catsDraft = N(bt().cats)), (tt.settingsOpen = !1), (tt.catsOpen = !0), $a());
            break;
          case "cats-close":
          case "cats-close-bg":
            ((tt.catsOpen = !1), $a());
            break;
          case "cat-color": {
            const c0 = tt.catsDraft[Number(e.dataset.i)],
              ix = CAT_COLORS.indexOf(c0.color);
            ((c0.color = CAT_COLORS[(ix + 1) % CAT_COLORS.length]), $a());
            break;
          }
          case "cat-arch": {
            const c0 = tt.catsDraft[Number(e.dataset.i)];
            ((c0.archived = !c0.archived), $a());
            break;
          }
          case "cat-up": {
            const i0 = Number(e.dataset.i),
              arr = tt.catsDraft;
            i0 > 0 && (([arr[i0 - 1], arr[i0]] = [arr[i0], arr[i0 - 1]]), $a());
            break;
          }
          case "cat-add": {
            const used = new Set(tt.catsDraft.map((c0) => c0.color)),
              col = CAT_COLORS.find((c0) => !used.has(c0)) || CAT_COLORS[0];
            (tt.catsDraft.push({ id: "c" + T(), name: "Новая тема", color: col, goal: 0, archived: !1 }), $a());
            const el0 = k("ct-n-" + (tt.catsDraft.length - 1));
            el0 && (el0.focus(), el0.select());
            break;
          }
          case "cats-save":
            catsSave();
            break;
          case "blk-start":
            blkStart(e.dataset.key, i);
            break;
          case "blk-done":
            i ? blkDone(e.dataset.key, i) : Bt(!0);
            break;
          case "blk-ext":
            blkExt(e.dataset.key, i);
            break;
          case "blk-move":
            blkMove(e.dataset.key, i);
            break;
          case "move-tomorrow": {
            const mv = tt.moveFor;
            if (!mv) break;
            const tk = j(D(M(mv.key), 1));
            (Tt(tk, (d) => {
              d.todo = (d.todo || []).concat([{ id: T(), cat: mv.cat, min: mv.rem, title: mv.title.split(" · ")[0], from: mv.key, done: !1 }]);
            }, !1),
              (tt.moveFor = null),
              $a(),
              Ea("Остаток перенесён на завтра"));
            break;
          }
          case "move-keep":
            ((tt.moveFor = null), $a(), Ea("Остаток в долге недели. Закроешь в любой день"));
            break;
          case "early-free":
            (Ea(`Свободное время до ${mh(tt.early ? tt.early.until : nowMin())}. Отдыхай, но без игр`), (tt.early = null), $a());
            break;
          case "debt-pick":
          case "debt-pick-week":
            ((tt.debtPick = !tt.debtPick), $a());
            break;
          case "debt-start":
            Nt(e.dataset.cat, "pomo", Math.max(10, Math.min(90, Math.round(Number(e.dataset.min) || 25))));
            break;
          case "todo-start": {
            const key = j(),
              x0 = ((U.days[key] || {}).todo || []).find((x1) => x1.id === i);
            x0 && Nt(x0.cat, "pomo", Math.max(5, Math.round(x0.min)), { todo: i, todoDate: key });
            break;
          }
          case "todo-done":
            Tt(j(), (d) => {
              const x0 = (d.todo || []).find((x1) => x1.id === i);
              x0 && (x0.done = !0);
            });
            break;
          case "no-prep":
            Tt(j(), (d) => {
              d.noPrep = Object.assign({}, d.noPrep, { [i]: !0 });
            });
            break;
          case "bad-on":
            ((tt.early = null), Tt(j(), (d) => {
              d.bad = !0;
            }), Ea("Плохой день: сегодня только минимум"));
            break;
          case "bad-off":
            Tt(j(), (d) => {
              d.bad = !1;
            });
            break;
          case "min-tap":
            Tt(j(), (d) => {
              (d.min = Object.assign({}, d.min)), (d.min[i] = d.min[i] ? 0 : 1);
            });
            break;
          case "focus-open":
            ((tt.focus = !0), $a());
            break;
          case "focus-close":
            ((tt.focus = !1), $a());
            break;
          case "timer-pause": {
            const tm = ht();
            if (!tm) break;
            const now0 = Date.now();
            tm.pausedAt
              ? Lt({ timer: Object.assign({}, tm, { pausedMs: (tm.pausedMs || 0) + (now0 - tm.pausedAt), pausedAt: null }) })
              : Lt({ timer: Object.assign({}, tm, { pausedAt: now0 }) });
            break;
          }
          case "deck":
            ((tt.wordsDeck = n), (tt.review = null), $a());
            break;
          case "review-start": {
            const q0 = dueOf(n)
              .sort((x0, y0) => (x0[1].due || "").localeCompare(y0[1].due || "") || (x0[1].created || 0) - (y0[1].created || 0))
              .map(([id]) => id);
            ((tt.wordsDeck = n), (tt.review = { deck: n, queue: q0, idx: 0, show: !1, done: 0, again: {} }), "words" === Z ? $a() : Fa("words"));
            break;
          }
          case "review-show":
            (tt.review && (tt.review.show = !0), $a());
            break;
          case "review-grade": {
            const rv = tt.review;
            if (!rv) break;
            const id = rv.queue[rv.idx],
              g0 = Number(n);
            (cardGrade(id, g0), rv.done++, 0 !== g0 || rv.again[id] || ((rv.again[id] = 1), rv.queue.push(id)), rv.idx++, (rv.show = !1), $a());
            break;
          }
          case "review-end":
            ((tt.review = null), $a());
            break;
          case "bulk-toggle":
            ((tt.bulkOpen = !tt.bulkOpen), $a());
            break;
          case "bulk-add": {
            const ta0 = k("bulk-text"),
              pairs = parseBulk(ta0 && ta0.value);
            if (!pairs.length) {
              Ea("Не нашёл пар. Пиши по строке: слово — перевод");
              break;
            }
            const n0 = addCards(tt.wordsDeck, pairs);
            (ta0 && (ta0.value = ""), $a(), Ea(`Добавлено карточек: ${n0}`));
            break;
          }
          case "card-del":
            Oa("card:" + i) && St("cards", i);
            break;
          case "report-toggle":
            ((tt.reportOpen = !tt.reportOpen), $a());
            break;
          case "report-copy":
            copyText(weekReport(tt.weekOffset));
            break;
          case "push-on":
            pushOn();
            break;
          case "push-off":
            pushOff();
            break;
          case "set-min-add": {
            (tt.settingsDraft.minimum.push({ id: "m" + T(), name: "" }), $a());
            const el0 = k("sm-" + (tt.settingsDraft.minimum.length - 1));
            el0 && el0.focus();
            break;
          }
          case "set-min-del":
            (tt.settingsDraft.minimum.splice(Number(e.dataset.i), 1), $a());
            break;
          case "rw-toggle":
            ((tt.settingsDraft.reward.on = !tt.settingsDraft.reward.on), $a());
            break;
          case "tt-open":
            ((tt.ttDraft = N(bt().timetable)), (tt.settingsOpen = !1), (tt.ttOpen = !0), $a());
            break;
          case "tt-close":
          case "tt-close-bg":
            ((tt.ttOpen = !1), $a());
            break;
          case "tt-add": {
            const t = Number(e.dataset.d);
            (tt.ttDraft[t].push(""), $a());
            const a = k(`tt-${t}-${tt.ttDraft[t].length - 1}`);
            a && a.focus();
            break;
          }
          case "tt-del":
            (tt.ttDraft[Number(e.dataset.d)].splice(Number(e.dataset.i), 1), $a());
            break;
          case "tt-copy": {
            const t = Number(e.dataset.d);
            ((tt.ttDraft[t] = tt.ttDraft[t - 1].slice()), $a());
            break;
          }
          case "tt-save":
            !(function () {
              const t = tt.ttDraft.map((t) => {
                const a = t.map((t) => (t || "").trim());
                for (; a.length && !a[a.length - 1];) a.pop();
                return a;
              });
              ((tt.ttOpen = !1),
                Lt({ settings: Object.assign({}, N(bt()), { timetable: t }) }),
                Ea("Расписание сохранено"));
            })();
        }
      else Ea("Секунду, загружаю твои данные…");
  }),
    document.addEventListener("input", (t) => {
      const a = t.target,
        e = a.dataset && a.dataset.input;
      if (e)
        switch (e) {
          case "day-note": {
            if (!vt()) return;
            const t = a.dataset.key,
              e = N(U.days[t]) || ft(t);
            ((e.note = a.value), (U.days[t] = e), Mt("days", t));
            break;
          }
          case "bad-note": {
            if (!vt()) return;
            const t = a.dataset.key,
              e = N(U.days[t]) || ft(t);
            ((e.badNote = a.value), (U.days[t] = e), Mt("days", t));
            break;
          }
          case "set-min":
            tt.settingsDraft.minimum[+a.dataset.i].name = a.value;
            break;
          case "rw-min":
            tt.settingsDraft.reward.min = a.value;
            break;
          case "rw-pct":
            tt.settingsDraft.reward.pct = a.value;
            break;
          case "cat-name":
            tt.catsDraft[+a.dataset.i].name = a.value;
            break;
          case "cat-goal":
            tt.catsDraft[+a.dataset.i].goal = a.value;
            break;
          case "sb-start":
            tt.schedDraft.blocks[+a.dataset.i].start = a.value;
            break;
          case "sb-dur":
            tt.schedDraft.blocks[+a.dataset.i].dur = a.value;
            break;
          case "sb-title":
            tt.schedDraft.blocks[+a.dataset.i].title = a.value;
            break;
          case "sb-cat":
            ((tt.schedDraft.blocks[+a.dataset.i].cat = a.value || null), $a());
            break;
          case "sb-mode":
            tt.schedDraft.blocks[+a.dataset.i].mode = a.value;
            break;
          case "sd-wake":
            tt.schedDraft.wake = a.value;
            break;
          case "sd-sleep":
            tt.schedDraft.sleep = a.value;
            break;
          case "pj-title":
            tt.projDraft && (tt.projDraft.title = a.value);
            break;
          case "pj-due":
            tt.projDraft && (tt.projDraft.due = a.value);
            break;
          case "pj-cat":
            tt.projDraft && (tt.projDraft.cat = a.value);
            break;
          case "pj-steps":
            tt.projDraft && (tt.projDraft.stepsText = a.value);
            break;
          case "hw-text":
            Gt(a, "text");
            break;
          case "hw-grade":
            Gt(a, "grade");
            break;
          case "hw-subj":
            Gt(a, "subject");
            break;
          case "week-good":
            Na(a, "good");
            break;
          case "week-improve":
            Na(a, "improve");
            break;
          case "note-title":
          case "note-body": {
            const t = tt.noteId,
              s = N(U.notes[t]);
            if (!s) return;
            ("note-title" === e ? (s.title = a.value) : (s.body = a.value),
              (s.updated = Date.now()),
              (U.notes[t] = s),
              Mt("notes", t));
            break;
          }
          case "note-search": {
            tt.noteSearch = a.value;
            const t = k("note-results");
            t ? (t.innerHTML = ca()) : $a();
            break;
          }
          case "set-h-name":
            tt.settingsDraft.habits[+a.dataset.i].name = a.value;
            break;
          case "set-h-t":
            tt.settingsDraft.habits[+a.dataset.i].t[+a.dataset.d] = B(a.value, 0, 9);
            break;
          case "set-g":
            tt.settingsDraft.gameLimit[+a.dataset.d] = B(a.value, 0, 1440);
            break;
          case "set-wg":
            tt.settingsDraft.weekGoals[a.dataset.c] = a.value;
            break;
          case "tt":
            tt.ttDraft[+a.dataset.d][+a.dataset.i] = a.value;
        }
    }),
    document.addEventListener("keydown", (t) => {
      const a = t.target,
        e = a.dataset && a.dataset.input;
      if ("Enter" === t.key && !t.shiftKey && ("hw-text" === e || "hw-grade" === e || "hw-subj" === e))
        return (t.preventDefault(), void a.blur());
      if ("Enter" === t.key && "tt" === e) {
        t.preventDefault();
        const e = +a.dataset.d,
          s = +a.dataset.i;
        s === tt.ttDraft[e].length - 1 && (tt.ttDraft[e].push(""), $a());
        const n = k(`tt-${e}-${s + 1}`);
        return void (n && n.focus());
      }
      "Escape" === t.key &&
        (tt.focus
          ? ((tt.focus = !1), $a())
          : tt.catsOpen
            ? ((tt.catsOpen = !1), $a())
            : tt.projOpen
              ? ((tt.projOpen = !1), $a())
            : tt.schedOpen
              ? ((tt.schedOpen = !1), $a())
              : tt.ttOpen
          ? ((tt.ttOpen = !1), $a())
          : tt.settingsOpen
            ? ((tt.settingsOpen = !1), $a())
            : tt.confirm && ((tt.confirm = null), $a()));
    }));
  let Ba = !1;
  function qa() {
    !ha || fa() || Ba || $a();
  }
  function Ca() {
    if ("local" === J) {
      clearTimeout(kt);
      try {
        localStorage.setItem(f, JSON.stringify(U));
      } catch (t) {}
    }
  }
  (document.addEventListener(
    "pointerdown",
    () => {
      Ba = !0;
    },
    !0,
  ),
    document.addEventListener(
      "pointerup",
      () => {
        ((Ba = !1), ha && setTimeout(qa, 120));
      },
      !0,
    ),
    document.addEventListener(
      "pointercancel",
      () => {
        Ba = !1;
      },
      !0,
    ),
    document.addEventListener("focusout", (t) => {
      const a = t.relatedTarget;
      (a && ba.contains(a) && ("TEXTAREA" === a.tagName || "INPUT" === a.tagName)) || setTimeout(qa, 0);
    }),
    document.addEventListener("change", (t) => {
      const a = t.target,
        e = a.dataset && a.dataset.change;
      if (e) {
        if ("import-file" === e) {
          const t = a.files && a.files[0];
          if (!t) return;
          const e = new FileReader();
          return (
            (e.onload = () =>
              (function (t) {
                let a;
                try {
                  a = JSON.parse(t);
                } catch (t) {
                  return void Ea("Это не файл резервной копии блокнота");
                }
                if (!a || "object" != typeof a || (!a.profile && !h.some((t) => a[t])))
                  return void Ea("В файле нет данных блокнота");
                let e = a.profile ? 1 : 0;
                (h.forEach((t) => {
                  a[t] &&
                    "object" == typeof a[t] &&
                    (e += Object.entries(a[t]).filter(([a, e]) => Wt(a) && Ut(t, e)).length);
                }),
                  (tt.importPending = { data: a, count: e }),
                  $a());
              })(String(e.result || ""))),
            (e.onerror = () => Ea("Не получилось прочитать файл")),
            void e.readAsText(t)
          );
        }
        vt() &&
          ("book-page" === e &&
            Vt(a.dataset.id, (t) => {
              ((t.page = B(a.value, 0, t.pages || 99999)),
                t.pages &&
                  t.page >= t.pages &&
                  "done" !== t.status &&
                  ((t.status = "done"), (t.finished = Date.now()), Ea("Книга прочитана, отличная работа!")));
            }),
          "book-pages" === e &&
            Vt(a.dataset.id, (t) => {
              t.pages = B(a.value, 0, 99999);
            }));
      }
    }),
    document.addEventListener("submit", (t) => {
      const a = t.target.closest("form[data-form]");
      if (!a) return;
      t.preventDefault();
      const e = a.dataset.form;
      if ("auth" === e) return void Ia(!1);
      if (!vt()) return void Ea("Секунду, загружаю твои данные…");
      const n = (t) => (k(t) || {}).value || "";
      if ("hwq" === e) {
        const t = a.dataset.p,
          e = k(t + "-text");
        if (!e.value.trim()) return (Ea("Напиши, что задали"), void e.focus());
        const s = n(t + "-subj"),
          o = e.value;
        ((e.value = ""),
          (function (t, a) {
            a = a.trim();
            const e = t
              ? (function (t) {
                  for (let a = 1; a <= 28; a++) {
                    const e = D(new Date(), a),
                      s = qt(e).findIndex((a) => q(a) === q(t));
                    if (s >= 0) return { key: j(e), slot: s };
                  }
                  return null;
                })(t)
              : null;
            if (e) {
              const t = e.key + "_" + e.slot,
                s = N(U.hw[t]) || {
                  date: e.key,
                  slot: e.slot,
                  subject: qt(M(e.key))[e.slot],
                  text: "",
                  done: !1,
                  grade: "",
                  created: Date.now(),
                };
              ((s.text = (s.text || "").trim() ? s.text.trim() + "; " + a : a),
                (s.done = !1),
                (s.updated = Date.now()),
                At("hw", t, s),
                Ea(
                  `${s.subject}: записал на ${F(M(e.key), { weekday: "short", day: "numeric", month: "short" })}, ${e.slot + 1}-й урок`,
                ));
            } else {
              const e = j(D(new Date(), 1));
              (At("hw", e + "_x" + T(), {
                date: e,
                slot: null,
                subject: t || "Другое",
                text: a,
                done: !1,
                grade: "",
                created: Date.now(),
              }),
                Ea(t ? `«${t}» нет в расписании, записал на завтра` : "Записал на завтра"));
            }
          })(s, o));
        const i = k(t + "-text");
        i && i.focus();
      } else if ("manual" === e) {
        const t = n("man-cat"),
          a = B(n("man-min"), 0, 600);
        if (!a) return void Ea("Сколько минут? Введи число.");
        ((k("man-min").value = ""),
          (function (t, a) {
            (Tt(j(), (e) => {
              "games" === t
                ? (e.gamesMin = (e.gamesMin || 0) + a)
                : e.sessions.push({ id: T(), cat: t, start: Date.now() - 6e4 * a, sec: 60 * a });
            }),
              Ea(`Добавлено: ${s(t).short}, ${A(a)}`));
          })(t, a));
      } else if ("book" === e) {
        const t = n("bk-title").trim();
        if (!t) return void Ea("Нужно название книги");
        const a = n("bk-author").trim(),
          e = B(n("bk-pages"), 0, 99999),
          s = n("bk-status") || "reading";
        (["bk-title", "bk-author", "bk-pages"].forEach((t) => {
          k(t).value = "";
        }),
          (tt.bookForm = !1),
          Rt(t, a, e, s));
      } else if ("event" === e) {
        const t = n("ev-title").trim(),
          a = n("ev-date"),
          e = n("ev-type") || "other";
        if (!t) return (Ea("Напиши, что за событие"), void k("ev-title").focus());
        if (!/^\d{4}-\d{2}-\d{2}$/.test(a)) return void Ea("Выбери дату");
        ((k("ev-title").value = ""),
          (function (t, a, e) {
            (At("events", T(), { title: t, date: a, type: e, created: Date.now() }), Ea(`Добавлено: ${t}, ${G(P(a))}`));
          })(t, a, e));
      } else if ("goal" === e) {
        const t = a.dataset.n,
          e = n("gf-title-" + t).trim();
        if (!e) return void Ea("Напиши название цели");
        const s = B(n("gf-cur-" + t), 0, 1e6),
          o = B(n("gf-total-" + t), 0, 1e6),
          i = n("gf-unit-" + t).trim();
        ((tt.goalForm = null),
          (function (t, a, e, s) {
            At("goals", T(), { title: t, current: a, total: e, unit: s, log: {}, created: Date.now() });
          })(e, o ? Math.min(s, o) : s, o, i),
          Ea("Цель добавлена"));
      } else if ("goal-edit" === e) {
        const t = a.dataset.id,
          e = N(U.goals[t]);
        if (!e) return;
        ((e.title = n("ge-title-" + t).trim() || e.title),
          (e.total = B(n("ge-total-" + t), 0, 1e6)),
          (e.current = B(n("ge-cur-" + t), 0, e.total || 1e6)),
          (e.unit = n("ge-unit-" + t).trim()),
          (tt.goalEdit = null),
          At("goals", t, e));
      } else if ("card" === e) {
        const f0 = n("cf-front").trim(),
          b0 = n("cf-back").trim();
        if (!f0 || !b0) return void Ea("Нужны слово и перевод");
        addCards(tt.wordsDeck, [[f0, b0, n("cf-ex")]]);
        ["cf-front", "cf-back", "cf-ex"].forEach((x0) => {
          k(x0) && (k(x0).value = "");
        });
        $a();
        const el0 = k("cf-front");
        el0 && el0.focus();
        Ea("Карточка добавлена");
      } else if ("problem" === e) {
        const t = n("pr-src").trim(),
          a = n("pr-topic").trim();
        if (!t && !a) return (Ea("Напиши источник или тему задачи"), void k("pr-src").focus());
        const e = B(n("pr-min"), 0, 600),
          s = !(!k("pr-rev") || !k("pr-rev").checked);
        ((k("pr-src").value = ""),
          (k("pr-min").value = ""),
          k("pr-rev") && (k("pr-rev").checked = !1),
          (function (t, a, e, s, n) {
            (At("problems", T(), {
              date: j(),
              source: t,
              topic: a,
              result: e,
              minutes: s,
              revisit: n,
              created: Date.now(),
            }),
              Ea("Задача записана"));
          })(t, a, tt.probResult, e, s));
        const o = k("pr-src");
        o && o.focus();
      }
    }),
    window.addEventListener("hashchange", () => {
      const a = location.hash.slice(1);
      m.includes(a) && a !== Z && ((Z = a), $a(), window.scrollTo(0, 0));
    }),
    document.addEventListener("visibilitychange", () => {
      "hidden" === document.visibilityState ? (Dt(), Ca()) : va();
    }),
    window.addEventListener("pagehide", () => {
      (Dt(), Ca());
    }),
    window.addEventListener("online", va),
    window.addEventListener("offline", va),
    window.addEventListener("resize", () => {
      ba.querySelectorAll("textarea.l-text").forEach(ga);
    }),
    W && W.addEventListener && W.addEventListener("change", va));
  try {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", $t);
  } catch (t) {}
  function Pa() {
    (lt.forEach((t) => {
      try {
        t();
      } catch (t) {}
    }),
      (lt = []),
      (K.profile = !1),
      h.forEach((t) => {
        ((K[t] = !1), (U[t] = {}));
      }),
      (U.profile = null),
      (nt = null),
      (rt = !1),
      (Y = null),
      Object.keys(yt).forEach((t) => delete yt[t]),
      Object.keys(wt).forEach((t) => {
        (clearTimeout(wt[t]), delete wt[t]);
      }));
  }
  function Ga(t) {
    (Dt(), Pa(), (J = "cloud"), (it = t), (nt = t.uid), (ot = t.email || t.displayName || ""));
    const { fsM: a, db: e } = st,
      s = (t) => {
        (console.error(t), (Y = { code: (t && t.code) || "", message: (t && t.message) || "" }), va());
      };
    lt.push(
      a.onSnapshot(
        a.doc(e, "users", nt),
        (t) => {
          let a = t.exists() ? t.data() : null;
          (yt["profile/profile"] && (a = yt["profile/profile"]),
            (U.profile = a),
            (K.profile = !0),
            t.exists() ||
              t.metadata.fromCache ||
              rt ||
              ((rt = !0),
              (function () {
                const t = Ft(),
                  a = t && (t.profile || h.some((a) => t[a] && Object.keys(t[a]).length)),
                  e = a && t.profile ? N(t.profile) : { settings: N(r), timer: null };
                ((e.timer = null),
                  ut(e),
                  (U.profile = e),
                  jt("profile", "profile", e),
                  a &&
                    (h.forEach((a) =>
                      Object.entries(t[a] || {}).forEach(([t, e]) => {
                        Wt(t) && e && "object" == typeof e && jt(a, t, e);
                      }),
                    ),
                    Ea("Данные с этого устройства перенесены в облако")));
              })()),
            va());
        },
        s,
      ),
    );
    const n = (t, e) =>
        lt.push(
          a.onSnapshot(
            e,
            (a) => {
              const e = {};
              (a.docs.forEach((t) => {
                e[t.id] = t.data();
              }),
                (U[t] = (function (t, a) {
                  return (
                    Object.keys(yt).forEach((e) => {
                      const s = e.indexOf("/");
                      e.slice(0, s) === t && (a[e.slice(s + 1)] = yt[e]);
                    }),
                    a
                  );
                })(t, e)),
                (K[t] = !0),
                Y && !a.metadata.fromCache && (Y = null),
                va());
            },
            s,
          ),
        ),
      o = (t) => a.collection(e, "users", nt, t),
      i = j(D(new Date(), -120));
    (n("days", a.query(o("days"), a.orderBy("date", "desc"), a.limit(400))),
      n("hw", a.query(o("hw"), a.where("date", ">=", i), a.limit(3e3))),
      n("notes", a.query(o("notes"), a.orderBy("updated", "desc"), a.limit(500))),
      n("books", a.query(o("books"), a.limit(300))),
      n("events", a.query(o("events"), a.limit(500))),
      n("goals", a.query(o("goals"), a.limit(100))),
      n("problems", a.query(o("problems"), a.orderBy("created", "desc"), a.limit(800))),
      n("weeks", a.query(o("weeks"), a.orderBy("start", "desc"), a.limit(60))),
      n("cards", a.query(o("cards"), a.limit(3000))),
      $a());
  }
  (window.addEventListener("beforeinstallprompt", (t) => {
    (t.preventDefault(), (ct = t), va());
  }),
    window.addEventListener("appinstalled", () => {
      ((ct = null), V(y, "1"), Ea("Блокнот установлен"), va());
    }));
  let Ra = "";
  !(async function () {
    if (
      ($t(),
      $a(),
      "serviceWorker" in navigator &&
        "https:" === location.protocol &&
        navigator.serviceWorker.register("sw.js").catch(() => {}),
      window.__cfgError)
    )
      return ((Ra = "Подробности: " + window.__cfgError), (J = "cfgerror"), void $a());
    const t = (function () {
      let t = window.FIREBASE_CONFIG;
      try {
        t || "undefined" == typeof firebaseConfig || (t = firebaseConfig);
      } catch (t) {}
      return t && "object" == typeof t ? t : null;
    })();
    if (!t || !t.apiKey)
      return (
        (J = "local"),
        (function () {
          const t = Ft();
          t &&
            ((U.profile = t.profile || null),
            h.forEach((a) => {
              U[a] = t[a] && "object" == typeof t[a] ? t[a] : {};
            }));
        })(),
        void $a()
      );
    const a = ["apiKey", "authDomain", "projectId", "appId"].filter((a) => !t[a]);
    if (a.length) return ((Ra = "Не хватает строк: " + a.join(", ") + "."), (J = "cfgerror"), void $a());
    try {
      await (async function (t) {
        const a = "https://www.gstatic.com/firebasejs/10.12.2/",
          [e, s, n] = await Promise.all([
            import(a + "firebase-app.js"),
            import(a + "firebase-auth.js"),
            import(a + "firebase-firestore.js"),
          ]),
          o = e.initializeApp(t),
          i = s.getAuth(o);
        let l;
        try {
          l = n.initializeFirestore(o, {
            localCache: n.persistentLocalCache({ tabManager: n.persistentMultipleTabManager() }),
          });
        } catch (t) {
          l = n.getFirestore(o);
        }
        if (t.useEmulators)
          try {
            (s.connectAuthEmulator(i, "http://127.0.0.1:9099", { disableWarnings: !0 }),
              n.connectFirestoreEmulator(l, "127.0.0.1", 8080));
          } catch (t) {
            console.error(t);
          }
        ((st = { authM: s, fsM: n, auth: i, db: l }),
          s.getRedirectResult(i).catch(La),
          s.onAuthStateChanged(i, (t) => {
            ((tt.authBusy = !1),
              t ? (it && it.uid === t.uid && "cloud" === J) || Ga(t) : (Pa(), (it = null), (J = "signin"), $a()));
          }));
      })(t);
    } catch (t) {
      (console.error(t), (J = "fberror"), $a());
    }
  })();
})();
