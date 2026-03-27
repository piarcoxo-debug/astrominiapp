const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.MainButton.hide();
}

const STORAGE_PROFILE = "astro_profile";
const STORAGE_HISTORY = "astro_history";

const zodiacTexts = {
  "Овен": { love: "Сегодня в любви важны прямота и уважение. Спокойный честный разговор даст больше, чем давление.", money: "День подходит для быстрых решений, если они опираются на факты. Избегай импульсивных покупок.", energy: "Энергии много, но её лучше направить в одну главную цель." },
  "Телец": { love: "Тепло и стабильность сегодня особенно важны. Маленький знак внимания укрепит близость.", money: "Практичные решения принесут лучший результат. Не спеши с риском.", energy: "Размеренный темп — твой плюс. Через спокойствие ты сделаешь больше." },
  "Близнецы": { love: "Общение станет ключом к гармонии. Чем честнее слова, тем легче день.", money: "Сравнивай варианты и собирай информацию. Новая идея может оказаться ценной.", energy: "Сила дня — в гибкости. Переключайся осознанно, а не хаотично." },
  "Рак": { love: "Сегодня особенно важно слышать не только слова, но и чувства.", money: "Избегай эмоциональных решений в финансах. Спокойный расчёт даст больше уверенности.", energy: "День подходит для восстановления и заботы о себе." },
  "Лев": { love: "Харизма притягивает внимание, но искренность удерживает близость.", money: "Можно уверенно двигаться к амбициозной цели, если не переоценивать ресурсы.", energy: "Энергия дня поддерживает лидерство и проявленность." },
  "Дева": { love: "Забота и внимание к деталям скажут больше длинных слов.", money: "Хороший день для порядка в бюджете, планов и расчётов.", energy: "Собранность станет источником силы." },
  "Весы": { love: "Баланс между своими и чужими желаниями сегодня особенно важен.", money: "Сначала оцени, где твоя реальная выгода, и только потом соглашайся.", energy: "Гармония внутри влияет на всё вокруг." },
  "Скорпион": { love: "Чувства могут быть глубокими, но сегодня полезна деликатность.", money: "День подходит для анализа, стратегии и скрытых возможностей.", energy: "Твоя энергия мощная, если направлена осознанно." },
  "Стрелец": { love: "Лёгкость и открытость оживят отношения. Скажи то, что давно хотелось.", money: "Есть шанс увидеть новый путь к росту. Смотри шире, но не забывай о деталях.", energy: "День подталкивает к движению и смелым идеям." },
  "Козерог": { love: "Надёжность сегодня говорит громче романтики.", money: "Сильный день для целей, дисциплины и долгих стратегий.", energy: "Последовательность принесёт лучший результат." },
  "Водолей": { love: "Нестандартный взгляд поможет освежить отношения.", money: "Интересная идея может открыть новую возможность, если проверить её на практике.", energy: "Сегодня особенно сильны вдохновение и интеллектуальная активность." },
  "Рыбы": { love: "Интуиция в любви сегодня работает особенно тонко.", money: "Лучше держаться понятных решений и не уходить в туманные обещания.", energy: "День поддерживает творчество и мягкое движение вперёд." }
};

const motivationByCode = {
  1: "Ты создан для инициативы. Один уверенный шаг сегодня меняет больше, чем долгие сомнения.",
  2: "Твоя сила не в шуме, а в чуткости. Именно это сегодня даст тебе преимущество.",
  3: "Твоя энергия раскрывается через слово, идею и творчество. Позволь себе быть заметным.",
  4: "Каждый небольшой шаг укрепляет твою опору. Система сегодня работает на тебя.",
  5: "Перемены открывают новые возможности. Доверься движению жизни.",
  6: "Ты умеешь создавать гармонию. Не забывай направлять эту заботу и на себя.",
  7: "Твоя глубина — это дар. Доверься внутреннему голосу.",
  8: "Ты способен влиять на реальность через намерение и действие. Держи курс.",
  9: "Сила дня — в завершении и мудрости. Освободи место для нового этапа.",
  11: "Ты можешь вдохновлять других просто тем, что не прячешь свой свет.",
  22: "В тебе есть масштаб создателя. Не недооценивай свои идеи.",
  33: "Твоя доброта — это сила. Сегодня она особенно ценна."
};

