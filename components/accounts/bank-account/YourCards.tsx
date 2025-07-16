"use client";
import Pagination from "@/components/shared/Pagination";
import Select from "@/components/shared/Select";
import Modal from "@/components/shared/Modal";
import DropdownPortal from "@/components/shared/DropdownPortal";
import Link from "next/link";
import SearchBar from "@/components/shared/SearchBar";
import useTable from "@/utils/useTable";
import { IconSelector } from "@tabler/icons-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCardStore } from "@/stores/cardStore";
import { cardApi } from "@/lib/api/cards";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore";
import AddCard from "@/components/cards/card-overview/AddCard";
import { useTransactionStore } from "@/stores/transactionStore";

type Card = {
  id: string;
  maskedPan: string;
  nickname: string;
  balance: number;
  spentAmount: number;
  spendingLimit: number;
  expiryMonth?: string;
  expiryYear?: string;
  status: 'active' | 'frozen' | 'expired' | 'deleted' | 'suspended';
  type: string;
  isChecked: boolean;
};

const statusOptions = ["All", "Active", "Frozen", "Expired", "Deleted", "Suspended"];
const YourCards = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false);
  const [selectedCardDetails, setSelectedCardDetails] = useState<any>(null);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [newSpendingLimit, setNewSpendingLimit] = useState("");
  const dropdownRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  // States for secure card details
  const [isLoadingFullDetails, setIsLoadingFullDetails] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [fullCardDetails, setFullCardDetails] = useState<any>(null);
  const [remainingTime, setRemainingTime] = useState(30);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // States for inline limit update
  const [inlineLimitCardId, setInlineLimitCardId] = useState<string | null>(null);
  const [inlineNewLimit, setInlineNewLimit] = useState("");
  const [inlineUpdateError, setInlineUpdateError] = useState<string | null>(null);
  const [isInlineUpdating, setIsInlineUpdating] = useState(false);
  const [inlineEditorPosition, setInlineEditorPosition] = useState<{ top: number; left: number } | null>(null);
  
  // Get real cards from store
  const { cards, fetchCards, freezeCard: freezeCardAction, unfreezeCard, deleteCard, isLoading } = useCardStore();
  
  // Get user balance and available balance from store
  const { balance: userBalance, availableBalance, fetchBalance, fetchAvailableBalance } = useUserStore();
  
  // State for inline update limit
  const [isUpdatingLimit, setIsUpdatingLimit] = useState(false);
  const [updateLimitError, setUpdateLimitError] = useState<string | null>(null);
  const [updateLimitSuccess, setUpdateLimitSuccess] = useState<string | null>(null);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  
  // Add New Card Modal State
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  
  // Processing state for freeze/unfreeze
  const [isProcessingCard, setIsProcessingCard] = useState<string | null>(null);
  
  // State for showing transactions in modal
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactionPage, setTransactionPage] = useState(1);
  const transactionsPerPage = 10;
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionStatusFilter, setTransactionStatusFilter] = useState("All");
  
  // State for confirmation dialogs
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'freeze' | 'unfreeze' | null;
    cardId: string | null;
    cardName?: string;
  }>({ type: null, cardId: null });
  
  // State for main table search and filters
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get transactions from store
  const { 
    transactions: cardTransactions, 
    fetchTransactionsByCard, 
    isLoading: isLoadingTransactions 
  } = useTransactionStore();
  
  // Filter transactions based on search and status
  const filteredTransactions = useMemo(() => {
    let filtered = [...cardTransactions];
    
    
    // CRITICAL: Filter by selected card ID first (backend filter isn't working)
    if (selectedCardDetails?.id) {
      filtered = filtered.filter(tx => {
        const matches = tx.cardId === selectedCardDetails.id;
        
        if (!matches) {
        }
        
        return matches;
      });
      
    }
    
    // Apply status filter
    if (transactionStatusFilter !== "All") {
      filtered = filtered.filter(tx => 
        tx.status.toLowerCase() === transactionStatusFilter.toLowerCase()
      );
    }
    
    // Apply search filter
    if (transactionSearch.trim()) {
      const searchLower = transactionSearch.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.merchantName?.toLowerCase().includes(searchLower) ||
        tx.merchantCategory?.toLowerCase().includes(searchLower) ||
        tx.amount.toString().includes(searchLower) ||
        tx.status.toLowerCase().includes(searchLower) ||
        new Date(tx.createdAt).toLocaleDateString().toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [cardTransactions, transactionStatusFilter, transactionSearch, selectedCardDetails?.id]);
  
  // Fetch cards and balance on mount
  useEffect(() => {
    fetchCards();
    fetchBalance();
    fetchAvailableBalance();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-hide timer for secure card details
  useEffect(() => {
    if (showFullDetails && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (remainingTime === 0) {
      handleHideFullDetails();
    }
  }, [showFullDetails, remainingTime]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isCardDetailsModalOpen) {
      setShowFullDetails(false);
      setFullCardDetails(null);
      setRemainingTime(30);
      setCopiedField(null);
      setIsLoadingFullDetails(false);
    }
  }, [isCardDetailsModalOpen]);

  // Close inline limit editor when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inlineLimitCardId) {
        const target = e.target as HTMLElement;
        if (!target.closest('.inline-limit-editor')) {
          setInlineLimitCardId(null);
          setInlineNewLimit('');
          setInlineUpdateError(null);
          setInlineEditorPosition(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [inlineLimitCardId]);

  // Dynamic calculations for limit updates
  const limitCalculations = useMemo(() => {
    if (!selectedCardDetails || !availableBalance) {
      return null;
    }

    const currentUserBalance = availableBalance.accountBalance || 0;
    const currentLimit = selectedCardDetails.spendingLimit;
    const spentAmount = selectedCardDetails.spentAmount;
    const newLimitValue = newSpendingLimit ? parseFloat(newSpendingLimit) : currentLimit;
    
    // Use available balance from API directly
    const availableForIncrease = availableBalance.availableBalance || 0;
    
    // Calculate other cards total for display
    const otherCardsTotal = cards
      .filter(card => card.id !== selectedCardDetails.id && card.status !== 'deleted')
      .reduce((total, card) => total + (card.spendingLimit || 0), 0);
    
    // Calculate the difference
    const limitDifference = newLimitValue - currentLimit;
    
    // For increase: check against available balance
    // For decrease: always valid as long as not below spent amount
    const isValidLimit = limitDifference <= 0 
      ? newLimitValue >= spentAmount 
      : limitDifference <= availableForIncrease && newLimitValue >= spentAmount;
    
    const maxAllowedLimit = currentLimit + availableForIncrease;
    
    return {
      currentBalance: currentUserBalance,
      otherCardsTotal,
      availableForThisCard: availableForIncrease,
      currentLimit,
      newLimit: newLimitValue,
      limitDifference,
      maxAllowedLimit,
      isValidLimit,
      spentAmount,
      isIncrease: limitDifference > 0,
      isDecrease: limitDifference < 0,
      remainingAfterUpdate: newLimitValue - spentAmount
    };
  }, [selectedCardDetails, availableBalance, cards, newSpendingLimit]);
  
  // Map real cards to component format - memoized to prevent infinite re-renders
  const realCards: Card[] = useMemo(() => {
    return cards.map(card => {
      // Calculate actual balance - API returns remainingBalance
      const currentBalance = card.remainingBalance || 0;
      const spent = card.spentAmount || 0;
      const limit = card.spendingLimit || 0;
      
      return {
        id: card.id,
        maskedPan: card.maskedPan,
        nickname: card.nickname || `Card ending in ${card.maskedPan.slice(-4)}`,
        balance: currentBalance,
        spentAmount: spent,
        spendingLimit: limit,
        expiryMonth: card.expiryMonth || '12',
        expiryYear: card.expiryYear || '2027',
        status: card.status,
        type: card.type === 'multi_use' ? 'Multi-use Card' : 'Single-use Card',
        isChecked: false,
      };
    });
  }, [cards]); // Only recalculate when cards data changes
  
  // Combined filtering and search logic
  const filteredData = useMemo(() => {
    let filtered = [...realCards];
    
    // Apply status filter
    if (selectedStatus !== "All") {
      filtered = filtered.filter((card: Card) => {
        const cardStatus = card.status === 'active' ? 'Active' : 
                          card.status === 'frozen' ? 'Frozen' :
                          card.status === 'expired' ? 'Expired' :
                          card.status === 'deleted' ? 'Deleted' :
                          card.status === 'suspended' ? 'Suspended' : '';
        return cardStatus === selectedStatus;
      });
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((card: Card) => 
        card.maskedPan.toLowerCase().includes(searchLower) ||
        card.nickname.toLowerCase().includes(searchLower) ||
        card.status.toLowerCase().includes(searchLower) ||
        card.type.toLowerCase().includes(searchLower) ||
        card.balance.toString().includes(searchLower) ||
        card.spendingLimit.toString().includes(searchLower)
      );
    }
    
    return filtered;
  }, [realCards, selectedStatus, searchTerm]);

  // Use useTable with the filtered data  
  const { sortData, currentPage, endIndex, nextPage, paginate, prevPage, startIndex, tableData, totalData, totalPages } = useTable(filteredData, isDashboard ? 5 : 8);

  const toggleDropdown = (cardId: string) => {
    setOpenDropdownId(openDropdownId === cardId ? null : cardId);
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  const handleFreezeCard = async (cardId: string, skipConfirmation: boolean = false) => {
    // If not skipping confirmation, show the confirmation dialog
    if (!skipConfirmation) {
      const card = cards.find(c => c.id === cardId);
      setConfirmAction({
        type: card?.status === 'active' ? 'freeze' : 'unfreeze',
        cardId: cardId,
        cardName: card?.nickname || card?.maskedPan || 'this card'
      });
      return;
    }
    
    // Prevent multiple simultaneous operations
    if (isProcessingCard) {
      toast('Please wait for the current operation to complete', {
        position: 'top-center',
      });
      return;
    }
    
    setIsProcessingCard(cardId);
    let loadingToast: any;
    
    try {
      const card = cards.find(c => c.id === cardId);
      if (!card) {
        toast.error('Card not found. Please refresh the page and try again.', {
          position: 'top-center',
          autoClose: 4000,
        });
        setIsProcessingCard(null);
        return;
      }
      
      loadingToast = toast.loading(
        card.status === 'active' ? 'Freezing card...' : 'Unfreezing card...', 
        { position: 'top-center' }
      );
      
      if (card.status === 'active') {
        await freezeCardAction(cardId);
        toast.dismiss(loadingToast);
        toast.success('Card frozen successfully! The card cannot be used for transactions until unfrozen.', {
          position: 'top-center',
          autoClose: 4000,
        });
      } else if (card.status === 'frozen') {
        await unfreezeCard(cardId);
        toast.dismiss(loadingToast);
        toast.success('Card unfrozen successfully! The card is now active and ready for use.', {
          position: 'top-center',
          autoClose: 4000,
        });
      }
      closeDropdown();
    } catch (error: any) {
      
      // Dismiss loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
      
      // Detailed error handling based on response
      if (error.response?.status === 400) {
        const errorCode = error.response?.data?.error?.code;
        const errorMessage = error.response?.data?.error?.message;
        
        if (errorCode === 'INSUFFICIENT_BALANCE') {
          toast.error(
            'Insufficient Balance: Your account balance is too low to perform this action. Please add funds to continue.',
            {
              position: 'top-center',
              autoClose: 6000,
            }
          );
        } else if (errorCode === 'CARD_ALREADY_FROZEN') {
          toast('This card is already frozen.', {
            position: 'top-center',
            autoClose: 3000,
          });
        } else if (errorCode === 'CARD_NOT_FROZEN') {
          toast('This card is already active.', {
            position: 'top-center',
            autoClose: 3000,
          });
        } else if (errorMessage?.includes('pending transactions')) {
          toast.error(
            'Cannot freeze card: This card has pending transactions that must be completed first. Please wait for all transactions to settle.',
            {
              position: 'top-center',
              autoClose: 6000,
            }
          );
        } else if (errorMessage?.includes('security hold')) {
          toast.error(
            'Security Hold: This card is under a security hold. Please contact support for assistance: support@velocards.com',
            {
              position: 'top-center',
              autoClose: 8000,
            }
          );
        } else if (errorMessage?.includes('compliance')) {
          toast.error(
            'Compliance Review Required: Your account requires additional verification. Please check your email or contact support.',
            {
              position: 'top-center',
              autoClose: 8000,
            }
          );
        } else {
          toast.error(
            errorMessage || 'Unable to update card status. Please try again. Contact support at support@velocards.com if the issue persists.',
            {
              position: 'top-center',
              autoClose: 6000,
            }
          );
        }
      } else if (error.response?.status === 403) {
        toast.error(
          'Permission Denied: You do not have permission to modify this card. This may be due to account restrictions. Contact support for help.',
          {
            position: 'top-center',
            autoClose: 8000,
          }
        );
      } else if (error.response?.status === 422) {
        toast.error(
          'Verification Required: Please complete the KYC process to continue using card services. Visit your profile to start verification.',
          {
            position: 'top-center',
            autoClose: 8000,
          }
        );
      } else if (error.response?.status === 500) {
        toast.error(
          'System Error: Our card management system is experiencing issues. Please try again in a few minutes. Contact support if the issue persists.',
          {
            position: 'top-center',
            autoClose: 6000,
          }
        );
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error(
          'Request Timeout: The request took too long. Please check your internet connection and try again. Contact support if the issue persists.',
          {
            position: 'top-center',
            autoClose: 6000,
          }
        );
      } else {
        toast.error(
          'Connection Error: Unable to connect to our servers. Please check your internet connection and try again. If the problem persists, contact support.',
          {
            position: 'top-center',
            autoClose: 8000,
          }
        );
      }
    } finally {
      // Always clear processing state
      setIsProcessingCard(null);
      
      // Dismiss loading toast if it still exists
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    }
  };
  
  const handleDeleteCard = async (cardId: string, skipConfirmation: boolean = false) => {
    // If not skipping confirmation, show the confirmation dialog
    if (!skipConfirmation) {
      const card = cards.find(c => c.id === cardId);
      setConfirmAction({
        type: 'delete',
        cardId: cardId,
        cardName: card?.nickname || card?.maskedPan || 'this card'
      });
      return;
    }
    
    // Start processing
    setIsProcessingCard(cardId);
    let loadingToast: any = null;
    
    try {
      loadingToast = toast.loading('Deleting card...', { position: 'top-center' });
      
      // Call the deleteCard function from the store
      await deleteCard(cardId);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success message
      toast.success('Card deleted successfully! The card has been permanently removed from your account.', {
        position: 'top-center',
        autoClose: 4000,
      });
      
      // Close any open dropdowns
      closeDropdown();
      
      // Close the card details modal if open
      if (isCardDetailsModalOpen) {
        setIsCardDetailsModalOpen(false);
        setSelectedCardDetails(null);
      }
      
      // Refresh the available balance after deletion
      await fetchAvailableBalance();
      
    } catch (error: any) {
      console.error('Error deleting card:', error);
      
      // Dismiss loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorCode = error.response?.data?.error?.code;
        const errorMessage = error.response?.data?.error?.message;
        
        if (errorCode === 'CARD_HAS_BALANCE') {
          toast.error(
            'Cannot Delete Card: This card still has a remaining balance. Please transfer or spend the balance before deleting.',
            {
              position: 'top-center',
              autoClose: 6000,
            }
          );
        } else if (errorCode === 'CARD_HAS_PENDING_TRANSACTIONS') {
          toast.error(
            'Cannot Delete Card: This card has pending transactions. Please wait for all transactions to complete before deleting.',
            {
              position: 'top-center',
              autoClose: 6000,
            }
          );
        } else if (errorCode === 'CARD_ALREADY_DELETED') {
          toast('This card has already been deleted.', {
            position: 'top-center',
            autoClose: 3000,
          });
          // Refresh cards to update the UI
          await fetchCards();
        } else {
          toast.error(
            errorMessage || 'Unable to delete card. Please try again later.',
            {
              position: 'top-center',
              autoClose: 5000,
            }
          );
        }
      } else if (error.response?.status === 403) {
        toast.error(
          'Permission Denied: You do not have permission to delete this card. Contact support for assistance.',
          {
            position: 'top-center',
            autoClose: 6000,
          }
        );
      } else if (error.response?.status === 404) {
        toast.error(
          'Card Not Found: This card may have already been deleted.',
          {
            position: 'top-center',
            autoClose: 4000,
          }
        );
        // Refresh cards to update the UI
        await fetchCards();
      } else if (error.response?.status === 500) {
        toast.error(
          'System Error: Unable to delete the card at this time. Please try again later or contact support.',
          {
            position: 'top-center',
            autoClose: 6000,
          }
        );
      } else {
        toast.error(
          error.response?.data?.error?.message || 'Failed to delete card. Please check your connection and try again.',
          {
            position: 'top-center',
            autoClose: 5000,
          }
        );
      }
    } finally {
      // Always clear processing state
      setIsProcessingCard(null);
      
      // Dismiss loading toast if it still exists
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    }
  };

  const handleRevealFullDetails = async () => {
    if (!selectedCardDetails) return;
    
    setIsLoadingFullDetails(true);
    try {
      const { data } = await cardApi.getFullCardDetails(selectedCardDetails.id);
      setFullCardDetails(data.cardDetails);
      setShowFullDetails(true);
      setRemainingTime(30);
    } catch (error: any) {
      console.error('Failed to fetch card details:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to fetch card details');
    } finally {
      setIsLoadingFullDetails(false);
    }
  };

  const handleHideFullDetails = () => {
    setShowFullDetails(false);
    setFullCardDetails(null);
    setRemainingTime(30);
    setCopiedField(null);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatCardNumber = (pan: string) => {
    return pan.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleInlineLimitUpdate = async (cardId: string) => {
    if (!inlineNewLimit) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    
    const newLimit = parseFloat(inlineNewLimit);
    
    // Basic validation
    if (isNaN(newLimit) || newLimit <= 0) {
      setInlineUpdateError('Please enter a valid limit');
      return;
    }
    
    // Check if new limit is less than already spent amount
    const spentAmount = card.spentAmount || 0;
    if (newLimit < spentAmount) {
      setInlineUpdateError(`Limit cannot be less than spent ($${spentAmount.toFixed(2)})`);
      return;
    }
    
    // Calculate the difference from current limit
    const currentLimit = card.spendingLimit || 0;
    const limitDifference = newLimit - currentLimit;
    
    // For increases, check against available balance
    if (limitDifference > 0) {
      const maxAvailable = availableBalance?.availableBalance || 0;
      
      if (limitDifference > maxAvailable) {
        setInlineUpdateError(`Insufficient balance. Max: $${(currentLimit + maxAvailable).toFixed(2)}`);
        return;
      }
    }
    
    setIsInlineUpdating(true);
    setInlineUpdateError(null);
    
    try {
      await cardApi.updateSpendingLimit(cardId, newLimit);
      await fetchCards();
      await fetchBalance();
      await fetchAvailableBalance();
      const changeText = limitDifference > 0 
        ? `increased by $${limitDifference.toFixed(2)}` 
        : `decreased by $${Math.abs(limitDifference).toFixed(2)}`;
      toast.success(`Limit ${changeText}`);
      setInlineLimitCardId(null);
      setInlineNewLimit('');
      setInlineEditorPosition(null);
    } catch (error: any) {
      console.error('Failed to update limit:', error);
      setInlineUpdateError(error.response?.data?.error?.message || 'Failed to update limit');
    } finally {
      setIsInlineUpdating(false);
    }
  };

  const handleUpdateLimit = async () => {
    if (!selectedCardDetails || !newSpendingLimit) return;
    
    setUpdateLimitError(null);
    const newLimit = parseFloat(newSpendingLimit);
    
    // Basic validation
    if (isNaN(newLimit) || newLimit <= 0) {
      setUpdateLimitError('Please enter a valid spending limit greater than 0');
      return;
    }
    
    // Check if new limit is less than already spent amount
    if (newLimit < selectedCardDetails.spentAmount) {
      setUpdateLimitError(`New limit cannot be less than the already spent amount ($${selectedCardDetails.spentAmount.toFixed(2)})`);
      return;
    }
    
    // Use available balance from API
    const currentLimit = selectedCardDetails.spendingLimit;
    const limitDifference = newLimit - currentLimit;
    
    // For increases, check against available balance
    if (limitDifference > 0) {
      const maxAvailable = availableBalance?.availableBalance || 0;
      
      if (limitDifference > maxAvailable) {
        setUpdateLimitError(
          `Insufficient balance. You can only add up to $${maxAvailable.toFixed(2)} to this card's limit.`
        );
        return;
      }
    }
    
    try {
      // Update spending limit via API
      await cardApi.updateSpendingLimit(selectedCardDetails.id, newLimit);
      
      // Refresh cards data from server using Zustand
      await fetchCards();
      
      // Get fresh card data from Zustand store using store's get method
      const { cards: freshCards } = useCardStore.getState();
      const updatedCard = freshCards.find(card => card.id === selectedCardDetails.id);
      
      if (updatedCard) {
        // Update the selected card details with fresh data from Zustand store
        setSelectedCardDetails({
          ...selectedCardDetails,
          spendingLimit: updatedCard.spendingLimit || newLimit,
          balance: updatedCard.remainingBalance || selectedCardDetails.balance,
          spentAmount: updatedCard.spentAmount || selectedCardDetails.spentAmount
        });
      } else {
        // Fallback to manual update if card not found in store
        setSelectedCardDetails({
          ...selectedCardDetails,
          spendingLimit: newLimit
        });
      }
      
      setUpdateLimitSuccess('Spending limit updated successfully! Your new limit is now active.');
      setNewSpendingLimit('');
      setUpdateLimitError(null);
      
      // Auto-hide success message and close update form after 3 seconds
      setTimeout(() => {
        setUpdateLimitSuccess(null);
        setIsUpdatingLimit(false);
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to update spending limit';
      setUpdateLimitError(errorMessage);
      // Don't change isUpdatingLimit on error - keep the form open
    }
  };


  const handleCardClick = (card: any) => {
    setSelectedCardDetails(card);
    setIsCardDetailsModalOpen(true);
    setShowSecurityInfo(false);
    setIsUpdatingLimit(false); // Reset update limit state when opening modal
    setNewSpendingLimit('');
    setUpdateLimitError(null);
    closeDropdown(); // Close any open dropdown when modal opens
  };

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

  return (
    <div className="box col-span-12 lg:col-span-6">
      <div className="flex flex-wrap gap-4 justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        {isDashboard ? <p className="font-medium">Your Cards</p> : <h4 className="h4">Your Cards</h4>}
        <div className="flex flex-wrap items-center gap-4 grow sm:justify-end">
          <div className="flex items-center gap-3 whitespace-nowrap">
            <span className="text-sm font-medium">Filter by Status:</span>
            <Select setSelected={setSelectedStatus} selected={selectedStatus} items={statusOptions} btnClass="rounded-[32px] bg-primary/5 md:py-2.5 min-w-[140px]" contentClass="w-full" />
          </div>
          <SearchBar search={(term: string) => setSearchTerm(term)} classes="bg-primary/5" />
          <button 
            onClick={() => setIsAddCardModalOpen(true)}
            className="flex items-center gap-1 bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            <i className="las la-plus text-sm"></i>
            <span>Add New Card</span>
          </button>
        </div>
      </div>
      <div className={`overflow-x-auto -mx-4 sm:mx-0 mb-4 lg:mb-6 ${isDashboard ? '' : 'min-h-[400px]'}`}>
        <table className="w-full whitespace-nowrap table-fixed min-w-[600px]">
          <colgroup>
            <col className="w-[40%] sm:w-[35%]" />
            <col className="w-[20%] sm:w-[15%]" />
            <col className="w-[0%] sm:w-[15%]" />
            <col className="w-[0%] lg:w-[15%]" />
            <col className="w-[25%] sm:w-[12%]" />
            <col className="w-[15%] sm:w-[8%]" />
          </colgroup>
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th onClick={() => sortData("nickname")} className="text-start py-3 sm:py-4 px-3 sm:px-6 cursor-pointer">
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
              <th onClick={() => sortData("spentAmount")} className="hidden sm:table-cell text-start py-3 sm:py-4 px-3 sm:px-4 cursor-pointer">
                <div className="flex items-center gap-1">
                  Spent
                  <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("spendingLimit")} className="hidden lg:table-cell text-start py-3 sm:py-4 px-3 sm:px-4 cursor-pointer">
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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <i className="las la-spinner la-spin text-3xl text-primary"></i>
                  </div>
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No cards found</p>
                </td>
              </tr>
            ) : tableData.map((card: Card) => (
              <tr 
                key={card.id} 
                className="even:bg-secondary/5 dark:even:bg-bg3 hover:bg-secondary/10 dark:hover:bg-bg3/50 transition-colors cursor-pointer"
                onClick={() => handleCardClick(card)}
              >
                <td className="py-3 sm:py-4 px-3 sm:px-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-7 sm:w-12 sm:h-8 bg-gradient-to-r from-primary to-primary/60 rounded flex items-center justify-center flex-shrink-0">
                      <i className="las la-credit-card text-white text-base sm:text-lg"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{card.maskedPan}</p>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                        <span className="truncate max-w-[80px] sm:max-w-none">{card.nickname}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">Expires {card.expiryMonth?.toString().padStart(2, '0') || '12'}/{card.expiryYear?.toString().slice(-2) || '27'}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 sm:py-4 px-3 sm:px-4">
                  <p className="font-semibold text-green-600 text-sm sm:text-base">${card.balance.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 hidden sm:block">Available</p>
                </td>
                <td className="hidden sm:table-cell py-3 sm:py-4 px-3 sm:px-4">
                  <p className="font-medium text-sm sm:text-base">${card.spentAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Used</p>
                </td>
                <td className="hidden lg:table-cell py-3 sm:py-4 px-3 sm:px-4">
                  <div className="relative">
                    <div 
                      className="inline-limit-editor group cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setInlineEditorPosition({
                          top: rect.top - 200, // Position above
                          left: rect.left
                        });
                        setInlineLimitCardId(card.id);
                        setInlineNewLimit(''); // Start empty for adding amount
                        setInlineUpdateError(null);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm sm:text-base">${card.spendingLimit.toFixed(2)}</p>
                        <i className="las la-edit text-gray-400 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100"></i>
                      </div>
                      <p className="text-xs text-gray-500">Max</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 sm:py-4 px-3 sm:px-4">
                  <span className={`inline-flex items-center justify-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium capitalize min-w-[60px] sm:min-w-[80px] ${
                    card.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : card.status === 'frozen'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : card.status === 'expired'
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      : card.status === 'deleted'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : card.status === 'suspended'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {card.status}
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
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                closeDropdown();
                                await handleFreezeCard(card.id);
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
                                  {card.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
                                </>
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(card);
                                closeDropdown();
                                // Open modal first, then enable update limit mode
                                setTimeout(() => {
                                  setIsUpdatingLimit(true);
                                  setNewSpendingLimit(card.spendingLimit.toString());
                                  setUpdateLimitError(null);
                                  setUpdateLimitSuccess(null);
                                }, 100);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                            >
                              <i className="las la-chart-line text-primary"></i>
                              Update Limit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('View transactions for:', card.id);
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
                                closeDropdown();
                                handleDeleteCard(card.id);
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
      </div>
      
      {/* Inline Limit Editor - Rendered outside table */}
      {inlineLimitCardId && inlineEditorPosition && (
        <div 
          className="inline-limit-editor fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-3 w-[240px]"
          style={{
            top: `${inlineEditorPosition.top}px`,
            left: `${inlineEditorPosition.left}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Update Limit</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setInlineLimitCardId(null);
                setInlineNewLimit('');
                setInlineUpdateError(null);
                setInlineEditorPosition(null);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i className="las la-times text-lg"></i>
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Max allowed: <span className="font-semibold text-primary">${availableBalance?.availableBalance?.toFixed(2) || '0.00'}</span>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const selectedCard = realCards.find(c => c.id === inlineLimitCardId);
                if (selectedCard) {
                  const maxLimit = selectedCard.spendingLimit + (availableBalance?.availableBalance || 0);
                  setInlineNewLimit(maxLimit.toFixed(2));
                  setInlineUpdateError(null);
                }
              }}
              className="text-[11px] px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
            >
              Max
            </button>
          </div>
          
          {inlineUpdateError && (
            <div className="mb-2 text-xs text-red-600 dark:text-red-400">
              {inlineUpdateError}
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              type="number"
              value={inlineNewLimit}
              onChange={(e) => {
                setInlineNewLimit(e.target.value);
                setInlineUpdateError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleInlineLimitUpdate(inlineLimitCardId);
                } else if (e.key === 'Escape') {
                  setInlineLimitCardId(null);
                  setInlineNewLimit('');
                  setInlineUpdateError(null);
                  setInlineEditorPosition(null);
                }
              }}
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="New limit amount"
              min="0"
              step="0.01"
              autoFocus
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleInlineLimitUpdate(inlineLimitCardId);
              }}
              disabled={isInlineUpdating}
              className="px-2 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[32px]"
            >
              {isInlineUpdating ? (
                <i className="las la-spinner la-spin text-sm"></i>
              ) : (
                <i className="las la-check text-sm"></i>
              )}
            </button>
          </div>
        </div>
      )}
      
      {tableData.length > 0 ? (
        isDashboard ? (
          <Link href="/cards/" className="text-primary font-semibold inline-flex gap-1 items-center mt-6 group">
            View All Cards 
            <i className="las la-arrow-right group-hover:pl-2 duration-300"></i>
          </Link>
        ) : (
          <Pagination totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} startIndex={startIndex} endIndex={endIndex} prevPage={prevPage} total={totalData} goToPage={(page: number) => paginate(page)} />
        )
      ) : (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center mx-auto max-w-[500px] max-md:flex flex-col items-center">
            <div className="px-5 lg:px-14 xl:px-24 mb-5">
              <i className={`las text-primary text-7xl ${
                realCards.length === 0 ? 'la-credit-card' : 
                searchTerm ? 'la-search' : 'la-filter'
              }`}></i>
            </div>
            <h3 className="h3 mb-3 lg:mb-6">
              {realCards.length === 0 
                ? 'No cards created yet' 
                : searchTerm 
                ? 'No matching cards found'
                : 'No cards found'}
            </h3>
            <p className="mb-4">
              {realCards.length === 0 
                ? 'Create your first virtual card to get started with secure online payments.' 
                : searchTerm 
                ? `No cards match your search "${searchTerm}". Try a different search term or clear the search to see all cards.`
                : selectedStatus !== "All"
                ? `No cards match the selected "${selectedStatus}" status. Try selecting a different status filter.`
                : 'No cards available at the moment.'}
            </p>
            {realCards.length === 0 ? (
              <button 
                onClick={() => setIsAddCardModalOpen(true)}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Create Your First Card
              </button>
            ) : (searchTerm || selectedStatus !== "All") && (
              <div className="flex gap-3 flex-wrap justify-center">
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                {selectedStatus !== "All" && (
                  <button 
                    onClick={() => setSelectedStatus("All")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Show All Cards
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card Details Modal */}
      <Modal 
        toggleOpen={() => {
          setIsCardDetailsModalOpen(false);
          setIsUpdatingLimit(false);
          setNewSpendingLimit('');
          setUpdateLimitError(null);
          setIsSubmittingUpdate(false);
          setShowTransactions(false);
        }} 
        open={isCardDetailsModalOpen} 
        width={showTransactions ? "max-w-[1400px] lg:top-10" : "max-w-[600px] lg:top-24"}
      >
        {selectedCardDetails && (
          <div className={showTransactions ? "flex gap-0" : ""}>
            {/* Card Details Section */}
            <div className={showTransactions ? "w-[600px] pr-6 border-r dark:border-gray-700" : ""}>
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
                          <div className={`w-2 h-2 rounded-full ${
                            selectedCardDetails.status === 'active' ? 'bg-green-400' : 
                            selectedCardDetails.status === 'frozen' ? 'bg-blue-400' :
                            selectedCardDetails.status === 'expired' ? 'bg-gray-400' :
                            selectedCardDetails.status === 'deleted' ? 'bg-red-400' :
                            selectedCardDetails.status === 'suspended' ? 'bg-yellow-400' :
                            'bg-gray-400'
                          }`}></div>
                          <span className="text-gray-600 dark:text-gray-400 text-xs capitalize">{selectedCardDetails.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-end">
                        <div className="space-y-3">
                          <div>
                            {!showFullDetails && (
                              <p className="text-gray-900 dark:text-gray-100 font-mono text-lg tracking-wider">
                                {selectedCardDetails.maskedPan.replace(/\*/g, '•')}
                              </p>
                            )}
                            {showFullDetails && fullCardDetails && (
                              <div className="mt-3 space-y-2">
                                {/* Card Number with Copy */}
                                <div className="flex items-center gap-2">
                                  <div className="flex-1">
                                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Card Number</p>
                                    <p className="text-gray-900 dark:text-gray-100 font-mono text-base select-all">
                                      {formatCardNumber(fullCardDetails.pan)}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(fullCardDetails.pan, 'Card number')}
                                    className="text-gray-500 hover:text-primary transition-colors p-2"
                                    title="Copy card number"
                                  >
                                    <i className={`las ${copiedField === 'Card number' ? 'la-check text-green-600' : 'la-copy'} text-lg`}></i>
                                  </button>
                                </div>
                                
                                {/* CVV and Expiry Row */}
                                <div className="flex gap-4">
                                  {/* CVV with Copy */}
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">CVV</p>
                                      <p className="text-gray-900 dark:text-gray-100 font-mono text-base select-all">
                                        {fullCardDetails.cvv}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => copyToClipboard(fullCardDetails.cvv, 'CVV')}
                                      className="text-gray-500 hover:text-primary transition-colors p-2"
                                      title="Copy CVV"
                                    >
                                      <i className={`las ${copiedField === 'CVV' ? 'la-check text-green-600' : 'la-copy'} text-lg`}></i>
                                    </button>
                                  </div>
                                  
                                  {/* Expiry with Copy */}
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Expiry</p>
                                      <p className="text-gray-900 dark:text-gray-100 font-mono text-base select-all">
                                        {`${fullCardDetails.expiryMonth.padStart(2, '0')}/${fullCardDetails.expiryYear}`}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => copyToClipboard(`${fullCardDetails.expiryMonth.padStart(2, '0')}/${fullCardDetails.expiryYear}`, 'Expiry date')}
                                      className="text-gray-500 hover:text-primary transition-colors p-2"
                                      title="Copy expiry date"
                                    >
                                      <i className={`las ${copiedField === 'Expiry date' ? 'la-check text-green-600' : 'la-copy'} text-lg`}></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {showSecurityInfo && !showFullDetails && (
                              <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <i className="las la-shield-alt text-yellow-600 text-lg mt-0.5"></i>
                                  <div>
                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                      Security Notice
                                    </p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                      Click "Reveal Full Details" below to view complete card information. Details will be hidden automatically after 30 seconds for security.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">Balance</p>
                            <p className="text-gray-900 dark:text-gray-100 font-semibold text-xl">
                              ${selectedCardDetails.balance.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {!showFullDetails && (
                            <>
                              <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Expires</p>
                              <p className="text-gray-900 dark:text-gray-100 font-mono mb-3">
                                ••/••
                              </p>
                            </>
                          )}
                          {showFullDetails ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm">
                              <i className="las la-clock"></i>
                              Auto-hide in {remainingTime}s
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                              className="bg-white/20 hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 text-gray-900 dark:text-gray-100 border border-white/30 dark:border-gray-600/30"
                            >
                              <i className={`las ${showSecurityInfo ? 'la-times' : 'la-info-circle'} text-lg`}></i>
                              <span>{showSecurityInfo ? 'Hide Info' : 'Security Info'}</span>
                            </button>
                          )}
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
                  <p className="font-medium">{selectedCardDetails.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize min-w-[80px] ${
                    selectedCardDetails.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : selectedCardDetails.status === 'frozen'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : selectedCardDetails.status === 'expired'
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      : selectedCardDetails.status === 'deleted'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : selectedCardDetails.status === 'suspended'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {selectedCardDetails.status}
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
                  <p className="font-medium">${selectedCardDetails.spentAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Limit</p>
                  <p className="font-medium">${selectedCardDetails.spendingLimit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available</p>
                  <p className="font-medium">${(selectedCardDetails.spendingLimit - selectedCardDetails.spentAmount).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="mt-6 pt-6 border-t dark:border-gray-700">
              <h5 className="font-semibold mb-3">Quick Actions</h5>
              
              {/* Update Limit Section */}
              {isUpdatingLimit ? (
                <div className="mb-6 p-4 bg-secondary/5 dark:bg-bg3 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h6 className="font-medium">Update Spending Limit</h6>
                      <button
                        onClick={() => {
                          setIsUpdatingLimit(false);
                          setNewSpendingLimit('');
                          setUpdateLimitError(null);
                          setUpdateLimitSuccess(null);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <i className="las la-times text-lg"></i>
                      </button>
                    </div>
                    
                    {/* Simplified Maximum Limit Info with Dynamic Validation */}
                    <div className={`bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/30 rounded-xl p-4 border ${
                      limitCalculations && newSpendingLimit && !limitCalculations.isValidLimit 
                        ? 'border-red-400 dark:border-red-600' 
                        : 'border-slate-200 dark:border-slate-700'
                    }`}>
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Maximum Allowed Limit</p>
                        <p className={`text-2xl font-bold ${
                          limitCalculations && newSpendingLimit && !limitCalculations.isValidLimit
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          ${limitCalculations?.maxAllowedLimit?.toFixed(2) || '0.00'}
                        </p>
                        
                        {/* Dynamic validation message */}
                        {limitCalculations && newSpendingLimit && (
                          <div className="mt-2">
                            {limitCalculations.isValidLimit ? (
                              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                {limitCalculations.isIncrease 
                                  ? `✓ Valid increase of $${limitCalculations.limitDifference.toFixed(2)}`
                                  : limitCalculations.isDecrease
                                  ? `✓ Valid decrease of $${Math.abs(limitCalculations.limitDifference).toFixed(2)}`
                                  : '✓ No change'
                                }
                              </p>
                            ) : (
                              <p className="text-xs text-red-600 dark:text-red-400">
                                {limitCalculations.newLimit < limitCalculations.spentAmount
                                  ? `✗ Cannot be less than spent amount ($${limitCalculations.spentAmount.toFixed(2)})`
                                  : `✗ Exceeds maximum by $${(limitCalculations.newLimit - limitCalculations.maxAllowedLimit).toFixed(2)}`
                                }
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>


                    {/* Success/Error Alerts */}
                    {updateLimitSuccess && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-start gap-3">
                        <i className="las la-check-circle text-green-600 text-xl flex-shrink-0 mt-0.5"></i>
                        <div>
                          <p className="text-green-800 dark:text-green-200 font-medium">Success!</p>
                          <p className="text-green-700 dark:text-green-300 text-sm mt-1">{updateLimitSuccess}</p>
                        </div>
                      </div>
                    )}
                    
                    {updateLimitError && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-start gap-3">
                        <i className="las la-exclamation-circle text-red-600 text-xl flex-shrink-0 mt-0.5"></i>
                        <div>
                          <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                          <p className="text-red-700 dark:text-red-300 text-sm mt-1">{updateLimitError}</p>
                        </div>
                      </div>
                    )}

                    {/* New Limit Input with Max Button */}
                    <div>
                      <label htmlFor="new-limit" className="block text-sm font-medium mb-2">
                        New Spending Limit (USD)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="new-limit"
                          value={newSpendingLimit}
                          onChange={(e) => {
                            setNewSpendingLimit(e.target.value);
                            setUpdateLimitError(null);
                          }}
                          className={`w-full text-sm bg-secondary/5 dark:bg-bg3 border rounded-lg px-4 py-3 pr-16 ${
                            limitCalculations && newSpendingLimit && !limitCalculations.isValidLimit
                              ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
                              : 'border-n30 dark:border-n500 focus:ring-primary'
                          }`}
                          placeholder="Enter new limit"
                          min="0"
                          step="0.01"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const maxLimit = limitCalculations?.maxAllowedLimit || 0;
                            setNewSpendingLimit(maxLimit.toFixed(2));
                            setUpdateLimitError(null);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                        >
                          MAX
                        </button>
                      </div>
                    </div>


                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsUpdatingLimit(false);
                          setNewSpendingLimit('');
                          setUpdateLimitError(null);
                          setUpdateLimitSuccess(null);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          setIsSubmittingUpdate(true);
                          await handleUpdateLimit();
                          setIsSubmittingUpdate(false);
                        }}
                        disabled={
                          !newSpendingLimit || 
                          parseFloat(newSpendingLimit) === selectedCardDetails.spendingLimit || 
                          isSubmittingUpdate ||
                          (limitCalculations ? !limitCalculations.isValidLimit : false)
                        }
                        className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmittingUpdate && <i className="las la-spinner la-spin"></i>}
                        Update Limit
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button 
                  onClick={showFullDetails ? handleHideFullDetails : handleRevealFullDetails}
                  disabled={isLoadingFullDetails}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    showFullDetails 
                      ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      : 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoadingFullDetails ? (
                    <>
                      <i className="las la-spinner la-spin"></i>
                      Loading...
                    </>
                  ) : showFullDetails ? (
                    <>
                      <i className="las la-eye-slash"></i>
                      Hide Details
                    </>
                  ) : (
                    <>
                      <i className="las la-credit-card"></i>
                      Reveal Full Details
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    handleFreezeCard(selectedCardDetails.id);
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
                      {selectedCardDetails.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setIsUpdatingLimit(true);
                    setNewSpendingLimit(selectedCardDetails.spendingLimit.toString());
                    setUpdateLimitError(null);
                    setUpdateLimitSuccess(null);
                  }}
                  className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <i className="las la-chart-line"></i>
                  Update Limit
                </button>
                <button 
                  onClick={async () => {
                    if (!showTransactions) {
                      // Show transactions and fetch them
                      setShowTransactions(true);
                      setTransactionPage(1); // Reset to first page
                      
                      console.log('🔍 MODAL - About to fetch transactions for card:', {
                        cardId: selectedCardDetails.id,
                        cardNickname: selectedCardDetails.nickname,
                        currentTransactionsInStore: cardTransactions.length
                      });
                      
                      await fetchTransactionsByCard(selectedCardDetails.id);
                      
                      console.log('🔍 MODAL - After fetching, transactions in store:', {
                        cardId: selectedCardDetails.id,
                        transactionCount: cardTransactions.length,
                        transactions: cardTransactions.map(tx => ({
                          id: tx.id,
                          merchant: tx.merchantName,
                          cardId: tx.cardId,
                          amount: tx.amount
                        }))
                      });
                    } else {
                      // Hide transactions
                      setShowTransactions(false);
                    }
                  }}
                  disabled={isLoadingTransactions}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    showTransactions 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoadingTransactions ? (
                    <>
                      <i className="las la-spinner la-spin"></i>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="las la-list"></i>
                      {showTransactions ? 'Hide' : 'Show'} Transactions
                    </>
                  )}
                </button>
                <button 
                  onClick={() => {
                    handleDeleteCard(selectedCardDetails.id);
                  }}
                  className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 col-span-2"
                >
                  <i className="las la-trash"></i>
                  Delete Card
                </button>
              </div>
            </div>
            </div>

            {/* Transactions Section - Only show when toggled */}
            {showTransactions && (
              <div className="flex-1 min-w-0 pl-6">
                <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
                  <div className="flex flex-wrap gap-4 justify-between items-center">
                    <h4 className="h4">Card Transactions</h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Select 
                        setSelected={(value) => {
                          setTransactionStatusFilter(value);
                          setTransactionPage(1); // Reset to first page on filter change
                        }} 
                        selected={transactionStatusFilter} 
                        items={["All", "Completed", "Pending", "Failed", "Reversed"]} 
                        btnClass="rounded-[32px] bg-primary/5 md:py-2.5 min-w-[120px]" 
                        contentClass="w-full" 
                      />
                      <SearchBar 
                        search={(value: string) => {
                          setTransactionSearch(value);
                          setTransactionPage(1); // Reset to first page on search
                        }} 
                        classes="bg-primary/5 w-[200px]"
                      />
                    </div>
                  </div>
                </div>
                
                {isLoadingTransactions ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <i className="las la-spinner la-spin text-4xl text-primary mb-2"></i>
                      <p className="text-gray-600 dark:text-gray-400">Loading transactions...</p>
                    </div>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">
                      <i className="las la-receipt text-5xl mb-3 opacity-50"></i>
                      {cardTransactions.length === 0 ? (
                        <>
                          <p className="text-lg font-medium mb-2">No Transactions Yet</p>
                          <p className="text-sm">This card hasn't been used for any transactions.</p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-medium mb-2">No Matching Transactions</p>
                          <p className="text-sm">
                            {transactionSearch ? 
                              `No transactions found matching "${transactionSearch}"` : 
                              `No transactions with "${transactionStatusFilter}" status`
                            }
                          </p>
                          <button 
                            onClick={() => {
                              setTransactionSearch("");
                              setTransactionStatusFilter("All");
                              setTransactionPage(1);
                            }}
                            className="mt-3 text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            Clear filters
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-secondary/5 dark:bg-bg3">
                            <th className="text-start py-3 px-4">Date</th>
                            <th className="text-start py-3 px-4">Merchant</th>
                            <th className="text-start py-3 px-4">Amount</th>
                            <th className="text-start py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            // Calculate pagination
                            const startIndex = (transactionPage - 1) * transactionsPerPage;
                            const endIndex = startIndex + transactionsPerPage;
                            const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
                            const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
                            
                            return paginatedTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">
                                  {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(transaction.createdAt).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{transaction.merchantName || 'Unknown Merchant'}</p>
                                <p className="text-xs text-gray-500">
                                  {transaction.merchantCategory || transaction.type}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <p className={`font-semibold ${
                                transaction.type === 'refund' || transaction.amount > 0
                                  ? 'text-green-600' 
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {transaction.type === 'refund' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                transaction.status === 'completed' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                  : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                  : transaction.status === 'failed'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ));
                      })()}
                      </tbody>
                    </table>
                    </div>
                    
                    {/* Pagination - Use same component as other tables */}
                    {filteredTransactions.length > transactionsPerPage && (
                      <div className="mt-4">
                        <Pagination 
                          totalPages={Math.ceil(filteredTransactions.length / transactionsPerPage)} 
                          currentPage={transactionPage} 
                          nextPage={() => setTransactionPage(prev => Math.min(Math.ceil(filteredTransactions.length / transactionsPerPage), prev + 1))} 
                          startIndex={(transactionPage - 1) * transactionsPerPage} 
                          endIndex={Math.min(transactionPage * transactionsPerPage, filteredTransactions.length) - 1} 
                          prevPage={() => setTransactionPage(prev => Math.max(1, prev - 1))} 
                          total={filteredTransactions.length} 
                          goToPage={(page: number) => setTransactionPage(page)} 
                        />
                      </div>
                    )}
                    
                    {/* Summary Section */}
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {filteredTransactions.length < cardTransactions.length ? 
                            `Showing ${filteredTransactions.length} of ${cardTransactions.length} transactions` :
                            `Total Transactions: ${cardTransactions.length}`
                          }
                        </span>
                        <span className="font-semibold">
                          Total Spent: ${filteredTransactions
                            .filter(t => t.type !== 'refund' && t.status === 'completed')
                            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add New Card Modal */}
      <AddCard 
        open={isAddCardModalOpen} 
        toggleOpen={() => {
          const wasOpen = isAddCardModalOpen;
          setIsAddCardModalOpen(!isAddCardModalOpen);
          
          // If we're closing the modal, refresh cards in case a new card was created
          if (wasOpen) {
            fetchCards();
          }
        }} 
      />

      {/* Confirmation Dialog */}
      <Modal 
        toggleOpen={() => setConfirmAction({ type: null, cardId: null })} 
        open={confirmAction.type !== null}
        width="max-w-md"
      >
        <div className="text-center">
          <div className="mb-4">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              confirmAction.type === 'delete' 
                ? 'bg-red-100 dark:bg-red-900/20' 
                : 'bg-blue-100 dark:bg-blue-900/20'
            }`}>
              <i className={`las ${
                confirmAction.type === 'delete' 
                  ? 'la-trash text-red-600 dark:text-red-400' 
                  : confirmAction.type === 'freeze'
                  ? 'la-snowflake text-blue-600 dark:text-blue-400'
                  : 'la-sun text-yellow-600 dark:text-yellow-400'
              } text-3xl`}></i>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              {confirmAction.type === 'delete' 
                ? 'Delete Card?' 
                : confirmAction.type === 'freeze'
                ? 'Freeze Card?'
                : 'Unfreeze Card?'
              }
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {confirmAction.type === 'delete' 
                ? `Are you sure you want to delete ${confirmAction.cardName}? This action cannot be undone.`
                : confirmAction.type === 'freeze'
                ? `Are you sure you want to freeze ${confirmAction.cardName}? You won't be able to use this card for transactions until you unfreeze it.`
                : `Are you sure you want to unfreeze ${confirmAction.cardName}? This will allow the card to be used for transactions again.`
              }
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmAction({ type: null, cardId: null })}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (confirmAction.cardId) {
                  if (confirmAction.type === 'delete') {
                    handleDeleteCard(confirmAction.cardId, true);
                  } else {
                    handleFreezeCard(confirmAction.cardId, true);
                  }
                }
                setConfirmAction({ type: null, cardId: null });
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg transition-colors font-medium text-white ${
                confirmAction.type === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : confirmAction.type === 'freeze'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              {confirmAction.type === 'delete' 
                ? 'Delete Card' 
                : confirmAction.type === 'freeze'
                ? 'Freeze Card'
                : 'Unfreeze Card'
              }
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default YourCards;
