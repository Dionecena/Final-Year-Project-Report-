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
  { title: 'Pr\u00e9-consultation IA', desc: "D\u00e9crivez vos sympt\u00f4mes et recevez une orientation m\u00e9dicale intelligente avant votre rendez-vous.", tag: 'Populaire', color: 'blue', featured: true },
  { title: 'Prise de rendez-vous', desc: "R\u00e9servez en ligne en quelques clics avec le sp\u00e9cialiste de votre choix, selon ses disponibilit\u00e9s.", color: 'cyan' },
  { title: 'Suivi m\u00e9dical', desc: "Historique complet, r\u00e9sultats d'analyses, ordonnances et rappels de traitement en un seul endroit.", color: 'green' },
  { title: 'Messagerie s\u00e9curis\u00e9e', desc: "\u00c9changez directement avec votre m\u00e9decin traitant via notre messagerie chiffr\u00e9e de bout en bout.", color: 'purple' },
  { title: 'Dossier patient', desc: "Acc\u00e9dez \u00e0 votre dossier m\u00e9dical complet, partagez-le en toute s\u00e9curit\u00e9 avec vos praticiens.", color: 'blue' },
  { title: 'S\u00e9curit\u00e9 & confidentialit\u00e9', desc: "Vos donn\u00e9es sont chiffr\u00e9es et h\u00e9berg\u00e9es sur des serveurs certifi\u00e9s HDS conformes RGPD.", color: 'cyan' },
];

const team = [
  { initials: 'DN', name: 'Dr. Ndiaye', role: 'M\u00e9decine g\u00e9n\u00e9rale', dispo: "Disponible aujourd'hui", variant: 'from-primary-500 to-primary-700' },
  { initials: 'SF', name: 'Dr. Sow-Fall', role: 'Cardiologie', dispo: 'Disponible demain', variant: 'from-sky-500 to-sky-700' },
  { initials: 'AD', name: 'Dr. Aissatou Diop', role: 'Dermatologie', dispo: "Disponible aujourd'hui", variant: 'from-purple-500 to-purple-700' },
  { initials: 'MB', name: 'Dr. Moussa Ba', role: 'P\u00e9diatrie', dispo: 'Prochaine dispo : Lundi', variant: 'from-amber-500 to-amber-700' },
];

const steps = [
  { num: '1', title: 'D\u00e9crivez vos sympt\u00f4mes', desc: "Remplissez notre formulaire de pr\u00e9-consultation intelligent guid\u00e9 par l'IA." },
  { num: '2', title: 'Choisissez votre sp\u00e9cialiste', desc: "L'IA vous oriente vers le bon praticien. R\u00e9servez le cr\u00e9neau qui vous convient." },
  { num: '3', title: 'Consultez & suivez', desc: 'Consultation en ligne ou en clinique, puis suivi personnalis\u00e9 depuis votre espace.' },
];

const testimonials = [
  { stars: 5, quote: "La pr\u00e9-consultation m'a fait gagner un temps pr\u00e9cieux. Le m\u00e9decin avait d\u00e9j\u00e0 toutes les infos \u00e0 mon arriv\u00e9e.", name: 'Aminata S.', since: 'Patiente depuis 2024' },
  { stars: 5, quote: "Interface claire et rapide. J'ai pu prendre un rendez-vous en cardiologie en moins de 2 minutes.", name: 'Ibrahima D.', since: 'Patient depuis 2023' },
  { stars: 4, quote: "Le suivi apr\u00e8s ma consultation \u00e9tait impeccable. Rappels de m\u00e9dicaments, r\u00e9sultats en ligne... tout y est.", name: 'Fatou M.', since: 'Patiente depuis 2024' },
  { stars: 5, quote: "L'exp\u00e9rience utilisateur est remarquable. Tout est fluide, du premier clic jusqu'au compte-rendu final.", name: 'Ousmane K.', since: 'Patient depuis 2024' },
  { stars: 5, quote: "Gr\u00e2ce \u00e0 MediConsult, j'ai enfin trouv\u00e9 un dermatologue disponible rapidement. Service exceptionnel.", name: 'Mariama B.', since: 'Patiente depuis 2023' },
];

