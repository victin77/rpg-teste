// =========================================================
// De Dignis Insanis Opera — JS
// - Scroll reveal (IntersectionObserver)
// - Cards gerados por dados (nomes/imagens)
// - Busca + filtros
// - Modal
// - Toggle: fundo fixo e animações
// =========================================================

const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

const state = {
  filter: "all",
  query: "",
  motion: true,
  bgFixed: true,
  characters: [
    {
      id: "terina",
      name: "Terina",
      role: "party",
      badge: "Grupo",
      tags: ["tiefling", "d&d", "aventureira"],
      img: "assets/characters/terina.jpg",
    },
    {
      id: "topazio",
      name: "Topázio",
      role: "party",
      badge: "Grupo",
      tags: ["d&d", "mago", "arcano"],
      img: "assets/characters/topazio.jpg",
    },
    {
      id: "kimiona",
      name: "Kimiona",
      role: "party",
      badge: "Grupo",
      tags: ["d&d", "guerreira", "honra"],
      img: "assets/characters/kimiona.jpg",
    },
    {
      id: "shay",
      name: "Shay",
      role: "party",
      badge: "Grupo",
      tags: ["d&d", "ladina", "sombra"],
      img: "assets/characters/shay.jpg",
    },
    {
      id: "shinno",
      name: "Shinno",
      role: "party",
      badge: "Grupo",
      tags: ["d&d", "clérigo", "fé"],
      img: "assets/characters/shinno.jpg",
    },
    {
      id: "lucio",
      name: "Lúcio",
      role: "party",
      badge: "Grupo",
      tags: ["d&d", "bardo", "caos"],
      img: "assets/characters/lucio.jpg",
    },
    {
      id: "mestre",
      name: "Mestre",
      role: "mestre",
      badge: "Mestre",
      tags: ["narrador", "campanha", "deus do caos"],
      img: "assets/characters/mestre.jpg",
    },
  ]
};

// ---- Mobile menu
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");
menuBtn?.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("show");
  menuBtn.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
});
$$(".mobileMenu a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("show");
  menuBtn.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
}));

// ---- Toggles
const toggleFixed = $("#toggleFixed");
const toggleMotion = $("#toggleMotion");

function applyFixedBackground(isFixed){
  state.bgFixed = isFixed;
  document.body.classList.toggle("bg-not-fixed", !isFixed);
  // if not fixed, set the .bg height to document height (so it covers all)
  requestAnimationFrame(() => {
    const bg = $(".bg");
    if (!bg) return;
    if (isFixed){
      bg.style.height = "";
    } else {
      bg.style.height = Math.max(document.body.scrollHeight, window.innerHeight) + "px";
    }
  });
}

function applyMotion(isOn){
  state.motion = isOn;
  document.body.classList.toggle("no-motion", !isOn);
}

toggleFixed?.addEventListener("change", (e) => applyFixedBackground(e.target.checked));
toggleMotion?.addEventListener("change", (e) => applyMotion(e.target.checked));

// default from checkbox state
applyFixedBackground(toggleFixed?.checked ?? true);
applyMotion(toggleMotion?.checked ?? true);

// keep bg size updated on resize when not fixed
window.addEventListener("resize", () => {
  if (!state.bgFixed) applyFixedBackground(false);
});

// ---- Scroll reveal
let io;
function initReveal(){
  if (io) io.disconnect();
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)){
    els.forEach(el => el.classList.add("in"));
    return;
  }
  io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting){
        ent.target.classList.add("in");
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -80px 0px" });

  els.forEach(el => io.observe(el));
}
initReveal();

// ---- Active nav link
const sections = ["sobre","personagens","cronicas"].map(id => document.getElementById(id)).filter(Boolean);
const navLinks = $$(".navlinks a");
function setActive(hash){
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === hash));
}
if ("IntersectionObserver" in window){
  const navIO = new IntersectionObserver((entries) => {
    const best = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (best){
      setActive("#" + best.target.id);
    }
  }, { threshold: [0.2, 0.35, 0.5], rootMargin: "-20% 0px -65% 0px" });
  sections.forEach(s => navIO.observe(s));
}

