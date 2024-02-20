import type { OutputBlockData } from '@editorjs/editorjs';
import { useEffect, useState } from 'react';

export const useSanitizeContent = (block: OutputBlockData<string, any>) => {
  const [sanitizedHTML, setSanitizedHTML] = useState('');
  const [sanitizedHTMLs, setSanitizedHTMLs] = useState<Array<any>>([]);

  useEffect(() => {
    async function sanitizeHTML(html: string) {
      try {
        // Dynamically import DOMPurify
        const DOMPurify = await import('dompurify');

        // Your sanitization logic
        const config = { USE_PROFILES: { html: true } };
        const sanitizedContent = DOMPurify.sanitize(html, config);
        setSanitizedHTML(sanitizedContent);
      } catch (error) {
        console.error('Error loading DOMPurify:', error);
        // Handle the error, perhaps fallback to a different sanitization approach
        setSanitizedHTML(html); // Or return some sanitized version without DOMPurify
      }
    }

    async function sanitinzeHTMLs(htmls: Array<any>, type?: string) {
      try {
        // Dynamically import DOMPurify
        const DOMPurify = await import('dompurify');

        // Your sanitization logic
        const config = { USE_PROFILES: { html: true } };
        let sanitizedContents;
        if (!type) {
          sanitizedContents = htmls.map((html: string) =>
            DOMPurify.sanitize(html, config)
          );
        }
        sanitizedContents = htmls.map(({ text, checked }) => {
          return {
            text: DOMPurify.sanitize(text, config),
            checked,
          };
        });

        setSanitizedHTMLs(sanitizedContents);
      } catch (error) {
        console.error('Error loading DOMPurify:', error);
        // Handle the error, perhaps fallback to a different sanitization approach
        setSanitizedHTMLs(htmls); // Or return some sanitized version without DOMPurify
      }
    }
    switch (block.type) {
      case 'paragraph': {
        sanitizeHTML(block.data.text);
        break;
      }
      case 'header': {
        sanitizeHTML(block.data.text);
        break;
      }
      case 'alert': {
        sanitizeHTML(block.data.message || '빈 내용입니다');
        break;
      }
      case 'list': {
        sanitinzeHTMLs(block.data.items);
        break;
      }
      case 'checkList': {
        sanitinzeHTMLs(block.data.items, 'checkList');
        break;
      }
      default: {
        break;
      }
    }
  }, [block]);

  return { sanitizedHTML, sanitizedHTMLs };
};
