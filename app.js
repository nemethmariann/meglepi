// ====== BEÁLLÍTÁSOK – itt lehet egyszerűen átírni ======
const CONFIG = {
  date: "2026. október 28., 17:00",
  // a te címed: ezzel mindig tovább lehet lépni, és bekapcsolja a teszt módot
  owner: "nemeth.macika@gmail.com",
  // csak ezekkel az email címekkel lehet továbblépni
  // photo: az arckép helye az images/arcok/ mappában
  guests: {
    "nagy.emma.jdc.2005@gmail.com": { location: "Bakáts tér",                          photo: "images/arcok/nagy.emma.jpg" },
    "kovacsvivienn256@gmail.com":   { location: "Fővám tér",                           photo: "images/arcok/kovacs.vivienn.jpg" },
    "vass.luca2006@gmail.com":      { location: "Károlyi-kert",                        photo: "images/arcok/vass.luca.jpg" },
    "szemandorka63@gmail.com":      { location: "Egyetem tér",                         photo: "images/arcok/szeman.dorka.jpg" },
    "aczelanna09@gmail.com":        { location: "Nehru part (a Bálna felőli oldala)",  photo: "images/arcok/aczel.anna.jpg" },
    "hajdureka2006@gmail.com":      { location: "Kálvin tér",                          photo: "images/arcok/hajdu.reka.jpg" },
    "lenartdora36@gmail.com":       { location: "Bástya park",                         photo: "images/arcok/lenart.dora.jpg" },
    "konya.eszter93@gmail.com":     { location: "Ferenciek tere",                      photo: "images/arcok/konya.eszter.jpg" },
    "lehotaeszter13@gmail.com":     { location: "Múzeumkert",                          photo: "images/arcok/lehota.eszter.jpg" },
  },
  // a te teszteléseidhez ezekből sorsol egyet
  locations: [
    "Múzeumkert", "Egyetem tér", "Kálvin tér", "Károlyi-kert", "Ferenciek tere",
    "Bakáts tér", "Fővám tér", "Nehru part (a Bálna felőli oldala)", "Bástya park",
  ],
  ownerPhoto: "images/arcok/nemeth.macika.jpg",
};

const STORAGE_KEY = "lanybucsu-v2";
const TEST_KEY = "lanybucsu-teszt";

const store = {
  load(key = STORAGE_KEY) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  save(data, key = STORAGE_KEY) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  },
  clear(key = STORAGE_KEY) {
    try { localStorage.removeItem(key); } catch {}
  },
};

let state = store.load() || {};

// ---------- Teszt mód ----------
// Bekapcsol: helyi fájlként / localhoston, ?teszt a címben, vagy ha a te email címeddel töltöd ki.
// ?vendeg a címben: kikapcsolja, így látod, amit a vendégek.
const params = new URLSearchParams(location.search);
if (params.has("teszt")) store.save(true, TEST_KEY);
if (params.has("vendeg")) store.clear(TEST_KEY);
function isTestMode() {
  if (params.has("vendeg")) return false;
  return (
    location.protocol === "file:" ||
    ["localhost", "127.0.0.1"].includes(location.hostname) ||
    store.load(TEST_KEY) === true
  );
}
function applyTestMode() {
  document.body.classList.toggle("test", isTestMode());
}
applyTestMode();

document.getElementById("testReset").addEventListener("click", () => {
  store.clear();
  location.href = location.pathname + location.search;
});

// ---------- Navigáció ----------
// Nincs böngésző-előzmény: a vissza gomb nem visz vissza egy korábbi lépésre,
// újratöltésnél pedig ott folytatódik, ahol abbahagyta.
const PAGES = ["page-welcome", "page-form", "page-terms", "page-ticket", "page-dino", "page-big"];

function show(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("active", p.id === id));
  window.scrollTo({ top: 0 });
  state.page = id;
  store.save(state);
  document.body.classList.toggle("night", id === "page-big");
  if (id === "page-ticket" || id === "page-big") renderTickets();
  if (id === "page-dino") startDino();
  if (id === "page-big") startBigReveal();
}

document.querySelectorAll("[data-go]").forEach((btn) =>
  btn.addEventListener("click", () => show(btn.dataset.go))
);