// ---- Count up
function countUp(){
  const nums = $$(".num[data-count]");
  nums.forEach(el => {
    const target = Number(el.getAttribute("data-count") || "0");
    let current = 0;
    const steps = Math.max(14, target * 10);
    const inc = target / steps;
    let t = 0;
    const tick = () => {
      if (!state.motion){ el.textContent = String(target); return; }
      t++;
      current = Math.min(target, current + inc);
      el.textContent = String(Math.round(current));
      if (t < steps) requestAnimationFrame(tick);
      else el.textContent = String(target);
    };
    tick();
  });
}
countUp();

// ---- Characters UI
const cardsEl = $("#cards");
const searchInput = $("#searchInput");

function normalize(str){
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function matchesChar(c){
  const q = normalize(state.query.trim());
  const hay = normalize([c.name, c.badge, ...(c.tags||[])].join(" "));
  const okQuery = !q || hay.includes(q);
  const okFilter =
    state.filter === "all" ||
    (state.filter === "party" && c.role === "party") ||
    (state.filter === "mestre" && c.role === "mestre");
  return okQuery && okFilter;
}

function renderCards(){
  if (!cardsEl) return;
  const filtered = state.characters.filter(matchesChar);

  cardsEl.innerHTML = filtered.map((c, idx) => {
    const tags = (c.tags || []).slice(0, 3).map(t => `<span class="pillMeta">${t}</span>`).join("");
    return `
      <article class="card reveal" style="--d:${0.04 + idx * 0.04}s" data-id="${c.id}">
        <div class="cardBg" style="background-image:url('${c.img}')"></div>
        <div class="cardOverlay"></div>
        <div class="cardContent">
          <div class="nameRow">
            <h3 class="charName">${c.name}</h3>
            <span class="badge">${c.badge}</span>
          </div>
          <div class="meta">${tags}</div>
          <div class="cardAction">
            <span>ver detalhes</span>
            <div class="arrow">➜</div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // re-init reveal for new elements
  initReveal();
  attachCardInteractions();
}

function attachCardInteractions(){
  $$(".card").forEach(card => {
    // hover glow tracking
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", mx + "%");
      card.style.setProperty("--my", my + "%");

      // subtle tilt
      if (!state.motion) return;
      const dx = (e.clientX - (r.left + r.width/2)) / r.width;
      const dy = (e.clientY - (r.top + r.height/2)) / r.height;
      const rotY = dx * 8;
      const rotX = -dy * 8;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });

    card.addEventListener("click", () => openModal(card.dataset.id));
  });
}

renderCards();

// ---- Search + filters
searchInput?.addEventListener("input", (e) => {
  state.query = e.target.value || "";
  renderCards();
});

$$(".pillBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".pillBtn").forEach(b => b.classList.remove("isActive"));
    btn.classList.add("isActive");
    state.filter = btn.dataset.filter;
    renderCards();
  });
});

// Ctrl / to focus search
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "/"){
    e.preventDefault();
    searchInput?.focus();
  }
});

// ---- Modal
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalCover = $("#modalCover");
const modalOpenPage = $("#modalOpenPage");

function openModal(id){
  const c = state.characters.find(x => x.id === id);
  if (!c || !modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  modalTitle.textContent = c.name;
  modalCover.style.backgroundImage = `url('${c.img}')`;

  // page link stub (você pode criar estas páginas depois)
  modalOpenPage.setAttribute("href", `personagem.html?id=${encodeURIComponent(c.id)}`);

  // prevent scroll behind
  document.body.style.overflow = "hidden";
}

function closeModal(){
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$("[data-close]").forEach(el => el.addEventListener("click", closeModal));
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ---- Smooth anchor scrolling (keeps sticky header offset)
$$("a[href^='#']").forEach(a => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const header = document.querySelector(".topbar");
    const offset = (header?.getBoundingClientRect().height || 0) + 10;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: state.motion ? "smooth" : "auto" });
  });
});


// =========================================================
// Galeria de Desenhos (carrossel infinito + gallery.html)
// - Salva no localStorage (sem backend)
// =========================================================
const DRAWINGS_KEY = "dignis_gallery_drawings_v1";

function loadDrawings(){
  try{
    const raw = localStorage.getItem(DRAWINGS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  }catch(_e){
    return [];
  }
}
function saveDrawings(list){
  try{ localStorage.setItem(DRAWINGS_KEY, JSON.stringify(list || [])); }catch(_e){}
}

function uid(){
  return "d_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

function formatWhen(ts){
  try{
    const d = new Date(ts);
    return d.toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" });
  }catch(_e){
    return "";
  }
}

// ---- Modal add drawing
const drawModal = $("#drawModal");
const drawFile = $("#drawFile");
const drawNote = $("#drawNote");
const drawSaveBtn = $("#drawSaveBtn");
const addDrawingBtn = $("#addDrawingBtn");

function openDrawModal(){
  if (!drawModal) return;
  drawModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (drawFile) drawFile.value = "";
  if (drawNote) drawNote.value = "";
  if (drawSaveBtn) drawSaveBtn.disabled = true;
}

function closeDrawModal(){
  if (!drawModal) return;
  drawModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (drawFile) drawFile.value = "";
  if (drawNote) drawNote.value = "";
  if (drawSaveBtn) drawSaveBtn.disabled = true;
}

addDrawingBtn?.addEventListener("click", openDrawModal);

$$("[data-draw-close]").forEach(el => {
  el.addEventListener("click", closeDrawModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && drawModal?.getAttribute("aria-hidden") === "false"){
    closeDrawModal();
  }
});

drawFile?.addEventListener("change", () => {
  if (drawSaveBtn) drawSaveBtn.disabled = !drawFile.files || !drawFile.files[0];
});

// ---- Render carousel (index.html) and grid (gallery.html)

// ---- Gallery controls + viewer (gallery.html)
const drawSearch = $("#drawSearch");
const drawSort = $("#drawSort");

const viewerModal = $("#viewerModal");
const viewerImage = $("#viewerImage");
const viewerNote = $("#viewerNote");
const viewerWhen = $("#viewerWhen");
const viewerDelete = $("#viewerDelete");

let viewerCurrentId = null;

function openViewer(item){
  if (!viewerModal || !viewerImage) return;
  viewerCurrentId = item?.id || null;
  viewerImage.style.backgroundImage = `url(${item?.src || ""})`;
  if (viewerNote) viewerNote.textContent = item?.note ? item.note : "Sem nota.";
  if (viewerWhen) viewerWhen.textContent = item?.createdAt ? formatWhen(item.createdAt) : "";

  viewerModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeViewer(){
  if (!viewerModal) return;
  viewerCurrentId = null;
  viewerModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$('[data-viewer-close]').forEach(el => {
  el.addEventListener('click', closeViewer);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && viewerModal?.getAttribute('aria-hidden') === 'false'){
    closeViewer();
  }
});

viewerDelete?.addEventListener('click', () => {
  if (!viewerCurrentId) return;
  const drawings = loadDrawings();
  const item = drawings.find(d => d.id === viewerCurrentId);
  const label = item?.note ? `\n\n"${item.note}"` : "";
  const ok = window.confirm(`Excluir este desenho?${label}`);
  if (!ok) return;
  const next = drawings.filter(d => d.id !== viewerCurrentId);
  saveDrawings(next);
  closeViewer();
  rerenderDrawingsEverywhere();
});

function renderCarousel(){
  const groupA = $("#drawGroupA");
  const groupB = $("#drawGroupB");
  const track  = $("#drawTrack");
  const empty  = $("#drawCarouselEmpty");

  if (!groupA || !groupB || !track) return;

  const drawings = loadDrawings();

  groupA.innerHTML = "";
  groupB.innerHTML = "";

  if (!drawings.length){
    empty?.removeAttribute("hidden");
    track.style.animation = "none";
    track.style.removeProperty("--draw-scroll-duration");
    return;
  }

  empty?.setAttribute("hidden", "");

  const fragA = document.createDocumentFragment();

  drawings.forEach(item => {
    const div = document.createElement("div");
    div.className = "carouselItem";
    div.setAttribute("role", "link");
    div.setAttribute("tabindex", "0");
    div.dataset.id = item.id;

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.note ? item.note : "Desenho";

    div.appendChild(img);

    // clique -> página da galeria (nota aparece lá)
    const go = () => { window.location.href = `gallery.html#${encodeURIComponent(item.id)}`; };
    div.addEventListener("click", go);
    div.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });

    fragA.appendChild(div);
  });

  groupA.appendChild(fragA);

  // Clone para o grupo B (loop infinito real / seamless)
  groupB.innerHTML = groupA.innerHTML;

  // Ajusta duração baseado na largura real do grupo A (velocidade constante)
  requestAnimationFrame(() => {
    const w = groupA.scrollWidth;
    const pxPerSec = 90; // velocidade (quanto maior, mais rápido)
    const dur = Math.max(14, Math.min(80, w / pxPerSec));
    track.style.setProperty("--draw-scroll-duration", `${dur}s`);
    track.style.animation = ""; // garante que a regra CSS volta a valer
  });
}

