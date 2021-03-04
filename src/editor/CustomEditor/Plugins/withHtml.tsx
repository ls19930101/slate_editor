import { Transforms } from 'slate';

import { ReactEditor } from 'slate-react';
import { createContent } from './withTables';
import { jsx } from 'slate-hyperscript';
import { options } from '../components/TableElement/options';
import { v4 as uuid } from 'uuid';

function urlVoid(href: string) {
  if (!href) return '';
  const voidVal = href
    .replace(/\"/g, '%22')
    .replace(/\#/g, '%23')
    .replace(/\'/g, '%27')
    .replace(/\?/g, '%3F')
    .replace(/\&/g, '%26')
    .replace(/\=/g, '%3D');
  return voidVal;
}

export const ELEMENT_TAGS = {
  A: (el: any) => ({ type: 'link', url: urlVoid(el.getAttribute('href')) }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  H1: () => ({ type: 'heading-one' }),
  H2: () => ({ type: 'heading-two' }),
  H3: () => ({ type: 'heading-three' }),
  IMG: (el: any) => ({ type: 'image', url: el.getAttribute('href') || '' }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  UL: () => ({ type: 'bulleted-list' }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  TABLE: () => ({ type: 'table' }),
  TR: () => ({ type: 'table-row', key: `row_${uuid()}` }),
  TD: (el: any) => ({
    type: 'table-cell',
    key: `cell_${uuid()}`,
    width: Math.max(parseInt(el.style.width) || 0, options.defaultWidth),
    height: Math.max(parseInt(el.style.height) || 0, options.defaultHeight),
  }),
};

export const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strike: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strike: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

export const deserialize = (el: any) => {
  const { nodeName, nodeType } = el;

  if (nodeType === 3) {
    const resText = el.textContent
      .replace(/\n/g, '')
      .replace(/\r\n/g, '')
      .replace(/\s/g, '');
    // console.log(el.textContent.replace(/\n/g, ''));
    return resText;
  } else if (nodeType !== 1) {
    return null;
  } else if (nodeName === 'BR') {
    return '\n';
  }

  let parent = el;

  if (
    nodeName === '' &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === 'CODE'
  ) {
    parent = el.childNodes[0];
  }

  let children: any = Array.from(parent.childNodes)
    .map((i) => deserialize(i))
    .flat();
  // .filter((i) => i !== null);

  if (nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (nodeName === 'TABLE' || nodeName === 'TBODY' || nodeName === 'TR') {
    children = children.filter((i: { type: string }) => i?.type);
  }

  if (nodeName === 'TD') {
    children = children.filter((i: Node[]) => i);

    if (typeof children[0] === 'string') {
      children = createContent([
        { type: 'paragraph', children: [{ text: children[0] }] },
      ]);
    } else {
      children = createContent(
        children.filter((i: { type: string }) => i?.type)
      );
    }
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);

    return jsx('element', attrs, children);
  }

  return children;
};

const withHtml = (editor: ReactEditor) => {
  const { insertData } = editor;

  editor.insertData = (data: DataTransfer) => {
    const htmlString = data.getData('text/html');

    if (htmlString) {
      const parsedDom = new DOMParser().parseFromString(
        htmlString,
        'text/html'
      );

      let fragment = deserialize(parsedDom.body);

      // console.log(fragment, parsedDom.body.nodeName, parsedDom.body);

      Transforms.insertFragment(editor, fragment);

      return;
    }

    return insertData(data);
  };
  return editor;
};

export default withHtml;
