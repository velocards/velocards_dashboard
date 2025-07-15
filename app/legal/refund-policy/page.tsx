import LegalDocument from '@/components/legal/LegalDocument';

export const metadata = {
  title: 'Refund Policy - VeloCards',
  description: 'Learn about our refund and chargeback policies for VeloCards services.',
};

export default function RefundPolicyPage() {
  return (
    <LegalDocument
      documentPath="/legal/refund-policy.md"
      title="Refund Policy"
    />
  );
}