function renderGrid(){
  const grid = $("#drawGrid");
  const empty = $("#drawGridEmpty");
  if (!grid) return;

  let drawings = loadDrawings();
  grid.innerHTML = "";

  if (!drawings.length){
    empty?.removeAttribute("hidden");
    return;
  }
  empty?.setAttribute("hidden", "true");

  // filtros (somente na gallery.html)
  const q = (drawSearch?.value || "").trim().toLowerCase();
  if (q){
    drawings = drawings.filter(d => String(d.note || "").toLowerCase().includes(q));
  }

  // ordenação
  const sortMode = (drawSort?.value || "new");
  const arr = drawings.slice();
  if (sortMode === "old") arr.sort((a,b) => (a.createdAt || 0) - (b.createdAt || 0));
  else if (sortMode === "az") arr.sort((a,b) => String(a.note || "").localeCompare(String(b.note || ""), "pt-BR"));
  else if (sortMode === "za") arr.sort((a,b) => String(b.note || "").localeCompare(String(a.note || ""), "pt-BR"));
  else arr.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));

  const frag = document.createDocumentFragment();
  arr.forEach(item => {
      const card = document.createElement("article");
      card.className = "drawCardItem reveal";
      card.id = item.id;

      const imgWrap = document.createElement("div");
      imgWrap.className = "imgWrap";

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.note ? item.note : "Desenho";

      imgWrap.appendChild(img);

      const meta = document.createElement("div");
      meta.className = "meta";

      const note = document.createElement("div");
      note.className = "note";
      note.textContent = item.note || "Sem nota.";

      const when = document.createElement("div");
      when.className = "when";
      when.textContent = item.createdAt ? formatWhen(item.createdAt) : "";

      meta.appendChild(note);
      meta.appendChild(when);

      card.appendChild(imgWrap);
      card.appendChild(meta);

      // abre viewer
      const open = () => openViewer(item);
      card.addEventListener("click", open);
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });

      frag.appendChild(card);
    });

  grid.appendChild(frag);
  initReveal?.();
}

