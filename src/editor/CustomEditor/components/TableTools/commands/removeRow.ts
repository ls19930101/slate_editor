import { Col, splitedTable } from '../selection';
import { Editor, NodeEntry, Transforms } from 'slate';

import { Cell } from '../../../Plugins/withTables';
import { splitCell } from './splitCell';

export function removeRow(table: NodeEntry, editor: Editor) {
  const { selection } = editor;
  if (!selection || !table) return;

  const { gridTable, getCol } = splitedTable(editor, table);

  const yIndex = table[1].length;

  const [start, end] = Editor.edges(editor, selection);
  const [startNode] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell',
    at: start,
  });

  const [endNode] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell',
    at: end,
  });

  const [startCol] = getCol((col: Col) => col.cell.key === startNode[0].key);
  const [endCol] = getCol((col: Col) => col.cell.key === endNode[0].key);

  const yTop = startCol.path[yIndex];
  const yBottom = endCol.path[yIndex];

  const topLeftCol = gridTable[yTop][0];
  const bottomRight = gridTable[yBottom][gridTable[yBottom].length - 1];

  Transforms.setSelection(editor, {
    anchor: Editor.point(editor, topLeftCol.originPath),
    focus: Editor.point(editor, bottomRight.originPath),
  });

  splitCell(table, editor);

  const { gridTable: splitedGridTable } = splitedTable(editor, table);

  const removeCols = splitedGridTable
    .slice(yTop, yBottom + 1)
    .reduce((p: Col[], c: Col[]) => [...p, ...c], []) as Col[];

  removeCols.map((col: Col) => {
    Transforms.removeNodes(editor, {
      at: table[1],
      match: (n) => n.key === col.cell.key,
    });
  });

  Transforms.removeNodes(editor, {
    at: table[1],
    match: (n) => {
      if (n.type !== 'table-row') {
        return false;
      }

      if (
        n.children &&
        Array.isArray(n.children) &&
        n.children.findIndex((cell: Cell) => cell.type === 'table-cell') < 0
      ) {
        return true;
      }

      return false;
    },
  });

  const { gridTable: removedTable } = splitedTable(editor, table);

  // 若删除前只剩一行,需要删除后清理table,否则会报错tbody的children不可为span
  if (!removedTable.length) {
    const contentAfterRemove = Editor.string(editor, table[1]);

    if (!contentAfterRemove) {
      Transforms.removeNodes(editor, {
        at: table[1],
      });
    }

    return;
  }

  let newSelection = startNode[1];

  if ((yTop || yBottom === gridTable.length - 1) && yTop !== 0) {
    newSelection = removedTable[yTop - 1][startNode[1][2]].originPath;
  }

  Transforms.select(editor, newSelection);
}
