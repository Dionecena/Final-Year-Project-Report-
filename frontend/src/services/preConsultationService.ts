import api from './api';
import { PreConsultation, SpecialtySuggestion, ApiResponse } from '../types';

const preConsultationService = {
  // Obtenir les suggestions de spécialités (sans sauvegarder)
  async getSuggestions(symptomIds: number[]): Promise<SpecialtySuggestion[]> {
    const response = await api.post<ApiResponse<SpecialtySuggestion[]>>(
      '/pre-consultations/suggest',
      { symptoms_selected: symptomIds }
    );
    return response.data.data;
  },

  // Soumettre une préconsultation
  async submit(data: {
    symptoms_selected: number[];
    additional_notes?: string;
  }): Promise<PreConsultation> {
    const response = await api.post<ApiResponse<PreConsultation>>(
      '/pre-consultations',
      data
    );
    return response.data.data;
  },

  // Historique des préconsultations
  async getHistory(): Promise<PreConsultation[]> {
    const response = await api.get<ApiResponse<PreConsultation[]>>('/pre-consultations');
    return response.data.data;
  },

  // Détail d'une préconsultation
  async getById(id: number): Promise<PreConsultation> {
    const response = await api.get<ApiResponse<PreConsultation>>(`/pre-consultations/${id}`);
    return response.data.data;
  },
};

export default preConsultationService;
