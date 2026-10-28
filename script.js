/* ===== Data ===== */
const education = [
  { title: "B.Sc. Computer Science", place: "Sri Akilandeshwari Women's College, Wandiwash", year: "2025 - 2028", note: "Currently pursuing" },
  { title: "Higher Secondary (12th)", place: "Government Higher Secondary School", year: "2023 - 2025", note: "Computer Science Group - State Board" },
  { title: "Secondary School (10th)", place: "Government High School", year: "2022 - 2023", note: "State Board" }
];

const skills = [
  { name: "HTML5", level: 90 }, { name: "CSS3", level: 85 },
  { name: "JavaScript", level: 75 }, { name: "Responsive Design", level: 80 },
  { name: "Git & GitHub", level: 70 }, { name: "SQL", level: 65 },
  { name: "Python", level: 60 }, { name: "Problem Solving", level: 78 }
];

const projects = [
  { id: 1, title: "Library Management Interface", category: "Web App", tech: ["HTML", "CSS", "JavaScript"],
    desc: "A front-end interface to add, search and issue books in a library.",
    features: ["Add and remove books", "Search by title or author", "Issue / return status"] },
  { id: 2, title: "Personal Expense Tracker", category: "Web App", tech: ["HTML", "CSS", "JavaScript"],
    desc: "Tracks daily income and expenses and shows the running balance.",
    features: ["Add income and expense entries", "Live balance calculation", "Category-wise summary"] },
  { id: 3, title: "Online Quiz Application", category: "Game", tech: ["HTML", "JavaScript"],
    desc: "An interactive quiz with timer, scoring and result summary.",
    features: ["Multiple-choice questions", "Countdown timer", "Final score screen"] },
  { id: 4, title: "Food Ordering Website", category: "Website", tech: ["HTML", "CSS", "JavaScript"],
    desc: "A restaurant menu site with a working cart and total calculation.",
    features: ["Menu with categories", "Add to cart", "Bill total"] },
  { id: 5, title: "Weather Dashboard", category: "Web App", tech: ["HTML", "CSS", "API"],
    desc: "Displays current weather conditions for any searched city.",
    features: ["City search", "Temperature and humidity", "Responsive cards"] },
  { id: 6, title: "College Event Portal", category: "Website", tech: ["HTML", "CSS"],
    desc: "A static multi-page site listing upcoming college events.",
    features: ["Event listing", "Registration form", "Mobile friendly layout"] }
];

/* ===== Helpers ===== */
const $ = (id) => document.getElementById(id);
let activeFilter = "All";
let searchText = "";

/* ===== Navigation ===== */
$("menuToggle").addEventListener("click", () => $("navLinks").classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach((a) =>
  a.addEventListener("click", () => $("navLinks").classList.remove("open"))
);

/* Highlight active link while scrolling */
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let current = "home";
  sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  document.querySelectorAll(".nav-links a").forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current)
  );
  $("topBtn").style.display = window.scrollY > 400 ? "block" : "none";
});
$("topBtn").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ===== Theme ===== */
$("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  $("themeToggle").textContent = document.body.classList.contains("dark") ? "Light" : "Dark";
});

/* ===== Typing effect ===== */
const roles = ["Web Developer", "Front-End Enthusiast", "Problem Solver"];
let r = 0, c = 0, deleting = false;
function type() {
  const word = roles[r];
  $("typing").textContent = word.substring(0, c);
  c += deleting ? -1 : 1;
  if (!deleting && c > word.length) { deleting = true; setTimeout(type, 1200); return; }
  if (deleting && c < 0) { deleting = false; r = (r + 1) % roles.length; c = 0; }
  setTimeout(type, deleting ? 50 : 100);
}
type();

/* ===== Education & Skills (rendered dynamically) ===== */
$("educationList").innerHTML = education.map((e) => `
  <div class="t-item">
    <span class="year">${e.year}</span>
    <h3>${e.title}</h3>
    <p>${e.place}</p>
    <p>${e.note}</p>
  </div>`).join("");

$("skillsList").innerHTML = skills.map((s) => `
  <div class="skill">
    <div class="skill-top"><span>${s.name}</span><span>${s.level}%</span></div>
    <div class="bar"><div class="bar-fill" data-level="${s.level}"></div></div>
  </div>`).join("");

/* ===== Projects: render, filter and search ===== */
function buildFilters() {
  const techs = [...new Set(projects.flatMap((p) => p.tech))];
  const cats = [...new Set(projects.map((p) => p.category))];
  const all = ["All", ...cats, ...techs];
  $("filters").innerHTML = all.map((f) =>
    `<button class="filter-btn ${f === activeFilter ? "active" : ""}" data-filter="${f}">${f}</button>`).join("");
  document.querySelectorAll(".filter-btn").forEach((b) =>
    b.addEventListener("click", () => {
      activeFilter = b.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach((x) => x.classList.toggle("active", x === b));
      renderProjects();
    }));
}

function renderProjects() {
  const list = projects.filter((p) => {
    const matchFilter = activeFilter === "All" || p.category === activeFilter || p.tech.includes(activeFilter);
    const matchSearch = (p.title + p.desc).toLowerCase().includes(searchText);
    return matchFilter && matchSearch;
  });
  $("projectGrid").innerHTML = list.map((p) => `
    <article class="card">
      <span class="cat">${p.category}</span>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="tags">${p.tech.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <button class="btn" onclick="openModal(${p.id})">View Details</button>
    </article>`).join("");
  $("noResult").hidden = list.length > 0;
}
$("searchBox").addEventListener("input", (e) => { searchText = e.target.value.toLowerCase().trim(); renderProjects(); });

/* ===== Modal (project details shown dynamically) ===== */
function openModal(id) {
  const p = projects.find((x) => x.id === id);
  $("mTitle").textContent = p.title;
  $("mCat").textContent = p.category;
  $("mDesc").textContent = p.desc;
  $("mTags").innerHTML = p.tech.map((t) => `<span class="tag">${t}</span>`).join("");
  $("mFeatures").innerHTML = p.features.map((f) => `<li>${f}</li>`).join("");
  $("modal").hidden = false;
}
function closeModal() { $("modal").hidden = true; }
$("modalClose").addEventListener("click", closeModal);
$("modal").addEventListener("click", (e) => { if (e.target === $("modal")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ===== Scroll animations: skill bars & counters ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.querySelectorAll(".bar-fill").forEach((b) => (b.style.width = b.dataset.level + "%"));
    en.target.querySelectorAll(".count").forEach((el) => {
      const target = +el.dataset.target; let n = 0;
      const t = setInterval(() => { el.textContent = ++n; if (n >= target) clearInterval(t); }, 120);
    });
    observer.unobserve(en.target);
  });
}, { threshold: 0.3 });
observer.observe($("skills"));
observer.observe($("about"));

/* ===== Contact form validation ===== */
$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("cName").value.trim(), email = $("cEmail").value.trim(), msg = $("cMsg").value.trim();
  const out = $("formMsg");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !email || !msg) { out.textContent = "Please fill in all fields."; out.className = "form-msg error"; return; }
  if (!emailOk) { out.textContent = "Please enter a valid email address."; out.className = "form-msg error"; return; }
  out.textContent = "Thank you, " + name + "! Your message has been sent."; out.className = "form-msg success";
  e.target.reset();
});

/* ===== Init ===== */
buildFilters();
renderProjects();
