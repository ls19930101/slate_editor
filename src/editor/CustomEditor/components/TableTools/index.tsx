import { Button, Tooltip } from 'antd';
import { Editor, NodeEntry } from 'slate';
import {
  InsertColLeftIcon,
  InsertColRightIcon,
  InsertRowAboveIcon,
  InsertRowBelowIcon,
  RemoveColIcon,
  RemoveRowIcon,
  RemoveTableIcon,
} from '../../../Icons/TableIcon';
import React, { HtmlHTMLAttributes, memo } from 'react';
import {
  insertAbove,
  insertBelow,
  insertLeft,
  insertRight,
  removeCol,
  removeRow,
  removeTable,
} from './commands';
import { useEditor, useReadOnly } from 'slate-react';

interface ITableToolProps extends HtmlHTMLAttributes<HTMLDivElement> {}

const TableTools = (props: ITableToolProps) => {
  // useEditor区别于useSlate, 此处不随editor的值改变而刷新工具栏
  const editor = useEditor();
  const readOnly = useReadOnly();

  const [table] = Editor.nodes(editor, {
    match: (n) => n.type === 'table',
  });

  const run = (action: (table: NodeEntry, editor: Editor) => any) => () => action(table, editor);
  console.log('tabletools');

  const toolConfigs = [
    {
      title: '向上插入行',
      icon: <InsertRowAboveIcon />,
      onMouseDown: insertAbove,
    },
    {
      title: '向下插入行',
      icon: <InsertRowBelowIcon />,
      onMouseDown: insertBelow,
    },
    {
      title: '向左插入列',
      icon: <InsertColLeftIcon />,
      onMouseDown: insertLeft,
    },
    {
      title: '向右插入列',
      icon: <InsertColRightIcon />,
      onMouseDown: insertRight,
    },
    {
      title: '删除整行',
      icon: <RemoveRowIcon />,
      onMouseDown: removeRow,
    },
    {
      title: '删除整列',
      icon: <RemoveColIcon />,
      onMouseDown: removeCol,
    },
    {
      title: '删除列表',
      icon: <RemoveTableIcon />,
      onMouseDown: removeTable,
    },
  ];

  const Tools = toolConfigs.map((i) => (
    <Tooltip key={i.title} title={i.title}>
      <Button
        onMouseDown={(e) => {
          e.preventDefault();
          run(i.onMouseDown)();
        }}
      >
        {i.icon}
      </Button>
    </Tooltip>
  ));

  return (
    /** 此处需要添加contentEditable为false，否则slate无法转换不可编辑div为node报错*/

    <div
      className={props.className}
      contentEditable={false}
      style={readOnly ? { display: 'none' } : null}
    >
      <Button.Group>{Tools}</Button.Group>
    </div>
  );
};

export default memo(TableTools);
