import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import api from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      const { data, unread_count } = response.data;
      
      const formatted = data.map(n => ({
        id: n.id,
        type: n.type || 'system',
        title: n.title || 'Notification',
        body: n.message || '',
        time: formatRelativeTime(n.created_at),
        timestamp: n.created_at,
        read: Boolean(n.is_read)
      }));
      
      setNotifications(formatted);
      setUnreadCount(unread_count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  useEffect(() => {
    fetchNotifications();
    // Auto-refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const removeNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => {
        const target = prev.find(n => n.id === id);
        if (target && !target.read) {
          setUnreadCount(u => Math.max(0, u - 1));
        }
        return prev.filter(n => n.id !== id);
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      loading,
      markAllRead, 
      markAsRead,
      removeNotification,
      clearAllNotifications,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
