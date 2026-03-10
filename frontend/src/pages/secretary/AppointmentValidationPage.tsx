import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Doctor {
  id: number;
  name: string;
  email: string;
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

const AppointmentValidationPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, doctorsRes] = await Promise.all([
        api.get('/secretary/pending-appointments'),
        api.get('/doctors'),
      ]);
      setAppointments(appointmentsRes.data);
      setDoctors(doctorsRes.data.data || doctorsRes.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const openValidateModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setSelectedDoctorId(apt.doctor?.id || null);
    setShowValidateModal(true);
  };

  const openRejectModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleValidate = async () => {
    if (!selectedAppointment) return;
    try {
      setProcessing(true);
      const payload: any = {};
      if (selectedDoctorId) payload.doctor_id = selectedDoctorId;
      await api.patch(`/secretary/appointments/${selectedAppointment.id}/validate`, payload);
      setShowValidateModal(false);
      setSelectedAppointment(null);
      fetchData();
    } catch (error) {
      console.error('Erreur validation:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAppointment || !rejectionReason.trim()) return;
    try {
      setProcessing(true);
      await api.patch(`/secretary/appointments/${selectedAppointment.id}/reject`, {
        rejection_reason: rejectionReason,
      });
      setShowRejectModal(false);
      setSelectedAppointment(null);
      setRejectionReason('');
      fetchData();
    } catch (error) {
      console.error('Erreur rejet:', error);
    } finally {
      setProcessing(false);
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
          <p className="text-gray-500 text-lg">Tous les rendez-vous sont traités !</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spécialité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médecin</th>
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
                    {apt.date}<br />
                    <span className="text-gray-500">{apt.time}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {apt.specialty?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {apt.doctor?.name || <span className="text-orange-500 italic">Non assigné</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {apt.reason || '-'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openValidateModal(apt)}
                      className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Valider
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

      {/* Modal Validation */}
      {showValidateModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer le rendez-vous</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm"><strong>Patient :</strong> {selectedAppointment.patient?.name}</p>
              <p className="text-sm"><strong>Date :</strong> {selectedAppointment.date} à {selectedAppointment.time}</p>
              <p className="text-sm"><strong>Spécialité :</strong> {selectedAppointment.specialty?.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigner un médecin (optionnel)
              </label>
              <select
                value={selectedDoctorId || ''}
                onChange={(e) => setSelectedDoctorId(e.target.value ? Number(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">-- Garder le médecin actuel --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowValidateModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleValidate}
                disabled={processing}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? 'Validation...' : 'Confirmer le RDV'}
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
              <p className="text-sm"><strong>Date :</strong> {selectedAppointment.date} à {selectedAppointment.time}</p>
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
