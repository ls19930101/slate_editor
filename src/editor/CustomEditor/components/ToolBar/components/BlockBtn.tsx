import '../style.less';

import { isBlockActive, toggleBlock } from '../command';

import { IIconProps } from '../';

import { Tooltip } from 'antd';
import { useSlate } from 'slate-react';

const BlockBtn = (props: IIconProps) => {
  const { format, icon, title } = props;
  const editor = useSlate();
  return (
    <Tooltip key={format} title={title}>
      <div
        className="iconContainer"
        style={
          isBlockActive(editor, format)
            ? { color: '#1890ff', backgroundColor: '#f7f7f7' }
            : { color: 'black' }
        }
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, format);
        }}
      >
        {icon}
      </div>
    </Tooltip>
  );
};

export default BlockBtn;
