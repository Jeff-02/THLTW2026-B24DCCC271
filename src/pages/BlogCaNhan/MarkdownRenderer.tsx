import React from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Parse markdown to HTML
  const html = marked.parse(content);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        lineHeight: 1.8,
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.85)',
      }}
    />
  );
};

export default MarkdownRenderer;