// SVG icons for services (replacing emoji)
const serviceIcons: Record<string, React.ReactNode> = {
  'Pr\u00e9-consultation IA': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.59.659H9.06a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V5.846a2.25 2.25 0 00-1.35-2.064A48.11 48.11 0 0012 3c-2.392 0-4.744.175-7.043.513A2.25 2.25 0 003.5 5.846V14.5" /></svg>
  ),
  'Prise de rendez-vous': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
  ),
  'Suivi m\u00e9dical': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
  ),
  'Messagerie s\u00e9curis\u00e9e': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
  ),
  'Dossier patient': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
  ),
  'S\u00e9curit\u00e9 & confidentialit\u00e9': (
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

// ---- Component ----
const LandingPage: React.FC = () => {
  const { current: activeTestimonial, goTo: goToTestimonial } = useCarousel(testimonials.length, 5000);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased overflow-x-hidden">
      <PublicNavbar />

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 md:px-12 pt-28 pb-20 bg-gradient-to-br from-primary-50 via-gray-50 to-sky-50 overflow-hidden">
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600/5 border border-primary-600/10 rounded-full text-xs font-medium text-primary-600 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Plateforme m\u00e9dicale nouvelle g\u00e9n\u00e9ration
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight mb-5">
            Votre sant\u00e9,<br />notre <span className="text-primary-600">priorit\u00e9</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-md leading-relaxed mb-9">
            Consultez nos sp\u00e9cialistes en ligne ou en clinique. Pr\u00e9-consultation intelligente,
            prise de rendez-vous instantan\u00e9e, suivi m\u00e9dical personnalis\u00e9.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30 inline-flex items-center gap-2"
            >
              Commencer &rarr;
            </Link>
            <Link
              to="/login"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-900 text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md inline-flex items-center gap-2"
            >
              Se connecter
            </Link>
          </div>
        </div>
        {/* Hero 3D orb */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[90%] pointer-events-none z-0 hidden md:block">
          <HeroOrb />
        </div>
      </section>

      {/* ========== STATS GLASS CARDS ========== */}
      <section className="relative -mt-20 z-10 flex justify-center px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-6">
          {[
            { num: '12k+', label: 'Patients suivis' },
            { num: '35', label: 'Sp\u00e9cialistes' },
            { num: '98%', label: 'Satisfaction' },
            { num: '15', label: 'Sp\u00e9cialit\u00e9s' },
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
          <Reveal><p className="text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">De la pr\u00e9-consultation au suivi post-traitement, notre plateforme couvre chaque \u00e9tape de votre exp\u00e9rience de sant\u00e9.</p></Reveal>
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
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Notre \u00e9quipe</div>
          <Reveal><h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Des sp\u00e9cialistes \u00e0 votre \u00e9coute</h2></Reveal>
          <Reveal><p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm sm:text-base">Une \u00e9quipe pluridisciplinaire d\u00e9di\u00e9e \u00e0 votre bien-\u00eatre.</p></Reveal>
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
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">Comment \u00e7a marche</div>
          <Reveal><h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">3 \u00e9tapes simples</h2></Reveal>
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
          <div className="text-xs font-semibold uppercase tracking-widest text-primary-600 mb-2">T\u00e9moignages</div>
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
                aria-label={`T\u00e9moignage ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="relative bg-gray-900 py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.15),transparent_70%)] -top-52 left-1/2 -translate-x-1/2" />
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight relative z-10">
          Pr\u00eat \u00e0 prendre soin de vous ?
        </h2>
        <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10 relative z-10">
          Acc\u00e9dez \u00e0 votre espace patient et commencez votre parcours de soin en ligne.
        </p>
        <Link
          to="/register"
          className="relative z-10 inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-primary-600 hover:bg-primary-700 text-white text-sm sm:text-base font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30"
        >
          Cr\u00e9er mon compte &rarr;
        </Link>
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
              <a href="#equipe" className="text-sm text-slate-400 hover:text-white transition-colors">\u00c9quipe</a>
              <a href="#processus" className="text-sm text-slate-400 hover:text-white transition-colors">Processus</a>
              <a href="#temoignages" className="text-sm text-slate-400 hover:text-white transition-colors">T\u00e9moignages</a>
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
              <Link to="/confidentialite" className="text-slate-400 hover:text-white transition-colors">Confidentialit\u00e9</Link>
              <Link to="/mentions-legales" className="text-slate-400 hover:text-white transition-colors">Mentions l\u00e9gales</Link>
            </div>
            <div className="text-xs text-slate-600">&copy; 2025 MediConsult. Tous droits r\u00e9serv\u00e9s.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;