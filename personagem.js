// =========================================================
// Painel do Personagem (sem backend)
// - Abas (SPA simples)
// - Tudo editável (inputs/textarea/listas)
// - Persistência no localStorage por personagem (id)
// =========================================================

const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

const CHAR_INDEX = [
  { id: "terina", name: "Terina", img: "assets/characters/terina.jpg" },
  { id: "topazio", name: "Topázio", img: "assets/characters/topazio.jpg" },
  { id: "kimiona", name: "Kimiona", img: "assets/characters/kimiona.jpg" },
  { id: "shay", name: "Shay", img: "assets/characters/shay.jpg" },
  { id: "shinno", name: "Shinno", img: "assets/characters/shinno.jpg" },
  { id: "lucio", name: "Lúcio", img: "assets/characters/lucio.jpg" },
  { id: "mestre", name: "Mestre", img: "assets/characters/mestre.jpg" },
];

const THEME_KEY = "dignis_theme_v1";

function getIdFromQuery(){
  const url = new URL(window.location.href);
  return (url.searchParams.get("id") || "").trim() || "terina";
}

function clamp(n, min, max){
  const v = Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}

function abilityMod(score){
  const s = Number(score);
  if (!Number.isFinite(s)) return 0;
  return Math.floor((s - 10) / 2);
}

function sign(n){
  return (n >= 0 ? "+" : "") + n;
}

function storageKey(id){
  return `dignis_character_${id}_v1`;
}

function loadCharacter(id){
  try{
    const raw = localStorage.getItem(storageKey(id));
    if (raw){
      const data = JSON.parse(raw);
      if (data && typeof data === "object") return data;
    }
  }catch(_e){}

  const base = CHAR_INDEX.find(x => x.id === id) || { id, name: id, img: "" };
  return {
    id,
    profile: {
      name: base.name || "Personagem",
      class: "",
      race: "",
      level: 1,
      background: "",
      xp: 0,
      image: base.img || "",
    },
    stats: {
      abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      ac: 10,
      initiative: 0,
      speed: 9,
      hitDie: "d8",
      hpMax: 10,
      hpCurrent: 10,
      hpTemp: 0,
    },
    personality: {
      traits: "",
      ideals: "",
      bonds: "",
      flaws: "",
    },
    skills: defaultSkills(),
    proficiencies: {
      armor: "",
      weapons: "",
      tools: "",
      languages: "",
    },
    attacks: [],
    inventory: {
      money: { pp: 0, po: 0, pe: 0, pc: 0 },
      items: [],
    },
    features: [],
    tabs: {
      historia: "",
      relacionados: "",
      diario: "",
      desenhos: "",
    }
  };
}

function saveCharacter(char){
  try{ localStorage.setItem(storageKey(char.id), JSON.stringify(char)); }catch(_e){}
}

function defaultSkills(){
  // lista "canônica" do 5e (você pode editar o bônus manualmente)
  const list = [
    { name: "Acrobacia", ability: "dex", proficient: false, bonus: 0 },
    { name: "Adestrar Animais", ability: "wis", proficient: false, bonus: 0 },
    { name: "Arcanismo", ability: "int", proficient: false, bonus: 0 },
    { name: "Atletismo", ability: "str", proficient: false, bonus: 0 },
    { name: "Atuação", ability: "cha", proficient: false, bonus: 0 },
    { name: "Blefar", ability: "cha", proficient: false, bonus: 0 },
    { name: "Furtividade", ability: "dex", proficient: false, bonus: 0 },
    { name: "História", ability: "int", proficient: false, bonus: 0 },
    { name: "Intimidação", ability: "cha", proficient: false, bonus: 0 },
    { name: "Intuição", ability: "wis", proficient: false, bonus: 0 },
    { name: "Investigação", ability: "int", proficient: false, bonus: 0 },
    { name: "Medicina", ability: "wis", proficient: false, bonus: 0 },
    { name: "Natureza", ability: "int", proficient: false, bonus: 0 },
    { name: "Percepção", ability: "wis", proficient: false, bonus: 0 },
    { name: "Persuasão", ability: "cha", proficient: false, bonus: 0 },
    { name: "Prestidigitação", ability: "dex", proficient: false, bonus: 0 },
    { name: "Religião", ability: "int", proficient: false, bonus: 0 },
    { name: "Sobrevivência", ability: "wis", proficient: false, bonus: 0 },
  ];
  return list;
}

