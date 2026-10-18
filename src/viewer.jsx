import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { UI_ICONS } from "./uiIcons.js";

export const imgUrl = (id, size, dl) =>
  "api.php?a=img&s=" + size + "&id=" + id + (dl ? "&dl=1" : "");

const saver = () => {
  try {
    const c = navigator.connection;
    return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || "")));
  } catch (e) {
    return false;
  }
};

export const PIcon = ({ name, size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    dangerouslySetInnerHTML={{ __html: UI_ICONS[name] }}
  />
);

const Chevron = ({ back }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={back ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

const Cross = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/* ---------- carrousel ---------- */

const Reel = forwardRef(function Reel(
  { shots, focusId, onFocus, onOpen, reach, onUser },
  ref
) {
  const box = useRef(null);
  const found = shots.findIndex((s) => s.id === focusId);
  const index = found < 0 ? 0 : found;
  const own = useRef(undefined); // de foto die de carrousel zelf als laatste meldde
  const lastScroll = useRef(0);

  // De positie volgt de gekozen foto als die van buiten komt (raster, lichtbak,
  // deellink) of als de lijst verschuift. Tijdens het vegen zelf blijft de
  // carrousel met rust: de React-staat loopt dan een paar beeldjes achter, en
  // terugzetten naar die oude stand voelde als terugspringen.
  // Eén stap is de afstand tussen twee foto's. Op een telefoon is dat de
  // schermbreedte; op een groot scherm zijn de foto's smaller dan het vak, met
  // de buren zichtbaar aan weerszijden, en de ruimte ertussen telt dan mee.
  const step = () => {
    const el = box.current;
    if (!el) return 0;
    const k = el.children;
    return k.length > 1 ? k[1].offsetLeft - k[0].offsetLeft : el.clientWidth;
  };

  // Mobiel: de onderkant van de foto tegen de onderkant van het scherm.
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const root = document.documentElement;
      if (window.innerWidth >= 900) {
        root.style.removeProperty("--avail");
        return;
      }
      const top = el.getBoundingClientRect().top + window.scrollY;
      root.style.setProperty("--avail", Math.max(0, window.innerHeight - top) + "px");
    };
    fit();
    const t = window.setTimeout(fit, 400);
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
    };
  }, []);

  useLayoutEffect(() => {
    const el = box.current;
    const w = step();
    if (!el || !w || found < 0) return;
    const external = focusId !== own.current;
    const idle = Date.now() - lastScroll.current > 300;
    if (!external && !idle) return;
    own.current = focusId;
    if (Math.round(el.scrollLeft / w) !== found) {
      el.scrollTo({ left: found * w, behavior: "instant" });
    }
  }, [focusId, shots, found]);

  // Een ander venster of een gedraaid scherm verandert de maat: opnieuw uitlijnen.
  useEffect(() => {
    const onSize = () => {
      const el = box.current;
      const w = step();
      if (el && w && found >= 0) el.scrollTo({ left: found * w, behavior: "instant" });
    };
    window.addEventListener("resize", onSize);
    return () => window.removeEventListener("resize", onSize);
  }, [found]);

  const here = () => {
    const el = box.current;
    const w = step();
    if (!el || !w) return 0;
    return Math.max(0, Math.min(shots.length - 1, Math.round(el.scrollLeft / w)));
  };

  const onScroll = () => {
    lastScroll.current = Date.now();
    const k = here();
    const it = shots[k];
    if (it && it.id !== own.current) {
      own.current = it.id;
      onFocus(it.id);
    }
  };

  useImperativeHandle(ref, () => ({
    index: here,
    goTo: (i, smooth) => {
      const el = box.current;
      if (el) el.scrollTo({ left: i * step(), behavior: smooth ? "smooth" : "instant" });
    },
  }));

  const go = (d) => {
    const el = box.current;
    if (el) el.scrollBy({ left: d * step(), behavior: "smooth" });
  };

  return (
    <div className="reel-box">
      <div
        className="reel"
        ref={box}
        onScroll={onScroll}
        onPointerDown={onUser}
        onWheel={onUser}
      >
        {shots.map((item, i) => {
          const near = Math.abs(i - index) <= reach;
          return (
            <div className={"slide" + (i === index ? " cur" : "")} key={item.id}>
              <button
                className="hit"
                type="button"
                onClick={() => {
                  // Op een groot scherm haalt een tik op een buurfoto die naar het midden.
                  if (i !== index && window.matchMedia("(min-width:900px)").matches) {
                    const el = box.current;
                    if (el) el.scrollTo({ left: i * step(), behavior: "smooth" });
                  } else {
                    onOpen(i);
                  }
                }}
                aria-label={item.caption || "Foto " + (i + 1) + " van " + shots.length}
              >
                {near && (
                  <img className="ph" src={imgUrl(item.id, "thumb")} alt="" aria-hidden="true" decoding="async" />
                )}
                {near && (
                  <img
                    className="main"
                    src={imgUrl(item.id, item.mid ? "mid" : "full")}
                    alt={item.caption || ""}
                    decoding="async"
                    ref={(n) => {
                      if (n && n.complete && n.naturalWidth) n.classList.add("in");
                    }}
                    onLoad={(e) => e.currentTarget.classList.add("in")}
                  />
                )}
                {item.caption && <span className="cap">{item.caption}</span>}
              </button>
              <a
                className="dl"
                href={imgUrl(item.id, "full", true)}
                download
                aria-label="Foto downloaden"
              >
                <PIcon name="download" size={20} />
              </a>
            </div>
          );
        })}
      </div>
      <button className="reel-nav reel-prev" type="button" onClick={() => go(-1)}
        disabled={index === 0} aria-label="Vorige foto">
        <Chevron back />
      </button>
      <button className="reel-nav reel-next" type="button" onClick={() => go(1)}
        disabled={index >= shots.length - 1} aria-label="Volgende foto">
        <Chevron />
      </button>
    </div>
  );
});

