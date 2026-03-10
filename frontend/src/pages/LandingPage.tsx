import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import HeroOrb from '../components/3d/HeroOrb';
import HeartbeatECG from '../components/3d/HeartbeatECG';

// ---- Scroll reveal hook ----
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-8');
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
};

// ---- Data ----
const services = [
  { icon: '\uD83D\uDD2C', title: 'Pre-consultation IA', desc: "Decrivez vos symptomes et recevez une orientation medicale intelligente avant votre rendez-vous.", tag: 'Populaire', color: 'blue', featured: true },
  { icon: '\uD83D\uDCC5', title: 'Prise de rendez-vous', desc: "Reservez en ligne en quelques clics avec le specialiste de votre choix, selon ses disponibilites.", color: 'cyan' },
  { icon: '\uD83D\uDCCA', title: 'Suivi medical', desc: "Historique complet, resultats d'analyses, ordonnances et rappels de traitement en un seul endroit.", color: 'green' },
  { icon: '\uD83D\uDCAC', title: 'Messagerie securisee', desc: "Echangez directement avec votre medecin traitant via notre messagerie chiffree de bout en bout.", color: 'purple' },
  { icon: '\uD83D\uDCC2', title: 'Dossier patient', desc: "Accedez a votre dossier medical complet, partagez-le en toute securite avec vos praticiens.", color: 'blue' },
  { icon: '\uD83D\uDD12', title: 'Securite & confidentialite', desc: "Vos donnees sont chiffrees et hebergees sur des serveurs certifies HDS conformes RGPD.", color: 'cyan' },
];

const team = [
  { initials: 'DN', name: 'Dr. Ndiaye', role: 'Medecine generale', dispo: "Disponible aujourd'hui", variant: 'from-primary-500 to-primary-700' },
  { initials: 'SF', name: 'Dr. Sow-Fall', role: 'Cardiologie', dispo: 'Disponible demain', variant: 'from-sky-500 to-sky-700' },
  { initials: 'AD', name: 'Dr. Aissatou Diop', role: 'Dermatologie', dispo: "Disponible aujourd'hui", variant: 'from-purple-500 to-purple-700' },
  { initials: 'MB', name: 'Dr. Moussa Ba', role: 'Pediatrie', dispo: 'Prochaine dispo : Lundi', variant: 'from-amber-500 to-amber-700' },
];

const steps = [
  { num: '1', title: 'Decrivez vos symptomes', desc: "Remplissez notre formulaire de pre-consultation intelligent guide par l'IA." },
  { num: '2', title: 'Choisissez votre specialiste', desc: "L'IA vous oriente vers le bon praticien. Reservez le creneau qui vous convient." },
  { num: '3', title: 'Consultez & suivez', desc: 'Consultation en ligne ou en clinique, puis suivi personnalise depuis votre espace.' },
];

const testimonials = [
  { stars: 5, quote: "La pre-consultation m'a fait gagner un temps precieux. Le medecin avait deja toutes les infos a mon arrivee.", name: 'Aminata S.', since: 'Patiente depuis 2024' },
  { stars: 5, quote: "Interface claire et rapide. J'ai pu prendre un rendez-vous en cardiologie en moins de 2 minutes.", name: 'Ibrahima D.', since: 'Patient depuis 2023' },
  { stars: 4, quote: "Le suivi apres ma consultation etait impeccable. Rappels de medicaments, resultats en ligne... tout y est.", name: 'Fatou M.', since: 'Patiente depuis 2024' },
];

const iconColors: Record<string, string> = {
  blue: 'bg-primary-100 text-primary-600',
  cyan: 'bg-sky-100 text-sky-700',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
};