// ---------------- UI binding ----------------
const id = getIdFromQuery();
let character = loadCharacter(id);

// theme
function applyTheme(){
  const saved = localStorage.getItem(THEME_KEY) || "light";
  document.body.classList.toggle("theme-dark", saved === "dark");
  const ico = $("#themeToggle span");
  if (ico) ico.textContent = saved === "dark" ? "☀" : "☾";
}
applyTheme();

$("#themeToggle")?.addEventListener("click", () => {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  localStorage.setItem(THEME_KEY, saved === "dark" ? "light" : "dark");
  applyTheme();
});

// header
function refreshHeader(){
  $("#c_name").textContent = (character.profile.name || "Personagem").toUpperCase();
  const meta = [
    [character.profile.class, character.profile.race].filter(Boolean).join(" • "),
    character.profile.level ? `Nível ${character.profile.level}` : "",
    character.profile.background ? `Antecedente: ${character.profile.background}` : "",
  ].filter(Boolean).join(" — ");
  $("#c_meta").textContent = meta || "—";
}

// Tabs
function setTab(tab){
  $$(".tabBtn").forEach(b => b.classList.toggle("isActive", b.dataset.tab === tab));
  $$(".tabPanel").forEach(p => p.classList.toggle("isActive", p.dataset.panel === tab));
  // reset search highlight
  clearSearchMarks();
}
$$(".tabBtn").forEach(btn => btn.addEventListener("click", () => setTab(btn.dataset.tab)));

// Simple page search (highlights matches)
function clearSearchMarks(){
  $$("mark.__hit").forEach(m => {
    const t = document.createTextNode(m.textContent || "");
    m.replaceWith(t);
  });
}
function highlightIn(el, query){
  if (!query) return;
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node){
      if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const q = query.toLowerCase();
  const nodes = [];
  while (walk.nextNode()) nodes.push(walk.currentNode);
  nodes.forEach(node => {
    const text = node.nodeValue;
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return;
    const before = document.createTextNode(text.slice(0, idx));
    const hit = document.createElement("mark");
    hit.className = "__hit";
    hit.textContent = text.slice(idx, idx + query.length);
    const after = document.createTextNode(text.slice(idx + query.length));
    const frag = document.createDocumentFragment();
    frag.append(before, hit, after);
    node.parentNode?.replaceChild(frag, node);
  });
}

$("#pageSearch")?.addEventListener("input", (e) => {
  const q = (e.target.value || "").trim();
  clearSearchMarks();
  if (!q) return;
  const panel = $(".tabPanel.isActive");
  if (panel) highlightIn(panel, q);
});

// ---------------- Render helpers ----------------
function setEditableText(el, value, onChange){
  if (!el) return;
  el.textContent = value || "";
  el.addEventListener("click", () => {
    if (el.dataset.editing === "1") return;
    el.dataset.editing = "1";
    const input = document.createElement("input");
    input.className = "inlineInput";
    input.value = value || "";
    el.replaceWith(input);
    input.focus();
    input.select();

    const commit = () => {
      const v = input.value.trim();
      onChange(v);
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") { ev.preventDefault(); input.blur(); }
      if (ev.key === "Escape") { ev.preventDefault(); input.value = value || ""; input.blur(); }
    });
  });
}

function bindInput(sel, get, set, opts={}){
  const el = $(sel);
  if (!el) return;
  const isNum = el.type === "number";
  const apply = () => {
    const v = get();
    el.value = (v ?? "");
  };
  apply();
  const handler = () => {
    let v = el.value;
    if (isNum) v = Number(v);
    if (opts.clamp) v = clamp(v, opts.clamp[0], opts.clamp[1]);
    set(v);
    saveCharacter(character);
    refreshHeader();
    if (opts.after) opts.after();
  };
  el.addEventListener("input", handler);
}

function bindTextarea(sel, get, set){
  const el = $(sel);
  if (!el) return;
  el.value = get() || "";
  el.addEventListener("input", () => {
    set(el.value);
    saveCharacter(character);
  });
}

