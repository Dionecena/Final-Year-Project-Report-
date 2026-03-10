import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface DoctorSchedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface DoctorOption {
  id: number;
  name: string;
  email: string;
  schedules: DoctorSchedule[];
}

interface Appointment {
  id: number;
  created_at: string;
  status: string;
  reason: string | null;
  notes: string | null;
  scheduled_at: string | null;
  patient: { id: number; name: string; email: string; phone?: string } | null;
  doctor: { id: number; user: { name: string } } | null;
  specialty: { id: number; name: string } | null;
}

interface Slot {
  time: string;
  datetime: string;
  available: boolean;
}

const AppointmentValidationPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal assign
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Modal reject
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/secretary/pending-appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = async (apt: Appointment) => {
    setSelectedAppointment(apt);
    setSelectedDoctorId(null);
    setSelectedDate('');
    setSlots([]);
    setSelectedSlot('');
    setShowAssignModal(true);

    // Charger les medecins de la specialite
    if (apt.specialty?.id) {
      setLoadingDoctors(true);
      try {
        const res = await api.get(`/secretary/doctors-by-specialty/${apt.specialty.id}`);
        setDoctors(res.data);
      } catch (error) {
        console.error('Erreur chargement medecins:', error);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    }
  };

  const handleDoctorChange = (doctorId: number) => {
    setSelectedDoctorId(doctorId);
    setSelectedDate('');
    setSlots([]);
    setSelectedSlot('');
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot('');
    if (!selectedDoctorId || !date) return;

    setLoadingSlots(true);
    try {
      const res = await api.get(`/doctors/${selectedDoctorId}/slots`, { params: { date } });
      setSlots(res.data.data || res.data);
    } catch (error) {
      console.error('Erreur chargement creneaux:', error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedAppointment || !selectedDoctorId || !selectedSlot) return;
    try {
      setProcessing(true);
      await api.put(`/secretary/appointments/${selectedAppointment.id}/assign`, {
        doctor_id: selectedDoctorId,
        scheduled_at: selectedSlot,
      });
      setShowAssignModal(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de l\'assignation');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedAppointment || !rejectionReason.trim()) return;
    try {
      setProcessing(true);
      await api.put(`/secretary/appointments/${selectedAppointment.id}/reject`, {
        cancellation_reason: rejectionReason,
      });
      setShowRejectModal(false);
      setSelectedAppointment(null);
      setRejectionReason('');
      fetchAppointments();
    } catch (error) {
      console.error('Erreur rejet:', error);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Validation des rendez-vous</h1>
        <p className="text-gray-500 mt-1">
          {appointments.length} rendez-vous en attente de validation
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">Tous les rendez-vous sont traites !</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Demande le</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motif</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-primary-700">
                          {apt.patient?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{apt.patient?.name}</p>
                        <p className="text-xs text-gray-500">{apt.patient?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(apt.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {apt.specialty?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {apt.reason || '-'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openAssignModal(apt)}
                      className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Assigner
                    </button>
                    <button
                      onClick={() => openRejectModal(apt)}
                      className="px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Rejeter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Assignation */}
      {showAssignModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigner un medecin</h3>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm"><strong>Patient :</strong> {selectedAppointment.patient?.name}</p>
              <p className="text-sm"><strong>Specialite :</strong> {selectedAppointment.specialty?.name}</p>
              <p className="text-sm"><strong>Motif :</strong> {selectedAppointment.reason || '-'}</p>
            </div>

            {/* Selection medecin */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medecin <span className="text-red-500">*</span>
              </label>
              {loadingDoctors ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>
              ) : doctors.length === 0 ? (
                <p className="text-sm text-orange-600">Aucun medecin disponible pour cette specialite</p>
              ) : (
                <select
                  value={selectedDoctorId || ''}
                  onChange={(e) => handleDoctorChange(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">-- Choisir un medecin --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>Dr. {doc.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Selection date */}
            {selectedDoctorId && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={today}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Selection creneau */}
            {selectedDoctorId && selectedDate && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creneau <span className="text-red-500">*</span>
                </label>
                {loadingSlots ? (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-orange-600">Aucun creneau disponible. Essayez une autre date.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.datetime}
                        onClick={() => slot.available && setSelectedSlot(slot.datetime)}
                        disabled={!slot.available}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                          !slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : selectedSlot === slot.datetime
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-primary-50 border border-gray-200'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleAssign}
                disabled={processing || !selectedDoctorId || !selectedSlot}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? 'Assignation...' : 'Assigner et confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejet */}
      {showRejectModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejeter le rendez-vous</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm"><strong>Patient :</strong> {selectedAppointment.patient?.name}</p>
              <p className="text-sm"><strong>Specialite :</strong> {selectedAppointment.specialty?.name}</p>
              <p className="text-sm"><strong>Motif :</strong> {selectedAppointment.reason || '-'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif du rejet <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="Expliquez la raison du rejet..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Rejet...' : 'Rejeter le RDV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentValidationPage;
