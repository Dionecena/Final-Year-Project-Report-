import api from './api';
import { Doctor, ApiResponse, PaginatedResponse } from '../types';

const doctorService = {
  // Lister tous les médecins
  async getAll(): Promise<Doctor[]> {
    const response = await api.get<ApiResponse<Doctor[]>>('/doctors');
    return response.data.data;
  },

  // Lister avec pagination
  async getPaginated(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Doctor>> {
    const response = await api.get<PaginatedResponse<Doctor>>('/doctors', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  // Lister par spécialité
  async getBySpecialty(specialtyId: number): Promise<Doctor[]> {
    const response = await api.get<ApiResponse<Doctor[]>>(`/doctors`, {
      params: { specialty_id: specialtyId },
    });
    return response.data.data;
  },

  // Récupérer un médecin par ID
  async getById(id: number): Promise<Doctor> {
    const response = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return response.data.data;
  },

  // Créer un profil médecin (admin)
  async create(data: {
    user_id: number;
    specialty_id: number;
    bio?: string;
    license_number?: string;
  }): Promise<Doctor> {
    const response = await api.post<ApiResponse<Doctor>>('/doctors', data);
    return response.data.data;
  },

  // Modifier un profil médecin
  async update(id: number, data: Partial<{
    specialty_id: number;
    bio: string;
    license_number: string;
  }>): Promise<Doctor> {
    const response = await api.put<ApiResponse<Doctor>>(`/doctors/${id}`, data);
    return response.data.data;
  },

  // Supprimer un profil médecin (admin)
  async delete(id: number): Promise<void> {
    await api.delete(`/doctors/${id}`);
  },
};

export default doctorService;
