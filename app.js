const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.MainButton.hide(); }

const STORAGE_PROFILE = "astro_games_profile";
const STORAGE_HISTORY = "astro_games_history";
const STORAGE_GAME_BEST = "astro_games_catch_best";
const STORAGE_QUIZ_STATS = "astro_games_quiz_stats";

const texts = {
  "Овен": { love: "Сегодня в любви важны прямота и уважение.", money: "Действуй быстро, но не импульсивно.", energy: "Энергии много — направь её в одну цель." },
  "Телец": { love: "Тепло и стабильность важнее громких слов.", money: "Практичные решения принесут лучший результат.", energy: "Спокойный темп станет твоим преимуществом." },
  "Близнецы": { love: "Честное общение поможет сблизиться.", money: "Сравнивай варианты и собирай информацию.", energy: "Твоя сила — в гибкости и скорости мысли." },
  "Рак": { love: "Слушай чувства — свои и чужие.", money: "Не принимай финансовые решения на эмоциях.", energy: "День подходит для восстановления." },
  "Лев": { love: "Харизма работает, но искренность важнее.", money: "Можно смело идти к амбициозной цели.", energy: "День поддерживает лидерство." },
  "Дева": { love: "Забота и внимание к деталям скажут больше слов.", money: "Хороший день для порядка в бюджете.", energy: "Собранность станет источником силы." },
  "Весы": { love: "Баланс между собой и другими особенно важен.", money: "Сначала оцени реальную выгоду.", energy: "Гармония внутри влияет на всё вокруг." },
  "Скорпион": { love: "Деликатность сегодня важнее давления.", money: "День подходит для анализа и стратегии.", energy: "Твоя сила — в глубине и фокусе." },
  "Стрелец": { love: "Открытость и легкость оживят отношения.", money: "Смотри шире, но не забывай детали.", energy: "День подталкивает к движению и росту." },
  "Козерог": { love: "Надежность сегодня говорит громче романтики.", money: "Сильный день для дисциплины и стратегии.", energy: "Последовательность принесет лучший результат." },
  "Водолей": { love: "Свежий взгляд освежит отношения.", money: "Интересная идея может стать новой возможностью.", energy: "Сильны вдохновение и интеллект." },
  "Рыбы": { love: "Интуиция в любви сегодня особенно точна.", money: "Выбирай понятные и прозрачные решения.", energy: "День поддерживает творчество." }
};
const codeMeanings = {
  1:"Лидер. Инициатива и старт.",2:"Дипломат. Чуткость и баланс.",3:"Творец. Идеи и самовыражение.",
  4:"Опора. Порядок и устойчивость.",5:"Движение. Перемены и свобода.",6:"Гармония. Забота и тепло.",
  7:"Глубина. Мудрость и анализ.",8:"Сила. Результат и влияние.",9:"Мудрость. Завершение и человечность.",
  11:"Вдохновитель. Свет и интуиция.",22:"Создатель. Масштаб и воплощение.",33:"Проводник. Тепло и поддержка."
};
const personalMessages = {
  1:"Твой путь раскрывается через смелость и первый шаг.",
  2:"Твоя сила в мягкости и умении чувствовать тонкие вещи.",
  3:"Проявленность и творчество делают тебя сильнее.",
  4:"Структура и порядок помогают тебе выигрывать.",
  5:"Тебе важно двигаться и обновляться.",
  6:"Ты создаешь тепло вокруг и умеешь поддерживать.",
  7:"В тебе много глубины и внутренней мудрости.",
  8:"Ты умеешь превращать намерение в результат.",
  9:"Твоя зрелость и человечность — твоя опора.",
  11:"Ты можешь вдохновлять других своим светом.",
  22:"В тебе есть потенциал для больших дел.",
  33:"Твоя доброта и забота реально меняют мир вокруг."
};
const quizBank = [
  { sign: "Овен", prompt: "Этот знак любит старт, движение и действует первым." },
  { sign: "Телец", prompt: "Этот знак ценит стабильность, комфорт и практичность." },
  { sign: "Близнецы", prompt: "Этот знак связан с общением, идеями и быстрой сменой интересов." },
  { sign: "Рак", prompt: "Этот знак чувствительный, семейный и очень эмоциональный." },
  { sign: "Лев", prompt: "Этот знак яркий, любит быть заметным и проявлять лидерство." },
  { sign: "Дева", prompt: "Этот знак внимателен к деталям, любит порядок и систему." },
  { sign: "Весы", prompt: "Этот знак стремится к балансу, красоте и гармонии в отношениях." },
  { sign: "Скорпион", prompt: "Этот знак глубокий, сильный и умеет держать фокус." },
  { sign: "Стрелец", prompt: "Этот знак любит свободу, развитие и новые горизонты." },
  { sign: "Козерог", prompt: "Этот знак дисциплинированный, надежный и ориентирован на результат." },
  { sign: "Водолей", prompt: "Этот знак мыслит нестандартно, любит идеи и свободу мышления." },
  { sign: "Рыбы", prompt: "Этот знак интуитивный, творческий и тонко чувствует мир." },
];
const wheelMessages = [
  "Сегодня тебе особенно повезёт в новых начинаниях.",
  "День подсказывает не спешить и прислушаться к интуиции.",
  "Хороший момент для честного разговора и ясных решений.",
  "Удача включается, когда ты действуешь спокойно и уверенно.",
  "Сегодня маленький шаг может дать большой результат.",
  "День подходит для творчества, вдохновения и лёгкости.",
  "Не бойся менять курс — сегодня это может быть верным решением.",
  "Фокус на себе и своих целях даст тебе мощный ресурс."
];

