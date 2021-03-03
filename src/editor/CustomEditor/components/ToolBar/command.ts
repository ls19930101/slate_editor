import { Editor, Node, Text, Transforms } from 'slate';

export const LIST_TYPES = ['numbered-list', 'bulleted-list'];

// 修改单个样式
export const toggleFormat = (editor: Editor, format: string) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true },
  );
};

// 单个样式是否启用
export const isFormatActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: 'all',
  });
  return !!match;
};

// 修改block
export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  console.log(isActive, format);
  const isList = LIST_TYPES.includes(format);
  Transforms.unwrapNodes(editor, {
    match: (n: Node) => LIST_TYPES.includes(`${n.type}`),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    // 有序和无序列表
    const block = { type: format, children: [] };

    Transforms.wrapNodes(editor, block);
  }
};

// 单个block是否启用
export const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });
  return !!match;
};
