import api from './api';
import { Specialty, ApiResponse, PaginatedResponse } from '../types';

const specialtyService = {
  // Lister toutes les spécialités
  async getAll(): Promise<Specialty[]> {
    const response = await api.get<ApiResponse<Specialty[]>>('/specialties');
    return response.data.data;
  },

  // Lister avec pagination
  async getPaginated(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Specialty>> {
    const response = await api.get<PaginatedResponse<Specialty>>('/specialties', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  // Récupérer une spécialité par ID
  async getById(id: number): Promise<Specialty> {
    const response = await api.get<ApiResponse<Specialty>>(`/specialties/${id}`);
    return response.data.data;
  },

  // Créer une spécialité (admin)
  async create(data: { name: string; description: string; icon?: string }): Promise<Specialty> {
    const response = await api.post<ApiResponse<Specialty>>('/specialties', data);
    return response.data.data;
  },

  // Modifier une spécialité (admin)
  async update(id: number, data: Partial<{ name: string; description: string; icon?: string }>): Promise<Specialty> {
    const response = await api.put<ApiResponse<Specialty>>(`/specialties/${id}`, data);
    return response.data.data;
  },

  // Supprimer une spécialité (admin)
  async delete(id: number): Promise<void> {
    await api.delete(`/specialties/${id}`);
  },
};

export default specialtyService;
