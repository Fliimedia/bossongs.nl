import { useEffect, useState } from "react";

const DOVES = [
  { cls: "dove-1", start: "48%", top: "52%", size: "clamp(3.2rem,11vw,5.5rem)", delay: "180ms" },
  { cls: "dove-2", start: "34%", top: "60%", size: "clamp(2.4rem,8vw,4rem)", delay: "420ms" },
  { cls: "dove-3", start: "62%", top: "44%", size: "clamp(2.8rem,9vw,4.6rem)", delay: "300ms" },
  { cls: "dove-4", start: "52%", top: "68%", size: "clamp(2rem,6.5vw,3.2rem)", delay: "640ms" },
];

const CLOUDS = [1, 2, 3, 4, 5, 6, 7];

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
  verloving: "images/verloving.webp",
  amstelkerk: "images/amstelkerk-exterieur.webp",
  urbanusBuiten: "images/urbanuskerk-exterieur.jpg",
  urbanusBinnen: "images/urbanuskerk-interieur.jpg",
  dresscode: "images/dresscode.jpg",
};

const SECTIONS = [
  { id: "over", nl: "Over ons", en: "About us" },
  { id: "agenda", nl: "Agenda trouwdag", en: "Wedding day schedule" },
  { id: "locatie", nl: "Vervoer en locaties", en: "Travel and venues" },
  { id: "faq", nl: "Vraag en antwoord", en: "Questions and answers" },
];

const URBANUS = "https://maps.app.goo.gl/JkR9bFd5aLRVbyBHA";
const AMSTELKERK = "https://maps.app.goo.gl/bn9KLxoZZxZuxTQW7";
const ROUTE =
  "https://www.google.com/maps/dir/St.+Urbanuskerk,+Noorddammerlaan+126,+1187+AG+Amstelveen/Amstelkerk,+Kerkstraat+11,+1191+JB+Ouderkerk+aan+de+Amstel/";

const TIMELINE = [
  {
    time: "13.30",
    nl: { title: "Inloop bij de kerk", location: "St. Urbanuskerk, Noorddammerlaan 124-126, Amstelveen" },
    en: { title: "Doors open at the church", location: "St. Urbanus church, Noorddammerlaan 124-126, Amstelveen" },
    map: URBANUS,
  },
  {
    time: "14.00",
    nl: { title: "Start ceremonie", location: "St. Urbanuskerk, Noorddammerlaan 124-126, Amstelveen" },
    en: { title: "Ceremony begins", location: "St. Urbanus church, Noorddammerlaan 124-126, Amstelveen" },
    map: URBANUS,
  },
  {
    time: "15.00",
    nl: { title: "Vertrek naar Amstelkerk", location: "Van Bovenkerk naar Ouderkerk a/d Amstel" },
    en: { title: "Leaving for the Amstelkerk", location: "From Bovenkerk to Ouderkerk aan de Amstel" },
    map: ROUTE,
  },
  {
    time: "15.30",
    nl: { title: "Receptie", location: "Tuin Amstelkerk, Ouderkerk a/d Amstel" },
    en: { title: "Reception", location: "Amstelkerk garden, Ouderkerk aan de Amstel" },
    map: AMSTELKERK,
  },
  {
    time: "18.00",
    nl: { title: "Diner", location: "Amstelkerk, Ouderkerk a/d Amstel" },
    en: { title: "Dinner", location: "Amstelkerk, Ouderkerk aan de Amstel" },
    map: AMSTELKERK,
  },
  {
    time: "20.00",
    nl: { title: "Feest", location: "SIBIZ, Amstelkerk, Ouderkerk a/d Amstel" },
    en: { title: "Party", location: "SIBIZ, Amstelkerk, Ouderkerk aan de Amstel" },
    map: AMSTELKERK,
  },
  {
    time: "00.00",
    nl: { title: "Uitloop tot 00.30", location: "Amstelkerk, Ouderkerk a/d Amstel" },
    en: { title: "Winding down until 00.30", location: "Amstelkerk, Ouderkerk aan de Amstel" },
    map: AMSTELKERK,
  },
];

const TABS = [
  {
    image: IMG.urbanusBinnen,
    nl: {
      title: "Uitnodiging",
      body: "Wij nodigen iedereen uit om de volledige dag met ons mee te maken: van ceremonie, tot diner en trouwfeest.",
    },
    en: {
      title: "The invitation",
      body: "We would love you to join us for the whole day: the ceremony, the dinner and the party afterwards.",
    },
  },
  {
    image: IMG.urbanusBuiten,
    nl: {
      title: "Aankomst",
      body: "Kom je met de auto? Parkeren in Bovenkerk is gratis.\n\nFietsen kun je parkeren tegenover de kerk, in de stalling van Silversant.\n\nDe dichtsbijzijnde bushalte is direct naast de kerk, halte Zwarte Pad.",
    },
    en: {
      title: "Arriving",
      body: "Coming by car? Parking in Bovenkerk is free.\n\nBicycles can be left opposite the church, in the Silversant rack.\n\nThe nearest bus stop is right beside the church, Zwarte Pad.",
    },
  },
  {
    image: IMG.amstelkerk,
    nl: {
      title: "Vervoer naar Ouderkerk",
      body: "Van Bovenkerk naar Ouderkerk kun je met eigen vervoer, openbaar vervoer of met de taxi: 15 minuten met de auto of 25 minuten met de fiets.\n\nParkeren in Ouderkerk is gratis aan de Kerkweg. Er is een parkeerterrein direct naast de kerk. Let wel op: de straat ernaast begint een Groene parkeerzone. Hier mag je 1.5 uur parkeren met een blauwe schijf.",
    },
    en: {
      title: "Getting to Ouderkerk",
      body: "From Bovenkerk to Ouderkerk you can drive, cycle, take public transport or a taxi: 15 minutes by car, 25 by bicycle.\n\nParking in Ouderkerk is free on the Kerkweg, with a car park right next to the church. Do note that the next street over is a green zone, where you may park for 1.5 hours with a parking disc.",
    },
  },
];

