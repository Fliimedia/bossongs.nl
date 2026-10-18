import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CAT_ICONS } from "./catIcons.js";
import { Viewer, Lightbox, VIEW_CSS, imgUrl } from "./viewer.jsx";

const API = "api.php";
const POLL_MS = 60000;

// Drie afgeleiden per foto. De carrousel trekt het middenformaat, dat op een
// telefoon met drievoudige pixeldichtheid nog ruim boven de schermbreedte zit;
// de volledige foto komt pas bij het openen.
const MAX_FULL = 3200;
const MAX_MID = 1400;
const MAX_THUMB = 640;
const Q_FULL = 0.9;
const Q_MID = 0.84;
const Q_THUMB = 0.8;

const MAX_CAPTION = 160;

// Uploaden en verwijderen staan uit in beeld; de code blijft staan voor later.
const SHOW_UPLOAD = false;
const SHOW_REMOVE = false;

const CATS = [
  { id: "ochtend", label: "Ochtend" },
  { id: "firstlook", label: "First look" },
  { id: "fotoshoot", label: "Fotoshoot" },
  { id: "ceremonie", label: "Ceremonie" },
  { id: "receptie", label: "Receptie" },
  { id: "diner", label: "Diner" },
  { id: "feest", label: "Feest" },
];

/* iconen voor de dagdelen, zie src/catIcons.js */
const CatIcon = ({ id }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: CAT_ICONS[id] }}
  />
);

const label = (id) => {
  const found = CATS.filter((x) => x.id === id)[0];
  return found ? found.label : "Foto's door gasten toegevoegd";
};

// Een sleutel per toestel, zodat een gast de foto's die hij zelf toevoegde kan
// aanpassen. Hij verlaat deze browser alleen als waarde die de server enkel
// gehasht bewaart.
function myKey() {
  try {
    let key = localStorage.getItem("mijn-sleutel");
    if (!key || /^[a-f0-9]{32}$/.test(key) === false) {
      const bytes = new Uint8Array(16);
      (window.crypto || window.msCrypto).getRandomValues(bytes);
      key = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      localStorage.setItem("mijn-sleutel", key);
    }
    return key;
  } catch (e) {
    return "";
  }
}

