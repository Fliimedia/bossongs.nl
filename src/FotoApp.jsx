import { useCallback, useEffect, useRef, useState } from "react";

const API = "api.php";
const POLL_MS = 20000;
const MAX_FULL = 1600;
const MAX_THUMB = 480;
const MAX_CAPTION = 160;

const COPY = {
  nl: {
    eyebrow: "Fotoalbum",
    lead: "Maak een foto en zet hem meteen in ons album.",
    take: "Camera",
    pick: "Galerij",
    takeLong: "Maak een foto",
    pickLong: "Kies uit je galerij",
    captionLabel: "Beschrijving",
    optional: "optioneel",
    placeholder: "Bijvoorbeeld: de eerste dans",
    forAll: "Deze beschrijving komt bij alle gekozen foto's",
    share: "Zet in het album",
    preparing: "Foto's voorbereiden",
    uploading: "Bezig met uploaden",
    of: "van",
    cancel: "Annuleren",
    retry: "Opnieuw proberen",
    doneOne: "Je foto staat in het album",
    doneMany: "Je foto's staan in het album",
    album: "Het album",
    empty: "Nog geen foto's. Maak jij de eerste?",
    loadFailed: "Het album kon niet worden geladen.",
    refresh: "Vernieuwen",
    one: "foto",
    many: "foto's",
    failed: "Uploaden is niet gelukt. Controleer je verbinding en probeer het opnieuw.",
    unreadable: "Dit bestand kon niet als foto worden gelezen.",
    close: "Sluiten",
    prev: "Vorige",
    next: "Volgende",
    remove: "Verwijderen",
    removeAsk: "Deze foto uit het album halen?",
    home: "Naar de uitnodiging",
    photoAlt: "Foto uit het album",
    today: "Vandaag",
    yesterday: "Gisteren",
    composeTitle: "Zet in het album",
  },
  en: {
    eyebrow: "Photo album",
    lead: "Take a photo and drop it straight into our album.",
    take: "Camera",
    pick: "Gallery",
    takeLong: "Take a photo",
    pickLong: "Choose from your gallery",
    captionLabel: "Caption",
    optional: "optional",
    placeholder: "For example: the first dance",
    forAll: "This caption goes with all selected photos",
    share: "Add to the album",
    preparing: "Preparing photos",
    uploading: "Uploading",
    of: "of",
    cancel: "Cancel",
    retry: "Try again",
    doneOne: "Your photo is in the album",
    doneMany: "Your photos are in the album",
    album: "The album",
    empty: "No photos yet. Will you take the first?",
    loadFailed: "The album could not be loaded.",
    refresh: "Refresh",
    one: "photo",
    many: "photos",
    failed: "The upload did not go through. Check your connection and try again.",
    unreadable: "This file could not be read as a photo.",
    close: "Close",
    prev: "Previous",
    next: "Next",
    remove: "Remove",
    removeAsk: "Remove this photo from the album?",
    home: "Back to the invitation",
    photoAlt: "Photo from the album",
    today: "Today",
    yesterday: "Yesterday",
    composeTitle: "Add to the album",
  },
};

