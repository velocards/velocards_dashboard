"use client";
import { useEffect, useState, useRef } from "react";
import { IconSelector } from "@tabler/icons-react";
import Link from "next/link";
import { useCardStore } from "@/stores/cardStore";
import AddCard from "@/components/cards/card-overview/AddCard";
import Modal from "@/components/shared/Modal";
import DropdownPortal from "@/components/shared/DropdownPortal";
import { cardApi } from "@/lib/api/cards";
import { toast } from "react-hot-toast";
import { AlertCircle, PhoneCall } from "lucide-react";

// Custom error notification component
const showErrorNotification = (title: string, message: string, actionable: boolean = true) => {
  toast.custom((t) => (
    <div className={`${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {title}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
            {actionable && (
              <div className="mt-3 flex space-x-4">
                <a
                  href="/support/contact"
                  className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <PhoneCall className="h-4 w-4" />
                  Contact Support
                </a>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200 dark:border-gray-700">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 focus:outline-none"
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  ), {
    duration: 8000,
    position: 'top-center',
  });
};

const ActiveCards = () => {
  const { cards, fetchCards, isLoading } = useCardStore();
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false);
  const [selectedCardDetails, setSelectedCardDetails] = useState<any>(null);
  const [isCardNumberRevealed, setIsCardNumberRevealed] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isProcessingCard, setIsProcessingCard] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  useEffect(() => {
    // Fetch cards for dashboard
    fetchCards();
  }, []);

  // Filter active and frozen cards and map to display format
  const activeCardsData = cards
    .filter(card => card.status === 'active' || card.status === 'frozen')
    .slice(0, 5) // Limit to 5 cards for dashboard view
    .map((card) => ({
      cardNumber: card.maskedPan || '**** **** **** ****',
      cardType: card.type || 'Virtual Card',
      nickname: card.nickname || 'My Card',
      balance: card.balance || 0,
      spent: card.spentAmount || 0,
      limit: card.spendingLimit || 0,
      expiryDate: card.expiryMonth && card.expiryYear 
        ? `${card.expiryMonth.toString().padStart(2, '0')}/${card.expiryYear.toString().slice(-2)}`
        : 'N/A',
      createdAt: (card as any).createdAt || new Date().toISOString(),
      status: card.status,
      id: card.id,
      rawBalance: card.balance || 0
    }));

  // Update sorted data when cards change
  useEffect(() => {
    setSortedData(activeCardsData);
  }, [cards, activeCardsData.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        closeDropdown();
      }
    };

    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdownId]);

  const sortData = (column: string) => {
    const sorted = [...sortedData].sort((a, b) => {
      let aValue, bValue;
      
      switch(column) {
        case 'cardNumber':
          aValue = a.cardNumber;
          bValue = b.cardNumber;
          break;
        case 'balance':
          aValue = a.rawBalance;
          bValue = b.rawBalance;
          break;
        case 'spent':
          aValue = a.spent;
          bValue = b.spent;
          break;
        case 'limit':
          aValue = a.limit;
          bValue = b.limit;
          break;
        default:
          aValue = a.cardNumber;
          bValue = b.cardNumber;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setSortedData(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const freezeCard = async (cardId: string) => {
    // Prevent multiple simultaneous operations
    if (isProcessingCard) {
      toast('Please wait for the current operation to complete', {
        position: 'top-center',
      });
      return;
    }

    // Find the card to check its current status
    const card = cards.find(c => c.id === cardId);
    if (!card) {
      showErrorNotification(
        'Card Not Found',
        'Unable to find this card. Please refresh the page and try again.',
        false
      );
      return;
    }

    // Check if card is already frozen
    if (card.status === 'frozen') {
      toast('This card is already frozen', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    // Check if card is in a state that can't be frozen
    if (card.status === 'deleted' || card.status === 'expired') {
      showErrorNotification(
        `Cannot Freeze ${card.status.charAt(0).toUpperCase() + card.status.slice(1)} Card`,
        `This card is ${card.status} and cannot be frozen. ${card.status === 'expired' ? 'Please create a new card if needed.' : ''}`,
        false
      );
      return;
    }

    let loadingToast: string | undefined;
    try {
      // Set processing state
      setIsProcessingCard(cardId);
      
      // Show loading toast
      loadingToast = toast.loading('Freezing card...', {
        position: 'top-center',
      });
      
      // Call API to freeze the card
      await cardApi.freezeCard(cardId);
      
      // Refresh cards data to get updated status
      await fetchCards();
      
      // Update the selected card details if the modal is open
      if (selectedCardDetails && selectedCardDetails.id === cardId) {
        const updatedCard = cards.find(card => card.id === cardId);
        if (updatedCard) {
          setSelectedCardDetails({
            ...selectedCardDetails,
            status: 'frozen'
          });
        }
      }
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Card frozen successfully! The card cannot be used for transactions until unfrozen.', {
        position: 'top-center',
        duration: 4000,
        icon: '🔒',
      });
    } catch (error: any) {
      // Dismiss loading toast if it exists
      if (loadingToast) toast.dismiss(loadingToast);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error?.message;
        if (errorMessage?.includes('already frozen')) {
          toast('This card is already frozen', {
            position: 'top-center',
            duration: 3000,
          });
        } else if (errorMessage?.includes('pending transactions')) {
          showErrorNotification(
            'Cannot Freeze Card',
            'This card has pending transactions that must be completed first. Please wait for all transactions to settle before freezing the card.',
            false
          );
        } else {
          showErrorNotification(
            'Unable to Freeze Card',
            errorMessage || 'The card cannot be frozen at this time due to system restrictions. Please try again later. Contact support if the issue persists.'
          );
        }
      } else if (error.response?.status === 404) {
        showErrorNotification(
          'Card Not Found',
          'This card could not be found in our system. Please refresh the page to see the latest card status.',
          false
        );
      } else if (error.response?.status === 403) {
        showErrorNotification(
          'Permission Denied',
          'You do not have permission to freeze this card. This may be due to account restrictions or security policies.'
        );
      } else if (error.response?.status === 500) {
        showErrorNotification(
          'System Error',
          'Our card management system is experiencing issues. We apologize for the inconvenience. Please try again in a few minutes. Contact support if the issue persists.'
        );
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        showErrorNotification(
          'Request Timeout',
          'The request took too long to process. Please check your internet connection and try again. Contact support if the issue persists.'
        );
      } else {
        showErrorNotification(
          'Failed to Freeze Card',
          'An unexpected error occurred while trying to freeze your card. Please try again. Contact support if the issue persists.'
        );
      }
    } finally {
      // Clear processing state
      setIsProcessingCard(null);
      
      // Dismiss loading toast if it still exists (safety measure)
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    }
  };

  const unfreezeCard = async (cardId: string) => {
    // Prevent multiple simultaneous operations
    if (isProcessingCard) {
      toast('Please wait for the current operation to complete', {
        position: 'top-center',
      });
      return;
    }

    // Find the card to check its current status
    const card = cards.find(c => c.id === cardId);
    if (!card) {
      showErrorNotification(
        'Card Not Found',
        'Unable to find this card. Please refresh the page and try again.',
        false
      );
      return;
    }

    // Check if card is already active
    if (card.status === 'active') {
      toast('This card is already active', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    // Check if card is in a state that can't be unfrozen
    if (card.status === 'deleted' || card.status === 'expired') {
      showErrorNotification(
        `Cannot Unfreeze ${card.status.charAt(0).toUpperCase() + card.status.slice(1)} Card`,
        `This card is ${card.status} and cannot be unfrozen. ${card.status === 'expired' ? 'Please create a new card if needed.' : ''}`,
        false
      );
      return;
    }

    let loadingToast: string | undefined;
    try {
      // Set processing state
      setIsProcessingCard(cardId);
      
      // Show loading toast
      loadingToast = toast.loading('Unfreezing card...', {
        position: 'top-center',
      });
      
      // Call API to unfreeze the card
      await cardApi.unfreezeCard(cardId);
      
      // Refresh cards data to get updated status
      await fetchCards();
      
      // Update the selected card details if the modal is open
      if (selectedCardDetails && selectedCardDetails.id === cardId) {
        const updatedCard = cards.find(card => card.id === cardId);
        if (updatedCard) {
          setSelectedCardDetails({
            ...selectedCardDetails,
            status: 'active'
          });
        }
      }
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Card unfrozen successfully! The card is now active and ready for use.', {
        position: 'top-center',
        duration: 4000,
        icon: '✅',
      });
    } catch (error: any) {
      // Dismiss loading toast if it exists
      if (loadingToast) toast.dismiss(loadingToast);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.error?.message;
        if (errorMessage?.includes('already active')) {
          toast('This card is already active', {
            position: 'top-center',
            duration: 3000,
          });
        } else if (errorMessage?.includes('insufficient balance')) {
          showErrorNotification(
            'Insufficient Balance',
            'Your account does not have enough balance to unfreeze this card. Please add funds to your account before unfreezing the card.',
            true
          );
        } else if (errorMessage?.includes('security hold')) {
          showErrorNotification(
            'Security Hold',
            'This card is under a security hold and cannot be unfrozen at this time. Please contact our support team for assistance with removing the security hold.',
            true
          );
        } else if (errorMessage?.includes('compliance')) {
          showErrorNotification(
            'Compliance Review Required',
            'This card requires a compliance review before it can be unfrozen. Our team will review your account within 24-48 hours.',
            true
          );
        } else {
          showErrorNotification(
            'Unable to Unfreeze Card',
            errorMessage || 'The card cannot be unfrozen at this time due to system restrictions. Please try again later. Contact support if the issue persists.'
          );
        }
      } else if (error.response?.status === 404) {
        showErrorNotification(
          'Card Not Found',
          'This card could not be found in our system. Please refresh the page to see the latest card status.',
          false
        );
      } else if (error.response?.status === 403) {
        showErrorNotification(
          'Permission Denied',
          'You do not have permission to unfreeze this card. This may be due to account restrictions or verification requirements.'
        );
      } else if (error.response?.status === 500) {
        showErrorNotification(
          'System Error',
          'Our card management system is experiencing issues. We apologize for the inconvenience. Please try again in a few minutes. Contact support if the issue persists.'
        );
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        showErrorNotification(
          'Request Timeout',
          'The request took too long to process. Please check your internet connection and try again. Contact support if the issue persists.'
        );
      } else {
        showErrorNotification(
          'Failed to Unfreeze Card',
          'An unexpected error occurred while trying to unfreeze your card. Please try again. Contact support if the issue persists.'
        );
      }
    } finally {
      // Clear processing state
      setIsProcessingCard(null);
      
      // Dismiss loading toast if it still exists (safety measure)
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    }
  };

  const toggleDropdown = (cardId: string) => {
    setOpenDropdownId(openDropdownId === cardId ? null : cardId);
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  const handleCardClick = (card: any) => {
    setSelectedCardDetails(card);
    setIsCardDetailsModalOpen(true);
    setIsCardNumberRevealed(false);
    closeDropdown(); // Close any open dropdown when modal opens
  };

  const toggleCardModal = () => {
    const wasOpen = isCardModalOpen;
    setIsCardModalOpen(!isCardModalOpen);
    
    // If we're closing the modal, refresh cards in case a new card was created
    if (wasOpen) {
      fetchCards();
    }
  };

  return (
    <div className="col-span-12 box overflow-hidden">
      <div className="flex flex-wrap gap-4 justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium text-lg">Your Cards</p>
        <button 
          onClick={toggleCardModal}
          className="flex items-center gap-1 bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-sm"
        >
          <i className="las la-plus text-sm"></i>
          <span>Add New Card</span>
        </button>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (!sortedData || sortedData.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No active cards found</p>
          </div>
        ) : (
          <table className="w-full whitespace-nowrap min-w-[600px]">
            <thead>
              <tr className="bg-secondary/5 dark:bg-bg3">
                <th onClick={() => sortData("cardNumber")} className="text-start py-3 sm:py-4 px-3 sm:px-6 cursor-pointer">
                  <div className="flex items-center gap-1">
                    <span className="hidden sm:inline">Card Details</span>
                    <span className="sm:hidden">Card</span>
                    <IconSelector size={18} />
                  </div>
                </th>
                <th onClick={() => sortData("balance")} className="text-start py-3 sm:py-4 px-3 sm:px-4 cursor-pointer">
                  <div className="flex items-center gap-1">
                    Balance
                    <IconSelector size={18} className="hidden sm:inline" />
                  </div>
                </th>
                <th onClick={() => sortData("spent")} className="hidden md:table-cell text-start py-3 sm:py-4 px-3 sm:px-4 cursor-pointer">
                  <div className="flex items-center gap-1">
                    Spent
                    <IconSelector size={18} />
                  </div>
                </th>
                <th onClick={() => sortData("limit")} className="hidden lg:table-cell text-start py-3 sm:py-4 px-3 sm:px-4 cursor-pointer">
                  <div className="flex items-center gap-1">
                    Limit
                    <IconSelector size={18} />
                  </div>
                </th>
                <th className="text-start py-3 sm:py-4 px-3 sm:px-4">
                  Status
                </th>
                <th className="text-center py-3 sm:py-4 px-3 sm:px-4">
                  <span className="hidden sm:inline">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((card, index) => (
                <tr 
                  key={`${card.id}-${index}`} 
                  className="even:bg-secondary/5 dark:even:bg-bg3 hover:bg-secondary/10 dark:hover:bg-bg3/50 transition-colors cursor-pointer"
                  onClick={() => handleCardClick(card)}
                >
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-7 sm:w-12 sm:h-8 bg-gradient-to-r from-primary to-primary/60 rounded flex items-center justify-center flex-shrink-0">
                        <i className="las la-credit-card text-white text-base sm:text-lg"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{card.cardNumber}</p>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                          <span className="truncate max-w-[80px] sm:max-w-none">{card.nickname}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">Expires {card.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <p className="font-semibold text-green-600 text-sm sm:text-base">${card.balance.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 hidden sm:block">Available</p>
                  </td>
                  <td className="hidden md:table-cell py-3 sm:py-4 px-3 sm:px-4">
                    <p className="font-medium text-sm sm:text-base">${card.spent.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Used</p>
                  </td>
                  <td className="hidden lg:table-cell py-3 sm:py-4 px-3 sm:px-4">
                    <p className="font-medium text-sm sm:text-base">${card.limit.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Max</p>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      card.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : card.status === 'frozen'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {card.status === 'active' ? 'Active' : card.status === 'frozen' ? 'Frozen' : card.status}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <button 
                          ref={(el) => { dropdownRefs.current[card.id] = el; }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(card.id);
                          }}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <i className="las la-ellipsis-v text-lg"></i>
                        </button>
                        
                        {/* Dropdown Menu */}
                        <DropdownPortal
                          isOpen={openDropdownId === card.id}
                          onClose={closeDropdown}
                          triggerRef={{ current: dropdownRefs.current[card.id] }}
                        >
                            <div className="py-1">
                              {card.status === 'active' ? (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await freezeCard(card.id);
                                    closeDropdown();
                                  }}
                                  disabled={isProcessingCard === card.id}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isProcessingCard === card.id ? (
                                    <>
                                      <i className="las la-spinner la-spin text-primary"></i>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <i className="las la-snowflake text-primary"></i>
                                      Freeze Card
                                    </>
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await unfreezeCard(card.id);
                                    closeDropdown();
                                  }}
                                  disabled={isProcessingCard === card.id}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isProcessingCard === card.id ? (
                                    <>
                                      <i className="las la-spinner la-spin text-warning"></i>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <i className="las la-sun text-warning"></i>
                                      Unfreeze Card
                                    </>
                                  )}
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Implement update limit functionality
                                  closeDropdown();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                              >
                                <i className="las la-chart-line text-primary"></i>
                                Update Limit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to transactions page
                                  window.location.href = `/cards/card-details?cardId=${card.id}`;
                                  closeDropdown();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                              >
                                <i className="las la-list text-blue-600"></i>
                                View Transactions
                              </button>
                              <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Implement delete card functionality
                                  closeDropdown();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                              >
                                <i className="las la-trash text-red-600"></i>
                                Delete Card
                              </button>
                            </div>
                        </DropdownPortal>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {sortedData && sortedData.length > 0 && (
        <Link className="text-primary font-semibold inline-flex gap-1 items-center mt-6 group" href="/cards/card-overview">
          View All Cards <i className="las la-arrow-right group-hover:pl-2 duration-300"></i>
        </Link>
      )}

      {/* Add New Card Modal - Use proper AddCard component */}
      <AddCard open={isCardModalOpen} toggleOpen={toggleCardModal} />

      {/* Card Details Modal */}
      <Modal toggleOpen={() => setIsCardDetailsModalOpen(false)} open={isCardDetailsModalOpen} width="max-w-[600px] lg:top-24">
        {selectedCardDetails && (
          <div>
            <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
              <h4 className="h4">Card Details</h4>
            </div>
            
            {/* Glassmorphism Card Visual */}
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-2xl h-[300px]">
                {/* Background geometric pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
                  {/* Floating geometric shapes */}
                  <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rotate-45 opacity-90"></div>
                  <div className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rotate-12 opacity-80"></div>
                  <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 -rotate-30 opacity-85"></div>
                  <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-orange-400 to-red-500 rotate-60 opacity-90"></div>
                  
                  {/* Hexagon pattern */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 opacity-70" style={{clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'}}></div>
                  </div>
                </div>
                
                <div className="relative h-full">
                  {/* Shapes touching the card border for 3D effect */}
                  <div className="absolute -top-4 left-1/4 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rotate-45 z-20"></div>
                  <div className="absolute -bottom-3 right-1/3 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rotate-12 z-20"></div>
                  <div className="absolute top-1/2 -left-3 w-6 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-r-lg z-20"></div>
                  <div className="absolute top-1/3 -right-4 w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-l-full z-20"></div>
                  
                  {/* Main card */}
                  <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/30 to-white/10 dark:from-gray-800/30 dark:to-gray-800/10 backdrop-blur-sm p-8 flex flex-col justify-between border-2 border-white/50 dark:border-gray-600/50 shadow-2xl">
                    {/* Glass effect overlay with highlights */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-700/10 dark:to-gray-700/5"></div>
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/40"></div>
                    <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-white/60 to-transparent dark:via-white/30"></div>
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-black/30"></div>
                    <div className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-black/10 to-transparent dark:via-black/30"></div>
                    
                    {/* Card content */}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Virtual Card</p>
                          <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{selectedCardDetails.nickname}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${selectedCardDetails.status === 'active' ? 'bg-green-400' : selectedCardDetails.status === 'frozen' ? 'bg-blue-400' : 'bg-yellow-400'}`}></div>
                          <span className="text-gray-600 dark:text-gray-400 text-xs capitalize">{selectedCardDetails.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-end">
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-900 dark:text-gray-100 font-mono text-lg tracking-wider">
                              {isCardNumberRevealed 
                                ? '4532 1234 5678 ' + selectedCardDetails.cardNumber.slice(-4)
                                : selectedCardDetails.cardNumber.replace(/\*/g, '•')
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">Balance</p>
                            <p className="text-gray-900 dark:text-gray-100 font-semibold text-xl">
                              ${selectedCardDetails.balance.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Expires</p>
                          <p className="text-gray-900 dark:text-gray-100 font-mono mb-3">{selectedCardDetails.expiryDate}</p>
                          <button
                            onClick={() => setIsCardNumberRevealed(!isCardNumberRevealed)}
                            className="bg-white/20 hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 text-gray-900 dark:text-gray-100 border border-white/30 dark:border-gray-600/30"
                          >
                            <i className={`las ${isCardNumberRevealed ? 'la-eye-slash' : 'la-eye'} text-lg`}></i>
                            <span>{isCardNumberRevealed ? 'Hide Number' : 'Reveal Number'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card design elements */}
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Card Type</p>
                  <p className="font-medium">{selectedCardDetails.cardType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedCardDetails.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : selectedCardDetails.status === 'frozen'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {selectedCardDetails.status === 'active' ? 'Active' : selectedCardDetails.status === 'frozen' ? 'Frozen' : selectedCardDetails.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance</p>
                  <p className="font-semibold text-green-600">${selectedCardDetails.balance.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Spent</p>
                  <p className="font-medium">${selectedCardDetails.spent.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Limit</p>
                  <p className="font-medium">${selectedCardDetails.limit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available</p>
                  <p className="font-medium">${(selectedCardDetails.limit - selectedCardDetails.spent).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="mt-6 pt-6 border-t dark:border-gray-700">
              <h5 className="font-semibold mb-3">Quick Actions</h5>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {selectedCardDetails.status === 'active' ? (
                  <button 
                    onClick={async () => {
                      await freezeCard(selectedCardDetails.id);
                      // Don't close modal immediately - wait for success/error
                    }}
                    disabled={isProcessingCard === selectedCardDetails.id}
                    className="bg-secondary/10 hover:bg-secondary/20 text-secondary px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingCard === selectedCardDetails.id ? (
                      <>
                        <i className="las la-spinner la-spin"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="las la-snowflake"></i>
                        Freeze Card
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={async () => {
                      await unfreezeCard(selectedCardDetails.id);
                      // Don't close modal immediately - wait for success/error
                    }}
                    disabled={isProcessingCard === selectedCardDetails.id}
                    className="bg-warning/10 hover:bg-warning/20 text-warning px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessingCard === selectedCardDetails.id ? (
                      <>
                        <i className="las la-spinner la-spin"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="las la-sun"></i>
                        Unfreeze Card
                      </>
                    )}
                  </button>
                )}
                <button 
                  onClick={() => {
                    // TODO: Implement update limit functionality
                    setIsCardDetailsModalOpen(false);
                  }}
                  className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="las la-chart-line"></i>
                  Update Limit
                </button>
                <button 
                  onClick={() => {
                    // Navigate to transactions page
                    setIsCardDetailsModalOpen(false);
                    // Navigate to transactions page with card filter
                    window.location.href = `/cards/card-details?cardId=${selectedCardDetails.id}`;
                  }}
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="las la-list"></i>
                  View Transactions
                </button>
                <button 
                  onClick={() => {
                    // TODO: Implement delete card functionality
                    setIsCardDetailsModalOpen(false);
                  }}
                  className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="las la-trash"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActiveCards;