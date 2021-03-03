import { Editor, Range, Transforms } from 'slate';

import { ReactEditor } from 'slate-react';
import { isBlockActive } from '../components/ToolBar/command';

const withLinks = (editor: ReactEditor) => {
  const { insertData, isInline } = editor;

  const isUrl = (text: string) => {
    const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
    return reg.test(text);
  };

  editor.isInline = (element) => {
    // 返回默认的isInline（element），官方默认位block属性，此时<=>false
    return element.type === 'link' ? true : isInline(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

// 插入输入的链接url
export const insertLink = (editor: ReactEditor, url: string) => {
  const isLink = Editor.above(editor, {
    match: (n) => n.type === 'link',
  });
  if (editor.selection) {
    if (isLink && isBlockActive(editor, 'link')) {
      unwrapLink(editor);
    } else wrapLink(editor, url);
  }
};

const unwrapLink = (editor: ReactEditor) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === 'link' });
};

const wrapLink = (editor: ReactEditor, url: string) => {
  if (url.includes('://')) {
    url = url.split('://')[1];
  }
  if (isBlockActive(editor, 'link')) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export default withLinks;