// ---------------- Sections: profile + summary ----------------
function renderProfile(){
  const avatar = $("#profileAvatar");
  if (avatar){
    const img = character.profile.image || "";
    avatar.style.backgroundImage = img ? `url('${img}')` : "";
    avatar.title = "Clique para trocar o avatar (URL)";
    avatar.addEventListener("click", () => {
      const url = prompt("Cole a URL da imagem do personagem:", character.profile.image || "");
      if (url === null) return;
      character.profile.image = url.trim();
      avatar.style.backgroundImage = character.profile.image ? `url('${character.profile.image}')` : "";
      saveCharacter(character);
    });
  }

  // Inline edits
  setEditableText($("#profileName"), character.profile.name, (v) => {
    character.profile.name = v || "Personagem";
    saveCharacter(character);
    refreshHeader();
    // restore DOM node
    const span = document.createElement("div");
    span.id = "profileName";
    span.className = "profileName";
    span.textContent = character.profile.name;
    const input = $(".inlineInput");
    input?.replaceWith(span);
    setEditableText(span, character.profile.name, (nv) => { character.profile.name = nv; saveCharacter(character); refreshHeader(); });
  });

  bindInput("#profileClass", () => character.profile.class, (v) => character.profile.class = v);
  bindInput("#profileRace", () => character.profile.race, (v) => character.profile.race = v);
  bindInput("#profileLevel", () => character.profile.level, (v) => character.profile.level = clamp(v,1,20), { clamp:[1,20] });
  bindInput("#profileBg", () => character.profile.background, (v) => character.profile.background = v);
  bindInput("#profileXp", () => character.profile.xp, (v) => character.profile.xp = clamp(v,0,999999), { clamp:[0,999999] });
}

function renderAbilities(){
  const a = character.stats.abilities;
  const rows = [
    { key: "str", label: "Força" },
    { key: "dex", label: "Destreza" },
    { key: "con", label: "Constituição" },
    { key: "int", label: "Inteligência" },
    { key: "wis", label: "Sabedoria" },
    { key: "cha", label: "Carisma" },
  ];
  rows.forEach(r => {
    const input = $(`#ab_${r.key}`);
    const modEl = $(`#mod_${r.key}`);
    if (!input || !modEl) return;
    input.value = a[r.key];
    const apply = () => {
      const mod = abilityMod(a[r.key]);
      modEl.textContent = sign(mod);
      // opcional: se iniciativa estiver "auto" (marcado), recomputa
      if ($("#autoInit")?.checked){
        character.stats.initiative = abilityMod(a.dex);
        $("#stInit").value = character.stats.initiative;
      }
      renderSkills();
    };
    apply();
    input.addEventListener("input", () => {
      a[r.key] = clamp(input.value, 1, 30);
      input.value = a[r.key];
      apply();
      saveCharacter(character);
    });
  });
}

function renderStatus(){
  bindInput("#stAc", () => character.stats.ac, (v) => character.stats.ac = clamp(v,0,99), { clamp:[0,99] });
  bindInput("#stInit", () => character.stats.initiative, (v) => character.stats.initiative = clamp(v,-20,20), { clamp:[-20,20] });
  bindInput("#stSpeed", () => character.stats.speed, (v) => character.stats.speed = clamp(v,0,60), { clamp:[0,60] });
  bindInput("#stHitDie", () => character.stats.hitDie, (v) => character.stats.hitDie = v);

  // HP with simple guard
  bindInput("#hpMax", () => character.stats.hpMax, (v) => character.stats.hpMax = clamp(v,0,999), {
    clamp:[0,999],
    after(){
      character.stats.hpCurrent = clamp(character.stats.hpCurrent, 0, character.stats.hpMax);
      $("#hpCur").value = character.stats.hpCurrent;
      saveCharacter(character);
    }
  });
  bindInput("#hpCur", () => character.stats.hpCurrent, (v) => character.stats.hpCurrent = clamp(v,0,character.stats.hpMax), { clamp:[0,999] });
  bindInput("#hpTemp", () => character.stats.hpTemp, (v) => character.stats.hpTemp = clamp(v,0,999), { clamp:[0,999] });

  $("#autoInit")?.addEventListener("change", (e) => {
    if (e.target.checked){
      character.stats.initiative = abilityMod(character.stats.abilities.dex);
      $("#stInit").value = character.stats.initiative;
      saveCharacter(character);
    }
  });
}

