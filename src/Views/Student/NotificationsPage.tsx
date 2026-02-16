import React from "react";
import useNotifications, { Notification } from "@/Hooks/useNotifications";
import { 
  Loader2, 
  Check, 
  Bell, 
  BellRing, 
  CheckCheck, 
  Clock,
  XCircle,
  Info,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const NotificationsPage: React.FC = () => {
  const { notificationsQuery, markAsReadMutation } = useNotifications();

  if (notificationsQuery.isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary dark:text-dark-primary mb-4" size={48} />
        <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
      </div>
    );
  }

  const notifications = notificationsQuery.data || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    notifications
      .filter(n => !n.isRead)
      .forEach(n => markAsReadMutation.mutate(n.id));
  };

  // Function to determine icon based on message content (you can customize this logic)
  const getNotificationIcon = (message: string, isRead: boolean) => {
    const iconClass = isRead 
      ? "text-gray-400 dark:text-gray-600" 
      : "text-primary dark:text-dark-primary";
    
    if (message.toLowerCase().includes('success') || message.toLowerCase().includes('completed')) {
      return <CheckCircle className={`w-5 h-5 ${iconClass}`} />;
    } else if (message.toLowerCase().includes('warning') || message.toLowerCase().includes('caution')) {
      return <AlertCircle className={`w-5 h-5 text-warning dark:text-dark-warning`} />;
    } else if (message.toLowerCase().includes('info')) {
      return <Info className={`w-5 h-5 text-info dark:text-dark-info`} />;
    } else if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) {
      return <XCircle className={`w-5 h-5 text-secondary dark:text-dark-secondary`} />;
    }
    return <BellRing className={`w-5 h-5 ${iconClass}`} />;
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-slideDown">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800 dark:text-light">
            <div className="p-2 bg-primary/10 dark:bg-dark-primary/20 rounded-xl">
              <Bell className="text-primary dark:text-dark-primary" size={24} />
            </div>
            Notifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 ml-2">
            Stay updated with your latest activities
          </p>
        </div>
        
        {unreadCount > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <BellRing className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {unreadCount} unread
              </span>
            </div>
            <button
              onClick={handleMarkAllAsRead}
              className="btn-secondary flex items-center gap-2 text-sm"
              disabled={markAsReadMutation.isPending}
            >
              {markAsReadMutation.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <CheckCheck size={16} />
              )}
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="card text-center py-20 px-4">
          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Bell size={48} className="text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500 max-w-md">
              When you get notifications, they'll appear here. Stay tuned for updates!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif: Notification) => (
            <div
              key={notif.id}
              className={`card hover:shadow-card-hover transition-all duration-300 ${
                notif.isRead 
                  ? "bg-gray-50/80 dark:bg-gray-800/50" 
                  : "bg-white dark:bg-dark-card border-l-4 border-primary dark:border-dark-primary"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notif.message, notif.isRead)}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className={`text-sm md:text-base ${
                      notif.isRead 
                        ? "text-gray-600 dark:text-gray-400" 
                        : "text-gray-800 dark:text-light font-medium"
                    }`}>
                      {notif.message}
                    </p>
                    
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                                 text-primary dark:text-dark-primary 
                                 hover:bg-primary/10 dark:hover:bg-dark-primary/20 
                                 rounded-lg transition-colors duration-200
                                 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        disabled={markAsReadMutation.isPending}
                      >
                        {markAsReadMutation.isPending ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <Check size={14} />
                        )}
                        Mark as read
                      </button>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(notif.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer with total count */}
      {notifications.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;