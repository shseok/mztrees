import React from 'react';
import type { OutputBlockData } from '@editorjs/editorjs';
import { extractDomain } from '@/utils/extractDomain';

interface Props {
  block: OutputBlockData<string, any>;
}
export default function Content({ block }: Props) {
  let content = '';
  let text;
  let align;
  let listItems = '';
  let caption;
  switch (block.type) {
    case 'paragraph':
      console.log('paragraph', block);
      text = block.data.text;
      align = block.tunes?.textAlignment?.alignment;
      content = `<div class="ce-block__content"><p style="text-align: ${align}">${text}</p></div>`;
      break;
    case 'header':
      console.log('header', block);
      const level = block.data.level;
      text = block.data.text;
      align = block.tunes?.textAlignment?.alignment;
      content = `<div class="ce-block__content"><h${level} style="text-align: ${align}">${text}</h${level}></div>`;
      break;
    case 'alert':
      console.log('alert', block);
      const type = block.data.type;
      text = block.data.message || '빈 내용입니다';
      align = block.data.align;
      // TODO: cdx- 이렇게 붙여주고 있는데, 따로 컴포넌트로 만들어서 붙여주는게 좋을듯
      content = `<div class="ce-block__content"><div class="cdx-alert cdx-alert-${type}" style="text-align: ${align}">${text}</div></div>`;
      break;
    case 'list':
      console.log('list', block);
      const style = block.data.style;
      block.data.items.map((item: string) => {
        listItems += `<li class="cdx-list__item">${item}</li>`;
      });
      style === 'unordered'
        ? (content = `<ul class="cdx-block cdx-list cdx-list--unordered">${listItems}</ul>`)
        : (content = `<ol class="cdx-block cdx-list cdx-list--ordered">${listItems}</ol>`);
      break;
    // return (
    //   <ul>
    //     {content.split('\n').map((item, index) => (
    //       <li key={index}>{item}</li>
    //     ))}
    //   </ul>
    // );
    case 'checkList':
      console.log('checklist', block);
      block.data.items.map((item: { text: string; checked: boolean }) => {
        listItems += `<div class="cdx-checklist__item ${
          item.checked && 'cdx-checklist__item--checked'
        }">
        <div class="cdx-checklist__item-checkbox"><span class="cdx-checklist__item-checkbox-check"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 12L10.4884 15.8372C10.5677 15.9245 10.705 15.9245 10.7844 15.8372L17 9"></path></svg></span></div>
        <div class="cdx-checklist__item-text" contenteditable="true">${
          item.text
        }</div></div>`;
      });
      content = `
      <div class="ce-block">
        <div class="ce-block__content">
          <div class="cdx-block cdx-checklist">
          ${listItems}
          </div>
        </div>
      </div>`;
      break;
    // return (
    //   <ul>
    //     {content.split('\n').map((item, index) => (
    //       <li key={index}>
    //         <input type='checkbox' disabled />
    //         {item}
    //       </li>
    //     ))}
    //   </ul>
    // );
    case 'image':
      console.log('image', block);
      caption = block.data.caption;
      const {
        file: { url },
        streched,
        withBackground,
        withBorder,
      } = block.data;
      const classes = `cdx-block image-tool image-tool--filled ${
        streched && 'image-tool--stretched'
      } ${withBackground && 'image-tool--withBackground'} ${
        withBorder && 'image-tool--withBorder'
      }`;
      const imageTag = `
      <img class="image-tool__image-picture" src="${url}" alt="${caption}" />
      <i>${caption}</i>`;
      content = `
      <div class="ce-block">
        <div class="ce-block__content">
          <div class="${classes}">
            <div class="image-tool__image" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
             ${imageTag}
            </div>
          </div>
        </div>
      </div>`;
      break;
    case 'embed':
      console.log('embed', block);
      const { embed, height } = block.data;
      caption = block.data.caption;
      const embedTag = `<iframe width="100%" height="${height}"
src="${embed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
</iframe>
<i>${caption}</i>
`;
      content = `<div class="ce-block__content"><div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">${embedTag}</div></div>`;
      break;
    case 'linkTool':
      const {
        link,
        meta: { title, description, image },
      } = block.data;
      const domain = extractDomain(link) ?? 'unknown domain';
      content = `
      <div class="ce-block__content">
        <div class="cdx-block">
          <div class="link-tool">
            <a class="link-tool__content link-tool__content--rendered" target="_blank" rel="nofollow noindex noreferrer" href="${link}">
              <div class="link-tool__image" style="background-image: url(&quot;${image}&quot;);"></div>
              <div class="link-tool__title">${title}</div>
              <p class="link-tool__description">${description}</p>
              <span class="link-tool__anchor">${domain}</span>
            </a>
          </div>
        </div>
      </div>`;
    default:
      break;
  }
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
