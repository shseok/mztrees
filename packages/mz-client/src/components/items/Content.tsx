import type { OutputBlockData } from '@editorjs/editorjs';
import { extractDomain } from '@/utils/extractDomain';
import styles from '@/styles/Content.module.scss';
import { cn } from '@/utils/common';
import { useSanitizeContent } from '@/hooks/useSanitizeContent';

interface Props {
  block: OutputBlockData<string, any>;
}
export default function Content({ block }: Props) {
  let content;
  let align;
  let caption;

  const { sanitizedHTML, sanitizedHTMLs } = useSanitizeContent(block);

  switch (block.type) {
    case 'paragraph': {
      align = block.tunes?.textAlignment?.alignment;
      content = (
        <p
          className={cn(styles.paragraph, styles[align])}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        ></p>
      );
      break;
    }
    case 'header': {
      const level = block.data.level;
      align = block.tunes?.textAlignment?.alignment;
      content = (
        <p
          className={cn(styles.header, styles[`h${level}`], styles[align])}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        ></p>
      );
      break;
    }
    case 'alert': {
      const type = block.data.type;
      align = block.data.align;
      content = (
        <div
          className={cn(styles.alert, styles[`alert-${type}`], styles[align])}
          dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        ></div>
      );
      break;
    }
    case 'list': {
      const style = block.data.style;
      content = (
        <ul
          className={cn(styles.list, style === 'unordered' && styles.unordered)}
        >
          {sanitizedHTMLs.map((item: string, index: number) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
          ))}
        </ul>
      );
      break;
    }
    case 'checkList': {
      content = (
        <div className={styles.check_list}>
          {sanitizedHTMLs.map(
            (
              { text, checked }: { text: string; checked: boolean },
              index: number
            ) => (
              <div
                key={index}
                className={cn(styles.item, checked && styles.checked)}
              >
                {/* <input type='checkbox' disabled checked={checked} /> */}
                <div className={styles.checkbox_wrapper}>
                  <span className={styles.checkbox}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <path
                        stroke='currentColor'
                        stroke-linecap='round'
                        stroke-width='2'
                        d='M7 12L10.4884 15.8372C10.5677 15.9245 10.705 15.9245 10.7844 15.8372L17 9'
                      ></path>
                    </svg>
                  </span>
                </div>
                <p
                  className={styles.text}
                  dangerouslySetInnerHTML={{ __html: text }}
                ></p>
              </div>
            )
          )}
        </div>
      );
      break;
    }
    case 'image': {
      caption = block.data.caption;
      const {
        file: { url },
        streched,
        withBackground,
        withBorder,
      } = block.data;
      content = (
        <div
          className={cn(
            styles.image,
            streched && styles.streched,
            withBackground && styles.withBackground,
            withBorder && styles.withBorder
          )}
        >
          <div className={styles.inner}>
            <img src={url} alt={caption} className={styles.image} />
            <i>{caption}</i>
          </div>
        </div>
      );
      break;
    }
    case 'embed': {
      const { embed, height } = block.data;
      caption = block.data.caption;
      content = (
        <div className={styles.embed}>
          <iframe
            width='100%'
            height={height}
            src={embed}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          ></iframe>
          <i>{caption}</i>
        </div>
      );
      break;
    }
    case 'linkTool': {
      const {
        link,
        meta: { title, description, image },
      } = block.data;
      const domain = extractDomain(link) ?? 'unknown domain';
      content = (
        <div className={styles.linkTool}>
          <a
            href={link}
            target='_blank'
            rel='nofollow noindex noreferrer'
            className={styles.content}
          >
            <div className={styles.card_main}>
              <h4 className={styles.title}>{title}</h4>
              <p className={styles.description}>{description}</p>
              <span className={styles.anchor}>{domain}</span>
            </div>
            <div
              className={styles.card_image}
              style={{ backgroundImage: `url(${image.url})` }}
            />
          </a>
        </div>
      );
      break;
    }
    default: {
      break;
    }
  }
  return <div className={styles.block}>{content}</div>;
}