const CSS = `
.album{
  --paper:#f8f5ee;
  --ink:#15150f;
  --muted:#8a8578;
  --hair:rgba(21,21,15,0.12);
  --chip:rgba(21,21,15,0.06);
  min-height:100svh;
  margin:0;
  background:var(--paper);
  color:var(--ink);
  font-family:Inter,system-ui,sans-serif;
  line-height:1.5;
  -webkit-font-smoothing:antialiased;
  overflow-x:clip;
}
.album *{box-sizing:border-box;}
.album button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;}
.album :focus-visible{outline:2px solid var(--ink);outline-offset:3px;border-radius:3px;}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
  clip:rect(0 0 0 0);white-space:nowrap;border:0;}
.wrap{width:100%;max-width:34rem;margin:0 auto;padding:0 1.25rem;}

/* kop */
.head{padding:3.5rem 0 1.75rem;text-align:center;}
.head h1{margin:0;font-family:"Instrument Serif",Georgia,serif;font-weight:400;
  font-size:clamp(2rem,8vw,2.75rem);line-height:1.08;letter-spacing:-0.01em;}
.head p{margin:0.5rem 0 0;font-size:0.95rem;letter-spacing:0.02em;color:var(--muted);}
.add{display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
  margin-top:1.5rem;min-height:2.875rem;padding:0 1.35rem;border-radius:999px;
  background:var(--ink);color:var(--paper);font-size:0.875rem;font-weight:500;
  letter-spacing:0.01em;transition:opacity 200ms ease,transform 200ms ease;}
.add:hover:not(:disabled){opacity:0.85;}
.add:active:not(:disabled){transform:scale(0.98);}
.add:disabled{opacity:0.5;cursor:default;}

/* dagdeelfilters */
.chips{display:flex;flex-wrap:nowrap;gap:0.35rem;justify-content:center;padding:0.25rem 0 1.25rem;}
.chip{flex:1 1 0;min-width:0;max-width:3.5rem;height:2.6rem;display:flex;align-items:center;justify-content:center;border-radius:10px;background:transparent;color:var(--muted);transition:background-color 200ms ease,color 200ms ease;}
.chip:hover{color:var(--ink);}
.chip.on{background:var(--ink);color:var(--paper);}

.shimmer{aspect-ratio:4/5;border-radius:14px;
  background:linear-gradient(90deg,rgba(21,21,15,0.04),rgba(21,21,15,0.09),rgba(21,21,15,0.04));
  background-size:200% 100%;animation:shimmer 1.4s linear infinite;}

/* zelf genomen foto's, bewust klein */
.own{margin:3.5rem 0 0;padding:0 0 4rem;border-top:1px solid var(--hair);}
.own-toggle{display:flex;align-items:center;gap:0.45rem;width:100%;padding:1rem 0;
  font-size:0.8rem;color:var(--muted);transition:color 200ms ease;}
.own-toggle:hover{color:var(--ink);}
.own-toggle b{font-weight:500;}
.own-toggle span{margin-left:auto;font-variant-numeric:tabular-nums;}
.own-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.3rem;padding-bottom:0.5rem;}
.own-tile{display:block;width:100%;padding:0;aspect-ratio:1;overflow:hidden;
  border-radius:6px;background:rgba(21,21,15,0.05);line-height:0;
  transition:opacity 200ms ease;}
.own-tile:hover{opacity:0.82;}
.own-tile img{width:100%;height:100%;object-fit:cover;display:block;}
.own-empty{margin:0 0 1.25rem;font-size:0.8rem;color:var(--muted);}

/* beheer: alleen zichtbaar met sleutel */
.pick,.pick-to{display:flex;flex-wrap:wrap;align-items:center;gap:0.4rem;padding:0 0 0.7rem;}
.pick-to{padding-top:0.1rem;font-size:0.78rem;color:var(--muted);}
.pick-btn{padding:0.35rem 0.7rem;border-radius:8px;background:var(--chip);
  font-size:0.76rem;font-weight:500;color:var(--ink);
  transition:background-color 180ms ease,opacity 180ms ease;}
.pick-btn:hover:not(:disabled){background:rgba(21,21,15,0.12);}
.pick-btn:disabled{opacity:0.5;cursor:default;}
.pick-btn.solid{background:var(--ink);color:var(--paper);}
.pick-btn.solid:hover:not(:disabled){opacity:0.85;background:var(--ink);}
.pick-btn.bad{margin-left:auto;background:hsl(0,55%,42%);color:#fff;}
.pick-btn.bad:hover:not(:disabled){opacity:0.85;background:hsl(0,55%,42%);}
.pick-count{font-size:0.76rem;color:var(--muted);font-variant-numeric:tabular-nums;}
.own-tile.on{outline:2px solid var(--ink);outline-offset:-2px;}
.own-tile.on img{opacity:0.55;}

/* voortgang */
.bar{position:relative;height:0.25rem;border-radius:999px;background:var(--chip);
  overflow:hidden;margin-top:0.9rem;}
.bar span{position:absolute;inset:0 auto 0 0;border-radius:999px;background:var(--ink);
  transition:width 180ms ease;}
.note{margin:0.5rem 0 0;font-size:0.78rem;color:var(--muted);text-align:center;}
.note.bad{color:hsl(0,55%,42%);}

@keyframes fade{from{opacity:0;}to{opacity:1;}}
@keyframes pop{from{opacity:0;transform:scale(0.98);}to{opacity:1;transform:none;}}
@keyframes shimmer{from{background-position:200% 0;}to{background-position:-200% 0;}}

@media (min-width:700px){
  .own-grid{grid-template-columns:repeat(6,1fr);}
}
@media (prefers-reduced-motion:reduce){
  .album *{animation:none !important;transition:none !important;}
  .reel{scroll-behavior:auto;}
}
`;

/* ---------- iconen ---------- */

