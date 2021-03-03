import * as React from 'react';
import { Icon } from 'antd';
import BugSvg from '../Svgs/Bug';
import { IIconProps } from './interfaces';

const DEFAULT_STYLE = {
  fontSize: '20px',
  color: 'rgb(255, 129, 115)',
};

const BugIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={BugSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export default React.memo<IIconProps>(BugIcon);
