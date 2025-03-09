'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ node: _, href, children, ...props }) => (
          <Link {...props} href={href ?? '#'} target="_blank">
            {children}
          </Link>
        ),
        img: ({ node: _, alt, style, ...props }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...props}
            alt={alt}
            style={{
              ...(style ?? {}),
              maxWidth: '100%',
              maxHeight: '16rem',
            }}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