const FAQ = [
  {
    n: "01",
    nl: {
      q: "Mag ik gasten meenemen?",
      a: "Het is vanwege de locatie beperkingen niet mogelijk om extra gasten mee te nemen.",
    },
    en: {
      q: "Can I bring extra guests?",
      a: "Because of the capacity of the venues we are not able to welcome additional guests.",
    },
  },
  {
    n: "02",
    nl: {
      q: "Zijn kinderen welkom?",
      a: "In overleg is dat waarschijnlijk mogelijk. Neem even contact met ons op via bruiloft@flii.nl, dan kijken we samen wat er kan.",
    },
    en: {
      q: "Are children welcome?",
      a: "Most likely yes, in consultation. Send us a note at bruiloft@flii.nl and we will work it out together.",
    },
    linkText: "bruiloft@flii.nl",
    link: "mailto:bruiloft@flii.nl",
  },
  {
    n: "03",
    nl: {
      q: "Hoe kom ik van Bovenkerk naar Ouderkerk?",
      a: "Je kunt met eigen vervoer, zoals de auto of fiets.\n\nOpenbaar vervoer: direct naast de kerk is er bushalte Zwarte Pad. Hier pak je lijn 171 tot Amstelveen busstation en stap je over op lijn 356 tot halte Ouderkerk West. Vanaf hier is het 8 minuten lopen naar de Amstelkerk.\n\nHeb je geen vervoer? Laat het ons dan weten, dan kijken we mee.\n\nNa afloop rijdt er geen bus meer. Regel je terugreis vooraf, met eigen vervoer of een taxi.",
    },
    en: {
      q: "How do I get from Bovenkerk to Ouderkerk?",
      a: "You can drive or cycle.\n\nBy public transport: the Zwarte Pad stop is right beside the church. Take line 171 to Amstelveen bus station, change to line 356 and get off at Ouderkerk West. From there it is an 8 minute walk to the Amstelkerk.\n\nNo transport of your own? Let us know and we will help.\n\nThere are no buses after the party, so please arrange your journey home in advance, by car or taxi.",
    },
    linkText: "Route van Bovenkerk naar Ouderkerk",
    linkTextEn: "Route from Bovenkerk to Ouderkerk",
    link: ROUTE,
  },
  {
    n: "04",
    nl: {
      q: "Ik heb een allergie of dieetwens, waar meld ik dat?",
      a: "Stuur ons een bericht met wat je niet kunt of wilt eten. Geef het uiterlijk twee weken voor de bruiloft door, dan kan de keuken er nog rekening mee houden.",
    },
    en: {
      q: "I have an allergy or dietary requirement, where do I share it?",
      a: "Send us a note telling us what you cannot or would rather not eat. Please let us know at least two weeks before the wedding so the kitchen can still account for it.",
    },
    linkText: "bruiloft@flii.nl",
    link: "mailto:bruiloft@flii.nl",
  },
];

const COPY = {
  nl: {
    date: "Zaterdag 19 september 2026",
    heroBtn: "Bekijk agenda",
    story:
      "Alweer 12 jaar delen wij ons leven. We lachen, leren en groeien samen nog elke dag.\n\nWe kijken dankbaar terug op alles dat ons hier heeft gebracht. Met vertrouwen en vreugde kijken we uit naar de toekomst, omdat het mooiste nog komen gaat.\n\nWe voelen ons gezegend met elkaar, de mensen om ons heen en alles dat het leven ons geeft.\n\nOnder het oog van God, omringd door onze familie en vrienden, geven wij elkaar het jawoord en vieren onze liefde.\n\nWe kijken ernaar uit om deze bijzondere dag samen met jou te beleven.",
    venue: "St. Urbanuskerk, Noorddammerlaan 124-126, Amstelveen",
    dress: "Dress code: Tenue de Ville",
    gift: "Cadeautip:",
    dressLabel: "Dresscode",
    dressTitle: "Wat is Tenue de Ville?",
    dressLink: "Bekijk stijl en voorbeelden",
    dressAlt: "Voorbeeld Tenue de Ville",
    travelTitle: "Van ceremonie naar diner en feest",
    agendaEyebrow: "De dag",
    factsEyebrow: "Praktisch",
    factsTitle: "In het kort",
    faqEyebrow: "Goed om te weten",
    contactLead: "Heb je een andere vraag?",
    coupleAlt: "Nyarayek en Sten",
    ringAlt: "De verlovingsring",
    menuOpen: "Menu openen",
    menuClose: "Menu sluiten",
    sealLabel: "Open de uitnodiging",
  },
  en: {
    date: "Saturday 19 September 2026",
    heroBtn: "See the schedule",
    story:
      "We have shared our lives for twelve years now. We still laugh, learn and grow together every single day.\n\nWe look back with gratitude on everything that brought us here. We look ahead with confidence and joy, because the best is still to come.\n\nWe feel blessed with each other, with the people around us and with everything life gives us.\n\nBefore God, surrounded by our family and friends, we will say yes to each other and celebrate our love.\n\nWe cannot wait to share this day with you.",
    venue: "St. Urbanus church, Noorddammerlaan 124-126, Amstelveen",
    dress: "Dress code: Tenue de Ville",
    gift: "Gift tip:",
    dressLabel: "Dress code",
    dressTitle: "What is Tenue de Ville?",
    dressLink: "See the style and examples",
    dressAlt: "Tenue de Ville example",
    travelTitle: "From ceremony to dinner and party",
    agendaEyebrow: "The day",
    factsEyebrow: "Practical",
    factsTitle: "At a glance",
    faqEyebrow: "Good to know",
    contactLead: "Have another question?",
    coupleAlt: "Nyarayek and Sten",
    ringAlt: "The engagement ring",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    sealLabel: "Open the invitation",
  },
};