const Icon = ({ children, size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

const IconPlus = () => (
  <Icon size={16}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

const IconClose = () => (
  <Icon size={20}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

const IconChevron = ({ back }) => (
  <Icon size={20}>
    <path d={back ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </Icon>
);

const IconTrash = () => (
  <Icon size={15}>
    <path d="M4 7h16M9 7V5h6v2M7 7l1 12h8l1-12" />
  </Icon>
);

/* ---------- beeldbewerking ---------- */

// Browsers passen de EXIF-rotatie toe bij het decoderen naar een <img>, dus
// tekenen vanaf zo'n element geeft de rechtop staande pixels. Opnieuw coderen
// haalt meteen alle metadata weg, inclusief de GPS-locatie.
function decode(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

function scaled(img, max, quality) {
  const sw = img.naturalWidth || img.width;
  const sh = img.naturalHeight || img.height;
  const r = Math.min(1, max / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * r));
  const h = Math.max(1, Math.round(sh * r));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve({ blob, w, h }) : reject(new Error("encode"))),
      "image/jpeg",
      quality
    );
  });
}

/* ---------- opnametijdstip ----------
   Het herschalen gaat via een canvas en dat laat alle metadata achter, dus het
   tijdstip moet er eerst uit. Alleen JPEG heeft EXIF; voor de rest komt er nul
   uit en valt de volgorde terug op de volgorde van toevoegen. */

function readAscii(v, base, entry, le) {
  const count = v.getUint32(entry + 4, le);
  const off = count > 4 ? base + v.getUint32(entry + 8, le) : entry + 8;
  let out = "";
  for (let i = 0; i < count && off + i < v.byteLength; i++) {
    const c = v.getUint8(off + i);
    if (!c) break;
    out += String.fromCharCode(c);
  }
  return out;
}

// "2026:09:19 14:03:07" -> seconden sinds 1970. Als UTC gelezen: voor het
// sorteren telt alleen dat alle foto's op dezelfde manier worden uitgelegd.
function stamp(text) {
  const m = /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/.exec(text || "");
  if (!m) return 0;
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  return isNaN(t) ? 0 : Math.floor(t / 1000);
}

function tiffDate(v, base) {
  const le = v.getUint16(base) === 0x4949;
  if (!le && v.getUint16(base) !== 0x4d4d) return 0;
  if (v.getUint16(base + 2, le) !== 0x2a) return 0;

  const found = {};
  const walk = (dir, wanted) => {
    if (dir <= 0 || base + dir + 2 > v.byteLength) return;
    const n = v.getUint16(base + dir, le);
    for (let i = 0; i < n; i++) {
      const entry = base + dir + 2 + i * 12;
      if (entry + 12 > v.byteLength) return;
      const tag = v.getUint16(entry, le);
      if (wanted.indexOf(tag) === -1) continue;
      found[tag] = tag === 0x8769 ? v.getUint32(entry + 8, le) : readAscii(v, base, entry, le);
    }
  };

  walk(v.getUint32(base + 4, le), [0x8769, 0x0132]); // ExifIFD-verwijzing, DateTime
  if (found[0x8769]) walk(found[0x8769], [0x9003, 0x9004]); // Original, Digitized
  return stamp(found[0x9003]) || stamp(found[0x9004]) || stamp(found[0x0132]);
}

function parseJpeg(v) {
  if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return 0;
  let p = 2;
  while (p + 4 <= v.byteLength) {
    if (v.getUint8(p) !== 0xff) return 0;
    const marker = v.getUint8(p + 1);
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      p += 2;
      continue;
    }
    if (marker === 0xda) return 0; // vanaf hier begint de beelddata
    const len = v.getUint16(p + 2);
    if (
      marker === 0xe1 &&
      p + 10 < v.byteLength &&
      v.getUint32(p + 4) === 0x45786966 &&
      v.getUint16(p + 8) === 0
    ) {
      return tiffDate(v, p + 10);
    }
    if (len < 2) return 0;
    p += 2 + len;
  }
  return 0;
}

function takenAt(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(0);
    reader.onload = () => {
      try {
        resolve(parseJpeg(new DataView(reader.result)));
      } catch (e) {
        resolve(0);
      }
    };
    // De EXIF zit vooraan; een kwart megabyte is ruim genoeg.
    reader.readAsArrayBuffer(file.slice(0, 256 * 1024));
  });
}

async function prepare(file) {
  const taken = await takenAt(file);
  const img = await decode(file);
  const full = await scaled(img, MAX_FULL, Q_FULL);
  const mid = await scaled(img, MAX_MID, Q_MID);
  const thumb = await scaled(img, MAX_THUMB, Q_THUMB);
  return { full, mid, thumb, taken };
}

