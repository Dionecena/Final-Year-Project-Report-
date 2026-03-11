import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  { title: 'Pré-consultation IA', desc: "Décrivez vos symptômes et recevez une orientation médicale intelligente avant votre rendez-vous.", tag: 'Populaire', color: 'blue', featured: true },
  { title: 'Prise de rendez-vous', desc: "Réservez en ligne en quelques clics avec le spécialiste de votre choix, selon ses disponibilités.", color: 'cyan' },
  { title: 'Suivi médical', desc: "Historique complet, résultats d'analyses, ordonnances et rappels de traitement en un seul endroit.", color: 'green' },
  { title: 'Messagerie sécurisée', desc: "Échangez directement avec votre médecin traitant via notre messagerie chiffrée de bout en bout.", color: 'purple' },
  { title: 'Dossier patient', desc: "Accédez à votre dossier médical complet, partagez-le en toute sécurité avec vos praticiens.", color: 'blue' },
  { title: 'Sécurité & confidentialité', desc: "Vos données sont chiffrées et hébergées sur des serveurs certifiés HDS conformes RGPD.", color: 'cyan' },
];

const team = [
  { initials: 'DN', name: 'Dr. Ndiaye', role: 'Médecine générale', dispo: "Disponible aujourd'hui", variant: 'from-primary-500 to-primary-700' },
  { initials: 'SF', name: 'Dr. Sow-Fall', role: 'Cardiologie', dispo: 'Disponible demain', variant: 'from-sky-500 to-sky-700' },
  { initials: 'AD', name: 'Dr. Aissatou Diop', role: 'Dermatologie', dispo: "Disponible aujourd'hui", variant: 'from-purple-500 to-purple-700' },
  { initials: 'MB', name: 'Dr. Moussa Ba', role: 'Pédiatrie', dispo: 'Prochaine dispo : Lundi', variant: 'from-amber-500 to-amber-700' },
];

const steps = [
  { num: '1', title: 'Décrivez vos symptômes', desc: "Remplissez notre formulaire de pré-consultation intelligent guidé par l'IA." },
  { num: '2', title: 'Choisissez votre spécialiste', desc: "L'IA vous oriente vers le bon praticien. Réservez le créneau qui vous convient." },
  { num: '3', title: 'Consultez & suivez', desc: 'Consultation en ligne ou en clinique, puis suivi personnalisé depuis votre espace.' },
];

const testimonials = [
  { stars: 5, quote: "La pré-consultation m'a fait gagner un temps précieux. Le médecin avait déjà toutes les infos à mon arrivée.", name: 'Aminata S.', since: 'Patiente depuis 2024' },
  { stars: 5, quote: "Interface claire et rapide. J'ai pu prendre un rendez-vous en cardiologie en moins de 2 minutes.", name: 'Ibrahima D.', since: 'Patient depuis 2023' },
  { stars: 4, quote: "Le suivi après ma consultation était impeccable. Rappels de médicaments, résultats en ligne... tout y est.", name: 'Fatou M.', since: 'Patiente depuis 2024' },
  { stars: 5, quote: "L'expérience utilisateur est remarquable. Tout est fluide, du premier clic jusqu'au compte-rendu final.", name: 'Ousmane K.', since: 'Patient depuis 2024' },
  { stars: 5, quote: "Grâce à MediConsult, j'ai enfin trouvé un dermatologue disponible rapidement. Service exceptionnel.", name: 'Mariama B.', since: 'Patiente depuis 2023' },
];

// SVG icons for services (replacing emoji)
const serviceIcons: Record<string, React.ReactNode> = {
  'Pré-consultation IA': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.59.659H9.06a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V5.846a2.25 2.25 0 00-1.35-2.064A48.11 48.11 0 0012 3c-2.392 0-4.744.175-7.043.513A2.25 2.25 0 003.5 5.846V14.5" /></svg>
  ),
  'Prise de rendez-vous': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
  ),
  'Suivi médical': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
  ),
  'Messagerie sécurisée': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
  ),
  'Dossier patient': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
  ),
  'Sécurité & confidentialité': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
  ),
};

const iconColors: Record<string, string> = {
  blue: 'bg-primary-100 text-primary-600',
  cyan: 'bg-sky-100 text-sky-700',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
};

