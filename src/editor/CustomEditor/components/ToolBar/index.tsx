import './style.less';

import {
  BoldIcon,
  BulletedlistIcon,
  CodeIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ItalicIcon,
  LinkIcon,
  NumberedlistIcon,
  ParagraphIcon,
  QuoteIcon,
  StrikethroughIcon,
  TableIcon,
  UnderlineIcon,
} from '../../../Icons/ToolIcon';
import { Dropdown, Icon, Menu, Tooltip } from 'antd';
import { Editor, Range } from 'slate';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { isBlockActive, toggleBlock } from './command';

import FormatBtn from './components/FormatBtn';
import { insertLink } from '../../Plugins/withLinks';
import { insertTable } from '../TableTools/commands';

export interface IIconProps {
  format: string;
  icon: React.ReactNode;
  title: string;
}

const MenuItem = Menu.Item;

const markConfigs = [
  {
    format: 'bold',
    icon: <BoldIcon />,
    title: '加粗',
  },
  {
    format: 'italic',
    icon: <ItalicIcon />,
    title: '斜体',
  },
  {
    format: 'underline',
    icon: <UnderlineIcon />,
    title: '下划线',
  },

  {
    format: 'strike',
    icon: <StrikethroughIcon />,
    title: '删除线',
  },

  {
    format: 'code',
    icon: <CodeIcon />,
    title: '行内代码',
  },
];

const dropDownConfig = [
  {
    format: 'paragraph',
    icon: <ParagraphIcon />,
    title: '段落',
  },

  {
    format: 'heading-one',
    icon: <H1Icon />,
    title: '一级标题',
  },
  {
    format: 'heading-two',
    icon: <H2Icon />,
    title: '二级标题',
  },
  {
    format: 'heading-three',
    icon: <H3Icon />,
    title: '三级标题',
  },
  {
    format: 'block-quote',
    icon: <QuoteIcon />,
    title: '引用',
  },
  {
    format: 'bulleted-list',
    icon: <BulletedlistIcon />,
    title: '无序列表',
  },
  {
    format: 'numbered-list',
    icon: <NumberedlistIcon />,
    title: '有序列表',
  },
];

interface IToolBarProps {
  hold?: boolean;
  parentElement?: RefObject<HTMLDivElement>;
  readOnly?: boolean;
}

const ToolBar = (props: IToolBarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState('subject');
  const [showTable, setShowTable] = useState<boolean>(true);
  const editor = useSlate();
  const { hold, parentElement, readOnly } = props;

  useEffect(() => {
    const { selection } = editor;

    /* 获取当前所有的node，并根据node顶级元素修改下拉框激活的block */
    if (!selection) {
      return;
    }

    const [, [curNode]] = Editor.nodes(editor, { at: selection });

    const isCollapsed = Range.isCollapsed(selection);
    const last = Editor.last(editor, selection);

    // 更新表格中当前block的下拉选中状态

    if (curNode.type !== selected) {
      /** 检测当前是点击输入状态，且无range（解决range无单一parent问题，139行报错） */
      if (isCollapsed && selection.anchor.path.length === last[1].length) {
        const tableLast = Editor.parent(editor, selection, {
          depth: last[1].length,
        });
        // 返回paragraph和list-item上一级

        if (tableLast[0].type === 'list-item') {
          const parent = Editor.parent(editor, selection, {
            depth: last[1].length - 1,
          });
          setSelected(`${parent[0].type}`);
        } else {
          setSelected(`${tableLast[0].type || 'paragraph'}`);
        }
      }
    }

    if (!curNode) {
      return;
    }

    if (curNode.type === 'table') {
      setShowTable(false);
    } else if (curNode && !showTable) {
      setShowTable(true);
    }
  }, [editor.selection]);

  useEffect(() => {
    const { selection } = editor;
    if (!selection) return;

    let el = ref.current;

    if (!el) return;

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    if (domSelection) {
      if (!parentElement?.current) return;
      const parentRect = parentElement.current.getBoundingClientRect();
      const { left: parentLeft, top: parentTop } = parentRect;
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();

      el.style.opacity = '1';
      el.style.top = `${rect.top - parentTop + rect.height + 8}px`;
      el.style.left = `${rect.left - parentLeft}px`;
    }
  }, [editor.selection]);

  const withTipMarks = markConfigs.map((i: any) => (
    <FormatBtn key={i.format} {...i} />
  ));

  const moreFunc = showTable && (
    <div
      key={'table'}
      className="iconContainer"
      onMouseDown={(e) => {
        e.preventDefault();
        insertTable(editor);
      }}
    >
      <Tooltip title="表格">
        <TableIcon />
      </Tooltip>
    </div>
  );

  const blockMenu = useCallback(
    () => (
      <Menu selectedKeys={[selected]}>
        {dropDownConfig.map((i) => (
          <MenuItem
            key={i.format}
            onMouseDown={(event) => {
              event.preventDefault();
              setSelected(i.format);
              toggleBlock(editor, i.format);
            }}
          >
            <div>
              {i.icon}
              <span className="iconInfo">{i.title}</span>
            </div>
          </MenuItem>
        ))}
      </Menu>
    ),
    [selected]
  );

  const current = dropDownConfig.find((i) => i.format === selected);

  return !readOnly ? (
    <div ref={ref} className={`toolbar ${hold && 'fixed'}`}>
      {selected === 'subject' ? null : (
        <Dropdown
          overlay={blockMenu}
          trigger={['click']}
          getPopupContainer={(triggerNode) => triggerNode}
        >
          <Tooltip title={current?.title}>
            <div className="withDown" onMouseDown={(e) => e.preventDefault()}>
              <span style={{ fontSize: 'black' }}>{current?.icon}</span>
              <Icon type="down" className="dropDown" />
            </div>
          </Tooltip>
        </Dropdown>
      )}
      <div style={{ width: 1, backgroundColor: '#f0f0f0' }} />
      {withTipMarks}
      <div
        className="iconContainer"
        style={
          isBlockActive(editor, 'link')
            ? { color: '#1890ff', backgroundColor: '#f7f7f7' }
            : { color: 'black' }
        }
        onMouseDown={(e) => {
          e.preventDefault();
          const url = window.prompt('Enter the URL of the link:');
          if (!url) return;
          insertLink(editor, url);
        }}
      >
        <Tooltip title="链接">
          <LinkIcon />
        </Tooltip>
      </div>
      {moreFunc}
    </div>
  ) : null;
};

export default ToolBar;
