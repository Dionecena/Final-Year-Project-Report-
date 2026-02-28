import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import api from '../../services/api';
import { DashboardStats } from '../../types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const AdminDashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await api.get<{ data: DashboardStats }>('/admin/dashboard');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord Administrateur</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500">RDV aujourd'hui</p>
          <p className="text-3xl font-bold text-primary-600">{stats.total_appointments_today}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">RDV ce mois</p>
          <p className="text-3xl font-bold text-green-600">{stats.total_appointments_month}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total patients</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total_patients}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total médecins</p>
          <p className="text-3xl font-bold text-purple-600">{stats.total_doctors}</p>
        </div>
      </div>

      {/* KPIs secondaires */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500">Nouveaux patients (mois)</p>
          <p className="text-2xl font-bold text-gray-900">+{stats.new_patients_this_month}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Taux préconsultation</p>
          <p className="text-2xl font-bold text-green-600">{stats.preconsultation_usage_rate}%</p>
          <p className="text-xs text-gray-400">des RDV avec préconsultation</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Taux d'annulation</p>
          <p className="text-2xl font-bold text-red-500">{stats.cancellation_rate}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">RDV cette semaine</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_appointments_week}</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* RDV par jour (30 derniers jours) */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RDV par jour (30 derniers jours)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.appointments_by_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => new Date(val).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                labelFormatter={(val) => new Date(val).toLocaleDateString('fr-FR')}
              />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} name="RDV" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par spécialité */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RDV par spécialité (ce mois)</h3>
          {stats.appointments_by_specialty.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Aucune donnée disponible</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.appointments_by_specialty}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={false}
                  labelLine={false}
                >
                  {stats.appointments_by_specialty.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top médecins */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 médecins (ce mois)</h3>
        {stats.top_doctors.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Aucune donnée disponible</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.top_doctors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="RDV" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Liens rapides admin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/users" className="card hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-900">👥 Gestion Utilisateurs</h3>
          <p className="text-sm text-gray-500 mt-1">Gérer les comptes et les rôles</p>
        </a>
        <a href="/specialties" className="card hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-900">🏥 Spécialités</h3>
          <p className="text-sm text-gray-500 mt-1">Gérer les services médicaux</p>
        </a>
        <a href="/audit-logs" className="card hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-900">🔒 Logs & Sécurité</h3>
          <p className="text-sm text-gray-500 mt-1">Audit trail et alertes</p>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
