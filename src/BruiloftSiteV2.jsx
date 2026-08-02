import { useEffect, useState } from "react";

const DOVES = [
  { cls: "dove-1", start: "48%", top: "52%", size: "clamp(3.2rem,11vw,5.5rem)", delay: "180ms" },
  { cls: "dove-2", start: "34%", top: "60%", size: "clamp(2.4rem,8vw,4rem)", delay: "420ms" },
  { cls: "dove-3", start: "62%", top: "44%", size: "clamp(2.8rem,9vw,4.6rem)", delay: "300ms" },
  { cls: "dove-4", start: "52%", top: "68%", size: "clamp(2rem,6.5vw,3.2rem)", delay: "640ms" },
];

const CLOUDS = [1, 2, 3, 4, 5, 6, 7];

const PETALS = [
  { left: "3%", top: "54%", rot: -28, scale: 1.05, shape: "a", fill: "pFlesh" },
  { left: "11%", top: "76%", rot: 42, scale: 0.72, shape: "c", fill: "pFleshPale" },
  { left: "19%", top: "60%", rot: -8, scale: 0.92, shape: "b", fill: "pFleshDeep" },
  { left: "27%", top: "82%", rot: 64, scale: 0.66, shape: "a", fill: "pFleshPale" },
  { left: "35%", top: "58%", rot: 14, scale: 1.12, shape: "c", fill: "pFlesh", fall: true, delay: "0s" },
  { left: "44%", top: "80%", rot: -52, scale: 0.78, shape: "b", fill: "pFleshPale" },
  { left: "52%", top: "62%", rot: 26, scale: 0.98, shape: "a", fill: "pFleshDeep" },
  { left: "60%", top: "84%", rot: -18, scale: 0.7, shape: "c", fill: "pFlesh" },
  { left: "68%", top: "57%", rot: 48, scale: 1.08, shape: "b", fill: "pFleshPale", fall: true, delay: "3.4s" },
  { left: "77%", top: "79%", rot: -38, scale: 0.75, shape: "a", fill: "pFlesh" },
  { left: "85%", top: "61%", rot: 10, scale: 0.95, shape: "c", fill: "pFleshDeep" },
  { left: "93%", top: "78%", rot: -60, scale: 0.68, shape: "b", fill: "pFleshPale", fall: true, delay: "6.1s" },
];

const SPARKLES = [
  { top: "8%", left: "14%", delay: "0s", size: "0.5rem" },
  { top: "4%", left: "62%", delay: "0.7s", size: "0.35rem" },
  { top: "22%", left: "92%", delay: "1.4s", size: "0.45rem" },
  { top: "48%", left: "3%", delay: "0.4s", size: "0.4rem" },
  { top: "70%", left: "10%", delay: "2.1s", size: "0.5rem" },
  { top: "86%", left: "34%", delay: "1.1s", size: "0.35rem" },
  { top: "90%", left: "72%", delay: "1.8s", size: "0.45rem" },
  { top: "62%", left: "95%", delay: "0.9s", size: "0.4rem" },
  { top: "34%", left: "50%", delay: "2.5s", size: "0.3rem" },
  { top: "16%", left: "36%", delay: "1.6s", size: "0.3rem" },
];

const IMG = {
  hemel: "images/hemel.webp",
  zegelMonogram: "images/zegel-monogram-d341eb63.png",
  logoIcon: "images/logo-icoon.png",
  logoCompact: "images/logo-compact.png",
  logoFull: "images/logo-volledig.png",
  couple: "images/bruidspaar.jpg",
  verloving: "images/verloving.webp",
  amstelkerk: "images/amstelkerk-exterieur.webp",
  urbanusBuiten: "images/urbanuskerk-exterieur.jpg",
  urbanusBinnen: "images/urbanuskerk-interieur.jpg",
  dresscode: "images/dresscode.jpg",
};

const TIMELINE = [
  {
    time: "13.30",
    title: "Inloop bij de kerk",
    location: "St. Urbanuskerk, Noorddammerlaan 124-126, Amstelveen",
    map: "https://maps.app.goo.gl/JkR9bFd5aLRVbyBHA",
  },
  {
    time: "14.00",
    title: "Start ceremonie",
    location: "St. Urbanuskerk, Noorddammerlaan 124-126, Amstelveen",
    map: "https://maps.app.goo.gl/JkR9bFd5aLRVbyBHA",
  },
  {
    time: "15.00",
    title: "Vertrek naar Amstelkerk",
    location: "Van Bovenkerk naar Ouderkerk a/d Amstel",
    map: "https://www.google.com/maps/dir/St.+Urbanuskerk,+Noorddammerlaan+126,+1187+AG+Amstelveen/Amstelkerk,+Kerkstraat+11,+1191+JB+Ouderkerk+aan+de+Amstel/",
  },
  {
    time: "15.30",
    title: "Aankomst Nyarayek en Sten",
    location: "Amstelkerk, Ouderkerk a/d Amstel",
    map: "https://maps.app.goo.gl/bn9KLxoZZxZuxTQW7",
  },
  {
    time: "16.00",
    title: "Receptie",
    location: "Tuin Amstelkerk, Ouderkerk a/d Amstel",
    map: "https://maps.app.goo.gl/bn9KLxoZZxZuxTQW7",
  },
  {
    time: "18.00",
    title: "Diner",
    location: "Amstelkerk, Ouderkerk a/d Amstel",
    map: "https://maps.app.goo.gl/bn9KLxoZZxZuxTQW7",
  },
  {
    time: "20.00",
    title: "Feest",
    location: "SIBIZ, Amstelkerk, Ouderkerk a/d Amstel",
    map: "https://maps.app.goo.gl/bn9KLxoZZxZuxTQW7",
  },
  {
    time: "00.00 tot 00.30",
    title: "Uitloop",
    location: "Amstelkerk, Ouderkerk a/d Amstel",
    map: "https://maps.app.goo.gl/bn9KLxoZZxZuxTQW7",
  },
];

const TABS = [
  {
    title: "Uitnodiging",
    image: IMG.urbanusBinnen,
    body: "Wij nodigen iedereen uit om de volledige dag met ons mee te maken: van ceremonie, tot diner en trouwfeest.",
  },
  {
    title: "Aankomst",
    image: IMG.urbanusBuiten,
    body: "Kom je met de auto? Parkeren in Bovenkerk is gratis.\n\nFietsen kun je parkeren tegenover de kerk, in de stalling van Silversant.\n\nDe dichtsbijzijnde bushalte is direct naast de kerk, halte Zwarte Pad.",
  },
  {
    title: "Vervoer naar Ouderkerk",
    image: IMG.amstelkerk,
    body: "Van Bovenkerk naar Ouderkerk kun je met eigen vervoer, openbaar vervoer of met de taxi: 15 minuten met de auto of 25 minuten met de fiets.\n\nParkeren in Ouderkerk is gratis aan de Kerkweg. Er is een parkeerterrein direct naast de kerk. Let wel op: de straat ernaast begint een Groene parkeerzone. Hier mag je 1.5 uur parkeren met een blauwe schijf.",
  },
];

