import type { OutputData } from '@editorjs/editorjs';
import DOMPurify from 'dompurify';

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

export default getCardText;
