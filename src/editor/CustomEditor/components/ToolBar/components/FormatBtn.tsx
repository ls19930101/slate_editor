import '../style.less';

import { isFormatActive, toggleFormat } from '../command';

import { IIconProps } from '../';
import React from 'react';
import { Tooltip } from 'antd';
import { useSlate } from 'slate-react';

const FormatBtn = (props: IIconProps) => {
  const { format, icon, title } = props;
  const editor = useSlate();
  return (
    <Tooltip key={format} title={title}>
      <div
        className="iconContainer"
        style={
          isFormatActive(editor, format)
            ? { color: '#1890ff', backgroundColor: '#f7f7f7' }
            : { color: 'black' }
        }
        onMouseDown={event => {
          event.preventDefault();
          toggleFormat(editor, format);
        }}
      >
        {icon}
      </div>
    </Tooltip>
  );
};

export default FormatBtn;
