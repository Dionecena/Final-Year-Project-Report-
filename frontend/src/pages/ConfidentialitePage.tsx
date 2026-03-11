import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const ConfidentialitePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-slate-300">
      <PublicNavbar />

      {/* Hero header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-primary-900/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Politique de Confidentialit&eacute;
          </h1>
          <p className="text-slate-400 text-sm">
            Derni&egrave;re mise &agrave; jour : Mars 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="px-4 sm:px-6 md:px-12 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p className="leading-relaxed">
              MediConsult s&rsquo;engage &agrave; prot&eacute;ger la vie priv&eacute;e de ses utilisateurs.
              La pr&eacute;sente politique de confidentialit&eacute; d&eacute;crit les types de donn&eacute;es
              personnelles que nous collectons, la mani&egrave;re dont nous les utilisons, les stockons
              et les prot&eacute;geons, conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la
              Protection des Donn&eacute;es (RGPD) et &agrave; la r&eacute;glementation fran&ccedil;aise en
              vigueur relative aux donn&eacute;es de sant&eacute;.
            </p>
          </section>

          {/* 2. Responsable du traitement */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Responsable du traitement</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-1 text-sm">
              <p><span className="text-white font-medium">Raison sociale :</span> MediConsult SAS</p>
              <p><span className="text-white font-medium">Adresse :</span> 12 Rue de la Sant&eacute;, 75013 Paris, France</p>
              <p><span className="text-white font-medium">Email :</span> dpo@mediconsult.com</p>
              <p><span className="text-white font-medium">D&eacute;l&eacute;gu&eacute; &agrave; la protection des donn&eacute;es (DPO) :</span> dpo@mediconsult.com</p>
            </div>
          </section>

          {/* 3. Données collectées */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Donn&eacute;es collect&eacute;es</h2>
            <p className="leading-relaxed mb-4">
              Dans le cadre de nos services de t&eacute;l&eacute;m&eacute;decine et de pr&eacute;-consultation IA,
              nous sommes amen&eacute;s &agrave; collecter les cat&eacute;gories de donn&eacute;es suivantes :
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Donn\u00e9es d\'identit\u00e9',
                  items: 'Nom, pr\u00e9nom, date de naissance, adresse email, num\u00e9ro de t\u00e9l\u00e9phone',
                },
                {
                  title: 'Donn\u00e9es de sant\u00e9',
                  items: 'Sympt\u00f4mes d\u00e9clar\u00e9s, historique m\u00e9dical, r\u00e9sultats de pr\u00e9-consultation IA, ordonnances',
                },
                {
                  title: 'Donn\u00e9es de connexion',
                  items: 'Adresse IP, type de navigateur, pages visit\u00e9es, dur\u00e9e de session',
                },
                {
                  title: 'Donn\u00e9es de paiement',
                  items: 'Informations de facturation (trait\u00e9es par notre prestataire de paiement s\u00e9curis\u00e9)',
                },
              ].map((cat) => (
                <div key={cat.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-medium text-sm mb-1">{cat.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">{cat.items}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Finalités du traitement */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Finalit&eacute;s du traitement</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Fournir nos services de t\u00e9l\u00e9m\u00e9decine et de pr\u00e9-consultation IA',
                'G\u00e9rer votre compte utilisateur et vos rendez-vous',
                'Am\u00e9liorer la qualit\u00e9 de nos services et de notre plateforme',
                'Respecter nos obligations l\u00e9gales et r\u00e9glementaires',
                'Assurer la s\u00e9curit\u00e9 de la plateforme et pr\u00e9venir les fraudes',
                'Vous envoyer des communications relatives \u00e0 vos rendez-vous (rappels, suivis)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Base légale */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Base l&eacute;gale du traitement</h2>
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

          {/* 6. Durée de conservation */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Dur&eacute;e de conservation</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span><span className="text-white font-medium">Donn&eacute;es de sant&eacute; :</span> 20 ans &agrave; compter du dernier acte m&eacute;dical (conform&eacute;ment au Code de la sant&eacute; publique)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span><span className="text-white font-medium">Donn&eacute;es de compte :</span> 3 ans apr&egrave;s la derni&egrave;re activit&eacute; sur le compte</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span><span className="text-white font-medium">Donn&eacute;es de connexion :</span> 12 mois</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span><span className="text-white font-medium">Donn&eacute;es de paiement :</span> dur&eacute;e l&eacute;gale de conservation des pi&egrave;ces comptables (10 ans)</span>
              </li>
            </ul>
          </section>

          {/* 7. Sécurité */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. S&eacute;curit&eacute; des donn&eacute;es</h2>
            <p className="leading-relaxed mb-4">
              Nous mettons en &oelig;uvre des mesures techniques et organisationnelles appropri&eacute;es
              pour garantir la s&eacute;curit&eacute; de vos donn&eacute;es :
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: '🔒', text: 'Chiffrement des donn\u00e9es en transit (TLS) et au repos (AES-256)' },
                { icon: '🏥', text: 'H\u00e9bergement certifi\u00e9 HDS (H\u00e9bergeur de Donn\u00e9es de Sant\u00e9)' },
                { icon: '🔐', text: 'Authentification s\u00e9curis\u00e9e et contr\u00f4le d\'acc\u00e8s strict' },
                { icon: '📋', text: 'Audits de s\u00e9curit\u00e9 r\u00e9guliers et tests d\'intrusion' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Cookies</h2>
            <p className="leading-relaxed mb-4">
              Notre site utilise des cookies pour assurer son bon fonctionnement et am&eacute;liorer
              votre exp&eacute;rience.
            </p>
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
                  <tr><td className="p-3">Fonctionnels</td><td className="p-3">Pr&eacute;f&eacute;rences utilisateur</td><td className="p-3">12 mois</td></tr>
                  <tr><td className="p-3">Analytiques</td><td className="p-3">Am&eacute;lioration du service</td><td className="p-3">13 mois</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 9. Vos droits */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Vos droits</h2>
            <p className="leading-relaxed mb-4">
              Conform&eacute;ment au RGPD, vous disposez des droits suivants :
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { right: 'Droit d\'acc\u00e8s', desc: 'Obtenir une copie de vos donn\u00e9es personnelles' },
                { right: 'Droit de rectification', desc: 'Corriger des donn\u00e9es inexactes ou incompl\u00e8tes' },
                { right: 'Droit \u00e0 l\'effacement', desc: 'Demander la suppression de vos donn\u00e9es (sous r\u00e9serve des obligations l\u00e9gales)' },
                { right: 'Droit \u00e0 la portabilit\u00e9', desc: 'R\u00e9cup\u00e9rer vos donn\u00e9es dans un format structur\u00e9' },
                { right: 'Droit d\'opposition', desc: 'Vous opposer au traitement de vos donn\u00e9es' },
                { right: 'Droit de retrait du consentement', desc: 'Retirer votre consentement \u00e0 tout moment' },
              ].map((item) => (
                <div key={item.right} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-medium text-sm mb-1">{item.right}</h3>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-primary-900/20 border border-primary-500/20 rounded-xl p-4 text-sm">
              <p>
                Pour exercer vos droits, contactez notre DPO &agrave; l&rsquo;adresse{' '}
                <a href="mailto:dpo@mediconsult.com" className="text-primary-400 hover:underline">dpo@mediconsult.com</a>.
                Vous pouvez &eacute;galement introduire une r&eacute;clamation aupr&egrave;s de la CNIL
                (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">www.cnil.fr</a>).
              </p>
            </div>
          </section>

          {/* 10. Transferts */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Transferts de donn&eacute;es</h2>
            <p className="leading-relaxed">
              Vos donn&eacute;es sont h&eacute;berg&eacute;es en France m&eacute;tropolitaine chez un h&eacute;bergeur
              certifi&eacute; HDS. Aucun transfert de donn&eacute;es de sant&eacute; n&rsquo;est effectu&eacute;
              en dehors de l&rsquo;Union Europ&eacute;enne. Si un transfert vers un pays tiers
              devait &ecirc;tre n&eacute;cessaire pour d&rsquo;autres donn&eacute;es, il serait encadr&eacute;
              par les clauses contractuelles types de la Commission europ&eacute;enne.
            </p>
          </section>

          {/* 11. Modifications */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Modifications de la politique</h2>
            <p className="leading-relaxed">
              Nous nous r&eacute;servons le droit de modifier cette politique de confidentialit&eacute;
              &agrave; tout moment. Toute modification substantielle vous sera notifi&eacute;e par email
              ou via une notification sur la plateforme. La date de derni&egrave;re mise &agrave; jour
              est indiqu&eacute;e en haut de cette page.
            </p>
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

export default ConfidentialitePage;
