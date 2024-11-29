'use client';

import { useEffect, useState, use } from 'react';
import { getIssue } from '@/lib/github';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { markdownComponents } from '@/components/markdown-components';

interface Label {
  id: number;
  name: string;
  color: string;
  description: string | null;
}

interface Issue {
  number: number;
  title: string;
  body: string;
  created_at: string;
  state: string;
  labels: Label[];
}

export default function IssuePage({ params }: { params: Promise<{ number: string }> }) {
  const resolvedParams = use(params);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchIssue() {
      try {
        const data = await getIssue(parseInt(resolvedParams.number));
        setIssue(data);
      } catch (error) {
        console.error('Error fetching issue:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, [resolvedParams.number]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#22272e] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0969da] dark:border-[#2f81f7]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#22272e] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-[#24292f] dark:text-[#adbac7] mb-2">
              Issue not found
            </h2>
            <p className="text-[#57606a] dark:text-[#768390] mb-4">
              The issue you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-gray-200 dark:border-[#373e47] hover:bg-gray-50 dark:hover:bg-[#2d333b]"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#22272e] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="text-[#57606a] dark:text-[#768390] hover:text-[#24292f] dark:hover:text-[#adbac7] -ml-2"
          >
            ← Back to Issues
          </Button>
        </div>
        
        <div className="bg-white dark:bg-[#2d333b] border border-gray-200 dark:border-[#373e47] rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-[#24292f] dark:text-[#adbac7]">
                {issue.title}
              </h1>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                  issue.state === 'open' 
                    ? 'bg-[#dafbe1] text-[#1a7f37] dark:bg-[#1a7f37]/20 dark:text-[#3fb950]' 
                    : 'bg-[#faf2f8] text-[#8250df] dark:bg-[#8250df]/20 dark:text-[#a371f7]'
                }`}>
                  <span className="relative flex w-2 h-2 mr-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      issue.state === 'open' 
                        ? 'bg-[#1a7f37] dark:bg-[#3fb950]' 
                        : 'bg-[#8250df] dark:bg-[#a371f7]'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      issue.state === 'open' 
                        ? 'bg-[#1a7f37] dark:bg-[#3fb950]' 
                        : 'bg-[#8250df] dark:bg-[#a371f7]'
                    }`}></span>
                  </span>
                  {issue.state}
                </span>
                <span className="text-sm text-[#57606a] dark:text-[#768390]">
                  #{issue.number}
                </span>
              </div>
            </div>

            {issue.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {issue.labels.map((label) => (
                  <span
                    key={label.id}
                    className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: `#${label.color}20`,
                      color: `#${label.color}`,
                      border: `1px solid #${label.color}40`
                    }}
                    title={label.description || undefined}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={markdownComponents}
                className="text-[#24292f] dark:text-[#d1d5db] 
                  [&_h1]:!text-[#24292f] [&_h2]:!text-[#24292f] [&_h3]:!text-[#24292f] 
                  dark:[&_h1]:!text-[#adbac7] dark:[&_h2]:!text-[#adbac7] dark:[&_h3]:!text-[#adbac7] 
                  [&_h4]:!text-[#24292f] [&_h5]:!text-[#24292f] [&_h6]:!text-[#24292f]
                  dark:[&_h4]:!text-[#adbac7] dark:[&_h5]:!text-[#adbac7] dark:[&_h6]:!text-[#adbac7]
                  [&_strong]:!text-[#24292f] dark:[&_strong]:!text-[#adbac7]
                  [&_a]:!text-[#0969da] dark:[&_a]:!text-[#2f81f7] [&_a]:no-underline hover:[&_a]:underline hover:[&_a]:text-[#0969da]/90 dark:hover:[&_a]:text-[#2f81f7]/90
                  [&_code]:!text-[#24292f] dark:[&_code]:!text-[#d1d5db] 
                  [&_pre]:!bg-[#f6f8fa] dark:[&_pre]:!bg-[#2d333b] 
                  [&_blockquote]:!text-[#57606a] dark:[&_blockquote]:!text-[#8b949e] 
                  [&_blockquote]:!border-l-4 [&_blockquote]:!border-[#d0d7de] dark:[&_blockquote]:!border-[#373e47] 
                  [&_blockquote]:!pl-4 [&_blockquote]:!ml-0 [&_blockquote]:!my-4
                  [&_blockquote_p]:!text-[#57606a] dark:[&_blockquote_p]:!text-[#8b949e]
                  [&_ul]:list-disc [&_ul]:!pl-5 [&_ul]:!my-4 
                  [&_ul]:!text-[#24292f] dark:[&_ul]:!text-[#d1d5db]
                  [&_ol]:list-decimal [&_ol]:!pl-5 [&_ol]:!my-4 
                  [&_ol]:!text-[#24292f] dark:[&_ol]:!text-[#d1d5db]
                  [&_li]:!my-1 [&_li]:!text-[#24292f] dark:[&_li]:!text-[#d1d5db]
                  [&_p]:!text-[#24292f] dark:[&_p]:!text-[#d1d5db] [&_p]:!my-4
                  [&_li_p]:!my-0
                  [&_ul_ul]:!mt-0 [&_ul_ul]:!mb-0
                  [&_ol_ol]:!mt-0 [&_ol_ol]:!mb-0
                  [&_li]:marker:text-[#57606a] dark:[&_li]:marker:text-[#768390]"
              >
                {issue.body}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 