/* ---------- raster ---------- */

function Grid({ shots, focusId, favs, onPick }) {
  const on = useRef(null);
  useLayoutEffect(() => {
    if (on.current) on.current.scrollIntoView({ block: "center", behavior: "instant" });
  }, []);
  return (
    <div className="grid">
      {shots.map((item) => (
        <button
          key={item.id}
          ref={item.id === focusId ? on : null}
          className={"cell" + (item.id === focusId ? " on" : "")}
          type="button"
          onClick={() => onPick(item.id)}
          aria-label={item.caption || "Foto openen"}
        >
          <img src={imgUrl(item.id, "thumb")} alt="" loading="lazy" decoding="async" />
          {favs.has(item.id) && (
            <span className="heart"><PIcon name="heartFill" size={14} /></span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ---------- carrousel met werkbalk ---------- */

export function Viewer({
  shots, focusId, onFocus, onOpen, favs, onFav, onlyFav, onOnlyFav, favCount, blank, onMove, onRemove, onUpload, uploading, uploadLabel,
}) {
  const [mode, setMode] = useState("reel");
  const [playing, setPlaying] = useState(false);
  const reel = useRef(null);
  const found = shots.findIndex((s) => s.id === focusId);
  const index = found < 0 ? 0 : found;
  const cur = shots[index];
  const empty = shots.length === 0;
  const asGrid = mode === "grid" || empty;
  const reach = saver() ? 1 : 3;

  useEffect(() => {
    if (!playing) return undefined;
    const t = window.setInterval(() => {
      const r = reel.current;
      if (!r || !shots.length) return;
      const i = r.index();
      const next = i + 1 >= shots.length ? 0 : i + 1;
      r.goTo(next, next !== 0);
    }, 4000);
    const hidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [playing, shots.length]);

  const stop = () => setPlaying(false);

  // Op een computer: pijltjes bladeren door de carrousel, Enter opent de foto.
  useEffect(() => {
    if (mode !== "reel" || empty) return undefined;
    const key = (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      const tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (document.querySelector(".lb")) return;
      const r = reel.current;
      if (!r) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stop();
        r.goTo(Math.min(shots.length - 1, r.index() + 1), true);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stop();
        r.goTo(Math.max(0, r.index() - 1), true);
      } else if (e.key === "Enter" && tag !== "BUTTON" && tag !== "A") {
        onOpen(r.index());
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [mode, empty, shots.length, onOpen]);

  // Alleen met beheer: de positie in het dagdeel is in te vullen.
  const [draft, setDraft] = useState("");
  useEffect(() => setDraft(String(index + 1)), [index, shots.length]);
  const target = parseInt(draft, 10);
  const valid = Number.isFinite(target) && target >= 1 && target <= shots.length;
  const submit = (e) => {
    e.preventDefault();
    if (onMove && cur && valid && target !== index + 1) onMove(cur.id, target);
  };

  return (
    <div className={"stage" + (onUpload ? " has-up" : "")}>
      {onUpload && (
        <button
          className="up"
          type="button"
          onClick={onUpload}
          disabled={uploading}
          aria-label={uploadLabel}
          title={uploadLabel}
        >
          <PIcon name="upload" size={20} />
        </button>
      )}
      {empty && <div className="blank">{blank}</div>}
      {!empty && mode === "reel" && (
        <Reel
          ref={reel}
          shots={shots}
          focusId={focusId}
          onFocus={onFocus}
          onOpen={(i) => {
            stop();
            onOpen(i);
          }}
          reach={reach}
          onUser={stop}
        />
      )}
      {!empty && mode === "grid" && (
        <Grid
          shots={shots}
          focusId={focusId}
          favs={favs}
          onPick={(id) => {
            onFocus(id);
            setMode("reel");
          }}
        />
      )}

      {!(empty && !onlyFav) && (
      <div className="tools">
        <div className="tl">
          {asGrid ? (
            <button
              className={"tb" + (onlyFav ? " on" : "")}
              type="button"
              aria-pressed={onlyFav}
              aria-label="Alleen favorieten"
              onClick={() => onOnlyFav(!onlyFav)}
            >
              <PIcon name={onlyFav ? "heartFill" : "heart"} />
              {favCount > 0 && <span>{favCount}</span>}
            </button>
          ) : (
            <button
              className={"tb" + (cur && favs.has(cur.id) ? " on" : "")}
              type="button"
              aria-pressed={!!(cur && favs.has(cur.id))}
              aria-label="Favoriet"
              onClick={() => cur && onFav(cur.id)}
            >
              <PIcon name={cur && favs.has(cur.id) ? "heartFill" : "heart"} />
            </button>
          )}
        </div>
        {onMove && !asGrid && shots.length > 1 ? (
          <form className="meter jump" onSubmit={submit}>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max={shots.length}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Positie"
            />
            <span>/ {shots.length}</span>
            {valid && target !== index + 1 && (
              <button type="submit" className="go">Verplaats</button>
            )}
          </form>
        ) : (
          <p className="meter">
            {empty ? "0" : asGrid ? shots.length : <><em>{index + 1}</em> / {shots.length}</>}
          </p>
        )}
        <div className="tr">
          {!asGrid && shots.length > 1 && (
            <button
              className="tb"
              type="button"
              aria-label={playing ? "Diavoorstelling stoppen" : "Diavoorstelling starten"}
              onClick={() => setPlaying((p) => !p)}
            >
              <PIcon name={playing ? "pause" : "play"} />
            </button>
          )}
          {onRemove && !asGrid && cur && (
            <button
              className="tb"
              type="button"
              aria-label="Foto verwijderen"
              onClick={() => {
                stop();
                onRemove(cur.id);
              }}
            >
              <PIcon name="trash" />
            </button>
          )}
          {!empty && (
            <button
              className="tb"
              type="button"
              aria-label={mode === "grid" ? "Carrousel tonen" : "Overzicht tonen"}
              onClick={() => {
                stop();
                setMode(mode === "grid" ? "reel" : "grid");
              }}
            >
              <PIcon name={mode === "grid" ? "photo" : "grid"} />
            </button>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

/* ---------- volledige foto ---------- */

export function Lightbox({ list, index, onIndex, onClose, favs, onFav, onRemove }) {
  const item = list[index];
  const root = useRef(null);
  const pic = useRef(null);
  const T = useRef({ s: 1, x: 0, y: 0 });
  const ptr = useRef(new Map());
  const g = useRef({ mode: "", sx: 0, sy: 0, bx: 0, by: 0, t0: 0, d0: 1, s0: 1, mx: 0, my: 0, moved: false });
  const tap = useRef({ t: 0, x: 0, y: 0 });
  const track = useRef(null);
  const snapping = useRef(false);
  const [desk] = useState(
    () => window.matchMedia("(min-width:900px) and (hover:hover)").matches
  );
  const n = list.length;

  const paint = (anim) => {
    const el = pic.current;
    if (!el) return;
    const { s, x, y } = T.current;
    el.style.transition = anim ? "transform 240ms cubic-bezier(.2,.75,.3,1)" : "none";
    el.style.transform = "translate3d(" + x + "px," + y + "px,0) scale(" + s + ")";
  };
  const fade = (o) => {
    if (root.current) root.current.style.background = "rgba(10,10,8," + o + ")";
  };
  const limit = () => {
    const img = pic.current && pic.current.querySelector("img");
    if (!img) return;
    const mx = Math.max(0, (img.clientWidth * T.current.s - window.innerWidth) / 2);
    const my = Math.max(0, (img.clientHeight * T.current.s - window.innerHeight) / 2);
    T.current.x = Math.max(-mx, Math.min(mx, T.current.x));
    T.current.y = Math.max(-my, Math.min(my, T.current.y));
  };
  const reset = (anim) => {
    T.current = { s: 1, x: 0, y: 0 };
    paint(anim);
    fade(1);
  };

  // De drie panelen (vorige, huidige, volgende) liggen naast elkaar op een baan
  // die met de vinger meegaat. Daarna schuift de baan met een vloeiende
  // beweging naar de buurfoto; pas dan wisselt de huidige foto, in dezelfde
  // beeldslag als waarin de baan terugspringt, zodat er niets knippert.
  const GAP = 16;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wraps = n > 2;
  const hasNb = (dir) => (wraps ? n > 1 : dir > 0 ? index < n - 1 : index > 0);
  const moveTrack = (x, ms) => {
    const el = track.current;
    if (!el) return;
    el.style.transition = ms ? "transform " + ms + "ms cubic-bezier(.22,.8,.3,1)" : "none";
    el.style.transform = "translate3d(" + x + "px,0,0)";
  };
  const slide = (dir) => {
    if (snapping.current || !hasNb(dir)) return false;
    snapping.current = true;
    if (T.current.s > 1.02) reset(false);
    const to = -dir * (window.innerWidth + GAP);
    const ms = calm ? 0 : 300;
    moveTrack(to, ms);
    window.setTimeout(() => {
      flushSync(() => onIndex(wraps ? (index + dir + n) % n : index + dir));
      moveTrack(0, 0);
      snapping.current = false;
    }, ms ? ms - 10 : 0);
    return true;
  };

  // Een nieuwe foto begint altijd onvergroot en op zijn plek.
  useLayoutEffect(() => {
    reset(false);
  }, [item.id]);

  useEffect(() => {
    const prev = list[(index - 1 + n) % n];
    const next = list[(index + 1) % n];
    [prev, next].forEach((it) => {
      if (it && it.mid) new Image().src = imgUrl(it.id, "mid");
    });
    if (!saver() && next) new Image().src = imgUrl(next.id, "full");
  }, [index]);

  useEffect(() => {
    history.pushState({ lb: 1 }, "");
    let popped = false;
    const onPop = () => {
      popped = true;
      onClose();
    };
    window.addEventListener("popstate", onPop);
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("popstate", onPop);
      document.body.style.overflow = before;
      if (!popped && history.state && history.state.lb) history.back();
    };
  }, []);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") slide(1);
      if (e.key === "ArrowLeft") slide(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, n, onIndex, onClose]);

  useEffect(() => {
    const el = root.current && root.current.querySelector(".lb-stage");
    if (!el) return undefined;
    const wheel = (e) => {
      e.preventDefault();
      const s0 = T.current.s;
      const s = Math.max(1, Math.min(5, s0 * Math.exp(-e.deltaY * 0.0015)));
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const qx = (e.clientX - cx - T.current.x) / s0;
      const qy = (e.clientY - cy - T.current.y) / s0;
      T.current = s <= 1.01 ? { s: 1, x: 0, y: 0 } : { s, x: e.clientX - cx - qx * s, y: e.clientY - cy - qy * s };
      limit();
      paint(false);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);

  const onImage = (x, y) => {
    const img = pic.current && pic.current.querySelector("img");
    if (!img) return false;
    const r = img.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const down = (e) => {
    if (snapping.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    ptr.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const gg = g.current;
    if (ptr.current.size === 1) {
      Object.assign(gg, {
        mode: "", sx: e.clientX, sy: e.clientY, bx: T.current.x, by: T.current.y,
        t0: Date.now(), moved: false,
      });
    } else if (ptr.current.size === 2) {
      const [a, b] = [...ptr.current.values()];
      Object.assign(gg, {
        mode: "pinch", d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, s0: T.current.s,
        mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, bx: T.current.x, by: T.current.y, moved: true,
      });
    }
  };

  const move = (e) => {
    const p = ptr.current.get(e.pointerId);
    if (!p) return;
    p.x = e.clientX;
    p.y = e.clientY;
    const gg = g.current;
    if (gg.mode === "pinch" && ptr.current.size >= 2) {
      const [a, b] = [...ptr.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const s = Math.max(0.8, Math.min(5, (gg.s0 * d) / gg.d0));
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const qx = (gg.mx - cx - gg.bx) / gg.s0;
      const qy = (gg.my - cy - gg.by) / gg.s0;
      T.current = { s, x: mx - cx - qx * s, y: my - cy - qy * s };
      paint(false);
      return;
    }
    if (ptr.current.size !== 1) return;
    const dx = e.clientX - gg.sx;
    const dy = e.clientY - gg.sy;
    if (!gg.moved && Math.hypot(dx, dy) > 8) gg.moved = true;
    if (!gg.moved) return;
    if (T.current.s > 1.02) {
      gg.mode = "pan";
      T.current.x = gg.bx + dx;
      T.current.y = gg.by + dy;
      paint(false);
      return;
    }
    if (!gg.mode) gg.mode = Math.abs(dy) > Math.abs(dx) ? "dismiss" : "swipe";
    if (gg.mode === "dismiss") {
      T.current = { s: 1 - Math.min(Math.abs(dy), 300) / 1500, x: dx * 0.3, y: dy };
      paint(false);
      fade(Math.max(0.15, 1 - Math.abs(dy) / 420));
    } else if (gg.mode === "swipe") {
      // Zonder buurfoto aan die kant rekt de baan maar een stukje mee.
      moveTrack(hasNb(dx < 0 ? 1 : -1) ? dx : dx * 0.3, 0);
    }
  };

  const up = (e) => {
    if (!ptr.current.has(e.pointerId)) return;
    ptr.current.delete(e.pointerId);
    const gg = g.current;
    if (gg.mode === "pinch") {
      if (ptr.current.size === 0) {
        if (T.current.s < 1.05) T.current = { s: 1, x: 0, y: 0 };
        else limit();
        paint(true);
        gg.mode = "";
      } else {
        const [r] = [...ptr.current.values()];
        Object.assign(gg, { mode: "pan", sx: r.x, sy: r.y, bx: T.current.x, by: T.current.y, moved: true });
      }
      return;
    }
    if (ptr.current.size > 0) return;
    const dx = e.clientX - gg.sx;
    const dy = e.clientY - gg.sy;
    const dt = Math.max(1, Date.now() - gg.t0);

    if (!gg.moved) {
      const now = Date.now();
      const tp = tap.current;
      if (now - tp.t < 320 && Math.hypot(e.clientX - tp.x, e.clientY - tp.y) < 32) {
        tap.current = { t: 0, x: 0, y: 0 };
        if (T.current.s > 1.02) {
          T.current = { s: 1, x: 0, y: 0 };
        } else {
          const s = 2.6;
          T.current = {
            s,
            x: -(e.clientX - window.innerWidth / 2) * (s - 1),
            y: -(e.clientY - window.innerHeight / 2) * (s - 1),
          };
          limit();
        }
        paint(true);
        return;
      }
      tap.current = { t: now, x: e.clientX, y: e.clientY };
      if (T.current.s <= 1.02 && !onImage(e.clientX, e.clientY)) onClose();
      return;
    }
    if (gg.mode === "pan") {
      limit();
      paint(true);
      return;
    }
    if (gg.mode === "dismiss") {
      if (Math.abs(dy) > 110 || Math.abs(dy) / dt > 0.6) onClose();
      else reset(true);
      return;
    }
    if (gg.mode === "swipe") {
      const dir = dx < 0 ? 1 : -1;
      const far = Math.abs(dx) > window.innerWidth * 0.18 || Math.abs(dx) / dt > 0.45;
      if (!(far && slide(dir))) moveTrack(0, calm ? 0 : 260);
    }
  };

  const fav = favs.has(item.id);

  return (
    <div
      className="lb"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || "Volledige foto"}
    >
      <div
        className="lb-stage"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div className="lb-track" ref={track}>
          {[-1, 0, 1].map((pos) => {
            if (pos !== 0 && (n < 2 || !hasNb(pos))) return null;
            const it = list[wraps ? (index + pos + n) % n : index + pos];
            if (!it) return null;
            return (
              <div className={"lb-pane p" + pos} key={it.id}>
                <div className="lb-pic" ref={pos === 0 ? pic : null}>
                  <img
                    className="base"
                    src={imgUrl(it.id, it.mid ? "mid" : "thumb")}
                    alt=""
                    draggable="false"
                  />
                  {pos === 0 && (
                    <img
                      className="full"
                      src={imgUrl(it.id, "full")}
                      alt={it.caption || "Volledige foto"}
                      draggable="false"
                      onLoad={(e) => e.currentTarget.classList.add("in")}
                      ref={(el) => {
                        if (el && el.complete && el.naturalWidth) el.classList.add("in");
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lb-prog" aria-hidden="true">
        <span style={{ width: ((index + 1) / n) * 100 + "%" }} />
      </div>

      <div className="lb-top l">
        <button
          className={"lb-btn" + (fav ? " on" : "")}
          type="button"
          aria-pressed={fav}
          aria-label="Favoriet"
          onClick={() => onFav(item.id)}
        >
          <PIcon name={fav ? "heartFill" : "heart"} size={20} />
        </button>
        {onRemove && (
          <button className="lb-btn" type="button" aria-label="Foto verwijderen" onClick={() => onRemove(item.id)}>
            <PIcon name="trash" size={20} />
          </button>
        )}
      </div>
      <div className="lb-top r">
        <a
          className="lb-btn"
          href={imgUrl(item.id, "full", true)}
          download
          aria-label="Foto downloaden"
        >
          <PIcon name="download" size={20} />
        </a>
        <button className="lb-btn" type="button" aria-label="Sluiten" onClick={onClose}>
          <Cross />
        </button>
      </div>

      {n > 1 && (
        <>
          <button className="lb-arrow l" type="button" aria-label="Vorige"
            onClick={() => slide(-1)}>
            <Chevron back />
          </button>
          <button className="lb-arrow r" type="button" aria-label="Volgende"
            onClick={() => slide(1)}>
            <Chevron />
          </button>
        </>
      )}
      {desk && n > 1 && (
        <div className="lb-strip">
          {list.slice(Math.max(0, index - 8), Math.min(n, index + 9)).map((it, j) => {
            const k = Math.max(0, index - 8) + j;
            return (
              <button
                key={it.id}
                className={"th" + (k === index ? " on" : "")}
                type="button"
                aria-label={"Foto " + (k + 1)}
                onClick={() => onIndex(k)}
              >
                <img src={imgUrl(it.id, "thumb")} alt="" loading="lazy" decoding="async" />
              </button>
            );
          })}
        </div>
      )}
      <p className="lb-cap">
        {item.caption ? item.caption + " · " : ""}
        {index + 1} / {n}
      </p>
    </div>
  );
}

/* ---------- stijl ---------- */

export const VIEW_CSS = `
.reel-box{position:relative;}
.reel{display:flex;gap:0;overflow-x:auto;scroll-snap-type:x mandatory;
  scroll-behavior:smooth;overscroll-behavior-x:contain;
  scrollbar-width:none;-ms-overflow-style:none;}
.reel::-webkit-scrollbar{display:none;}
.slide{position:relative;flex:0 0 100%;scroll-snap-align:center;aspect-ratio:auto;
  height:max(18rem,var(--avail,calc(100dvh - 13.5rem)));
  overflow:hidden;background:rgba(21,21,15,0.05);}
.slide .hit{position:absolute;inset:0;width:100%;height:100%;padding:0;display:block;line-height:0;}
.slide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
.slide .ph{object-fit:contain;}
.slide .main{object-fit:contain;opacity:0;transition:opacity 380ms ease;}
.slide .main.in{opacity:1;}
.slide .cap{position:absolute;left:0;right:0;bottom:0;padding:2.5rem 0.9rem 0.8rem;
  background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.55));
  color:#fff;font-size:0.8rem;line-height:1.35;text-align:left;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.slide .dl{position:absolute;top:0.65rem;right:0.65rem;z-index:2;display:inline-flex;
  align-items:center;justify-content:center;width:2.4rem;height:2.4rem;border-radius:999px;
  background:rgba(14,14,10,0.38);color:#fff;text-decoration:none;
  -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);
  transition:background-color 200ms ease;}
.stage.has-up .slide .dl{right:3.55rem;}
.album .up{position:absolute;top:0.65rem;right:0.65rem;z-index:4;display:inline-flex;align-items:center;
  justify-content:center;width:2.4rem;height:2.4rem;padding:0;border-radius:999px;
  background:rgba(14,14,10,0.38);color:#fff;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);
  transition:background-color 200ms ease,opacity 200ms ease;}
.album .up:hover:not(:disabled){background:rgba(14,14,10,0.6);}
.album .up:disabled{opacity:0.55;cursor:default;}
.slide .dl:hover{background:rgba(14,14,10,0.6);}
.reel-nav{position:absolute;top:50%;z-index:2;display:none;
  align-items:center;justify-content:center;width:2.25rem;height:2.25rem;padding:0;
  margin-top:-1.125rem;border-radius:999px;background:rgba(255,255,255,0.9);
  color:var(--ink);box-shadow:0 2px 10px rgba(0,0,0,0.18);transition:background-color 200ms ease;}
.reel-nav:hover{background:#fff;}
.reel-nav[disabled]{opacity:0;pointer-events:none;}
.reel-prev{left:0.5rem;}
.reel-next{right:0.5rem;}

.stage{position:relative;left:50%;transform:translateX(-50%);width:calc(100vw - 4px);}
@media (min-width:700px){
  .stage{width:min(calc(100vw - 4px),max(16rem,calc((100svh - 19rem) * 0.8)));}
  .reel-nav{display:inline-flex;}
}

.tools{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0.5rem 0.4rem 0;}
.tl{justify-self:start;display:flex;}
.tr{justify-self:end;display:flex;gap:0.1rem;}
.tb{display:inline-flex;align-items:center;gap:0.3rem;min-width:2.5rem;height:2.5rem;
  padding:0 0.55rem;justify-content:center;border-radius:10px;color:var(--muted);
  font-size:0.75rem;font-variant-numeric:tabular-nums;transition:color 200ms ease,background-color 200ms ease;}
.tb:hover{color:var(--ink);}
.tb.on{color:hsl(0,62%,48%);}
.meter{margin:0;font-size:0.75rem;letter-spacing:0.08em;color:var(--muted);
  font-variant-numeric:tabular-nums;text-align:center;}
.meter em{font-style:normal;color:var(--ink);}

.meter.jump{display:flex;align-items:center;gap:0.4rem;}
.meter.jump input{width:3.4rem;height:2rem;padding:0;border:0;border-radius:8px;text-align:center;
  background:rgba(21,21,15,0.07);color:var(--ink);font:inherit;font-size:0.8rem;
  letter-spacing:0;-moz-appearance:textfield;appearance:textfield;}
.meter.jump input::-webkit-outer-spin-button,.meter.jump input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
.album .meter.jump .go{height:2rem;padding:0 0.7rem;border-radius:8px;background:var(--ink);
  color:var(--paper);font-size:0.72rem;font-weight:500;letter-spacing:0.02em;}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;}
@media (min-width:1100px){.grid{grid-template-columns:repeat(4,1fr);}}
.cell{position:relative;display:block;width:100%;padding:0;aspect-ratio:4/5;overflow:hidden;
  background:rgba(21,21,15,0.05);line-height:0;content-visibility:auto;contain-intrinsic-size:auto 200px;}
.cell img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity 200ms ease;}
.cell:hover img{opacity:0.85;}
.cell.on{outline:2px solid var(--ink);outline-offset:-2px;}
.cell .heart{position:absolute;right:0.35rem;bottom:0.35rem;color:#fff;line-height:0;
  filter:drop-shadow(0 1px 3px rgba(0,0,0,0.5));}
.blank{display:flex;align-items:center;justify-content:center;aspect-ratio:4/5;
  background:rgba(21,21,15,0.04);color:var(--muted);font-size:0.875rem;text-align:center;padding:2rem;}

.lb{position:fixed;inset:0;z-index:60;background:rgba(10,10,8,1);
  overscroll-behavior:contain;animation:fade 200ms ease both;}
.lb-stage{position:absolute;inset:0;touch-action:none;user-select:none;
  -webkit-user-select:none;-webkit-touch-callout:none;overflow:hidden;}
.lb-track{position:absolute;inset:0;will-change:transform;}
.lb-pane{position:absolute;inset:0;}
.lb-pane.p-1{transform:translateX(calc(-100% - 16px));}
.lb-pane.p1{transform:translateX(calc(100% + 16px));}
.lb-pic{position:absolute;inset:0;display:grid;place-items:center;will-change:transform;}
.lb-pic img{grid-area:1/1;max-width:100vw;max-height:100svh;max-height:100dvh;width:auto;height:auto;
  display:block;object-fit:contain;-webkit-user-drag:none;}
.lb-pic .full{opacity:0;transition:opacity 260ms ease;}
.lb-pic .full.in{opacity:1;}
.lb-prog{position:absolute;top:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.14);pointer-events:none;}
.lb-prog span{display:block;height:100%;background:rgba(255,255,255,0.8);transition:width 200ms ease;}
.lb-top{position:absolute;top:max(0.8rem,env(safe-area-inset-top));display:flex;gap:0.45rem;z-index:3;}
.lb-top.l{left:0.8rem;}
.lb-top.r{right:0.8rem;}
.lb-btn{display:inline-flex;align-items:center;justify-content:center;width:2.6rem;height:2.6rem;
  padding:0;border-radius:999px;background:rgba(255,255,255,0.14);color:#fff;text-decoration:none;
  -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);}
.lb-btn.on{color:hsl(0,80%,66%);}
.lb-btn.wide{width:auto;padding:0 0.9rem;font-size:0.78rem;}
.lb-btn.bad{background:hsl(0,55%,42%);}
.lb-arrow{position:absolute;top:50%;margin-top:-1.25rem;display:none;align-items:center;
  justify-content:center;width:2.5rem;height:2.5rem;padding:0;border-radius:999px;
  background:rgba(255,255,255,0.14);color:#fff;z-index:3;}
.lb-arrow.l{left:1rem;}
.lb-arrow.r{right:1rem;}
@media (hover:hover) and (pointer:fine){.lb-arrow{display:inline-flex;}}
.lb-cap{position:absolute;left:1rem;right:1rem;bottom:max(1rem,env(safe-area-inset-bottom));margin:0;
  text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.78);pointer-events:none;
  text-shadow:0 1px 4px rgba(0,0,0,0.6);}
.album .lb-btn,.album .lb-arrow{color:#fff;}
.album .lb-btn.on{color:hsl(0,80%,66%);}
.album .tb{color:var(--muted);}
.album .tb:hover{color:var(--ink);}
.album .tb.on{color:hsl(0,62%,48%);}
.album .reel-nav{color:var(--ink);}

.lb-strip{position:absolute;left:50%;bottom:3rem;transform:translateX(-50%);z-index:3;display:flex;gap:0.35rem;
  padding:0.4rem;border-radius:10px;background:rgba(255,255,255,0.08);max-width:calc(100vw - 2rem);overflow:hidden;
  -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);}
.album .th{flex:0 0 auto;width:3rem;height:3.75rem;padding:0;overflow:hidden;border-radius:4px;opacity:0.5;
  transition:opacity 200ms ease;}
.album .th:hover{opacity:0.85;}
.album .th.on{opacity:1;outline:2px solid #fff;outline-offset:-2px;}
.th img{width:100%;height:100%;object-fit:cover;display:block;}

/* groot scherm: de foto's krijgen de hoogte van het scherm, de buren staan er gedimd naast */
@media (min-width:900px){
  .stage{left:auto;transform:none;width:100%;--h:max(22rem,calc(100svh - 9rem));}
  .reel{padding-inline:calc((100% - var(--h) * 0.8) / 2);gap:1.25rem;}
  .reel{-webkit-mask-image:linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent);
    mask-image:linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent);}
  .slide{max-height:none;flex:0 0 auto;width:calc(var(--h) * 0.8);height:var(--h);aspect-ratio:auto;border-radius:6px;
    transition:opacity 400ms ease,transform 400ms cubic-bezier(.2,.7,.3,1);}
  .slide:not(.cur){opacity:0.38;transform:scale(0.93);}
  .slide:not(.cur) .dl{display:none;}
  .stage.has-up .slide .dl{right:0.65rem;}
  .tools{width:calc(var(--h) * 0.8);margin:0 auto;}
  .blank{width:calc(var(--h) * 0.8);height:var(--h);aspect-ratio:auto;margin:0 auto;}
  .grid{grid-template-columns:repeat(auto-fill,minmax(12rem,1fr));gap:0.5rem;}
  .cell{border-radius:4px;}
  .reel-nav{width:2.75rem;height:2.75rem;margin-top:-1.375rem;}
  .reel-prev{left:1rem;}
  .reel-next{right:1rem;}
}
@media (min-width:900px) and (hover:hover){
  .lb-pic{padding:3.5rem 0 7.5rem;}
  .lb-pic img{max-height:calc(100svh - 11rem);}
}
`;
