import "./style.less";

import { Editor, NodeEntry, Transforms } from "slate";
import { HorizontalToolbar, VerticalToolbar } from "./DragBar";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { RenderElementProps, useEditor, useSelected } from "slate-react";
import {
  addSelection,
  removeSelection,
} from "../../components/TableTools/selection";

import TableTools from "../TableTools";
import { options } from "./options";
import { v4 as uuid } from "uuid";

export const TableComponent: React.FC<RenderElementProps> = memo(
  ({ attributes, children, element }) => {
    const [startKey, setStartKey] = useState<string>("");

    const selected = useSelected();
    const editor = useEditor();
    // let existSelectedCell = false;
    let table: NodeEntry | null = null;
    // console.log(attributes, children, element);

    if (selected && editor.selection) {
      [table] = Editor.nodes(editor, {
        match: (n) => n.type === "table",
        at: Editor.path(editor, editor.selection),
      });

      // if (table) {
      //   const [selectedCell] = Editor.nodes(editor, {
      //     at: Editor.range(editor, table[1]),
      //     match: (n) => !!n.selectedCell,
      //   });

      //   console.log(selectedCell, table);
      //   if (selectedCell) {
      //     existSelectedCell = true;
      //   }
      // }
    }

    let ref = attributes.ref;
    // console.log('table', selected, ref);

    // const resizeTable = useCallback(() => {
    //   if (ref.current) {
    //     ref.current.querySelectorAll('td').forEach((cell) => {
    //       Transforms.setNodes(
    //         editor,
    //         {
    //           width: cell.offsetWidth,
    //           height: cell.offsetHeight,
    //         },
    //         {
    //           at: [],
    //           match: (n) => n.key === cell.dataset.key,
    //         },
    //       );
    //     });
    //   }
    // }, [editor]);

    useEffect(() => {
      if (!selected) {
        removeSelection(editor);
      }
    }, [selected, editor]);
    useEffect(() => {
      if (!element["data-key"]) {
        Transforms.setNodes(
          editor,
          { "data-key": uuid() },
          { match: (n) => n.type === "table" }
        );
      }
    }, []);

    const startNode = useMemo(() => {
      const [node] = Editor.nodes(editor, {
        match: (n) => n.key === startKey,
        at: [],
      });

      return node;
    }, [startKey, editor]);

    const dragMoveFunc = (e: React.MouseEvent) => {
      if (startKey && table) {
        if (!e.target) return;
        const cell = (e.target as HTMLBaseElement).closest("td");

        if (!cell) return;

        let endKey = cell.getAttribute("data-key");
        const [endNode] = Editor.nodes(editor, {
          match: (n) => n.key === endKey,
          at: [],
        });

        addSelection(
          editor,
          table,
          Editor.path(editor, startNode[1]),
          Editor.path(editor, endNode[1])
        );
      }
    };

    const handleMouseDown = useCallback(
      (e) => {
        if (selected) {
          const cell = (e.target as HTMLBaseElement).closest("td");
          const key = cell?.getAttribute("data-key") || "";
          setStartKey(key);
        }
      },
      [selected]
    );

    return (
      <div style={{ position: "relative" }}>
        {selected && table && ref.current && (
          <VerticalToolbar table={ref.current} tableNode={table} />
        )}
        <div className="table-scroll-warpper">
          {selected && ref.current && table && (
            <HorizontalToolbar table={ref.current} tableNode={table} />
          )}
          <table
            {...attributes}
            className="table"
            slate-table-element="table"
            style={options.tableStyle}
            onDragStart={(e) => e.preventDefault()}
            onMouseDown={handleMouseDown}
            onMouseMove={dragMoveFunc}
            onMouseUp={() => {
              setStartKey("");
              // resizeTable();
            }}
            onMouseLeave={() => {
              setStartKey("");
            }}
          >
            <tbody slate-table-element="tbody">{children}</tbody>
          </table>
        </div>
        {
          <TableTools
            className={`table-cardbar ${selected ? "selected" : null} `}
          />
        }
      </div>
    );
  }
);

export const CellComponent: React.FC<
  {
    node: {
      width: number;
      height: number;
      selectedCell?: boolean;
      colspan?: number;
      rowspan?: number;
    };
    dataKey: string;
  } & RenderElementProps
> = memo(({ attributes, node, dataKey, children }) => {
  const { selectedCell } = node;

  return (
    <td
      {...attributes}
      className={`table-td ${selectedCell ? "selectedCell" : null}`}
      slate-table-element="td"
      data-key={dataKey}
      colSpan={node.colspan}
      rowSpan={node.rowspan}
      onDragStart={(e) => e.preventDefault()}
      style={{
        position: "relative",
        width: node.width ? node.width : options.defaultWidth,
        height: node.height ? node.height : options.defaultHeight,
      }}
    >
      {children}
    </td>
  );
});