// ---------- Kezdőoldal: helyőrző, ha még nincs fotó ----------
document.querySelectorAll(".polaroid img").forEach((img) => {
  const fallback = () => {
    const ph = document.createElement("div");
    ph.className = "ph";
    ph.textContent = "Kép helye";
    img.replaceWith(ph);
  };
  if (img.complete && img.naturalWidth === 0) fallback();
  else img.addEventListener("error", fallback);
});

// ---------- Lebegő szívecskék ----------
(function sparkles() {
  const box = document.querySelector(".sparkles");
  const icons = ["♥", "✦", "♥", "•"];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.textContent = icons[i % icons.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 12 + Math.random() * 18 + "px";
    s.style.animationDuration = 10 + Math.random() * 14 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    box.appendChild(s);
  }
})();

// ---------- Kérdőív ----------
const form = document.getElementById("form");
const range = document.getElementById("emailScore");
const rangeOut = document.getElementById("emailScoreOut");
const rangeHint = document.getElementById("emailScoreHint");
const funnyYes = document.getElementById("funnyYes");
const funnyNo = document.getElementById("funnyNo");
const funnyHint = document.getElementById("funnyHint");
const dateBtns = document.querySelectorAll("[data-date]");
const formError = document.getElementById("formError");

const scoreHints = {
  1: "We're no strangers to love",
  2: "You know the rules and so do I",
  3: "A full commitment's what I'm thinking of",
  4: "You wouldn't get this from any other guy",
  5: "I just wanna tell you how I'm feeling",
  6: "Gotta make you understand",
  7: "Never gonna give you up, Never gonna let you down",
  8: "Never gonna run around and desert you",
  9: "Never gonna make you cry",
  10: "Never gonna say goodbye",
};
function updateRange() {
  rangeOut.textContent = range.value;
  rangeHint.textContent = scoreHints[range.value];
}
range.addEventListener("input", updateRange);

// vicces kérdés: a "Nem" gomb elmenekül
let funnyAnswer = null;
let dodges = 0;
const noTexts = ["Nem", "Deeeee!", "Na halooo", ">:(", "RaaaAAaaAAH", "Dehogyneeeem!"];

function selectFunnyYes(hint) {
  funnyAnswer = "igen";
  funnyYes.classList.add("selected");
  funnyHint.textContent = hint;
}
funnyYes.addEventListener("click", () => selectFunnyYes("Nagyon helyeeees!🥳"));

