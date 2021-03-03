import * as React from 'react';
import { Icon } from 'antd';
import TaskSvg from '../Svgs/Task';
import { IIconProps } from './interfaces';

const DEFAULT_STYLE = {
  fontSize: '20px',
  color: 'rgb(255, 152, 0)',
};

const TaskIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={TaskSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export default React.memo<IIconProps>(TaskIcon);
