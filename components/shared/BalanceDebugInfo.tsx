"use client";
import { useUserStore } from "@/stores/userStore";
import { useCardStore } from "@/stores/cardStore";

const BalanceDebugInfo = () => {
  const { 
    balance, 
    availableBalance, 
    profile,
    upcomingRenewal,
    monthlyFeeBreakdown 
  } = useUserStore();
  
  const { cards } = useCardStore();
  
  // Calculate frontend balance for comparison
  const frontendCalculatedAvailable = balance?.virtualBalance 
    ? balance.virtualBalance - cards.filter(c => c.status === 'active').reduce((sum, card) => sum + (card.remainingBalance || card.balance || 0), 0)
    : 0;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-4 space-y-4">
      <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-200">🐛 Balance Debug Information</h3>
      
      {/* User Balance Response */}
      <div className="space-y-2">
        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">1. /users/balance Response:</h4>
        <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(balance, null, 2)}
        </pre>
      </div>
      
      {/* Available Balance Response */}
      <div className="space-y-2">
        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">2. /users/balance/available Response:</h4>
        {availableBalance ? (
          <>
            <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(availableBalance, null, 2)}
            </pre>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
              <p className="text-sm font-medium">Backend Calculation:</p>
              <p className="text-sm">Account Balance: ${availableBalance.accountBalance?.toFixed(2) || '0.00'}</p>
              <p className="text-sm">- Active Cards: ${availableBalance.activeCardsBalance?.toFixed(2) || '0.00'}</p>
              <p className="text-sm font-bold">= Available: ${availableBalance.availableBalance?.toFixed(2) || '0.00'}</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">No available balance data loaded yet</p>
        )}
      </div>
      
      {/* Frontend vs Backend Comparison */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded space-y-2">
        <h4 className="font-semibold text-blue-700 dark:text-blue-300">3. Frontend vs Backend Comparison:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Frontend Calculated:</p>
            <p>${frontendCalculatedAvailable.toFixed(2)}</p>
            <p className="text-xs text-gray-600">({balance?.virtualBalance || 0} - {cards.filter(c => c.status === 'active').reduce((sum, card) => sum + (card.remainingBalance || card.balance || 0), 0)})</p>
          </div>
          <div>
            <p className="font-medium">Backend Returned:</p>
            <p>${availableBalance?.availableBalance?.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-gray-600">(From API)</p>
          </div>
        </div>
      </div>
      
      {/* Active Cards Info */}
      <div className="space-y-2">
        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">4. Active Cards Details:</h4>
        <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs space-y-1">
          {cards.filter(c => c.status === 'active').map(card => (
            <div key={card.id} className="flex justify-between">
              <span>{card.maskedPan} ({card.nickname})</span>
              <span>${(card.remainingBalance || card.balance || 0).toFixed(2)}</span>
            </div>
          ))}
          {cards.filter(c => c.status === 'active').length === 0 && (
            <p className="text-gray-600">No active cards</p>
          )}
        </div>
      </div>
      
      {/* Tier Info */}
      <div className="space-y-2">
        <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">5. Tier Information:</h4>
        <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs">
          <p>Current Tier: {profile?.tier?.displayName || 'Unknown'} (Level {profile?.tier?.level})</p>
          <p>Card Creation Fee: ${availableBalance?.tierInfo?.cardCreationFee || 'N/A'}</p>
          <p>Deposit Fee: {availableBalance?.tierInfo?.depositFeePercentage || 'N/A'}%</p>
        </div>
      </div>
      
      {/* Upcoming Renewal Info */}
      {upcomingRenewal && (
        <div className="space-y-2">
          <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">6. Upcoming Renewal Info:</h4>
          <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(upcomingRenewal, null, 2)}
          </pre>
        </div>
      )}
      
      {/* Monthly Fee Breakdown */}
      {monthlyFeeBreakdown && (
        <div className="space-y-2">
          <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">7. Monthly Fee Breakdown:</h4>
          <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(monthlyFeeBreakdown, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BalanceDebugInfo;