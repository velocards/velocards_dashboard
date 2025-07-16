import { getArticleBySlug, getAllArticles } from "@/data/helpArticles";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function HelpArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 xxl:gap-6">
      {/* Breadcrumb */}
      <div className="box p-4 xl:p-6">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/support/help-center" className="text-gray-600 hover:text-primary transition-colors">
            Help Center
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{article.category}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-gray-100">{article.title}</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="box p-6 xl:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 text-sm text-primary mb-4">
              <i className="las la-tag"></i>
              <span>{article.category}</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{article.description}</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-semibold mb-4 mt-6">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-semibold mb-3 mt-4">{children}</h3>,
                p: ({children}) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                li: ({children}) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
                code: ({children}) => <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{children}</code>,
                pre: ({children}) => <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4">{children}</blockquote>,
                table: ({children}) => <table className="w-full border-collapse mb-4">{children}</table>,
                th: ({children}) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left">{children}</th>,
                td: ({children}) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{children}</td>,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          {/* Related Articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {article.relatedArticles.map((slug) => {
                  const relatedArticle = getArticleBySlug(slug);
                  if (!relatedArticle) return null;
                  
                  return (
                    <Link
                      key={slug}
                      href={`/support/help-center/${slug}`}
                      className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-semibold mb-2">{relatedArticle.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{relatedArticle.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 p-6 bg-primary/5 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Still need help?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <div className="flex gap-4">
              <Link href="/support/contact" className="btn-primary">
                Contact Support
              </Link>
              <Link href="/support/help-center" className="btn-outline">
                Back to Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}