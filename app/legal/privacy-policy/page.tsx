import LegalDocument from '@/components/legal/LegalDocument';

export const metadata = {
  title: 'Privacy Policy - VeloCards',
  description: 'Learn how VeloCards collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      documentPath="/legal/privacy-policy.md"
      title="Privacy Policy"
    />
  );
}