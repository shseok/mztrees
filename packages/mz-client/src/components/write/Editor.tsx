import React, { useCallback, useEffect, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import TextareaAutosize from 'react-textarea-autosize';

export default function Editor({
  data,
  onChange,
}: {
  data: any;
  onChange: any;
}) {
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
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
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        // data: { blocks: [] },
        data,
        async onChange(api, event) {
          // console.log("Editor data has changed", api.blocks);
          const data = await api.saver.save();
          onChange(data);
        },
        tools: {
          header: Header,
          // linkTool: LinkTool,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: `${process.env
                .NEXT_PUBLIC_LOCAL_API_BASE_URL!}/api/link`,
            },
          },
          // image: {
          //   class: ImageTool,
          //   config: {
          //     uploader: {
          //       async uploadByFile(file: File) {
          //         // upload to uploadthing
          //         // const [res] = await uploadFiles([file], 'imageUploader');

          //         return {
          //           success: 1,
          //           file: {
          //             url: res.fileUrl,
          //           },
          //         };
          //       },
          //     },
          //   },
          // },
          image: ImageTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      // editorjs가 초기화되면 title에 포커스를 준다.
      setTimeout(() => {
        _titleRef?.current?.focus();
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

  return <div id='editor' style={{ minHeight: '500px', flex: 1 }} />;
}