const screens = {
  home: document.getElementById("screen-home"),
  daily: document.getElementById("screen-daily"),
  forecast: document.getElementById("screen-forecast"),
  profile: document.getElementById("screen-profile"),
  history: document.getElementById("screen-history"),
  compatibility: document.getElementById("screen-compatibility"),
  lucky: document.getElementById("screen-lucky"),
};

const navButtons = document.querySelectorAll(".nav-btn");
const menuCards = document.querySelectorAll(".menu-card");
const backBtn = document.getElementById("backBtn");
const homeBtn = document.getElementById("homeBtn");

let historyStack = ["home"];
let currentScreen = "home";

function updateControls() {
  const onHome = currentScreen === "home";
  backBtn.classList.toggle("hidden", onHome);
  homeBtn.classList.toggle("hidden", onHome);

  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === currentScreen || (["forecast","compatibility","lucky"].includes(currentScreen) && btn.dataset.target === "home"));
  });
}

function showScreen(name, push = true) {
  if (!screens[name]) return;
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");

  if (push && currentScreen !== name) historyStack.push(name);
  currentScreen = name;
  updateControls();
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (name === "history") renderHistory();
  if (name === "profile") renderProfile();
}

function goBack() {
  if (historyStack.length > 1) {
    historyStack.pop();
    const prev = historyStack[historyStack.length - 1];
    showScreen(prev, false);
  } else {
    showScreen("home", false);
  }
}

navButtons.forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.target)));
menuCards.forEach(card => card.addEventListener("click", () => showScreen(card.dataset.target)));
backBtn.addEventListener("click", goBack);
homeBtn.addEventListener("click", () => {
  historyStack = ["home"];
  showScreen("home", false);
});

function setError(id, text = "") {
  const el = document.getElementById(id);
  if (!text) {
    el.classList.add("hidden");
    el.textContent = "";
  } else {
    el.textContent = text;
    el.classList.remove("hidden");
  }
}

function setSuccess(id, text = "") {
  const el = document.getElementById(id);
  if (!text) {
    el.classList.add("hidden");
    el.textContent = "";
  } else {
    el.textContent = text;
    el.classList.remove("hidden");
  }
}

function parseDate(value) {
  const match = value.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return { day, month, year };
}

function getZodiac(day, month) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Овен";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Телец";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Близнецы";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Рак";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Лев";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Дева";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Весы";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Скорпион";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Стрелец";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Козерог";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Водолей";
  return "Рыбы";
}

function getHumanCode(dateStr) {
  const digits = dateStr.replace(/\D/g, "").split("").map(Number);
  let total = digits.reduce((a, b) => a + b, 0);
  while (total > 9 && ![11, 22, 33].includes(total)) {
    total = String(total).split("").map(Number).reduce((a, b) => a + b, 0);
  }
  return total;
}

function daySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function calcLuckyNumber(zodiac, code) {
  const base = [...zodiac].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + code * 9 + daySeed();
  return (base % 9) + 1;
}

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PROFILE) || "null");
  } catch {
    return null;
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
}