const screens = {
  home: document.getElementById("screen-home"),
  profile: document.getElementById("screen-profile"),
  forecast: document.getElementById("screen-forecast"),
  compatibility: document.getElementById("screen-compatibility"),
  lucky: document.getElementById("screen-lucky"),
  history: document.getElementById("screen-history"),
  games: document.getElementById("screen-games"),
  "game-catch": document.getElementById("screen-game-catch"),
  "game-quiz": document.getElementById("screen-game-quiz"),
  "game-wheel": document.getElementById("screen-game-wheel"),
};

let stack = ["home"];
let current = "home";
let catchTimer = null;
let catchMoveTimer = null;
let catchTimeLeft = 20;
let catchScore = 0;
let currentQuiz = null;

function haptic(type="light") { try { tg?.HapticFeedback?.impactOccurred(type); } catch {} }
function show(name, push=true) {
  if (!screens[name]) return;
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  if (push && current !== name) stack.push(name);
  current = name;
  document.getElementById("backBtn").classList.toggle("hidden", current === "home");
  document.getElementById("homeBtn").classList.toggle("hidden", current === "home");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.target === name || ((name.startsWith("game") || name==="games") && b.dataset.target === "games")));
  if (name === "profile") renderProfile();
  if (name === "history") renderHistory();
  if (name === "game-catch") renderCatchBest();
  if (name === "game-quiz") renderQuizStats();
}
document.querySelectorAll(".menu-card,.nav-btn").forEach(btn => btn.addEventListener("click", () => { haptic(); show(btn.dataset.target); }));
document.getElementById("backBtn").addEventListener("click", () => { haptic("soft"); if (stack.length > 1) { stack.pop(); show(stack[stack.length - 1], false); } });
document.getElementById("homeBtn").addEventListener("click", () => { haptic("soft"); stack=["home"]; show("home", false); });