const CSS = `
.album{
  --shade-1:#ffffff;
  --shade-3:hsl(0,0%,81.9%);
  --shade-4:hsl(204,2.2%,45.3%);
  --shade-6:#000000;
  --brand:hsl(48,35.7%,94.5%);
  --paper:#faf3e6;
  --gold-pale:#f3e0b4;
  --gold-light:#d9b268;
  --gold:#b1873f;
  --gold-deep:#8a6524;
  --gold-line:rgba(177,135,63,0.42);
  --gold-line-soft:rgba(177,135,63,0.22);
  --space-1:0.5rem;
  --space-2:1rem;
  --space-3:1.5rem;
  --space-4:2.5rem;
  --space-5:4rem;
  --type-label:0.78rem;
  min-height:100vh;
  font-family:Inter,system-ui,sans-serif;
  color:var(--shade-6);
  background:var(--paper);
  line-height:1.5;
  padding-bottom:calc(7rem + env(safe-area-inset-bottom));
}
.album *{box-sizing:border-box;}
.album button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;}
.album :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:2px;}
.serif{font-family:"Instrument Serif",Georgia,serif;font-weight:400;letter-spacing:0;}
.wrap{width:100%;max-width:64rem;margin:0 auto;padding:0 var(--space-3);}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
  clip:rect(0 0 0 0);white-space:nowrap;border:0;}

/* top bar */
.top{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;
  padding:0.7rem var(--space-3);background:rgba(250,243,230,0.9);backdrop-filter:blur(8px);
  border-bottom:1px solid var(--gold-line-soft);}
.top-home{display:inline-flex;}
.top-home img{width:1.75rem;height:auto;display:block;}
.lang{position:relative;display:inline-flex;align-items:center;padding:0.15rem;border-radius:999px;
  border:1px solid var(--gold-line-soft);background:rgba(255,255,255,0.7);}
.lang-thumb{position:absolute;top:0.15rem;left:0.15rem;width:calc(50% - 0.15rem);height:calc(100% - 0.3rem);
  border-radius:999px;background:var(--shade-1);box-shadow:0 1px 3px rgba(96,74,40,0.18);
  transition:transform 260ms cubic-bezier(.4,0,.2,1);}
.lang-thumb[data-on="en"]{transform:translateX(100%);}
.lang-opt{position:relative;z-index:1;display:inline-flex;align-items:center;gap:0.28rem;
  padding:0.2rem 0.5rem;border-radius:999px;line-height:1;color:var(--shade-4);transition:color 200ms ease;}
.lang-opt.is-on{color:var(--gold);}
.lang-flag{font-size:0.72rem;filter:grayscale(1);opacity:0.55;transition:filter 200ms ease,opacity 200ms ease;}
.lang-opt.is-on .lang-flag{filter:none;opacity:1;}
.lang-code{font-size:0.65rem;font-weight:600;letter-spacing:0.08em;}

/* hero */
.hero{display:flex;flex-direction:column;align-items:center;text-align:center;
  padding:var(--space-3) 0 var(--space-4);}
.polaroids{width:min(100%,30rem);height:auto;margin:0 auto 0.5rem;display:block;
  filter:drop-shadow(0 12px 22px rgba(96,74,40,0.18));}
.eyebrow{margin:0;font-size:var(--type-label);font-weight:600;letter-spacing:0.14em;
  text-transform:uppercase;color:var(--gold);}
.rule{display:flex;align-items:center;gap:0.5rem;width:7rem;margin:0.5rem auto 0.75rem;color:var(--gold);}
.rule span{flex:1 1 0;height:1px;background:currentColor;}
.rule span:first-child{background:linear-gradient(90deg,transparent,currentColor);}
.rule span:last-child{background:linear-gradient(90deg,currentColor,transparent);}
.rule i{width:0.32rem;height:0.32rem;transform:rotate(45deg);background:currentColor;border-radius:1px;}
.lead{margin:0.6rem 0 0;color:var(--shade-4);max-width:32ch;font-size:0.95rem;}
.actions{display:flex;flex-wrap:wrap;gap:var(--space-1) var(--space-2);justify-content:center;
  margin-top:var(--space-3);}

/* two big targets: camera and gallery, nothing else competing */
.choices{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);
  width:min(100%,26rem);margin:var(--space-3) auto 0;}
.choice{display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:0.6rem;min-height:8.5rem;padding:var(--space-2);
  border:1px solid var(--gold-line);border-radius:16px;
  background:rgba(255,255,255,0.7);color:var(--shade-6);
  font-size:0.85rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;
  transition:transform 200ms cubic-bezier(.2,.7,.3,1),box-shadow 200ms ease,
    background-color 200ms ease;}
.choice svg{color:var(--gold);}
.choice:hover:not(:disabled){transform:translateY(-3px);
  box-shadow:0 14px 26px rgba(96,74,40,0.18);}
.choice:active:not(:disabled){transform:translateY(0);}
.choice:disabled{opacity:0.55;cursor:default;}
.choice-primary{background:var(--shade-6);border-color:var(--shade-6);color:var(--shade-1);}
.choice-primary svg{color:var(--gold-light);}
.choice-primary:hover:not(:disabled){background:#241d12;}
.hint{margin:0;font-size:0.85rem;color:var(--shade-4);text-align:center;}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:0.55rem;min-height:3.25rem;
  padding:0 1.5rem;border-radius:999px;font-size:0.92rem;font-weight:600;letter-spacing:0.02em;
  transition:transform 200ms ease,background-color 200ms ease,opacity 200ms ease,box-shadow 200ms ease;}
.btn:disabled{opacity:0.55;cursor:default;}
.btn-primary{background:var(--shade-6);color:var(--shade-1);}
.btn-primary:hover:not(:disabled){background:#241d12;}
.btn-primary svg{color:var(--gold-light);}
.btn-ghost{border:1px solid var(--gold-line);color:var(--shade-6);background:rgba(255,255,255,0.65);}
.btn-ghost:hover:not(:disabled){background:var(--shade-1);}
.btn-ghost svg{color:var(--gold);}

/* compose */
.scrim{position:fixed;inset:0;z-index:40;background:rgba(38,28,12,0.55);
  backdrop-filter:blur(2px);animation:lb-in 200ms ease both;}
.compose{position:fixed;left:0;right:0;bottom:0;z-index:41;
  display:flex;flex-direction:column;gap:var(--space-2);
  max-height:92vh;overflow-y:auto;
  padding:0.75rem var(--space-3) calc(var(--space-3) + env(safe-area-inset-bottom));
  background:var(--paper);border-radius:20px 20px 0 0;
  box-shadow:0 -18px 40px rgba(20,12,2,0.28);
  animation:sheet-up 320ms cubic-bezier(.2,.8,.3,1) both;}
.grip{width:2.5rem;height:0.25rem;margin:0 auto 0.4rem;border-radius:999px;
  background:var(--gold-line);}
.compose-title{margin:0 0 0.25rem;font-size:1.35rem;line-height:1.2;text-align:center;}
@keyframes sheet-up{from{transform:translateY(100%);}to{transform:none;}}
@keyframes sheet-up-wide{
  from{transform:translate(-50%,110%);}
  to{transform:translate(-50%,0);}
}
.previews{display:flex;justify-content:center;}
.previews img{display:block;max-width:100%;max-height:42vh;border-radius:12px;
  box-shadow:0 18px 34px rgba(96,74,40,0.2);}
.previews.many{justify-content:flex-start;gap:0.5rem;overflow-x:auto;padding-bottom:0.35rem;
  scrollbar-width:thin;}
.previews.many img{flex:0 0 auto;height:9rem;width:auto;border-radius:8px;
  box-shadow:0 8px 18px rgba(96,74,40,0.16);}
.field{position:relative;display:flex;flex-direction:column;gap:0.5rem;}
.field-label{font-size:var(--type-label);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;}
.field-label em{margin-left:0.4rem;font-style:normal;font-weight:400;letter-spacing:0;
  text-transform:none;color:var(--shade-4);}
.field textarea{width:100%;resize:none;padding:0.9rem 1rem 1.7rem;border:1px solid var(--gold-line);
  border-radius:10px;background:var(--shade-1);font:inherit;font-size:1rem;line-height:1.45;}
.field textarea:focus{outline:2px solid var(--gold);outline-offset:0;border-color:transparent;}
.count{position:absolute;right:0.85rem;bottom:0.55rem;font-size:0.7rem;color:var(--shade-4);
  font-variant-numeric:tabular-nums;}
.upload-state{display:flex;flex-direction:column;gap:0.6rem;}
.bar{position:relative;height:0.45rem;border-radius:999px;background:var(--gold-pale);overflow:hidden;}
.bar span{position:absolute;top:0;bottom:0;left:0;border-radius:999px;background:var(--gold);
  transition:width 200ms ease;}
.error{margin:0;padding:0.8rem 1rem;border-radius:10px;background:hsl(0,100%,95%);
  color:hsl(0,72%,30%);font-size:0.9rem;text-align:center;}
.compose .actions{margin-top:0;}

/* gallery */
.gallery{padding-top:var(--space-2);}
.day{display:flex;align-items:center;gap:0.75rem;margin:var(--space-3) 0 var(--space-2);
  font-size:var(--type-label);font-weight:600;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--gold);}
.day::after{content:"";flex:1 1 0;height:1px;background:var(--gold-line-soft);}
.day:first-of-type{margin-top:var(--space-1);}
.gallery-head{display:flex;align-items:baseline;gap:var(--space-2);margin-bottom:var(--space-2);}
.gallery-head h2{margin:0;font-size:1.75rem;line-height:1.1;}
.count-pill{font-size:var(--type-label);letter-spacing:0.08em;text-transform:uppercase;color:var(--gold);}
.refresh{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;
  border-radius:999px;color:var(--gold);border:1px solid var(--gold-line-soft);background:rgba(255,255,255,0.65);
  transition:transform 400ms ease;}
.refresh:active{transform:rotate(180deg);}
/* photographs keep their own shape; cropping every face into a square is
   the fastest way to make a wedding album look like a spreadsheet */
.grid{columns:2;column-gap:0.5rem;}
.tile{position:relative;display:block;width:100%;margin:0 0 0.5rem;overflow:hidden;
  border-radius:10px;background:var(--brand);line-height:0;
  break-inside:avoid;-webkit-column-break-inside:avoid;
  box-shadow:0 6px 16px rgba(96,74,40,0.14);
  transition:transform 260ms cubic-bezier(.2,.7,.3,1),box-shadow 260ms ease;
  animation:tile-in 400ms ease both;}
.tile:hover{transform:translateY(-3px);box-shadow:0 14px 26px rgba(96,74,40,0.22);}
.tile img{width:100%;height:auto;display:block;}
.tile-cap{position:absolute;left:0;right:0;bottom:0;padding:1.6rem 0.7rem 0.6rem;
  background:linear-gradient(180deg,rgba(20,12,2,0),rgba(20,12,2,0.72));
  color:#fff;font-size:0.78rem;line-height:1.35;text-align:left;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.skeleton{columns:2;column-gap:0.5rem;}
.skeleton span{display:block;margin:0 0 0.5rem;border-radius:10px;break-inside:avoid;
  background:linear-gradient(90deg,var(--brand),#fff,var(--brand));background-size:200% 100%;
  animation:shimmer 1.4s linear infinite;}
.skeleton span:nth-child(3n){height:9rem;}
.skeleton span:nth-child(3n+1){height:12rem;}
.skeleton span:nth-child(3n+2){height:7rem;}
.empty{margin:0;padding:var(--space-4) 0;text-align:center;color:var(--shade-4);}
@keyframes tile-in{from{opacity:0;transform:scale(0.96);}to{opacity:1;transform:none;}}
@keyframes shimmer{from{background-position:200% 0;}to{background-position:-200% 0;}}

/* the camera button follows you down the page */
.dock{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;justify-content:center;
  padding:var(--space-4) var(--space-3) calc(var(--space-2) + env(safe-area-inset-bottom));
  background:linear-gradient(180deg,rgba(250,243,230,0),var(--paper) 55%);pointer-events:none;
  animation:dock-in 300ms ease both;}
.dock .btn{pointer-events:auto;min-width:min(100%,20rem);box-shadow:0 12px 28px rgba(96,74,40,0.28);}
@keyframes dock-in{from{opacity:0;transform:translateY(0.75rem);}to{opacity:1;transform:none;}}

/* toast */
.toast{position:fixed;left:50%;bottom:calc(7rem + env(safe-area-inset-bottom));z-index:30;
  transform:translateX(-50%);max-width:90vw;padding:0.75rem 1.1rem;border-radius:999px;
  background:var(--shade-6);color:var(--shade-1);font-size:0.9rem;text-align:center;
  box-shadow:0 12px 28px rgba(0,0,0,0.25);animation:toast-in 250ms ease both;}
.toast.bad{background:hsl(0,60%,38%);}
@keyframes toast-in{from{opacity:0;transform:translate(-50%,0.5rem);}to{opacity:1;transform:translate(-50%,0);}}

/* lightbox */
.lb{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;
  padding:var(--space-3);background:rgba(38,28,12,0.78);backdrop-filter:blur(3px);
  animation:lb-in 220ms ease both;touch-action:pan-y;}
.lb-frame{position:relative;margin:0;max-width:min(92vw,58rem);max-height:88vh;display:flex;
  flex-direction:column;padding:0.7rem;background:var(--shade-1);border-radius:10px;
  box-shadow:0 30px 60px rgba(20,12,2,0.5);animation:lb-rise 300ms cubic-bezier(.2,.75,.3,1) both;}
.lb-frame::after{content:"";position:absolute;inset:0.35rem;border-radius:7px;
  border:1px solid var(--gold-line-soft);pointer-events:none;}
.lb-frame img{display:block;max-width:100%;max-height:calc(88vh - 5.5rem);width:auto;height:auto;
  margin:0 auto;border-radius:5px;}
.lb-frame figcaption{padding:0.75rem 0.4rem 0.2rem;text-align:center;}
.lb-caption{margin:0;font-family:"Instrument Serif",Georgia,serif;font-size:1.2rem;line-height:1.3;}
.lb-meta{margin:0.2rem 0 0;font-size:var(--type-label);letter-spacing:0.08em;text-transform:uppercase;
  color:var(--gold);}
.lb-btn{position:absolute;z-index:2;display:inline-flex;align-items:center;justify-content:center;
  width:2.75rem;height:2.75rem;border-radius:999px;background:rgba(255,255,255,0.92);color:var(--shade-6);
  box-shadow:0 4px 12px rgba(20,12,2,0.3);transition:background-color 200ms ease,transform 200ms ease;}
.lb-btn:hover{background:#fff;transform:scale(1.05);}
.lb-close{top:var(--space-3);right:var(--space-3);}
.lb-prev{left:var(--space-2);top:50%;margin-top:-1.375rem;}
.lb-next{right:var(--space-2);top:50%;margin-top:-1.375rem;}
.lb-count{position:absolute;bottom:var(--space-3);left:0;right:0;margin:0;text-align:center;
  font-size:var(--type-label);letter-spacing:0.14em;color:rgba(255,252,244,0.75);}
.lb-remove{position:absolute;top:var(--space-3);left:var(--space-3);z-index:2;display:inline-flex;
  align-items:center;gap:0.4rem;padding:0.55rem 0.9rem;border-radius:999px;
  background:hsl(0,60%,38%);color:#fff;font-size:0.8rem;font-weight:600;}
@keyframes lb-in{from{opacity:0;}to{opacity:1;}}
@keyframes lb-rise{from{opacity:0;transform:translateY(1.2rem) scale(0.97);}to{opacity:1;transform:none;}}

@media (min-width:600px){
  .grid,.skeleton{columns:3;column-gap:0.7rem;}
  .tile,.skeleton span{margin-bottom:0.7rem;}
  .compose{left:50%;right:auto;width:min(38rem,100%);
    border-radius:20px;bottom:var(--space-3);animation-name:sheet-up-wide;}
}
@media (min-width:900px){
  .grid,.skeleton{columns:4;}
  .hero{padding-top:var(--space-4);}
}
@media (prefers-reduced-motion:reduce){
  .album *{animation:none !important;transition:none !important;}
}
`;