const SECTIONS = [
  { id: "over", label: "Over ons" },
  { id: "agenda", label: "Agenda trouwdag" },
  { id: "locatie", label: "Vervoer en locaties" },
  { id: "faq", label: "Vraag en antwoord" },
];

const FAQ = [
  {
    n: "01",
    q: "Mag ik gasten meenemen?",
    a: "Het is vanwege de locatie beperkingen niet mogelijk om extra gasten mee te nemen.",
  },
  {
    n: "02",
    q: "Wat is de dress code?",
    a: "Dress code is Tenue de Ville. Mannen dragen een (zomers) pak met das of strik, vrouwen een nette jurk.",
    linkText: "Lees meer over Tenue de Ville",
    link: "https://www.koonings.com/inspiratie/dresscode-tenue-de-ville/",
  },
  {
    n: "03",
    q: "Hoe kom ik van Bovenkerk naar Ouderkerk?",
    a: "Je kunt met eigen vervoer, zoals de auto of fiets.\n\nOpenbaar vervoer: direct naast de kerk is er bushalte Zwarte Pad. Hier pak je lijn 171 tot Amstelveen busstation en stap je over op lijn 356 tot halte Ouderkerk West. Vanaf hier is het 8 minuten lopen naar de Amstelkerk.\n\nHeb je geen vervoer? Laat het ons dan weten, dan kijken we mee.\n\nNa afloop rijdt er geen bus meer. Regel je terugreis vooraf, met eigen vervoer of een taxi.",
    linkText: "Route van Bovenkerk naar Ouderkerk",
    link: "https://www.google.com/maps/dir/St.+Urbanuskerk,+Noorddammerlaan+126,+1187+AG+Amstelveen/Amstelkerk,+Kerkstraat+11,+1191+JB+Ouderkerk+aan+de+Amstel/",
  },
];

