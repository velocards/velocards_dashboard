"use client";
import { useNotificationStore, categoryIcons, priorityStyles } from "@/stores/notificationStore";
import Modal from "@/components/shared/Modal";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

const NotificationModal = () => {
  const { selectedAnnouncement, isModalOpen, closeAnnouncementModal } = useNotificationStore();

  // Override the open state with the one from the store
  const isOpen = isModalOpen && selectedAnnouncement !== null;

  if (!selectedAnnouncement) return null;

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'news':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'updates':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'features':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'promotions':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Modal 
      toggleOpen={closeAnnouncementModal} 
      open={isOpen}
      width="max-w-[600px] lg:top-24"
    >
      <div>
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getCategoryStyles(selectedAnnouncement.category)}`}>
              <i className={`${selectedAnnouncement.icon || categoryIcons[selectedAnnouncement.category]} text-xl`}></i>
            </div>
            <div className="flex-1">
              <h4 className="h4">{selectedAnnouncement.title}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {format(new Date(selectedAnnouncement.published_at), 'PPP')}
                </span>
                {selectedAnnouncement.priority !== 'medium' && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityStyles[selectedAnnouncement.priority].bg} ${priorityStyles[selectedAnnouncement.priority].color}`}>
                    {selectedAnnouncement.priority.charAt(0).toUpperCase() + selectedAnnouncement.priority.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Image if available */}
          {selectedAnnouncement.image_url && (
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image 
                src={selectedAnnouncement.image_url} 
                alt={selectedAnnouncement.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          {/* Message content */}
          <div className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {selectedAnnouncement.message}
          </div>
          
          {/* Expiry notice if applicable */}
          {selectedAnnouncement.expires_at && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <i className="las la-clock mr-1"></i>
                This announcement expires on {format(new Date(selectedAnnouncement.expires_at), 'PPP')}
              </p>
            </div>
          )}
          
          {/* Category badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Category:</span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getCategoryStyles(selectedAnnouncement.category)}`}>
              <i className={`${categoryIcons[selectedAnnouncement.category]} text-sm`}></i>
              {selectedAnnouncement.category.charAt(0).toUpperCase() + selectedAnnouncement.category.slice(1)}
            </span>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            {selectedAnnouncement.action_url && (
              <Link href={selectedAnnouncement.action_url} className="flex-1">
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
                  onClick={closeAnnouncementModal}
                >
                  {selectedAnnouncement.action_label || 'Learn More'}
                </button>
              </Link>
            )}
            <button 
              onClick={closeAnnouncementModal}
              className={`${selectedAnnouncement.action_url ? 'flex-1' : 'w-full'} bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg transition-colors font-medium`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;