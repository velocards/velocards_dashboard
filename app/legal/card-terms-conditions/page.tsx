import LegalDocument from '@/components/legal/LegalDocument';

export const metadata = {
  title: 'Card Terms and Conditions - VeloCards',
  description: 'Terms and conditions governing the use of VeloCards virtual prepaid cards.',
};

export default function CardTermsConditionsPage() {
  return (
    <LegalDocument
      documentPath="/legal/card-terms-conditions.md"
      title="Card Terms and Conditions"
    />
  );
}