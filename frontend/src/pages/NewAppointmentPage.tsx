import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import doctorService from '../services/doctorService';
import appointmentService from '../services/appointmentService';
import { Doctor } from '../types';

const NewAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { preConsultationId?: number; specialtyId?: number } | null;

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Charger les médecins (filtrés par spécialité si préconsultation)
  const { data: doctors = [], isLoading: loadingDoctors } = useQuery({
    queryKey: ['doctors', state?.specialtyId],
    queryFn: () => state?.specialtyId
      ? doctorService.getBySpecialty(state.specialtyId)
      : doctorService.getAll(),
  });

  // Charger les créneaux disponibles
  const { data: slots = [], isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', selectedDoctor?.id, selectedDate],
    queryFn: () => appointmentService.getAvailableSlots(selectedDoctor!.id, selectedDate),
    enabled: !!selectedDoctor && !!selectedDate,
  });

  const createMutation = useMutation({
    mutationFn: () => appointmentService.create({
      doctor_id: selectedDoctor!.id,
      pre_consultation_id: state?.preConsultationId,
      scheduled_at: selectedSlot,
      notes: notes || undefined,
    }),
    onSuccess: () => {
      navigate('/appointments');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    },
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prendre un rendez-vous</h1>
        {state?.preConsultationId && (
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              ✅ Préconsultation enregistrée — Les médecins affichés correspondent à votre spécialité suggérée
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Étape 1 : Choisir un médecin */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Choisir un médecin</h2>

          {loadingDoctors ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : doctors.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucun médecin disponible</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {doctors.map((doctor: Doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setSelectedSlot('');
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-semibold">
                        {doctor.user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Dr. {doctor.user?.name}</p>
                      <p className="text-sm text-primary-600">{doctor.specialty?.name}</p>
                      {doctor.bio && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{doctor.bio}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Étape 2 : Choisir une date */}
        {selectedDoctor && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Choisir une date</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot('');
              }}
              min={today}
              className="input-field"
            />
          </div>
        )}

        {/* Étape 3 : Choisir un créneau */}
        {selectedDoctor && selectedDate && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Choisir un créneau</h2>

            {loadingSlots ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : slots.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucun créneau disponible pour cette date. Essayez une autre date.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.datetime}
                    onClick={() => slot.available && setSelectedSlot(slot.datetime)}
                    disabled={!slot.available}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      !slot.available
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                        : selectedSlot === slot.datetime
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-700 border border-gray-200'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes optionnelles */}
        {selectedSlot && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Notes (optionnel)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="input-field"
              placeholder="Informations supplémentaires pour le médecin..."
            />
          </div>
        )}

        {/* Bouton de confirmation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            ← Retour
          </button>
          <button
            onClick={() => createMutation.mutate()}
            disabled={!selectedDoctor || !selectedSlot || createMutation.isPending}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Réservation...' : 'Confirmer le rendez-vous'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentPage;
