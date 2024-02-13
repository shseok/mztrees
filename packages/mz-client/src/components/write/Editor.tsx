import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type EditorJS from '@editorjs/editorjs';
import type { OutputData } from '@editorjs/editorjs';
import styles from '@/styles/Editor.module.scss';
import { uploader } from '@/lib/api/link';

export default function Editor({
  data,
  onChange,
  titleRef,
}: {
  data?: OutputData;
  onChange: (data: OutputData) => void;
  titleRef: RefObject<HTMLTextAreaElement>;
}) {
  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState(false);
  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Paragraph = (await import('@editorjs/paragraph')).default;
    const Alert = (await import('editorjs-alert')).default;
    const List = (await import('@editorjs/list')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Underline = (await import('@editorjs/underline')).default;
    const ChangeCase = (await import('editorjs-change-case')).default;
    const Strikethrough = (await import('@sotaproject/strikethrough')).default;
    const CheckList = (await import('@editorjs/checklist')).default;
    // const SimpleImage = (await import('@editorjs/simple-image')).default;
    const Marker = (await import('@editorjs/marker')).default;
    const ColorPlugin = (await import('editorjs-text-color-plugin')).default;
    const AlignmentBlockTune = (
      await import('editorjs-text-alignment-blocktune')
    ).default;
    const Code = (await import('@editorjs/code')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const InlineCode = (await import('@editorjs/inline-code')).default;
    const ImageTool = (await import('@editorjs/image')).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor;
        },
        placeholder: '게시물을 작성하려면 여기에 입력하세요',
        // inlineToolbar: true,
        // data: { blocks: [] },
        data,
        async onChange(api) {
          // TODO: 이게 어떻게 되는건가?
          // const data = await editor.save();
          const data = await api.saver.save();
          onChange(data);
        },
        tools: {
          textAlignment: {
            class: AlignmentBlockTune,
            config: {
              default: 'left',
              blocks: {
                header: 'center',
                list: 'left',
                paragraph: 'left',
              },
            },
          },
          header: {
            class: Header,
            inlineToolbar: true,
            tunes: ['textAlignment'],
            config: {
              // placeholder: '제목을 입력하세요',
              levels: [1, 2, 3, 4, 5],
              defaultLevel: 2,
            },
          },
          paragraph: {
            class: Paragraph,
            tunes: ['textAlignment'],
          },
          alert: {
            class: Alert,
            config: {
              defaultType: 'primary',
              messagePlaceholder: '내용을 입력하세요',
            },
          },
          list: {
            class: List,
            config: {
              defaultStyle: 'unordered',
            },
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: `/api/link`, // nextjs server api: ``credentials: 'include'``을 사용할 수 없기 때문
              headers: {
                'Content-Type': 'application/json',
              },
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader, // client api
            },
          },
          // simpleImage: SimpleImage, // 적용이 안되는 버그
          checkList: CheckList,
          underline: Underline,
          strikethrough: Strikethrough,
          marker: Marker,
          changeCase: ChangeCase,
          code: Code,
          inlineCode: InlineCode,
          embed: Embed,
          Color: {
            class: ColorPlugin,
            config: {
              colorCollections: [
                // 적용이 안되는 버그
                '#EC7878',
                '#9C27B0',
                '#673AB7',
                '#3F51B5',
                '#0070FF',
                '#03A9F4',
                '#00BCD4',
                '#4CAF50',
                '#8BC34A',
                '#CDDC39',
                '#FFF',
              ],
              defaultColor: '#017A59',
              type: 'text',
              customPicker: true,
            },
          },
        },
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      // editorjs가 초기화되면 title에 포커스를 준다.
      setTimeout(() => {
        titleRef?.current?.focus();
      }, 0);
    };
    if (!isMounted) return;

    init();
    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted]);

  useEffect(() => {
    //클라이언트 사이드에서 마운트되었을 때만 트리거 작동
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  return <div id='editor' className={styles.editor} />;
}
