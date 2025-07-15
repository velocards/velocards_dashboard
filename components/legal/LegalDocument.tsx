'use client';

import { useEffect, useState } from 'react';

interface LegalDocumentProps {
  documentPath: string;
  title: string;
}

export default function LegalDocument({ documentPath, title }: LegalDocumentProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(documentPath)
      .then(res => {
        if (!res.ok) throw new Error('Document not found');
        return res.text();
      })
      .then(text => {
        // Simple markdown to HTML conversion
        const html = text
          // Headers
          .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
          .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
          .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6">$1</h1>')
          // Bold
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          // Lists
          .replace(/^\- (.+)$/gim, '<li class="ml-4 mb-1">• $1</li>')
          .replace(/^\d+\. (.+)$/gim, '<li class="ml-4 mb-1">$1</li>')
          // Links
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
          // Line breaks
          .replace(/\n\n/g, '</p><p class="mb-4">')
          // Code blocks
          .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
          // Horizontal rules
          .replace(/^---$/gim, '<hr class="my-8 border-gray-200 dark:border-gray-800">');
        
        setContent(`<div class="prose prose-gray dark:prose-invert max-w-none"><p class="mb-4">${html}</p></div>`);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [documentPath]);

  // Update the page title
  useEffect(() => {
    document.title = `${title} - VeloCards`;
  }, [title]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Error loading document: {error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Table of Contents for long documents */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          This document is legally binding. Please read carefully.
        </p>
      </div>

      {/* Document Content */}
      <div 
        className="legal-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Back to top button */}
      <div className="mt-12 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          ↑ Back to top
        </button>
      </div>

      <style jsx global>{`
        .legal-content h1 { @apply text-3xl font-bold mb-6; }
        .legal-content h2 { @apply text-2xl font-bold mt-8 mb-4; }
        .legal-content h3 { @apply text-xl font-semibold mt-6 mb-3; }
        .legal-content h4 { @apply text-lg font-semibold mt-4 mb-2; }
        .legal-content ul { @apply list-disc list-inside mb-4; }
        .legal-content ol { @apply list-decimal list-inside mb-4; }
        .legal-content li { @apply ml-4 mb-1; }
        .legal-content strong { @apply font-semibold; }
        .legal-content a { @apply text-primary hover:underline; }
        .legal-content code { @apply bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm; }
        .legal-content hr { @apply my-8 border-gray-200 dark:border-gray-800; }
      `}</style>
    </>
  );
}