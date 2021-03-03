import { Editor, Element, Node, NodeEntry, Path, Range, Transforms } from 'slate';

import { ReactEditor } from 'slate-react';

const withLayout = (editor: ReactEditor) => {
  const { normalizeNode, deleteBackward, insertBreak } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // 对[0,0]位置处进行subject自定义
    if (path.length === 0) {
      if (editor.children.length < 1) {
        const subject = { type: 'subject', children: [{ text: '标题' }] };
        Transforms.insertNodes(editor, subject, { at: path.concat(0) });
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        if (childPath[0] === 0 && child.type !== 'subject') {
          Transforms.setNodes(editor, { type: 'subject' }, { at: childPath });
        }
        if (childPath[0] === 1 && child.type === 'subject') {
          Transforms.setNodes(editor, { type: 'paragraph' }, { at: childPath });
        }
      }
    }

    // 格式化无类型node
    if (Element.isElement(node) && !node.type) {
      Transforms.setNodes(editor, { type: 'paragraph' });
    }
    // 对paragraph进行约束
    if (Element.isElement(node) && (!node.type || node.type === 'paragraph')) {
      for (const [child, childPath] of Node.children(editor, path)) {
        // If the element is a paragraph, ensure its children are valid.

        if (Element.isElement(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }

        /** 删除段落中空的行内元素，如link和text */
        const childString = Editor.string(editor, childPath);
        if (Element.isElement(child) && editor.isInline(child) && !childString) {
          Transforms.unwrapNodes(editor, { at: childPath });
        }
      }
    }

    if (maybePreserveSpace(editor, entry)) return;

    normalizeNode(entry);
  };

  /* 在行尾插入断点换行 */
  editor.insertBreak = () => {
    const { selection } = editor;

    if (!selection) return;

    const parent = Editor.parent(editor, selection.anchor.path);
    const parentType = parent[0].type;
    const parentPath = parent[1].length;
    const parentSting = Editor.string(editor, parent[1]);

    // const isEnd = Point.equals(selection.anchor, start);
    // console.log(parent, Editor.string(editor, parent[1]));

    if (selection && Range.isCollapsed(selection)) {
      // 回车格式化保留之前的mark形式,若改node未起始点则回车先转化未paragraph
      const isNotParagraph = parent[0].type && parent[0].type !== 'paragraph';
      if (!parentSting && selection.anchor.offset === 0 && parent && isNotParagraph) {
        Transforms.setNodes(editor, { type: 'paragraph' });
        console.log('==');
        if (parentPath > 1 && parentType === 'list-item') {
          Transforms.liftNodes(editor, {
            match: (n) => n.type === 'paragraph',
          });
        }
        return;
      }

      insertBreak();
    }
  };

  /* 在行首删除时清除block和format */
  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (!selection) return;

    const parent = Editor.parent(editor, selection.anchor.path);
    const parentType = parent[0].type;
    // const node = Editor.next(editor, { at: selection });
    // console.log(selection, node, parent);

    if (selection.anchor.offset === 0 && parentType && parentType !== 'paragraph') {
      Transforms.setNodes(editor, { type: 'paragraph' });
      // 层级大于1时，提升当前node置顶
      if (selection.anchor.path.length > 2 && parentType === 'list-item') {
        Transforms.liftNodes(editor, {
          match: (n) => n.type === 'paragraph',
        });
      }
      return;
    }
    deleteBackward(unit);
  };

  return editor;
};

export const PreserveSpaceAfter = new Set(['table', 'image']);
export const PreserveSpaceBefore = new Set(['table', 'image']);

const maybePreserveSpace = (editor: ReactEditor, entry: NodeEntry): boolean | void => {
  const [node, path] = entry;

  // console.log(node, path);
  const { type } = node;

  let preserved = false;

  if (PreserveSpaceAfter.has(`${type}`)) {
    const next = Editor.next(editor, { at: path });
    if (!next || PreserveSpaceBefore.has(`${next[0].type}`)) {
      Transforms.insertNodes(editor, { children: [{ text: '' }] }, { at: Path.next(path) });
      preserved = true;
    }
  }

  if (PreserveSpaceBefore.has(`${type}`)) {
    if (path[path.length - 1] === 0) {
      Transforms.insertNodes(editor, { children: [{ text: '' }] }, { at: path });
      preserved = true;
    } else {
      return;
    }
  }

  return preserved;
};

export default withLayout;
