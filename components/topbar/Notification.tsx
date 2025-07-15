"use client";
import useDropdown from "@/utils/useDropdown";
import Link from "next/link";
import { useNotificationStore, categoryIcons, priorityStyles } from "@/stores/notificationStore";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

const Notification = () => {
  const { open, ref, toggleOpen } = useDropdown();
  const { 
    announcements, 
    unreadCount, 
    openAnnouncementModal, 
    markAllAsRead,
    loadAnnouncements,
    loadUnreadCount,
    isLoading 
  } = useNotificationStore();

  useEffect(() => {
    // Load announcements when component mounts
    loadAnnouncements();
    
    // Poll for unread count every 60 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [loadAnnouncements, loadUnreadCount]);

  const getAnnouncementIcon = (category: string, icon?: string) => {
    if (icon) return icon;
    return categoryIcons[category] || 'las la-info-circle';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news': return 'text-blue-600 dark:text-blue-400';
      case 'updates': return 'text-purple-600 dark:text-purple-400';
      case 'maintenance': return 'text-orange-600 dark:text-orange-400';
      case 'features': return 'text-green-600 dark:text-green-400';
      case 'promotions': return 'text-pink-600 dark:text-pink-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full relative bg-primary/5 dark:bg-bg3 border border-n30 dark:border-n500`}>
        <i className="las la-bell text-2xl"></i>
        {unreadCount > 0 && (
          <span className="absolute w-5 h-5 flex items-center justify-center text-n0 rounded-full text-xs bg-primary -top-1 -right-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <div
        className={`bg-n0 dark:bg-bg4 rounded-lg ltr:-right-[160px] rtl:-left-[110px] origin-[42%_0] sm:ltr:origin-top-right sm:rtl:origin-top-left sm:rtl:left-0 sm:ltr:right-0 shadow-[0px_6px_30px_0px_rgba(0,0,0,0.08)] absolute top-full mt-2 duration-300 ${
          open ? "visible opacity-100 scale-100" : "invisible scale-0 opacity-0"
        }`}>
        <div className="flex justify-between items-center px-4 py-3 border-b dark:border-n500">
          <h5 className="h5">Notifications</h5>
          {announcements.length > 0 && unreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className="text-primary text-sm hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <i className="las la-spinner la-spin text-4xl text-primary mb-2 block"></i>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <i className="las la-bell-slash text-4xl mb-2 block"></i>
              <p className="text-sm">No announcements yet</p>
            </div>
          ) : (
            <ul className="flex flex-col w-[360px] divide-y dark:divide-n500">
              {announcements.slice(0, 10).map((announcement) => (
                <li
                  key={announcement.id}
                  onClick={() => {
                    openAnnouncementModal(announcement);
                    toggleOpen();
                  }}
                  className={`flex gap-3 cursor-pointer p-4 hover:bg-primary/5 duration-300 ${
                    !announcement.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`shrink-0 ${getCategoryColor(announcement.category)}`}>
                    <i className={`${getAnnouncementIcon(announcement.category, announcement.icon)} text-xl`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h6 className={`font-medium text-sm truncate flex-1 ${!announcement.read ? 'font-semibold' : ''}`}>
                        {announcement.title}
                      </h6>
                      {announcement.priority === 'urgent' && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {announcement.message}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">
                      {formatDistanceToNow(new Date(announcement.published_at), { addSuffix: true })}
                    </span>
                  </div>
                  {!announcement.read && (
                    <div className="shrink-0">
                      <span className="w-2 h-2 bg-primary rounded-full block mt-2"></span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {announcements.length > 0 && (
          <div className="p-3 border-t dark:border-n500">
            <Link 
              href="/announcements" 
              onClick={toggleOpen}
              className="text-primary text-sm hover:underline block text-center"
            >
              View all announcements
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
