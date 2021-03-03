import * as React from 'react';

import { IIconProps } from './interfaces';
import { Icon } from 'antd';
import TestCaseSvg from '../Svgs/TestCase';

const DEFAULT_STYLE = {
  fontSize: '20px',
  color: 'rgb(90, 178, 94)',
};

const TestCaseIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={TestCaseSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export default React.memo<IIconProps>(TestCaseIcon);