/* ---------- icons ---------- */

const Icon = ({ children, size = 20 }) => (
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

const IconCamera = ({ size }) => (
  <Icon size={size}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.1-2h6.4l1.1 2h2.2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z" />
    <circle cx="12" cy="13" r="3.4" />
  </Icon>
);

const IconImages = ({ size }) => (
  <Icon size={size}>
    <rect x="3.5" y="5.5" width="14" height="12" rx="1.5" />
    <path d="M20.5 8v9.5a2 2 0 0 1-2 2H7" />
    <path d="M3.5 15l4-4 3 3 2.5-2.5 4.5 4.5" />
    <circle cx="13.5" cy="9" r="1.2" />
  </Icon>
);

const IconHeart = () => (
  <Icon size={18}>
    <path d="M12 20s-7.2-4.4-9.1-8.6A5.1 5.1 0 0 1 12 6.6a5.1 5.1 0 0 1 9.1 4.8C19.2 15.6 12 20 12 20z" />
  </Icon>
);

const IconRefresh = () => (
  <Icon size={18}>
    <path d="M20 12a8 8 0 1 1-2.3-5.7" />
    <path d="M20 4v5h-5" />
  </Icon>
);

const IconClose = () => (
  <Icon>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

const IconChevron = ({ back }) => (
  <Icon size={22}>
    <path d={back ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </Icon>
);

const IconTrash = () => (
  <Icon size={16}>
    <path d="M4 7h16M9 7V5h6v2M7 7l1 12h8l1-12" />
  </Icon>
);

/* ---------- image handling ---------- */

// Browsers apply EXIF orientation when decoding into an <img>, so drawing from
// one gives the upright pixels, and re-encoding strips the metadata (and GPS).
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
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve({ blob, w, h }) : reject(new Error("encode"))),
      "image/jpeg",
      quality
    );
  });
}