const CSS = `
.bruiloft{
  --shade-1:hsl(0,0%,100%);
  --shade-2:hsl(0,0%,94.9%);
  --shade-3:hsl(0,0%,81.9%);
  --shade-4:hsl(204,2.2%,45.3%);
  --shade-5:hsl(240,1.6%,12.4%);
  --shade-6:hsl(0,0%,0%);
  --brand:hsl(48,35.7%,94.5%);

  --space-1:0.5rem;
  --space-2:1rem;
  --space-3:1.5rem;
  --space-4:2.5rem;
  --space-5:4rem;
  --space-6:6rem;

  --type-hero:4.5rem;
  --type-1:3rem;
  --type-2:2rem;
  --type-3:1.35rem;
  --type-body:1.125rem;
  --type-label:0.8rem;

  font-family:Inter,system-ui,sans-serif;
  color:var(--shade-6);
  line-height:1.5;
  background:var(--shade-1);
}
.bruiloft *{box-sizing:border-box;}
.bruiloft img{display:block;max-width:100%;height:auto;}
.bruiloft a{color:inherit;text-decoration:none;}
.bruiloft .btn{color:var(--shade-1);}
.bruiloft button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;}
.bruiloft :focus-visible{outline:2px solid var(--shade-6);outline-offset:3px;border-radius:2px;}

.serif{font-family:"Instrument Serif",Georgia,serif;font-weight:400;letter-spacing:0;}
.label{font-size:var(--type-label);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;}
.meta{font-size:1rem;color:var(--shade-4);letter-spacing:0;text-transform:none;}
.prose{font-size:var(--type-body);color:var(--shade-4);white-space:pre-line;margin:0;}

.wrap{width:100%;max-width:72rem;margin:0 auto;padding:0 var(--space-3);}
.sec{padding:var(--space-6) 0;}
.sec-tight{padding:var(--space-5) 0;}

/* Hero: names lead, date supports */
.hero{position:relative;padding:var(--space-5) 0 var(--space-6);text-align:center;}
.hero-bg{position:absolute;inset:0 var(--space-4) 40% var(--space-4);background:var(--brand);border-radius:10px;z-index:0;}
.hero-inner{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:var(--space-4);}
.hero-monogram{width:6.75rem;height:auto;margin-bottom:calc(var(--space-2) * -1);}
.hero-eyebrow{color:var(--shade-4);}
.hero-names{font-size:var(--type-hero);line-height:1.05;margin:var(--space-2) 0 var(--space-1);}
.hero-date{font-size:var(--type-3);letter-spacing:0.08em;text-transform:uppercase;font-weight:500;}
.hero-images{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);width:100%;}
.hero-img{aspect-ratio:1/1;overflow:hidden;border-radius:10px;background:var(--brand);}
.hero-img img{width:100%;height:100%;object-fit:cover;}

.btn{display:inline-flex;min-height:3.5rem;align-items:center;justify-content:center;padding:0 var(--space-4);
  border-radius:6px;background:var(--shade-6);color:var(--shade-1);
  font-size:var(--type-label);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
  transition:background-color 200ms ease;}
.btn:hover{background:var(--shade-5);}

.h1{font-size:var(--type-1);line-height:1.1;margin:0;}
.h2{font-size:var(--type-2);line-height:1.15;margin:0;}
.intro{font-size:1.5rem;line-height:1.5;max-width:60ch;white-space:pre-line;margin:0;}

.facts{display:flex;flex-direction:column;gap:var(--space-2);margin-top:var(--space-4);}
.fact{display:flex;align-items:center;gap:var(--space-2);}
.fact svg{flex:0 0 auto;color:var(--shade-4);}
.fact span{font-size:1rem;}

.timeline{border-top:1px solid var(--shade-3);}
.tl-item{display:grid;grid-template-columns:7rem 1fr;gap:var(--space-4);
  padding:var(--space-4) 0;border-bottom:1px solid var(--shade-3);}
.tl-time{font-variant-numeric:tabular-nums;font-weight:600;font-size:var(--type-3);}
.tl-body{display:flex;flex-direction:column;gap:var(--space-2);}

.card{display:flex;align-items:center;gap:var(--space-4);padding:var(--space-4);
  background:var(--brand);border-radius:10px;transition:transform 200ms ease;}
.card:hover{transform:translateY(-2px);}
.card-text{flex:1 1 0;}
.card-img{flex:0 0 12rem;}
.card-img img{width:100%;border-radius:6px;}

.tabs{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);align-items:center;}
.tab-img{aspect-ratio:1/1;overflow:hidden;border-radius:10px;}
.tab-img img{width:100%;height:100%;object-fit:cover;}
.tab-list{display:flex;flex-direction:column;gap:var(--space-3);}
.tab{text-align:left;opacity:0.45;padding:var(--space-2) 0 var(--space-2) var(--space-2);
  border-left:2px solid transparent;transition:opacity 200ms ease,border-color 200ms ease;}
.tab[aria-selected="true"]{opacity:1;border-left-color:var(--shade-6);}
.tab-title{font-size:var(--type-3);font-weight:600;margin-bottom:var(--space-1);}

.faq{border-top:1px solid var(--shade-3);}
.faq-row{border-bottom:1px solid var(--shade-3);}
.faq-btn{display:grid;grid-template-columns:3.5rem 1fr 2rem;gap:var(--space-2);align-items:start;
  width:100%;padding:var(--space-4) 0;text-align:left;}
.faq-n{color:var(--shade-4);font-size:1rem;font-variant-numeric:tabular-nums;padding-top:0.2rem;}
.faq-q{font-size:var(--type-3);font-weight:600;line-height:1.3;}
.faq-icon{display:inline-flex;justify-self:end;transition:transform 200ms ease;}
.faq-row.open .faq-icon{transform:rotate(45deg);}
.faq-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows 250ms ease;}
.faq-row.open .faq-panel{grid-template-rows:1fr;}
.faq-panel > div{overflow:hidden;}
.faq-inner{padding:0 2rem var(--space-4) 3.5rem;display:flex;flex-direction:column;gap:var(--space-3);}
.link-u{align-self:flex-start;font-size:var(--type-label);font-weight:600;letter-spacing:0.1em;
  text-transform:uppercase;border-bottom:1px solid var(--shade-3);padding-bottom:2px;
  transition:border-color 200ms ease;}
.link-u:hover{border-bottom-color:var(--shade-6);}

.contact{display:flex;flex-direction:column;align-items:center;gap:var(--space-1);
  padding:var(--space-5) 0;text-align:center;}
.contact-lead{font-size:var(--type-2);color:var(--shade-4);}
.contact-mail{font-size:var(--type-2);}

.nav{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);
  backdrop-filter:blur(8px);border-bottom:1px solid var(--shade-2);}
.nav-in{position:relative;display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);
  padding:var(--space-2) var(--space-3);max-width:72rem;margin:0 auto;}
.nav-links{display:flex;gap:var(--space-3);}
.nav-links a{font-size:1rem;font-weight:500;transition:opacity 200ms ease;}
.nav-links a:hover{opacity:0.6;}
.nav-toggle{display:none;align-items:center;justify-content:center;
  width:2.75rem;height:2.75rem;margin-right:calc(var(--space-1) * -1);border-radius:6px;
  transition:background-color 200ms ease;}
.nav-toggle:hover{background:var(--brand);}
.nav-panel{display:none;}
.nav-logo{width:1.75rem;height:auto;display:block;}

.footer{margin-top:var(--space-6);background:var(--brand);border-radius:10px 10px 0 0;
  padding:var(--space-5) var(--space-3);text-align:center;}
.footer-logo{width:3.5rem;height:auto;margin:0 auto var(--space-4);}
.footer-nav{display:flex;flex-direction:column;align-items:center;gap:var(--space-2);
  margin-bottom:var(--space-4);}
.footer-nav a{font-size:1rem;transition:opacity 200ms ease;}
.footer-nav a:hover{opacity:0.6;}
.footer-names{font-weight:600;margin-bottom:var(--space-2);}
.footer-heart{margin:0 0.15rem;font-size:0.9em;}
.socials{display:flex;justify-content:center;gap:var(--space-2);}
.socials a{display:inline-flex;padding:var(--space-1);transition:opacity 200ms ease;}
.socials a:hover{opacity:0.6;}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
  clip:rect(0 0 0 0);white-space:nowrap;border:0;}

@media (max-width:900px){
  .bruiloft{--type-hero:3.5rem;--type-1:2.25rem;--type-2:1.75rem;--space-6:4rem;--space-5:3rem;}
  .tabs{grid-template-columns:1fr;gap:var(--space-4);}
  .card{flex-direction:column-reverse;align-items:stretch;}
  .card-img{flex:none;}
  .nav-links{display:none;}
  .nav-toggle{display:inline-flex;}
  .nav-panel{display:grid;grid-template-rows:0fr;
    transition:grid-template-rows 250ms cubic-bezier(.165,.84,.44,1);}
  .nav-panel.open{grid-template-rows:1fr;}
  .nav-panel > div{overflow:hidden;}
  .nav-panel-links{display:flex;flex-direction:column;padding:0 var(--space-3) var(--space-2);}
  .nav-panel-links a{padding:var(--space-2) 0;font-size:1rem;font-weight:500;
    border-bottom:1px solid var(--shade-2);}
  .nav-panel-links a:last-child{border-bottom:none;}
}
@media (max-width:600px){
  .bruiloft{--type-hero:2.75rem;--type-1:1.875rem;--type-2:1.5rem;--type-3:1.2rem;}
  .hero-images{grid-template-columns:1fr;}
  .hero-bg{inset:0 var(--space-2) 55% var(--space-2);}
  .intro{font-size:1.25rem;}
  .tl-item{grid-template-columns:1fr;gap:var(--space-2);}
  .faq-btn{grid-template-columns:2.5rem 1fr 1.5rem;}
  .faq-inner{padding-left:2.5rem;padding-right:0;}
}
@media (prefers-reduced-motion:reduce){
  .bruiloft *{transition:none !important;animation:none !important;}
}

/* Intro: envelope that unfolds to reveal the page */
.opener{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:var(--space-3);
  padding:var(--space-4) var(--space-3);overflow:hidden;
  transition:opacity 900ms ease 1500ms, visibility 0ms linear 2400ms;}
.opener.opening{opacity:0;visibility:hidden;pointer-events:none;}

/* heavenly backdrop */
.opener-sky{position:absolute;inset:0;
  background-image:url("images/hemel.webp");
  background-size:cover;background-position:50% 46%;
  transform:scale(1.06);
  animation:sky-drift 26s ease-in-out infinite alternate;}
.opener-veil{position:absolute;inset:0;
  background:
    radial-gradient(120% 80% at 50% 42%, rgba(255,255,255,0.08), rgba(255,252,244,0.55) 62%, rgba(252,246,232,0.88)),
    linear-gradient(180deg, rgba(255,255,255,0.25), rgba(250,242,226,0.55));}
@keyframes sky-drift{
  0%{transform:scale(1.06) translate3d(0,0,0);}
  100%{transform:scale(1.12) translate3d(0,-1.5%,0);}
}

/* rose petals at the foot of the envelope */
.altar{position:relative;z-index:3;width:min(86vw,32rem);height:5rem;margin-top:-0.5rem;
  opacity:0;transform:translateY(1.2rem);
  transition:opacity 1100ms ease 500ms, transform 1100ms cubic-bezier(.2,.75,.3,1) 500ms;}
.altar.lit{opacity:1;transform:translateY(0);}
.opener.opening .altar{opacity:0;transform:translateY(1rem);transition-delay:0ms;}

/* petals scattered across the base */
.petal-defs{position:absolute;width:0;height:0;overflow:hidden;}
.petals{position:absolute;inset:0;pointer-events:none;}
.petal{position:absolute;width:2rem;height:2rem;
  filter:drop-shadow(0 3px 4px rgba(130,72,78,0.3))
         drop-shadow(0 10px 14px rgba(130,72,78,0.16));}
.petal svg{width:100%;height:100%;display:block;}
.petal-fall{animation:petal-drift 9s ease-in-out infinite;}

@keyframes petal-drift{
  0%{transform:translate3d(0,-2.5rem,0) rotate(-12deg);opacity:0;}
  12%{opacity:0.9;}
  55%{transform:translate3d(0.7rem,0.6rem,0) rotate(16deg);opacity:0.95;}
  100%{transform:translate3d(-0.4rem,2.6rem,0) rotate(-6deg);opacity:0;}
}

@media (max-width:600px){
  .altar{height:4.2rem;margin-top:-0.25rem;}
  .petal{width:1.5rem;height:1.5rem;}
}
@media (max-height:720px){
  .altar{height:3.6rem;}
  .stage{width:min(70vw,24rem);}
}

@media (prefers-reduced-motion:reduce){
  .petal-fall{animation:none;}
}

/* renaissance gold frame */
.opener-frame{position:absolute;inset:var(--space-2);pointer-events:none;
  border:1px solid rgba(178,138,66,0.45);
  box-shadow:inset 0 0 0 5px rgba(255,255,255,0.28), inset 0 0 60px rgba(190,150,80,0.14);}
.opener-frame::before,.opener-frame::after{content:"";position:absolute;width:2.5rem;height:2.5rem;
  border:1px solid rgba(178,138,66,0.6);}
.opener-frame::before{top:0.6rem;left:0.6rem;border-right:0;border-bottom:0;}
.opener-frame::after{bottom:0.6rem;right:0.6rem;border-left:0;border-top:0;}

.opener-head{position:relative;z-index:2;text-align:center;
  animation:rise-in 1200ms cubic-bezier(.2,.7,.3,1) both;}
.opener-title{margin:0;font-family:"Cinzel Decorative",Georgia,serif;font-weight:700;
  font-size:clamp(3rem,13vw,7rem);line-height:1;letter-spacing:0.04em;
  background:linear-gradient(172deg, #fdf3d6 4%, #d8ae5c 32%, #a97c31 54%, #e7cd8e 74%, #c39543 96%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 1px rgba(120,88,30,0.35)) drop-shadow(0 6px 18px rgba(160,120,50,0.25));}
.opener-rule{display:flex;align-items:center;justify-content:center;gap:0.6rem;
  margin:var(--space-2) auto var(--space-1);max-width:22rem;color:rgba(168,126,54,0.8);}
.opener-rule span{flex:1 1 0;height:1px;
  background:linear-gradient(90deg, transparent, currentColor 35%, currentColor 65%, transparent);}
.opener-rule i{width:0.45rem;height:0.45rem;transform:rotate(45deg);
  background:currentColor;border-radius:1px;}
.opener-sub{margin:0;font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;
  font-size:clamp(1.05rem,3.4vw,1.6rem);letter-spacing:0.06em;color:#7a5c28;}

@keyframes rise-in{
  0%{opacity:0;transform:translateY(1.5rem);}
  100%{opacity:1;transform:translateY(0);}
}

/* the envelope arrives a beat later */
.stage{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;
  width:min(82vw,30rem);aspect-ratio:3/2;perspective:1600px;perspective-origin:50% 45%;
  opacity:0;transform:translateY(2rem) scale(0.9);
  transition:opacity 1100ms ease, transform 1100ms cubic-bezier(.2,.75,.3,1);}
.stage.arrived{opacity:1;transform:translateY(0) scale(1);}

.envelope{position:absolute;inset:0;transform-style:preserve-3d;
  transition:transform 1000ms cubic-bezier(.5,0,.75,0) 1150ms, opacity 900ms ease 1250ms;
  filter:drop-shadow(0 26px 44px rgba(120,95,50,0.3));}
.opener.opening .envelope{transform:scale(2.6) translateY(6%);opacity:0;}

.env-pocket{position:absolute;inset:0;border-radius:3px;
  background:linear-gradient(160deg, hsl(42,32%,90%), hsl(38,26%,80%));
  box-shadow:inset 0 0 40px rgba(120,95,55,0.2);}

.flap{position:absolute;
  background-color:hsl(44,36%,93%);
  background-image:
    linear-gradient(var(--flap-sheen, 155deg), rgba(255,255,255,0.6), rgba(170,135,75,0.16)),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23p)' opacity='0.4'/%3E%3C/svg%3E");
  background-blend-mode:normal, multiply;
  transition:transform 950ms cubic-bezier(.62,.02,.31,1), filter 950ms ease;}

.flap-top{top:0;left:0;width:100%;height:62%;z-index:4;
  clip-path:polygon(0 0, 100% 0, 50% 100%);
  transform-origin:top center;--flap-sheen:180deg;}
.flap-left{top:0;left:0;width:52%;height:100%;z-index:3;
  clip-path:polygon(0 0, 100% 50%, 0 100%);
  transform-origin:left center;--flap-sheen:100deg;}
.flap-right{top:0;right:0;width:52%;height:100%;z-index:3;
  clip-path:polygon(100% 0, 0 50%, 100% 100%);
  transform-origin:right center;--flap-sheen:260deg;}
.flap-bottom{bottom:0;left:0;width:100%;height:64%;z-index:2;
  clip-path:polygon(0 100%, 100% 100%, 50% 0);
  transform-origin:bottom center;--flap-sheen:0deg;}

.opener.opening .flap-top,.opener.opening .flap-left,
.opener.opening .flap-right,.opener.opening .flap-bottom{filter:brightness(0.93);}
.opener.opening .flap-top{transform:rotateX(-172deg);transition-delay:0ms;}
.opener.opening .flap-left{transform:rotateY(-168deg);transition-delay:380ms;}
.opener.opening .flap-right{transform:rotateY(168deg);transition-delay:380ms;}
.opener.opening .flap-bottom{transform:rotateX(170deg);transition-delay:720ms;}

/* wax seal with calligraphic monogram */
.seal{position:absolute;top:50%;left:50%;z-index:6;
  width:6.75rem;height:6.75rem;margin:-3.375rem 0 0 -3.375rem;padding:0;
  display:flex;align-items:center;justify-content:center;
  border-radius:47% 53% 51% 49% / 49% 47% 53% 51%;
  background:radial-gradient(circle at 34% 30%, #edcd8e 0%, #c9963f 26%, #9d6c26 66%, #7d5219 100%);
  box-shadow:0 8px 16px rgba(80,52,14,0.42), inset 0 2px 6px rgba(255,232,183,0.55),
             inset 0 -5px 12px rgba(70,42,10,0.5);
  color:#fdf1d2;cursor:pointer;
  animation:seal-breathe 3.4s ease-in-out infinite;
  transition:transform 500ms ease, opacity 500ms ease, box-shadow 300ms ease;}
.seal:hover{box-shadow:0 12px 24px rgba(80,52,14,0.5), inset 0 2px 6px rgba(255,232,183,0.65),
             inset 0 -5px 12px rgba(70,42,10,0.5);}
.opener.opening .seal{opacity:0;transform:scale(0.55) rotate(-14deg);animation:none;}

@keyframes seal-breathe{
  0%,100%{transform:scale(1);}
  50%{transform:scale(1.04);}
}

/* opening mist: a bank of cloud covering the screen, which parts sideways */
.mist{position:absolute;inset:0;z-index:20;pointer-events:none;overflow:hidden;}
.cloud{position:absolute;border-radius:50%;
  background:radial-gradient(circle at 42% 38%,
    rgba(255,255,255,0.98) 0%, rgba(253,251,246,0.92) 38%,
    rgba(248,244,235,0.7) 62%, rgba(245,240,229,0) 78%);
  filter:blur(6px);
  transition:transform 2400ms cubic-bezier(.35,0,.2,1), opacity 2000ms ease;}
.cloud-1{width:78vw;height:78vw;left:-24vw;top:-18vw;}
.cloud-2{width:70vw;height:70vw;right:-22vw;top:-14vw;}
.cloud-3{width:86vw;height:86vw;left:-18vw;bottom:-26vw;}
.cloud-4{width:74vw;height:74vw;right:-20vw;bottom:-22vw;}
.cloud-5{width:64vw;height:64vw;left:16vw;top:14vh;}
.cloud-6{width:58vw;height:58vw;right:12vw;top:24vh;}
.cloud-7{width:92vw;height:60vw;left:4vw;top:28vh;filter:blur(14px);}

.mist.clearing .cloud{opacity:0;}
.mist.clearing .cloud-1{transform:translate3d(-46vw,-10vh,0) scale(1.35);}
.mist.clearing .cloud-2{transform:translate3d(46vw,-8vh,0) scale(1.3);}
.mist.clearing .cloud-3{transform:translate3d(-52vw,12vh,0) scale(1.4);transition-delay:120ms;}
.mist.clearing .cloud-4{transform:translate3d(50vw,10vh,0) scale(1.32);transition-delay:120ms;}
.mist.clearing .cloud-5{transform:translate3d(-38vw,-6vh,0) scale(1.5);transition-delay:220ms;}
.mist.clearing .cloud-6{transform:translate3d(40vw,-4vh,0) scale(1.45);transition-delay:220ms;}
.mist.clearing .cloud-7{transform:translate3d(0,-14vh,0) scale(1.6);transition-delay:60ms;}

/* doves breaking out of the cloud as it parts */
.flight{position:absolute;inset:0;}
.dove{position:absolute;color:#fff;opacity:0;
  filter:drop-shadow(0 8px 14px rgba(120,100,60,0.28));
  transition:transform 2600ms cubic-bezier(.22,.62,.28,1), opacity 700ms ease;}
.dove svg{width:100%;height:auto;display:block;}
.mist.clearing .dove{opacity:1;}
.mist.clearing .dove-1{transform:translate3d(-58vw,-40vh,0) rotate(-16deg) scale(1.25);}
.mist.clearing .dove-2{transform:translate3d(-42vw,-58vh,0) rotate(-24deg) scale(1.1);}
.mist.clearing .dove-3{transform:translate3d(56vw,-46vh,0) rotate(14deg) scaleX(-1) scale(1.2);}
.mist.clearing .dove-4{transform:translate3d(38vw,-62vh,0) rotate(20deg) scaleX(-1);}
.mist.flown .dove{opacity:0;transition:opacity 900ms ease;}

.wing{transform-origin:62% 60%;animation:wingbeat 420ms ease-in-out infinite alternate;}
.wing-far{animation-duration:440ms;animation-delay:-140ms;}
.dove-2 .wing{animation-duration:360ms;}
.dove-3 .wing{animation-duration:470ms;}
.dove-4 .wing{animation-duration:330ms;}
@keyframes wingbeat{
  0%{transform:rotate(-24deg) scaleY(0.86);}
  100%{transform:rotate(16deg) scaleY(1.06);}
}

@media (prefers-reduced-motion:reduce){
  .cloud,.dove{transition:opacity 500ms ease;transform:none !important;}
  .wing{animation:none;}
}

/* sparkles */
.sparkles{position:absolute;inset:-12%;z-index:5;pointer-events:none;}
.sparkle{position:absolute;width:0.5rem;height:0.5rem;opacity:0;
  background:radial-gradient(circle, #fffbe9 0%, rgba(232,200,130,0.9) 40%, transparent 70%);
  animation:twinkle 3.4s ease-in-out infinite;}
.sparkle::before{content:"";position:absolute;inset:-140%;
  background:
    linear-gradient(0deg, transparent 46%, rgba(255,248,224,0.85) 50%, transparent 54%),
    linear-gradient(90deg, transparent 46%, rgba(255,248,224,0.85) 50%, transparent 54%);}
.stage.arrived .sparkle{opacity:1;}
@keyframes twinkle{
  0%,100%{opacity:0;transform:scale(0.4) rotate(0deg);}
  50%{opacity:1;transform:scale(1) rotate(45deg);}
}

/* calligraphic names, pressed into the parchment light */
.opener-names{margin:0 0 -0.15em;text-align:center;
  font-family:"Great Vibes",cursive;font-weight:400;
  font-size:clamp(1.35rem,5.2vw,2.4rem);line-height:1.15;letter-spacing:0.01em;
  color:#d9c096;
  text-shadow:
    -1px -1px 0 rgba(255,252,242,0.9),
     1px  1px 1px rgba(112,80,32,0.55),
     0 3px 6px rgba(112,80,32,0.22);}
.opener-names .amp{font-size:0.82em;padding:0 0.15em;}

/* the monogram struck into the wax */
.seal-emblem{position:absolute;inset:13%;
  -webkit-mask-image:url("images/zegel-monogram-d341eb63.png");
  mask-image:url("images/zegel-monogram-d341eb63.png");
  -webkit-mask-size:contain;mask-size:contain;
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
  -webkit-mask-position:center;mask-position:center;
  background:linear-gradient(168deg, #f6e3b6 0%, #d8ae60 38%, #a87a30 68%, #855c1e 100%);
  filter:drop-shadow(0 1px 0 rgba(255,244,214,0.6))
         drop-shadow(0 -1px 1px rgba(58,34,6,0.6))
         drop-shadow(0 2px 3px rgba(58,34,6,0.35));}

@media (max-width:600px){
  .stage{width:88vw;}
  .seal{width:5.75rem;height:5.75rem;margin:-2.875rem 0 0 -2.875rem;}
  .opener-frame{inset:var(--space-1);}
}

@media (prefers-reduced-motion:reduce){
  .opener-sky,.sparkle,.seal{animation:none;}
  .opener{transition:opacity 300ms ease 200ms, visibility 0ms linear 500ms;}
  .stage{transition:opacity 300ms ease;}
  .envelope,.flap{transition:opacity 300ms ease;}
  .opener.opening .flap-top,.opener.opening .flap-left,
  .opener.opening .flap-right,.opener.opening .flap-bottom{transform:none;}
  .opener.opening .envelope{transform:none;}
}

`;

