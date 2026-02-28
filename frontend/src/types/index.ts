// ============================================
// Types principaux de la plateforme médicale
// ============================================

// Rôles utilisateur
export type UserRole = 'patient' | 'doctor' | 'secretary' | 'admin';

// Statut de rendez-vous
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// ============================================
// Utilisateur
// ============================================
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// Spécialité médicale
// ============================================
export interface Specialty {
  id: number;
  name: string;
  description: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Médecin
// ============================================
export interface Doctor {
  id: number;
  user_id: number;
  specialty_id: number;
  bio?: string;
  photo?: string;
  license_number?: string;
  user?: User;
  specialty?: Specialty;
  created_at: string;
  updated_at: string;
}

// ============================================
// Symptôme
// ============================================
export interface Symptom {
  id: number;
  name: string;
  description?: string;
  category: string;
}

// ============================================
// Lien Symptôme-Spécialité (avec poids)
// ============================================
export interface SymptomSpecialty {
  symptom_id: number;
  specialty_id: number;
  weight: number; // 0.0 à 1.0
}

// ============================================
// Préconsultation
// ============================================
export interface PreConsultation {
  id: number;
  patient_id: number;
  symptoms_selected: number[]; // IDs des symptômes
  suggested_specialty_id?: number;
  confidence_score?: number;
  suggested_specialty?: Specialty;
  created_at: string;
}

// ============================================
// Rendez-vous
// ============================================
export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  pre_consultation_id?: number;
  scheduled_at: string;
  status: AppointmentStatus;
  notes?: string;
  patient?: User;
  doctor?: Doctor;
  pre_consultation?: PreConsultation;
  created_at: string;
  updated_at: string;
}

// ============================================
// Planning médecin
// ============================================
export interface Schedule {
  id: number;
  doctor_id: number;
  day_of_week: number; // 0=Dimanche, 1=Lundi, ..., 6=Samedi
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  is_available: boolean;
}

// ============================================
// Notification
// ============================================
export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ============================================
// Audit Log
// ============================================
export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  model: string;
  model_id: number;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: User;
}

// ============================================
// Suggestion de spécialité (résultat algorithme)
// ============================================
export interface SpecialtySuggestion {
  specialty: Specialty;
  score: number; // 0.0 à 1.0
  percentage: number; // 0 à 100
}

// ============================================
// Statistiques Dashboard
// ============================================
export interface DashboardStats {
  total_appointments_today: number;
  total_appointments_week: number;
  total_appointments_month: number;
  total_patients: number;
  total_doctors: number;
  preconsultation_usage_rate: number;
  cancellation_rate: number;
  new_patients_this_month: number;
  appointments_by_specialty: { name: string; count: number }[];
  appointments_by_day: { date: string; count: number }[];
  top_doctors: { name: string; count: number }[];
}

// ============================================
// Réponse API paginée
// ============================================
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ============================================
// Réponse API générique
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
