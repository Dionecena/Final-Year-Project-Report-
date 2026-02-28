import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { User } from '../../types';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  patient: { label: 'Patient', color: 'bg-green-100 text-green-800' },
  doctor: { label: 'Médecin', color: 'bg-blue-100 text-blue-800' },
  secretary: { label: 'Secrétaire', color: 'bg-yellow-100 text-yellow-800' },
  admin: { label: 'Admin', color: 'bg-red-100 text-red-800' },
};

const UsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [filterRole, setFilterRole] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', filterRole, search, page],
    queryFn: async () => {
      const params: Record<string, string | number> = { page };
      if (filterRole) params.role = filterRole;
      if (search) params.search = search;
      const response = await api.get('/admin/users', { params });
      return response.data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: number) => api.put(`/admin/users/${userId}/toggle-status`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      api.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Utilisateurs</h1>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher par nom ou email..."
          className="input-field flex-1"
        />
        <select
          value={filterRole}
          onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
          className="input-field sm:w-48"
        >
          <option value="">Tous les rôles</option>
          <option value="patient">Patients</option>
          <option value="doctor">Médecins</option>
          <option value="secretary">Secrétaires</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscrit le</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => changeRoleMutation.mutate({ userId: user.id, role: e.target.value })}
                        className={`text-xs font-medium px-2 py-1 rounded border-0 ${ROLE_LABELS[user.role]?.color}`}
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Médecin</option>
                        <option value="secretary">Secrétaire</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatusMutation.mutate(user.id)}
                        disabled={toggleStatusMutation.isPending}
                        className={`text-xs font-medium px-3 py-1 rounded ${
                          user.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.last_page > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {data.total} utilisateurs — Page {data.current_page}/{data.last_page}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm py-1 px-3 disabled:opacity-50"
                >
                  ← Précédent
                </button>
                <button
                  onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
                  disabled={page === data.last_page}
                  className="btn-secondary text-sm py-1 px-3 disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
