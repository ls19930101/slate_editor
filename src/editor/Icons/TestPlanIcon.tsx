import * as React from 'react';

import { IIconProps } from './interfaces';
import { Icon } from 'antd';
import TestPlanSvg from '../Svgs/TestPlan';

const DEFAULT_STYLE = {
  fontSize: '20px',
  color: 'rgb(90, 178, 94)',
};

const TestPlanIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={TestPlanSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export default React.memo<IIconProps>(TestPlanIcon);