async function prepare(file) {
  const img = await decode(file);
  const full = await scaled(img, MAX_FULL, 0.84);
  const thumb = await scaled(img, MAX_THUMB, 0.78);
  return { full, thumb, preview: URL.createObjectURL(full.blob) };
}

function release(entry) {
  if (entry && entry.preview) URL.revokeObjectURL(entry.preview);
}

// XMLHttpRequest, because fetch gives no upload progress.
function upload(entry, caption, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("photo", entry.full.blob, "foto.jpg");
    form.append("thumb", entry.thumb.blob, "thumb.jpg");
    form.append("caption", caption);
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

const thumbUrl = (id) => API + "?a=img&s=thumb&id=" + id;
const fullUrl = (id) => API + "?a=img&s=full&id=" + id;

function dayKey(ts) {
  return new Date(ts * 1000).toDateString();
}

function dayLabel(ts, lang, c) {
  const d = new Date(ts * 1000);
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);
  if (d.toDateString() === today.toDateString()) return c.today;
  if (d.toDateString() === yesterday.toDateString()) return c.yesterday;
  return d.toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: d.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}

function groupByDay(items) {
  const groups = [];
  let current = null;
  items.forEach((item, index) => {
    const key = dayKey(item.ts);
    if (!current || current.key !== key) {
      current = { key, ts: item.ts, photos: [] };
      groups.push(current);
    }
    current.photos.push({ item, index });
  });
  return groups;
}

