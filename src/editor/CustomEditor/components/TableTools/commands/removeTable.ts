import { Editor, NodeEntry, Path, Point, Transforms } from 'slate';

export const removeTable = (table: NodeEntry, editor: Editor) => {
  if (table && editor) {
    Transforms.removeNodes(editor, {
      match: (n) => n.type === 'table',
      at: table[1],
    });
  }
};