function renderPersonality(){
  bindTextarea("#t_traits", () => character.personality.traits, (v) => character.personality.traits = v);
  bindTextarea("#t_ideals", () => character.personality.ideals, (v) => character.personality.ideals = v);
  bindTextarea("#t_bonds", () => character.personality.bonds, (v) => character.personality.bonds = v);
  bindTextarea("#t_flaws", () => character.personality.flaws, (v) => character.personality.flaws = v);
}

// ---------------- Lists ----------------
function renderSkills(){
  const wrap = $("#skillsList");
  if (!wrap) return;
  wrap.innerHTML = "";
  character.skills.forEach((sk, idx) => {
    const row = document.createElement("div");
    row.className = "listRow";

    const left = document.createElement("div");
    left.className = "rowName";
    left.innerHTML = `<div class="rowTitle">${sk.name}</div><div class="rowSub">${(sk.ability||"").toUpperCase()}</div>`;

    const right = document.createElement("div");
    right.className = "rowControls";

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = !!sk.proficient;
    chk.title = "Proficiente";
    chk.addEventListener("change", () => {
      sk.proficient = chk.checked;
      saveCharacter(character);
    });

    const bonus = document.createElement("input");
    bonus.type = "number";
    bonus.className = "numSm";
    bonus.value = Number(sk.bonus || 0);
    bonus.addEventListener("input", () => {
      sk.bonus = clamp(bonus.value, -30, 30);
      bonus.value = sk.bonus;
      saveCharacter(character);
    });

    const auto = document.createElement("button");
    auto.type = "button";
    auto.className = "miniBtn";
    auto.textContent = "Auto";
    auto.title = "Definir bônus = modificador do atributo";
    auto.addEventListener("click", () => {
      const mod = abilityMod(character.stats.abilities[sk.ability] ?? 10);
      sk.bonus = mod;
      bonus.value = sk.bonus;
      saveCharacter(character);
    });

    right.append(chk, bonus, auto);
    row.append(left, right);
    wrap.appendChild(row);
  });
}

function renderProficiencies(){
  bindTextarea("#p_armor", () => character.proficiencies.armor, (v) => character.proficiencies.armor = v);
  bindTextarea("#p_weapons", () => character.proficiencies.weapons, (v) => character.proficiencies.weapons = v);
  bindTextarea("#p_tools", () => character.proficiencies.tools, (v) => character.proficiencies.tools = v);
  bindTextarea("#p_lang", () => character.proficiencies.languages, (v) => character.proficiencies.languages = v);
}

function renderAttacks(){
  const wrap = $("#attacksList");
  if (!wrap) return;
  wrap.innerHTML = "";

  const add = $("#addAttack");
  add?.addEventListener("click", () => {
    character.attacks.push({ name: "", toHit: 0, dmg: "", type: "" });
    saveCharacter(character);
    renderAttacks();
  });

  character.attacks.forEach((a, idx) => {
    const row = document.createElement("div");
    row.className = "gridRow";
    row.innerHTML = `
      <input class="txt" placeholder="Nome" value="${escapeHtml(a.name||"")}">
      <input class="num" type="number" placeholder="+" value="${Number(a.toHit||0)}">
      <input class="txt" placeholder="Dano (ex: 1d8+5)" value="${escapeHtml(a.dmg||"")}">
      <input class="txt" placeholder="Tipo" value="${escapeHtml(a.type||"")}">
      <button class="dangerBtn" type="button" title="Remover">🗑</button>
    `;

    const [n,toh,dmg,typ,del] = $$("input,button", row);
    n.addEventListener("input", () => { a.name = n.value; saveCharacter(character); });
    toh.addEventListener("input", () => { a.toHit = clamp(toh.value,-30,30); saveCharacter(character); });
    dmg.addEventListener("input", () => { a.dmg = dmg.value; saveCharacter(character); });
    typ.addEventListener("input", () => { a.type = typ.value; saveCharacter(character); });
    del.addEventListener("click", () => {
      character.attacks.splice(idx,1);
      saveCharacter(character);
      renderAttacks();
    });

    wrap.appendChild(row);
  });
}

