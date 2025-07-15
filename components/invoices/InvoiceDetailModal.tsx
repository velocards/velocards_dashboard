"use client";
import React, { useEffect } from "react";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { 
  formatInvoiceType,
  getInvoiceStatusBadgeClass 
} from "@/types/invoice";
import {
  formatInvoiceAmount,
  formatInvoiceDate
} from "@/lib/api/invoices";
import { toast } from "react-toastify";

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: string | null;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  invoiceId 
}) => {
  const { 
    currentInvoice, 
    isLoadingInvoice, 
    fetchInvoice,
    downloadInvoice,
    resendInvoice,
    isDownloading,
    isSendingEmail
  } = useInvoiceStore();

  useEffect(() => {
    if (isOpen && invoiceId) {
      fetchInvoice(invoiceId);
    }
  }, [isOpen, invoiceId, fetchInvoice]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (currentInvoice) {
      try {
        await downloadInvoice(currentInvoice.id, currentInvoice.invoice_number);
        toast.success('Invoice downloaded successfully!');
      } catch (error) {
        console.error('Failed to download invoice:', error);
        toast.error('Failed to download invoice. Please try again.');
      }
    }
  };

  const handleResendEmail = async () => {
    if (currentInvoice) {
      const result = await resendInvoice(currentInvoice.id);
      if (result) {
        if (result.success) {
          toast.success(result.message || 'Invoice email sent successfully!');
        } else {
          toast.error(result.message || 'Failed to send invoice email');
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Invoice Details
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="las la-times text-xl"></i>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {isLoadingInvoice ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : currentInvoice ? (
              <div className="space-y-6">
                {/* Invoice Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-primary mb-2">
                      {currentInvoice.invoice_number}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Type: {formatInvoiceType(currentInvoice.type)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {formatInvoiceDate(currentInvoice.invoice_date)}
                    </p>
                    {currentInvoice.due_date && (
                      <p className="text-sm text-gray-600">
                        Due: {formatInvoiceDate(currentInvoice.due_date)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatInvoiceAmount(currentInvoice.total_amount, currentInvoice.currency)}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-2 ${getInvoiceStatusBadgeClass(currentInvoice.status)}`}>
                      {currentInvoice.status}
                    </span>
                  </div>
                </div>

                {/* Billing Details */}
                {currentInvoice.billing_details && (
                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Billing Information</h5>
                    {currentInvoice.billing_details.name && (
                      <p className="text-sm text-gray-600">{currentInvoice.billing_details.name}</p>
                    )}
                    {currentInvoice.billing_details.email && (
                      <p className="text-sm text-gray-600">{currentInvoice.billing_details.email}</p>
                    )}
                    {currentInvoice.billing_details.address && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>{currentInvoice.billing_details.address.street}</p>
                        <p>
                          {currentInvoice.billing_details.address.city}, {currentInvoice.billing_details.address.state} {currentInvoice.billing_details.address.postalCode}
                        </p>
                        <p>{currentInvoice.billing_details.address.country}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Invoice Items */}
                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Items</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 text-sm font-medium text-gray-700">Description</th>
                          <th className="text-center py-2 text-sm font-medium text-gray-700">Qty</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-700">Unit Price</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInvoice.items && currentInvoice.items.length > 0 ? (
                          currentInvoice.items.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="py-3 text-sm text-gray-900">{item.description}</td>
                              <td className="py-3 text-sm text-center text-gray-900">{item.quantity}</td>
                              <td className="py-3 text-sm text-right text-gray-900">
                                {formatInvoiceAmount(item.unit_price, currentInvoice.currency)}
                              </td>
                              <td className="py-3 text-sm text-right text-gray-900">
                                {formatInvoiceAmount(item.amount, currentInvoice.currency)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-3 text-sm text-center text-gray-500">
                              No items available
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="py-3 text-sm text-right font-medium text-gray-700">
                            Subtotal:
                          </td>
                          <td className="py-3 text-sm text-right text-gray-900">
                            {formatInvoiceAmount(currentInvoice.subtotal, currentInvoice.currency)}
                          </td>
                        </tr>
                        {currentInvoice.tax_amount > 0 && (
                          <tr>
                            <td colSpan={3} className="py-3 text-sm text-right font-medium text-gray-700">
                              Tax:
                            </td>
                            <td className="py-3 text-sm text-right text-gray-900">
                              {formatInvoiceAmount(currentInvoice.tax_amount, currentInvoice.currency)}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t">
                          <td colSpan={3} className="py-3 text-sm text-right font-bold text-gray-900">
                            Total:
                          </td>
                          <td className="py-3 text-sm text-right font-bold text-gray-900">
                            {formatInvoiceAmount(currentInvoice.total_amount, currentInvoice.currency)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="border-t pt-4 text-sm text-gray-600">
                  <p><strong>Description:</strong> {currentInvoice.description}</p>
                  {currentInvoice.paid_date && (
                    <p><strong>Paid Date:</strong> {formatInvoiceDate(currentInvoice.paid_date)}</p>
                  )}
                  {currentInvoice.email_sent_at && (
                    <p><strong>Email Sent:</strong> {formatInvoiceDate(currentInvoice.email_sent_at)}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No invoice data available
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleResendEmail}
                disabled={isSendingEmail || !currentInvoice}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {isSendingEmail ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="las la-envelope mr-2"></i>
                    Resend Email
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading || !currentInvoice}
                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <i className="las la-download mr-2"></i>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;