function parseDate(v) {
  const m = v.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  const d = Number(m[1]), mo = Number(m[2]), y = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return {day:d, month:mo, year:y};
}
function zodiac(day, month) {
  if ((month===3&&day>=21)||(month===4&&day<=19)) return "Овен";
  if ((month===4&&day>=20)||(month===5&&day<=20)) return "Телец";
  if ((month===5&&day>=21)||(month===6&&day<=20)) return "Близнецы";
  if ((month===6&&day>=21)||(month===7&&day<=22)) return "Рак";
  if ((month===7&&day>=23)||(month===8&&day<=22)) return "Лев";
  if ((month===8&&day>=23)||(month===9&&day<=22)) return "Дева";
  if ((month===9&&day>=23)||(month===10&&day<=22)) return "Весы";
  if ((month===10&&day>=23)||(month===11&&day<=21)) return "Скорпион";
  if ((month===11&&day>=22)||(month===12&&day<=21)) return "Стрелец";
  if ((month===12&&day>=22)||(month===1&&day<=19)) return "Козерог";
  if ((month===1&&day>=20)||(month===2&&day<=18)) return "Водолей";
  return "Рыбы";
}
function humanCode(dateStr) {
  const digits = dateStr.replace(/\D/g, "").split("").map(Number);
  let total = digits.reduce((a,b)=>a+b,0);
  while (total > 9 && ![11,22,33].includes(total)) total = String(total).split("").map(Number).reduce((a,b)=>a+b,0);
  return total;
}
function luckyNum(z, code) {
  const d = new Date();
  const seed = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
  const base = [...z].reduce((s,ch)=>s+ch.charCodeAt(0),0) + code*9 + seed;
  return (base % 9) + 1;
}
function getProfile() { try { return JSON.parse(localStorage.getItem(STORAGE_PROFILE) || "null"); } catch { return null; } }
function saveProfile(profile) { localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile)); }
function clearProfile() { localStorage.removeItem(STORAGE_PROFILE); }
function getHistory() { try { return JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]"); } catch { return []; } }
function saveHistory(items) { localStorage.setItem(STORAGE_HISTORY, JSON.stringify(items.slice(0,20))); }
function addHistory(type, title, preview) {
  const items = getHistory();
  items.unshift({type, title, preview, created_at: new Date().toLocaleString("ru-RU")});
  saveHistory(items);
}
function card(title, body, accent=false) {
  return `<div class="glass info-card ${accent ? 'info-card--accent' : ''}"><div class="info-title">${title}</div><div>${body}</div></div>`;
}
function profileCard(profile) {
  return `
    <div class="profile-hero">
      <div class="profile-head">
        <div class="avatar-ring"><div class="avatar">${(profile.name?.[0] || "A").toUpperCase()}</div></div>
        <div>
          <div class="profile-name">${profile.name}</div>
          <div class="profile-subtitle">${profile.zodiac}</div>
          <div class="badges">
            <span class="badge">Дата: ${profile.birthdate}</span>
            <span class="badge">Сегодня</span>
          </div>
        </div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><span>Дата рождения</span><strong>${profile.birthdate}</strong></div>
      <div class="stat"><span>Код человека</span><strong>${profile.code}</strong></div>
      <div class="stat"><span>Счастливое число</span><strong>${profile.lucky}</strong></div>
    </div>
    ${card("Описание кода", codeMeanings[profile.code] || "Личный путь роста и самореализации.")}
    ${card("Личное послание", personalMessages[profile.code] || "Доверяй себе и своему внутреннему пути.", true)}
  `;
}
function updateHomePreview() {
  const p = getProfile();
  const el = document.getElementById("homePreviewText");
  if (!p) { el.textContent = "Профиль ещё не заполнен"; return; }
  el.textContent = `${p.name} • ${p.birthdate} • ${p.zodiac} • код ${p.code}`;
}
function renderProfile() {
  const p = getProfile();
  const msg = document.getElementById("profileMsg");
  msg.textContent = "";
  const view = document.getElementById("profileView");
  if (!p) {
    view.classList.add("hidden");
    document.getElementById("profileName").value = tg?.initDataUnsafe?.user?.first_name || "";
    document.getElementById("profileBirthdate").value = "";
    return;
  }
  document.getElementById("profileName").value = p.name || "";
  document.getElementById("profileBirthdate").value = p.birthdate || "";
  view.innerHTML = profileCard(p);
  view.classList.remove("hidden");
}
document.getElementById("saveProfileBtn").addEventListener("click", () => {
  haptic("medium");
  const name = document.getElementById("profileName").value.trim();
  const birthdate = document.getElementById("profileBirthdate").value.trim();
  const msg = document.getElementById("profileMsg");
  if (!name) { msg.textContent = "Введите имя"; return; }
  const p = parseDate(birthdate);
  if (!p) { msg.textContent = "Введите дату в формате ДД.ММ.ГГГГ"; return; }
  const z = zodiac(p.day, p.month);
  const code = humanCode(birthdate);
  const lucky = luckyNum(z, code);
  const profile = {name, birthdate, zodiac: z, code, lucky};
  saveProfile(profile);
  msg.textContent = "Профиль сохранён";
  document.getElementById("profileView").innerHTML = profileCard(profile);
  document.getElementById("profileView").classList.remove("hidden");
  updateHomePreview();
  addHistory("Профиль", `${name} • ${z}`, `Дата рождения: ${birthdate}`);
});
document.getElementById("deleteProfileBtn").addEventListener("click", () => {
  haptic("medium");
  clearProfile();
  document.getElementById("profileMsg").textContent = "Профиль удалён";
  document.getElementById("profileView").classList.add("hidden");
  document.getElementById("profileName").value = tg?.initDataUnsafe?.user?.first_name || "";
  document.getElementById("profileBirthdate").value = "";
  updateHomePreview();
});

document.getElementById("forecastBtn").addEventListener("click", () => {
  const value = document.getElementById("forecastDate").value.trim();
  const p = parseDate(value);
  const msg = document.getElementById("forecastMsg");
  if (!p) { msg.textContent = "Введите дату в формате ДД.ММ.ГГГГ"; return; }
  msg.textContent = "";
  const z = zodiac(p.day, p.month);
  const code = humanCode(value);
  const lucky = luckyNum(z, code);
  const t = texts[z];
  const view = document.getElementById("forecastView");
  view.innerHTML = [
    card("Знак, код и число", `${z} • код ${code} • число ${lucky}`),
    card("Любовь", t.love),
    card("Деньги", t.money),
    card("Энергия", t.energy),
    card("Код судьбы", codeMeanings[code] || "Личный путь роста и самореализации.", true)
  ].join("");
  view.classList.remove("hidden");
  addHistory("Прогноз", `${z} • код ${code}`, `${t.money} ${t.energy}`);
});

function compatibilityScore(c1, c2, z1, z2) {
  let score = 52;
  const diff = Math.abs(c1 - c2);
  score += Math.max(0, 20 - diff * 2);
  const groups = [["Овен","Лев","Стрелец"],["Телец","Дева","Козерог"],["Близнецы","Весы","Водолей"],["Рак","Скорпион","Рыбы"]];
  if (z1 === z2) score += 15;
  else for (const g of groups) if (g.includes(z1) && g.includes(z2)) { score += 12; break; }
  return Math.max(1, Math.min(99, score));
}
document.getElementById("compatBtn").addEventListener("click", () => {
  const v1 = document.getElementById("compatDate1").value.trim();
  const v2 = document.getElementById("compatDate2").value.trim();
  const p1 = parseDate(v1), p2 = parseDate(v2);
  const msg = document.getElementById("compatMsg");
  if (!p1 || !p2) { msg.textContent = "Обе даты нужны в формате ДД.ММ.ГГГГ"; return; }
  msg.textContent = "";
  const z1 = zodiac(p1.day, p1.month), z2 = zodiac(p2.day, p2.month);
  const c1 = humanCode(v1), c2 = humanCode(v2);
  const score = compatibilityScore(c1, c2, z1, z2);
  const view = document.getElementById("compatView");
  let text = "Связь перспективная, если уважать особенности друг друга.";
  if (score >= 85) text = "Очень сильная совместимость.";
  else if (score < 55) text = "Совместимость непростая, но рабочая.";
  view.innerHTML = [
    card("Совместимость", `${score}%`, true),
    card("1 человек", `${z1} • код ${c1}`),
    card("2 человек", `${z2} • код ${c2}`),
    card("Описание", text)
  ].join("");
  view.classList.remove("hidden");
  addHistory("Совместимость", `${z1} + ${z2}`, `Результат: ${score}%`);
});

document.getElementById("luckyBtn").addEventListener("click", () => {
  const value = document.getElementById("luckyDate").value.trim();
  const p = parseDate(value);
  const msg = document.getElementById("luckyMsg");
  if (!p) { msg.textContent = "Введите дату в формате ДД.ММ.ГГГГ"; return; }
  msg.textContent = "";
  const z = zodiac(p.day, p.month);
  const code = humanCode(value);
  const lucky = luckyNum(z, code);
  const view = document.getElementById("luckyView");
  view.innerHTML = [
    card("Счастливое число", `${lucky}`, true),
    card("Детали", `${z} • код ${code}`)
  ].join("");
  view.classList.remove("hidden");
  addHistory("Счастливое число", `${z} • ${lucky}`, `Код человека: ${code}`);
});

function renderHistory() {
  const items = getHistory();
  const list = document.getElementById("historyList");
  if (!items.length) {
    list.innerHTML = `<div class="glass result-card">История пока пустая.</div>`;
    return;
  }
  list.innerHTML = items.map(item => `
    <div class="glass result-card">
      <div style="font-weight:700">${item.type}: ${item.title}</div>
      <div class="muted" style="margin:6px 0">${item.created_at}</div>
      <div>${item.preview}</div>
    </div>
  `).join("");
}
document.getElementById("refreshHistoryBtn").addEventListener("click", renderHistory);
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_HISTORY);
  renderHistory();
});

