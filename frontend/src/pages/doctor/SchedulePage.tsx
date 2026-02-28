import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

interface ScheduleSlot {
  id: number;
  doctor_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: 1,
    start_time: '08:00',
    end_time: '17:00',
    is_available: true,
  });

  // Récupérer l'ID du médecin connecté
  const { data: doctorData } = useQuery({
    queryKey: ['my-doctor-profile'],
    queryFn: async () => {
      const response = await api.get('/auth/profile');
      return response.data.data;
    },
    enabled: user?.role === 'doctor',
  });

  const doctorId = doctorData?.doctor?.id;

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['schedules', doctorId],
    queryFn: async () => {
      const response = await api.get(`/doctors/${doctorId}/schedules`);
      return response.data.data;
    },
    enabled: !!doctorId,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData & { doctor_id: number }) =>
      api.post('/schedules', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/schedules/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules'] }),
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, is_available }: { id: number; is_available: boolean }) =>
      api.put(`/schedules/${id}`, { is_available }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId) return;
    createMutation.mutate({ ...formData, doctor_id: doctorId });
  };

  // Grouper les créneaux par jour
  const schedulesByDay = DAYS.reduce((acc, day, index) => {
    acc[index] = schedules.filter((s: ScheduleSlot) => s.day_of_week === index);
    return acc;
  }, {} as Record<number, ScheduleSlot[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon Planning</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Ajouter un créneau'}
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nouveau créneau de disponibilité</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) => setFormData(prev => ({ ...prev, day_of_week: Number(e.target.value) }))}
                  className="input-field"
                >
                  {DAYS.map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending || !doctorId}
              className="btn-primary disabled:opacity-50"
            >
              {createMutation.isPending ? 'Enregistrement...' : 'Ajouter le créneau'}
            </button>
          </form>
        </div>
      )}

      {/* Planning par jour */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {DAYS.map((day, dayIndex) => (
            <div key={dayIndex} className="card">
              <h3 className="font-semibold text-gray-900 mb-3">{day}</h3>
              {schedulesByDay[dayIndex].length === 0 ? (
                <p className="text-sm text-gray-400 italic">Aucun créneau défini</p>
              ) : (
                <div className="space-y-2">
                  {schedulesByDay[dayIndex].map((slot: ScheduleSlot) => (
                    <div key={slot.id} className={`flex items-center justify-between p-3 rounded-lg ${
                      slot.is_available ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${slot.is_available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-sm font-medium text-gray-700">
                          {slot.start_time} — {slot.end_time}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          slot.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {slot.is_available ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleAvailabilityMutation.mutate({
                            id: slot.id,
                            is_available: !slot.is_available,
                          })}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {slot.is_available ? 'Marquer indisponible' : 'Marquer disponible'}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Supprimer ce créneau ?')) {
                              deleteMutation.mutate(slot.id);
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
