const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.MainButton.hide(); }

const STORAGE_PROFILE = "astro_nodb_profile";
const STORAGE_HISTORY = "astro_nodb_history";

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

const screens = {
  home: document.getElementById("screen-home"),
  profile: document.getElementById("screen-profile"),
  forecast: document.getElementById("screen-forecast"),
  compatibility: document.getElementById("screen-compatibility"),
  lucky: document.getElementById("screen-lucky"),
  history: document.getElementById("screen-history"),
};

let stack = ["home"];
let current = "home";

function haptic(type="light") {
  try { tg?.HapticFeedback?.impactOccurred(type); } catch {}
}
function show(name, push=true) {
  if (!screens[name]) return;
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  if (push && current !== name) stack.push(name);
  current = name;
  document.getElementById("backBtn").classList.toggle("hidden", current === "home");
  document.getElementById("homeBtn").classList.toggle("hidden", current === "home");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.target === name));
  if (name === "profile") renderProfile();
  if (name === "history") renderHistory();
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
function getProfile() {
  try { return JSON.parse(localStorage.getItem(STORAGE_PROFILE) || "null"); } catch { return null; }
}
function saveProfile(profile) {
  localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
}
function clearProfile() {
  localStorage.removeItem(STORAGE_PROFILE);
}
function getHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]"); } catch { return []; }
}
function saveHistory(items) {
  localStorage.setItem(STORAGE_HISTORY, JSON.stringify(items.slice(0,20)));
}
function addHistory(type, title, preview) {
  const items = getHistory();
  items.unshift({type, title, preview, created_at: new Date().toLocaleString("ru-RU")});
  saveHistory(items);
}
function card(title, body) {
  return `<div class="glass result-card"><div style="font-weight:700;margin-bottom:8px">${title}</div><div>${body}</div></div>`;
}
function profileCard(profile) {
  return `
    <div class="profile-head">
      <div class="avatar">${(profile.name?.[0] || "A").toUpperCase()}</div>
      <div>
        <div class="profile-name">${profile.name}</div>
        <div class="muted">${profile.zodiac}</div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><span>Дата рождения</span><strong>${profile.birthdate}</strong></div>
      <div class="stat"><span>Код человека</span><strong>${profile.code}</strong></div>
      <div class="stat"><span>Счастливое число</span><strong>${profile.lucky}</strong></div>
    </div>
    <div class="glass result-card"><div style="font-weight:700;margin-bottom:8px">Описание кода</div><div>${codeMeanings[profile.code] || "Личный путь роста и самореализации."}</div></div>
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
    card("Код судьбы", codeMeanings[code] || "Личный путь роста и самореализации.")
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
    card("Совместимость", `${score}%`),
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
    card("Счастливое число", `${lucky}`),
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
