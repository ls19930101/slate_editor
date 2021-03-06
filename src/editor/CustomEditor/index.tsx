import './style.less';

import { CellComponent, TableComponent } from './components/TableElement';
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from 'slate-react';
import { Node, NodeEntry, Text, createEditor } from 'slate';
import React, { memo, useCallback, useMemo, useRef } from 'react';

import { Image } from './components/ImageElement';
import Prism from 'prismjs';
import ToolBar from './components/ToolBar';
import { withHistory } from 'slate-history';
import withHtml from './Plugins/withHtml';
import withImages from './Plugins/withImages';
import withLayout from './Plugins/withLayout';
import withLinks from './Plugins/withLinks';
import withTable from './Plugins/withTables';

interface IEditorProps {
  value: Node[];
  onChange: (value: Node[]) => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

// eslint-disable-next-line
Prism.languages.markdown=Prism.languages.extend("markup",{}),Prism.languages.insertBefore("markdown","prolog",{blockquote:{pattern:/^>(?:[\t ]*>)*/m,alias:"punctuation"},code:[{pattern:/^(?: {4}|\t).+/m,alias:"keyword"},{pattern:/``.+?``|`[^`\n]+`/,alias:"keyword"}],title:[{pattern:/\w+.*(?:\r?\n|\r)(?:==+|--+)/,alias:"important",inside:{punctuation:/==+$|--+$/}},{pattern:/(^\s*)#+.+/m,lookbehind:!0,alias:"important",inside:{punctuation:/^#+|#+$/}}],hr:{pattern:/(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,lookbehind:!0,alias:"punctuation"},list:{pattern:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,lookbehind:!0,alias:"punctuation"},"url-reference":{pattern:/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,inside:{variable:{pattern:/^(!?\[)[^\]]+/,lookbehind:!0},string:/(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,punctuation:/^[\[\]!:]|[<>]/},alias:"url"},bold:{pattern:/(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^\*\*|^__|\*\*$|__$/}},italic:{pattern:/(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,lookbehind:!0,inside:{punctuation:/^[*_]|[*_]$/}},url:{pattern:/!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,inside:{variable:{pattern:/(!?\[)[^\]]+(?=\]$)/,lookbehind:!0},string:{pattern:/"(?:\\.|[^"\\])*"(?=\)$)/}}}}),Prism.languages.markdown.bold.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.italic.inside.url=Prism.util.clone(Prism.languages.markdown.url),Prism.languages.markdown.bold.inside.italic=Prism.util.clone(Prism.languages.markdown.italic),Prism.languages.markdown.italic.inside.bold=Prism.util.clone(Prism.languages.markdown.bold); // prettier-ignore

const CustomEditor = (props: IEditorProps): React.ReactElement => {
  const editorRef = useRef<HTMLDivElement>(null);

  const { readOnly, style, value, onChange } = props;

  // useMemo减少重复计算
  const editor = useMemo(
    () =>
      withHistory(
        withHtml(
          withTable(
            withImages(withLinks(withLayout(withReact(createEditor()))))
          )
        )
      ),
    []
  ) as ReactEditor;

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const decorate = useCallback(([node, path]: NodeEntry) => {
    const ranges: any[] = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token: any) => {
      if (typeof token === 'string') {
        return token.length;
      } else if (typeof token.content === 'string') {
        return token.content.length;
      } else {
        return token.content.reduce(
          (l: string, t: string) => l + getLength(t),
          0
        );
      }
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== 'string') {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

  // Render the Slate context.

  const Element = (props: RenderElementProps) => {
    const { attributes, children, element } = props;
    // console.log(element, attributes, children);

    const firstEle = element.children[0].text;

    const getEle = {
      'block-quote': (
        <blockquote className="quote" {...attributes}>
          {children}
        </blockquote>
      ),
      'bulleted-list': <ul {...attributes}>{children}</ul>,
      subject: (
        <h1 {...attributes} style={{ position: 'relative' }}>
          {children}
          {!firstEle && (
            <span className={`placeholder`} contentEditable={false}>
              标题
            </span>
          )}
        </h1>
      ),
      'heading-one': <h1 {...attributes}>{children}</h1>,
      'heading-two': <h2 {...attributes}>{children}</h2>,
      'heading-three': <h3 {...attributes}>{children}</h3>,
      'list-item': <li {...attributes}>{children}</li>,
      'numbered-list': <ol {...attributes}>{children}</ol>,
      link: (
        <a
          {...attributes}
          href={`${element.url}`}
          onClick={(e) => element.url && window.open(`//${element.url}`)}
        >
          {children}
        </a>
      ),
      image: <Image {...props} />,
      table: <TableComponent {...props}>{children}</TableComponent>,
      'table-row': (
        <tr
          {...attributes}
          className="table-tr"
          slate-table-element="tr"
          data-key={element.key}
          onDrag={(e) => e.preventDefault()}
        >
          {children}
        </tr>
      ),
      'table-cell': (
        <CellComponent
          {...props}
          dataKey={`${element.key}`}
          node={children?.props?.node || []}
        >
          {children}
        </CellComponent>
      ),
      'table-content': (
        <div
          {...attributes}
          slate-table-element="content"
          className="table-content"
        >
          {children}
        </div>
      ),
      paragraph: (
        <p className="p" {...attributes}>
          {children}
        </p>
      ),
    };

    return getEle[`${element.type ?? 'paragraph'}`];
  };

  const Leaf = (props: RenderLeafProps) => {
    let { leaf, attributes, children } = props;

    // Prism来支持markdown语法
    let classConf: string = '';

    if (leaf.bold) {
      classConf = 'bold';
      // children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
      classConf = 'italic';
      // children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    if (leaf.strike) {
      children = <s>{children}</s>;
    }

    if (leaf.blockquote) {
      classConf = 'blockquote';
    }

    if (leaf.code) {
      classConf = 'code';
      // children = <code className="slate-code">{children}</code>;
    }
    if (leaf.hr) {
      classConf = 'hr';
    }

    return (
      <span {...attributes} className={classConf}>
        {children}
      </span>
    );
  };

  return (
    <div
      className={`customEditor ${readOnly ? 'readonly' : null}`}
      ref={editorRef}
    >
      <Slate editor={editor} value={value} onChange={onChange}>
        <ToolBar hold readOnly={readOnly} />
        <ToolBar parentElement={editorRef} readOnly={readOnly} />
        <Editable
          decorate={decorate}
          className="editor"
          style={style}
          autoFocus
          readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </div>
  );
};

export default memo(CustomEditor);
