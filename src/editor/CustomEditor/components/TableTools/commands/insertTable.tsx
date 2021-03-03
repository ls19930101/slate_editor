import { Editor, Range, Transforms } from 'slate';

import { createTable } from '../../../Plugins/withTables';

export const insertTable = (editor: Editor) => {
  const { selection } = editor;

  if (!selection) {
    return;
  }

  const node = Editor.above(editor, {
    match: (n) => n.type === 'table',
  });

  const isCollapsed = Range.isCollapsed(selection);

  if (!node && isCollapsed) {
    const table = createTable(3, 4);

    Transforms.insertNodes(editor, table);

    const nextNode = Editor.next(editor, { at: selection });
    if (nextNode) {
      Transforms.select(editor, nextNode[1]);
    }
  }
};
