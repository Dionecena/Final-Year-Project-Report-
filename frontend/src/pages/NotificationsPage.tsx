import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, any> | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: Notification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const TYPE_LABELS: Record<string, string> = {
  appointment_confirmed: 'Rendez-vous confirmé',
  appointment_rejected: 'Rendez-vous refusé',
  appointment_reminder: 'Rappel de rendez-vous',
  preconsultation_completed: 'Pré-consultation terminée',
  system: 'Système',
};

const TYPE_COLORS: Record<string, string> = {
  appointment_confirmed: 'bg-green-100 text-green-800',
  appointment_rejected: 'bg-red-100 text-red-800',
  appointment_reminder: 'bg-yellow-100 text-yellow-800',
  preconsultation_completed: 'bg-blue-100 text-blue-800',
  system: 'bg-gray-100 text-gray-800',
};

const TYPE_ICONS: Record<string, string> = {
  appointment_confirmed: '✓',
  appointment_rejected: '✗',
  appointment_reminder: '⏰',
  preconsultation_completed: '📋',
  system: 'ℹ',
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterType, setFilterType] = useState<string>('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: currentPage,
        per_page: 15,
      };
      if (showUnreadOnly) params.unread_only = true;
      if (filterType) params.type = filterType;

      const response = await axios.get<PaginatedResponse>('/api/notifications', { params });
      setNotifications(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, showUnreadOnly, filterType]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get<{ unread_count: number }>('/api/notifications/unread-count');
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const markAsRead = async (id: number) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('/api/notifications/read-all');
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotal((prev) => prev - 1);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const deleteAllRead = async () => {
    if (!window.confirm('Supprimer toutes les notifications lues ?')) return;
    try {
      await axios.delete('/api/notifications/read');
      setNotifications((prev) => prev.filter((n) => !n.read_at));
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to delete read notifications:', error);
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "A l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Toutes lues'}
            {' '}&middot; {total} au total
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
          <button
            onClick={deleteAllRead}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            Supprimer les lues
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => {
              setShowUnreadOnly(e.target.checked);
              setCurrentPage(1);
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Non lues uniquement
        </label>

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tous les types</option>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-lg font-medium">Aucune notification</p>
          <p className="text-sm mt-1">
            {showUnreadOnly
              ? 'Vous avez lu toutes vos notifications.'
              : 'Vous n\'avez pas encore de notifications.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${
                notification.read_at
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50/50 border-blue-200'
              }`}
            >
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  TYPE_COLORS[notification.type] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {TYPE_ICONS[notification.type] || 'ℹ'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      TYPE_COLORS[notification.type] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {TYPE_LABELS[notification.type] || notification.type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(notification.created_at)}
                  </span>
                  {!notification.read_at && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-1">
                {!notification.read_at && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    title="Marquer comme lu"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  title="Supprimer"
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Page {currentPage} sur {lastPage}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
              disabled={currentPage === lastPage}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
