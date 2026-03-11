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
  doctor_id: number | null;
  scheduled_at: string | null;
  patient: { id: number; name: string; email: string; phone?: string } | null;
  doctor: { id: number; user: { id: number; name: string; email: string } } | null;
  specialty: { id: number; name: string } | null;
}

interface DoctorOption {
  id: number;
  name: string;
  email: string;
  schedules: { day_of_week: number; start_time: string; end_time: string }[];
}

const SecretaryDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [togglingBooking, setTogglingBooking] = useState(false);

  // Modal assignation medecin
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, appointmentsRes, bookingRes] = await Promise.all([
        api.get('/secretary/dashboard'),
        api.get('/secretary/pending-appointments'),
        api.get('/secretary/online-booking/status'),
      ]);
      setStats(statsRes.data);
      setPendingAppointments(appointmentsRes.data);
      setOnlineBooking(bookingRes.data.online_booking_enabled);
    } catch (error) {
      console.error('Erreur chargement dashboard secretaire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBooking = async () => {
    try {
      setTogglingBooking(true);
      const res = await api.put('/secretary/online-booking/toggle', {
        enabled: !onlineBooking,
      });
      setOnlineBooking(res.data.online_booking_enabled);
    } catch (error) {
      console.error('Erreur toggle booking:', error);
    } finally {
      setTogglingBooking(false);
    }
  };

  // =========================================================
  //  ASSIGN DOCTOR MODAL
  // =========================================================

  const openAssignModal = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDoctorId(null);
    setScheduledAt('');
    setAssignError('');
    setAssignModalOpen(true);

    // Charger les medecins de la specialite
    if (appointment.specialty?.id) {
      try {
        setLoadingDoctors(true);
        const res = await api.get(`/secretary/doctors-by-specialty/${appointment.specialty.id}`);
        setDoctors(res.data);
      } catch (error) {
        console.error('Erreur chargement medecins:', error);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    }
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedAppointment(null);
    setDoctors([]);
    setSelectedDoctorId(null);
    setScheduledAt('');
    setAssignError('');
  };

  const handleAssignDoctor = async () => {
    if (!selectedAppointment || !selectedDoctorId || !scheduledAt) {
      setAssignError('Veuillez selectionner un medecin et un creneau.');
      return;
    }

    try {
      setAssigning(true);
      setAssignError('');
      await api.put(`/secretary/appointments/${selectedAppointment.id}/assign`, {
        doctor_id: selectedDoctorId,
        scheduled_at: scheduledAt,
      });
      closeAssignModal();
      fetchData();
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Erreur lors de l\'assignation';
      setAssignError(msg);
    } finally {
      setAssigning(false);
    }
  };

  // =========================================================
  //  VALIDATE / REJECT
  // =========================================================

  const handleValidate = async (id: number) => {
    try {
      await api.put(`/secretary/appointments/${id}/validate`);
      fetchData();
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Erreur validation';
      alert(msg);
    }
  };

  const handleReject = async (id: number) => {
    const reason = window.prompt('Motif du rejet (obligatoire) :');
    if (!reason || reason.trim() === '') return;
    try {
      await api.put(`/secretary/appointments/${id}/reject`, {
        rejection_reason: reason,
      });
      fetchData();
    } catch (error) {
      console.error('Erreur rejet:', error);
    }
  };

  // =========================================================
  //  HELPERS
  // =========================================================

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const formatSchedules = (schedules: DoctorOption['schedules']) => {
    if (!schedules || schedules.length === 0) return 'Pas de planning';
    return schedules
      .map((s) => `${dayNames[s.day_of_week] || s.day_of_week} ${s.start_time}-${s.end_time}`)
      .join(', ');
  };

  // =========================================================
  //  RENDER
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-400">
          <div className="text-sm text-gray-500">En attente</div>
          <div className="text-2xl font-bold text-yellow-600">{stats?.pending_appointments ?? 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-400">
          <div className="text-sm text-gray-500">Confirmes aujourd'hui</div>
          <div className="text-2xl font-bold text-green-600">{stats?.confirmed_today ?? 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-400">
          <div className="text-sm text-gray-500">Total aujourd'hui</div>
          <div className="text-2xl font-bold text-blue-600">{stats?.total_today ?? 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-400">
          <div className="text-sm text-gray-500">Annules aujourd'hui</div>
          <div className="text-2xl font-bold text-red-600">{stats?.cancelled_today ?? 0}</div>
        </div>
      </div>

      {/* Deuxieme rangee */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-400">
          <div className="text-sm text-gray-500">Patients total</div>
          <div className="text-2xl font-bold text-purple-600">{stats?.total_patients ?? 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-400">
          <div className="text-sm text-gray-500">Medecins total</div>
          <div className="text-2xl font-bold text-indigo-600">{stats?.total_doctors ?? 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-400">
          <div className="text-sm text-gray-500">RDV cette semaine</div>
          <div className="text-2xl font-bold text-orange-600">{stats?.weekly_appointments ?? 0}</div>
        </div>
      </div>

      {/* Online Booking Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Reservation en ligne</h3>
          <p className="text-sm text-gray-500">
            {onlineBooking ? 'Les patients peuvent prendre RDV en ligne' : 'La reservation en ligne est desactivee'}
          </p>
        </div>
        <button
          onClick={handleToggleBooking}
          disabled={togglingBooking}
          className={`px-4 py-2 rounded-lg transition-colors ${
            onlineBooking
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } ${togglingBooking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {togglingBooking ? '...' : onlineBooking ? 'Desactiver' : 'Activer'}
        </button>
      </div>

      {/* Pending Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">RDV en attente de validation</h2>
          <Link
            to="/secretary/appointments"
            className="text-sm text-primary-600 hover:underline"
          >
            Voir tout
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialite</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motif</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medecin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Aucun rendez-vous en attente
                  </td>
                </tr>
              ) : (
                pendingAppointments.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{app.patient?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{app.patient?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{app.specialty?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{app.reason}</td>
                    <td className="px-4 py-3">
                      {app.doctor ? (
                        <span className="text-green-600 font-medium">Dr. {app.doctor.user?.name}</span>
                      ) : (
                        <span className="text-yellow-600 text-sm">Non assigne</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openAssignModal(app)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Assigner
                        </button>
                        <button
                          onClick={() => handleValidate(app.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          title={!app.doctor_id ? 'Un medecin doit etre assigne avant validation' : ''}
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Rejeter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================
          MODAL : Assigner un medecin
         ========================================================= */}
      {assignModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Assigner un medecin
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Patient : <strong>{selectedAppointment.patient?.name}</strong> --
                Specialite : <strong>{selectedAppointment.specialty?.name}</strong>
              </p>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Liste des medecins */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medecin
                </label>
                {loadingDoctors ? (
                  <div className="flex items-center space-x-2 py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    <span className="text-sm text-gray-500">Chargement des medecins...</span>
                  </div>
                ) : doctors.length === 0 ? (
                  <p className="text-sm text-red-500">Aucun medecin disponible pour cette specialite.</p>
                ) : (
                  <div className="space-y-2">
                    {doctors.map((doc) => (
                      <label
                        key={doc.id}
                        className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedDoctorId === doc.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="doctor"
                          value={doc.id}
                          checked={selectedDoctorId === doc.id}
                          onChange={() => setSelectedDoctorId(doc.id)}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-800">Dr. {doc.name}</div>
                          <div className="text-xs text-gray-500">{doc.email}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatSchedules(doc.schedules)}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Date / heure du RDV */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date et heure du rendez-vous
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Erreur */}
              {assignError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{assignError}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={closeAssignModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAssignDoctor}
                disabled={assigning || !selectedDoctorId || !scheduledAt}
                className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 ${
                  assigning || !selectedDoctorId || !scheduledAt ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {assigning ? 'Assignation...' : 'Assigner le medecin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretaryDashboardPage;