// Catch game
const catchBoard = document.getElementById("catchBoard");
const starBtn = document.getElementById("starBtn");
const catchOverlay = document.getElementById("catchOverlay");
const catchTimeEl = document.getElementById("catchTime");
const catchScoreEl = document.getElementById("catchScore");
const catchBestEl = document.getElementById("catchBest");

function getCatchBest() { return Number(localStorage.getItem(STORAGE_GAME_BEST) || 0); }
function setCatchBest(score) { localStorage.setItem(STORAGE_GAME_BEST, String(score)); }
function renderCatchBest() { catchBestEl.textContent = String(getCatchBest()); }
function moveStar() {
  const boardRect = catchBoard.getBoundingClientRect();
  const size = 64;
  const maxX = Math.max(0, boardRect.width - size - 10);
  const maxY = Math.max(0, boardRect.height - size - 10);
  starBtn.style.left = `${Math.random() * maxX}px`;
  starBtn.style.top = `${Math.random() * maxY}px`;
}
function stopCatch(saveHist=true) {
  clearInterval(catchTimer);
  clearInterval(catchMoveTimer);
  catchTimer = null;
  catchMoveTimer = null;
  starBtn.classList.add("hidden");
  catchOverlay.classList.remove("hidden");
  if (catchScore > getCatchBest()) {
    setCatchBest(catchScore);
    renderCatchBest();
  }
  catchOverlay.innerHTML = `<div><div class="game-overlay__title">Игра окончена</div><div class="game-overlay__text">Твой счёт: ${catchScore}. Лучший результат: ${getCatchBest()}.</div></div>`;
  if (saveHist) addHistory("Мини-игра", `Поймай звезду • ${catchScore} очков`, `Рекорд: ${getCatchBest()}`);
}
function startCatch() {
  if (catchTimer) stopCatch(false);
  haptic("medium");
  catchTimeLeft = 20;
  catchScore = 0;
  catchTimeEl.textContent = String(catchTimeLeft);
  catchScoreEl.textContent = "0";
  catchOverlay.classList.add("hidden");
  starBtn.classList.remove("hidden");
  moveStar();
  catchMoveTimer = setInterval(moveStar, 850);
  catchTimer = setInterval(() => {
    catchTimeLeft -= 1;
    catchTimeEl.textContent = String(catchTimeLeft);
    if (catchTimeLeft <= 0) stopCatch(true);
  }, 1000);
}
document.getElementById("startCatchBtn").addEventListener("click", startCatch);
document.getElementById("stopCatchBtn").addEventListener("click", () => stopCatch(true));
starBtn.addEventListener("click", () => {
  if (!catchTimer) return;
  haptic("light");
  catchScore += 1;
  catchScoreEl.textContent = String(catchScore);
  moveStar();
});

