const CONTRACT_ADDRESS = "GwYn1k1d47UpKrJRSzhahCLAiXTSN2ZfSRfqzw9spump";
const PUMPFUN_URL = `https://pump.fun/coin/${CONTRACT_ADDRESS}`;

const LINES = [
  "Just buy bitcoin.",
  "Dad never calls. He just sends blocks.",
  "Have you tried turning it off and buying bitcoin?",
  "Not your keys, not your coins.",
  "I'm not saying dad is Satoshi… but I'm not NOT saying it.",
  "Stay humble. Stack sats.",
  "Tick tock, next block.",
  "1 BTC = 1 BTC.",
  "Mum says I have dad's private key energy.",
  "Few understand.",
];

const $ = (sel) => document.querySelector(sel);

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2200);
}

// Contract address + buy link
const caValue = $("#ca-value");
if (CONTRACT_ADDRESS) caValue.textContent = CONTRACT_ADDRESS;
$("#ca").addEventListener("click", async () => {
  if (!CONTRACT_ADDRESS) return toast("Launching soon. Follow @son_of_naka");
  try {
    await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    toast("Contract address copied!");
  } catch {
    toast("Couldn't copy. Select it manually.");
  }
});
if (PUMPFUN_URL) {
  const link = $("#buy-link");
  link.href = PUMPFUN_URL;
  link.target = "_blank";
  link.rel = "noopener";
}

// Mascot: click for bitcoin burst + a random one-liner
let pokes = 0;
let lastLine = -1;
const mascot = $("#mascot");

function burst(x, y) {
  for (let i = 0; i < 14; i++) {
    const c = document.createElement("span");
    c.className = "coin";
    c.textContent = "₿";
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 160;
    c.style.left = `${x}px`;
    c.style.top = `${y}px`;
    c.style.fontSize = `${18 + Math.random() * 26}px`;
    c.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    c.style.setProperty("--dy", `${Math.sin(angle) * dist - 60}px`);
    c.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
    document.body.appendChild(c);
    c.addEventListener("animationend", () => c.remove());
  }
}

mascot.addEventListener("click", (e) => {
  pokes++;
  $("#pokes span").textContent = pokes;
  let i;
  do i = Math.floor(Math.random() * LINES.length); while (i === lastLine);
  lastLine = i;
  $("#bubble").textContent = pokes === 21 ? "21 pokes. Just like dad intended." : LINES[i];
  mascot.classList.remove("boing");
  void mascot.offsetWidth;
  mascot.classList.add("boing");
  const r = mascot.getBoundingClientRect();
  burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
});
mascot.addEventListener("animationend", () => mascot.classList.remove("boing"));

// Background floating bitcoin symbols
const floaters = $(".floaters");
for (let i = 0; i < 16; i++) {
  const f = document.createElement("span");
  f.className = "floater";
  f.textContent = "₿";
  f.style.left = `${Math.random() * 100}%`;
  f.style.fontSize = `${16 + Math.random() * 40}px`;
  f.style.animationDuration = `${14 + Math.random() * 18}s`;
  f.style.animationDelay = `${-Math.random() * 30}s`;
  floaters.appendChild(f);
}

// Scroll reveal + supply bars
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("in");
      entry.target.querySelectorAll(".bar-fill").forEach((b) => {
        b.style.width = `${b.dataset.width}%`;
      });
      io.unobserve(entry.target);
    }
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".section, .supply").forEach((el) => {
  el.classList.add("reveal");
  io.observe(el);
});

// Konami-ish easter egg: type "hodl"
let typed = "";
window.addEventListener("keydown", (e) => {
  typed = (typed + e.key.toLowerCase()).slice(-4);
  if (typed === "hodl") {
    toast("Diamond hands detected 💎");
    for (let i = 0; i < 6; i++) {
      setTimeout(() => burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.8), i * 120);
    }
  }
});
