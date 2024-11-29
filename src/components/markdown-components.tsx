import type { Components } from 'react-markdown';
import Link from 'next/link';

interface CodeComponentProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

export const markdownComponents: Components = {
  p: ({ children, ...props }) => {
    if (typeof children === 'string') {
      const parts = children.split(/(#\d+)/g);
      return (
        <p {...props}>
          {parts.map((part, i) => {
            if (part.match(/^#\d+$/)) {
              const issueNumber = part.substring(1);
              return (
                <Link
                  key={i}
                  href={`/issue/${issueNumber}`}
                  className="text-[#0969da] dark:text-[#2f81f7] hover:underline"
                >
                  {part}
                </Link>
              );
            }
            return part;
          })}
        </p>
      );
    }
    return <p {...props}>{children}</p>;
  },
  a: ({ href, children, ...props }) => {
    if (!href) return <>{children}</>;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0969da] dark:text-[#2f81f7] hover:underline"
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ inline, className, children, ...props }: CodeComponentProps) => {
    if (inline) {
      return (
        <code
          className="px-[6px] py-[2px] rounded-[6px] bg-[#f6f8fa] dark:bg-[#2d333b] text-[#24292f] dark:text-[#adbac7] text-[85%] font-mono break-word"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className={`block p-4 rounded-lg bg-[#f6f8fa] dark:bg-[#2d333b] text-[#24292f] dark:text-[#adbac7] text-sm font-mono overflow-x-auto ${className || ''}`}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <div className="relative my-4">
      <pre
        className="p-4 rounded-lg bg-[#f6f8fa] dark:bg-[#2d333b] overflow-x-auto"
        {...props}
      >
        {children}
      </pre>
    </div>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-[#24292f] dark:text-[#adbac7]" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="text-[#24292f] dark:text-[#adbac7]" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="pl-4 border-l-4 border-[#d0d7de] dark:border-[#373e47] text-[#57606a] dark:text-[#768390]"
      {...props}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-5 my-4 text-[#24292f] dark:text-[#adbac7]" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-5 my-4 text-[#24292f] dark:text-[#adbac7]" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="my-1 text-[#24292f] dark:text-[#adbac7]" {...props}>
      {children}
    </li>
  ),
}; 