// XMLHttpRequest, omdat fetch geen voortgang van een upload geeft.
function send(parts, caption, cat, beheer, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("photo", parts.full.blob, "foto.jpg");
    form.append("mid", parts.mid.blob, "mid.jpg");
    form.append("thumb", parts.thumb.blob, "thumb.jpg");
    form.append("caption", caption);
    form.append("cat", cat);
    form.append("taken", String(parts.taken || 0));
    form.append("owner", myKey());
    if (beheer) form.append("key", beheer);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", API + "?a=upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch (e) {
        data = null;
      }
      if (xhr.status >= 200 && xhr.status < 300 && data && data.ok) resolve(data.item);
      else reject(new Error((data && data.error) || "http " + xhr.status));
    };
    xhr.onerror = () => reject(new Error("network"));
    xhr.send(form);
  });
}


/* ---------- onthouden ---------- */

const CAT_IDS = CATS.map((x) => x.id);

function readSaved() {
  const out = { cat: "ochtend", at: {}, favs: new Set() };
  try {
    const raw = JSON.parse(localStorage.getItem("foto-pos") || "{}");
    if (raw && CAT_IDS.indexOf(raw.cat) !== -1) out.cat = raw.cat;
    if (raw && raw.at && typeof raw.at === "object") out.at = raw.at;
    const f = JSON.parse(localStorage.getItem("foto-favs") || "[]");
    if (Array.isArray(f)) out.favs = new Set(f.filter((x) => typeof x === "string"));
  } catch (e) {
    /* geen opslag beschikbaar: dan begint alles bij het begin */
  }
  // Een link als #diner-23 gaat voor wat er onthouden was.
  const m = /^#([a-z]+)-(\d+)$/.exec(window.location.hash || "");
  if (m && CAT_IDS.indexOf(m[1]) !== -1) {
    out.cat = m[1];
    out.link = { cat: m[1], n: parseInt(m[2], 10) };
  }
  return out;
}

/* ---------- app ---------- */