function clearProfile() {
  localStorage.removeItem(STORAGE_PROFILE);
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_HISTORY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(items) {
  localStorage.setItem(STORAGE_HISTORY, JSON.stringify(items.slice(0, 20)));
}

function addHistoryItem(item) {
  const items = getHistory();
  items.unshift(item);
  saveHistory(items);
}

function clearHistory() {
  localStorage.removeItem(STORAGE_HISTORY);
}

function todayLabel() {
  return new Date().toLocaleDateString("ru-RU");
}

function createForecast(dateStr, name = "") {
  const parsed = parseDate(dateStr);
  if (!parsed) return null;

  const zodiac = getZodiac(parsed.day, parsed.month);
  const code = getHumanCode(dateStr);
  const lucky = calcLuckyNumber(zodiac, code);
  const texts = zodiacTexts[zodiac];
  const motivation = motivationByCode[code] || "Сегодня важно доверять себе и не занижать свою внутреннюю силу.";

  return {
    name,
    date: todayLabel(),
    birthdate: dateStr,
    zodiac,
    code,
    lucky,
    love: texts.love,
    money: texts.money,
    energy: texts.energy,
    motivation,
  };
}

function renderHomeProfile() {
  const profile = getProfile();
  const text = document.getElementById("homeProfileText");
  if (!profile) {
    text.textContent = "Пока не заполнен";
    return;
  }
  const parsed = parseDate(profile.birthdate);
  const zodiac = parsed ? getZodiac(parsed.day, parsed.month) : "—";
  text.textContent = `${profile.name || "Без имени"} • ${profile.birthdate} • ${zodiac}`;
}

function renderProfile() {
  const profile = getProfile();
  const current = document.getElementById("profileCurrent");
  if (!profile) {
    current.textContent = "Профиль пока не сохранён.";
    return;
  }
  const parsed = parseDate(profile.birthdate);
  const zodiac = parsed ? getZodiac(parsed.day, parsed.month) : "—";
  const code = getHumanCode(profile.birthdate);
  current.textContent = `${profile.name || "Без имени"} • ${profile.birthdate} • ${zodiac} • код ${code}`;
}

document.getElementById("saveProfileBtn").addEventListener("click", () => {
  setError("profileError");
  setSuccess("profileSuccess");

  const name = document.getElementById("profileName").value.trim();
  const birthdate = document.getElementById("profileBirthdate").value.trim();

  if (!parseDate(birthdate)) {
    setError("profileError", "Введите дату в формате ДД.ММ.ГГГГ");
    return;
  }

  saveProfile({ name, birthdate });
  renderHomeProfile();
  renderProfile();
  setSuccess("profileSuccess", "Профиль сохранён.");
});

document.getElementById("clearProfileBtn").addEventListener("click", () => {
  clearProfile();
  document.getElementById("profileName").value = "";
  document.getElementById("profileBirthdate").value = "";
  renderHomeProfile();
  renderProfile();
  setSuccess("profileSuccess", "Профиль очищен.");
  setError("profileError");
});

document.getElementById("dailyBtn").addEventListener("click", () => {
  setError("dailyError");
  const profile = getProfile();
  if (!profile || !parseDate(profile.birthdate)) {
    setError("dailyError", "Сначала сохрани дату рождения в профиле.");
    return;
  }

  const forecast = createForecast(profile.birthdate, profile.name || "");
  document.getElementById("dailyDateLabel").textContent = forecast.date;
  document.getElementById("dailyTodayBadge").textContent = "Сегодня";
  document.getElementById("dailyName").textContent = forecast.name || "—";
  document.getElementById("dailyZodiac").textContent = forecast.zodiac;
  document.getElementById("dailyCode").textContent = String(forecast.code);
  document.getElementById("dailyLucky").textContent = String(forecast.lucky);
  document.getElementById("dailyLove").textContent = forecast.love;
  document.getElementById("dailyMoney").textContent = forecast.money;
  document.getElementById("dailyEnergy").textContent = forecast.energy;
  document.getElementById("dailyMotivation").textContent = forecast.motivation;
  document.getElementById("dailyResult").classList.remove("hidden");

  addHistoryItem({
    type: "Ежедневный прогноз",
    title: forecast.name ? `${forecast.name} • ${forecast.zodiac}` : forecast.zodiac,
    date: forecast.date,
    preview: `${forecast.love} ${forecast.motivation}`,
  });
});

document.getElementById("forecastBtn").addEventListener("click", () => {
  setError("forecastError");
  const value = document.getElementById("forecastDate").value.trim();
  const forecast = createForecast(value);
  if (!forecast) {
    setError("forecastError", "Введите дату в формате ДД.ММ.ГГГГ");
    return;
  }

  document.getElementById("forecastDateLabel").textContent = forecast.date;
  document.getElementById("forecastZodiac").textContent = forecast.zodiac;
  document.getElementById("forecastCode").textContent = String(forecast.code);
  document.getElementById("forecastLucky").textContent = String(forecast.lucky);
  document.getElementById("forecastLove").textContent = forecast.love;
  document.getElementById("forecastMoney").textContent = forecast.money;
  document.getElementById("forecastEnergy").textContent = forecast.energy;
  document.getElementById("forecastMotivation").textContent = forecast.motivation;
  document.getElementById("forecastResult").classList.remove("hidden");

  addHistoryItem({
    type: "Разовый прогноз",
    title: `${forecast.zodiac} • код ${forecast.code}`,
    date: forecast.date,
    preview: `${forecast.money} ${forecast.energy}`,
  });
});

function compatibilityScore(code1, code2, zodiac1, zodiac2) {
  let score = 52;
  const diff = Math.abs(code1 - code2);
  score += Math.max(0, 20 - diff * 2);
  const groups = [
    ["Овен", "Лев", "Стрелец"],
    ["Телец", "Дева", "Козерог"],
    ["Близнецы", "Весы", "Водолей"],
    ["Рак", "Скорпион", "Рыбы"],
  ];
  if (zodiac1 === zodiac2) score += 15;
  else {
    for (const group of groups) {
      if (group.includes(zodiac1) && group.includes(zodiac2)) {
        score += 12;
        break;
      }
    }
  }
  return Math.max(1, Math.min(99, score));
}

function compatibilityText(score) {
  if (score >= 85) return "Очень сильная совместимость. Между вами легко возникает понимание и хороший эмоциональный контакт.";
  if (score >= 70) return "Хорошая совместимость. У пары высокий потенциал при уважении особенностей друг друга.";
  if (score >= 55) return "Средняя совместимость. Связь перспективная, но потребует зрелости и честного диалога.";
  return "Совместимость непростая, но рабочая. Важны терпение, уважение границ и открытый разговор.";
}

document.getElementById("compatBtn").addEventListener("click", () => {
  setError("compatError");
  const value1 = document.getElementById("compatDate1").value.trim();
  const value2 = document.getElementById("compatDate2").value.trim();
  const parsed1 = parseDate(value1);
  const parsed2 = parseDate(value2);

  if (!parsed1 || !parsed2) {
    setError("compatError", "Обе даты нужно ввести в формате ДД.ММ.ГГГГ");
    return;
  }

  const zodiac1 = getZodiac(parsed1.day, parsed1.month);
  const zodiac2 = getZodiac(parsed2.day, parsed2.month);
  const code1 = getHumanCode(value1);
  const code2 = getHumanCode(value2);
  const score = compatibilityScore(code1, code2, zodiac1, zodiac2);

  document.getElementById("compatScore").textContent = `${score}%`;
  document.getElementById("compatText").textContent = compatibilityText(score);
  document.getElementById("compatPerson1").textContent = `${zodiac1}, код ${code1}`;
  document.getElementById("compatPerson2").textContent = `${zodiac2}, код ${code2}`;
  document.getElementById("compatResult").classList.remove("hidden");

  addHistoryItem({
    type: "Совместимость",
    title: `${zodiac1} + ${zodiac2}`,
    date: todayLabel(),
    preview: `Результат: ${score}%`,
  });
});

document.getElementById("luckyBtn").addEventListener("click", () => {
  setError("luckyError");
  const value = document.getElementById("luckyDate").value.trim();
  const parsed = parseDate(value);
  if (!parsed) {
    setError("luckyError", "Введите дату в формате ДД.ММ.ГГГГ");
    return;
  }

  const zodiac = getZodiac(parsed.day, parsed.month);
  const code = getHumanCode(value);
  const lucky = calcLuckyNumber(zodiac, code);

  document.getElementById("luckyValue").textContent = String(lucky);
  document.getElementById("luckyMeta").textContent = `Знак: ${zodiac} • Код человека: ${code}`;
  document.getElementById("luckyResult").classList.remove("hidden");

  addHistoryItem({
    type: "Счастливое число",
    title: `${zodiac} • число ${lucky}`,
    date: todayLabel(),
    preview: `Код человека: ${code}`,
  });
});

function renderHistory() {
  const list = document.getElementById("historyList");
  const empty = document.getElementById("historyEmpty");
  const items = getHistory();

  list.innerHTML = "";
  if (!items.length) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "glass history-item";
    div.innerHTML = `
      <div class="history-item__title">${item.type}: ${item.title}</div>
      <div class="history-item__meta">${item.date}</div>
      <div class="history-item__preview">${item.preview}</div>
    `;
    list.appendChild(div);
  });
}

document.getElementById("refreshHistoryBtn").addEventListener("click", renderHistory);
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  clearHistory();
  renderHistory();
});

function preloadProfileForm() {
  const profile = getProfile();
  if (!profile) return;
  document.getElementById("profileName").value = profile.name || "";
  document.getElementById("profileBirthdate").value = profile.birthdate || "";
}

function setupStars() {
  const canvas = document.getElementById("starsCanvas");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let width = 0;
  let height = 0;

  function resize() {
    width = canvas.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    height = canvas.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2);
    stars = Array.from({ length: Math.max(80, Math.floor(window.innerWidth / 10)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random(),
      s: Math.random() * 0.015 + 0.002,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.a += star.s;
      const alpha = 0.35 + Math.abs(Math.sin(star.a)) * 0.65;
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
preloadProfileForm();
renderHomeProfile();
renderProfile();
renderHistory();
updateControls();
