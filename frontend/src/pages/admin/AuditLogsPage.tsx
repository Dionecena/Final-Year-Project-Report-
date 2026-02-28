import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { AuditLog } from '../../types';

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  login: { label: 'Connexion', color: 'bg-green-100 text-green-800' },
  logout: { label: 'Déconnexion', color: 'bg-gray-100 text-gray-800' },
  failed_login: { label: 'Tentative échouée', color: 'bg-red-100 text-red-800' },
  register: { label: 'Inscription', color: 'bg-blue-100 text-blue-800' },
  create: { label: 'Création', color: 'bg-green-100 text-green-800' },
  update: { label: 'Modification', color: 'bg-yellow-100 text-yellow-800' },
  delete: { label: 'Suppression', color: 'bg-red-100 text-red-800' },
  view: { label: 'Consultation', color: 'bg-gray-100 text-gray-600' },
  cancel: { label: 'Annulation', color: 'bg-orange-100 text-orange-800' },
  activate_user: { label: 'Activation', color: 'bg-green-100 text-green-800' },
  deactivate_user: { label: 'Désactivation', color: 'bg-red-100 text-red-800' },
  change_role: { label: 'Changement rôle', color: 'bg-purple-100 text-purple-800' },
};

const AuditLogsPage: React.FC = () => {
  const [filterAction, setFilterAction] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', filterAction, page],
    queryFn: async () => {
      const params: Record<string, string | number> = { page };
      if (filterAction) params.action = filterAction;
      const response = await api.get('/admin/audit-logs', { params });
      return response.data;
    },
  });

  const { data: securityStats } = useQuery({
    queryKey: ['security-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/security-stats');
      return response.data.data;
    },
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Logs & Audit de Sécurité</h1>

      {/* Alertes de sécurité */}
      {securityStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`card ${securityStats.failed_logins_24h > 10 ? 'border-red-300 bg-red-50' : ''}`}>
            <p className="text-sm text-gray-500">Tentatives échouées (24h)</p>
            <p className={`text-3xl font-bold ${securityStats.failed_logins_24h > 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {securityStats.failed_logins_24h}
            </p>
            {securityStats.failed_logins_24h > 10 && (
              <p className="text-xs text-red-600 mt-1">⚠️ Activité suspecte détectée</p>
            )}
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Connexions réussies (24h)</p>
            <p className="text-3xl font-bold text-green-600">{securityStats.successful_logins_24h}</p>
          </div>
          <div className={`card ${securityStats.suspicious_ips?.length > 0 ? 'border-orange-300 bg-orange-50' : ''}`}>
            <p className="text-sm text-gray-500">IPs suspectes</p>
            <p className={`text-3xl font-bold ${securityStats.suspicious_ips?.length > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
              {securityStats.suspicious_ips?.length || 0}
            </p>
            {securityStats.suspicious_ips?.length > 0 && (
              <p className="text-xs text-orange-600 mt-1">⚠️ IPs avec 5+ tentatives</p>
            )}
          </div>
        </div>
      )}

      {/* IPs suspectes */}
      {securityStats?.suspicious_ips?.length > 0 && (
        <div className="card mb-6 border-orange-200 bg-orange-50">
          <h3 className="font-semibold text-orange-800 mb-3">🚨 IPs Suspectes (5+ tentatives échouées en 24h)</h3>
          <div className="space-y-2">
            {securityStats.suspicious_ips.map((ip: { ip_address: string; attempts: number }) => (
              <div key={ip.ip_address} className="flex items-center justify-between bg-white rounded p-2">
                <code className="text-sm font-mono text-gray-700">{ip.ip_address}</code>
                <span className="text-sm font-bold text-red-600">{ip.attempts} tentatives</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterAction}
          onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
          className="input-field w-64"
        >
          <option value="">Toutes les actions</option>
          {Object.entries(ACTION_LABELS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {/* Table des logs */}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Heure</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objet</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.data?.map((log: AuditLog) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {log.user?.name || <span className="text-gray-400 italic">Anonyme</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ACTION_LABELS[log.action]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {ACTION_LABELS[log.action]?.label || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.model && `${log.model} #${log.model_id}`}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">
                      {log.ip_address}
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
                Page {data.current_page} sur {data.last_page} ({data.total} entrées)
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

export default AuditLogsPage;
