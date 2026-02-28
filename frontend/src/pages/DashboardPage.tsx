import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Dashboard Patient
  if (user.role === 'patient') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Bienvenue, {user.name} 👋
        </h1>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/preconsultation"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Préconsultation</h3>
                <p className="text-sm text-gray-500">Décrivez vos symptômes</p>
              </div>
            </div>
          </Link>

          <Link
            to="/appointments"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Mes Rendez-vous</h3>
                <p className="text-sm text-gray-500">Voir et gérer mes RDV</p>
              </div>
            </div>
          </Link>

          <Link
            to="/doctors"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Nos Médecins</h3>
                <p className="text-sm text-gray-500">Consulter la liste</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Info card */}
        <div className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white">
          <h3 className="text-lg font-semibold mb-2">💡 Comment ça marche ?</h3>
          <ol className="list-decimal list-inside space-y-1 text-primary-100">
            <li>Remplissez le questionnaire de préconsultation (facultatif)</li>
            <li>Notre algorithme vous suggère le spécialiste adapté</li>
            <li>Choisissez un créneau disponible</li>
            <li>Recevez la confirmation par email</li>
          </ol>
        </div>
      </div>
    );
  }

  // Dashboard Médecin
  if (user.role === 'doctor') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Bonjour Dr. {user.name} 👨‍⚕️
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">RDV aujourd'hui</p>
                <p className="text-3xl font-bold text-gray-900">—</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Patients ce mois</p>
                <p className="text-3xl font-bold text-gray-900">—</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Préconsultations reçues</p>
                <p className="text-3xl font-bold text-gray-900">—</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/schedule" className="card hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📅 Mon Planning</h3>
            <p className="text-sm text-gray-500">Gérer mes créneaux de disponibilité</p>
          </Link>
          <Link to="/appointments" className="card hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Mes Rendez-vous</h3>
            <p className="text-sm text-gray-500">Voir les rendez-vous à venir</p>
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard Admin / Secrétaire
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tableau de bord {user.role === 'admin' ? 'Administrateur' : 'Secrétaire'} 🏥
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500">Total Patients</p>
          <p className="text-3xl font-bold text-gray-900">—</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total Médecins</p>
          <p className="text-3xl font-bold text-gray-900">—</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">RDV ce mois</p>
          <p className="text-3xl font-bold text-gray-900">—</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Taux préconsultation</p>
          <p className="text-3xl font-bold text-gray-900">—%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.role === 'admin' && (
          <>
            <Link to="/users" className="card hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">👥 Gestion Utilisateurs</h3>
              <p className="text-sm text-gray-500">Ajouter, modifier, bloquer des comptes</p>
            </Link>
            <Link to="/specialties" className="card hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🏥 Gestion Spécialités</h3>
              <p className="text-sm text-gray-500">Gérer les services médicaux</p>
            </Link>
            <Link to="/audit-logs" className="card hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Logs & Audit</h3>
              <p className="text-sm text-gray-500">Traçabilité des actions</p>
            </Link>
          </>
        )}
        <Link to="/appointments" className="card hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📅 Rendez-vous</h3>
          <p className="text-sm text-gray-500">Gérer les demandes de rendez-vous</p>
        </Link>
        <Link to="/doctors" className="card hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">👨‍⚕️ Médecins</h3>
          <p className="text-sm text-gray-500">Liste et plannings des médecins</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
