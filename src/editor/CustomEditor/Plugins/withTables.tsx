import { Editor, Element, Node, Path, Point, Range, Transforms } from 'slate';

import { ReactEditor } from 'slate-react';
import { v4 as uuid } from 'uuid';

const withTables = (editor: ReactEditor) => {
  const { addMark, removeMark, insertText, deleteBackward, deleteFragment } = editor;

  // editor.addMark = (key, value) => {
  //   console.log('2');
  //   if (editor.selection) {
  //     const lastSelection = editor.selection;

  //     const selectedCells = Editor.nodes(editor, {
  //       match: (n) => !!n.selectedCell,
  //       at: [],
  //     });

  //     console.log(selectedCells);
  //     let isTable = false;

  //     for (let cell of selectedCells) {
  //       if (!isTable) {
  //         isTable = true;
  //       }

  //       const [content] = Editor.nodes(editor, {
  //         match: (n) => n.type === 'table-content',
  //         at: cell[1],
  //       });
  //       console.log(content);

  //       if (Editor.string(editor, content[1]) !== '') {
  //         Transforms.setSelection(editor, Editor.range(editor, cell[1]));
  //         addMark(key, value);
  //       }
  //     }

  //     if (isTable) {
  //       Transforms.select(editor, lastSelection);
  //       return;
  //     }
  //   }

  //   addMark(key, value);
  // };

  // editor.removeMark = (key) => {
  //   if (editor.selection) {
  //     const lastSelection = editor.selection;
  //     const selectedCells = Editor.nodes(editor, {
  //       match: (n) => !!n.selectedCell,
  //       at: [],
  //     });

  //     let isTable = false;
  //     for (let cell of selectedCells) {
  //       if (!isTable) {
  //         isTable = true;
  //       }

  //       const [content] = Editor.nodes(editor, {
  //         match: (n) => n.type === 'table-content',
  //         at: cell[1],
  //       });

  //       if (Editor.string(editor, content[1]) !== '') {
  //         Transforms.setSelection(editor, Editor.range(editor, cell[1]));
  //         removeMark(key);
  //       }
  //     }

  //     if (isTable) {
  //       Transforms.select(editor, lastSelection);
  //       return;
  //     }
  //   }
  //   removeMark(key);
  // };

  editor.insertText = (text) => {
    const { selection } = editor;

    if (!selection || !ReactEditor.isFocused(editor)) return;

    const [table] = Editor.nodes(editor, { at: selection, match: (n) => n.type === 'table' });
    const isCollapsed = Range.isCollapsed(selection);

    if (table && !isCollapsed) {
      console.log('out');
      return;
    }

    insertText(text);
  };

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (!selection) return;

    if (selection && Range.isCollapsed(selection)) {
      const isInTable = Editor.above(editor, {
        match: (n) => n.type === 'table',
      });

      if (isInTable) {
        const currCell = Editor.above(editor, {
          match: (n) => n.type === 'table-cell',
        });

        const start = currCell && Editor.start(editor, currCell[1]);

        const isStart = start && Point.equals(selection.anchor, start);

        if (isStart) return;
      }

      deleteBackward(unit);
    }
  };

  editor.deleteFragment = () => {
    console.log('frag', isInSameTable(editor));
    const { selection } = editor;

    if (!selection) return;

    if (isInSameTable(editor)) {
      const selectedCells = Editor.nodes(editor, { match: (n) => !!n.selectedCell });

      for (let cell of selectedCells) {
        Transforms.setSelection(editor, Editor.range(editor, cell[1]));
        const [content] = Editor.nodes(editor, {
          match: (n) => n.type === 'table-content',
        });

        Transforms.insertNodes(editor, createContent(), { at: content[1] });
        Transforms.removeNodes(editor, { at: Path.next(content[1]) });
      }
      return;
    }
    Transforms.removeNodes(editor, {
      match: (n) => n.type === 'table',
    });

    deleteFragment();
  };

  return editor;
};

export function isInSameTable(editor: Editor): boolean {
  if (!editor.selection) return false;

  const [start, end] = Editor.edges(editor, editor.selection);
  const [startTable] = Editor.nodes(editor, {
    at: start,
    match: (n) => n.type === 'table',
  });

  const [endTable] = Editor.nodes(editor, {
    at: end,
    match: (n) => n.type === 'table',
  });

  if (startTable && endTable) {
    const [, startPath]: [any, Path] = startTable;
    const [, endPath]: [any, Path] = endTable;

    if (Path.equals(startPath, endPath)) {
      return true;
    }
  }

  return false;
}

/*
table中row，cell，content的类型
*/
export interface Row extends Element {
  type: 'table-row';
  key: string;
  data: any;
  children: Cell[];
}

export interface Cell extends Element {
  type: 'table-cell';
  key: string;
  rowspan?: number;
  colspan?: number;
  width?: number;
  height?: number;
  selectedCell?: boolean;
  children: Node[];
}

export interface TableContent extends Element {
  // type: 'table-content';
  children: Node[];
}

/* 新增table */
export function createTable(columns: number, rows: number): any {
  const rowNodes = [...new Array(rows)].map(() => createRow(columns));

  return {
    type: 'table',
    children: rowNodes,
    data: {},
  };
}

/* 新增一行 */
export function createRow(columns: number): Row {
  const cellNodes = [...new Array(columns)].map(() => createCell());

  return {
    type: 'table-row',
    key: `row_${uuid()}`,
    data: {},
    children: cellNodes,
  };
}

/* 新增一个单元格 */
export function createCell({
  elements,
  colspan,
  rowspan,
  height,
  width,
}: {
  elements?: Node[];
  height?: number;
  width?: number;
  colspan?: number;
  rowspan?: number;
} = {}): Cell {
  const content = createContent(elements);

  return {
    type: 'table-cell',
    key: `cell_${uuid()}`,
    children: [content],
    width: width,
    height: height,
    colspan,
    rowspan,
  };
}

export interface TableContent extends Element {
  type: 'table-content';
  children: Node[];
}

export function createContent(elements?: Node[]): TableContent {
  return {
    type: 'table-content',
    children: elements || [{ type: 'paragraph', children: [{ text: '' }] }],
  };
}
export default withTables;
