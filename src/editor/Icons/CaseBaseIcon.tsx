import * as React from 'react';

import { ReactComponent as CaseBaseSvg } from '../../assets/icons/casebase.svg';
import { IIconProps } from './interfaces';
import { Icon } from 'antd';

const DEFAULT_STYLE = {
  fontSize: '20px',
  color: 'rgb(255, 129, 115)',
};

const CaseBaseIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon
    component={CaseBaseSvg}
    style={{ ...DEFAULT_STYLE, ...style }}
    {...rest}
  />
);

export default React.memo<IIconProps>(CaseBaseIcon);