// Eventos de busca/ordenação (gallery.html)
drawSearch?.addEventListener("input", () => renderGrid());
drawSort?.addEventListener("change", () => renderGrid());

function rerenderDrawingsEverywhere(){
  renderCarousel();
  renderGrid();
}

drawSaveBtn?.addEventListener("click", () => {
  const file = drawFile?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const src = String(reader.result || "");
    const note = (drawNote?.value || "").trim();

    const drawings = loadDrawings();
    drawings.push({
      id: uid(),
      src,
      note,
      createdAt: Date.now(),
    });
    saveDrawings(drawings);

    closeDrawModal();
    rerenderDrawingsEverywhere();

    // se estiver na gallery.html, rolar pro topo do novo item (mais recente)
    const page = document.body?.dataset?.page;
    if (page === "gallery"){
      window.scrollTo({ top: 0, behavior: state.motion ? "smooth" : "auto" });
    }
  };
  reader.readAsDataURL(file);
});

// Inicialização
rerenderDrawingsEverywhere();

// Se a página tiver hash (#id), tenta dar destaque suave ao item
window.addEventListener("load", () => {
  const id = (location.hash || "").slice(1);
  if (!id) return;
  const el = document.getElementById(decodeURIComponent(id));
  if (!el) return;
  const page = document.body?.dataset?.page;
  el.scrollIntoView({ behavior: state.motion ? "smooth" : "auto", block: "center" });

  // Se estiver na gallery.html, abre o viewer direto (fica bem mais "premium")
  if (page === "gallery"){
    const drawings = loadDrawings();
    const item = drawings.find(d => d.id === decodeURIComponent(id));
    if (item) openViewer(item);
    return;
  }

  // Caso contrário, só destaca
  el.style.outline = "2px solid rgba(255,255,255,.35)";
  el.style.outlineOffset = "6px";
  setTimeout(() => { el.style.outline = ""; el.style.outlineOffset = ""; }, 1600);
});