// Quiz game
function getQuizStats() {
  try { return JSON.parse(localStorage.getItem(STORAGE_QUIZ_STATS) || '{"correct":0,"wrong":0}'); } catch { return {correct:0, wrong:0}; }
}
function saveQuizStats(stats) { localStorage.setItem(STORAGE_QUIZ_STATS, JSON.stringify(stats)); }
function renderQuizStats() {
  const stats = getQuizStats();
  document.getElementById("quizCorrect").textContent = String(stats.correct);
  document.getElementById("quizWrong").textContent = String(stats.wrong);
}
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function newQuizQuestion() {
  currentQuiz = quizBank[Math.floor(Math.random() * quizBank.length)];
  document.getElementById("quizPrompt").textContent = currentQuiz.prompt;
  document.getElementById("quizMsg").textContent = "";
  const wrongSigns = shuffle(quizBank.filter(x => x.sign !== currentQuiz.sign)).slice(0, 3).map(x => x.sign);
  const options = shuffle([currentQuiz.sign, ...wrongSigns]);
  const wrap = document.getElementById("quizOptions");
  wrap.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;
    btn.addEventListener("click", () => answerQuiz(btn, opt));
    wrap.appendChild(btn);
  });
}
function answerQuiz(button, opt) {
  if (!currentQuiz) return;
  const stats = getQuizStats();
  const buttons = [...document.querySelectorAll(".quiz-option")];
  buttons.forEach(b => b.disabled = true);
  if (opt === currentQuiz.sign) {
    button.classList.add("correct");
    document.getElementById("quizMsg").textContent = `Верно! Это ${currentQuiz.sign}.`;
    stats.correct += 1;
    addHistory("Астро-угадайка", `Верно: ${currentQuiz.sign}`, currentQuiz.prompt);
    haptic("medium");
  } else {
    button.classList.add("wrong");
    const correctBtn = buttons.find(b => b.textContent === currentQuiz.sign);
    if (correctBtn) correctBtn.classList.add("correct");
    document.getElementById("quizMsg").textContent = `Не угадал. Правильный ответ: ${currentQuiz.sign}.`;
    stats.wrong += 1;
    addHistory("Астро-угадайка", `Ошибка`, `Правильный ответ: ${currentQuiz.sign}`);
    haptic("soft");
  }
  saveQuizStats(stats);
  renderQuizStats();
}
document.getElementById("newQuizBtn").addEventListener("click", () => {
  haptic("light");
  newQuizQuestion();
});

