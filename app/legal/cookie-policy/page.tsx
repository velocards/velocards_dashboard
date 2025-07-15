import LegalDocument from '@/components/legal/LegalDocument';

export const metadata = {
  title: 'Cookie Policy - VeloCards',
  description: 'Understand how VeloCards uses cookies and tracking technologies.',
};

export default function CookiePolicyPage() {
  return (
    <LegalDocument
      documentPath="/legal/cookie-policy.md"
      title="Cookie Policy"
    />
  );
}