'use client';

import { useEffect, useState } from 'react';
import { getIssues } from '@/lib/github';
import { Button } from './ui/button';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

interface Label {
  id: number;
  name: string;
  color: string;
  description?: string;
}

interface Issue {
  number: number;
  title: string;
  body: string;
  created_at: string;
  state: string;
  labels: Label[];
}

interface GitHubIssue {
  number: number;
  title: string;
  body: string | null;
  created_at: string;
  state: string;
  labels: Label[];
}

interface ExpandedIssues {
  [key: number]: boolean;
}

export function IssueList({ 
  onSelect,
  selectedLabel,
  onLabelClick
}: { 
  onSelect: (issue: Issue) => void;
  selectedLabel: string | null;
  onLabelClick: (label: string) => void;
}) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIssues, setExpandedIssues] = useState<ExpandedIssues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function fetchIssues() {
      const data = await getIssues();
      const transformedIssues: Issue[] = (data as GitHubIssue[]).map(issue => ({
        number: issue.number,
        title: issue.title,
        body: issue.body || '',
        created_at: issue.created_at,
        state: issue.state,
        labels: issue.labels,
      }));
      setIssues(transformedIssues);
      setHasMore(transformedIssues.length === 10);
      setLoading(false);
    }
    fetchIssues();
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await getIssues(nextPage);
      const transformedIssues: Issue[] = (data as GitHubIssue[]).map(issue => ({
        number: issue.number,
        title: issue.title,
        body: issue.body || '',
        created_at: issue.created_at,
        state: issue.state,
        labels: issue.labels,
      }));
      setIssues(prev => [...prev, ...transformedIssues]);
      setCurrentPage(nextPage);
      setHasMore(transformedIssues.filter(issue => !selectedLabel || issue.labels.some(label => label.name === selectedLabel)).length === 10);
    } catch (error) {
      console.error('Error loading more issues:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const toggleExpand = (e: React.MouseEvent, issueNumber: number) => {
    e.stopPropagation();
    setExpandedIssues(prev => ({
      ...prev,
      [issueNumber]: !prev[issueNumber]
    }));
  };

  const filteredIssues = issues.filter(issue => !selectedLabel || issue.labels.some(label => label.name === selectedLabel));

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-100 dark:border-[#2d333b] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#2da44e] dark:border-t-[#2f81f7] rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-[#57606a] dark:text-[#768390] animate-pulse">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {issues.length === 0 ? (
        <div className="text-center p-8 border border-gray-200 dark:border-[#373e47] rounded-lg max-w-4xl mx-auto">
          <div className="text-[#57606a] dark:text-[#768390] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#24292f] dark:text-[#adbac7]">
            {selectedLabel ? `No issues with label "${selectedLabel}"` : 'No issues yet'}
          </h3>
          <p className="mt-1 text-sm text-[#57606a] dark:text-[#768390]">
            {selectedLabel ? 'Try selecting a different label' : 'Get started by creating your first issue'}
          </p>
        </div>
      ) : (
        <>
          {filteredIssues.map((issue) => (
            <div
              key={issue.number}
              className="group border border-gray-200 dark:border-[#373e47] rounded-lg shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05),0_1px_2px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.3),0_1px_2px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_-3px_rgba(0,0,0,0.1),0_2px_3px_-2px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_12px_-3px_rgba(0,0,0,0.4),0_2px_3px_-2px_rgba(0,0,0,0.3)] transition-shadow max-w-4xl mx-auto"
            >
              <div className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1 min-w-0 pr-4">
                    <h3 className="font-semibold text-[#24292f] dark:text-[#adbac7] truncate">
                      {issue.title}
                    </h3>
                    {issue.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {issue.labels.map((label) => (
                          <span
                            key={label.id}
                            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                              selectedLabel === label.name ? 'ring-2 ring-offset-2 ring-[#0969da] dark:ring-[#2f81f7]' : ''
                            }`}
                            style={{
                              backgroundColor: `#${label.color}20`,
                              color: `#${label.color}`,
                              border: `1px solid #${label.color}40`
                            }}
                            title={label.description}
                            onClick={(e) => {
                              e.stopPropagation();
                              onLabelClick(label.name);
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-[#57606a] dark:text-[#768390]">
                      <span>#{issue.number}</span>
                      <span>·</span>
                      <span>
                        <time dateTime={issue.created_at} className="whitespace-nowrap">
                          {new Date(issue.created_at).toLocaleDateString()}
                        </time>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#57606a] dark:text-[#768390] hover:text-[#24292f] dark:hover:text-[#adbac7] hover:bg-[#f6f8fa] dark:hover:bg-[#2d333b] -mr-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(issue);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      <span className="text-xs">Edit</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-[#373e47]">
                <div className="px-6 py-3">
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none relative"
                    data-color-mode="dark"
                    data-dark-theme="dark_dimmed"
                  >
                    <div className="relative">
                      <div 
                        className={`origin-top overflow-hidden transition-all duration-500 ease-in-out ${
                          !expandedIssues[issue.number] && issue.body.length > 300 
                            ? 'max-h-[300px]' 
                            : 'max-h-[10000px]'
                        }`}
                      >
                        <MDEditor.Markdown 
                          source={issue.body}
                          rehypePlugins={[[rehypeSanitize]]}
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--color-fg-default, #24292f)',
                            fontSize: 'inherit',
                          }}
                          className="text-[#24292f] dark:text-[#d1d5db] 
                            [&_h1]:!text-[#24292f] [&_h2]:!text-[#24292f] [&_h3]:!text-[#24292f] 
                            dark:[&_h1]:!text-[#adbac7] dark:[&_h2]:!text-[#adbac7] dark:[&_h3]:!text-[#adbac7] 
                            [&_h4]:!text-[#24292f] [&_h5]:!text-[#24292f] [&_h6]:!text-[#24292f]
                            dark:[&_h4]:!text-[#adbac7] dark:[&_h5]:!text-[#adbac7] dark:[&_h6]:!text-[#adbac7]
                            [&_strong]:!text-[#24292f] dark:[&_strong]:!text-[#adbac7]
                            [&_a]:!text-[#0969da] dark:[&_a]:!text-[#2f81f7] [&_a]:no-underline hover:[&_a]:underline 
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
                        />
                      </div>
                      {!expandedIssues[issue.number] && issue.body.length > 300 && (
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#22272e] to-transparent opacity-100 transition-all duration-500" />
                      )}
                    </div>
                    {issue.body.length > 300 && (
                      <button
                        onClick={(e) => toggleExpand(e, issue.number)}
                        className="mt-2 text-xs font-semibold text-[#0969da] dark:text-[#2f81f7] hover:text-[#0969da]/90 dark:hover:text-[#2f81f7]/90 relative z-10"
                      >
                        {expandedIssues[issue.number] ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {hasMore && filteredIssues.length >= 10 && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
                className="text-[#57606a] dark:text-[#768390] border-gray-200 dark:border-[#373e47] hover:bg-[#f6f8fa] dark:hover:bg-[#2d333b] hover:text-[#24292f] dark:hover:text-[#adbac7] shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] px-4"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Load more'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 