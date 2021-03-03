import { Editor, Transforms } from 'slate';

import { ReactEditor } from 'slate-react';

const withImages = (editor: ReactEditor) => {
  const { insertData, isVoid, insertBreak } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data: DataTransfer) => {
    const { files } = data;

    // // 检测是否是url
    // const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
    // const isUrl = reg.test(text);

    if (files && files.length > 0) {
      const reader = new FileReader();

      const [mime] = files['0'].type.split('/');
      if (mime === 'image') {
        reader.addEventListener('load', () => {
          const url = reader.result;
          insertImage(editor, url);
        });
        reader.readAsDataURL(files['0']);
      }
    } else {
      insertData(data);
    }
  };

  editor.insertBreak = () => {
    const { selection } = editor;

    if (!selection) return;

    const parent = Editor.parent(editor, selection);
    if (parent[0].type === 'image') {
      console.log(parent);
      Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] });
      return;
    }
    return insertBreak();
  };

  return editor;
};

const insertImage = (editor: ReactEditor, url: string | ArrayBuffer | null) => {
  const text = { text: '' };
  const image = { type: 'image', url, children: [text] };
  Transforms.insertNodes(editor, image);
};

export default withImages;
