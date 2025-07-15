'use client';

import Modal from "@/components/shared/Modal";
import { 
  IconCalendar,
  IconCreditCard,
  IconCurrencyDollar,
  IconHash,
  IconInfoCircle,
  IconExternalLink,
  IconCopy,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconAlertCircle
} from "@tabler/icons-react";
import { format } from "date-fns";
import { useState } from "react";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any; // Will accept different transaction types
  type: 'card' | 'crypto' | 'fee';
}

export function TransactionDetailModal({ isOpen, onClose, transaction, type }: TransactionDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!transaction) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'received':
        return <IconCircleCheck className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'cancelled':
      case 'declined':
        return <IconCircleX className="h-4 w-4 text-red-500" />;
      case 'pending':
      case 'detected':
      case 'processing':
        return <IconClock className="h-4 w-4 text-yellow-500" />;
      default:
        return <IconAlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'received':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
      case 'cancelled':
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
      case 'detected':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const renderCardTransaction = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transaction ID</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm">{transaction.id}</p>
            <button
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={() => copyToClipboard(transaction.id, 'Transaction ID')}
            >
              {copiedField === 'Transaction ID' ? (
                <IconCircleCheck className="h-3 w-3 text-green-500" />
              ) : (
                <IconCopy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
            <span className="flex items-center gap-1">
              {getStatusIcon(transaction.status)}
              {transaction.status}
            </span>
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
          <p className="text-lg font-semibold">
            ${transaction.rawData?.amount?.toFixed(2) || transaction.amount?.replace(/[^0-9.-]/g, '')} {transaction.currency || 'USD'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date & Time</p>
          <p className="text-sm">
            {format(new Date(transaction.createdAt || transaction.date), 'PPp')}
          </p>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4"></div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Merchant Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Merchant Name</p>
            <p className="text-sm font-medium">{transaction.merchantName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
            <p className="text-sm">{transaction.merchantCategory || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Country</p>
            <p className="text-sm">{transaction.merchantCountry || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Card Used</p>
            <p className="text-sm font-medium">{transaction.cardName || transaction.maskedPan || 'Unknown Card'}</p>
          </div>
        </div>
      </div>

      {transaction.description && (
        <>
          <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4"></div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Description</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.description}</p>
          </div>
        </>
      )}
    </>
  );

  const renderCryptoTransaction = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order ID</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm">{transaction.orderId || transaction.id}</p>
            <button
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={() => copyToClipboard(transaction.orderId || transaction.id, 'Order ID')}
            >
              {copiedField === 'Order ID' ? (
                <IconCircleCheck className="h-3 w-3 text-green-500" />
              ) : (
                <IconCopy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
            <span className="flex items-center gap-1">
              {getStatusIcon(transaction.status)}
              {transaction.status}
            </span>
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
          <p className="text-lg font-semibold">
            ${transaction.rawData?.amount?.toFixed(2) || transaction.amount?.replace(/[^0-9.-]/g, '')} USD
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date & Time</p>
          <p className="text-sm">
            {format(new Date(transaction.createdAt || transaction.date), 'PPp')}
          </p>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4"></div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Crypto Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Currency</p>
            <p className="text-sm font-medium">{transaction.currency || 'BTC'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Network</p>
            <p className="text-sm">{transaction.network || 'Bitcoin'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confirmations</p>
            <p className="text-sm">{transaction.confirmations || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Type</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {transaction.reference?.startsWith('WD-') ? 'Withdrawal' : 'Deposit'}
            </span>
          </div>
        </div>
      </div>

      {transaction.transactionHash && (
        <>
          <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4"></div>
          <div>
            <h3 className="font-semibold text-sm mb-2">Transaction Hash</h3>
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs break-all">{transaction.transactionHash}</p>
              <button
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                onClick={() => copyToClipboard(transaction.transactionHash, 'Transaction Hash')}
              >
                {copiedField === 'Transaction Hash' ? (
                  <IconCircleCheck className="h-3 w-3 text-green-500" />
                ) : (
                  <IconCopy className="h-3 w-3" />
                )}
              </button>
            </div>
            {transaction.explorerUrl && (
              <a
                href={transaction.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary-dark text-sm mt-2"
              >
                View on Blockchain Explorer
                <IconExternalLink className="ml-1 h-3 w-3" />
              </a>
            )}
          </div>
        </>
      )}
    </>
  );

  const renderFeeTransaction = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transaction ID</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-sm">{transaction.id}</p>
            <button
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              onClick={() => copyToClipboard(transaction.id, 'Transaction ID')}
            >
              {copiedField === 'Transaction ID' ? (
                <IconCircleCheck className="h-3 w-3 text-green-500" />
              ) : (
                <IconCopy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
            <span className="flex items-center gap-1">
              {getStatusIcon(transaction.status)}
              {transaction.status}
            </span>
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
          <p className="text-lg font-semibold text-red-600">
            -{transaction.amount?.replace(/[^0-9.-]/g, '') || '0.00'} USD
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date & Time</p>
          <p className="text-sm">
            {format(new Date(transaction.createdAt || transaction.date), 'PPp')}
          </p>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4"></div>

      <div>
        <h3 className="font-semibold text-sm mb-2">Fee Details</h3>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
            <p className="text-sm">{transaction.description || 'Platform Fee'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reference</p>
            <p className="text-sm font-mono">{transaction.reference || 'N/A'}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Modal open={isOpen} toggleOpen={onClose} width="max-w-2xl">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          {type === 'card' && <IconCreditCard className="h-5 w-5 text-primary" />}
          {type === 'crypto' && <IconHash className="h-5 w-5 text-primary" />}
          {type === 'fee' && <IconCurrencyDollar className="h-5 w-5 text-primary" />}
          <h2 className="text-xl font-semibold">Transaction Details</h2>
        </div>
        
        <div className="mt-4">
          {type === 'card' && renderCardTransaction()}
          {type === 'crypto' && renderCryptoTransaction()}
          {type === 'fee' && renderFeeTransaction()}
        </div>
      </div>
    </Modal>
  );
}