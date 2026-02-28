import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import { Appointment } from '../types';
import { useAuth } from '../contexts/AuthContext';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmé', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800' },
  completed: { label: 'Terminé', color: 'bg-gray-100 text-gray-800' },
};

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.getAll,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => appointmentService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (id: number) => appointmentService.updateStatus(id, 'confirmed'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rendez-vous</h1>
        {user?.role === 'patient' && (
          <Link to="/preconsultation" className="btn-primary">
            + Nouveau RDV
          </Link>
        )}
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'all', label: 'Tous' },
          { value: 'pending', label: 'En attente' },
          { value: 'confirmed', label: 'Confirmés' },
          { value: 'cancelled', label: 'Annulés' },
          { value: 'completed', label: 'Terminés' },
        ].map(filter => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === filter.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Liste des rendez-vous */}
      {filteredAppointments.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 mb-4">Aucun rendez-vous trouvé</p>
          {user?.role === 'patient' && (
            <Link to="/preconsultation" className="btn-primary">
              Prendre un rendez-vous
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment: Appointment) => (
            <div key={appointment.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[appointment.status]?.color}`}>
                      {STATUS_LABELS[appointment.status]?.label}
                    </span>
                    {appointment.pre_consultation && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Préconsultation incluse
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.role === 'patient'
                      ? `Dr. ${appointment.doctor?.user?.name}`
                      : appointment.patient?.name
                    }
                  </h3>

                  {appointment.doctor?.specialty && (
                    <p className="text-sm text-primary-600 font-medium">
                      {appointment.doctor.specialty.name}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 mt-1">
                    📅 {formatDate(appointment.scheduled_at)}
                  </p>

                  {appointment.notes && (
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded p-2">
                      {appointment.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  {/* Secrétaire/Admin peut confirmer */}
                  {(user?.role === 'secretary' || user?.role === 'admin') &&
                    appointment.status === 'pending' && (
                    <button
                      onClick={() => confirmMutation.mutate(appointment.id)}
                      disabled={confirmMutation.isPending}
                      className="btn-primary text-sm py-1.5 px-3"
                    >
                      Confirmer
                    </button>
                  )}

                  {/* Patient peut annuler ses RDV en attente */}
                  {user?.role === 'patient' &&
                    appointment.status === 'pending' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
                          cancelMutation.mutate(appointment.id);
                        }
                      }}
                      disabled={cancelMutation.isPending}
                      className="btn-danger text-sm py-1.5 px-3"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
