import InvoiceTable from "@/components/invoices/InvoiceTable";
import InvoiceStatistics from "@/components/invoices/InvoiceStatistics";

const InvoicePage = () => {
  return (
    <div className="space-y-6">
      <InvoiceStatistics />
      
      <InvoiceTable />
    </div>
  );
};

export default InvoicePage;