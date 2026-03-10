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

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
    appointment: { icon: '📅', color: 'text-blue-600', bg: 'bg-blue-50' },
    consultation: { icon: '🩺', color: 'text-green-600', bg: 'bg-green-50' },
    system: { icon: '⚙️', color: 'text-gray-600', bg: 'bg-gray-50' },
    alert: { icon: '⚠️', color: 'text-red-600', bg: 'bg-red-50' },
    message: { icon: '💬', color: 'text-purple-600', bg: 'bg-purple-50' },
    default: { icon: '🔔', color: 'text-teal-600', bg: 'bg-teal-50' },
};

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [typeFilter, setTypeFilter] = useState<string>('');

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = {
                page: currentPage,
                per_page: 15,
            };
            if (filter === 'unread') params.unread_only = true;
            if (typeFilter) params.type = typeFilter;

            const response = await axios.get<PaginatedResponse>('/api/notifications', { params });
            setNotifications(response.data.data);
            setLastPage(response.data.last_page);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Erreur lors du chargement des notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, filter, typeFilter]);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await axios.get<{ unread_count: number }>('/api/notifications/unread-count');
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Erreur compteur non lues:', error);
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
            console.error('Erreur marquage lecture:', error);
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
            console.error('Erreur marquage tout lu:', error);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            await axios.delete(`/api/notifications/${id}`);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setTotal((prev) => prev - 1);
            fetchUnreadCount();
        } catch (error) {
            console.error('Erreur suppression:', error);
        }
    };

    const clearReadNotifications = async () => {
        if (!window.confirm('Supprimer toutes les notifications lues ?')) return;
        try {
            await axios.delete('/api/notifications/clear-read');
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.error('Erreur nettoyage:', error);
        }
    };

    const getTypeConfig = (type: string) => typeConfig[type] || typeConfig.default;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'A l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {total} notification{total !== 1 ? 's' : ''}
                        {unreadCount > 0 && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {unreadCount} non lue{unreadCount !== 1 ? 's' : ''}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                    <button
                        onClick={clearReadNotifications}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Nettoyer les lues
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => { setFilter('all'); setCurrentPage(1); }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Toutes
                    </button>
                    <button
                        onClick={() => { setFilter('unread'); setCurrentPage(1); }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            filter === 'unread' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Non lues
                    </button>
                </div>
                <select
                    value={typeFilter}
                    onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                    <option value="">Tous les types</option>
                    <option value="appointment">Rendez-vous</option>
                    <option value="consultation">Consultation</option>
                    <option value="system">Systeme</option>
                    <option value="alert">Alerte</option>
                    <option value="message">Message</option>
                </select>
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-4xl mb-3">🔔</div>
                    <h3 className="text-lg font-medium text-gray-900">Aucune notification</h3>
                    <p className="text-gray-500 mt-1">
                        {filter === 'unread'
                            ? 'Vous avez lu toutes vos notifications !'
                            : 'Vous n\'avez pas encore de notifications.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification) => {
                        const config = getTypeConfig(notification.type);
                        const isUnread = !notification.read_at;

                        return (
                            <div
                                key={notification.id}
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-sm ${
                                    isUnread
                                        ? 'bg-white border-teal-200 shadow-sm'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                {/* Icon */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
                                    <span className="text-lg">{config.icon}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className={`text-sm font-semibold ${
                                                isUnread ? 'text-gray-900' : 'text-gray-700'
                                            }`}>
                                                {isUnread && (
                                                    <span className="inline-block w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                                )}
                                                {notification.title}
                                            </h3>
                                            <span className={`inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                                                {notification.type}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                            {formatDate(notification.created_at)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex-shrink-0 flex items-center gap-1">
                                    {isUnread && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            title="Marquer comme lu"
                                            className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        title="Supprimer"
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <p className="text-sm text-gray-500">
                        Page {currentPage} sur {lastPage}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Precedent
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
                            disabled={currentPage === lastPage}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