export default function FotoApp() {
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [saved] = useState(readSaved);
  const [cat, setCat] = useState(saved.cat);
  const [at, setAt] = useState(saved.at); // laatst bekeken foto per dagdeel
  const [favs, setFavs] = useState(saved.favs);
  const [onlyFav, setOnlyFav] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState({ done: 0, total: 0, frac: 0 });
  const [note, setNote] = useState(null);
  const [beheer, setBeheer] = useState("");
  const [adminError, setAdminError] = useState("");
  const [ownOpen, setOwnOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const [picked, setPicked] = useState([]);
  const [view, setView] = useState(null); // { list, i }

  const pickRef = useRef(null);
  const noteTimer = useRef(0);

  /* De beheersleutel komt eenmalig binnen via ?beheer= en blijft daarna staan.
     In localStorage en niet in de sessie: een sessie verdwijnt zodra het
     tabblad sluit, en dan zou een volgende upload weer stilletjes bij de
     gastfoto's belanden. Mislukt het aanmelden, dan staat dat in beeld. */
  useEffect(() => {
    let key = "";
    let wantEmpty = false;
    try {
      const params = new URLSearchParams(window.location.search);
      const given = params.get("beheer");
      if (params.get("leeg") === "1") {
        wantEmpty = true;
        params.delete("leeg");
        const clean0 = window.location.pathname + (params.toString() ? "?" + params : "");
        window.history.replaceState(null, "", clean0);
      }
      if (given) {
        localStorage.setItem("beheer", given);
        params.delete("beheer");
        const clean = window.location.pathname + (params.toString() ? "?" + params : "");
        window.history.replaceState(null, "", clean);
      }
      key = localStorage.getItem("beheer") || sessionStorage.getItem("beheer") || "";
    } catch (e) {
      key = "";
    }
    if (!key) return;
    const form = new FormData();
    form.append("key", key);
    fetch(API + "?a=claim", { method: "POST", body: form })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.ok) {
          setBeheer(key);
          setAdminError("");
          if (wantEmpty && window.confirm("Alle foto's in de dagdelen verwijderen? De foto's van het feest blijven staan.")) {
            const f2 = new FormData();
            f2.append("key", key);
            fetch(API + "?a=empty", { method: "POST", body: f2 })
              .then((r) => r.json())
              .then((e) => {
                if (e && e.ok) {
                  setItems((cur) => (cur || []).filter((x) => x.cat === "gast"));
                  say(e.removed + " foto's verwijderd.", false);
                } else {
                  say((e && e.error) || "Leegmaken mislukt.", true);
                }
              })
              .catch(() => say("Leegmaken mislukt: geen verbinding.", true));
          }
        } else {
          setBeheer("");
          setAdminError((d && d.error) || "Beheer kon niet worden aangezet.");
        }
      })
      .catch(() => {
        setBeheer("");
        setAdminError("Beheer kon niet worden aangezet: geen verbinding.");
      });
  }, []);

  const load = useCallback(async () => {
    try {
      const body = new FormData();
      body.append("owner", myKey());
      const r = await fetch(API + "?a=list", { method: "POST", body, cache: "no-store" });
      const d = await r.json();
      if (d && d.ok && Array.isArray(d.items)) {
        setItems(d.items);
        setLoadError(false);
      } else {
        setLoadError(true);
      }
    } catch (e) {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible" && phase === "idle") load();
    };
    const t = window.setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [load, phase]);

  const say = useCallback((text, bad) => {
    window.clearTimeout(noteTimer.current);
    setNote({ text, bad });
    noteTimer.current = window.setTimeout(() => setNote(null), 4000);
  }, []);

  // Binnen een dagdeel telt het opnametijdstip uit de EXIF. Heeft een foto dat
  // niet, dan gaat hij achteraan, op de volgorde waarin hij is toegevoegd: het
  // id begint met de tijd in milliseconden, dus oplopend sorteren op id geeft
  // precies die volgorde terug. De gastfoto's staan juist nieuwste eerst.
  const byCat = useMemo(() => {
    const map = { gast: [] };
    CATS.forEach(({ id }) => (map[id] = []));
    (items || []).forEach((it) => {
      (map[it.cat] || map.gast).push(it);
    });
    const inOrder = (a, b) => {
      const ta = a.taken || 0;
      const tb = b.taken || 0;
      if (ta && tb && ta !== tb) return ta - tb;
      if (ta && !tb) return -1;
      if (!ta && tb) return 1;
      return a.id < b.id ? -1 : 1;
    };
    CATS.forEach(({ id }) => map[id].sort(inOrder));
    map.gast.sort((a, b) => (a.id > b.id ? -1 : 1));
    return map;
  }, [items]);

  const all = byCat[cat] || [];
  const shots = onlyFav ? all.filter((x) => favs.has(x.id)) : all;
  const favCount = all.filter((x) => favs.has(x.id)).length;
  const own = byCat.gast;
  const focusId = at[cat];
  const onFocus = useCallback((id) => setAt((a) => (a[cat] === id ? a : { ...a, [cat]: id })), [cat]);

  const toggleFav = useCallback((id) => {
    setFavs((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Wat er onthouden moet worden, blijft op dit toestel staan.
  useEffect(() => {
    try {
      localStorage.setItem("foto-pos", JSON.stringify({ cat, at }));
    } catch (e) {
      /* niet erg */
    }
  }, [cat, at]);
  useEffect(() => {
    try {
      localStorage.setItem("foto-favs", JSON.stringify([...favs]));
    } catch (e) {
      /* niet erg */
    }
  }, [favs]);

  // Een deellink zoals #diner-23 opent het dagdeel op die foto, zodra de lijst er is.
  const linked = useRef(saved.link || null);
  useEffect(() => {
    if (!items || !linked.current) return;
    const { cat: c, n } = linked.current;
    linked.current = null;
    const list = byCat[c] || [];
    const it = list[Math.max(0, Math.min(list.length - 1, n - 1))];
    if (it) setAt((a) => ({ ...a, [c]: it.id }));
  }, [items, byCat]);

  // Plakt iemand een andere deellink in dezelfde pagina, dan volgt die.
  useEffect(() => {
    const onHash = () => {
      const m = /^#([a-z]+)-(\d+)$/.exec(window.location.hash || "");
      if (!m || CAT_IDS.indexOf(m[1]) === -1) return;
      linked.current = { cat: m[1], n: parseInt(m[2], 10) };
      setCat(m[1]);
      setOnlyFav(false);
      setItems((cur) => (cur ? cur.slice() : cur));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // De adresbalk volgt de foto, zodat de link zelf al een deellink is.
  const syncHash = useCallback(() => {
    const k = Math.max(0, all.findIndex((x) => x.id === focusId));
    if (all.length) {
      const h = "#" + cat + "-" + (k + 1);
      if (window.location.hash !== h) {
        window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search + h);
      }
    }
  }, [all, cat, focusId]);
  useEffect(() => {
    if (view === null) syncHash();
  });

  /* uploaden */
  const onFiles = async (fileList) => {
    // Op naam sorteren, zodat een reeks van de fotograaf in de juiste volgorde
    // op de server belandt; het id bepaalt later de volgorde in de carrousel.
    const files = Array.from(fileList || [])
      .filter((f) => f && f.size > 0)
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    if (!files.length) return;

    // Met beheer bepaalt de gekozen chip het dagdeel; zonder beheer kan het
    // alleen bij de gastfoto's, en dat zegt de knop dan ook.
    const where = beheer ? cat : "gast";
    setPhase("busy");
    setProgress({ done: 0, total: files.length, frac: 0 });
    const added = [];
    for (let i = 0; i < files.length; i++) {
      setProgress({ done: i, total: files.length, frac: 0 });
      try {
        const parts = await prepare(files[i]);
        const item = await send(parts, "", where, beheer, (frac) =>
          setProgress({ done: i, total: files.length, frac })
        );
        added.push(item);
      } catch (e) {
        if (added.length) setItems((cur) => [...added, ...(cur || [])]);
        setPhase("idle");
        say(
          "Gestopt na " + added.length + " van " + files.length + " foto's: " +
            e.message + ".",
          true
        );
        return;
      }
    }
    setItems((cur) => [...added, ...(cur || [])]);
    setPhase("idle");
    if (where === "gast") {
      setOwnOpen(true);
      say(added.length === 1 ? "Je foto staat erbij." : "Je foto's staan erbij.", false);
    } else {
      say(added.length + " foto's toegevoegd aan " + label(where) + ".", false);
    }
  };

  /* foto's naar een ander dagdeel verplaatsen, in blokken van tweehonderd */
  const move = async (to) => {
    const ids = picked.slice();
    if (!ids.length) return;
    setPhase("busy");
    let done = 0;
    try {
      for (let i = 0; i < ids.length; i += 200) {
        const form = new FormData();
        form.append("ids", ids.slice(i, i + 200).join(","));
        form.append("cat", to);
        form.append("key", beheer);
        const r = await fetch(API + "?a=recat", { method: "POST", body: form });
        const d = await r.json();
        if (!d || !d.ok) throw new Error((d && d.error) || "verplaatsen mislukt");
        done += d.moved;
      }
    } catch (e) {
      setPhase("idle");
      say("Verplaatsen is gestopt na " + done + " foto's: " + e.message + ".", true);
      await load();
      return;
    }
    setItems((cur) =>
      (cur || []).map((x) => (ids.indexOf(x.id) === -1 ? x : { ...x, cat: to }))
    );
    setPicked([]);
    setPicking(false);
    setPhase("idle");
    setCat(to);
    say(done + " foto's verplaatst naar " + label(to) + ".", false);
  };

  /* geselecteerde foto's definitief weghalen, ook in blokken van tweehonderd */
  const wipe = async () => {
    const ids = picked.slice();
    if (!ids.length) return;
    if (!window.confirm(ids.length + " foto's definitief verwijderen?")) return;
    setPhase("busy");
    let done = 0;
    try {
      for (let i = 0; i < ids.length; i += 200) {
        const form = new FormData();
        form.append("ids", ids.slice(i, i + 200).join(","));
        form.append("key", beheer);
        form.append("owner", myKey());
        const r = await fetch(API + "?a=delete", { method: "POST", body: form });
        const d = await r.json();
        if (!d || !d.ok) throw new Error((d && d.error) || "verwijderen mislukt");
        done += d.removed;
      }
    } catch (e) {
      setPhase("idle");
      say("Verwijderen is gestopt na " + done + " foto's: " + e.message + ".", true);
      await load();
      return;
    }
    setItems((cur) => (cur || []).filter((x) => ids.indexOf(x.id) === -1));
    setPicked([]);
    setPicking(false);
    setPhase("idle");
    say(done + " foto's verwijderd.", false);
  };

  /* alle foto's van het gekozen dagdeel in een keer weg */
  const emptyCat = async () => {
    const n = (byCat[cat] || []).length;
    if (!n) return;
    if (!window.confirm("Alle " + n + " foto's in " + label(cat) + " verwijderen?")) return;
    setPhase("busy");
    try {
      const form = new FormData();
      form.append("key", beheer);
      form.append("cat", cat);
      const r = await fetch(API + "?a=empty", { method: "POST", body: form });
      const d = await r.json();
      if (!d || !d.ok) throw new Error((d && d.error) || "leegmaken mislukt");
      setItems((cur) => (cur || []).filter((x) => x.cat !== cat));
      say(d.removed + " foto's verwijderd uit " + label(cat) + ".", false);
    } catch (e) {
      say("Leegmaken is mislukt: " + e.message + ".", true);
      await load();
    }
    setPhase("idle");
  };

  const toggle = (id) =>
    setPicked((cur) => (cur.indexOf(id) === -1 ? [...cur, id] : cur.filter((x) => x !== id)));

  // De nieuwste staan vooraan, dus "t/m hier" pakt precies een reeks die in
  // een keer is geupload, zonder dat je elke tegel los hoeft aan te tikken.
  const pickThrough = () => {
    const last = own.findIndex((x) => x.id === picked[0]);
    if (last >= 0) setPicked(own.slice(0, last + 1).map((x) => x.id));
  };

  /* volledige foto: de carrousel blijft op de laatst bekeken foto staan */
  useEffect(() => {
    if (view && view.cat !== "gast") {
      const it = view.list[view.i];
      if (it) setAt((a) => (a[view.cat] === it.id ? a : { ...a, [view.cat]: it.id }));
    }
  }, [view]);

  // Na het sluiten corrigeert de terugknop de adresbalk soms net te laat.
  useEffect(() => {
    if (view !== null) return undefined;
    const t = window.setTimeout(syncHash, 80);
    return () => window.clearTimeout(t);
  }, [view]);

  const remove = async (id) => {
    if (!window.confirm("Deze foto verwijderen?")) return;
    try {
      const form = new FormData();
      form.append("id", id);
      form.append("owner", myKey());
      if (beheer) form.append("key", beheer);
      const r = await fetch(API + "?a=delete", { method: "POST", body: form });
      const d = await r.json();
      if (d && d.ok) {
        setItems((cur) => (cur || []).filter((x) => x.id !== id));
        setView(null);
        say("Foto verwijderd.", false);
      } else {
        say((d && d.error) || "Verwijderen is niet gelukt.", true);
      }
    } catch (e) {
      say("Verwijderen is niet gelukt.", true);
    }
  };

  const current = view ? view.list[view.i] : null;
  const busy = phase === "busy";
  const pct = progress.total
    ? Math.round(((progress.done + progress.frac) / progress.total) * 100)
    : 0;

  return (
    <div className="album">
      <style>{CSS + VIEW_CSS}</style>

      <main className="wrap">
        <header className="head">
          <h1>Foto album bruiloft</h1>
          <p>Nya &#10084;&#65039; Sten</p>
          {SHOW_UPLOAD && (
          <button
            className="add"
            type="button"
            onClick={() => pickRef.current && pickRef.current.click()}
            disabled={busy}
          >
            <IconPlus />
            {busy ? "Bezig" : beheer ? "Toevoegen aan " + label(cat) : "Foto toevoegen"}
          </button>
          )}

          {adminError && <p className="note bad">{adminError}</p>}

          {busy && (
            <>
              <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                <span style={{ width: pct + "%" }} />
              </div>
              <p className="note">
                Foto {Math.min(progress.done + 1, progress.total)} van {progress.total}
              </p>
            </>
          )}
          {note && <p className={"note" + (note.bad ? " bad" : "")}>{note.text}</p>}
        </header>

        <div className="chips" role="tablist" aria-label="Dagdeel">
          {CATS.map((x) => (
            <button
              key={x.id}
              className={"chip" + (cat === x.id ? " on" : "")}
              type="button"
              role="tab"
              aria-selected={cat === x.id}
              aria-label={x.label}
              title={x.label}
              onClick={() => setCat(x.id)}
            >
              <CatIcon id={x.id} />
            </button>
          ))}
        </div>

        {items === null && !loadError && <div className="shimmer" aria-hidden="true" />}
        {loadError && items === null && (
          <div className="blank">Het album kon niet worden geladen.</div>
        )}
        {items !== null && (shots.length > 0 || onlyFav || all.length > 0) && (
          <Viewer
            key={cat}
            shots={shots}
            focusId={focusId}
            onFocus={onFocus}
            onOpen={(i) => setView({ list: shots, i, cat })}
            favs={favs}
            onFav={toggleFav}
            onlyFav={onlyFav}
            onOnlyFav={setOnlyFav}
            favCount={favCount}
            blank="Nog geen favorieten in dit dagdeel."
          />
        )}
        {items !== null && all.length === 0 && !onlyFav && (
          <div className="blank">Nog geen foto&#8217;s in dit dagdeel.</div>
        )}

        {SHOW_REMOVE && beheer && shots.length > 0 && (
          <div className="pick-to">
            <button className="pick-btn bad" type="button" onClick={emptyCat} disabled={busy}>
              {"Leeg " + label(cat)}
            </button>
          </div>
        )}

        <section className="own">
          <button
            className="own-toggle"
            type="button"
            onClick={() => setOwnOpen((v) => !v)}
            aria-expanded={ownOpen}
          >
            <IconPlus />
            <b>Foto&#8217;s door gasten toegevoegd</b>
            <span>{own.length}</span>
          </button>
          {ownOpen && own.length === 0 && (
            <p className="own-empty">Nog niets toegevoegd.</p>
          )}

          {ownOpen && beheer && own.length > 0 && (
            <div className="pick">
              <button
                className="pick-btn"
                type="button"
                onClick={() => {
                  setPicking((v) => !v);
                  setPicked([]);
                }}
              >
                {picking ? "Klaar" : "Selecteren"}
              </button>
              {picking && (
                <>
                  <span className="pick-count">{picked.length} gekozen</span>
                  <button className="pick-btn" type="button" onClick={() => setPicked(own.map((x) => x.id))}>
                    Alles
                  </button>
                  {picked.length === 1 && (
                    <button className="pick-btn" type="button" onClick={pickThrough}>
                      T/m hier
                    </button>
                  )}
                  {picked.length > 0 && (
                    <button className="pick-btn" type="button" onClick={() => setPicked([])}>
                      Wis
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {ownOpen && picking && picked.length > 0 && (
            <div className="pick-to">
              <span>Verplaats naar</span>
              {CATS.map((x) => (
                <button
                  key={x.id}
                  className="pick-btn solid"
                  type="button"
                  onClick={() => move(x.id)}
                  disabled={busy}
                >
                  {x.label}
                </button>
              ))}
              {SHOW_REMOVE && (
                <button className="pick-btn bad" type="button" onClick={wipe} disabled={busy}>
                  Verwijderen
                </button>
              )}
            </div>
          )}

          {ownOpen && own.length > 0 && (
            <div className="own-grid">
              {own.map((item, i) => (
                <button
                  key={item.id}
                  className={"own-tile" + (picked.indexOf(item.id) !== -1 ? " on" : "")}
                  type="button"
                  onClick={() => (picking ? toggle(item.id) : setView({ list: own, i, cat: "gast" }))}
                  aria-pressed={picking ? picked.indexOf(item.id) !== -1 : undefined}
                  aria-label={item.caption || "Foto door gast"}
                >
                  <img src={imgUrl(item.id, "thumb")} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      {SHOW_UPLOAD && (
      <input
        ref={pickRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        multiple
        hidden
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      )}

      {current && (
        <Lightbox
          list={view.list}
          index={view.i}
          onIndex={(k) => setView((v) => (v ? { ...v, i: k } : v))}
          onClose={() => setView(null)}
          favs={favs}
          onFav={toggleFav}
          onRemove={SHOW_REMOVE && (current.mine || beheer) ? remove : null}
        />
      )}
    </div>
  );
}