// ---- Testimonial Carousel Hook ----
const useCarousel = (total: number, interval = 5000) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, interval);
  }, [total, interval]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const goTo = useCallback((idx: number) => {
    stop();
    setCurrent(idx);
    start();
  }, [stop, start]);

  return { current, goTo };
};

// ---- Legal Modal Component ----
const LegalModal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] mx-4 bg-gray-950 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Content */}
        <div className="overflow-y-auto p-6 text-slate-300 space-y-8 legal-modal-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

// ---- Component ----
const LandingPage: React.FC = () => {
  const { current: activeTestimonial, goTo: goToTestimonial } = useCarousel(testimonials.length, 5000);
  const [showConfidentialite, setShowConfidentialite] = useState(false);
  const [showMentionsLegales, setShowMentionsLegales] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased overflow-x-hidden">
      <PublicNavbar />

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 md:px-12 pt-28 pb-20 bg-gradient-to-br from-primary-50 via-gray-50 to-sky-50 overflow-hidden">
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600/5 border border-primary-600/10 rounded-full text-xs font-medium text-primary-600 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Plateforme médicale nouvelle génération
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-5">
            Votre santé,<br />notre <span className="text-primary-600">priorité</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md leading-relaxed mb-9">
            Consultez nos spécialistes en ligne ou en clinique. Pré-consultation intelligente,
            prise de rendez-vous instantanée, suivi médical personnalisé.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/app/appointments/new"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30 inline-flex items-center gap-2"
            >
              Prendre rendez-vous &rarr;
            </Link>
            <Link
              to="/app/preconsultation"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md inline-flex items-center gap-2"
            >
              Pré-consultation IA
            </Link>
          </div>
        </div>
        {/* Hero 3D orb – full-screen animated background on mobile, positioned right on desktop */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-30 md:inset-auto md:right-0 md:top-1/2 md:-translate-y-1/2 md:w-1/2 md:h-[90%] md:opacity-100">
          <HeroOrb />
        </div>
      </section>

      {/* ========== STATS GLASS CARDS ========== */}
      <section className="relative -mt-20 z-10 flex justify-center px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6">
          {[
            { num: '12k+', label: 'Patients suivis' },
            { num: '35', label: 'Spécialistes' },
            { num: '98%', label: 'Satisfaction' },
            { num: '15', label: 'Spécialités' },
          ].map((s) => (
            <Reveal key={s.label}>
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl px-5 sm:px-7 py-6 sm:py-8 min-w-0 sm:min-w-[160px] text-center shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-600/10 hover:bg-white/75 transition-all">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary-600 tracking-tight">{s.num}</div>
                <div className="text-xs text-gray-500 mt-1.5 font-medium">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white">
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Nos services</div>
          <Reveal><h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Tout pour votre parcours de soin</h2></Reveal>
          <Reveal><p className="text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">De la pré-consultation au suivi post-traitement, notre plateforme couvre chaque étape de votre expérience de santé.</p></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
          {services.map((s) => (
            <Reveal key={s.title}>
              <div className={`rounded-2xl border p-6 sm:p-8 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-600/20 ${
                s.featured ? 'border-primary-600/20 bg-gradient-to-br from-primary-50 to-gray-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconColors[s.color]}`}>
                  {serviceIcons[s.title]}
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                {s.tag && (
                  <span className="inline-block mt-3 px-3 py-1 bg-primary-600/10 rounded-full text-[0.7rem] font-semibold text-primary-600 uppercase tracking-wide">
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
      <section id="equipe" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-gray-50">
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Notre équipe</div>
          <Reveal><h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Des spécialistes à votre écoute</h2></Reveal>
          <Reveal><p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm sm:text-base">Une équipe pluridisciplinaire dédiée à votre bien-être.</p></Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {team.map((t) => (
            <Reveal key={t.name}>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary-600/15">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${t.variant} mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white text-xl sm:text-2xl font-bold`}>
                  {t.initials}
                </div>
                <h4 className="font-bold tracking-tight mb-1 text-sm sm:text-base">{t.name}</h4>
                <div className="text-xs sm:text-sm text-primary-600 font-medium mb-2">{t.role}</div>
                <div className="text-xs text-green-600 font-medium">&#9679; {t.dispo}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== PROCESSUS ========== */}
      <section id="processus" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-white">
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Comment ça marche</div>
          <Reveal><h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">3 étapes simples</h2></Reveal>
        </div>
        <div className="flex flex-col md:flex-row gap-8 sm:gap-10 max-w-4xl mx-auto relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-9 left-20 right-20 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />
          {steps.map((s) => (
            <Reveal key={s.num} className="flex-1 text-center relative z-10">
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center text-xl sm:text-2xl font-extrabold mx-auto mb-4 sm:mb-5 shadow-lg shadow-primary-600/25">
                {s.num}
              </div>
              <h4 className="font-bold tracking-tight mb-2 text-sm sm:text-base">{s.title}</h4>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== TEMOIGNAGES - CARROUSEL AUTO ========== */}
      <section id="temoignages" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-gray-50">
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Témoignages</div>
          <Reveal><h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Ce que disent nos patients</h2></Reveal>
        </div>

        {/* Desktop: grille 3 colonnes */}
        <div className="hidden md:grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.slice(0, 3).map((t) => (
            <Reveal key={t.name}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="text-amber-400 text-sm mb-3 tracking-widest">
                  {'\u2605'.repeat(t.stars)}{'\u2606'.repeat(5 - t.stars)}
                </div>
                <blockquote className="text-sm text-gray-600 leading-relaxed italic mb-4">
                  \"{t.quote}\"
                </blockquote>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-gray-500">{t.since}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile: carrousel auto-scroll */}
        <div className="md:hidden max-w-sm mx-auto">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.name} className="w-full flex-shrink-0 px-1">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="text-amber-400 text-sm mb-3 tracking-widest">
                      {'\u2605'.repeat(t.stars)}{'\u2606'.repeat(5 - t.stars)}
                    </div>
                    <blockquote className="text-sm text-gray-600 leading-relaxed italic mb-4">
                      \"{t.quote}\"
                    </blockquote>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.since}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeTestimonial
                    ? 'bg-primary-600 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Témoignage ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="relative bg-gray-900 py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.15),transparent_70%)] -top-52 left-1/2 -translate-x-1/2" />
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight relative z-10">
          Prêt à prendre soin de vous ?
        </h2>
        <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10 relative z-10">
          Accédez à votre espace patient et commencez votre parcours de soin en ligne.
        </p>
        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          <Link
            to="/app/appointments/new"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-600 hover:bg-primary-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30"
          >
            Prendre rendez-vous &rarr;
          </Link>
          <Link
            to="/app/preconsultation"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm sm:text-base font-semibold rounded-xl transition-all hover:-translate-y-0.5"
          >
            Pré-consultation IA
          </Link>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 border-t border-white/5 px-4 sm:px-6 md:px-12 py-10 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="text-xl font-bold text-white">
              Medi<span className="text-primary-400 font-normal">Consult</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
              <a href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">Services</a>
              <a href="#equipe" className="text-sm text-slate-400 hover:text-white transition-colors">Équipe</a>
              <a href="#processus" className="text-sm text-slate-400 hover:text-white transition-colors">Processus</a>
              <a href="#temoignages" className="text-sm text-slate-400 hover:text-white transition-colors">Témoignages</a>
            </div>
          </div>

          {/* Contact + legal */}
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
              <a
                href="mailto:contact@mediconsult.com"
                className="text-slate-400 hover:text-white transition-colors"
              >
                contact@mediconsult.com
              </a>
              <button onClick={() => setShowConfidentialite(true)} className="text-slate-400 hover:text-white transition-colors">Confidentialit&eacute;</button>
              <button onClick={() => setShowMentionsLegales(true)} className="text-slate-400 hover:text-white transition-colors">Mentions l&eacute;gales</button>
            </div>
            <div className="text-xs text-slate-600">&copy; 2025 MediConsult. Tous droits réservés.</div>
          </div>
        </div>
      </footer>

      {/* ========== MODAL CONFIDENTIALITE ========== */}
      <LegalModal open={showConfidentialite} onClose={() => setShowConfidentialite(false)} title="Politique de Confidentialit&eacute;">
        <p className="text-slate-400 text-xs">Derni&egrave;re mise &agrave; jour : Mars 2025</p>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">1. Introduction</h3>
          <p className="leading-relaxed text-sm">
            MediConsult s&rsquo;engage &agrave; prot&eacute;ger la vie priv&eacute;e de ses utilisateurs.
            La pr&eacute;sente politique de confidentialit&eacute; d&eacute;crit les types de donn&eacute;es
            personnelles que nous collectons, la mani&egrave;re dont nous les utilisons, les stockons
            et les prot&eacute;geons, conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la
            Protection des Donn&eacute;es (RGPD) et &agrave; la r&eacute;glementation fran&ccedil;aise en
            vigueur relative aux donn&eacute;es de sant&eacute;.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">2. Responsable du traitement</h3>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1 text-sm">
            <p><span className="text-white font-medium">Raison sociale :</span> MediConsult SAS</p>
            <p><span className="text-white font-medium">Adresse :</span> 12 Rue de la Sant&eacute;, 75013 Paris, France</p>
            <p><span className="text-white font-medium">Email :</span> dpo@mediconsult.com</p>
            <p><span className="text-white font-medium">DPO :</span> dpo@mediconsult.com</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">3. Donn&eacute;es collect&eacute;es</h3>
          <p className="leading-relaxed text-sm mb-3">
            Dans le cadre de nos services de t&eacute;l&eacute;m&eacute;decine et de pr&eacute;-consultation IA,
            nous collectons les cat&eacute;gories suivantes :
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Donn\u00e9es d\'identit\u00e9', items: 'Nom, pr\u00e9nom, date de naissance, email, t\u00e9l\u00e9phone' },
              { title: 'Donn\u00e9es de sant\u00e9', items: 'Sympt\u00f4mes, historique m\u00e9dical, r\u00e9sultats pr\u00e9-consultation IA, ordonnances' },
              { title: 'Donn\u00e9es de connexion', items: 'Adresse IP, navigateur, pages visit\u00e9es, dur\u00e9e de session' },
              { title: 'Donn\u00e9es de paiement', items: 'Informations de facturation (via prestataire s\u00e9curis\u00e9)' },
            ].map((cat) => (
              <div key={cat.title} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <h4 className="text-white font-medium text-sm mb-1">{cat.title}</h4>
                <p className="text-xs text-slate-400">{cat.items}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">4. Finalit&eacute;s du traitement</h3>
          <ul className="space-y-1.5 text-sm">
            {[
              'Fournir nos services de t\u00e9l\u00e9m\u00e9decine et de pr\u00e9-consultation IA',
              'G\u00e9rer votre compte utilisateur et vos rendez-vous',
              'Am\u00e9liorer la qualit\u00e9 de nos services',
              'Respecter nos obligations l\u00e9gales et r\u00e9glementaires',
              'Assurer la s\u00e9curit\u00e9 de la plateforme',
              'Envoyer des communications relatives \u00e0 vos rendez-vous',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">5. Base l&eacute;gale du traitement</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-white font-medium">Traitement</th>
                  <th className="text-left p-3 text-white font-medium">Base l&eacute;gale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="p-3">Services de t&eacute;l&eacute;m&eacute;decine</td><td className="p-3">Ex&eacute;cution du contrat</td></tr>
                <tr><td className="p-3">Donn&eacute;es de sant&eacute;</td><td className="p-3">Consentement explicite (art. 9 RGPD)</td></tr>
                <tr><td className="p-3">S&eacute;curit&eacute; de la plateforme</td><td className="p-3">Int&eacute;r&ecirc;t l&eacute;gitime</td></tr>
                <tr><td className="p-3">Obligations l&eacute;gales</td><td className="p-3">Obligation l&eacute;gale</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">6. Dur&eacute;e de conservation</h3>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" /><span><span className="text-white font-medium">Donn&eacute;es de sant&eacute; :</span> 20 ans (Code de la sant&eacute; publique)</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" /><span><span className="text-white font-medium">Donn&eacute;es de compte :</span> 3 ans apr&egrave;s derni&egrave;re activit&eacute;</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" /><span><span className="text-white font-medium">Donn&eacute;es de connexion :</span> 12 mois</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" /><span><span className="text-white font-medium">Donn&eacute;es de paiement :</span> 10 ans (pi&egrave;ces comptables)</span></li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">7. S&eacute;curit&eacute; des donn&eacute;es</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: '\uD83D\uDD12', text: 'Chiffrement TLS + AES-256' },
              { icon: '\uD83C\uDFE5', text: 'H\u00e9bergement certifi\u00e9 HDS' },
              { icon: '\uD83D\uDD10', text: 'Authentification s\u00e9curis\u00e9e' },
              { icon: '\uD83D\uDCCB', text: 'Audits de s\u00e9curit\u00e9 r\u00e9guliers' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">8. Cookies</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-3 text-white font-medium">Type</th>
                  <th className="text-left p-3 text-white font-medium">Finalit&eacute;</th>
                  <th className="text-left p-3 text-white font-medium">Dur&eacute;e</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="p-3">Essentiels</td><td className="p-3">Authentification, s&eacute;curit&eacute;</td><td className="p-3">Session</td></tr>
                <tr><td className="p-3">Fonctionnels</td><td className="p-3">Pr&eacute;f&eacute;rences</td><td className="p-3">12 mois</td></tr>
                <tr><td className="p-3">Analytiques</td><td className="p-3">Am&eacute;lioration du service</td><td className="p-3">13 mois</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">9. Vos droits</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { right: 'Droit d\'acc\u00e8s', desc: 'Obtenir une copie de vos donn\u00e9es' },
              { right: 'Droit de rectification', desc: 'Corriger des donn\u00e9es inexactes' },
              { right: 'Droit \u00e0 l\'effacement', desc: 'Demander la suppression' },
              { right: 'Droit \u00e0 la portabilit\u00e9', desc: 'R\u00e9cup\u00e9rer vos donn\u00e9es' },
              { right: 'Droit d\'opposition', desc: 'Vous opposer au traitement' },
              { right: 'Retrait du consentement', desc: 'Retirer votre consentement \u00e0 tout moment' },
            ].map((item) => (
              <div key={item.right} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <h4 className="text-white font-medium text-sm mb-1">{item.right}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-primary-900/20 border border-primary-500/20 rounded-xl p-3 text-sm">
            Contact DPO : <a href="mailto:dpo@mediconsult.com" className="text-primary-400 hover:underline">dpo@mediconsult.com</a>
            &nbsp;|&nbsp; CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">www.cnil.fr</a>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">10. Transferts de donn&eacute;es</h3>
          <p className="leading-relaxed text-sm">
            Vos donn&eacute;es sont h&eacute;berg&eacute;es en France (HDS). Aucun transfert de donn&eacute;es
            de sant&eacute; hors UE. Si un transfert vers un pays tiers devait &ecirc;tre n&eacute;cessaire,
            il serait encadr&eacute; par les clauses contractuelles types de la Commission europ&eacute;enne.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">11. Modifications</h3>
          <p className="leading-relaxed text-sm">
            Nous pouvons modifier cette politique &agrave; tout moment. Toute modification substantielle
            vous sera notifi&eacute;e par email ou via la plateforme.
          </p>
        </section>
      </LegalModal>

      {/* ========== MODAL MENTIONS LEGALES ========== */}
      <LegalModal open={showMentionsLegales} onClose={() => setShowMentionsLegales(false)} title="Mentions L&eacute;gales">
        <p className="text-slate-400 text-xs">Derni&egrave;re mise &agrave; jour : Mars 2025</p>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">1. &Eacute;diteur du site</h3>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1 text-sm">
            <p><span className="text-white font-medium">Raison sociale :</span> MediConsult SAS</p>
            <p><span className="text-white font-medium">Forme juridique :</span> SAS</p>
            <p><span className="text-white font-medium">Capital social :</span> 10 000 &euro;</p>
            <p><span className="text-white font-medium">Si&egrave;ge social :</span> 12 Rue de la Sant&eacute;, 75013 Paris</p>
            <p><span className="text-white font-medium">RCS :</span> Paris B 123 456 789</p>
            <p><span className="text-white font-medium">TVA :</span> FR 12 123456789</p>
            <p><span className="text-white font-medium">Directeur de publication :</span> Dr. Sophie Martin</p>
            <p><span className="text-white font-medium">Email :</span> <a href="mailto:contact@mediconsult.com" className="text-primary-400 hover:underline">contact@mediconsult.com</a></p>
            <p><span className="text-white font-medium">T&eacute;l. :</span> +33 1 23 45 67 89</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">2. H&eacute;bergeur</h3>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1 text-sm">
            <p><span className="text-white font-medium">Raison sociale :</span> OVHcloud</p>
            <p><span className="text-white font-medium">Adresse :</span> 2 Rue Kellermann, 59100 Roubaix</p>
            <p><span className="text-white font-medium">T&eacute;l. :</span> +33 9 72 10 10 07</p>
            <p><span className="text-white font-medium">Certification :</span> HDS</p>
            <p><span className="text-white font-medium">Site :</span> <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">www.ovhcloud.com</a></p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">3. Activit&eacute; r&eacute;glement&eacute;e</h3>
          <p className="leading-relaxed text-sm mb-3">
            MediConsult est une plateforme de t&eacute;l&eacute;m&eacute;decine permettant la mise en relation
            de patients avec des professionnels de sant&eacute; inscrits aux ordres comp&eacute;tents.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-sm">
            <p>M&eacute;decins inscrits au <span className="text-white font-medium">CNOM</span>, autoris&eacute;s t&eacute;l&eacute;m&eacute;decine (art. L.6316-1 CSP).</p>
            <p>Plateforme conforme &agrave; la <span className="text-white font-medium">PGSSI-S</span>.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">4. Propri&eacute;t&eacute; intellectuelle</h3>
          <p className="leading-relaxed text-sm">
            L&rsquo;ensemble du contenu (textes, images, logo, logiciels, bases de donn&eacute;es) est
            prot&eacute;g&eacute; par le droit d&rsquo;auteur. Toute reproduction sans autorisation
            &eacute;crite est interdite.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">5. Responsabilit&eacute;</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-white font-medium text-sm mb-1">5.1 Informations m&eacute;dicales</h4>
              <p className="text-sm">Les r&eacute;sultats de la pr&eacute;-consultation IA sont informatifs et ne constituent pas un diagnostic. Ils ne remplacent pas une consultation m&eacute;dicale.</p>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm mb-1">5.2 Disponibilit&eacute;</h4>
              <p className="text-sm">Nous visons une disponibilit&eacute; 24/7 mais des interruptions de maintenance peuvent survenir.</p>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm mb-1">5.3 Liens hypertextes</h4>
              <p className="text-sm">MediConsult d&eacute;cline toute responsabilit&eacute; quant au contenu des sites externes.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">6. Conditions d&rsquo;utilisation</h3>
          <ul className="space-y-1.5 text-sm">
            {[
              'Fournir des informations exactes lors de l\'inscription',
              'Ne pas usurper l\'identit\u00e9 d\'un tiers',
              'Utiliser la plateforme conform\u00e9ment \u00e0 sa finalit\u00e9 m\u00e9dicale',
              'Ne pas acc\u00e9der aux donn\u00e9es d\'autres utilisateurs',
              'Respecter les professionnels de sant\u00e9',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">7. Droit applicable</h3>
          <p className="leading-relaxed text-sm">
            Les pr&eacute;sentes sont r&eacute;gies par le droit fran&ccedil;ais. En cas de litige,
            les tribunaux de Paris seront comp&eacute;tents.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">8. M&eacute;diation</h3>
          <p className="leading-relaxed text-sm">
            Tout consommateur peut recourir gratuitement &agrave; un m&eacute;diateur (art. L.611-1 Code
            de la consommation) : <a href="mailto:mediation@mediconsult.com" className="text-primary-400 hover:underline">mediation@mediconsult.com</a>.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-white mb-2">9. Contact</h3>
          <div className="bg-primary-900/20 border border-primary-500/20 rounded-xl p-4 text-sm space-y-1">
            <p><span className="text-white font-medium">Email :</span> <a href="mailto:contact@mediconsult.com" className="text-primary-400 hover:underline">contact@mediconsult.com</a></p>
            <p><span className="text-white font-medium">Courrier :</span> MediConsult SAS &mdash; 12 Rue de la Sant&eacute;, 75013 Paris</p>
            <p><span className="text-white font-medium">T&eacute;l. :</span> +33 1 23 45 67 89</p>
          </div>
        </section>
      </LegalModal>
    </div>
  );
};

export default LandingPage;