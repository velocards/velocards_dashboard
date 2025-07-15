"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal";
import Select from "@/components/shared/Select";
import { useCardStore } from "@/stores/cardStore";
import { useUserStore } from "@/stores/userStore";
import { apiClient } from "@/lib/api/client";
import { toast } from "react-toastify";
import { useAvailableBalance } from "@/components/shared/AvailableBalance";

type ModalProps = {
  toggleOpen: () => void;
  open: boolean;
};

const AddCard = ({ toggleOpen, open }: ModalProps) => {
  // Stores
  const { programs, isLoadingPrograms, createCard, isLoading, fetchPrograms, clearError, cards, fetchCards } = useCardStore();
  const { profile, fetchProfile, balance, fetchBalance } = useUserStore();
  
  // Generate default expiry values
  const getDefaultExpiryValues = () => {
    const now = new Date();
    const defaultExpiryDate = new Date(now.getFullYear() + 1, now.getMonth(), 1);
    const values = {
      month: String(defaultExpiryDate.getMonth() + 1).padStart(2, '0'), // Ensure 2 digits
      year: String(defaultExpiryDate.getFullYear())
    };
    return values;
  };

  // Card creation form state
  const [cardDetails, setCardDetails] = useState(() => {
    const defaultExpiry = getDefaultExpiryValues();
    return {
      cardName: "",
      bin: "",
      cardLimit: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "US",
      expiryMonth: defaultExpiry.month,
      expiryYear: defaultExpiry.year,
      phoneNumber: ""
    };
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardCreationFee, setCardCreationFee] = useState<number | null>(null);
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  // Get BIN options from API programs
  const binOptions = programs.map(program => program.bin);

  // Use shared available balance calculation
  // This will automatically use backend-calculated value when available
  const { availableBalance } = useAvailableBalance();

  // Fetch card creation fee based on user's tier
  const fetchCardCreationFee = async () => {
    setIsLoadingFee(true);
    try {
      const { data } = await apiClient.post('/tiers/calculate-fees', {
        action: 'card_creation',
        amount: 0 // Card creation fee doesn't depend on amount
      });
      
      setCardCreationFee(data.data.calculatedFee);
    } catch (error) {
      // Default fee if API fails
      setCardCreationFee(50); // Default to highest tier fee
    } finally {
      setIsLoadingFee(false);
    }
  };

  // Reset form completely when modal opens
  useEffect(() => {
    if (open) {
      // Completely reset the form with fresh values when modal opens
      const freshExpiry = getDefaultExpiryValues();
      
      setCardDetails({
        cardName: "",
        bin: "",
        cardLimit: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
        expiryMonth: freshExpiry.month,
        expiryYear: freshExpiry.year,
        phoneNumber: ""
      });
      
      // Reset form errors
      setFormErrors({});
      setIsSubmitting(false);
      setShowReview(false);
      clearError();
      
      // Fetch programs and profile
      if (programs.length === 0) {
        fetchPrograms();
      }
      if (!profile) {
        fetchProfile();
      }
      // Fetch balance to ensure we have the latest
      if (!balance) {
        fetchBalance();
      }
      
      // Fetch cards to calculate true available balance
      fetchCards();
      
      // Fetch card creation fee
      fetchCardCreationFee();
    }
  }, [open]);

  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!cardDetails.cardName.trim()) errors.cardName = "Card name is required";
    if (!cardDetails.bin) errors.bin = "Please select a BIN";
    if (!cardDetails.cardLimit || parseFloat(cardDetails.cardLimit) <= 0) {
      errors.cardLimit = "Card limit must be greater than 0";
    } else if (cardCreationFee !== null) {
      const totalRequired = parseFloat(cardDetails.cardLimit) + cardCreationFee;
      if (totalRequired > availableBalance) {
        errors.cardLimit = `Total required ($${totalRequired.toFixed(2)}) exceeds available balance ($${availableBalance.toFixed(2)})`;
      }
    }
    if (!cardDetails.firstName.trim()) errors.firstName = "First name is required";
    if (!cardDetails.lastName.trim()) errors.lastName = "Last name is required";
    if (!cardDetails.address.trim()) errors.address = "Address is required";
    if (!cardDetails.city.trim()) errors.city = "City is required";
    if (!cardDetails.state.trim()) errors.state = "State is required";
    if (!cardDetails.zip.trim()) errors.zip = "ZIP code is required";
    if (!cardDetails.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    
    // Expiry validation
    if (!cardDetails.expiryMonth) {
      errors.expiryMonth = "Expiry month is required";
    } else {
      const month = parseInt(cardDetails.expiryMonth);
      if (isNaN(month) || month < 1 || month > 12) {
        errors.expiryMonth = "Invalid month (1-12)";
      }
    }
    
    if (!cardDetails.expiryYear) {
      errors.expiryYear = "Expiry year is required";
    } else {
      const year = parseInt(cardDetails.expiryYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || cardDetails.expiryYear.length !== 4) {
        errors.expiryYear = "Year must be 4 digits";
      } else if (year < currentYear) {
        errors.expiryYear = "Expiry year cannot be in the past";
      } else if (year > currentYear + 10) {
        errors.expiryYear = "Expiry year cannot be more than 10 years in the future";
      }
    }
    
    // Additional validation: expiry date cannot be in the past
    if (cardDetails.expiryMonth && cardDetails.expiryYear && !errors.expiryMonth && !errors.expiryYear) {
      const expiryDate = new Date(parseInt(cardDetails.expiryYear), parseInt(cardDetails.expiryMonth) - 1, 1);
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      if (expiryDate < currentMonth) {
        errors.expiryMonth = "Expiry date cannot be in the past";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReview = () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    if (!profile) {
      toast.error("User profile not loaded. Please refresh the page and try again.");
      return;
    }

    // Check if programs are loaded
    if (programs.length === 0) {
      toast.error("Card programs not loaded. Please wait a moment and try again.");
      return;
    }

    // Check total amount (funding + fee) against available balance
    const fundingAmount = parseFloat(cardDetails.cardLimit);
    const totalRequired = fundingAmount + (cardCreationFee || 0);
    if (totalRequired > availableBalance) {
      toast.error(`Insufficient balance. You have $${availableBalance.toFixed(2)} available after accounting for existing cards.`);
      return;
    }

    setShowReview(true);
  };

  const handleCreateCard = async () => {
    setIsSubmitting(true);
    clearError();

    try {
      // Use the selected BIN directly
      const selectedBin = cardDetails.bin;
      
      // Find the program that matches the selected BIN
      const selectedProgram = programs.find(p => p.bin === selectedBin);
      if (!selectedProgram) {
        toast.error("Invalid BIN selected");
        setIsSubmitting(false);
        return;
      }

      // Use user-provided expiry date (already validated)
      const expMonth = String(cardDetails.expiryMonth).padStart(2, '0'); // Zero-padded month
      const expYear = cardDetails.expiryYear; // Full 4-digit year

      // Map form data to API request format
      const createCardData = {
        programId: selectedProgram.programId,
        fundingAmount: parseFloat(cardDetails.cardLimit),
        firstName: cardDetails.firstName.trim(),
        lastName: cardDetails.lastName.trim(),
        email: profile?.email || '', // Get from user profile
        phone: cardDetails.phoneNumber.trim(),
        address: cardDetails.address.trim(),
        city: cardDetails.city.trim(),
        state: cardDetails.state.trim().toUpperCase(),
        country: cardDetails.country,
        zipCode: cardDetails.zip.trim(),
        nickname: cardDetails.cardName.trim(),
        expiryMonth: expMonth, // User-provided (e.g., "01")
        expiryYear: expYear,   // User-provided (e.g., "2028")
      };

      
      // Create the card
      const newCard = await createCard(createCardData);
      
      // Success message with card details
      toast.success(`Card created successfully! Card ending in ${newCard.maskedPan?.slice(-4) || 'XXXX'}`);
      
      // Refresh user balance and profile after card creation
      if (fetchProfile) {
        fetchProfile();
      }
      
      handleToggleOpen(); // Close modal and reset form
      
    } catch (error: any) {
      
      // Handle network errors
      if (!error.response) {
        toast.error('Network error. Please check your internet connection and try again.');
        setIsSubmitting(false);
        return;
      }
      
      // Handle specific error codes
      const errorCode = error.response?.data?.error?.code;
      const errorMessage = error.response?.data?.error?.message;
      
      switch (errorCode) {
        case 'INSUFFICIENT_BALANCE':
          toast.error(`Insufficient balance. ${errorMessage || 'Please add funds to your account.'}`);
          break;
        case 'CARD_LIMIT_REACHED':
          toast.error('Card limit reached. Please upgrade your tier to create more cards.');
          break;
        case 'TIER_RESTRICTION':
          toast.error('Your current tier does not allow this action. Please upgrade your account.');
          break;
        case 'VALIDATION_ERROR':
          toast.error(errorMessage || 'Please check your input and try again.');
          break;
        case 'RATE_LIMIT_EXCEEDED':
          toast.error('Too many requests. Please wait a moment and try again.');
          break;
        default:
          toast.error(errorMessage || 'Failed to create card. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when closing
  const handleToggleOpen = () => {
    if (open) {
      const defaultExpiry = getDefaultExpiryValues();
      
      setCardDetails({
        cardName: "",
        bin: "",
        cardLimit: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
        expiryMonth: defaultExpiry.month, // Auto-populate on reset
        expiryYear: defaultExpiry.year,   // Auto-populate on reset
        phoneNumber: ""
      });
      setFormErrors({});
      setIsSubmitting(false);
      setShowReview(false);
      clearError();
    }
    toggleOpen();
  };

  return (
    <Modal open={open} toggleOpen={handleToggleOpen} width="max-w-[600px] lg:top-24">
      <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
        <h4 className="h4">{showReview ? 'Review Card Details' : 'Add New Card'}</h4>
      </div>
      
      {!showReview ? (
        <form>
        <div className="mt-6 xl:mt-8 grid grid-cols-2 gap-4 xxxl:gap-6 max-h-[60vh] overflow-y-auto pr-2">
          {/* Card Name */}
          <div className="col-span-2">
            <label htmlFor="card-name-overview" className="md:text-lg font-medium block mb-4">Card Name</label>
            <input
              type="text"
              value={cardDetails.cardName}
              onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
              placeholder="e.g., Shopping Card"
              className={`w-full text-sm bg-secondary/5 dark:bg-bg3 border rounded-3xl px-6 py-2.5 md:py-3 ${
                formErrors.cardName ? 'border-red-500' : 'border-n30 dark:border-n500'
              }`}
              id="card-name-overview"
              required
            />
            {formErrors.cardName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.cardName}</p>
            )}
          </div>

          {/* BIN */}
          <div className="col-span-2 md:col-span-1">
            <label className="md:text-lg font-medium block mb-4">BIN</label>
            <div className={`bg-secondary/5 dark:bg-bg3 border rounded-3xl ${
              formErrors.bin ? 'border-red-500' : 'border-n30 dark:border-n500'
            }`}>
              {isLoadingPrograms ? (
                <div className="w-full px-6 py-2.5 md:py-3 text-gray-500">
                  <i className="las la-spinner la-spin mr-2"></i>
                  Loading programs...
                </div>
              ) : (
                <Select
                  items={binOptions.length > 0 ? binOptions : ['No programs available']}
                  selected={cardDetails.bin}
                  setSelected={(value) => setCardDetails({...cardDetails, bin: value})}
                  btnClass="w-full justify-between rounded-3xl py-2.5 md:py-3"
                  contentClass="w-full"
                />
              )}
            </div>
            {formErrors.bin && (
              <p className="text-red-500 text-xs mt-1">{formErrors.bin}</p>
            )}
          </div>

          {/* Card Limit */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <label htmlFor="card-limit-overview" className="md:text-lg font-medium">Card Limit (USD)</label>
              {availableBalance > 0 && cardCreationFee !== null && (
                <button
                  type="button"
                  onClick={() => {
                    // Calculate max card limit after deducting the fee from available balance
                    const maxCardLimit = Math.max(0, availableBalance - cardCreationFee);
                    setCardDetails({...cardDetails, cardLimit: maxCardLimit.toFixed(2)});
                    if (formErrors.cardLimit) {
                      setFormErrors({...formErrors, cardLimit: ""});
                    }
                  }}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  title={`Max: $${Math.max(0, availableBalance - cardCreationFee).toFixed(2)} after fee`}
                >
                  Max Available
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                value={cardDetails.cardLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  setCardDetails({...cardDetails, cardLimit: value});
                  
                  // Clear error if user is typing
                  if (formErrors.cardLimit) {
                    setFormErrors({...formErrors, cardLimit: ""});
                  }
                }}
                placeholder="5000"
                className={`w-full text-sm bg-secondary/5 dark:bg-bg3 border rounded-3xl px-6 py-2.5 md:py-3 ${
                  formErrors.cardLimit ? 'border-red-500' : 
                  cardDetails.cardLimit && parseFloat(cardDetails.cardLimit) > (balance?.virtualBalance || 0) ? 'border-yellow-500' : 
                  'border-n30 dark:border-n500'
                }`}
                id="card-limit-overview"
                min="1"
                max={balance?.virtualBalance || 0}
                step="100"
                required
              />
              {/* Simple max allowed indicator */}
              {cardCreationFee !== null && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Max allowed: <span className="font-semibold text-primary">${Math.max(0, availableBalance - cardCreationFee).toFixed(2)}</span>
                  </p>
                  {cardDetails.cardLimit && parseFloat(cardDetails.cardLimit) > 0 && (parseFloat(cardDetails.cardLimit) + cardCreationFee) > availableBalance && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <i className="las la-exclamation-circle"></i>
                      <span>Exceeds available balance</span>
                    </p>
                  )}
                </div>
              )}
            </div>
            {formErrors.cardLimit && (
              <p className="text-red-500 text-xs mt-1">{formErrors.cardLimit}</p>
            )}
          </div>

          {/* First Name */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="first-name-overview" className="md:text-lg font-medium block mb-4">First Name</label>
            <input
              type="text"
              value={cardDetails.firstName}
              onChange={(e) => setCardDetails({...cardDetails, firstName: e.target.value})}
              placeholder="John"
              className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
              id="first-name-overview"
              required
            />
          </div>

          {/* Last Name */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="last-name-overview" className="md:text-lg font-medium block mb-4">Last Name</label>
            <input
              type="text"
              value={cardDetails.lastName}
              onChange={(e) => setCardDetails({...cardDetails, lastName: e.target.value})}
              placeholder="Doe"
              className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
              id="last-name-overview"
              required
            />
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label htmlFor="address-overview" className="md:text-lg font-medium block mb-4">Address</label>
            <input
              type="text"
              value={cardDetails.address}
              onChange={(e) => setCardDetails({...cardDetails, address: e.target.value})}
              placeholder="123 Main Street"
              className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
              id="address-overview"
              required
            />
          </div>

          {/* City */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="city-overview" className="md:text-lg font-medium block mb-4">City</label>
            <input
              type="text"
              value={cardDetails.city}
              onChange={(e) => setCardDetails({...cardDetails, city: e.target.value})}
              placeholder="New York"
              className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
              id="city-overview"
              required
            />
          </div>

          {/* State */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="state-overview" className="md:text-lg font-medium block mb-4">State</label>
            <input
              type="text"
              value={cardDetails.state}
              onChange={(e) => setCardDetails({...cardDetails, state: e.target.value})}
              placeholder="NY"
              maxLength={2}
              className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
              id="state-overview"
              required
            />
          </div>

          {/* Zip */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="zip-overview" className="md:text-lg font-medium block mb-4">ZIP Code</label>
            <input
              type="text"
              value={cardDetails.zip}
              onChange={(e) => setCardDetails({...cardDetails, zip: e.target.value})}
              placeholder="10001"
              maxLength={10}
              className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
              id="zip-overview"
              required
            />
          </div>

          {/* Country */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="country-overview" className="md:text-lg font-medium block mb-4">Country</label>
            <input
              type="text"
              value={cardDetails.country}
              readOnly
              className="w-full text-sm bg-gray-100 dark:bg-gray-800 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3 cursor-not-allowed"
              id="country-overview"
            />
          </div>

          {/* Expiry Month */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="expiry-month-overview" className="md:text-lg font-medium block mb-4">
              Expiry Month
            </label>
            <input
              type="number"
              value={cardDetails.expiryMonth}
              onChange={(e) => {
                setCardDetails({...cardDetails, expiryMonth: e.target.value});
              }}
              placeholder="MM (e.g., 12)"
              min="1"
              max="12"
              className={`w-full text-sm bg-secondary/5 dark:bg-bg3 border rounded-3xl px-6 py-2.5 md:py-3 ${
                formErrors.expiryMonth ? 'border-red-500' : 'border-n30 dark:border-n500'
              }`}
              id="expiry-month-overview"
              required
            />
            {formErrors.expiryMonth && (
              <p className="text-red-500 text-xs mt-1">{formErrors.expiryMonth}</p>
            )}
          </div>

          {/* Expiry Year */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="expiry-year-overview" className="md:text-lg font-medium block mb-4">
              Expiry Year
            </label>
            <input
              type="number"
              value={cardDetails.expiryYear}
              onChange={(e) => setCardDetails({...cardDetails, expiryYear: e.target.value})}
              placeholder="YYYY (e.g., 2028)"
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 10}
              className={`w-full text-sm bg-secondary/5 dark:bg-bg3 border rounded-3xl px-6 py-2.5 md:py-3 ${
                formErrors.expiryYear ? 'border-red-500' : 'border-n30 dark:border-n500'
              }`}
              id="expiry-year-overview"
              required
            />
            {formErrors.expiryYear && (
              <p className="text-red-500 text-xs mt-1">{formErrors.expiryYear}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="col-span-2">
            <label htmlFor="phone-number-overview" className="md:text-lg font-medium block mb-4">Phone Number</label>
            <input
              type="tel"
              value={cardDetails.phoneNumber}
              onChange={(e) => setCardDetails({...cardDetails, phoneNumber: e.target.value})}
              placeholder="+1 (555) 123-4567"
              className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
              id="phone-number-overview"
              required
            />
          </div>
        </div>

        {/* Review Button */}
        <div className="col-span-2 mt-6 sticky bottom-0 bg-n0 dark:bg-bg4 pt-4 border-t dark:border-n500">
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleReview();
            }}
            disabled={!cardDetails.cardName || !cardDetails.bin || !cardDetails.cardLimit}
            className="w-full bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-full font-medium transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review Card Details
          </button>
        </div>
      </form>
      ) : (
        // Review Screen
        <div className="max-h-[60vh] overflow-y-auto pr-2">

          {/* Card Details Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
            <h5 className="font-semibold text-sm mb-3">Card Information</h5>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Card Name:</span>
                <p className="font-medium">{cardDetails.cardName}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Card Type:</span>
                <p className="font-medium">Virtual Card (BIN: {cardDetails.bin})</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Funding Amount:</span>
                <p className="font-medium text-green-600">${parseFloat(cardDetails.cardLimit).toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Expiry:</span>
                <p className="font-medium">{cardDetails.expiryMonth}/{cardDetails.expiryYear}</p>
              </div>
            </div>
          </div>

          {/* Cardholder Details Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
            <h5 className="font-semibold text-sm mb-3">Cardholder Details</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="font-medium">{cardDetails.firstName} {cardDetails.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="font-medium">{cardDetails.phoneNumber}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Address:</span>
                <p className="font-medium mt-1">
                  {cardDetails.address}<br />
                  {cardDetails.city}, {cardDetails.state} {cardDetails.zip}<br />
                  {cardDetails.country}
                </p>
              </div>
            </div>
          </div>

          {/* Total Cost Summary */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
            <h5 className="font-semibold text-sm mb-3 text-green-900 dark:text-green-100">Cost Breakdown & Summary</h5>
            
            {/* Available Balance Section */}
            <div className="mb-4 pb-3 border-b border-green-200 dark:border-green-800">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300">Your Available Balance:</span>
                <span className="font-medium">${availableBalance.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                Maximum you can fund: ${Math.max(0, availableBalance - (cardCreationFee || 0)).toFixed(2)} (after ${cardCreationFee?.toFixed(2) || '0.00'} creation fee)
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Card Funding:</span>
                <span className="font-medium">${parseFloat(cardDetails.cardLimit).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Creation Fee:</span>
                <span className="font-medium text-orange-600">${cardCreationFee?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-200 dark:border-green-800">
                <span className="font-semibold">Total Deduction:</span>
                <span className="font-bold text-lg">
                  ${(parseFloat(cardDetails.cardLimit) + (cardCreationFee || 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 pt-1">
                <span>Remaining Balance:</span>
                <span>${(availableBalance - parseFloat(cardDetails.cardLimit) - (cardCreationFee || 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-n0 dark:bg-bg4 pt-4 border-t dark:border-n500 flex gap-3">
            <button
              onClick={() => setShowReview(false)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-full font-medium transition-colors"
            >
              <i className="las la-arrow-left mr-2"></i>
              Back to Edit
            </button>
            <button
              onClick={handleCreateCard}
              disabled={isSubmitting || isLoading}
              className="flex-1 bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-full font-medium transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <>
                  <i className="las la-spinner la-spin mr-2"></i>
                  Creating Card...
                </>
              ) : (
                <>
                  <i className="las la-check-circle mr-2"></i>
                  Create Card
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddCard;