const CSS = `
.bruiloft{
  --shade-1:hsl(0,0%,100%);
  --shade-2:hsl(0,0%,94.9%);
  --shade-3:hsl(0,0%,81.9%);
  --shade-4:hsl(204,2.2%,45.3%);
  --shade-5:hsl(240,1.6%,12.4%);
  --shade-6:hsl(0,0%,0%);
  --brand:hsl(48,35.7%,94.5%);
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
/* Hero: an editorial invitation panel, copy on the left, prints on the right */
.hero{position:relative;padding:var(--space-6) 0 var(--space-6);}
.hero-bg{position:absolute;inset:0 var(--space-3) 22% var(--space-3);
  background:var(--brand);border-radius:14px;z-index:0;}
.hero-bg::after{content:"";position:absolute;inset:0.75rem;border-radius:10px;
  border:1px solid var(--gold-line-soft);}

.hero-grid{position:relative;z-index:1;display:grid;
  grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);
  gap:clamp(2rem,6vw,5rem);align-items:center;}

.hero-copy{display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-3);}
.hero-monogram{width:5.5rem;height:auto;margin:0;}
.hero-title{display:flex;flex-direction:column;align-items:inherit;gap:0.3rem;}
.hero-names{margin:0;font-size:clamp(2.6rem,6.4vw,4.6rem);line-height:0.98;
  letter-spacing:-0.012em;}
.hero-sub{margin:0;font-size:clamp(1rem,2.4vw,1.5rem);line-height:1;
  letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);}
.hero-amp{font-style:italic;color:var(--gold);padding:0 0.06em;}
.hero-date{display:flex;align-items:center;gap:0.75rem;margin:0;
  font-size:var(--type-label);font-weight:600;letter-spacing:0.14em;
  text-transform:uppercase;color:var(--shade-4);}
.hero-date::before{content:"";width:2.5rem;height:1px;background:var(--gold);}
.hero-btn{margin-top:var(--space-2);}

/* two prints, laid down rather than pasted in */
.hero-frames{position:relative;padding:var(--space-3) 0 var(--space-5);}
.hero-frame{margin:0;overflow:hidden;background:var(--shade-1);
  padding:0.55rem 0.55rem 2.4rem;border-radius:3px;
  box-shadow:0 18px 34px rgba(96,74,40,0.2), 0 2px 6px rgba(96,74,40,0.14);}
.hero-frame img{width:100%;height:100%;object-fit:cover;display:block;border-radius:1px;}
.frame-a{width:72%;margin-left:auto;transform:rotate(2deg);}
.frame-a img{aspect-ratio:4/5;}
.frame-b{position:absolute;left:0;bottom:0;width:52%;transform:rotate(-4.5deg);
  padding-bottom:1.9rem;}
.frame-b img{aspect-ratio:1/1;}

@media (max-width:900px){
  .hero{padding-top:var(--space-5);}
  .hero-grid{grid-template-columns:1fr;gap:var(--space-4);}
  .hero-copy{align-items:center;text-align:center;}
  .hero-date::before{display:none;}
  .hero-frames{padding-bottom:var(--space-6);}
  .frame-a{width:66%;}
  .frame-b{width:46%;}
}
@media (max-width:600px){
  .hero-bg{inset:0 var(--space-2) 26% var(--space-2);}
  .hero-monogram{width:4.5rem;}
  .hero-frame{padding:0.4rem 0.4rem 1.7rem;}
  .frame-b{padding-bottom:1.35rem;}
}

.btn{display:inline-flex;min-height:3.5rem;align-items:center;justify-content:center;padding:0 var(--space-4);
  border-radius:6px;background:var(--shade-6);color:var(--shade-1);
  font-size:var(--type-label);font-weight:600;letter-spacing:0.1em;text-transform:uppercase;
  transition:background-color 200ms ease;}
.btn:hover{background:var(--shade-5);}

.h1{font-size:var(--type-1);line-height:1.1;margin:0;}
.h2{font-size:var(--type-2);line-height:1.15;margin:0;}
.intro{font-size:1.5rem;line-height:1.5;max-width:60ch;white-space:pre-line;margin:0;}

.facts{display:flex;flex-direction:column;align-items:flex-start;
  gap:var(--space-1);margin-top:var(--space-5);padding:var(--space-4) var(--space-4) var(--space-3);}
.facts .card-title{margin-bottom:var(--space-2);}
.facts .fact{width:100%;padding:0.55rem 0.2rem;}
.facts .fact + .fact{border-top:1px solid var(--gold-line-soft);}
.fact{display:flex;align-items:center;gap:0.7rem;}
.fact svg{flex:0 0 auto;color:var(--gold);}
.fact-inline{display:inline-flex;margin-left:0.4rem;vertical-align:-0.22em;color:var(--gold);}
.fact span{font-size:0.92rem;line-height:1.45;}

.timeline{border-top:1px solid var(--gold-line-soft);}
.tl-item{--tl-line:clamp(0.95rem,3.5vw,1.35rem);--tl-gut:3.4em;
  display:grid;grid-template-columns:0.85rem minmax(var(--tl-gut), max-content) 1fr;
  column-gap:0.85rem;align-items:baseline;
  padding:var(--space-3) 0;border-bottom:1px solid var(--gold-line-soft);
  font-size:var(--tl-line);}

/* the marker centres on the first line rather than on the whole block */
.tl-marker{align-self:start;display:flex;align-items:center;justify-content:center;
  height:calc(var(--tl-line) * 1.35);}
.tl-marker i{width:0.3rem;height:0.3rem;transform:rotate(45deg);
  background:var(--gold);border-radius:1px;}


/* time and title on one line, sitting on a shared baseline */
.tl-time{font-variant-numeric:tabular-nums;font-weight:600;font-size:1em;
  letter-spacing:0.01em;color:var(--gold);white-space:nowrap;line-height:1.35;}
.tl-title{min-width:0;font-size:1em;font-weight:400;color:var(--shade-6);
  white-space:nowrap;line-height:1.35;}

/* the pin sits in the marker column, directly beneath the diamond,
   and the text starts on the same axis as the time above it */
.tl-where{grid-column:1 / -1;display:grid;
  grid-template-columns:0.85rem 1fr;column-gap:0.85rem;
  align-items:center;margin-top:0.3rem;}
.tl-pin{display:flex;justify-content:center;color:var(--gold);}
.tl-pin svg{width:calc(var(--tl-line) * 0.8);height:auto;}
.tl-where .meta{font-size:calc(var(--tl-line) * 0.78);line-height:1.4;}

/* one panel treatment: cream, soft corner, gold keyline set in from the edge */
.panel{position:relative;display:block;max-width:34rem;margin:0 auto;
  padding:var(--space-4);background:var(--brand);border-radius:14px;}
.panel::after{content:"";position:absolute;inset:0.6rem;border-radius:10px;
  border:1px solid var(--gold-line-soft);pointer-events:none;}

.card{transition:transform 200ms ease, box-shadow 200ms ease;}
.card:hover{transform:translateY(-2px);box-shadow:0 14px 28px rgba(96,74,40,0.14);}
.card-text{display:flex;flex-direction:column;align-items:flex-start;
  gap:var(--space-1);}
.card-title{margin:0;font-size:var(--type-2);line-height:1.15;}
.card-img{width:100%;margin:var(--space-2) 0 var(--space-1);overflow:hidden;
  border-radius:8px;}
.card-img img{width:100%;height:100%;object-fit:cover;
  aspect-ratio:16/10;display:block;
  transition:transform 400ms cubic-bezier(.2,.7,.3,1);}
.card:hover .card-img img{transform:scale(1.03);}

.tabs{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);align-items:center;}
.tab-img{aspect-ratio:1/1;overflow:hidden;border-radius:10px;}
.tab-img img{width:100%;height:100%;object-fit:cover;}
.tab-list{display:flex;flex-direction:column;gap:var(--space-3);}
.tab{text-align:left;opacity:0.45;padding:var(--space-2) 0 var(--space-2) var(--space-2);
  border-left:2px solid transparent;transition:opacity 200ms ease,border-color 200ms ease;}
.tab[aria-selected="true"]{opacity:1;border-left-color:var(--gold);}
.tab-title{font-size:var(--type-3);font-weight:600;margin-bottom:var(--space-1);}
.tab[aria-selected="true"] .tab-title{color:var(--shade-6);}

/* every section opens the same way: eyebrow, ornament, serif title */
.sec-head{display:flex;flex-direction:column;align-items:flex-start;
  gap:var(--space-1);margin-bottom:var(--space-4);max-width:34ch;}
.sec-eyebrow{margin:0;font-size:var(--type-label);font-weight:600;
  letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);}
.sec-rule{display:flex;align-items:center;gap:0.5rem;width:7rem;
  margin:0.15rem 0 0.35rem;color:var(--gold);}
.sec-rule span{flex:1 1 0;height:1px;background:currentColor;}
.sec-rule span:last-child{background:linear-gradient(90deg,currentColor,transparent);}
.sec-rule i{width:0.32rem;height:0.32rem;transform:rotate(45deg);
  background:currentColor;border-radius:1px;}
.sec-title{margin:0;font-size:var(--type-1);line-height:1.1;}
.sec-head-wide{max-width:22ch;}

.faq{border-top:1px solid var(--shade-3);}
.faq-row{border-bottom:1px solid var(--shade-3);}
.faq-btn{display:grid;grid-template-columns:3.5rem 1fr 2rem;gap:var(--space-2);align-items:start;
  width:100%;padding:var(--space-4) 0;text-align:left;}
.faq-n{color:var(--gold);font-size:1rem;font-variant-numeric:tabular-nums;padding-top:0.2rem;}
.faq-q{font-size:var(--type-3);font-weight:600;line-height:1.3;}
.faq-icon{display:inline-flex;justify-self:end;color:var(--gold);transition:transform 200ms ease;}
.faq-row.open .faq-icon{transform:rotate(45deg);}
.faq-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows 250ms ease;}
.faq-row.open .faq-panel{grid-template-rows:1fr;}
.faq-panel > div{overflow:hidden;}
.faq-inner{padding:0 2rem var(--space-4) 3.5rem;display:flex;flex-direction:column;gap:var(--space-3);}
.link-u{align-self:flex-start;font-size:var(--type-label);font-weight:600;letter-spacing:0.1em;
  text-transform:uppercase;border-bottom:1px solid var(--gold-line);padding-bottom:2px;
  transition:border-color 200ms ease;}
.link-u:hover{border-bottom-color:var(--gold);}

.contact{display:flex;flex-direction:column;align-items:center;gap:var(--space-1);
  padding:var(--space-5) 0;text-align:center;}
.contact-lead{font-size:var(--type-2);color:var(--shade-4);}
.contact-mail{font-size:var(--type-2);}

.nav{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);
  backdrop-filter:blur(8px);border-bottom:1px solid var(--shade-2);}
.nav-in{position:relative;display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);
  padding:var(--space-2) var(--space-3);max-width:72rem;margin:0 auto;}
.nav-links{display:flex;gap:var(--space-3);}
.nav-links a{font-size:1rem;font-weight:500;transition:opacity 200ms ease;}
.nav-links a:hover{opacity:0.6;}
.lang{position:relative;display:inline-flex;align-items:center;
  padding:0.15rem;border-radius:999px;
  border:1px solid var(--gold-line-soft);background:rgba(255,255,255,0.7);}
.lang-thumb{position:absolute;top:0.15rem;left:0.15rem;
  width:calc(50% - 0.15rem);height:calc(100% - 0.3rem);
  border-radius:999px;background:var(--shade-1);
  box-shadow:0 1px 3px rgba(96,74,40,0.18);
  transition:transform 260ms cubic-bezier(.4,0,.2,1);}
.lang-thumb[data-on="en"]{transform:translateX(100%);}
.lang-opt{position:relative;z-index:1;display:inline-flex;align-items:center;
  gap:0.28rem;padding:0.2rem 0.5rem;border-radius:999px;line-height:1;
  color:var(--shade-4);transition:color 200ms ease;}
.lang-opt:hover{color:var(--shade-6);}
.lang-opt.is-on{color:var(--gold);}
.lang-flag{font-size:0.72rem;filter:grayscale(1);opacity:0.55;
  transition:filter 200ms ease, opacity 200ms ease;}
.lang-opt.is-on .lang-flag{filter:none;opacity:1;}
.lang-code{font-size:0.65rem;font-weight:600;letter-spacing:0.08em;}

.nav-toggle{display:none;align-items:center;justify-content:center;color:var(--gold);
  width:2.75rem;height:2.75rem;margin-right:calc(var(--space-1) * -1);border-radius:6px;
  transition:background-color 200ms ease;}
.nav-toggle:hover{background:var(--brand);}
.nav-panel{display:none;}
.nav-logo{width:1.75rem;height:auto;display:block;}

.footer{margin-top:var(--space-6);background:var(--brand);border-radius:10px 10px 0 0;
  padding:var(--space-5) var(--space-3);text-align:center;}
.footer-logo{width:7rem;height:auto;margin:0 auto var(--space-4);}
.footer-nav{display:flex;flex-direction:column;align-items:center;gap:var(--space-2);
  margin-bottom:var(--space-4);}
.footer-nav a{font-size:1rem;transition:opacity 200ms ease;}
.footer-nav a:hover{opacity:0.6;}
.footer-names{font-weight:600;margin-bottom:var(--space-2);}
.footer-heart{margin:0 0.15rem;font-size:0.9em;}
.socials{display:flex;justify-content:center;gap:var(--space-2);}
.socials a{display:inline-flex;padding:var(--space-1);color:var(--gold);transition:opacity 200ms ease;}
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
  .lang{margin-left:auto;}
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
  .intro{font-size:1.25rem;}

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
  transition:opacity 800ms ease 1350ms, visibility 0ms linear 2150ms;}
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
  border:1px solid var(--gold-line);
  box-shadow:inset 0 0 0 5px rgba(255,255,255,0.28), inset 0 0 60px rgba(177,135,63,0.14);}
.opener-frame::before,.opener-frame::after{content:"";position:absolute;width:2.5rem;height:2.5rem;
  border:1px solid var(--gold-line);}
.opener-frame::before{top:0.6rem;left:0.6rem;border-right:0;border-bottom:0;}
.opener-frame::after{bottom:0.6rem;right:0.6rem;border-left:0;border-top:0;}

.opener-invite{position:relative;z-index:2;margin:0;text-align:center;
  font-family:"Great Vibes",cursive;font-weight:400;
  font-size:clamp(1.5rem,6vw,2.8rem);line-height:1.2;
  color:var(--gold-light);
  text-shadow:0 1px 0 rgba(255,252,242,0.8), 0 2px 6px rgba(112,80,32,0.28);
  opacity:0;transform:translateY(0.7rem);
  transition:opacity 1000ms ease, transform 1000ms cubic-bezier(.2,.75,.3,1);}
.opener-invite.arrived{opacity:1;transform:translateY(0);}
.opener.opening .opener-invite{opacity:0;transition:opacity 600ms ease;}

/* the envelope arrives a beat later */
.stage{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;
  width:min(82vw,30rem);aspect-ratio:3/2;perspective:1600px;perspective-origin:50% 45%;
  opacity:0;transform:translateY(2rem) scale(0.9);
  transition:opacity 1100ms ease, transform 1100ms cubic-bezier(.2,.75,.3,1);}
.stage.arrived{opacity:1;transform:translateY(0) scale(1);}

.envelope{position:absolute;inset:0;transform-style:preserve-3d;
  transition:transform 850ms cubic-bezier(.5,0,.75,0) 1250ms, opacity 700ms ease 1350ms;
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
  transition:transform 700ms cubic-bezier(.62,.02,.31,1), filter 700ms ease;}

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
.opener.opening .flap-left{transform:rotateY(-168deg);transition-delay:260ms;}
.opener.opening .flap-right{transform:rotateY(168deg);transition-delay:260ms;}
.opener.opening .flap-bottom{transform:rotateX(170deg);transition-delay:500ms;}

/* wax seal, drawn and lit in svg */
.wax-defs{position:absolute;width:0;height:0;overflow:hidden;}

.seal{position:absolute;top:50%;left:50%;z-index:6;
  width:7.4rem;height:7.4rem;margin:-3.7rem 0 0 -3.7rem;padding:0;
  display:flex;align-items:center;justify-content:center;
  background:none;border:0;cursor:pointer;
  transform:rotate(-5deg);
  filter:drop-shadow(0 12px 16px rgba(70,42,10,0.45));
  animation:seal-breathe 3.4s ease-in-out infinite;
  transition:transform 500ms ease, opacity 500ms ease, filter 300ms ease;}
.wax{width:100%;height:100%;display:block;overflow:visible;}
.seal:hover{filter:drop-shadow(0 18px 24px rgba(70,42,10,0.52));}
.opener.opening .seal{opacity:0;transform:scale(0.55) rotate(-20deg);animation:none;}

@keyframes seal-breathe{
  0%,100%{transform:rotate(-5deg) scale(1);}
  50%{transform:rotate(-5deg) scale(1.035);}
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
  transition:transform 2200ms cubic-bezier(.22,.62,.28,1), opacity 700ms ease;}
.dove svg{width:100%;height:auto;display:block;}
.mist.clearing .dove{opacity:1;}
.mist.clearing .dove-1{transform:translate3d(-58vw,-40vh,0) rotate(-16deg) scale(1.25);}
.mist.clearing .dove-2{transform:translate3d(-42vw,-58vh,0) rotate(-24deg) scale(1.1);}
.mist.clearing .dove-3{transform:translate3d(56vw,-46vh,0) rotate(14deg) scaleX(-1) scale(1.2);}
.mist.clearing .dove-4{transform:translate3d(38vw,-62vh,0) rotate(20deg) scaleX(-1);}
.mist.flown .dove{opacity:0;transition:opacity 800ms ease;}

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

const IconGift = () => (
  <Icon size={16}>
    <path d="M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <path d="M3 7.5h18V11H3z" />
    <path d="M12 7.5V21" />
    <path d="M12 7.5S10.5 3 8 3a2.2 2.2 0 0 0 0 4.5z" />
    <path d="M12 7.5S13.5 3 16 3a2.2 2.2 0 0 1 0 4.5z" />
  </Icon>
);

const IconEnvelope = ({ size = 16 }) => (
  <Icon size={size}>
    <rect x="3" y="6" width="18" height="13" rx="1.5" />
    <path d="M3.4 7.2 12 13.6l8.6-6.4" />
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

// A struck wax seal. The monogram is real glyph outlines pulled from Playfair
// Display and Great Vibes at build time, not live <text>, so it can never fall
// back to a system font and never reflows. Placement is measured, not guessed.
const WaxSeal = () => (
  <svg className="wax" viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <radialGradient id="waxBody" cx="32%" cy="24%" r="84%">
        <stop offset="0%" stopColor="var(--gold-light)" />
        <stop offset="45%" stopColor="var(--gold)" />
        <stop offset="100%" stopColor="var(--gold-deep)" />
      </radialGradient>
      <linearGradient id="waxRim" x1="18%" y1="10%" x2="82%" y2="92%">
        <stop offset="0%" stopColor="var(--gold-pale)" />
        <stop offset="22%" stopColor="var(--gold-light)" />
        <stop offset="50%" stopColor="var(--gold)" />
        <stop offset="78%" stopColor="#a87d2c" />
        <stop offset="100%" stopColor="#7d5716" />
      </linearGradient>
      <radialGradient id="waxField" cx="38%" cy="30%" r="80%">
        <stop offset="0%" stopColor="var(--gold-light)" />
        <stop offset="52%" stopColor="var(--gold)" />
        <stop offset="100%" stopColor="#a2762a" />
      </radialGradient>

      <filter id="waxWarp" x="-16%" y="-16%" width="132%" height="132%">
        <feTurbulence type="fractalNoise" baseFrequency="0.019" numOctaves="3" seed="19" result="w" />
        <feDisplacementMap in="SourceGraphic" in2="w" scale="8"
          xChannelSelector="R" yChannelSelector="G" />
      </filter>

      <filter id="reliefRim" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3.4" result="b" />
        <feSpecularLighting in="b" surfaceScale="6" specularConstant="1.15"
          specularExponent="18" lightingColor="#fff2cc" result="sp">
          <feDistantLight azimuth="225" elevation="48" />
        </feSpecularLighting>
        <feComposite in="sp" in2="SourceAlpha" operator="in" result="spc" />
        <feComposite in="SourceGraphic" in2="spc" operator="arithmetic"
          k1="0" k2="1" k3="1" k4="0" />
      </filter>

      {/* gentler on the monogram: a hard specular blows out serif hairlines */}
      <filter id="reliefFine" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="0.45" result="b" />
        <feSpecularLighting in="b" surfaceScale="2.4" specularConstant="0.72"
          specularExponent="30" lightingColor="#fff4d4" result="sp">
          <feDistantLight azimuth="225" elevation="60" />
        </feSpecularLighting>
        <feComposite in="sp" in2="SourceAlpha" operator="in" result="spc" />
        <feOffset in="SourceAlpha" dx="0.45" dy="0.6" result="sh" />
        <feGaussianBlur in="sh" stdDeviation="0.4" result="shb" />
        <feFlood floodColor="#5b3a0c" floodOpacity="0.55" result="shc" />
        <feComposite in="shc" in2="shb" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="spc" />
        </feMerge>
      </filter>

      <filter id="waxGrain">
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="4" result="n" />
        <feColorMatrix in="n" type="saturate" values="0" result="g" />
        <feComponentTransfer in="g" result="soft">
          <feFuncA type="linear" slope="0.26" />
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="soft" mode="multiply" />
      </filter>
    </defs>

    <g filter="url(#waxWarp)">
      <circle cx="100" cy="100" r="95" fill="url(#waxBody)" />
      <circle cx="100" cy="100" r="85" fill="none" stroke="url(#waxRim)"
        strokeWidth="21" filter="url(#reliefRim)" />
      <path d="M31 68a76 76 0 0 1 52-38" fill="none" stroke="#fff3d0"
        strokeOpacity="0.5" strokeWidth="7" strokeLinecap="round" />
    </g>

    <circle cx="100" cy="100" r="74" fill="url(#waxField)" filter="url(#waxGrain)" />
    <circle cx="100" cy="100" r="74" fill="none" stroke="#7f5a17"
      strokeOpacity="0.35" strokeWidth="2.5" />

    <g filter="url(#reliefFine)" fill="var(--gold)">
      <circle cx="100" cy="100" r="66" fill="none" stroke="var(--gold)" strokeWidth="2" />

      {/* a die cannot hold a hairline, so the outlines carry a slight stroke */}
      <g stroke="var(--gold)" strokeWidth="0.5" strokeLinejoin="round">
      <g transform="translate(0.64, 1.0)">
        <path
          transform="translate(49.61, 99.81) scale(0.0647)"
          d="M685 -708V-688Q653 -685 636.0 -673.5Q619 -662 613.5 -637.5Q608 -613 608 -568V3Q599 2 588.5 2.0Q578 2 566 3L137 -580V-148Q137 -100 143.0 -73.5Q149 -47 169.5 -35.5Q190 -24 232 -20V0Q213 -2 183.0 -2.5Q153 -3 126 -3Q102 -3 77.5 -2.5Q53 -2 37 0V-20Q70 -24 86.5 -35.0Q103 -46 108.5 -71.0Q114 -96 114 -140V-602Q114 -639 108.5 -656.5Q103 -674 86.5 -680.5Q70 -687 37 -688V-708Q53 -707 77.5 -706.0Q102 -705 126 -705Q149 -705 171.0 -706.0Q193 -707 210 -708L585 -209V-560Q585 -609 579.0 -635.0Q573 -661 553.0 -673.0Q533 -685 490 -688V-708Q509 -707 539.5 -706.0Q570 -705 596 -705Q621 -705 645.5 -706.0Q670 -707 685 -708Z"
        />
        <path
          transform="translate(102.43, 145.12) scale(0.06267)"
          d="M274 -720Q330 -720 360.0 -708.0Q390 -696 412 -682Q424 -675 431.5 -671.5Q439 -668 446 -668Q456 -668 460.5 -679.0Q465 -690 468 -712H491Q490 -693 488.5 -668.0Q487 -643 486.5 -601.5Q486 -560 486 -492H463Q460 -543 440.5 -590.0Q421 -637 385.5 -667.5Q350 -698 295 -698Q246 -698 213.5 -669.0Q181 -640 181 -591Q181 -549 202.0 -520.5Q223 -492 261.5 -465.5Q300 -439 353 -405Q402 -373 441.0 -341.5Q480 -310 502.5 -272.0Q525 -234 525 -179Q525 -114 493.0 -71.0Q461 -28 407.0 -7.0Q353 14 289 14Q230 14 195.5 2.0Q161 -10 136 -23Q114 -37 102 -37Q92 -37 87.5 -26.0Q83 -15 80 7H57Q59 -16 59.5 -47.0Q60 -78 60.5 -127.5Q61 -177 61 -253H84Q88 -189 106.5 -133.5Q125 -78 163.5 -44.0Q202 -10 266 -10Q301 -10 329.5 -22.5Q358 -35 375.0 -61.5Q392 -88 392 -129Q392 -170 373.0 -201.0Q354 -232 320.0 -259.0Q286 -286 240 -314Q193 -344 152.0 -375.0Q111 -406 86.5 -445.5Q62 -485 62 -541Q62 -603 92.0 -642.5Q122 -682 170.5 -701.0Q219 -720 274 -720Z"
        />
        <path
          className="amp-stroke"
          transform="translate(72.92, 131.57) scale(0.09854)"
          d="M263 45Q178 45 122.0 18.5Q66 -8 38.5 -51.5Q11 -95 11 -144Q11 -199 44.0 -253.5Q77 -308 142.5 -347.5Q208 -387 303 -397Q289 -416 282.0 -440.5Q275 -465 275 -487Q276 -540 305.0 -580.5Q334 -621 379.5 -649.0Q425 -677 477.0 -691.5Q529 -706 575 -706Q603 -706 632.0 -698.5Q661 -691 681.0 -672.0Q701 -653 701 -618Q701 -589 683.0 -566.0Q665 -543 639 -543Q620 -543 606.0 -557.0Q592 -571 592 -589Q592 -610 605.5 -623.5Q619 -637 639 -637Q648 -637 659.5 -631.0Q671 -625 674 -619Q675 -623 675 -630Q675 -657 653.0 -668.0Q631 -679 606 -679Q566 -679 513.0 -659.5Q460 -640 410 -596Q392 -580 373.0 -554.0Q354 -528 341.0 -498.5Q328 -469 328 -439Q328 -416 336 -399Q351 -399 370.5 -400.5Q390 -402 411 -402Q437 -402 452.0 -391.0Q467 -380 467 -366Q467 -356 455.0 -347.0Q443 -338 417 -338Q384 -338 357.5 -352.5Q331 -367 316 -382Q250 -373 204.0 -333.0Q158 -293 134.0 -238.5Q110 -184 110 -130Q110 -87 126.5 -50.0Q143 -13 177.0 9.5Q211 32 263 32Q317 32 361.5 12.5Q406 -7 438.0 -38.0Q470 -69 487.5 -103.5Q505 -138 505 -168Q505 -194 486.5 -211.5Q468 -229 438.0 -237.5Q408 -246 374 -246Q339 -246 304.5 -236.5Q270 -227 246.0 -207.5Q222 -188 217 -158Q217 -156 216.5 -153.5Q216 -151 216 -149Q216 -127 232.5 -105.5Q249 -84 284 -66Q293 -62 293 -51Q293 -40 283 -45Q228 -74 202.5 -108.5Q177 -143 177 -174Q177 -219 225.5 -251.5Q274 -284 364 -284H541Q557 -284 588.5 -291.0Q620 -298 653.0 -311.5Q686 -325 709.5 -343.5Q733 -362 733 -386Q733 -399 724 -414Q722 -417 722 -421Q722 -427 727 -427Q731 -427 734 -422Q749 -400 749 -377Q749 -350 729.5 -327.0Q710 -304 677.0 -286.5Q644 -269 603.5 -260.0Q563 -251 521 -252Q540 -236 549.0 -216.0Q558 -196 558 -174Q558 -137 536.0 -98.5Q514 -60 474.0 -27.5Q434 5 380.5 25.0Q327 45 263 45ZM417 -355Q450 -355 450 -368Q450 -373 441.5 -378.5Q433 -384 419 -385Q413 -386 399.0 -386.0Q385 -386 369.5 -386.0Q354 -386 344 -386Q369 -355 417 -355Z"
        />
      </g>
      </g>

      {/* laurel sprig, lower left, clear of the lockup */}
      <g stroke="none">
        <path d="M52 158C45 143 42 129 45 114" fill="none" stroke="var(--gold)"
          strokeWidth="1.8" strokeLinecap="round" />
        <path d="M47 147c-6-1-11-5-13-11 7-1 12 2 14 7z" />
        <path d="M45 135c-6-2-10-7-11-13 7 0 12 3 13 9z" />
        <path d="M44 123c-5-3-8-8-8-14 6 1 10 5 10 11z" />
        <path d="M53 151c6-2 10-6 12-12-7-1-12 2-14 8z" />
        <path d="M50 139c6-2 10-7 11-13-7 0-12 3-13 9z" />
      </g>
    </g>
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

function SectionHead({ eyebrow, title, wide }) {
  return (
    <header className={"sec-head" + (wide ? " sec-head-wide" : "")}>
      {eyebrow ? <p className="sec-eyebrow">{eyebrow}</p> : null}
      <div className="sec-rule" aria-hidden="true">
        <span />
        <i />
        <span />
      </div>
      <h2 className="serif sec-title">{title}</h2>
    </header>
  );
}

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
  const [lang, setLang] = useState("nl");
  const [menuOpen, setMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [introOpening, setIntroOpening] = useState(false);
  const [envelopeIn, setEnvelopeIn] = useState(false);
  const [mistClearing, setMistClearing] = useState(false);
  const [mistFlown, setMistFlown] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [open, setOpen] = useState(null);

  const closeMenu = () => setMenuOpen(false);
  const c = COPY[lang];

  const openInvitation = () => {
    if (introOpening) return;
    setIntroOpening(true);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setIntroDone(true), reduced ? 600 : 2150);
  };

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Dutch is the default; only switch when the browser clearly asks for English.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("taal");
      if (stored === "nl" || stored === "en") {
        setLang(stored);
        return;
      }
    } catch (e) {
      // storage unavailable, fall through to browser detection
    }
    const nav = typeof navigator !== "undefined" ? navigator.language || "" : "";
    if (nav.toLowerCase().startsWith("en")) setLang("en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("taal", lang);
    } catch (e) {
      // not fatal, the choice simply is not remembered
    }
  }, [lang]);

  // The one line set in Great Vibes holds back until the face is there.
  useEffect(() => {
    let cancelled = false;
    const fonts =
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve();
    const cap = new Promise((res) => window.setTimeout(res, 1500));
    Promise.race([fonts, cap]).then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The cloud bank parts almost immediately and the doves ride it out.
  useEffect(() => {
    if (introDone) return;
    let cancelled = false;
    let flown = 0;

    // Part the cloud only once the sky behind it can actually be painted,
    // otherwise the reveal lands on an empty gradient and pops in later.
    const sky = new Image();
    sky.src = IMG.hemel;
    const decoded = sky.decode
      ? sky.decode().catch(() => {})
      : new Promise((res) => {
          sky.onload = res;
          sky.onerror = res;
        });
    const cap = new Promise((res) => window.setTimeout(res, 1200));

    Promise.race([decoded, cap]).then(() => {
      if (cancelled) return;
      setMistClearing(true);
      // The last dove leaves at 380ms delay plus a 2200ms flight, so it is
      // clear of the frame before anything fades it out.
      flown = window.setTimeout(() => setMistFlown(true), 2600);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(flown);
    };
  }, [introDone]);

  // The title lands first, the envelope arrives a beat later.
  useEffect(() => {
    if (introDone) return;
    // The seal is drawn from outlines, so it needs no font. Only the
    // calligraphic line does, and that waits on its own below.
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

          <p className={"opener-invite" + (envelopeIn && fontsReady ? " arrived" : "")}>
            You&rsquo;re cordially invited
          </p>

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
                aria-label={c.sealLabel}
              >
                <WaxSeal />
              </button>
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
                {sec[lang]}
              </a>
            ))}
          </nav>
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

          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="nav-panel"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <IconMenu open={menuOpen} />
            <span className="sr-only">{menuOpen ? c.menuClose : c.menuOpen}</span>
          </button>
        </div>
        <div id="nav-panel" className={"nav-panel" + (menuOpen ? " open" : "")}>
          <div>
            <nav className="nav-panel-links">
              {SECTIONS.map((sec) => (
                <a key={sec.id} href={"#" + sec.id} onClick={closeMenu}>
                  {sec[lang]}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-bg" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <img
                className="hero-monogram"
                src={IMG.logoCompact}
                width="539"
                height="701"
                alt=""
              />
              <div className="hero-title">
                <h1 className="serif hero-names">
                  Nyarayek <span className="hero-amp">&amp;</span> Sten&rsquo;s
                </h1>
                <p className="serif hero-sub">Wedding</p>
              </div>
              <p className="hero-date">{c.date}</p>
              <a className="btn hero-btn" href="#agenda">
                {c.heroBtn}
              </a>
            </div>

            <div className="hero-frames">
              <figure className="hero-frame frame-a">
                <img src={IMG.couple} alt={c.coupleAlt} />
              </figure>
              <figure className="hero-frame frame-b">
                <img src={IMG.verloving} alt={c.ringAlt} />
              </figure>
            </div>
          </div>
        </section>

        <section id="over" className="sec">
          <div className="wrap">
            <p className="serif intro">
{c.story}
            </p>
            <div className="panel facts">
              <p className="sec-eyebrow">{c.factsEyebrow}</p>
              <div className="sec-rule" aria-hidden="true">
                <span />
                <i />
                <span />
              </div>
              <h3 className="serif card-title">{c.factsTitle}</h3>

              <Fact icon={<IconTime />}>{c.date}</Fact>
              <Fact icon={<IconMap />}>{c.venue}</Fact>
              <Fact icon={<IconDress />}>{c.dress}</Fact>
              <Fact icon={<IconGift />}>
                {c.gift}
                <span className="fact-inline">
                  <IconEnvelope size={18} />
                </span>
              </Fact>
            </div>
          </div>
        </section>

        <section id="agenda" className="sec">
          <div className="wrap">
<SectionHead eyebrow={c.agendaEyebrow} title={SECTIONS[1][lang]} />
            <div className="timeline">
              {TIMELINE.map((item, i) => (
                <div className="tl-item" key={i}>
                  <span className="tl-marker" aria-hidden="true">
                    <i />
                  </span>
                  <span className="tl-time">{item.time}</span>
                  <span className="tl-title serif">{item[lang].title}</span>
                  <a className="tl-where" href={item.map} target="_blank" rel="noreferrer">
                    <span className="tl-pin">
                      <IconMap />
                    </span>
                    <span className="meta">{item[lang].location}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec-tight">
          <div className="wrap">
            <a
              className="panel card"
              href="https://www.koonings.com/inspiratie/dresscode-tenue-de-ville/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="card-text">
                <p className="sec-eyebrow">{c.dressLabel}</p>
                <div className="sec-rule" aria-hidden="true">
                  <span />
                  <i />
                  <span />
                </div>
                <h3 className="serif card-title">{c.dressTitle}</h3>
                <figure className="card-img">
                  <img src={IMG.dresscode} alt={c.dressAlt} />
                </figure>
                <p className="link-u">{c.dressLink}</p>
              </div>
            </a>
          </div>
        </section>

        <section id="locatie" className="sec">
          <div className="wrap">
<SectionHead eyebrow={SECTIONS[2][lang]} title={c.travelTitle} wide />
            <div className="tabs">
              <div className="tab-img">
                <img src={TABS[tab].image} alt={TABS[tab][lang].title} />
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
                    <div className="tab-title">{t[lang].title}</div>
                    <p className="prose">{t[lang].body}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="sec">
          <div className="wrap">
<SectionHead eyebrow={c.faqEyebrow} title={SECTIONS[3][lang]} />
            <div className="faq">
              {FAQ.map((item, i) => (
                <div className={"faq-row" + (open === i ? " open" : "")} key={i}>
                  <button
                    className="faq-btn"
                    aria-expanded={open === i}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <span className="faq-n">{item.n}</span>
                    <span className="faq-q">{item[lang].q}</span>
                    <span className="faq-icon"><IconPlus /></span>
                  </button>
                  <div className="faq-panel">
                    <div>
                      <div className="faq-inner">
                        <p className="prose">{item[lang].a}</p>
                        {item.link && (
                          <a className="link-u" href={item.link} target="_blank" rel="noreferrer">
                            {lang === "en" && item.linkTextEn ? item.linkTextEn : item.linkText}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="contact">
              <p className="serif contact-lead">{c.contactLead}</p>
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
              {sec[lang]}
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
