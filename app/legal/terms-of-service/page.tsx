import LegalDocument from '@/components/legal/LegalDocument';

export const metadata = {
  title: 'Terms of Service - VeloCards',
  description: 'Read our Terms of Service to understand the rules and regulations governing the use of VeloCards services.',
};

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      documentPath="/legal/terms-of-service.md"
      title="Terms of Service"
    />
  );
}