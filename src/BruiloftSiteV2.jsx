import { useState } from "react";

const IMG = {
  logoIcon: "/images/logo-icoon.png",
  logoCompact: "/images/logo-compact.png",
  logoFull: "/images/logo-volledig.png",
  couple: "/images/bruidspaar.jpg",
  amstelkerkTuin: "/images/amstelkerk-tuin.webp",
  amstelkerk: "/images/amstelkerk-exterieur.webp",
  urbanusBuiten: "/images/urbanuskerk-exterieur.jpg",
  urbanusBinnen: "/images/urbanuskerk-interieur.jpg",
  dresscode: "/images/dresscode.jpg",
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
    a: "Je kunt met eigen vervoer, zoals de auto of fiets.\n\nOpenbaar vervoer: direct naast de kerk is er bushalte Zwarte Pad. Hier pak je lijn 171 tot Amstelveen busstation en stap je over op lijn 356 tot halte Ouderkerk West. Vanaf hier is het 8 minuten lopen naar de Amstelkerk.\n\nHeb je geen vervoer? Laat het ons dan weten via het formulier.",
    linkText: "Route van Bovenkerk naar Ouderkerk",
    link: "https://www.google.com/maps/dir/St.+Urbanuskerk,+Noorddammerlaan+126,+1187+AG+Amstelveen/Amstelkerk,+Kerkstraat+11,+1191+JB+Ouderkerk+aan+de+Amstel/",
  },
  {
    n: "04",
    q: "Wat als ik toch moet afzeggen?",
    a: "Laat ons dit dan tijdig weten.",
    linkText: "Mail ons",
    link: "mailto:bruiloft@flii.nl",
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
.bruiloft img{display:block;width:100%;max-width:100%;}
.bruiloft a{color:inherit;text-decoration:none;}
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
.hero-monogram{width:5.5rem;height:auto;margin-bottom:calc(var(--space-2) * -1);}
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
.card-img img{border-radius:6px;}

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

.nav{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.9);
  backdrop-filter:blur(8px);border-bottom:1px solid var(--shade-2);}
.nav-in{display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);
  padding:var(--space-2) var(--space-3);max-width:72rem;margin:0 auto;}
.nav-links{display:flex;gap:var(--space-3);}
.nav-links a{font-size:1rem;font-weight:500;transition:opacity 200ms ease;}
.nav-links a:hover{opacity:0.6;}
.nav-logo{width:2.75rem;}

.footer{margin-top:var(--space-6);background:var(--brand);border-radius:10px 10px 0 0;
  padding:var(--space-5) var(--space-3);text-align:center;}
.footer-logo{width:10rem;margin:0 auto var(--space-4);}
.footer-nav{display:flex;flex-wrap:wrap;justify-content:center;gap:var(--space-3);margin-bottom:var(--space-3);}
.footer-nav a{font-size:1rem;transition:opacity 200ms ease;}
.footer-nav a:hover{opacity:0.6;}
.footer-names{font-weight:600;margin-bottom:var(--space-2);}
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
  const [open, setOpen] = useState(null);

  return (
    <div className="bruiloft">
      <style>{CSS}</style>

      <header className="nav">
        <div className="nav-in">
          <a href="#top">
            <img className="nav-logo" src={IMG.logoIcon} alt="Nya en Sten" />
          </a>
          <nav className="nav-links">
            <a href="#over">Over</a>
            <a href="#agenda">Agenda</a>
            <a href="#locatie">Locatie</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-bg" />
          <div className="wrap hero-inner">
            <img className="hero-monogram" src={IMG.logoCompact} alt="" />
            <p className="label hero-eyebrow">Uitnodiging bruiloft</p>
            <h1 className="serif hero-names">Sten &amp; Nyarayek</h1>
            <p className="hero-date">Zaterdag 19 september 2026</p>
            <a className="btn" href="#agenda">Bekijk de dag</a>
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
        <img className="footer-logo" src={IMG.logoFull} alt="" />
        <nav className="footer-nav">
          <a href="#over">Invite</a>
          <a href="#agenda">Agenda trouwdag</a>
          <a href="#locatie">Vervoer</a>
          <a href="#faq">FAQ</a>
        </nav>
        <p className="footer-names">Nya en Sten</p>
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