// ---- Component ----
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased overflow-x-hidden">
      <PublicNavbar />

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-28 pb-20 bg-gradient-to-br from-primary-50 via-gray-50 to-sky-50 overflow-hidden">
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600/5 border border-primary-600/10 rounded-full text-xs font-medium text-primary-600 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Plateforme medicale nouvelle generation
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-5">
            Votre sante,<br />notre <span className="text-primary-600">priorite</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md leading-relaxed mb-9">
            Consultez nos specialistes en ligne ou en clinique. Pre-consultation intelligente,
            prise de rendez-vous instantanee, suivi medical personnalise.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/preconsultation"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30 inline-flex items-center gap-2"
            >
              Pre-consultation <span>&rarr;</span>
            </Link>
            <Link
              to="/appointments/new"
              className="px-8 py-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md inline-flex items-center gap-2"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
        {/* Hero 3D orb */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[90%] pointer-events-none z-0 hidden md:block">
          <HeroOrb />
        </div>
      </section>

      {/* ========== STATS GLASS CARDS ========== */}
      <section className="relative -mt-20 z-10 flex justify-center px-6">
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { num: '12k+', label: 'Patients suivis' },
            { num: '35', label: 'Specialistes' },
            { num: '98%', label: 'Satisfaction' },
            { num: '15', label: 'Specialites' },
          ].map((s) => (
            <Reveal key={s.label}>
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl px-7 py-8 min-w-[180px] text-center shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-600/10 hover:bg-white/75 transition-all">
                <div className="text-3xl font-extrabold text-primary-600 tracking-tight">{s.num}</div>
                <div className="text-xs text-gray-500 mt-1.5 font-medium">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section id="services" className="py-24 px-6 md:px-12 bg-white">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Nos services</div>
          <Reveal><h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Tout pour votre parcours de soin</h2></Reveal>
          <Reveal><p className="text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed">De la pre-consultation au suivi post-traitement, notre plateforme couvre chaque etape.</p></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {services.map((s) => (
            <Reveal key={s.title}>
              <div className={`rounded-2xl border p-9 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-600/20 ${
                s.featured ? 'border-primary-600/20 bg-gradient-to-br from-primary-50 to-gray-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 ${iconColors[s.color]}`}>
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                {s.tag && (
                  <span className="inline-block mt-3 px-3 py-1 bg-primary-600/8 rounded-full text-[0.7rem] font-semibold text-primary-600 uppercase tracking-wide">
                    {s.tag}
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== ECG NEON TRANSITION ========== */}
      <HeartbeatECG />

      {/* ========== EQUIPE ========== */}
      <section id="equipe" className="py-24 px-6 md:px-12 bg-gray-50">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Notre equipe</div>
          <Reveal><h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Des specialistes a votre ecoute</h2></Reveal>
          <Reveal><p className="text-gray-500 mt-3 max-w-lg mx-auto">Une equipe pluridisciplinaire dediee a votre bien-etre.</p></Reveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {team.map((t) => (
            <Reveal key={t.name}>
              <div className="bg-white border border-gray-200 rounded-2xl p-9 text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-600/15">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${t.variant} mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}>
                  {t.initials}
                </div>
                <h4 className="font-bold tracking-tight mb-1">{t.name}</h4>
                <div className="text-sm text-primary-600 font-medium mb-2">{t.role}</div>
                <div className="text-xs text-green-600 font-medium">&#9679; {t.dispo}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== PROCESSUS ========== */}
      <section id="processus" className="py-24 px-6 md:px-12 bg-white">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Comment ca marche</div>
          <Reveal><h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">3 etapes simples</h2></Reveal>
        </div>
        <div className="flex flex-col md:flex-row gap-10 max-w-4xl mx-auto relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-9 left-20 right-20 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />
          {steps.map((s) => (
            <Reveal key={s.num} className="flex-1 text-center relative z-10">
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center text-2xl font-extrabold mx-auto mb-5 shadow-lg shadow-primary-600/25">
                {s.num}
              </div>
              <h4 className="font-bold tracking-tight mb-2">{s.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== TEMOIGNAGES ========== */}
      <section id="temoignages" className="py-24 px-6 md:px-12 bg-gray-50">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Temoignages</div>
          <Reveal><h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ce que disent nos patients</h2></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <Reveal key={t.name}>
              <div className="bg-white border border-gray-200 rounded-2xl p-9 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="text-amber-400 text-sm mb-3 tracking-widest">
                  {'\u2605'.repeat(t.stars)}{'\u2606'.repeat(5 - t.stars)}
                </div>
                <blockquote className="text-sm text-gray-600 leading-relaxed italic mb-4">
                  "{t.quote}"
                </blockquote>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-gray-500">{t.since}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="relative bg-gray-900 py-24 px-6 text-center overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.15),transparent_70%)] -top-52 left-1/2 -translate-x-1/2" />
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight relative z-10">
          Pret a prendre soin de vous ?
        </h2>
        <p className="text-slate-400 text-lg mb-10 relative z-10">
          Accedez a votre espace patient et commencez votre parcours de soin en ligne.
        </p>
        <Link
          to="/login"
          className="relative z-10 inline-flex items-center gap-2 px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white text-base font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30"
        >
          Acceder a mon espace &rarr;
        </Link>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 border-t border-white/5 px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-xl font-bold text-white">
          Medi<span className="text-primary-400 font-normal">Consult</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {['Services', 'Equipe', 'Processus', 'Temoignages'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
              {l}
            </a>
          ))}
          <Link to="/confidentialite" className="text-sm text-slate-400 hover:text-white transition-colors">Confidentialite</Link>
          <Link to="/mentions-legales" className="text-sm text-slate-400 hover:text-white transition-colors">Mentions legales</Link>
        </div>
        <div className="text-xs text-slate-600">&copy; 2025 MediConsult. Tous droits reserves.</div>
      </footer>
    </div>
  );
};

export default LandingPage;