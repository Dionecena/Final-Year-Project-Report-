import api from './api';
import { Appointment, ApiResponse } from '../types';

const appointmentService = {
  // Lister les rendez-vous
  async getAll(): Promise<Appointment[]> {
    const response = await api.get<ApiResponse<Appointment[]>>('/appointments');
    return response.data.data;
  },

  // Créer un rendez-vous
  async create(data: {
    doctor_id: number;
    pre_consultation_id?: number;
    scheduled_at: string;
    notes?: string;
  }): Promise<Appointment> {
    const response = await api.post<ApiResponse<Appointment>>('/appointments', data);
    return response.data.data;
  },

  // Détail d'un rendez-vous
  async getById(id: number): Promise<Appointment> {
    const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data.data;
  },

  // Modifier le statut
  async updateStatus(id: number, status: string, reason?: string): Promise<Appointment> {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, {
      status,
      cancellation_reason: reason,
    });
    return response.data.data;
  },

  // Annuler
  async cancel(id: number): Promise<void> {
    await api.delete(`/appointments/${id}`);
  },

  // Créneaux disponibles d'un médecin
  async getAvailableSlots(doctorId: number, date: string): Promise<{
    time: string;
    datetime: string;
    available: boolean;
  }[]> {
    const response = await api.get(`/doctors/${doctorId}/slots`, {
      params: { date },
    });
    return response.data.data;
  },
};

export default appointmentService;
