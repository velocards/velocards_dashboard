import LegalDocument from '@/components/legal/LegalDocument';

export const metadata = {
  title: 'Acceptable Use Policy - VeloCards',
  description: 'Guidelines for appropriate use of VeloCards platform and services.',
};

export default function AcceptableUsePolicyPage() {
  return (
    <LegalDocument
      documentPath="/legal/acceptable-use-policy.md"
      title="Acceptable Use Policy"
    />
  );
}