function formatTime(ts, lang) {
  const d = new Date(ts * 1000);
  const loc = lang === "nl" ? "nl-NL" : "en-GB";
  const time = d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === new Date().toDateString()) return time;
  return d.toLocaleDateString(loc, { day: "numeric", month: "long" }) + ", " + time;
}

/* ---------- app ---------- */

export default function FotoApp() {
  const [lang, setLang] = useState("nl");
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [queue, setQueue] = useState([]);
  const [caption, setCaption] = useState("");
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState({ index: 0, frac: 0 });
  const [toast, setToast] = useState(null);
  const [open, setOpen] = useState(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [beheer, setBeheer] = useState("");

  const cameraRef = useRef(null);
  const pickRef = useRef(null);
  const heroRef = useRef(null);
  const albumRef = useRef(null);
  const toastTimer = useRef(0);
  const touchX = useRef(null);

  const c = COPY[lang];
  const composing = queue.length > 0;

  /* language, same rules as the invitation */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("taal");
      if (stored === "nl" || stored === "en") {
        setLang(stored);
        return;
      }
    } catch (e) {
      // no storage, fall through
    }
    const nav = typeof navigator !== "undefined" ? navigator.language || "" : "";
    if (nav.toLowerCase().startsWith("en")) setLang("en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("taal", lang);
    } catch (e) {
      // not fatal
    }
  }, [lang]);

  /* moderation key arrives once via ?beheer= and then lives in the session */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const key = params.get("beheer");
      if (key) {
        sessionStorage.setItem("beheer", key);
        params.delete("beheer");
        const clean = window.location.pathname + (params.toString() ? "?" + params : "");
        window.history.replaceState(null, "", clean);
      }
      setBeheer(sessionStorage.getItem("beheer") || "");
    } catch (e) {
      setBeheer("");
    }
  }, []);

  /* gallery */
  const load = useCallback(async () => {
    try {
      const r = await fetch(API + "?a=list", { cache: "no-store" });
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
      if (document.visibilityState === "visible" && !composing) load();
    };
    const t = window.setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [load, composing]);

  /* the bottom camera button shows once the hero has scrolled away */
  useEffect(() => {
    const el = heroRef.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [composing]);

  const showToast = useCallback((text, bad) => {
    window.clearTimeout(toastTimer.current);
    setToast({ text, bad });
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  /* choosing photos */
  const onFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f && f.size > 0);
    if (!files.length) return;
    setPhase("preparing");
    const prepared = [];
    for (const file of files) {
      try {
        prepared.push(await prepare(file));
      } catch (e) {
        // skip what cannot be decoded, report below if nothing survived
      }
    }
    if (!prepared.length) {
      setPhase("idle");
      showToast(c.unreadable, true);
      return;
    }
    queue.forEach(release);
    setQueue(prepared);
    setPhase("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => {
    queue.forEach(release);
    setQueue([]);
    setCaption("");
    setPhase("idle");
  };

  const share = async () => {
    setPhase("uploading");
    const added = [];
    for (let i = 0; i < queue.length; i++) {
      setProgress({ index: i, frac: 0 });
      try {
        const item = await upload(queue[i], caption.trim(), (frac) =>
          setProgress({ index: i, frac })
        );
        added.push(item);
      } catch (e) {
        // keep the ones that did not make it, so a retry only sends those
        queue.slice(0, i).forEach(release);
        setQueue(queue.slice(i));
        if (added.length) setItems((cur) => [...added, ...(cur || [])]);
        setPhase("error");
        return;
      }
    }
    queue.forEach(release);
    setItems((cur) => [...added, ...(cur || [])]);
    setQueue([]);
    setCaption("");
    setPhase("idle");
    showToast(added.length > 1 ? c.doneMany : c.doneOne, false);
    window.setTimeout(() => {
      if (albumRef.current) albumRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  /* lightbox */
  const step = useCallback(
    (d) => {
      setOpen((v) => (v === null || !items ? v : (v + d + items.length) % items.length));
    },
    [items]
  );

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, step]);

  const remove = async (id) => {
    if (!window.confirm(c.removeAsk)) return;
    try {
      const form = new FormData();
      form.append("id", id);
      form.append("key", beheer);
      const r = await fetch(API + "?a=delete", { method: "POST", body: form });
      const d = await r.json();
      if (d && d.ok) {
        setItems((cur) => (cur || []).filter((x) => x.id !== id));
        setOpen(null);
      } else {
        showToast((d && d.error) || c.failed, true);
      }
    } catch (e) {
      showToast(c.failed, true);
    }
  };

  const pct = Math.round(progress.frac * 100);
  const current = open !== null && items ? items[open] : null;

  return (
    <div className="album">
      <style>{CSS}</style>

      <header className="top">
        <a className="top-home" href="../" aria-label={c.home}>
          <img src="../images/logo-icoon.png" width="192" height="192" alt="" />
        </a>
        <div className="lang" role="group" aria-label="Taal / Language">
          <span className="lang-thumb" data-on={lang} aria-hidden="true" />
          <button
            type="button"
            className={"lang-opt" + (lang === "nl" ? " is-on" : "")}
            aria-pressed={lang === "nl"}
            onClick={() => setLang("nl")}
          >
            <span className="lang-flag" aria-hidden="true">&#127475;&#127473;</span>
            <span className="lang-code">NL</span>
            <span className="sr-only">Nederlands</span>
          </button>
          <button
            type="button"
            className={"lang-opt" + (lang === "en" ? " is-on" : "")}
            aria-pressed={lang === "en"}
            onClick={() => setLang("en")}
          >
            <span className="lang-flag" aria-hidden="true">&#127468;&#127463;</span>
            <span className="lang-code">EN</span>
            <span className="sr-only">English</span>
          </button>
        </div>
      </header>

      <main className="wrap">
        <section className="hero" ref={heroRef}>
            <img
              className="polaroids"
              src="../images/polaroids-042b22aa.webp"
              width="1200"
              height="666"
              alt=""
            />
            <p className="eyebrow">{c.eyebrow}</p>
            <div className="rule" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <p className="lead">{c.lead}</p>
            <div className="choices">
              <button
                className="choice choice-primary"
                type="button"
                onClick={() => cameraRef.current && cameraRef.current.click()}
                disabled={phase === "preparing"}
                aria-label={c.takeLong}
              >
                <IconCamera size={44} />
                <span>{c.take}</span>
              </button>
              <button
                className="choice"
                type="button"
                onClick={() => pickRef.current && pickRef.current.click()}
                disabled={phase === "preparing"}
                aria-label={c.pickLong}
              >
                <IconImages size={44} />
                <span>{c.pick}</span>
              </button>
            </div>
          {phase === "preparing" && <p className="hint" style={{ marginTop: "1rem" }}>{c.preparing}</p>}
        </section>

        {composing && <div className="scrim" onClick={phase === "uploading" ? undefined : cancel} />}
        {composing && (
          <section className="compose" aria-live="polite">
            <span className="grip" aria-hidden="true" />
            <h2 className="serif compose-title">{c.composeTitle}</h2>
            <div className={"previews" + (queue.length > 1 ? " many" : "")}>
              {queue.map((q, i) => (
                <img key={q.preview} src={q.preview} width={q.full.w} height={q.full.h} alt="" />
              ))}
            </div>

            <label className="field">
              <span className="field-label">
                {c.captionLabel}
                <em>{c.optional}</em>
              </span>
              <textarea
                value={caption}
                maxLength={MAX_CAPTION}
                rows={2}
                placeholder={c.placeholder}
                onChange={(e) => setCaption(e.target.value)}
                disabled={phase === "uploading"}
              />
              <span className="count" aria-hidden="true">
                {caption.length}/{MAX_CAPTION}
              </span>
            </label>
            {queue.length > 1 && <p className="hint">{c.forAll}</p>}

            {phase === "uploading" && (
              <div className="upload-state">
                <div
                  className="bar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                >
                  <span style={{ width: pct + "%" }} />
                </div>
                <p className="hint">
                  {c.uploading}
                  {queue.length > 1 ? " " + (progress.index + 1) + " " + c.of + " " + queue.length : ""}
                </p>
              </div>
            )}
            {phase === "error" && <p className="error">{c.failed}</p>}

            <div className="actions">
              <button
                className="btn btn-primary"
                type="button"
                onClick={share}
                disabled={phase === "uploading"}
              >
                <IconHeart />
                {phase === "error" ? c.retry : c.share}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={cancel}
                disabled={phase === "uploading"}
              >
                {c.cancel}
              </button>
            </div>
          </section>
        )}

        <section className="gallery" ref={albumRef} aria-live="polite">
          <div className="gallery-head">
            <h2 className="serif">{c.album}</h2>
            {items && items.length > 0 && (
              <span className="count-pill">
                {items.length} {items.length === 1 ? c.one : c.many}
              </span>
            )}
            <button className="refresh" type="button" onClick={load} aria-label={c.refresh}>
              <IconRefresh />
            </button>
          </div>

          {items === null && !loadError && (
            <div className="grid skeleton" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <span key={i} />
              ))}
            </div>
          )}
          {loadError && items === null && <p className="error">{c.loadFailed}</p>}
          {items && items.length === 0 && <p className="empty">{c.empty}</p>}
          {items && items.length > 0 && (
            <>
              {groupByDay(items).map((group) => (
                <section key={group.key}>
                  <h3 className="day">{dayLabel(group.ts, lang, c)}</h3>
                  <div className="grid">
                    {group.photos.map(({ item, index }) => (
                      <button
                        key={item.id}
                        className="tile"
                        type="button"
                        onClick={() => setOpen(index)}
                        aria-label={item.caption || c.photoAlt}
                      >
                        <img
                          src={thumbUrl(item.id)}
                          width={item.w || undefined}
                          height={item.h || undefined}
                          alt={item.caption || ""}
                          loading="lazy"
                          decoding="async"
                        />
                        {item.caption && <span className="tile-cap">{item.caption}</span>}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </section>
      </main>

      {!composing && !heroVisible && (
        <div className="dock">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => cameraRef.current && cameraRef.current.click()}
            disabled={phase === "preparing"}
          >
            <IconCamera />
            {c.take}
          </button>
        </div>
      )}

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={pickRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {toast && (
        <div className={"toast" + (toast.bad ? " bad" : "")} role="status">
          {toast.text}
        </div>
      )}

      {current && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || c.photoAlt}
          onClick={() => setOpen(null)}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <button className="lb-btn lb-close" type="button" aria-label={c.close}>
            <IconClose />
          </button>
          {beheer && (
            <button
              className="lb-remove"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(current.id);
              }}
            >
              <IconTrash />
              {c.remove}
            </button>
          )}
          <button
            className="lb-btn lb-prev"
            type="button"
            aria-label={c.prev}
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
          >
            <IconChevron back />
          </button>
          <figure className="lb-frame" onClick={(e) => e.stopPropagation()}>
            <img
              key={current.id}
              src={fullUrl(current.id)}
              width={current.w || undefined}
              height={current.h || undefined}
              alt={current.caption || c.photoAlt}
            />
            <figcaption>
              {current.caption && <p className="lb-caption">{current.caption}</p>}
              <p className="lb-meta">{formatTime(current.ts, lang)}</p>
            </figcaption>
          </figure>
          <button
            className="lb-btn lb-next"
            type="button"
            aria-label={c.next}
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
          >
            <IconChevron />
          </button>
          <p className="lb-count">
            {open + 1} / {items.length}
          </p>
        </div>
      )}
    </div>
  );
}
