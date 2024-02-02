const editorJsHtml = require('editorjs-html');
const EditorJsToHtml = editorJsHtml();

export default function PreviewRenderer({ data }: { data: any }) {
  // Check if data and data.blocks exist before trying to access them
  if (!data || !data.blocks) return null;
  const html = EditorJsToHtml.parse(data);

  console.log(html, data);

  return (
    <div style={{ flex: 1 }} key={data?.time}>
      {html?.map((item: any, index: any) => {
        if (typeof item === 'string') {
          return (
            <div dangerouslySetInnerHTML={{ __html: item }} key={index}></div>
          );
        }
        return item;
      })}
    </div>
  );
}
