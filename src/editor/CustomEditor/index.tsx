import "./style.less";

import { CellComponent, TableComponent } from "./components/TableElement";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import { Node, createEditor } from "slate";
import React, { memo, useCallback, useMemo, useRef } from "react";

import { Image } from "./components/ImageElement";
import ToolBar from "./components/ToolBar";
import { withHistory } from "slate-history";
import withHtml from "./Plugins/withHtml";
import withImages from "./Plugins/withImages";
import withLayout from "./Plugins/withLayout";
import withLinks from "./Plugins/withLinks";
import withTable from "./Plugins/withTables";

interface IEditorProps {
  value: Node[];
  onChange: (value: Node[]) => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

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

  // Render the Slate context.

  const Element = (props: RenderElementProps) => {
    const { attributes, children, element } = props;
    // console.log(element, attributes, children);

    const firstEle = element.children[0].text;

    const getEle = {
      "block-quote": (
        <blockquote className="quote" {...attributes}>
          {children}
        </blockquote>
      ),
      "bulleted-list": <ul {...attributes}>{children}</ul>,
      subject: (
        <h1 {...attributes} style={{ position: "relative" }}>
          {children}
          {!firstEle && (
            <span className={`placeholder`} contentEditable={false}>
              标题
            </span>
          )}
        </h1>
      ),
      "heading-one": <h1 {...attributes}>{children}</h1>,
      "heading-two": <h2 {...attributes}>{children}</h2>,
      "heading-three": <h3 {...attributes}>{children}</h3>,
      "list-item": <li {...attributes}>{children}</li>,
      "numbered-list": <ol {...attributes}>{children}</ol>,
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
      "table-row": (
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
      "table-cell": (
        <CellComponent
          {...props}
          dataKey={`${element.key}`}
          node={children?.props?.node || []}
        >
          {children}
        </CellComponent>
      ),
      "table-content": (
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

    return getEle[`${element.type ?? "paragraph"}`];
  };

  const Leaf = (props: RenderLeafProps) => {
    let { leaf, attributes, children } = props;
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    if (leaf.strike) {
      children = <s>{children}</s>;
    }

    if (leaf.code) {
      children = <code className="slate-code">{children}</code>;
    }

    return <span {...attributes}>{children}</span>;
  };

  return (
    <div
      className={`customEditor ${readOnly ? "readonly" : null}`}
      ref={editorRef}
    >
      <Slate editor={editor} value={value} onChange={onChange}>
        <ToolBar hold readOnly={readOnly} />
        <ToolBar parentElement={editorRef} readOnly={readOnly} />
        <Editable
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
