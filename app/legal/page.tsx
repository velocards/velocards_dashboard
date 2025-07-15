import Link from 'next/link';
import { FileText, Shield, Cookie, AlertCircle, CreditCard, RefreshCw, Scale } from 'lucide-react';

export const metadata = {
  title: 'Legal Documents - VeloCards',
  description: 'Access all VeloCards legal documents, policies, and terms.',
};

const legalDocuments = [
  {
    category: 'Core Documents',
    documents: [
      {
        title: 'Terms of Service',
        description: 'Our general terms governing your use of VeloCards services.',
        href: '/legal/terms-of-service',
        icon: FileText,
      },
      {
        title: 'Privacy Policy',
        description: 'How we collect, use, and protect your personal information.',
        href: '/legal/privacy-policy',
        icon: Shield,
      },
      {
        title: 'Card Terms and Conditions',
        description: 'Specific terms for using VeloCards virtual cards.',
        href: '/legal/card-terms-conditions',
        icon: CreditCard,
      },
    ],
  },
  {
    category: 'Compliance & Security',
    documents: [
      {
        title: 'KYC/AML Policy',
        description: 'Our Know Your Customer and Anti-Money Laundering procedures.',
        href: '/legal/kyc-aml-policy',
        icon: Shield,
      },
      {
        title: 'Risk Disclosure Statement',
        description: 'Important information about risks associated with our services.',
        href: '/legal/risk-disclosure',
        icon: AlertCircle,
      },
      {
        title: 'Acceptable Use Policy',
        description: 'Guidelines for appropriate use of our platform and services.',
        href: '/legal/acceptable-use-policy',
        icon: Scale,
      },
    ],
  },
  {
    category: 'Additional Policies',
    documents: [
      {
        title: 'Cookie Policy',
        description: 'How we use cookies and tracking technologies.',
        href: '/legal/cookie-policy',
        icon: Cookie,
      },
      {
        title: 'Refund Policy',
        description: 'Our policies regarding refunds and chargebacks.',
        href: '/legal/refund-policy',
        icon: RefreshCw,
      },
    ],
  },
];

export default function LegalPage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Legal Documents</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Access all VeloCards legal documents and policies
        </p>
      </div>

      {legalDocuments.map((category) => (
        <div key={category.category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{category.category}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.documents.map((doc) => {
              const Icon = doc.icon;
              return (
                <Link
                  key={doc.href}
                  href={doc.href}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{doc.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">Contact Legal</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium">General Inquiries</p>
            <p className="text-gray-600 dark:text-gray-400">legal@velocards.com</p>
          </div>
          <div>
            <p className="font-medium">Privacy Concerns</p>
            <p className="text-gray-600 dark:text-gray-400">privacy@velocards.com</p>
          </div>
          <div>
            <p className="font-medium">Compliance</p>
            <p className="text-gray-600 dark:text-gray-400">compliance@velocards.com</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>All documents are regularly updated. Last review: {new Date().toLocaleDateString()}</p>
        <p className="mt-2">
          By using VeloCards services, you agree to all applicable terms and policies.
        </p>
      </div>
    </div>
  );
}