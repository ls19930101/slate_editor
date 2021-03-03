import * as React from 'react';
import { Icon } from 'antd';
import TestSvg from '../Svgs/Test';
import { IIconProps } from './interfaces';

const DEFAULT_STYLE = {
  fontSize: '20px',
  color: 'rgb(169, 131, 241)',
};

const TestIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={TestSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export default React.memo<IIconProps>(TestIcon);