function renderInventory(){
  // money
  ["pp","po","pe","pc"].forEach(k => {
    bindInput(`#m_${k}`, () => character.inventory.money[k], (v) => character.inventory.money[k] = clamp(v,0,999999), { clamp:[0,999999] });
  });

  const wrap = $("#invList");
  if (!wrap) return;
  wrap.innerHTML = "";
  const add = $("#addItem");
  add?.addEventListener("click", () => {
    character.inventory.items.push({ item: "", qty: 1, notes: "" });
    saveCharacter(character);
    renderInventory();
  });

  character.inventory.items.forEach((it, idx) => {
    const row = document.createElement("div");
    row.className = "gridRow";
    row.innerHTML = `
      <input class="txt" placeholder="Item" value="${escapeHtml(it.item||"")}">
      <input class="num" type="number" placeholder="Qtd" value="${Number(it.qty||1)}">
      <input class="txt" placeholder="Notas / detalhes" value="${escapeHtml(it.notes||"")}">
      <div></div>
      <button class="dangerBtn" type="button" title="Remover">🗑</button>
    `;
    const inputs = $$("input", row);
    const del = $("button", row);
    inputs[0].addEventListener("input", () => { it.item = inputs[0].value; saveCharacter(character); });
    inputs[1].addEventListener("input", () => { it.qty = clamp(inputs[1].value,0,999); saveCharacter(character); });
    inputs[2].addEventListener("input", () => { it.notes = inputs[2].value; saveCharacter(character); });
    del.addEventListener("click", () => {
      character.inventory.items.splice(idx,1);
      saveCharacter(character);
      renderInventory();
    });
    wrap.appendChild(row);
  });
}

function renderFeatures(){
  const wrap = $("#featList");
  if (!wrap) return;
  wrap.innerHTML = "";
  const add = $("#addFeat");
  add?.addEventListener("click", () => {
    character.features.push({ title: "", detail: "" });
    saveCharacter(character);
    renderFeatures();
  });

  character.features.forEach((f, idx) => {
    const row = document.createElement("div");
    row.className = "gridRow";
    row.innerHTML = `
      <input class="txt" placeholder="Nome" value="${escapeHtml(f.title||"")}">
      <input class="txt" placeholder="Detalhes" value="${escapeHtml(f.detail||"")}">
      <div></div><div></div>
      <button class="dangerBtn" type="button" title="Remover">🗑</button>
    `;
    const inputs = $$("input", row);
    const del = $("button", row);
    inputs[0].addEventListener("input", () => { f.title = inputs[0].value; saveCharacter(character); });
    inputs[1].addEventListener("input", () => { f.detail = inputs[1].value; saveCharacter(character); });
    del.addEventListener("click", () => {
      character.features.splice(idx,1);
      saveCharacter(character);
      renderFeatures();
    });
    wrap.appendChild(row);
  });
}

// Other tabs
function renderOtherTabs(){
  bindTextarea("#tab_historia", () => character.tabs.historia, (v) => character.tabs.historia = v);
  bindTextarea("#tab_relacionados", () => character.tabs.relacionados, (v) => character.tabs.relacionados = v);
  bindTextarea("#tab_diario", () => character.tabs.diario, (v) => character.tabs.diario = v);
  bindTextarea("#tab_desenhos", () => character.tabs.desenhos, (v) => character.tabs.desenhos = v);
}

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[c]));
}

// Boot
function boot(){
  refreshHeader();

  // fill placeholders
  const pName = $("#profileName");
  if (pName) pName.textContent = character.profile.name || "Personagem";
  $("#profileLine1").textContent = [character.profile.class, character.profile.race].filter(Boolean).join(" • ") || "Classe • Raça";
  $("#profileLine2").textContent = `Nível ${character.profile.level || 1}` + (character.profile.background ? ` • ${character.profile.background}` : "");

  renderProfile();
  renderAbilities();
  renderStatus();
  renderPersonality();
  renderSkills();
  renderProficiencies();
  renderAttacks();
  renderInventory();
  renderFeatures();
  renderOtherTabs();

  // start at ficha
  setTab("ficha");
}

boot();
