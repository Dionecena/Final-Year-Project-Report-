import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import appointmentService from '../services/appointmentService';
import api from '../services/api';

interface Specialty {
  id: number;
  name: string;
  description?: string;
}

const NewAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { preConsultationId?: number; specialtyId?: number } | null;

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | null>(state?.specialtyId || null);
  const [reason, setReason] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Charger les specialites
  const { data: specialties = [], isLoading: loadingSpecialties } = useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const res = await api.get('/specialties');
      return res.data.data || res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () => appointmentService.create({
      specialty_id: selectedSpecialtyId!,
      reason,
      preferred_date: preferredDate || undefined,
      pre_consultation_id: state?.preConsultationId,
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
        <p className="text-gray-500 mt-1">
          Choisissez une specialite et decrivez votre motif. La secretaire vous assignera un medecin disponible.
        </p>
        {state?.preConsultationId && (
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              Preconsultation enregistree -- La specialite suggeree a ete pre-selectionnee
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
        {/* Etape 1 : Choisir une specialite */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Choisir une specialite</h2>

          {loadingSpecialties ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : specialties.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune specialite disponible</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {specialties.map((spec: Specialty) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecialtyId(spec.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedSpecialtyId === spec.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 text-sm">{spec.name}</p>
                  {spec.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{spec.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Etape 2 : Motif de consultation */}
        {selectedSpecialtyId && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Motif de consultation</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Decrivez brievement la raison de votre consultation..."
              maxLength={1000}
            />
            <p className="text-xs text-gray-400 mt-1">{reason.length}/1000 caracteres</p>
          </div>
        )}

        {/* Etape 3 : Date souhaitee (optionnel) */}
        {selectedSpecialtyId && reason.trim() && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">3. Date souhaitee (optionnel)</h2>
            <p className="text-sm text-gray-500 mb-3">
              Indiquez une date preferee. La secretaire confirmera la date exacte selon les disponibilites.
            </p>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={today}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Etape 4 : Notes optionnelles */}
        {selectedSpecialtyId && reason.trim() && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">4. Notes (optionnel)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Informations supplementaires..."
            />
          </div>
        )}

        {/* Boutons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Retour
          </button>
          <button
            onClick={() => createMutation.mutate()}
            disabled={!selectedSpecialtyId || !reason.trim() || createMutation.isPending}
            className="px-6 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Envoi...' : 'Demander le rendez-vous'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentPage;
