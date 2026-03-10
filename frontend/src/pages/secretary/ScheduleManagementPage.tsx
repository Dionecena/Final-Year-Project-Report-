import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface Doctor {
  id: number;
  name: string;
  email: string;
}

interface Schedule {
  id: number;
  doctor_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  doctor?: Doctor;
}

interface ScheduleForm {
  doctor_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const emptyForm: ScheduleForm = {
  doctor_id: '',
  day_of_week: '',
  start_time: '08:00',
  end_time: '17:00',
  is_available: true,
};

const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const ScheduleManagementPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form, setForm] = useState<ScheduleForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      const data = res.data.data || res.data;
      const doctorUsers = data.map((d: any) => ({
        id: d.user_id || d.id,
        name: d.user?.name || d.name,
        email: d.user?.email || d.email,
      }));
      setDoctors(doctorUsers);
      return doctorUsers;
    } catch (err) {
      console.error('Erreur chargement medecins:', err);
      return [];
    }
  };

  const fetchSchedules = async (doctorList?: Doctor[]) => {
    try {
      const docs = doctorList || doctors;
      const allSchedules: Schedule[] = [];
      for (const doc of docs) {
        try {
          const res = await api.get('/doctors/' + doc.id + '/schedules');
          const data = res.data.data || res.data;
          const withDoctor = data.map((s: any) => ({ ...s, doctor: doc }));
          allSchedules.push(...withDoctor);
        } catch (err) {
          // Medecin sans planning
        }
      }
      setSchedules(allSchedules);
    } catch (err) {
      console.error('Erreur chargement plannings:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const docs = await fetchDoctors();
      await fetchSchedules(docs);
      setLoading(false);
    };
    init();
  }, []);

  const openAddModal = () => {
    setEditingSchedule(null);
    setForm(emptyForm);
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setForm({
      doctor_id: String(schedule.doctor_id),
      day_of_week: String(schedule.day_of_week),
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      is_available: schedule.is_available,
    });
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        doctor_id: parseInt(form.doctor_id),
        day_of_week: parseInt(form.day_of_week),
        start_time: form.start_time,
        end_time: form.end_time,
        is_available: form.is_available,
      };

      if (!editingSchedule) {
        await api.post('/schedules', payload);
        setSuccess('Creneau ajoute avec succes !');
      } else {
        await api.put('/schedules/' + editingSchedule.id, payload);
        setSuccess('Creneau modifie avec succes !');
      }

      closeModal();
      await fetchSchedules();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat().join(', ');
        setError(messages);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Une erreur est survenue.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete('/schedules/' + id);
      setSuccess('Creneau supprime !');
      setDeleteConfirm(null);
      await fetchSchedules();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  const filteredSchedules = selectedDoctor === 'all'
    ? schedules
    : schedules.filter((s) => String(s.doctor_id) === selectedDoctor);

  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
    return a.start_time.localeCompare(b.start_time);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Planning</h1>
          <p className="text-gray-600 mt-1">Gerez les creneaux horaires des medecins</p>
        </div>
        <button onClick={openAddModal} className="btn-primary px-4 py-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un creneau
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>
      )}

      {error && !showModal && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par medecin</label>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="all">Tous les medecins</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>Dr. {d.name}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medecin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horaires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSchedules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucun creneau configure.
                  </td>
                </tr>
              ) : (
                sortedSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Dr. {schedule.doctor?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {dayNames[schedule.day_of_week] || schedule.day_of_week}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {schedule.start_time} - {schedule.end_time}
                    </td>
                    <td className="px-6 py-4">
                      <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + (schedule.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                        {schedule.is_available ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(schedule)} className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                        Modifier
                      </button>
                      {deleteConfirm === schedule.id ? (
                        <span className="inline-flex items-center space-x-2">
                          <button onClick={() => handleDelete(schedule.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Confirmer</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700 text-sm">Annuler</button>
                        </span>
                      ) : (
                        <button onClick={() => setDeleteConfirm(schedule.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Supprimer</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingSchedule ? 'Modifier le creneau' : 'Ajouter un creneau'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medecin *</label>
                <select value={form.doctor_id} onChange={(e) => setForm({ ...form, doctor_id: e.target.value })} className="input-field" required>
                  <option value="">Selectionner un medecin</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>Dr. {d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jour de la semaine *</label>
                <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} className="input-field" required>
                  <option value="">Selectionner un jour</option>
                  {dayNames.map((name, index) => (
                    <option key={index} value={index}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure debut *</label>
                  <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin *</label>
                  <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="input-field" required />
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="is_available" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="h-4 w-4 text-primary-600 border-gray-300 rounded" />
                <label htmlFor="is_available" className="ml-2 text-sm text-gray-700">Creneau disponible</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Annuler</button>
                <button type="submit" disabled={submitting} className="btn-primary px-4 py-2 disabled:opacity-50">
                  {submitting ? 'Enregistrement...' : editingSchedule ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagementPage;
