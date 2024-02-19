import type { OutputData } from '@editorjs/editorjs';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

export const useGetLinkItemText = (text: string) => {
  const [linkText, setLinkText] = useState('');

  const sanitizedHTML = (html: string) => {
    const config = { USE_PROFILES: { html: true } };
    return DOMPurify.sanitize(html, config);
  };

  const getCardText = (text: string) => {
    const bodyObj = JSON.parse(text) as OutputData;
    const bodyText =
      bodyObj.blocks
        ?.filter((block) => block.type === 'paragraph')
        ?.map((block) => sanitizedHTML(block.data.text))
        .join('') ?? '';

    return bodyText;
  };

  useEffect(() => {
    setLinkText(getCardText(text));
  }, []);

  return linkText;
};
