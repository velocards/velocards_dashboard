"use client";
import { useState } from "react";
import Link from "next/link";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-col gap-4 xxl:gap-6">
      {/* Breadcrumb */}
      <div className="box p-4 xl:p-6">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/support/help-center" className="text-gray-600 hover:text-primary transition-colors">
            Help Center
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-gray-100">Contact Support</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 xxl:gap-6">
        {/* Contact Form */}
        <div className="col-span-12 lg:col-span-8 box p-6 xl:p-8">
          <h2 className="h3 mb-6">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Our support team is available 24/7 to help you with any questions or issues you may have.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a topic</option>
                <option value="account">Account Issues</option>
                <option value="cards">Virtual Cards</option>
                <option value="deposits">Deposits & Withdrawals</option>
                <option value="verification">KYC Verification</option>
                <option value="technical">Technical Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Please describe your issue in detail..."
                required
              />
            </div>

            <button type="submit" className="btn-primary px-8 py-3">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="col-span-12 lg:col-span-4 space-y-4 xxl:space-y-6">
          {/* Support Hours */}
          <div className="box p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="las la-clock text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold">Support Hours</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
          </div>

          {/* Response Time */}
          <div className="box p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="las la-reply text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold">Response Time</h3>
            </div>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <i className="las la-check-circle text-green-500"></i>
                <span>Urgent issues: Within 1 hour</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="las la-check-circle text-green-500"></i>
                <span>General queries: Within 4 hours</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="las la-check-circle text-green-500"></i>
                <span>Complex issues: Within 24 hours</span>
              </li>
            </ul>
          </div>

          {/* Other Ways to Get Help */}
          <div className="box p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="las la-question-circle text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold">Need Quick Help?</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Check our help center for instant answers to common questions.
            </p>
            <Link href="/support/help-center" className="btn-outline w-full">
              Browse Help Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;