import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface DashboardStats {
  pending_appointments: number;
  confirmed_today: number;
  total_today: number;
  total_patients: number;
  total_doctors: number;
  cancelled_today: number;
  weekly_appointments: number;
}

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  reason: string;
  notes: string | null;
  patient: { id: number; name: string; email: string; phone?: string } | null;
  doctor: { id: number; name: string; email: string } | null;
  specialty: { id: number; name: string } | null;
}

const SecretaryDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [togglingBooking, setTogglingBooking] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, appointmentsRes, bookingRes] = await Promise.all([
        api.get('/secretary/dashboard'),
        api.get('/secretary/pending-appointments'),
        api.get('/online-booking-status'),
      ]);
      setStats(statsRes.data);
      setPendingAppointments(appointmentsRes.data);
      setOnlineBooking(bookingRes.data.online_booking_enabled);
    } catch (error) {
      console.error('Erreur chargement dashboard secrétaire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBooking = async () => {
    try {
      setTogglingBooking(true);
      const res = await api.post('/secretary/toggle-online-booking', {
        enabled: !onlineBooking,
      });
      setOnlineBooking(res.data.online_booking_enabled);
    } catch (error) {
      console.error('Erreur toggle booking:', error);
    } finally {
      setTogglingBooking(false);
    }
  };

  const handleValidate = async (id: number) => {
    try {
      await api.patch(`/secretary/appointments/${id}/validate`);
      fetchData();
    } catch (error) {
      console.error('Erreur validation:', error);
    }
  };

  const handleReject = async (id: number) => {
    const reason = window.prompt('Motif du rejet (obligatoire) :');
    if (!reason || reason.trim() === '') return;
    try {
      await api.patch(`/secretary/appointments/${id}/reject`, {
        rejection_reason: reason,
      });
      fetchData();
    } catch (error) {
      console.error('Erreur rejet:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Espace Secrétaire</h1>
          <p className="text-gray-500 mt-1">Gestion des rendez-vous et du planning</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">RDV en ligne :</span>
          <button
            onClick={handleToggleBooking}
            disabled={togglingBooking}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              onlineBooking ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                onlineBooking ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${onlineBooking ? 'text-green-600' : 'text-red-600'}`}>
            {onlineBooking ? 'Activé' : 'Désactivé'}
          </span>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending_appointments}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmés aujourd'hui</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed_today}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total aujourd'hui</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total_today}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cette semaine</p>
                <p className="text-3xl font-bold text-purple-600">{stats.weekly_appointments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rendez-vous en attente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Rendez-vous en attente ({pendingAppointments.length})
          </h2>
          <Link
            to="/app/secretary/appointments"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Voir tout &rarr;
          </Link>
        </div>

        {pendingAppointments.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Aucun rendez-vous en attente</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingAppointments.slice(0, 10).map((apt) => (
              <div key={apt.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {apt.patient?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apt.patient?.name || 'Patient inconnu'}</p>
                      <p className="text-sm text-gray-500">
                        {apt.date} à {apt.time} — {apt.specialty?.name || 'Spécialité N/A'}
                      </p>
                      {apt.reason && (
                        <p className="text-sm text-gray-400 mt-1">Motif : {apt.reason}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleValidate(apt.id)}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => handleReject(apt.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats complémentaires */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
            <p className="text-sm text-gray-500">Patients actifs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_patients}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
            <p className="text-sm text-gray-500">Médecins actifs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_doctors}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
            <p className="text-sm text-gray-500">Annulés aujourd'hui</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled_today}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretaryDashboardPage;