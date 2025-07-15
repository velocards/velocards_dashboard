import { ReactNode } from "react";
import Link from "next/link";
import { VeloCardsLogo } from "@/components/icons/VeloCardsLogo";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <VeloCardsLogo width={120} height={40} />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/legal/terms-of-service" className="text-sm hover:text-primary">
                Terms
              </Link>
              <Link href="/legal/privacy-policy" className="text-sm hover:text-primary">
                Privacy
              </Link>
              <Link href="/legal/kyc-aml-policy" className="text-sm hover:text-primary">
                KYC/AML
              </Link>
              <Link href="/auth/sign-in" className="btn-primary btn-sm">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/legal/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/legal/cookie-policy" className="hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Compliance</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/kyc-aml-policy" className="hover:text-primary">KYC/AML Policy</Link></li>
                <li><Link href="/legal/risk-disclosure" className="hover:text-primary">Risk Disclosure</Link></li>
                <li><Link href="/legal/acceptable-use-policy" className="hover:text-primary">Acceptable Use</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Cards</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/card-terms-conditions" className="hover:text-primary">Card Terms</Link></li>
                <li><Link href="/legal/refund-policy" className="hover:text-primary">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: legal@velocards.com</li>
                <li>Privacy: privacy@velocards.com</li>
                <li>Compliance: compliance@velocards.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} VeloCards. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}