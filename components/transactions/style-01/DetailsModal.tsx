import Modal from "@/components/shared/Modal";
import Image from "next/image";
type DetailsType = {
  open: boolean;
  toggleOpen: () => void;
};
const TransactionDetails = {
  Transfer: "#556443223",
  "Send To": "Felecia Brown",
  "Bank Account": "Wadk6265dlkd565",
  Date: "11 Aug, 2024",
  Time: "10:36 AM",
  "Card Number": "325 *** *** ***",
  Amount: "25,211.00 USD",
  Fee: "98 USD",
};
const DetailsModal = ({ open, toggleOpen }: DetailsType) => {
  return (
    <Modal open={open} toggleOpen={toggleOpen} width="max-w-[496px]" height="min-h-[980px]">
      <div className="bb-dashed border-secondary/20 pb-4 mb-4 lg:mb-6 lg:pb-6">
        <h4 className="h4">Transaction Details</h4>
      </div>
      <div className="py-3 px-6 bg-secondary/5 flex items-center gap-4 mb-6 lg:mb-8">
        <Image src="/images/paypal-big.png" width={56} height={56} alt="paypal icon" />
        <div>
          <p className="xm:text-xl font-medium mb-2">Deposit Cash</p>
          <span className="text-sm">Payment Successful</span>
        </div>
      </div>
      <ul className="flex flex-col gap-4 bb-dashed border-secondary/20 pb-4 mb-4 lg:mb-6 lg:pb-6">
        {Object.entries(TransactionDetails).map(([key, value]) => (
          <li key={key} className="flex justify-between">
            <span>{key}:</span> <span className="font-medium">{value}</span>
          </li>
        ))}
      </ul>
      <div className=" bb-dashed border-secondary/20 pb-4 mb-4 lg:mb-6 lg:pb-6">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2141.544710579929!2d90.39140680797202!3d23.87599993653183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1702184930477!5m2!1sen!2sbd"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="flex justify-center gap-4 flex-wrap lg:gap-6">
        <button className="flex items-center gap-2">
          <i className="las la-download border border-n30 dark:border-n500 rounded-full bg-primary/5 p-2"></i>
          <span>Download PDF </span>
        </button>
        <button className="flex items-center gap-2">
          <i className="las la-print border border-n30 dark:border-n500 rounded-full bg-primary/5 p-2"></i>
          <span>Print PDF </span>
        </button>
      </div>
    </Modal>
  );
};

export default DetailsModal;
