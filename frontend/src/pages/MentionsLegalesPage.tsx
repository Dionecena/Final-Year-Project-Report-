import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const MentionsLegalesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-slate-300">
      <PublicNavbar />

      {/* Hero header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-primary-900/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Mentions L&eacute;gales
          </h1>
          <p className="text-slate-400 text-sm">
            Derni&egrave;re mise &agrave; jour : Mars 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="px-4 sm:px-6 md:px-12 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* 1. Éditeur du site */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. &Eacute;diteur du site</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-1 text-sm">
              <p><span className="text-white font-medium">Raison sociale :</span> MediConsult SAS</p>
              <p><span className="text-white font-medium">Forme juridique :</span> Soci&eacute;t&eacute; par Actions Simplifi&eacute;e (SAS)</p>
              <p><span className="text-white font-medium">Capital social :</span> 10 000 &euro;</p>
              <p><span className="text-white font-medium">Si&egrave;ge social :</span> 12 Rue de la Sant&eacute;, 75013 Paris, France</p>
              <p><span className="text-white font-medium">RCS :</span> Paris B 123 456 789</p>
              <p><span className="text-white font-medium">N&deg; TVA intracommunautaire :</span> FR 12 123456789</p>
              <p><span className="text-white font-medium">Directeur de la publication :</span> Dr. Sophie Martin, Pr&eacute;sidente</p>
              <p><span className="text-white font-medium">Email :</span> <a href="mailto:contact@mediconsult.com" className="text-primary-400 hover:underline">contact@mediconsult.com</a></p>
              <p><span className="text-white font-medium">T&eacute;l&eacute;phone :</span> +33 1 23 45 67 89</p>
            </div>
          </section>

          {/* 2. Hébergeur */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. H&eacute;bergeur</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-1 text-sm">
              <p><span className="text-white font-medium">Raison sociale :</span> OVHcloud</p>
              <p><span className="text-white font-medium">Adresse :</span> 2 Rue Kellermann, 59100 Roubaix, France</p>
              <p><span className="text-white font-medium">T&eacute;l&eacute;phone :</span> +33 9 72 10 10 07</p>
              <p><span className="text-white font-medium">Certification :</span> H&eacute;bergeur de Donn&eacute;es de Sant&eacute; (HDS)</p>
              <p><span className="text-white font-medium">Site web :</span> <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">www.ovhcloud.com</a></p>
            </div>
          </section>

          {/* 3. Activité réglementée */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Activit&eacute; r&eacute;glement&eacute;e</h2>
            <p className="leading-relaxed mb-4">
              MediConsult est une plateforme de t&eacute;l&eacute;m&eacute;decine permettant la mise en relation
              de patients avec des professionnels de sant&eacute; inscrits aux ordres professionnels comp&eacute;tents.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-2 text-sm">
              <p>
                Les m&eacute;decins exer&ccedil;ant sur la plateforme sont inscrits au
                <span className="text-white font-medium"> Conseil National de l&rsquo;Ordre des M&eacute;decins (CNOM)</span>
                et autoris&eacute;s &agrave; pratiquer la t&eacute;l&eacute;m&eacute;decine conform&eacute;ment aux
                articles L.6316-1 et suivants du Code de la sant&eacute; publique.
              </p>
              <p>
                La plateforme est conforme aux exigences de la
                <span className="text-white font-medium"> Politique G&eacute;n&eacute;rale de S&eacute;curit&eacute; des Syst&egrave;mes d&rsquo;Information de Sant&eacute; (PGSSI-S)</span>.
              </p>
            </div>
          </section>

          {/* 4. Propriété intellectuelle */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Propri&eacute;t&eacute; intellectuelle</h2>
            <p className="leading-relaxed">
              L&rsquo;ensemble du contenu de ce site (textes, images, graphismes, logo, ic&ocirc;nes,
              vid&eacute;os, logiciels, bases de donn&eacute;es) est prot&eacute;g&eacute; par le droit
              d&rsquo;auteur et le droit de la propri&eacute;t&eacute; intellectuelle, tant en France
              qu&rsquo;&agrave; l&rsquo;&eacute;tranger. Toute reproduction, repr&eacute;sentation, modification,
              publication ou adaptation totale ou partielle de ces &eacute;l&eacute;ments, quel que soit
              le moyen ou le proc&eacute;d&eacute; utilis&eacute;, est interdite sans l&rsquo;autorisation
              &eacute;crite pr&eacute;alable de MediConsult SAS.
            </p>
          </section>

          {/* 5. Responsabilité */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Responsabilit&eacute;</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium text-sm mb-2">5.1 Informations m&eacute;dicales</h3>
                <p className="leading-relaxed text-sm">
                  Les informations fournies par le module de pr&eacute;-consultation IA ont un caract&egrave;re
                  purement informatif et ne constituent en aucun cas un diagnostic m&eacute;dical.
                  Elles ne sauraient se substituer &agrave; une consultation avec un professionnel de sant&eacute;.
                  MediConsult d&eacute;cline toute responsabilit&eacute; en cas d&rsquo;utilisation des
                  r&eacute;sultats de la pr&eacute;-consultation IA comme base exclusive de d&eacute;cision m&eacute;dicale.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium text-sm mb-2">5.2 Disponibilit&eacute; du service</h3>
                <p className="leading-relaxed text-sm">
                  MediConsult s&rsquo;efforce d&rsquo;assurer la disponibilit&eacute; de la plateforme 24h/24
                  et 7j/7. Toutefois, l&rsquo;acc&egrave;s peut &ecirc;tre temporairement suspendu pour
                  des raisons de maintenance, de mise &agrave; jour ou de force majeure. MediConsult
                  ne pourra &ecirc;tre tenue responsable des dommages r&eacute;sultant d&rsquo;une
                  indisponibilit&eacute; du service.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium text-sm mb-2">5.3 Liens hypertextes</h3>
                <p className="leading-relaxed text-sm">
                  Le site peut contenir des liens vers des sites externes. MediConsult n&rsquo;exerce
                  aucun contr&ocirc;le sur ces sites et d&eacute;cline toute responsabilit&eacute; quant
                  &agrave; leur contenu.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Conditions d'utilisation */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Conditions d&rsquo;utilisation</h2>
            <p className="leading-relaxed mb-4">
              L&rsquo;utilisation de la plateforme MediConsult implique l&rsquo;acceptation pleine et
              enti&egrave;re des pr&eacute;sentes mentions l&eacute;gales. L&rsquo;utilisateur s&rsquo;engage &agrave; :
            </p>
            <ul className="space-y-2 text-sm">
              {[
                'Fournir des informations exactes et compl\u00e8tes lors de son inscription',
                'Ne pas usurper l\'identit\u00e9 d\'un tiers',
                'Utiliser la plateforme conform\u00e9ment \u00e0 sa finalit\u00e9 m\u00e9dicale',
                'Ne pas tenter d\'acc\u00e9der aux donn\u00e9es d\'autres utilisateurs',
                'Respecter les professionnels de sant\u00e9 et les autres utilisateurs',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 7. Droit applicable */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Droit applicable et juridiction</h2>
            <p className="leading-relaxed">
              Les pr&eacute;sentes mentions l&eacute;gales sont r&eacute;gies par le droit fran&ccedil;ais.
              En cas de litige, et apr&egrave;s tentative de r&eacute;solution amiable, les tribunaux
              de Paris seront seuls comp&eacute;tents.
            </p>
          </section>

          {/* 8. Médiation */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. M&eacute;diation</h2>
            <p className="leading-relaxed">
              Conform&eacute;ment aux articles L.611-1 et suivants du Code de la consommation,
              tout consommateur a le droit de recourir gratuitement &agrave; un m&eacute;diateur
              de la consommation en vue de la r&eacute;solution amiable d&rsquo;un litige.
              Le m&eacute;diateur comp&eacute;tent peut &ecirc;tre contact&eacute; &agrave; l&rsquo;adresse
              suivante : <a href="mailto:mediation@mediconsult.com" className="text-primary-400 hover:underline">mediation@mediconsult.com</a>.
            </p>
          </section>

          {/* 9. Contact */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <div className="bg-primary-900/20 border border-primary-500/20 rounded-xl p-5 text-sm space-y-2">
              <p>
                Pour toute question relative aux pr&eacute;sentes mentions l&eacute;gales ou au
                fonctionnement de la plateforme, vous pouvez nous contacter :
              </p>
              <p>
                <span className="text-white font-medium">Email :</span>{' '}
                <a href="mailto:contact@mediconsult.com" className="text-primary-400 hover:underline">contact@mediconsult.com</a>
              </p>
              <p>
                <span className="text-white font-medium">Courrier :</span> MediConsult SAS &mdash; 12 Rue de la Sant&eacute;, 75013 Paris
              </p>
              <p>
                <span className="text-white font-medium">T&eacute;l&eacute;phone :</span> +33 1 23 45 67 89
              </p>
            </div>
          </section>

          {/* Back link */}
          <div className="pt-6 border-t border-white/10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              &larr; Retour &agrave; l&rsquo;accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentionsLegalesPage;