const Icon = ({ children, size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

const IconTime = () => (
  <Icon size={16}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

const IconMap = () => (
  <Icon size={16}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

const IconDress = () => (
  <Icon size={16}>
    <path d="M10 3l2 2 2-2" />
    <path d="M10 3v3.5L6 12l1.5 9h9L18 12l-4-5.5V3" />
  </Icon>
);

const IconPlus = ({ size = 20 }) => (
  <Icon size={size}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

const IconInstagram = () => (
  <Icon size={20}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
  </Icon>
);

// Gradients and filters live once in the DOM; each petal references them by id.
const PetalDefs = () => (
  <svg className="petal-defs" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="pFlesh" cx="38%" cy="22%" r="88%">
        <stop offset="0%" stopColor="#fff2f0" />
        <stop offset="30%" stopColor="#fbdcda" />
        <stop offset="62%" stopColor="#eeb2b2" />
        <stop offset="88%" stopColor="#d3868a" />
        <stop offset="100%" stopColor="#bb6b71" />
      </radialGradient>
      <radialGradient id="pFleshPale" cx="34%" cy="20%" r="90%">
        <stop offset="0%" stopColor="#fffaf9" />
        <stop offset="38%" stopColor="#fce8e5" />
        <stop offset="72%" stopColor="#f2c6c3" />
        <stop offset="100%" stopColor="#d59a9b" />
      </radialGradient>
      <radialGradient id="pFleshDeep" cx="42%" cy="26%" r="86%">
        <stop offset="0%" stopColor="#fbdedb" />
        <stop offset="34%" stopColor="#eeb0b0" />
        <stop offset="70%" stopColor="#d0797f" />
        <stop offset="100%" stopColor="#a9535c" />
      </radialGradient>

      {/* the shadow cast where the petal curls over on itself */}
      <linearGradient id="pFold" x1="8%" y1="4%" x2="88%" y2="96%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="34%" stopColor="#ffffff" stopOpacity="0.05" />
        <stop offset="68%" stopColor="#8d4a52" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#7c3d46" stopOpacity="0.34" />
      </linearGradient>

      {/* light catching the rolled edge */}
      <linearGradient id="pRim" x1="0%" y1="10%" x2="100%" y2="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="45%" stopColor="#fff4f2" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      {/* velvet grain, very subtle */}
      <filter id="pVelvet" x="-12%" y="-12%" width="124%" height="124%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" result="n" />
        <feColorMatrix in="n" type="saturate" values="0" result="g" />
        <feComponentTransfer in="g" result="soft">
          <feFuncA type="linear" slope="0.12" intercept="0" />
        </feComponentTransfer>
        <feComposite in="soft" in2="SourceGraphic" operator="in" result="grain" />
        <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
      </filter>
    </defs>
  </svg>
);

const PETAL_SHAPES = {
  // broad open petal, the classic rose outer
  a: "M50 97C34 90 13 73 11 49 9 27 25 8 41 4c5-1 9 4 9 9 0-5 4-10 9-9 16 4 32 23 30 45-2 24-23 41-39 48z",
  // narrower, slightly cupped
  b: "M50 96C37 88 20 71 19 50 18 30 32 11 46 6c4-2 8 2 8 7 1-5 5-8 9-6 14 6 26 25 24 44-2 21-18 37-37 45z",
  // curled, seen at an angle
  c: "M52 95C36 89 16 70 17 47 18 27 34 9 49 5c5-1 8 5 7 10 2-5 7-8 11-5 13 8 22 27 19 46-3 21-20 33-34 39z",
};

const Petal = ({ shape = "a", fill = "pFlesh" }) => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <g filter="url(#pVelvet)">
      <path d={PETAL_SHAPES[shape]} fill={"url(#" + fill + ")"} />
      <path d={PETAL_SHAPES[shape]} fill="url(#pFold)" />
    </g>
    {/* veins fanning from the base */}
    <g stroke="#a85f66" strokeOpacity="0.22" strokeWidth="0.9" fill="none" strokeLinecap="round">
      <path d="M50 92C46 74 44 52 47 24" />
      <path d="M50 92C41 76 33 58 31 36" />
      <path d="M50 92C58 76 66 59 68 38" />
      <path d="M50 92C49 70 52 44 58 22" strokeOpacity="0.14" />
    </g>
    {/* the lit, rolled outer edge */}
    <path
      d={PETAL_SHAPES[shape]}
      fill="none"
      stroke="url(#pRim)"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
  </svg>
);

const Dove = () => (
  <svg viewBox="0 0 120 96" aria-hidden="true">
    <defs>
      <linearGradient id="doveBody" x1="20%" y1="6%" x2="76%" y2="94%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="52%" stopColor="#f7f4ec" />
        <stop offset="100%" stopColor="#ded7c8" />
      </linearGradient>
      <linearGradient id="doveWing" x1="14%" y1="0%" x2="82%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#f4f0e6" />
        <stop offset="100%" stopColor="#cfc7b6" />
      </linearGradient>
    </defs>

    {/* far wing, sweeping back */}
    <g className="wing wing-far">
      <path
        d="M58 44C50 33 41 25 28 21c-8-2-15-1-21 3 6 1 10 4 13 8-6 0-11 2-15 6 6 0 11 2 15 6-5 1-9 4-12 8 12 3 24 1 34-4 7-3 12-7 16-4z"
        fill="url(#doveWing)"
        opacity="0.72"
      />
    </g>

    {/* body, neck and head */}
    <path
      d="M56 46c7-6 12-13 21-16 5-2 10-2 14 1 3 2 4 5 3 8 3-1 6 0 8 2-3 1-5 3-6 6-1 5-5 8-10 9-6 1-11 0-16-2-6 6-14 10-23 12-9 2-18 1-26-3 9-1 16-5 22-11 5-4 9-8 13-6z"
      fill="url(#doveBody)"
    />
    <circle cx="97" cy="35" r="1.7" fill="#5d5344" />
    <path d="M103 37l7 2-7 3z" fill="#d8a74e" />

    {/* tail */}
    <path
      d="M32 62c-8 3-16 8-22 15 9-1 17-3 24-7 4-2 7-5 8-8z"
      fill="url(#doveWing)"
      opacity="0.9"
    />

    {/* near wing, the one that beats */}
    <g className="wing wing-near">
      <path
        d="M60 44c-4-13-11-24-22-32-7-5-15-8-24-8 5 5 8 11 10 18-6-3-12-4-18-2 6 3 10 8 13 14-5-1-10 0-14 3 7 2 12 6 16 11 7 8 17 12 28 11 6-1 11-6 11-15z"
        fill="url(#doveWing)"
      />
    </g>
  </svg>
);

const IconMenu = ({ open }) => (
  <Icon size={22}>
    {open ? (
      <path d="M6 6l12 12M18 6L6 18" />
    ) : (
      <path d="M4 7h16M4 12h16M4 17h16" />
    )}
  </Icon>
);

const IconArrow = () => (
  <Icon size={20}>
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </Icon>
);

function Fact({ icon, children }) {
  return (
    <div className="fact">
      {icon}
      <span>{children}</span>
    </div>
  );
}

export default function BruiloftSiteV2() {
  const [tab, setTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [introOpening, setIntroOpening] = useState(false);
  const [envelopeIn, setEnvelopeIn] = useState(false);
  const [mistClearing, setMistClearing] = useState(false);
  const [mistFlown, setMistFlown] = useState(false);
  const [open, setOpen] = useState(null);

  const closeMenu = () => setMenuOpen(false);

  const openInvitation = () => {
    if (introOpening) return;
    setIntroOpening(true);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setIntroDone(true), reduced ? 600 : 2500);
  };

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // The cloud bank parts almost immediately and the doves ride it out.
  useEffect(() => {
    if (introDone) return;
    const a = window.setTimeout(() => setMistClearing(true), 140);
    const b = window.setTimeout(() => setMistFlown(true), 2300);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [introDone]);

  // The title lands first, the envelope arrives a beat later.
  useEffect(() => {
    if (introDone) return;
    const t = window.setTimeout(() => setEnvelopeIn(true), 1000);
    return () => window.clearTimeout(t);
  }, [introDone]);

  // Browsers restore the previous scroll position on reload, which lands you
  // mid page behind the overlay. Always start at the top.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Hold the page still while the envelope is on screen.
  useEffect(() => {
    if (introDone) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [introDone]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="bruiloft">
      <style>{CSS}</style>

      {!introDone && (
        <div
          className={"opener" + (introOpening ? " opening" : "")}
          role="dialog"
          aria-modal="true"
          aria-label="Uitnodiging"
        >
          <div
            className={
              "mist" + (mistClearing ? " clearing" : "") + (mistFlown ? " flown" : "")
            }
            aria-hidden="true"
          >
            {CLOUDS.map((n) => (
              <span key={n} className={"cloud cloud-" + n} />
            ))}
            <div className="flight">
              {DOVES.map((d) => (
                <span
                  key={d.cls}
                  className={"dove " + d.cls}
                  style={{ left: d.start, top: d.top, width: d.size, transitionDelay: d.delay }}
                >
                  <Dove />
                </span>
              ))}
            </div>
          </div>

          <div className="opener-sky" />
          <div className="opener-veil" />
          <div className="opener-frame" />

          <div className="opener-head">
            <p className="opener-names">
              Sten <span className="amp">&amp;</span> Nyarayek&rsquo;s
            </p>
            <h1 className="opener-title">Wedding</h1>
            <div className="opener-rule" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <p className="opener-sub">You&rsquo;re cordially invited</p>
          </div>

          <div className={"stage" + (envelopeIn ? " arrived" : "")}>
            <div className="sparkles" aria-hidden="true">
              {SPARKLES.map((sp, i) => (
                <span
                  key={i}
                  className="sparkle"
                  style={{
                    top: sp.top,
                    left: sp.left,
                    width: sp.size,
                    height: sp.size,
                    animationDelay: sp.delay,
                  }}
                />
              ))}
            </div>


            <div className="envelope">
              <div className="env-pocket" />
              <div className="flap flap-bottom" />
              <div className="flap flap-left" />
              <div className="flap flap-right" />
              <div className="flap flap-top" />
              <button
                className="seal"
                type="button"
                onClick={openInvitation}
                aria-label="Open de uitnodiging"
              >
                <span className="seal-emblem" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className={"altar" + (envelopeIn ? " lit" : "")} aria-hidden="true">
            <PetalDefs />
            <div className="petals">
              {PETALS.map((pt, i) => (
                <span
                  key={i}
                  className={"petal" + (pt.fall ? " petal-fall" : "")}
                  style={{
                    left: pt.left,
                    top: pt.top,
                    transform: pt.fall ? undefined : "rotate(" + pt.rot + "deg) scale(" + pt.scale + ")",
                    animationDelay: pt.delay,
                  }}
                >
                  <Petal shape={pt.shape} fill={pt.fill} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <header className="nav">
        <div className="nav-in">
          <a className="nav-brand" href="#top" onClick={closeMenu}>
            <img
              className="nav-logo"
              src={IMG.logoIcon}
              width="192"
              height="192"
              alt="Nya en Sten"
            />
          </a>
          <nav className="nav-links">
            {SECTIONS.map((sec) => (
              <a key={sec.id} href={"#" + sec.id}>
                {sec.label}
              </a>
            ))}
          </nav>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="nav-panel"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <IconMenu open={menuOpen} />
            <span className="sr-only">{menuOpen ? "Menu sluiten" : "Menu openen"}</span>
          </button>
        </div>
        <div id="nav-panel" className={"nav-panel" + (menuOpen ? " open" : "")}>
          <div>
            <nav className="nav-panel-links">
              {SECTIONS.map((sec) => (
                <a key={sec.id} href={"#" + sec.id} onClick={closeMenu}>
                  {sec.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-bg" />
          <div className="wrap hero-inner">
            <p className="label hero-eyebrow">Uitnodiging bruiloft</p>
            <img
              className="hero-monogram"
              src={IMG.logoCompact}
              width="539"
              height="701"
              alt=""
            />
            <h1 className="serif hero-names">Sten &amp; Nyarayek</h1>
            <p className="hero-date">Zaterdag 19 september 2026</p>
            <a className="btn" href="#agenda">Bekijk agenda</a>
            <div className="hero-images">
              <div className="hero-img">
                <img src={IMG.couple} alt="Nya en Sten" />
              </div>
              <div className="hero-img">
                <img src={IMG.verloving} alt="De verlovingsring" />
              </div>
            </div>
          </div>
        </section>

        <section id="over" className="sec">
          <div className="wrap">
            <p className="serif intro">
              {"Alweer 12 jaar delen wij ons leven. We lachen, leren en groeien samen nog elke dag.\n\nWe kijken dankbaar terug op alles dat ons hier heeft gebracht. Met vertrouwen en vreugde kijken we uit naar de toekomst, omdat het mooiste nog komen gaat.\n\nWe voelen ons gezegend met elkaar, de mensen om ons heen en alles dat het leven ons geeft.\n\nOnder het oog van God, omringd door onze familie en vrienden, geven wij elkaar het jawoord en vieren onze liefde.\n\nWe kijken ernaar uit om deze bijzondere dag samen met jou te beleven."}
            </p>
            <div className="facts">
              <Fact icon={<IconTime />}>Zaterdag 19 september 2026</Fact>
              <Fact icon={<IconMap />}>
                St. Urbanuskerk, Noorddammerlaan 124-126, Amstelveen
              </Fact>
              <Fact icon={<IconDress />}>Dress code: Tenue de Ville</Fact>
            </div>
          </div>
        </section>

        <section id="agenda" className="sec">
          <div className="wrap">
            <h2 className="serif h1" style={{ marginBottom: "2.5rem" }}>
              Agenda trouwdag
            </h2>
            <div className="timeline">
              {TIMELINE.map((item, i) => (
                <div className="tl-item" key={i}>
                  <div className="tl-time">{item.time}</div>
                  <div className="tl-body">
                    <div className="tl-title h2 serif">{item.title}</div>
                    {item.body && <p className="prose">{item.body}</p>}
                    <a className="fact" href={item.map} target="_blank" rel="noreferrer">
                      <IconMap />
                      <span className="meta">{item.location}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec-tight">
          <div className="wrap">
            <a
              className="card"
              href="https://www.koonings.com/inspiratie/dresscode-tenue-de-ville/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="card-text">
                <p className="label" style={{ color: "var(--shade-4)" }}>Dresscode</p>
                <h2 className="serif h2" style={{ margin: "0.5rem 0" }}>
                  Wat is Tenue de Ville?
                </h2>
                <p className="link-u">Bekijk stijl en voorbeelden</p>
              </div>
              <div className="card-img">
                <img src={IMG.dresscode} alt="Voorbeeld Tenue de Ville" />
              </div>
            </a>
          </div>
        </section>

        <section id="locatie" className="sec">
          <div className="wrap">
            <p className="label" style={{ color: "var(--shade-4)" }}>Vervoer en locaties</p>
            <h2 className="serif h1" style={{ margin: "0.75rem 0 2.5rem", maxWidth: "20ch" }}>
              Van ceremonie naar diner en feest
            </h2>
            <div className="tabs">
              <div className="tab-img">
                <img src={TABS[tab].image} alt={TABS[tab].title} />
              </div>
              <div className="tab-list" role="tablist">
                {TABS.map((t, i) => (
                  <button
                    key={i}
                    className="tab"
                    role="tab"
                    aria-selected={tab === i}
                    onClick={() => setTab(i)}
                  >
                    <div className="tab-title">{t.title}</div>
                    <p className="prose">{t.body}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="sec">
          <div className="wrap">
            <h2 className="serif h1" style={{ marginBottom: "2.5rem" }}>
              Vraag en antwoord
            </h2>
            <div className="faq">
              {FAQ.map((item, i) => (
                <div className={"faq-row" + (open === i ? " open" : "")} key={i}>
                  <button
                    className="faq-btn"
                    aria-expanded={open === i}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <span className="faq-n">{item.n}</span>
                    <span className="faq-q">{item.q}</span>
                    <span className="faq-icon"><IconPlus /></span>
                  </button>
                  <div className="faq-panel">
                    <div>
                      <div className="faq-inner">
                        <p className="prose">{item.a}</p>
                        {item.link && (
                          <a className="link-u" href={item.link} target="_blank" rel="noreferrer">
                            {item.linkText}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="contact">
              <p className="serif contact-lead">Heb je een andere vraag?</p>
              <a className="serif contact-mail" href="mailto:bruiloft@flii.nl">
                bruiloft@flii.nl
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <img className="footer-logo" src={IMG.logoFull} width="800" height="800" alt="" />
        <nav className="footer-nav">
          {SECTIONS.map((sec) => (
            <a key={sec.id} href={"#" + sec.id}>
              {sec.label}
            </a>
          ))}
        </nav>
        <p className="footer-names">
          Nya <span className="footer-heart">❤️</span> Sten
        </p>
        <div className="socials">
          <a href="https://www.instagram.com/nveronica1/" target="_blank" rel="noreferrer">
            <IconInstagram />
            <span className="sr-only">Instagram</span>
          </a>
          <a href="https://flii.nl" target="_blank" rel="noreferrer">
            <IconArrow />
            <span className="sr-only">Flii Media</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
