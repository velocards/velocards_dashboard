import LegalDocument from '@/components/legal/LegalDocument';

export const metadata = {
  title: 'KYC/AML Policy - VeloCards',
  description: 'Our Know Your Customer and Anti-Money Laundering policy ensures compliance and security.',
};

export default function KycAmlPolicyPage() {
  return (
    <LegalDocument
      documentPath="/legal/kyc-aml-policy.md"
      title="KYC/AML Policy"
    />
  );
}