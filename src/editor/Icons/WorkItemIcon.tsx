import * as React from 'react';

import { IIconProps } from './interfaces';
import { Icon } from 'antd';
import { ReactComponent as SchemaSvg } from '../../assets/icons/schema.svg';
import { ReactComponent as TestCaseSvg } from '../../assets/icons/testcase.svg';
import { ReactComponent as TestPlanSvg } from '../../assets/icons/testplan.svg';

const DEFAULT_STYLE = {
  fontSize: '14px',
  color: 'rgba(0,0,0,.85)',
};
const TestCaseIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={TestCaseSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const TestPlanIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={TestPlanSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const SchemaIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={SchemaSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export { TestCaseIcon, TestPlanIcon, SchemaIcon };