// Wheel game
const wheelDisc = document.getElementById("wheelDisc");
let wheelRotation = 0;
document.getElementById("spinWheelBtn").addEventListener("click", () => {
  haptic("medium");
  wheelRotation += 1440 + Math.floor(Math.random() * 1440);
  wheelDisc.style.transform = `rotate(${wheelRotation}deg)`;
  const msg = wheelMessages[Math.floor(Math.random() * wheelMessages.length)];
  setTimeout(() => {
    const wrap = document.getElementById("wheelResult");
    wrap.innerHTML = [
      card("Послание дня", msg, true),
      card("Совет", "Запомни это состояние и попробуй опереться на него сегодня.")
    ].join("");
    wrap.classList.remove("hidden");
    addHistory("Колесо удачи", "Послание дня", msg);
  }, 2200);
});

function setupStars() {
  const canvas = document.getElementById("starsCanvas");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let width = 0, height = 0;
  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.width = window.innerWidth * ratio;
    height = canvas.height = window.innerHeight * ratio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    stars = Array.from({ length: Math.max(70, Math.floor(window.innerWidth / 10)) }, () => ({
      x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.8 + .4, a: Math.random(), s: Math.random() * .015 + .002
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.a += star.s;
      const alpha = .35 + Math.abs(Math.sin(star.a)) * .65;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener("resize", resize);
  draw();
}

setupStars();
updateHomePreview();
renderProfile();
renderHistory();
renderCatchBest();
renderQuizStats();