function dodge() {
  dodges++;
  const x = (Math.random() * 160 - 40).toFixed(0);
  const y = (Math.random() * 60 - 30).toFixed(0);
  funnyNo.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 30 - 15}deg)`;
  funnyNo.textContent = noTexts[Math.min(dodges, noTexts.length - 1)];
  funnyYes.style.transform = `scale(${Math.min(1 + dodges * 0.08, 1.5)})`;
}
funnyNo.addEventListener("mouseenter", dodge);
funnyNo.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });
// ha valahogy mégis rákattint (pl. billentyűzettel)
funnyNo.addEventListener("click", () => selectFunnyYes("Semmi baj, ez akkor is egy 'igen' lesz! 💖"));

// ráérsz okt. 28-án?
let dateAnswer = null;
function selectDate(value) {
  dateAnswer = value;
  dateBtns.forEach((b) => b.classList.toggle("selected", b.dataset.date === value));
}
dateBtns.forEach((b) => b.addEventListener("click", () => selectDate(b.dataset.date)));

// korábbi kitöltés visszatöltése (újratöltésnél)
if (state.answers) {
  for (const k of ["name", "email", "address", "emailScore"]) {
    if (state.answers[k] != null) form.elements[k].value = state.answers[k];
  }
  if (state.answers.funny) selectFunnyYes("");
  if (state.answers.available) selectDate(state.answers.available);
}
updateRange();

const normEmail = (e) => e.trim().toLowerCase();
const isAllowed = (email) => email === CONFIG.owner || Object.hasOwn(CONFIG.guests, email);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formError.hidden = true;
  let ok = true;
  ["name", "email", "address"].forEach((n) => {
    const el = form.elements[n];
    const valid = el.value.trim() && el.checkValidity();
    el.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  if (!ok) return showError("Lécci Lécci töltsd ki az összes mezőt!😽");

  const email = normEmail(form.elements.email.value);
  if (!isAllowed(email)) {
    form.elements.email.classList.add("invalid");
    return showError("Lécci lécci azt az emailt add meg, amire a meghívót kaptad!");
  }
  if (!funnyAnswer) return showError("Lécci lécci minden kérdésre válaszolj!");
  if (!dateAnswer) return showError("Lécci lécci minden kérdésre válaszolj!");

  if (email === CONFIG.owner) {
    store.save(true, TEST_KEY);
    applyTestMode();
  }

  state.answers = {
    name: form.elements.name.value.trim(),
    email,
    address: form.elements.address.value.trim(),
    emailScore: range.value,
    funny: funnyAnswer,
    available: dateAnswer,
  };
  show("page-terms");
});
form.querySelectorAll("input, textarea").forEach((el) =>
  el.addEventListener("input", () => el.classList.remove("invalid"))
);
function showError(msg) {
  formError.textContent = msg;
  formError.hidden = false;
}

// ---------- Feltételek ----------
const acceptPrivacy = document.getElementById("acceptPrivacy");
const acceptJob = document.getElementById("acceptJob");
const acceptBtn = document.getElementById("acceptBtn");
function updateAccept() {
  acceptBtn.disabled = !(acceptPrivacy.checked && acceptJob.checked);
}
[acceptPrivacy, acceptJob].forEach((c) => c.addEventListener("change", updateAccept));

acceptBtn.addEventListener("click", () => {
  const email = state.answers.email;
  const guest = CONFIG.guests[email];
  state.locked = true;
  state.serial = state.serial || "JF-" + String(Math.floor(Math.random() * 9000) + 1000);
  state.location = guest
    ? guest.location
    : CONFIG.locations[Math.floor(Math.random() * CONFIG.locations.length)];
  state.photo = guest ? guest.photo : CONFIG.ownerPhoto;
  state.acceptedAt = new Date().toISOString();

  if (state.answers.available === "igen") {
    show("page-ticket");
    confetti();
  } else {
    show("page-dino");
  }
});

// ---------- Dínó animáció ----------
// besétál a dínó -> megtalálja a jegygyűrűt -> féltérdre ereszkedik és feléd nyújtja
// -> rákattintasz -> szárnyai nőnek és elrepül -> tűzijáték
const dinoStage = document.getElementById("dinoStage");
const ring = document.getElementById("ring");
const ringBurst = document.getElementById("ringBurst");
let dinoTimers = [];
let ringReady = false;

const dinoAt = (ms, fn) => dinoTimers.push(setTimeout(fn, ms));
const setStage = (classes) => (dinoStage.className = "dino-stage " + classes);

function startDino() {
  dinoTimers.forEach(clearTimeout);
  dinoTimers = [];
  ringReady = false;
  ring.tabIndex = -1;
  setStage("walk");
  dinoAt(2000, () => setStage("find"));
  dinoAt(3300, () => setStage("find kneel"));
  // amikor a gyűrű odaért a kezéhez: szikraeső
  dinoAt(4900, () => {
    burst(ringBurst, "✦", ["#f6dd9c", "#d9a441", "#fff"], 20);
    ringReady = true;
    ring.tabIndex = 0;
  });
}

ring.addEventListener("click", () => {
  if (!ringReady) return;
  ringReady = false;
  ring.tabIndex = -1;
  burst(ringBurst, "♥", ["#f0569a", "#ff9fc4", "#b3266a"], 16);
  dinoAt(200, () => burst(ringBurst, "✦", ["#f6dd9c", "#fff"], 14));
  setStage("find kneel yes");
  dinoAt(600, () => setStage("find yes fly"));
  dinoAt(1100, () => dinoTimers.push(setInterval(trailHeart, 90)));
  dinoAt(3300, () => {
    dinoTimers.forEach(clearTimeout);
    show("page-big");
  });
});

// szívecskék/szikrák minden irányba
function burst(container, char, colors, count) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement("span");
    h.textContent = char;
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 180;
    h.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    h.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    h.style.setProperty("--r", Math.random() * 120 - 60 + "deg");
    h.style.setProperty("--s", 14 + Math.random() * 22 + "px");
    h.style.setProperty("--c", colors[i % colors.length]);
    container.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }
}

// repülés közben szívecske-csíkot húz maga után
function trailHeart() {
  const r = dinoStage.querySelector(".dino").getBoundingClientRect();
  const h = document.createElement("span");
  h.className = "trail-heart";
  h.textContent = "♥";
  h.style.left = r.left + r.width * (0.3 + Math.random() * 0.2) + "px";
  h.style.top = r.top + r.height * 0.75 + "px";
  h.style.fontSize = 12 + Math.random() * 14 + "px";
  document.body.appendChild(h);
  h.addEventListener("animationend", () => h.remove());
}

document.getElementById("dinoSkip").addEventListener("click", () => {
  dinoTimers.forEach(clearTimeout);
  show("page-big");
});

// ---------- Jegyek ----------
function renderTickets() {
  const name = state.answers?.name || "";
  const initials = name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  document.querySelectorAll("[data-name]").forEach((el) => (el.textContent = name));
  document.querySelectorAll("[data-ticket-date]").forEach((el) => (el.textContent = CONFIG.date));
  document.querySelectorAll("[data-location]").forEach((el) => (el.textContent = state.location || ""));
  document.querySelectorAll("[data-serial]").forEach((el) => (el.textContent = "№ " + (state.serial || "")));

  document.querySelectorAll("[data-photo]").forEach((box) => {
    box.textContent = initials;
    if (!state.photo) return;
    const img = new Image();
    img.alt = name;
    img.onload = () => box.replaceChildren(img); // ha nincs még kép, a monogram marad
    img.src = state.photo;
  });

  // a név alapján "generált" vonalkód, hogy mindenkinek egyedi legyen
  const seed = [...(name || "x")].reduce((a, c) => a + c.charCodeAt(0), 0);
  document.querySelectorAll("[data-barcode]").forEach((bc) => {
    bc.replaceChildren();
    for (let i = 0; i < 28; i++) {
      const bar = document.createElement("i");
      bar.style.width = 1 + ((seed * (i + 3)) % 4) + "px";
      bc.appendChild(bar);
    }
  });
}

// ---------- Nagy jegy: tűzijáték, aztán a jegy ----------
let bigStarted = false;
function startBigReveal() {
  if (bigStarted) return;
  bigStarted = true;
  fireworks();
  setTimeout(() => document.getElementById("bigTicket").classList.add("revealed"), 3500);
}

function fireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  const resize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  resize();
  addEventListener("resize", resize);

  const colors = ["#f0569a", "#ff9fc4", "#ffc8de", "#f6dd9c", "#d9a441", "#ffffff", "#ff6fae"];
  const rockets = [];
  const sparks = [];
  const start = performance.now();

  function launch() {
    rockets.push({
      x: canvas.width * (0.1 + Math.random() * 0.8),
      y: canvas.height,
      vy: -(canvas.height / 55) * (0.8 + Math.random() * 0.35),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  function explode(r) {
    const n = 70 + Math.floor(Math.random() * 50);
    const speed = 3 + Math.random() * 4;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n;
      const s = speed * (0.6 + Math.random() * 0.4);
      sparks.push({
        x: r.x, y: r.y,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        life: 1,
        decay: 0.008 + Math.random() * 0.01,
        color: Math.random() < 0.7 ? r.color : colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  (function tick(now) {
    const t = now - start;
    // eleinte nagyon sűrű, utána folyamatos, de nyugodtabb
    const rate = t < 4000 ? 0.12 : 0.035;
    if (Math.random() < rate) launch();

    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.y += r.vy;
      r.vy *= 0.975;
      ctx.fillStyle = r.color;
      ctx.fillRect(r.x - 1.5, r.y, 3, 8);
      if (r.vy > -2.5) {
        explode(r);
        rockets.splice(i, 1);
      }
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.vy += 0.05;
      s.vx *= 0.985;
      s.vy *= 0.985;
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.globalAlpha = s.life;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  })(start);
}

// ---------- Konfetti ----------
function confetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const colors = ["#f0569a", "#ff9fc4", "#ffc8de", "#d9a441", "#ffffff", "#b3266a"];
  const pieces = Array.from({ length: 180 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 3,
    vx: (Math.random() - 0.5) * 16,
    vy: Math.random() * -14 - 4,
    size: 6 + Math.random() * 8,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  let frame = 0;
  (function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.vy += 0.35;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });
    if (++frame < 220) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}

// ---------- Indulás ----------
let initial = PAGES.includes(state.page) ? state.page : "page-welcome";
if (state.locked) {
  // elfogadás után már csak előre lehet menni
  if (state.answers?.available === "igen") initial = "page-ticket";
  else if (initial !== "page-big") initial = "page-dino";
} else if (!state.answers && initial !== "page-welcome") {
  initial = "page-form";
} else if (!["page-welcome", "page-form", "page-terms"].includes(initial)) {
  initial = "page-welcome";
}
show(initial);
