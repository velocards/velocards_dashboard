import LegalDocument from '@/components/legal/LegalDocument';

export const metadata = {
  title: 'Risk Disclosure Statement - VeloCards',
  description: 'Important information about the risks associated with using VeloCards services.',
};

export default function RiskDisclosurePage() {
  return (
    <LegalDocument
      documentPath="/legal/risk-disclosure.md"
      title="Risk Disclosure Statement"
    />
  );
}