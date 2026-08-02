import { useEffect, useState } from "react";

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
  logoIcon: "images/logo-icoon.png",
  logoCompact: "images/logo-compact.png",
  logoFull: "images/logo-volledig.png",
  couple: "images/bruidspaar.jpg",
  amstelkerkTuin: "images/amstelkerk-tuin.webp",
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
  width:6rem;height:6rem;margin:-3rem 0 0 -3rem;padding:0;
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
.seal-mark{font-family:"Great Vibes",cursive;font-size:2.5rem;line-height:1;
  padding-bottom:0.35rem;text-shadow:0 1px 2px rgba(70,42,10,0.6);}
.opener.opening .seal{opacity:0;transform:scale(0.55) rotate(-14deg);animation:none;}

@keyframes seal-breathe{
  0%,100%{transform:scale(1);}
  50%{transform:scale(1.04);}
}

/* doves */
.dove{position:absolute;z-index:5;width:clamp(2.4rem,7vw,3.6rem);color:#fffdf6;
  filter:drop-shadow(0 6px 10px rgba(120,100,60,0.3));opacity:0;}
.stage.arrived .dove{opacity:1;transition:opacity 900ms ease 200ms;}
.dove-left{left:-8%;top:6%;animation:dove-float-l 7s ease-in-out infinite;}
.dove-right{right:-8%;bottom:4%;animation:dove-float-r 8.5s ease-in-out infinite;}
@keyframes dove-float-l{
  0%,100%{transform:translate(0,0) rotate(-6deg);}
  50%{transform:translate(-0.6rem,-1.1rem) rotate(2deg);}
}
@keyframes dove-float-r{
  0%,100%{transform:translate(0,0) rotate(8deg) scaleX(-1);}
  50%{transform:translate(0.7rem,-0.9rem) rotate(-1deg) scaleX(-1);}
}
.opener.opening .dove-left{transform:translate(-9rem,-7rem) rotate(-18deg);opacity:0;
  transition:transform 1400ms ease, opacity 900ms ease;animation:none;}
.opener.opening .dove-right{transform:translate(9rem,-6rem) rotate(16deg) scaleX(-1);opacity:0;
  transition:transform 1400ms ease, opacity 900ms ease;animation:none;}

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

.opener-hint{position:relative;z-index:2;margin:0;
  font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;
  font-size:1.05rem;letter-spacing:0.12em;color:#7a5c28;opacity:0;
  transition:opacity 700ms ease;}
.stage-ready .opener-hint{opacity:0.85;}
.opener.opening .opener-hint{opacity:0;}

@media (max-width:600px){
  .stage{width:88vw;}
  .seal{width:5rem;height:5rem;margin:-2.5rem 0 0 -2.5rem;}
  .seal-mark{font-size:2.1rem;}
  .opener-frame{inset:var(--space-1);}
}

@media (prefers-reduced-motion:reduce){
  .opener-sky,.sparkle,.dove,.seal{animation:none;}
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

const Dove = ({ className }) => (
  <svg className={className} viewBox="0 0 64 44" fill="currentColor" aria-hidden="true">
    <path d="M4 26c6 1 11-1 15-5 2 5 6 8 12 8 8 0 14-5 17-12 2 3 5 5 9 5 3 0 5-1 7-3-4 0-6-2-7-5 3-1 5-3 6-6-3 1-6 1-8-1-3-3-7-5-11-5-7 0-13 4-16 10-3-5-8-8-14-8C10 4 4 9 2 16c3-1 6 0 8 2-3 2-5 4-6 8z" />
    <path d="M28 21c5-3 11-3 16 0-5 6-11 8-16 0z" opacity="0.35" />
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
          <div className="opener-sky" />
          <div className="opener-veil" />
          <div className="opener-frame" />

          <div className="opener-head">
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

            <Dove className="dove dove-left" />
            <Dove className="dove dove-right" />

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
                <span className="seal-mark" aria-hidden="true">
                  S&amp;N
                </span>
              </button>
            </div>
          </div>

          <div className={envelopeIn ? "stage-ready" : ""}>
            <p className="opener-hint">Klik op het zegel</p>
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
                <img src={IMG.amstelkerkTuin} alt="Tuin bij de Amstelkerk" />
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
