const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.MainButton.hide();
}

const STORAGE_PROFILE = "astro_beautiful_profile";

const codeMeanings = {
  1: "Лидер. Ты умеешь начинать, брать инициативу и вести за собой.",
  2: "Дипломат. Твоя сила — в мягкости, интуиции и умении чувствовать людей.",
  3: "Творец. Ты раскрываешься через идеи, слово, красоту и вдохновение.",
  4: "Опора. В тебе много устойчивости, дисциплины и способности строить систему.",
  5: "Движение. Тебе близки перемены, свобода и живая энергия обновления.",
  6: "Гармония. Ты умеешь заботиться, создавать тепло и поддерживать близких.",
  7: "Глубина. Твой дар — аналитика, мудрость и сильный внутренний мир.",
  8: "Сила. Ты умеешь влиять на реальность и добиваться конкретного результата.",
  9: "Мудрость. В тебе есть зрелость, человечность и способность завершать этапы.",
  11: "Вдохновение. Ты заряжаешь других своей интуицией и внутренним светом.",
  22: "Создатель. В тебе заложен потенциал для больших и устойчивых проектов.",
  33: "Проводник. Ты влияешь через добро, тепло и глубокую поддержку людей."
};

const personalMessages = {
  1: "Твой день лучше складывается, когда ты доверяешь себе и не откладываешь первый шаг.",
  2: "Твоя сила раскрывается в мягкости. Не обесценивай собственную чувствительность.",
  3: "Тебе важно проявляться. Там, где есть творчество, появляется и энергия.",
  4: "Твой путь строится через устойчивость. Маленькие шаги дают большой результат.",
  5: "Чем больше движения и обновления, тем живее становится твоя энергия.",
  6: "Не забывай давать себе столько же тепла, сколько ты даёшь другим.",
  7: "Доверься внутреннему голосу. Он часто видит глубже, чем внешний шум.",
  8: "У тебя есть мощная способность превращать намерение в результат.",
  9: "Твоя сила в мудрости и умении отпускать то, что уже не работает.",
  11: "Не прячь свой свет. Ты можешь вдохновлять даже просто своим присутствием.",
  22: "Не бойся большого масштаба. Ты способен строить по-настоящему значимые вещи.",
  33: "Ты умеешь лечить словом, вниманием и теплом. Это редкий дар."
};

function haptic(type = "light") {
  try {
    tg?.HapticFeedback?.impactOccurred(type);
  } catch {}
}

const screens = {
  home: document.getElementById("screen-home"),
  "profile-edit": document.getElementById("screen-profile-edit"),
  "profile-view": document.getElementById("screen-profile-view"),
};

const navButtons = document.querySelectorAll(".nav-btn");
const menuJumps = document.querySelectorAll(".menu-jump");
const backBtn = document.getElementById("backBtn");
const homeBtn = document.getElementById("homeBtn");

let screenHistory = ["home"];
let currentScreen = "home";

function updateControls() {
  const onHome = currentScreen === "home";
  backBtn.classList.toggle("hidden", onHome);
  homeBtn.classList.toggle("hidden", onHome);

  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === currentScreen);
  });
}

function showScreen(name, push = true) {
  if (!screens[name]) return;
  haptic("light");
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
  if (push && currentScreen !== name) screenHistory.push(name);
  currentScreen = name;
  updateControls();
  if (name === "profile-view") renderProfileCard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBack() {
  haptic("soft");
  if (screenHistory.length > 1) {
    screenHistory.pop();
    showScreen(screenHistory[screenHistory.length - 1], false);
  } else {
    showScreen("home", false);
  }
}

navButtons.forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.target)));
menuJumps.forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.target)));
backBtn.addEventListener("click", goBack);
homeBtn.addEventListener("click", () => {
  haptic("soft");
  screenHistory = ["home"];
  showScreen("home", false);
});

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

function calcLuckyNumber(zodiac, code) {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const base = [...zodiac].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + code * 9 + seed;
  return (base % 9) + 1;
}

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

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

function updateHomePreview() {
  const profile = getProfile();
  if (!profile) {
    setText("homePreviewText", "Профиль ещё не заполнен");
    return;
  }
  const parsed = parseDate(profile.birthdate);
  const zodiac = parsed ? getZodiac(parsed.day, parsed.month) : "—";
  const code = getHumanCode(profile.birthdate);
  setText("homePreviewText", `${profile.name || "Без имени"} • ${profile.birthdate} • ${zodiac} • код ${code}`);
}

function renderProfileCard() {
  const profile = getProfile();
  const empty = document.getElementById("emptyProfile");
  const card = document.getElementById("profileCard");

  if (!profile) {
    empty.classList.remove("hidden");
    card.classList.add("hidden");
    return;
  }

  const parsed = parseDate(profile.birthdate);
  if (!parsed) {
    empty.classList.remove("hidden");
    card.classList.add("hidden");
    return;
  }

  const zodiac = getZodiac(parsed.day, parsed.month);
  const code = getHumanCode(profile.birthdate);
  const lucky = calcLuckyNumber(zodiac, code);
  const firstLetter = (profile.name?.trim()?.[0] || "A").toUpperCase();

  empty.classList.add("hidden");
  card.classList.remove("hidden");

  setText("avatarLetter", firstLetter);
  setText("cardName", profile.name || "Без имени");
  setText("cardZodiac", zodiac);
  setText("cardBirthdate", profile.birthdate);
  setText("cardCode", String(code));
  setText("cardLucky", String(lucky));
  setText("cardMeaning", codeMeanings[code] || "Твой код связан с внутренней силой, ростом и личной реализацией.");
  setText("cardMessage", personalMessages[code] || "Доверяй себе и своему пути. Внутри тебя уже есть нужный ресурс.");

  const today = new Date().toLocaleDateString("ru-RU");
  setText("cardToday", today);
}

document.getElementById("saveProfileBtn").addEventListener("click", () => {
  haptic("medium");
  setError("profileError");
  setSuccess("profileSuccess");

  const name = document.getElementById("profileName").value.trim();
  const birthdate = document.getElementById("profileBirthdate").value.trim();

  if (!name) {
    setError("profileError", "Введите имя");
    return;
  }

  if (!parseDate(birthdate)) {
    setError("profileError", "Введите дату в формате ДД.ММ.ГГГГ");
    return;
  }

  saveProfile({ name, birthdate });
  updateHomePreview();
  renderProfileCard();
  setSuccess("profileSuccess", "Профиль сохранён");
  showScreen("profile-view");
});

document.getElementById("clearProfileBtn").addEventListener("click", () => {
  haptic("medium");
  clearProfile();
  document.getElementById("profileName").value = "";
  document.getElementById("profileBirthdate").value = "";
  updateHomePreview();
  renderProfileCard();
  setError("profileError");
  setSuccess("profileSuccess", "Профиль очищен");
});

function preloadProfile() {
  const tgUser = tg?.initDataUnsafe?.user;
  const profile = getProfile();

  if (profile) {
    document.getElementById("profileName").value = profile.name || "";
    document.getElementById("profileBirthdate").value = profile.birthdate || "";
  } else if (tgUser?.first_name) {
    document.getElementById("profileName").value = tgUser.first_name;
  }
}

function setupStars() {
  const canvas = document.getElementById("starsCanvas");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let width = 0;
  let height = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.width = window.innerWidth * ratio;
    height = canvas.height = window.innerHeight * ratio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    stars = Array.from({ length: Math.max(70, Math.floor(window.innerWidth / 10)) }, () => ({
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
preloadProfile();
updateHomePreview();
renderProfileCard();
updateControls();
