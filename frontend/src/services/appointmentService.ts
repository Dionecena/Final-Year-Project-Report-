import api from './api';
import { Appointment, ApiResponse } from '../types';

const appointmentService = {
  // Lister les rendez-vous
  async getAll(): Promise<Appointment[]> {
    const response = await api.get<ApiResponse<Appointment[]>>('/appointments');
    return response.data.data;
  },

  // Patient cree un RDV : specialite + motif
  async create(data: {
    specialty_id: number;
    reason: string;
    preferred_date?: string;
    pre_consultation_id?: number;
    notes?: string;
  }): Promise<Appointment> {
    const response = await api.post<ApiResponse<Appointment>>('/appointments', data);
    return response.data.data;
  },

  // Detail d'un rendez-vous
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

  // Creneaux disponibles d'un medecin (utilise par la secretaire)
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
