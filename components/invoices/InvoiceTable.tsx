"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { 
  getInvoiceStatusBadgeClass, 
  formatInvoiceType
} from "@/types/invoice";
import type { InvoiceStatus } from "@/types/invoice";
import {
  formatInvoiceAmount,
  formatInvoiceDate,
  viewInvoicePDF
} from "@/lib/api/invoices";
import InvoiceDetailModal from "./InvoiceDetailModal";
import { toast } from "react-toastify";

const InvoiceTable = () => {
  const {
    invoices,
    pagination,
    isLoading,
    isDownloading,
    isSendingEmail,
    fetchInvoices,
    downloadInvoice,
    resendInvoice,
    setFilters
  } = useInvoiceStore();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInvoiceId, setModalInvoiceId] = useState<string | null>(null);
  const [isViewingPdf, setIsViewingPdf] = useState(false);
  const [viewingInvoiceId, setViewingInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch invoices on component mount
    fetchInvoices();
  }, [fetchInvoices]);

  const handleViewPDF = async (invoiceId: string) => {
    try {
      setIsViewingPdf(true);
      setViewingInvoiceId(invoiceId);
      await viewInvoicePDF(invoiceId);
    } catch (error) {
      console.error('Failed to view PDF:', error);
      toast.error('Failed to view PDF. Please try again.');
    } finally {
      setIsViewingPdf(false);
      setViewingInvoiceId(null);
    }
  };

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    try {
      setSelectedInvoiceId(invoiceId);
      await downloadInvoice(invoiceId, invoiceNumber);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Failed to download invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setSelectedInvoiceId(null);
    }
  };

  const handleResendEmail = async (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    const result = await resendInvoice(invoiceId);
    setSelectedInvoiceId(null);
    
    if (result) {
      if (result.success) {
        toast.success(result.message || 'Invoice email sent successfully!');
      } else {
        toast.error(result.message || 'Failed to send invoice email');
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const calculateTotalRevenue = () => {
    return invoices.reduce((total, invoice) => {
      if (invoice.status === 'paid') {
        return total + invoice.total_amount;
      }
      return total;
    }, 0);
  };

  const handleViewInvoice = (invoiceId: string) => {
    setModalInvoiceId(invoiceId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalInvoiceId(null);
  };

  if (isLoading) {
    return (
      <div className="box col-span-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="box col-span-12">
      <div className="flex flex-wrap gap-4 justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">All Invoices</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Total Paid Invoices:</span>
          <span className="font-semibold text-lg text-primary">
            {formatInvoiceAmount(calculateTotalRevenue())}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th className="text-start py-5 px-6">Invoice Number</th>
              <th className="text-start py-5 px-6">Type</th>
              <th className="text-start py-5 px-6">Amount</th>
              <th className="text-start py-5 px-6">Issue Date</th>
              <th className="text-center py-5 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr 
                  key={invoice.id} 
                  className="even:bg-secondary/5 dark:even:bg-bg3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleViewInvoice(invoice.id)}
                >
                  <td className="py-4 px-6">
                    <span className="font-medium text-primary">{invoice.invoice_number}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm">{formatInvoiceType(invoice.type)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold">
                      {formatInvoiceAmount(invoice.total_amount, invoice.currency)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">
                      {formatInvoiceDate(invoice.invoice_date)}
                    </span>
                  </td>
                  <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                        title="View PDF"
                        onClick={() => handleViewPDF(invoice.id)}
                        disabled={isViewingPdf && viewingInvoiceId === invoice.id}
                      >
                        {isViewingPdf && viewingInvoiceId === invoice.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                        ) : (
                          <i className="las la-file-pdf text-lg"></i>
                        )}
                      </button>
                      <button 
                        className="text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                        title="Download PDF"
                        onClick={() => handleDownload(invoice.id, invoice.invoice_number)}
                        disabled={isDownloading && selectedInvoiceId === invoice.id}
                      >
                        {isDownloading && selectedInvoiceId === invoice.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                        ) : (
                          <i className="las la-download text-lg"></i>
                        )}
                      </button>
                      <button 
                        className="text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                        title="Send Email"
                        onClick={() => handleResendEmail(invoice.id)}
                        disabled={isSendingEmail && selectedInvoiceId === invoice.id}
                      >
                        {isSendingEmail && selectedInvoiceId === invoice.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                        ) : (
                          <i className="las la-envelope text-lg"></i>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <p className="text-sm text-gray-600">
            Showing {invoices.length} of {pagination.total} invoices
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        invoiceId={modalInvoiceId}
      />
    </div>
  );
};

export default InvoiceTable;